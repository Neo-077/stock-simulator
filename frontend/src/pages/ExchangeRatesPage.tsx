import React, { useEffect } from 'react';
import { useStockStore } from '../store/stockStore';
import LoadingSpinner from '../components/LoadingSpinner';

const ExchangeRatesPage: React.FC = () => {
  const marketData = useStockStore((s) => s.marketData);
  const isLoading = useStockStore((s) => s.isLoading);
  const error = useStockStore((s) => s.error);
  const fetchMarketData = useStockStore((s) => s.fetchMarketData);
  const fxKind = useStockStore((s) => s.fxKind);
  const setFxKind = useStockStore((s) => s.setFxKind);

  useEffect(() => {
    if (!marketData) void fetchMarketData();
  }, [marketData, fetchMarketData]);

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
          <button onClick={fetchMarketData} className="btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!marketData) return null;

  const rates = marketData.exchangeRates;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-3xl">💱</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tipos de Cambio</h1>
            <p className="text-gray-600">Monedas principales y sus fluctuaciones en tiempo real</p>
          </div>
        </div>
      </div>

      {/* Exchange Type Selector */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Tipo de cambio:</span>
          {(['spot', 'fix', 'cash', 'crypto'] as const).map(k => (
            <button
              key={k}
              onClick={() => setFxKind(k)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${fxKind === k
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {rates.length}
          </div>
          <div className="text-gray-600">Divisas</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {rates.filter((rate) => rate.variation && rate.variation > 0).length}
          </div>
          <div className="text-gray-600">En Alza</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">
            {rates.filter((rate) => rate.variation && rate.variation < 0).length}
          </div>
          <div className="text-gray-600">En Baja</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-amber-600 mb-2">
            {fxKind.toUpperCase()}
          </div>
          <div className="text-gray-600">Tipo Actual</div>
        </div>
      </div>

      {/* Exchange Rates Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tasa
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volumen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rates.map((rate, index) => (
              <tr key={rate.code} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{rate.code}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {rate.code}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {rate.rate.toFixed(4)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">
                    {rate.volume ? rate.volume.toLocaleString() : '—'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>ℹ️ Nota:</strong> Los datos mostrados son ficticios y se generan automáticamente para fines educativos.
      </div>
    </div>
  );
};

export default ExchangeRatesPage;