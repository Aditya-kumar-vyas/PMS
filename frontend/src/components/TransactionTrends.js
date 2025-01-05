// components/TransactionTrends.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';

export default function TransactionTrends({ data }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 15, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tickFormatter={date => {
                const d = new Date(date);
                return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
              }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={value => `$${formatCurrency(value)}`}
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip
              formatter={value => [`$${formatCurrency(value)}`, 'Amount']}
              labelFormatter={date => new Date(date).toLocaleDateString('en-US', { 
                month: 'long',
                year: 'numeric',
                day: 'numeric'
              })}
            />
            <Bar dataKey="value" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}