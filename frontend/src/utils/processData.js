import { parse, format } from 'date-fns';

export const processTransactionData = (transactions, initialPortfolio) => {
  // Initialize portfolio summary
  const portfolioSummary = {
    grossValue: initialPortfolio.cash,
    netValue: initialPortfolio.cash,
    absoluteReturn: 0,
    twr: 0,
    mwr: 0,
    incomeReceived: 0,
    totalFees: 0,
    totalTax: 0
  };

  // Initialize tracking arrays and objects
  const portfolioOverTime = [];
  const holdings = { ...initialPortfolio.holdings };
  const breakdownByAssetClass = {};
  const transactionTrends = [];
  const instrumentMetrics = {};
  const latestPrices = {};

  // Initialize calculation variables
  let cashBalance = initialPortfolio.cash;
  let previousValue = initialPortfolio.cash;
  let twrDenominator = 1;
  let cashFlows = [];

  // First pass: collect latest prices for each security
  transactions.forEach((txn) => {
    const { securityCode, price, txnType } = txn;
    if (securityCode && price && (txnType === 'Buy' || txnType === 'Sell')) {
      latestPrices[securityCode] = price;
    }
  });

  // Initialize starting point for portfolio
  portfolioOverTime.push({
    date: format(parse(transactions[0].date, 'dd-MMM-yy', new Date()), 'yyyy-MM-dd'),
    value: cashBalance + Object.entries(holdings).reduce((sum, [code, holding]) =>
      sum + holding.quantity * (latestPrices[code] || holding.avgPrice), 0
    )
  });

  // Process each transaction
  transactions.forEach((txn) => {
    const { date, txnType, instrument, securityCode, quantity, price, amount, tax = 0, brokerage = 0 } = txn;
    const totalFees = tax + brokerage;

    // Update total fees and tax
    portfolioSummary.totalFees += brokerage;
    portfolioSummary.totalTax += tax;

    // Parse date
    const parsedDate = parse(date, 'dd-MMM-yy', new Date());
    const txnDate = format(parsedDate, 'yyyy-MM-dd');

    // Update latest price if available
    if (securityCode && price && (txnType === 'Buy' || txnType === 'Sell')) {
      latestPrices[securityCode] = price;
    }

    // Initialize instrument metrics if not exists
    if (securityCode && !instrumentMetrics[securityCode]) {
      instrumentMetrics[securityCode] = {
        totalBuyValue: 0,
        totalSellValue: 0,
        totalDividends: 0,
        transactions: [],
        highestPrice: 0,
        lowestPrice: price || Infinity,
        lastTradeDate: date,
        totalQuantityBought: 0,
        totalQuantitySold: 0,
        realizedPnL: 0,
        currentPrice: price || 0
      };
    }

    // Handle different transaction types
    switch (txnType) {
      case 'Buy':
        // Initialize holding if not exists
        if (!holdings[securityCode]) {
          holdings[securityCode] = {
            quantity: 0,
            avgPrice: 0,
            investedValue: 0,
            assetClass: instrument,
            firstBuyDate: txnDate,
            totalBuyCount: 0,
            totalSellCount: 0,
            currentPrice: price
          };
        }

        // Update holding details
        const buyHolding = holdings[securityCode];
        const newQuantity = buyHolding.quantity + quantity;
        buyHolding.avgPrice = (buyHolding.quantity * buyHolding.avgPrice + amount) / newQuantity;
        buyHolding.quantity = newQuantity;
        buyHolding.investedValue += amount;
        buyHolding.totalBuyCount++;
        buyHolding.currentPrice = price;

        // Update cash and record flow
        cashBalance -= (amount + totalFees);
        cashFlows.push({
          date: txnDate,
          amount: -(amount + totalFees)
        });

        // Update instrument metrics
        if (instrumentMetrics[securityCode]) {
          instrumentMetrics[securityCode].totalBuyValue += amount;
          instrumentMetrics[securityCode].totalQuantityBought += quantity;
          instrumentMetrics[securityCode].currentPrice = price;
          instrumentMetrics[securityCode].transactions.push({
            date: txnDate,
            type: 'Buy',
            quantity,
            price,
            amount,
            fees: totalFees
          });
          instrumentMetrics[securityCode].highestPrice = Math.max(
            instrumentMetrics[securityCode].highestPrice,
            price
          );
          instrumentMetrics[securityCode].lowestPrice = Math.min(
            instrumentMetrics[securityCode].lowestPrice,
            price
          );
        }
        break;

      case 'Sell':
        const sellHolding = holdings[securityCode];
        if (sellHolding && sellHolding.quantity >= quantity) {
          const proceeds = amount - totalFees;
          const costBasis = sellHolding.avgPrice * quantity;
          const realizedPnL = proceeds - costBasis;

          // Update holding
          cashBalance += proceeds;
          sellHolding.quantity -= quantity;
          sellHolding.investedValue -= costBasis;
          sellHolding.totalSellCount++;
          sellHolding.currentPrice = price;

          // Update instrument metrics
          if (instrumentMetrics[securityCode]) {
            instrumentMetrics[securityCode].totalSellValue += amount;
            instrumentMetrics[securityCode].totalQuantitySold += quantity;
            instrumentMetrics[securityCode].realizedPnL += realizedPnL;
            instrumentMetrics[securityCode].currentPrice = price;
            instrumentMetrics[securityCode].transactions.push({
              date: txnDate,
              type: 'Sell',
              quantity,
              price,
              amount,
              fees: totalFees,
              realizedPnL
            });
          }

          // Record cash flow
          cashFlows.push({
            date: txnDate,
            amount: proceeds
          });

          // Remove holding if quantity is 0
          if (sellHolding.quantity === 0) {
            delete holdings[securityCode];
          }
        }
        break;

      case 'Dividend':
        portfolioSummary.incomeReceived += amount;
        cashBalance += amount;

        if (instrumentMetrics[securityCode]) {
          instrumentMetrics[securityCode].totalDividends += amount;
          instrumentMetrics[securityCode].transactions.push({
            date: txnDate,
            type: 'Dividend',
            amount
          });
        }

        cashFlows.push({
          date: txnDate,
          amount: amount
        });
        break;

      case '5:1 stock split':
        const splitHolding = holdings[securityCode];
        if (splitHolding) {
          splitHolding.quantity *= 5;
          splitHolding.avgPrice /= 5;
          splitHolding.currentPrice = splitHolding.currentPrice / 5;
        }
        break;
    }

    // Calculate current portfolio value using latest prices
    const currentValue = Object.entries(holdings).reduce((total, [code, holding]) =>
      total + (holding.quantity * (latestPrices[code] || holding.currentPrice || holding.avgPrice)), 0
    ) + cashBalance;

    // Update TWR calculation
    if (previousValue > 0) {
      const periodReturn = (currentValue - cashBalance) / previousValue;
      twrDenominator *= (1 + periodReturn);
    }
    previousValue = currentValue;

    // Update asset class breakdown
    Object.values(holdings).forEach(holding => {
      if (!breakdownByAssetClass[holding.assetClass]) {
        breakdownByAssetClass[holding.assetClass] = 0;
      }
      breakdownByAssetClass[holding.assetClass] =
        holding.quantity * (holding.currentPrice || holding.avgPrice);
    });

    // Record portfolio value over time
    portfolioOverTime.push({
      date: txnDate,
      value: currentValue
    });

    // Record transaction trend
    transactionTrends.push({
      date: txnDate,
      type: txnType,
      value: amount,
      fees: totalFees
    });
  });

  // Calculate final metrics for holdings
  Object.keys(holdings).forEach(securityCode => {
    const holding = holdings[securityCode];
    const metrics = instrumentMetrics[securityCode];

    if (metrics) {
      const currentPrice = latestPrices[securityCode] || holding.currentPrice || holding.avgPrice;
      const marketValue = holding.quantity * currentPrice;
      const unrealizedPnL = marketValue - holding.investedValue;

      holding.metrics = {
        marketValue,
        currentPrice,
        unrealizedPnL,
        totalPnL: metrics.realizedPnL + unrealizedPnL,
        performance: holding.investedValue > 0
          ? ((marketValue / holding.investedValue - 1) * 100).toFixed(2)
          : 0,
        dividendYield: ((metrics.totalDividends / holding.investedValue) * 100).toFixed(2),
        turnoverRatio: ((metrics.totalBuyValue + metrics.totalSellValue) / marketValue).toFixed(2),
        highestPrice: metrics.highestPrice,
        lowestPrice: metrics.lowestPrice,
        lastTradeDate: metrics.lastTradeDate,
        realizedPnL: metrics.realizedPnL,
        totalBuyValue: metrics.totalBuyValue,
        totalSellValue: metrics.totalSellValue,
        totalDividends: metrics.totalDividends,
        transactionHistory: metrics.transactions
      };
    }
  });

  // Calculate final portfolio summary using latest prices
  portfolioSummary.grossValue = Object.entries(holdings).reduce(
    (total, [code, holding]) => 
      total + holding.quantity * (latestPrices[code] || holding.currentPrice || holding.avgPrice),
    cashBalance
  );
  portfolioSummary.netValue = portfolioSummary.grossValue - portfolioSummary.totalFees - portfolioSummary.totalTax;
  portfolioSummary.absoluteReturn = portfolioSummary.netValue - initialPortfolio.cash;
  portfolioSummary.twr = ((twrDenominator - 1) * 100).toFixed(2);
  portfolioSummary.mwr = calculateIRR(cashFlows, portfolioSummary.netValue);

  return {
    portfolioSummary,
    portfolioOverTime,
    breakdownByAssetClass,
    transactionTrends,
    holdings,
    instrumentMetrics
  };
};

// Helper function to calculate Internal Rate of Return (MWR)
function calculateIRR(cashFlows, finalValue, guess = 0.1) {
  const maxIterations = 100;
  const tolerance = 0.000001;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = -finalValue;
    let derivativeNpv = 0;

    cashFlows.forEach(cf => {
      const timeDiff = (new Date(cf.date) - new Date(cashFlows[0].date)) / (365 * 24 * 60 * 60 * 1000);
      const discountFactor = Math.pow(1 + rate, timeDiff);
      npv += cf.amount / discountFactor;
      derivativeNpv -= timeDiff * cf.amount / (discountFactor * (1 + rate));
    });

    if (Math.abs(npv) < tolerance) {
      return (rate * 100).toFixed(2);
    }

    rate = rate - npv / derivativeNpv;
  }

  return 0;
}