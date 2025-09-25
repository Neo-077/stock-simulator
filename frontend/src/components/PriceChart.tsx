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
import { PriceHistory } from '../types';

interface PriceChartProps {
  data: PriceHistory[];
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
    date: new Date(item.date).toLocaleDateString('es-MX', { 
      month: 'short', 
      day: 'numeric' 
    }),
    price: item.price,
    volume: item.volume,
    fullDate: item.date
  }));

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;
  const formatVolume = (value: number) => value.toLocaleString();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-primary-600">
            <span className="font-medium">Precio:</span> {formatPrice(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="text-gray-600">
              <span className="font-medium">Volumen:</span> {formatVolume(payload[1].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Determinar el color del gráfico basado en la tendencia
  const firstPrice = data[0]?.price || 0;
  const lastPrice = data[data.length - 1]?.price || 0;
  const isPositive = lastPrice > firstPrice;
  const lineColor = isPositive ? '#22c55e' : '#ef4444';

  if (type === 'area') {
    return (
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id={`colorGradient-${ticker}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={lineColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
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
            dataKey="date" 
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
