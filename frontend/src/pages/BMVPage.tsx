import React, { useEffect } from 'react';
import { useStockStore } from '../store/stockStore';
import StockTable from '../components/StockTable';
import LoadingSpinner from '../components/LoadingSpinner';

const BMVPage: React.FC = () => {
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
          <div className="text-3xl">🇲🇽</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bolsa Mexicana de Valores
            </h1>
            <p className="text-gray-600">
              Principales empresas mexicanas cotizadas en la BMV
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Los datos mostrados son ficticios y se generan automáticamente para fines educativos. 
            Esta es una muestra representativa de empresas mexicanas.
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-2">
            {marketData.bmv.length}
          </div>
          <div className="text-gray-600">Empresas</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600 mb-2">
            {marketData.bmv.filter(stock => stock.variation > 0).length}
          </div>
          <div className="text-gray-600">En Alza</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-danger-600 mb-2">
            {marketData.bmv.filter(stock => stock.variation < 0).length}
          </div>
          <div className="text-gray-600">En Baja</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-2">
            ${(marketData.bmv
              .reduce((total, stock) => total + stock.marketCap, 0) / 1e12)
              .toFixed(1)}T
          </div>
          <div className="text-gray-600">Capitalización Total</div>
        </div>
      </div>

      {/* Tabla de acciones */}
      <StockTable
        data={marketData.bmv}
        type="stock"
        isLoading={isLoading}
      />

      {/* Información adicional */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Empresas en Crecimiento
          </h3>
          <div className="space-y-3">
            {marketData.bmv
              .sort((a, b) => b.variation - a.variation)
              .slice(0, 5)
              .map((stock, index) => (
                <div key={stock.ticker} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-900">
                      {stock.ticker}
                    </div>
                    <div className="text-sm text-gray-600 truncate max-w-32">
                      {stock.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ${stock.currentPrice.toFixed(2)}
                    </div>
                    <div className="text-sm font-medium text-success-600">
                      +{stock.variation.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Empresas con Mayor Capitalización
          </h3>
          <div className="space-y-3">
            {marketData.bmv
              .sort((a, b) => b.marketCap - a.marketCap)
              .slice(0, 5)
              .map((stock, index) => (
                <div key={stock.ticker} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-900">
                      {stock.ticker}
                    </div>
                    <div className="text-sm text-gray-600 truncate max-w-32">
                      {stock.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ${(stock.marketCap / 1e9).toFixed(1)}B
                    </div>
                    <div className="text-sm text-gray-600">
                      P/E: {stock.peRatio}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Sectores de la economía mexicana */}
      <div className="mt-8 card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sectores de la Economía Mexicana
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">📱</div>
            <div className="text-sm font-medium text-gray-900">Telecomunicaciones</div>
            <div className="text-xs text-gray-600">2 empresas</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">🏦</div>
            <div className="text-sm font-medium text-gray-900">Finanzas</div>
            <div className="text-xs text-gray-600">3 empresas</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl mb-2">🛒</div>
            <div className="text-sm font-medium text-gray-900">Retail</div>
            <div className="text-xs text-gray-600">4 empresas</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">🏭</div>
            <div className="text-sm font-medium text-gray-900">Industriales</div>
            <div className="text-xs text-gray-600">6 empresas</div>
          </div>
        </div>
      </div>

      {/* Información sobre BMV */}
      <div className="mt-8 bg-gradient-to-r from-red-50 to-green-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Sobre la Bolsa Mexicana de Valores (BMV)
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                La Bolsa Mexicana de Valores es la principal bolsa de valores de México y una de las más importantes 
                de América Latina. Alberga empresas de diversos sectores de la economía mexicana, desde telecomunicaciones 
                hasta minería y manufactura. Este simulador incluye una muestra representativa de estas empresas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMVPage;
