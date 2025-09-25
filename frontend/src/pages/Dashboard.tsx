import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStockStore } from '../store/stockStore';
import PriceCard from '../components/PriceCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { marketData, isLoading, error, fetchMarketData } = useStockStore();

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

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

  // Obtener los primeros elementos de cada sección para el dashboard
  const topExchangeRates = marketData.exchangeRates.slice(0, 4);
  const topMarketStocks = marketData.marketStocks.slice(0, 4);
  const topNasdaq500 = marketData.nasdaq500.slice(0, 4);
  const topBMV = marketData.bmv.slice(0, 4);

  const sections = [
    {
      title: 'Tipos de Cambio',
      description: 'Monedas principales y sus fluctuaciones',
      data: topExchangeRates,
      linkTo: '/exchange-rates',
      icon: '💱'
    },
    {
      title: 'Acciones Generales',
      description: 'Principales acciones del mercado',
      data: topMarketStocks,
      linkTo: '/market-stocks',
      icon: '📊'
    },
    {
      title: 'NASDAQ 500',
      description: 'Empresas tecnológicas destacadas',
      data: topNasdaq500,
      linkTo: '/nasdaq500',
      icon: '💻'
    },
    {
      title: 'Bolsa Mexicana de Valores',
      description: 'Acciones de empresas mexicanas',
      data: topBMV,
      linkTo: '/bmv',
      icon: '🇲🇽'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header del Dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard de Mercados
        </h1>
        <p className="text-gray-600">
          Resumen de los principales mercados financieros y tipos de cambio
        </p>
      </div>

      {/* Secciones del Dashboard */}
      <div className="space-y-8">
        {sections.map((section, index) => (
          <div key={index} className="animate-fade-in">
            {/* Header de la sección */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{section.icon}</div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                  <p className="text-gray-600">{section.description}</p>
                </div>
              </div>
              <Link
                to={section.linkTo}
                className="btn-primary"
              >
                Ver Todos
              </Link>
            </div>

            {/* Grid de tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.data.map((item, itemIndex) => (
                <div key={itemIndex} className="animate-slide-up" style={{ animationDelay: `${itemIndex * 100}ms` }}>
                  <PriceCard
                    item={item}
                    type={section.title === 'Tipos de Cambio' ? 'exchange' : 'stock'}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Estadísticas generales */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {marketData.exchangeRates.length + marketData.marketStocks.length + marketData.nasdaq500.length + marketData.bmv.length}
          </div>
          <div className="text-gray-600">Instrumentos Financieros</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">
            {marketData.exchangeRates.length}
          </div>
          <div className="text-gray-600">Pares de Divisas</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {marketData.marketStocks.length + marketData.nasdaq500.length + marketData.bmv.length}
          </div>
          <div className="text-gray-600">Acciones Disponibles</div>
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
                Este es un simulador educativo con datos ficticios. Los precios y valores mostrados 
                no representan datos reales del mercado financiero y no deben usarse para decisiones 
                de inversión reales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
