// src/components/PortfolioSummary.js
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function PortfolioSummary({ data }) {
  const { grossValue, netValue, absoluteReturn, twr, mwr, incomeReceived } = data;

  const MetricCard = ({ title, value, isPercentage, isNegativeRed }) => {
    const formattedValue = isPercentage ? `${value}%` : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const isNegative = parseFloat(value) < 0;
    const textColor = isNegativeRed && isNegative ? 'text-red-500' : 'text-green-500';

    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{title}</p>
          {isNegativeRed && (
            isNegative ? 
              <ArrowDownRight className="w-4 h-4 text-red-500" /> : 
              <ArrowUpRight className="w-4 h-4 text-green-500" />
          )}
        </div>
        <p className={`text-xl font-bold mt-2 ${isNegativeRed ? textColor : 'text-gray-900'}`}>
          {formattedValue}
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <MetricCard title="Gross Value" value={ formatCurrency(grossValue)} isNegativeRed />
      <MetricCard title="Net Value" value={formatCurrency(netValue) } isNegativeRed />
      <MetricCard title="Absolute Return" value={formatCurrency(absoluteReturn) } isNegativeRed />
      <MetricCard title="TWR" value={twr} isPercentage isNegativeRed />
      <MetricCard title="MWR" value={mwr} isPercentage isNegativeRed />
      <MetricCard title="Income Received" value={formatCurrency(incomeReceived) } />
    </div>
  );
}
