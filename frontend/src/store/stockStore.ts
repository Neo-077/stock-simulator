import { create } from 'zustand';
import { MarketData, Stock, ApiResponse } from '../types';

interface StockStore {
  marketData: MarketData | null;
  isLoading: boolean;
  error: string | null;
  selectedStock: Stock | null;

  // Acciones
  fetchMarketData: () => Promise<void>;
  fetchStockByTicker: (ticker: string) => Promise<void>;
  setSelectedStock: (stock: Stock | null) => void;
  clearError: () => void;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const useStockStore = create<StockStore>((set, get) => ({
  marketData: null,
  isLoading: false,
  error: null,
  selectedStock: null,

  fetchMarketData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/data`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<MarketData> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al obtener datos del mercado');
      }

      set({ 
        marketData: result.data,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error al cargar datos del mercado',
        isLoading: false 
      });
    }
  },

  fetchStockByTicker: async (ticker: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/stock/${ticker}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Acción no encontrada');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<Stock> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al obtener datos de la acción');
      }

      set({ 
        selectedStock: result.data,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error al cargar datos de la acción',
        isLoading: false 
      });
    }
  },

  setSelectedStock: (stock: Stock | null) => {
    set({ selectedStock: stock });
  },

  clearError: () => {
    set({ error: null });
  },
}));
