// backend/data/mockData.js
const markets = ["BMV", "BNY"];

/** util para generar series OHLC/cierre sintéticas */
const makeSeries = (base = 100, points = 24) =>
  Array.from({ length: points }, (_, i) => {
    const v = +(
      base *
      (1 + (Math.sin(i / 3) + (Math.random() - 0.5) * 0.2) / 50)
    ).toFixed(2);
    return { t: i, c: v };
  });

const makeAllRanges = (base) => ({
  "1D": makeSeries(base, 24),
  "1W": makeSeries(base, 7),
  "1M": makeSeries(base, 30),
});

const BMV = [
  { ticker: "AMXL", name: "América Móvil L", base: 17.2 },
  { ticker: "WALMEX", name: "WALMEX", base: 64.7 },
  { ticker: "GMEXICO", name: "Grupo México", base: 109.5 },
  { ticker: "BIMBOA", name: "Bimbo A", base: 92.3 },
  { ticker: "CEMEXCPO", name: "Cemex CPO", base: 12.1 },
  { ticker: "FEMSAUBD", name: "FEMSA", base: 224.2 },
  { ticker: "GAPB", name: "GAP B", base: 250.8 },
  { ticker: "ASURB", name: "ASUR B", base: 417.6 },
  { ticker: "KOFUBL", name: "Coca-Cola FEMSA", base: 133.2 },
  { ticker: "ALFAA", name: "ALFA A", base: 17.9 },
].map((s) => ({ ...s, market: "BMV" }));

const BNY = [
  { ticker: "AAPL", name: "Apple", base: 205 },
  { ticker: "MSFT", name: "Microsoft", base: 410 },
  { ticker: "AMZN", name: "Amazon", base: 180 },
  { ticker: "GOOGL", name: "Alphabet", base: 155 },
  { ticker: "META", name: "Meta", base: 510 },
  { ticker: "TSLA", name: "Tesla", base: 195 },
  { ticker: "NVDA", name: "NVIDIA", base: 1100 },
  { ticker: "JPM", name: "JPMorgan", base: 205 },
  { ticker: "V", name: "Visa", base: 280 },
  { ticker: "PG", name: "Procter & Gamble", base: 170 },
].map((s) => ({ ...s, market: "BNY" }));

const stocks = [...BMV, ...BNY].map((s) => {
  const series = makeAllRanges(s.base);
  const last = series["1D"].at(-1).c;
  const first = series["1D"][0].c;
  const changePct = +(((last - first) / first) * 100).toFixed(2);
  return { ...s, series, last, changePct };
});

const currencies = [
  "USD",
  "EUR",
  "JPY",
  "GBP",
  "CAD",
  "CHF",
  "CNY",
  "BRL",
  "ARS",
  "MXN",
];

const kinds = ["spot", "fix", "cash", "crypto"];
const exchangeRates = kinds.reduce((acc, k) => {
  acc[k] = currencies.map((c, i) => {
    const baseRate = (15 + i * 0.3) * (1 + (k === "crypto" ? 0.1 : 0));
    const variation = +(Math.random() * 4 - 2).toFixed(2); // -2% to +2%
    const volume = Math.floor(Math.random() * 1000000000 + 1000000); // 1M to 1B
    return {
      code: c,
      rate: +baseRate.toFixed(4),
      variation,
      volume,
    };
  });
  return acc;
}, {});

module.exports = { markets, stocks, currencies, exchangeRates, kinds };
