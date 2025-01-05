import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';

export default function PortfolioOverTime({ data }) {
  // Calculate the maximum value to set proper domain
  const maxValue = Math.max(...data.map(item => item.value));
  // Add 20% padding to the top
  const yAxisMax = maxValue * 1.2;

  // Calculate ticks for the Y-axis
  const tickCount = 5; // Number of ticks you want on the Y-axis
  const tickStep = yAxisMax / tickCount; // Calculate the interval
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => Math.round(i * tickStep));

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Portfolio Value Over Time</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data}
            margin={{ top: 20, right: 30, left: 35, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
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
              domain={[0, yAxisMax]}
              ticks={yTicks} // Use calculated ticks
              tickFormatter={value => `$${formatCurrency(value)}`}
              tick={{ fontSize: 12 }}
              width={60}
              allowDataOverflow={false}
            />
            <Tooltip 
              formatter={value => [`$${formatCurrency(value)}`, 'Portfolio Value']}
              labelFormatter={date => new Date(date).toLocaleDateString('en-US', { 
                month: 'long',
                year: 'numeric',
                day: 'numeric'
              })}
            />
            <Area 
              type="monotone" 
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#colorValue)"
              fillOpacity={1}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
