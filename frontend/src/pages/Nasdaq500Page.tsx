import React, { useEffect } from 'react';
import { useStockStore } from '../store/stockStore';
import LoadingSpinner from '../components/LoadingSpinner';
import PriceCard from '../components/PriceCard';

const Nasdaq500Page: React.FC = () => {
  const { marketData, isLoading, error, trend, range, setTrend, setRange, fetchAll } = useStockStore();

  useEffect(() => {
    if (!marketData) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && !marketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error && !marketData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!marketData) return null;

  const list = marketData.bny.filter(s => {
    if (trend === 'all') return true;
    if (trend === 'up') return s.changePct > 0;
    return s.changePct < 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">NYSE / NASDAQ (BNY)</h1>
        <p className="text-gray-600">10 acciones principales del mercado estadounidense</p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Range Filters */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Período:</span>
            {(['1D', '1W', '1M'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${range === r
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {r === '1D' ? 'Día' : r === '1W' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>

          {/* Trend Filters */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Filtro:</span>
            <button
              onClick={() => setTrend('up')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${trend === 'up'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              📈 En Alza
            </button>
            <button
              onClick={() => setTrend('down')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${trend === 'down'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              📉 En Baja
            </button>
            <button
              onClick={() => setTrend('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${trend === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              📊 Todas
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
          <span className="font-medium text-gray-900">
            Total: <span className="text-indigo-600">{marketData.bny.length}</span>
          </span>
          <span className="font-medium text-gray-900">
            En alza: <span className="text-green-600">{marketData.bny.filter(s => s.changePct > 0).length}</span>
          </span>
          <span className="font-medium text-gray-900">
            En baja: <span className="text-red-600">{marketData.bny.filter(s => s.changePct < 0).length}</span>
          </span>
          <span className="font-medium text-gray-900">
            Mostrando: <span className="text-indigo-600">{list.length}</span>
          </span>
        </div>
      </div>

      {/* Stock Cards */}
      {list.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay acciones que coincidan con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map(s => (
            <PriceCard
              key={s.ticker}
              item={{
                name: s.name,
                ticker: s.ticker,
                price: s.last,
                changePct: s.changePct,
              }}
              type="stock"
              linkTo={`/stock/${s.ticker}`}
            />
          ))}
        </div>
      )}

      {/* Info Banner */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>ℹ️ Nota:</strong> Los datos mostrados son ficticios y se generan automáticamente para fines educativos.
      </div>
    </div>
  );
};

export default Nasdaq500Page;