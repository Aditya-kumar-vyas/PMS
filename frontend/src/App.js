// src/App.js
import React from "react";
import useFetch from "./hooks/useFetch";
import { processTransactionData } from "./utils/processData";
import PortfolioSummary from "./components/PortfolioSummary";
import PortfolioOverTime from "./components/PortfolioOverTime";
import BreakdownByAssetClass from "./components/BreakdownByAssetClass";
import TransactionTrends from "./components/TransactionTrends";
import PortfolioInstruments from "./components/PortfolioInstruments";
import Header from "./components/Header";

const App = () => {
  const { data: transactions, loading, error } = useFetch("http://localhost:8000/api/transactions");

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500 bg-red-100 p-4 rounded-lg">
        Error loading data: {error.message}
      </div>
    </div>
  );

  // Initial portfolio with proper asset class mapping
  const initialPortfolio = {
    cash: 152674,
    holdings: {
      HDFCBANK: { 
        quantity: 25, 
        avgPrice: 1345.7,
        assetClass: "Banking",
        investedValue: 1345.7 * 25  // Added invested value
      },
      HINDUNILVR: { 
        quantity: 18, 
        avgPrice: 1743.5,
        assetClass: "FMCG",
        investedValue: 1743.5 * 18
      },
      ADANIGREEN: { 
        quantity: 27, 
        avgPrice: 1894.5,
        assetClass: "Energy",
        investedValue: 1894.5 * 27
      },
      SHRIRAMFIN: { 
        quantity: 8, 
        avgPrice: 9540,
        assetClass: "Financial Services",
        investedValue: 9540 * 8
      }
    }
  };

  const {
    portfolioSummary,
    portfolioOverTime,
    breakdownByAssetClass,
    transactionTrends,
    holdings
  } = processTransactionData(transactions || [], initialPortfolio);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        {/* Portfolio Summary Section */}
        <div className="mb-6">
          <PortfolioSummary data={portfolioSummary} />
        </div>

        {/* Portfolio Instruments Section */}
        <div className="mb-6">
          <PortfolioInstruments holdings={holdings} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="space-y-6">
              <PortfolioOverTime data={portfolioOverTime} />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <BreakdownByAssetClass data={breakdownByAssetClass} />
            <TransactionTrends data={transactionTrends} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;