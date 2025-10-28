import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStockStore } from '../store/stockStore';
import PriceChart from '../components/PriceChart';
import LoadingSpinner from '../components/LoadingSpinner';

const StockDetailPage: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();
  const { selected, isLoading, error, loadStock } = useStockStore();
  const range = useStockStore((s) => s.range);

  useEffect(() => {
    if (ticker) {
      loadStock(ticker);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !selected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error al cargar acción</div>
          <p className="text-gray-600 mb-4">{error || 'Acción no encontrada'}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Volver
            </button>
            <button
              onClick={() => ticker && loadStock(ticker)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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

  const getVariationClass = () => {
    if (selected.changePct > 0) return 'text-green-600';
    if (selected.changePct < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getVariationIcon = () => {
    if (selected.changePct > 0) return '📈';
    if (selected.changePct < 0) return '📉';
    return '➡️';
  };

  const series = selected.series[range] || [];

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
                {selected.ticker}
              </h1>
              <p className="text-gray-600 text-lg">
                {selected.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                ${formatPrice(selected.last)}
              </div>
              <div className={`text-lg font-medium ${getVariationClass()}`}>
                {formatVariation(selected.changePct)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {selected.market}
          </div>
          <div className="text-gray-600">Mercado</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {selected.ticker}
          </div>
          <div className="text-gray-600">Símbolo</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {range}
          </div>
          <div className="text-gray-600">Período</div>
        </div>
      </div>

      {/* Chart */}
      {series.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Evolución de Precios ({range})
          </h2>
          <PriceChart
            data={series.map((s, i) => ({ ...s, t: i }))}
            ticker={selected.ticker}
            type="area"
          />
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
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
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailPage;