import React, { useEffect } from 'react';
import { useStockStore } from '../store/stockStore';
import StockTable from '../components/StockTable';
import LoadingSpinner from '../components/LoadingSpinner';

const MarketStocksPage: React.FC = () => {
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
          <div className="text-3xl">📊</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Acciones Generales
            </h1>
            <p className="text-gray-600">
              Principales acciones del mercado con mayor capitalización
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
            {marketData.marketStocks.length}
          </div>
          <div className="text-gray-600">Acciones</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600 mb-2">
            {marketData.marketStocks.filter(stock => stock.variation > 0).length}
          </div>
          <div className="text-gray-600">En Alza</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-danger-600 mb-2">
            {marketData.marketStocks.filter(stock => stock.variation < 0).length}
          </div>
          <div className="text-gray-600">En Baja</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-2">
            ${(marketData.marketStocks
              .reduce((total, stock) => total + stock.marketCap, 0) / 1e12)
              .toFixed(1)}T
          </div>
          <div className="text-gray-600">Capitalización Total</div>
        </div>
      </div>

      {/* Tabla de acciones */}
      <StockTable
        data={marketData.marketStocks}
        type="stock"
        isLoading={isLoading}
      />

      {/* Información adicional */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Acciones con Mayor Crecimiento
          </h3>
          <div className="space-y-3">
            {marketData.marketStocks
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
            Acciones con Mayor Capitalización
          </h3>
          <div className="space-y-3">
            {marketData.marketStocks
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

      {/* Sectores representados */}
      <div className="mt-8 card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sectores Representados
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">💻</div>
            <div className="text-sm font-medium text-gray-900">Tecnología</div>
            <div className="text-xs text-gray-600">6 empresas</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">🏦</div>
            <div className="text-sm font-medium text-gray-900">Finanzas</div>
            <div className="text-xs text-gray-600">3 empresas</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl mb-2">🏭</div>
            <div className="text-sm font-medium text-gray-900">Industriales</div>
            <div className="text-xs text-gray-600">3 empresas</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">🛒</div>
            <div className="text-sm font-medium text-gray-900">Consumo</div>
            <div className="text-xs text-gray-600">3 empresas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketStocksPage;
