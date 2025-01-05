export const processTransactionData = (transactions, initialPortfolio) => {
    const portfolioSummary = {
      grossValue: initialPortfolio.cash,
      netValue: initialPortfolio.cash,
      absoluteReturn: 0,
      twr: 0, // Time-Weighted Return
      mwr: 0, // Money-Weighted Return
      incomeReceived: 0,
    };
  
    const portfolioOverTime = [];
    const holdings = { ...initialPortfolio.holdings };
    const breakdownByCountry = {};
    const breakdownByAssetClass = {};
    const transactionTrends = [];
  
    let cashBalance = initialPortfolio.cash;
  
    transactions.forEach((txn) => {
      const { date, txnType, instrument, securityCode, quantity, price, amount, tax = 0, brokerage = 0 } = txn;
      const totalFees = tax + brokerage;
      const month = new Date(date).toLocaleString("default", { month: "short", year: "numeric" });
  
      if (txnType === "Buy") {
        if (!holdings[securityCode]) {
          holdings[securityCode] = { quantity: 0, avgPrice: 0, investedValue: 0 };
        }
        const current = holdings[securityCode];
        const newQuantity = current.quantity + quantity;
        current.avgPrice = (current.quantity * current.avgPrice + amount) / newQuantity;
        current.quantity = newQuantity;
        current.investedValue += amount;
        cashBalance -= amount + totalFees;
      }
  
      if (txnType === "Sell") {
        const current = holdings[securityCode];
        if (current.quantity >= quantity) {
          const proceeds = amount - totalFees;
          cashBalance += proceeds;
          current.quantity -= quantity;
          current.investedValue -= current.avgPrice * quantity;
  
          if (current.quantity === 0) {
            delete holdings[securityCode];
          }
        }
      }
  
      if (txnType === "Dividend") {
        portfolioSummary.incomeReceived += amount;
        cashBalance += amount;
      }
  
      if (txnType === "5:1 stock split") {
        const current = holdings[securityCode];
        if (current) {
          current.quantity *= 5;
          current.avgPrice /= 5;
        }
      }
  
      // Update portfolio gross value and aggregate breakdowns
      portfolioSummary.grossValue = Object.keys(holdings).reduce((total, key) => {
        const holding = holdings[key];
        return total + holding.quantity * holding.avgPrice;
      }, cashBalance);
  
      breakdownByCountry["India"] = (breakdownByCountry["India"] || 0) + amount;
      breakdownByAssetClass[instrument] = (breakdownByAssetClass[instrument] || 0) + amount;
    //   transactionTrends[month] = (transactionTrends[month] || 0) + amount;
      transactionTrends.push({ date: month, value: amount });

      portfolioOverTime.push({ date, value: portfolioSummary.grossValue });
    });
  
    // Calculate net value
    portfolioSummary.netValue = cashBalance + portfolioSummary.grossValue;
  
    // Absolute Return = Net Value - Initial Cash Investment
    portfolioSummary.absoluteReturn = portfolioSummary.netValue - initialPortfolio.cash;
  
    return {
      portfolioSummary,
      portfolioOverTime,
      breakdownByCountry,
      breakdownByAssetClass,
      transactionTrends,
      holdings,
    };
  };
  