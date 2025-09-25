// Tipos para los datos del simulador de bolsa

export interface PriceHistory {
  date: string;
  price: number;
  volume: number;
}

export interface ExchangeRate {
  id: number;
  pair: string;
  name: string;
  currentRate: number;
  openingRate: number;
  closingRate: number;
  dayHigh: number;
  dayLow: number;
  variation: number;
  volume: number;
  history: PriceHistory[];
}

export interface Stock {
  ticker: string;
  name: string;
  currentPrice: number;
  openingPrice: number;
  closingPrice: number;
  dayHigh: number;
  dayLow: number;
  variation: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  history: PriceHistory[];
}

export interface MarketData {
  exchangeRates: ExchangeRate[];
  marketStocks: Stock[];
  nasdaq500: Stock[];
  bmv: Stock[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface StockState {
  marketData: MarketData | null;
  isLoading: boolean;
  error: string | null;
  selectedStock: Stock | null;
}

export interface AppState {
  auth: AuthState;
  stocks: StockState;
}
