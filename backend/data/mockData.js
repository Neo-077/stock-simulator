// Función para generar datos de precios históricos
const generatePriceHistory = (currentPrice, days = 30) => {
  const history = [];
  let price = currentPrice * 0.8; // Empezar 20% más bajo
  
  for (let i = 0; i < days; i++) {
    const variation = (Math.random() - 0.5) * 0.05; // Variación del ±2.5%
    price = price * (1 + variation);
    
    history.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 1000000) + 100000
    });
  }
  
  return history;
};

// Función para generar variación porcentual
const generateVariation = () => {
  return (Math.random() - 0.5) * 10; // Variación entre -5% y +5%
};

// Datos ficticios de tipos de cambio
const exchangeRates = [
  {
    id: 1,
    pair: 'USD/MXN',
    name: 'Dólar Americano / Peso Mexicano',
    currentRate: 17.85,
    openingRate: 17.92,
    closingRate: 17.85,
    dayHigh: 18.05,
    dayLow: 17.78,
    variation: generateVariation(),
    volume: 2500000,
    history: generatePriceHistory(17.85, 30)
  },
  {
    id: 2,
    pair: 'EUR/USD',
    name: 'Euro / Dólar Americano',
    currentRate: 1.0856,
    openingRate: 1.0872,
    closingRate: 1.0856,
    dayHigh: 1.0898,
    dayLow: 1.0834,
    variation: generateVariation(),
    volume: 1800000,
    history: generatePriceHistory(1.0856, 30)
  },
  {
    id: 3,
    pair: 'GBP/USD',
    name: 'Libra Esterlina / Dólar Americano',
    currentRate: 1.2634,
    openingRate: 1.2658,
    closingRate: 1.2634,
    dayHigh: 1.2689,
    dayLow: 1.2601,
    variation: generateVariation(),
    volume: 1200000,
    history: generatePriceHistory(1.2634, 30)
  },
  {
    id: 4,
    pair: 'USD/JPY',
    name: 'Dólar Americano / Yen Japonés',
    currentRate: 149.23,
    openingRate: 148.95,
    closingRate: 149.23,
    dayHigh: 149.78,
    dayLow: 148.67,
    variation: generateVariation(),
    volume: 950000,
    history: generatePriceHistory(149.23, 30)
  },
  {
    id: 5,
    pair: 'USD/CAD',
    name: 'Dólar Americano / Dólar Canadiense',
    currentRate: 1.3542,
    openingRate: 1.3567,
    closingRate: 1.3542,
    dayHigh: 1.3598,
    dayLow: 1.3512,
    variation: generateVariation(),
    volume: 750000,
    history: generatePriceHistory(1.3542, 30)
  }
];

// Función para generar acciones
const generateStock = (ticker, name, basePrice, marketCap) => {
  const variation = generateVariation();
  const currentPrice = basePrice * (1 + variation / 100);
  
  return {
    ticker,
    name,
    currentPrice: Math.round(currentPrice * 100) / 100,
    openingPrice: basePrice,
    closingPrice: currentPrice,
    dayHigh: Math.round(currentPrice * (1 + Math.random() * 0.05) * 100) / 100,
    dayLow: Math.round(currentPrice * (1 - Math.random() * 0.05) * 100) / 100,
    variation,
    volume: Math.floor(Math.random() * 5000000) + 500000,
    marketCap: marketCap * (1 + variation / 100),
    peRatio: Math.round((Math.random() * 50 + 10) * 100) / 100,
    dividendYield: Math.round(Math.random() * 5 * 100) / 100,
    history: generatePriceHistory(currentPrice, 30)
  };
};

// Acciones del mercado general
const marketStocks = [
  generateStock('AAPL', 'Apple Inc.', 175.50, 2800000000000),
  generateStock('MSFT', 'Microsoft Corporation', 415.20, 3100000000000),
  generateStock('GOOGL', 'Alphabet Inc. Class A', 142.80, 1800000000000),
  generateStock('AMZN', 'Amazon.com Inc.', 155.30, 1600000000000),
  generateStock('TSLA', 'Tesla Inc.', 248.90, 790000000000),
  generateStock('META', 'Meta Platforms Inc.', 485.60, 1200000000000),
  generateStock('NVDA', 'NVIDIA Corporation', 875.20, 2200000000000),
  generateStock('BRK.B', 'Berkshire Hathaway Inc. Class B', 350.45, 780000000000),
  generateStock('JPM', 'JPMorgan Chase & Co.', 185.70, 540000000000),
  generateStock('V', 'Visa Inc.', 280.15, 580000000000),
  generateStock('JNJ', 'Johnson & Johnson', 158.90, 420000000000),
  generateStock('WMT', 'Walmart Inc.', 169.80, 570000000000),
  generateStock('PG', 'Procter & Gamble Co.', 152.30, 360000000000),
  generateStock('MA', 'Mastercard Inc.', 425.60, 410000000000),
  generateStock('UNH', 'UnitedHealth Group Inc.', 485.20, 460000000000)
];

// NASDAQ 500 (muestra representativa)
const nasdaq500 = [
  generateStock('ADBE', 'Adobe Inc.', 620.50, 280000000000),
  generateStock('AMD', 'Advanced Micro Devices Inc.', 145.80, 240000000000),
  generateStock('AVGO', 'Broadcom Inc.', 1250.30, 520000000000),
  generateStock('CMCSA', 'Comcast Corporation', 45.20, 190000000000),
  generateStock('COST', 'Costco Wholesale Corporation', 680.90, 300000000000),
  generateStock('CSCO', 'Cisco Systems Inc.', 55.40, 230000000000),
  generateStock('CRM', 'Salesforce Inc.', 245.60, 240000000000),
  generateStock('INTC', 'Intel Corporation', 42.80, 180000000000),
  generateStock('NFLX', 'Netflix Inc.', 485.20, 210000000000),
  generateStock('ORCL', 'Oracle Corporation', 125.40, 340000000000),
  generateStock('PEP', 'PepsiCo Inc.', 185.90, 260000000000),
  generateStock('PYPL', 'PayPal Holdings Inc.', 68.50, 78000000000),
  generateStock('TXN', 'Texas Instruments Inc.', 175.30, 160000000000),
  generateStock('QCOM', 'QUALCOMM Incorporated', 125.80, 140000000000),
  generateStock('AMAT', 'Applied Materials Inc.', 185.60, 160000000000),
  generateStock('ADP', 'Automatic Data Processing Inc.', 245.80, 100000000000),
  generateStock('BKNG', 'Booking Holdings Inc.', 3450.20, 120000000000),
  generateStock('CHTR', 'Charter Communications Inc.', 485.60, 78000000000),
  generateStock('ISRG', 'Intuitive Surgical Inc.', 385.40, 135000000000),
  generateStock('LRCX', 'Lam Research Corporation', 785.20, 120000000000)
];

// Bolsa Mexicana de Valores (BMV)
const bmv = [
  generateStock('AMXL', 'América Móvil S.A.B. de C.V.', 18.45, 58000000000),
  generateStock('GFNORTE', 'Grupo Financiero Banorte S.A.B. de C.V.', 145.80, 42000000000),
  generateStock('WALMEX', 'Wal-Mart de México S.A.B. de C.V.', 68.90, 42000000000),
  generateStock('FEMSA', 'Fomento Económico Mexicano S.A.B. de C.V.', 125.60, 38000000000),
  generateStock('GMEXICO', 'Grupo México S.A.B. de C.V.', 85.40, 32000000000),
  generateStock('GFREGIO', 'Banco Regional de Monterrey S.A.', 45.20, 28000000000),
  generateStock('BIMBO', 'Grupo Bimbo S.A.B. de C.V.', 78.90, 26000000000),
  generateStock('KIMBER', 'Kimberly-Clark de México S.A.B. de C.V.', 125.80, 24000000000),
  generateStock('ASUR', 'Grupo Aeroportuario del Sureste S.A.B. de C.V.', 185.60, 18000000000),
  generateStock('ALPEKA', 'Alpek S.A.B. de C.V.', 15.80, 16000000000),
  generateStock('AC', 'Arca Continental S.A.B. de C.V.', 125.40, 15000000000),
  generateStock('GAP', 'Grupo Aeroportuario del Pacífico S.A.B. de C.V.', 145.20, 14000000000),
  generateStock('LALA', 'Grupo Lala S.A.B. de C.V.', 28.90, 12000000000),
  generateStock('GMEXICOB', 'Grupo México S.A.B. de C.V. Serie B', 85.40, 32000000000),
  generateStock('GENTERA', 'Gentera S.A.B. de C.V.', 12.50, 10000000000),
  generateStock('MEXCHEM', 'Mexichem S.A.B. de C.V.', 45.60, 9500000000),
  generateStock('ORBIA', 'Orbia Advance Corporation S.A.B. de C.V.', 35.80, 8500000000),
  generateStock('ALSEA', 'Alsea S.A.B. de C.V.', 42.30, 7800000000),
  generateStock('CEMEXCPO', 'CEMEX S.A.B. de C.V.', 8.95, 6500000000),
  generateStock('GCARSOA1', 'Grupo Carso S.A.B. de C.V. Serie A', 125.60, 6000000000)
];

module.exports = {
  exchangeRates,
  marketStocks,
  nasdaq500,
  bmv
};
