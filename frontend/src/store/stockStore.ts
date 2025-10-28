// src/store/stockStore.ts
import { create } from 'zustand';
import type { MarketData, Stock, TimeRange, Market, Trend, FxKind, ExchangeRate } from '../types';
import { BMV_STOCKS, BNY_STOCKS, EXCHANGE_RATES } from '../data/mockData';

interface StockStore {
  marketData: MarketData | null;
  selected: Stock | null;

  isLoading: boolean;
  error: string | null;

  market: Market;
  trend: Trend;
  range: TimeRange;
  fxKind: FxKind;

  fetchAll: () => Promise<void>;
  fetchMarketData: () => Promise<void>;
  setMarket: (m: Market) => void;
  setTrend: (t: Trend) => void;
  setRange: (r: TimeRange) => void;
  setFxKind: (k: FxKind) => Promise<void>;
  loadStock: (ticker: string) => Promise<void>;
  clearError: () => void;
}

export const useStockStore = create<StockStore>((set, get) => ({
  marketData: null,
  selected: null,
  isLoading: false,
  error: null,

  market: 'BMV',
  trend: 'all',
  range: '1D',
  fxKind: 'spot',

  fetchAll: async () => {
    const { range, fxKind } = get();
    set({ isLoading: true, error: null });

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));

      console.log('📊 Loading mock data...');

      const payload: MarketData = {
        bmv: BMV_STOCKS as any,
        bny: BNY_STOCKS as any,
        exchangeRates: EXCHANGE_RATES[fxKind],
        currencies: ['USD', 'EUR', 'JPY', 'GBP', 'CAD', 'CHF', 'CNY', 'BRL', 'ARS', 'MXN'],
        kind: fxKind,
      };

      console.log('✅ Mock data loaded successfully');
      set({ marketData: payload, isLoading: false, error: null });
    } catch (e: any) {
      console.error('❌ Error loading mock data:', e);
      set({
        isLoading: false,
        error: e?.message || 'Error al cargar datos',
      });
    }
  },

  fetchMarketData: async () => {
    const { fxKind, marketData } = get();
    set({ isLoading: true, error: null });

    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const payload: MarketData = marketData
        ? {
          ...marketData,
          exchangeRates: EXCHANGE_RATES[fxKind],
          kind: fxKind,
        }
        : {
          bmv: BMV_STOCKS as any,
          bny: BNY_STOCKS as any,
          exchangeRates: EXCHANGE_RATES[fxKind],
          currencies: ['USD', 'EUR', 'JPY', 'GBP', 'CAD', 'CHF', 'CNY', 'BRL', 'ARS', 'MXN'],
          kind: fxKind,
        };

      set({ marketData: payload, isLoading: false });
    } catch (e: any) {
      set({
        isLoading: false,
        error: e?.message || 'Error al cargar tipos de cambio',
      });
    }
  },

  setMarket: (m) => set({ market: m }),
  setTrend: (t) => set({ trend: t }),

  setRange: (r) => {
    set({ range: r });
    // Regenerar datos con nuevos ranges
    get().fetchAll().catch(() => { });
  },

  setFxKind: async (k) => {
    set({ fxKind: k });
    await get().fetchMarketData();
  },

  loadStock: async (ticker: string) => {
    set({ isLoading: true, error: null, selected: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const allStocks = [...BMV_STOCKS, ...BNY_STOCKS];
      const stock = allStocks.find(s => s.ticker.toUpperCase() === ticker.toUpperCase());

      if (!stock) {
        throw new Error('Acción no encontrada');
      }

      set({ selected: stock as any, isLoading: false });
    } catch (e: any) {
      set({
        isLoading: false,
        error: e?.message || 'No se pudo cargar la acción',
      });
    }
  },

  clearError: () => set({ error: null }),
}));
