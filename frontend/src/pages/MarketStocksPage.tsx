import React, { useEffect } from 'react';
import { useStockStore } from '../store/stockStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { Stock } from '../types';

const MarketStocksPage: React.FC = () => {
  const marketData = useStockStore((s) => s.marketData);
  const isLoading = useStockStore((s) => s.isLoading);
  const error = useStockStore((s) => s.error);
  const fetchAll = useStockStore((s) => s.fetchAll);
  const market = useStockStore((s) => s.market);

  useEffect(() => {
    if (!marketData) void fetchAll();
  }, [marketData, fetchAll]);

  if (isLoading && !marketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error && !marketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error al cargar datos</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchAll} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!marketData) return null;

  const marketStocks: Stock[] = market === 'BNY' ? marketData.bny : marketData.bmv;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-3xl">📊</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Acciones del Mercado {market}
            </h1>
            <p className="text-gray-600">
              Principales acciones según capitalización
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Los datos mostrados son ficticios y se generan automáticamente para fines educativos.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {marketStocks.length}
          </div>
          <div className="text-gray-600">Acciones</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {marketStocks.filter((s) => s.changePct > 0).length}
          </div>
          <div className="text-gray-600">En Alza</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">
            {marketStocks.filter((s) => s.changePct < 0).length}
          </div>
          <div className="text-gray-600">En Baja</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {market === 'BMV' ? '🇲🇽' : '🇺🇸'}
          </div>
          <div className="text-gray-600">Mercado</div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticker</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cambio %</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marketStocks.map((stock, index) => (
              <tr key={stock.ticker} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {stock.ticker}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stock.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  ${stock.last.toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${stock.changePct > 0 ? 'text-green-600' : stock.changePct < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                  {stock.changePct > 0 ? '+' : ''}{stock.changePct.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketStocksPage;