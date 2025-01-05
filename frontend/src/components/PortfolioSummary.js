import React from "react";

const PortfolioSummary = ({ data }) => {
  const { grossValue, netValue, absoluteReturn, incomeReceived } = data;

  return (
    <div className="bg-white p-6 shadow-lg rounded-md">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Portfolio Summary</h2>
      <div className="flex space-x-8">
        {/* Gross Value */}
        <div className="text-center">
          <p className="text-sm text-gray-600">Gross Value</p>
          <h3 className="text-xl font-semibold text-accent">
            ${grossValue.toFixed(2)}
          </h3>
        </div>

        {/* Net Value */}
        <div className="text-center">
          <p className="text-sm text-gray-600">Net Value</p>
          <h3
            className={`text-xl font-semibold ${
              netValue >= 0 ? "text-accent" : "text-red-600"
            }`}
          >
            ${netValue.toFixed(2)}
          </h3>
        </div>

        {/* Absolute Return */}
        <div className="text-center">
          <p className="text-sm text-gray-600">Absolute Return</p>
          <h3
            className={`text-xl font-semibold ${
              absoluteReturn >= 0 ? "text-accent" : "text-red-600"
            }`}
          >
            ${absoluteReturn.toFixed(2)}
          </h3>
        </div>

        {/* Income Received */}
        <div className="text-center">
          <p className="text-sm text-gray-600">Income Received</p>
          <h3 className="text-xl font-semibold text-accent">
            ${incomeReceived.toFixed(2)}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
