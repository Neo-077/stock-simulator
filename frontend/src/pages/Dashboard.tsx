import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStockStore } from '../store/stockStore';
import LoadingSpinner from '../components/LoadingSpinner';
import PriceCard from '../components/PriceCard';

const Dashboard: React.FC = () => {
  const marketData = useStockStore((s) => s.marketData);
  const isLoading = useStockStore((s) => s.isLoading);
  const error = useStockStore((s) => s.error);
  const market = useStockStore((s) => s.market);
  const trend = useStockStore((s) => s.trend);
  const range = useStockStore((s) => s.range);
  const fxKind = useStockStore((s) => s.fxKind);
  const setMarket = useStockStore((s) => s.setMarket);
  const setTrend = useStockStore((s) => s.setTrend);
  const setRange = useStockStore((s) => s.setRange);
  const setFxKind = useStockStore((s) => s.setFxKind);
  const fetchAll = useStockStore((s) => s.fetchAll);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">⚠️ {error}</p>
          <button
            onClick={() => fetchAll()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const currentStocks = (market === 'BMV' ? marketData.bmv : marketData.bny)
    .filter(s => trend === 'all' ? true : trend === 'up' ? s.changePct > 0 : s.changePct < 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Mercados</h1>
          <p className="text-gray-600">Resumen y filtros interactivos</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {/* Market */}
          <div className="col-span-2 md:col-span-1 p-2 bg-white rounded-xl shadow">
            <div className="text-xs text-gray-500 mb-1">Mercado</div>
            <div className="flex gap-2">
              <button
                onClick={() => setMarket('BMV')}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${market === 'BMV' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}
              >
                🇲🇽 BMV
              </button>
              <button
                onClick={() => setMarket('BNY')}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${market === 'BNY' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
              >
                🇺🇸 BNY
              </button>
            </div>
          </div>

          {/* Trend */}
          <div className="col-span-2 md:col-span-1 p-2 bg-white rounded-xl shadow">
            <div className="text-xs text-gray-500 mb-1">Tendencia</div>
            <div className="flex gap-2">
              <button onClick={() => setTrend('up')} className={`px-3 py-1 rounded-lg text-sm ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>Alza</button>
              <button onClick={() => setTrend('down')} className={`px-3 py-1 rounded-lg text-sm ${trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>Baja</button>
              <button onClick={() => setTrend('all')} className={`px-3 py-1 rounded-lg text-sm ${trend === 'all' ? 'bg-slate-100 text-slate-700' : 'bg-gray-100 text-gray-700'}`}>Todas</button>
            </div>
          </div>

          {/* Range */}
          <div className="col-span-2 md:col-span-1 p-2 bg-white rounded-xl shadow">
            <div className="text-xs text-gray-500 mb-1">Rango</div>
            <div className="flex gap-2">
              {(['1D', '1W', '1M'] as const).map(r => (
                <button key={r} onClick={() => setRange(r)}
                  className={`px-3 py-1 rounded-lg text-sm ${range === r ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* FX Type */}
          <div className="col-span-2 md:col-span-1 p-2 bg-white rounded-xl shadow">
            <div className="text-xs text-gray-500 mb-1">Tipo de cambio</div>
            <div className="flex gap-2">
              {(['spot', 'fix', 'cash', 'crypto'] as const).map(k => (
                <button key={k} onClick={() => setFxKind(k)}
                  className={`px-3 py-1 rounded-lg text-sm capitalize ${fxKind === k ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Cards */}
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{market === 'BMV' ? 'BMV' : 'BNY'} — {range}</h2>
            <Link to={market === 'BMV' ? '/bmv' : '/nasdaq500'} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Ver Todos
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentStocks.slice(0, 8).map((s) => (
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
        </div>

        {/* Exchange Rates */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Tipos de Cambio ({fxKind})</h2>
            <Link to="/exchange-rates" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Ver Todos
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketData.exchangeRates.slice(0, 8).map((r) => (
              <PriceCard
                key={r.code}
                item={{
                  name: r.code,
                  ticker: r.code,
                  price: r.rate,
                  changePct: r.variation || 0,
                }}
                type="exchange"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-10 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800 text-sm">
        Este es un simulador con datos ficticios para fines educativos.
      </div>
    </div>
  );
};

export default Dashboard;