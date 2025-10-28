import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { SeriesPoint } from '../types';

interface PriceChartProps {
  data: SeriesPoint[];
  ticker: string;
  type?: 'line' | 'area';
}

const PriceChart: React.FC<PriceChartProps> = ({
  data,
  ticker,
  type = 'line'
}) => {
  // Formatear los datos para el gráfico
  const chartData = data.map(item => ({
    time: item.t,
    price: item.c,
  }));

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-900 font-medium">
            Precio: {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Determinar el color del gráfico basado en la tendencia
  const firstPrice = data[0]?.c || 0;
  const lastPrice = data[data.length - 1]?.c || 0;
  const isPositive = lastPrice > firstPrice;
  const lineColor = isPositive ? '#22c55e' : '#ef4444';

  if (type === 'area') {
    return (
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id={`colorGradient-${ticker}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatPrice}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#colorGradient-${ticker})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={formatPrice}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ fill: lineColor, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: lineColor, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;