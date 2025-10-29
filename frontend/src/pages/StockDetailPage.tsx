import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStockStore } from '../store/stockStore';
import { Stock } from '../types';
import PriceChart from '../components/PriceChart';
import LoadingSpinner from '../components/LoadingSpinner';

type TimeRange = 'day' | 'week' | 'month';
type MarketType = 'all' | 'bmv' | 'bny';
type PriceChange = 'all' | 'up' | 'down';

const formatPrice = (price: number) => price.toFixed(2);

const formatVariation = (variation: number) => {
  const sign = variation > 0 ? '+' : '';
  return `${sign}${variation.toFixed(2)}%`;
};

const formatMarketCap = (marketCap: number) => {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return `$${marketCap.toLocaleString()}`;
};

const StockDetailPage: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();
  const { selectedStock, isLoading, error, fetchStockByTicker } = useStockStore();
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [market, setMarket] = useState<MarketType>('all');
  const [priceChange, setPriceChange] = useState<PriceChange>('all');

  useEffect(() => {
    if (ticker) {
      fetchStockByTicker(ticker);
    }
  }, [ticker, fetchStockByTicker]);

  const getVariationClass = (variation: number) => {
    if (variation > 0) return 'text-green-600';
    if (variation < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getVariationIcon = (variation: number) => {
    if (variation > 0) return '📈';
    if (variation < 0) return '📉';
    return '➡️';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !selectedStock) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error al cargar acción</div>
          <p className="text-gray-600 mb-4">{error || 'Acción no encontrada'}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Volver
            </button>
            <button
              onClick={() => ticker && fetchStockByTicker(ticker)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderMarketData = (stock: Stock) => (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">Apertura:</span>
        <span className="font-medium">${formatPrice(stock.openingPrice)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Máximo:</span>
        <span className="font-medium">${formatPrice(stock.dayHigh)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Mínimo:</span>
        <span className="font-medium">${formatPrice(stock.dayLow)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Cierre Anterior:</span>
        <span className="font-medium">${formatPrice(stock.closingPrice)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Volumen:</span>
        <span className="font-medium">{stock.volume.toLocaleString()}</span>
      </div>
    </div>
  );

  const renderFinancialData = (stock: Stock) => (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">Capitalización:</span>
        <span className="font-medium">{formatMarketCap(stock.marketCap)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">P/E Ratio:</span>
        <span className="font-medium">{stock.peRatio}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Dividend Yield:</span>
        <span className="font-medium">{stock.dividendYield}%</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la lista
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="text-4xl">{getVariationIcon(selectedStock.variation)}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedStock.ticker}
                </h1>
                <p className="text-gray-600">{selectedStock.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  ${formatPrice(selectedStock.currentPrice)}
                </div>
                <div className={`text-lg font-medium ${getVariationClass(selectedStock.variation)}`}>
                  {formatVariation(selectedStock.variation)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Market Filter */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm">
              <span className="text-sm font-medium text-gray-700">Mercado:</span>
              <button
                onClick={() => setMarket('all')}
                className={`px-3 py-1 rounded-md text-sm ${
                  market === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setMarket('bmv')}
                className={`px-3 py-1 rounded-md text-sm ${
                  market === 'bmv' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                }`}
              >
                BMV
              </button>
              <button
                onClick={() => setMarket('bny')}
                className={`px-3 py-1 rounded-md text-sm ${
                  market === 'bny' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                }`}
              >
                BNY
              </button>
            </div>

            {/* Price Change Filter */}
            <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm">
              <span className="text-sm font-medium text-gray-700">Precio:</span>
              <button
                onClick={() => setPriceChange('all')}
                className={`px-3 py-1 rounded-md text-sm ${
                  priceChange === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setPriceChange('up')}
                className={`px-3 py-1 rounded-md text-sm ${
                  priceChange === 'up' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                }`}
              >
                Alza
              </button>
              <button
                onClick={() => setPriceChange('down')}
                className={`px-3 py-1 rounded-md text-sm ${
                  priceChange === 'down' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
                }`}
              >
                Baja
              </button>
            </div>

            {/* Time Range Filter */}
            <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm">
              <span className="text-sm font-medium text-gray-700">Rango:</span>
              {(['day', 'week', 'month'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeRange === range 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range === 'day' ? 'Día' : range === 'week' ? 'Semana' : 'Mes'}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex justify-end">
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 rounded-md text-sm ${
                  chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Línea
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1 rounded-md text-sm ${
                  chartType === 'area' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Área
              </button>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <PriceChart
            data={selectedStock.history}
            ticker={selectedStock.ticker}
            type={chartType}
          />
        </div>

        {/* Stock Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Market Data */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Datos de Mercado</h2>
            {renderMarketData(selectedStock)}
          </div>

          {/* Financial Data */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Datos Financieros</h2>
            {renderFinancialData(selectedStock)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailPage;