// backend/server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto"); // ✅ falta en tu versión original
const {
  markets,
  stocks,
  currencies,
  exchangeRates,
  kinds,
} = require("./data/mockData");

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- STOCKS ---------- */
/**
 * GET /api/stocks?market=BMV|BNY&trend=up|down|all&range=1D|1W|1M
 * opcionales: q (buscar por ticker/nombre), limit
 */
app.get("/api/stocks", (req, res) => {
  const { market, trend = "all", range = "1D", q = "", limit } = req.query;

  let data = stocks;
  if (market) data = data.filter((s) => s.market === market);
  if (q) {
    const k = String(q).toLowerCase();
    data = data.filter(
      (s) =>
        s.ticker.toLowerCase().includes(k) || s.name.toLowerCase().includes(k)
    );
  }
  if (trend === "up") data = data.filter((s) => s.changePct > 0);
  if (trend === "down") data = data.filter((s) => s.changePct < 0);

  const mapped = data.map((s) => ({
    ticker: s.ticker,
    name: s.name,
    market: s.market,
    last: s.last,
    changePct: s.changePct,
    series: s.series,
  }));

  res.json(limit ? mapped.slice(0, Number(limit)) : mapped);
});

app.get("/api/stocks/:ticker", (req, res) => {
  const s = stocks.find(
    (x) => x.ticker.toUpperCase() === req.params.ticker.toUpperCase()
  );
  if (!s) return res.status(404).json({ error: "Not found" });
  res.json(s);
});

app.get("/api/markets", (_req, res) => res.json({ markets }));

/* ---------- EXCHANGE RATES ---------- */
/** GET /api/exchange?kind=spot|fix|cash|crypto  */
app.get("/api/exchange", (req, res) => {
  const kind = req.query.kind || "spot";
  if (!kinds.includes(kind))
    return res.status(400).json({ error: "invalid kind" });
  res.json({ kind, rates: exchangeRates[kind], currencies });
});

/* ---------- SURVEY ---------- */
const SURVEY_FILE = path.join(__dirname, "data", "survey.json");

// Initialize survey file if it doesn't exist
if (!fs.existsSync(SURVEY_FILE)) {
  fs.writeFileSync(SURVEY_FILE, JSON.stringify({ responses: [] }, null, 2));
}

const readSurvey = () => {
  try {
    return JSON.parse(fs.readFileSync(SURVEY_FILE, "utf8"));
  } catch {
    return { responses: [] };
  }
};

const writeSurvey = (obj) =>
  fs.writeFileSync(SURVEY_FILE, JSON.stringify(obj, null, 2));

/** POST /api/surveys/responses  { name, email, answers:[{qid,value}], meta? } */
app.post("/api/surveys/responses", (req, res) => {
  const { name, email, answers } = req.body || {};
  if (!name || !email || !Array.isArray(answers))
    return res.status(400).json({ error: "name, email, answers required" });

  const db = readSurvey();
  const id = crypto.randomUUID();
  const createdAt = Date.now();
  db.responses.push({ id, name, email, answers, createdAt });
  writeSurvey(db);
  res.status(201).json({ id, createdAt });
});

/** GET /api/surveys/responses  */
app.get("/api/surveys/responses", (_req, res) => {
  const db = readSurvey();
  res.json(db.responses);
});

/** GET /api/surveys/summary  -> métricas: total, % altos, índice, NPS */
app.get("/api/surveys/summary", (_req, res) => {
  const { responses } = readSurvey();
  const total = responses.length;

  const num = (qid) =>
    responses.map((r) =>
      Number(r.answers.find((a) => a.qid === qid)?.value ?? 0)
    );
  const mean = (arr) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const sat = num("satisfaccion"),
    uti = num("utilidad"),
    conf = num("confianza");
  const satIndex = Math.round(
    ((mean(sat) + mean(uti) + mean(conf)) / 30) * 100
  );

  const highSatPct = total
    ? Math.round((sat.filter((v) => v >= 8).length / total) * 100)
    : 0;

  const rec = num("recomendacion");
  const promoters = rec.filter((v) => v >= 9).length;
  const detractors = rec.filter((v) => v <= 6).length;
  const nps = total ? Math.round(((promoters - detractors) / total) * 100) : 0;

  res.json({
    total,
    highSatPct,
    satIndex,
    nps,
    minTarget: 43,
    reached: total >= 43,
  });
});

/** GET /api/surveys/export.csv */
app.get("/api/surveys/export.csv", (_req, res) => {
  const { responses } = readSurvey();
  if (!responses.length)
    return res.type("text/csv").send("name,email,createdAt\n");
  const qids = [
    ...new Set(responses.flatMap((r) => r.answers.map((a) => a.qid))),
  ];
  const header = ["name", "email", "createdAt", ...qids].join(",");
  const rows = responses.map((r) => {
    const map = Object.fromEntries(
      r.answers.map((a) => [a.qid, String(a.value).replaceAll(",", " ")])
    );
    return [
      r.name,
      r.email,
      new Date(r.createdAt).toISOString(),
      ...qids.map((q) => map[q] ?? ""),
    ].join(",");
  });
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=encuesta_stock_simulator.csv"
  );
  res.type("text/csv").send([header, ...rows].join("\n"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ API running on http://localhost:${PORT}`)
);
