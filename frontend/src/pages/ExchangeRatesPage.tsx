import React, { useEffect } from 'react';
import { useStockStore } from '../store/stockStore';
import StockTable from '../components/StockTable';
import LoadingSpinner from '../components/LoadingSpinner';

const ExchangeRatesPage: React.FC = () => {
  const { marketData, isLoading, error, fetchMarketData } = useStockStore();

  useEffect(() => {
    if (!marketData) {
      fetchMarketData();
    }
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
          <div className="text-danger-600 text-xl mb-4">⚠️ Error al cargar datos</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchMarketData}
            className="btn-primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!marketData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-3xl">💱</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tipos de Cambio
            </h1>
            <p className="text-gray-600">
              Monedas principales y sus fluctuaciones en tiempo real
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Los datos mostrados son ficticios y se generan automáticamente para fines educativos.
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-2">
            {marketData.exchangeRates.length}
          </div>
          <div className="text-gray-600">Pares de Divisas</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600 mb-2">
            {marketData.exchangeRates.filter(rate => rate.variation > 0).length}
          </div>
          <div className="text-gray-600">En Alza</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-danger-600 mb-2">
            {marketData.exchangeRates.filter(rate => rate.variation < 0).length}
          </div>
          <div className="text-gray-600">En Baja</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-600 mb-2">
            {marketData.exchangeRates.filter(rate => rate.variation === 0).length}
          </div>
          <div className="text-gray-600">Sin Cambio</div>
        </div>
      </div>

      {/* Tabla de tipos de cambio */}
      <StockTable
        data={marketData.exchangeRates}
        type="exchange"
        isLoading={isLoading}
      />

      {/* Información adicional */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pares Más Volátiles
          </h3>
          <div className="space-y-3">
            {marketData.exchangeRates
              .sort((a, b) => Math.abs(b.variation) - Math.abs(a.variation))
              .slice(0, 3)
              .map((rate, index) => (
                <div key={rate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-900">
                      {rate.pair}
                    </div>
                    <div className="text-sm text-gray-600">
                      {rate.name}
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    rate.variation > 0 ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {rate.variation > 0 ? '+' : ''}{rate.variation.toFixed(2)}%
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mayor Volumen de Operaciones
          </h3>
          <div className="space-y-3">
            {marketData.exchangeRates
              .sort((a, b) => b.volume - a.volume)
              .slice(0, 3)
              .map((rate, index) => (
                <div key={rate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-900">
                      {rate.pair}
                    </div>
                    <div className="text-sm text-gray-600">
                      {rate.name}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {rate.volume.toLocaleString()}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRatesPage;
