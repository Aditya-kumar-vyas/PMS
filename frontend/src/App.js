import React from "react";
import useFetch from "./hooks/useFetch";
import { processTransactionData } from "./utils/processData";
import PortfolioSummary from "./components/PortfolioSummary";
import PortfolioOverTime from "./components/PortfolioOverTime";
import BreakdownByCountry from "./components/BreakdownByCountry";
import BreakdownByAssetClass from "./components/BreakdownByAssetClass";
import TransactionTrends from "./components/TransactionTrends";
import Header from "./components/Header";

const App = () => {
  const { data: transactions, loading, error } = useFetch("http://localhost:8000/api/transactions");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const {
    portfolioSummary,
    portfolioOverTime,
    breakdownByCountry,
    breakdownByAssetClass,
    transactionTrends,
  } = processTransactionData(transactions, {
    cash: 152674,
    holdings: {
      HDFCBANK: { quantity: 25, avgPrice: 1345.7 },
      HINDUNILVR: { quantity: 18, avgPrice: 1743.5 },
      ADANIGREEN: { quantity: 27, avgPrice: 1894.5 },
      SHRIRAMFIN: { quantity: 8, avgPrice: 9540 },
    },
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <PortfolioSummary data={portfolioSummary} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <PortfolioOverTime data={portfolioOverTime} />
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
