import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStockStore } from '../store/stockStore';
import PriceChart from '../components/PriceChart';
import LoadingSpinner from '../components/LoadingSpinner';

const StockDetailPage: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();
  const { selectedStock, isLoading, error, fetchStockByTicker } = useStockStore();
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  useEffect(() => {
    if (ticker) {
      fetchStockByTicker(ticker);
    }
  }, [ticker, fetchStockByTicker]);

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
          <div className="text-danger-600 text-xl mb-4">⚠️ Error al cargar acción</div>
          <p className="text-gray-600 mb-4">{error || 'Acción no encontrada'}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Volver
            </button>
            <button
              onClick={() => ticker && fetchStockByTicker(ticker)}
              className="btn-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  const getVariationClass = () => {
    if (selectedStock.variation > 0) return 'price-positive';
    if (selectedStock.variation < 0) return 'price-negative';
    return 'price-neutral';
  };

  const getVariationIcon = () => {
    if (selectedStock.variation > 0) return '📈';
    if (selectedStock.variation < 0) return '📉';
    return '➡️';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="text-4xl">{getVariationIcon()}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedStock.ticker}
              </h1>
              <p className="text-gray-600 text-lg">
                {selectedStock.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                ${formatPrice(selectedStock.currentPrice)}
              </div>
              <div className={`text-lg font-medium ${getVariationClass()}`}>
                {formatVariation(selectedStock.variation)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            ${formatPrice(selectedStock.openingPrice)}
          </div>
          <div className="text-gray-600">Precio de Apertura</div>
        </div>

        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            ${formatPrice(selectedStock.dayHigh)}
          </div>
          <div className="text-gray-600">Máximo del Día</div>
        </div>

        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            ${formatPrice(selectedStock.dayLow)}
          </div>
          <div className="text-gray-600">Mínimo del Día</div>
        </div>

        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {selectedStock.volume.toLocaleString()}
          </div>
          <div className="text-gray-600">Volumen</div>
        </div>
      </div>

      {/* Gráfico de precios */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Evolución de Precios (30 días)
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === 'area'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Área
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === 'line'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Línea
            </button>
          </div>
        </div>
        
        <PriceChart
          data={selectedStock.history}
          ticker={selectedStock.ticker}
          type={chartType}
        />
      </div>

      {/* Información detallada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Métricas financieras */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Métricas Financieras
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Capitalización de Mercado</span>
              <span className="font-medium text-gray-900">
                {formatMarketCap(selectedStock.marketCap)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">P/E Ratio</span>
              <span className="font-medium text-gray-900">
                {selectedStock.peRatio}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Dividend Yield</span>
              <span className="font-medium text-gray-900">
                {selectedStock.dividendYield}%
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Precio de Cierre</span>
              <span className="font-medium text-gray-900">
                ${formatPrice(selectedStock.closingPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Estadísticas del día */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Estadísticas del Día
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Rango del Día</span>
              <span className="font-medium text-gray-900">
                ${formatPrice(selectedStock.dayLow)} - ${formatPrice(selectedStock.dayHigh)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Volumen Promedio</span>
              <span className="font-medium text-gray-900">
                {(selectedStock.volume / 1.2).toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Cambio Absoluto</span>
              <span className={`font-medium ${getVariationClass()}`}>
                ${formatPrice(selectedStock.currentPrice - selectedStock.openingPrice)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Volatilidad</span>
              <span className="font-medium text-gray-900">
                {((selectedStock.dayHigh - selectedStock.dayLow) / selectedStock.currentPrice * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Información Importante
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Los datos mostrados son completamente ficticios y se generan automáticamente para fines educativos. 
                Esta información no debe utilizarse para tomar decisiones de inversión reales. 
                Para información financiera real, consulte fuentes oficiales y profesionales certificados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailPage;
