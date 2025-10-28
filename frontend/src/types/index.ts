// Consolidated Types for Stock Simulator

export type Market = 'BMV' | 'BNY';
export type Trend = 'up' | 'down' | 'all';
export type TimeRange = '1D' | '1W' | '1M';
export type FxKind = 'spot' | 'fix' | 'cash' | 'crypto';

// Auth types
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

// Series data point for historical stock data
export interface SeriesPoint {
  t: number;   // index (hour/day)
  c: number;   // close price
}

// Stock data structure
export interface Stock {
  ticker: string;
  name: string;
  market: Market;
  last: number;
  changePct: number;
  series: Record<TimeRange, SeriesPoint[]>;
}

// Exchange rate structure
export interface ExchangeRate {
  code: string;
  rate: number;
  variation?: number;
  volume?: number;
}

// Market data structure
export interface MarketData {
  bmv: Stock[];
  bny: Stock[];
  exchangeRates: ExchangeRate[];
  currencies: string[];
  kind: FxKind;
}