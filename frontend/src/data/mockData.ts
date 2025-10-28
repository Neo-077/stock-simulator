// Mock data for frontend - no backend needed

export interface SeriesPoint {
    t: number;
    c: number;
}

export interface MockStock {
    ticker: string;
    name: string;
    market: 'BMV' | 'BNY';
    last: number;
    changePct: number;
    series: {
        '1D': SeriesPoint[];
        '1W': SeriesPoint[];
        '1M': SeriesPoint[];
    };
}

const makeSeries = (base: number, points: number): SeriesPoint[] =>
    Array.from({ length: points }, (_, i) => {
        const v = +(base * (1 + (Math.sin(i / 3) + (Math.random() - 0.5) * 0.2) / 50)).toFixed(2);
        return { t: i, c: v };
    });

const makeAllRanges = (base: number) => ({
    '1D': makeSeries(base, 24),
    '1W': makeSeries(base, 7),
    '1M': makeSeries(base, 30),
});

const createStock = (ticker: string, name: string, base: number, market: 'BMV' | 'BNY'): MockStock => {
    const series = makeAllRanges(base);
    const last = series['1D'].at(-1)!.c;
    const first = series['1D'][0].c;
    const changePct = +(((last - first) / first) * 100).toFixed(2);

    return { ticker, name, market, last, changePct, series };
};

export const BMV_STOCKS: MockStock[] = [
    createStock('AMXL', 'América Móvil L', 17.2, 'BMV'),
    createStock('WALMEX', 'WALMEX', 64.7, 'BMV'),
    createStock('GMEXICO', 'Grupo México', 109.5, 'BMV'),
    createStock('BIMBOA', 'Bimbo A', 92.3, 'BMV'),
    createStock('CEMEXCPO', 'Cemex CPO', 12.1, 'BMV'),
    createStock('FEMSAUBD', 'FEMSA', 224.2, 'BMV'),
    createStock('GAPB', 'GAP B', 250.8, 'BMV'),
    createStock('ASURB', 'ASUR B', 417.6, 'BMV'),
    createStock('KOFUBL', 'Coca-Cola FEMSA', 133.2, 'BMV'),
    createStock('ALFAA', 'ALFA A', 17.9, 'BMV'),
];

export const BNY_STOCKS: MockStock[] = [
    createStock('AAPL', 'Apple', 205, 'BNY'),
    createStock('MSFT', 'Microsoft', 410, 'BNY'),
    createStock('AMZN', 'Amazon', 180, 'BNY'),
    createStock('GOOGL', 'Alphabet', 155, 'BNY'),
    createStock('META', 'Meta', 510, 'BNY'),
    createStock('TSLA', 'Tesla', 195, 'BNY'),
    createStock('NVDA', 'NVIDIA', 1100, 'BNY'),
    createStock('JPM', 'JPMorgan', 205, 'BNY'),
    createStock('V', 'Visa', 280, 'BNY'),
    createStock('PG', 'Procter & Gamble', 170, 'BNY'),
];

export const EXCHANGE_RATES = {
    spot: ['USD', 'EUR', 'JPY', 'GBP', 'CAD', 'CHF', 'CNY', 'BRL', 'ARS', 'MXN'].map((code, i) => ({
        code,
        rate: +(15 + i * 0.3).toFixed(4),
        variation: +(Math.random() * 4 - 2).toFixed(2),
        volume: Math.floor(Math.random() * 1000000000 + 1000000),
    })),
    fix: ['USD', 'EUR', 'JPY', 'GBP', 'CAD', 'CHF', 'CNY', 'BRL', 'ARS', 'MXN'].map((code, i) => ({
        code,
        rate: +(15.1 + i * 0.3).toFixed(4),
        variation: +(Math.random() * 4 - 2).toFixed(2),
        volume: Math.floor(Math.random() * 1000000000 + 1000000),
    })),
    cash: ['USD', 'EUR', 'JPY', 'GBP', 'CAD', 'CHF', 'CNY', 'BRL', 'ARS', 'MXN'].map((code, i) => ({
        code,
        rate: +(15.05 + i * 0.3).toFixed(4),
        variation: +(Math.random() * 4 - 2).toFixed(2),
        volume: Math.floor(Math.random() * 1000000000 + 1000000),
    })),
    crypto: ['USD', 'EUR', 'JPY', 'GBP', 'CAD', 'CHF', 'CNY', 'BRL', 'ARS', 'MXN'].map((code, i) => ({
        code,
        rate: +(16.5 + i * 0.3).toFixed(4),
        variation: +(Math.random() * 4 - 2).toFixed(2),
        volume: Math.floor(Math.random() * 1000000000 + 1000000),
    })),
};

