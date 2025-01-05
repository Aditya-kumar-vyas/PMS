import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PortfolioInstruments = ({ holdings }) => {
    // Calculate performance metrics for each holding
    const instrumentsAnalysis = Object.entries(holdings).map(([securityCode, holding]) => {
        const currentPrice = holding.currentPrice || holding.avgPrice;
        const marketValue = holding.quantity * currentPrice;
        const investedValue = holding.investedValue;
        const performance = holding.metrics ? holding.metrics.performance : "0.00";

        return {
            securityCode,
            name: holding.assetClass,
            quantity: holding.quantity,
            avgPrice: holding.avgPrice.toFixed(2),
            currentPrice: currentPrice.toFixed(2),
            currentValue: marketValue.toFixed(2),
            investedValue: investedValue.toFixed(2),
            profitLoss: (marketValue - investedValue).toFixed(2),
            performance: parseFloat(performance),
        };
    }).filter(item => item.investedValue > 0);

    return (
        <div className="space-y-6">
            {/* Instruments Analysis Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Instruments Analysis</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="p-2 text-left text-sm font-semibold text-gray-600">Security Code</th>
                                <th className="p-2 text-left text-sm font-semibold text-gray-600">Name</th>
                                <th className="p-2 text-right text-sm font-semibold text-gray-600">Quantity</th>
                                <th className="p-2 text-right text-sm font-semibold text-gray-600">Avg Price</th>
                                <th className="p-2 text-right text-sm font-semibold text-gray-600">Current Price</th>
                                <th className="p-2 text-right text-sm font-semibold text-gray-600">Invested Value</th>
                                <th className="p-2 text-right text-sm font-semibold text-gray-600">Current Value</th>
                                <th className="p-2 text-right text-sm font-semibold text-gray-600">P/L</th>
                                <th className="p-2 text-right text-sm font-semibold text-gray-600">Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instrumentsAnalysis.map((item) => (
                                <tr key={item.securityCode} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-2 text-sm">{item.securityCode}</td>
                                    <td className="p-2 text-sm">{item.name}</td>
                                    <td className="p-2 text-sm text-right">{item.quantity}</td>
                                    <td className="p-2 text-sm text-right">₹{item.avgPrice}</td>
                                    <td className="p-2 text-sm text-right">₹{item.currentPrice}</td>
                                    <td className="p-2 text-sm text-right">₹{item.investedValue}</td>
                                    <td className="p-2 text-sm text-right">₹{item.currentValue}</td>
                                    <td className="p-2 text-sm text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {parseFloat(item.profitLoss) >= 0 ? (
                                                <TrendingUp className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-red-500" />
                                            )}
                                            ₹{Math.abs(item.profitLoss)}
                                        </div>
                                    </td>
                                    <td className="p-2 text-sm text-right">
                                        <span className={parseFloat(item.performance) >= 0 ? 'text-green-500' : 'text-red-500'}>
                                            {item.performance}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Performance Chart Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Performance Visualization</h2>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={instrumentsAnalysis}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="securityCode"
                                padding={{ left: 10, right: 10 }}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip
                                formatter={(value, name) => {
                                    if (name === "Performance") return [`${value}%`, name];
                                    return [`₹${value}`, name];
                                }}
                                labelFormatter={(label) => `Security: ${label}`}
                            />
                            <Legend />
                            <Bar
                                dataKey="performance"
                                name="Performance"
                                fill="#8884d8"
                                radius={[4, 4, 0, 0]}
                            >
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PortfolioInstruments;