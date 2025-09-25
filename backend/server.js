const express = require("express");
const cors = require("cors");
const config = require("./config");
const mockData = require("./data/mockData");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta principal para servir todos los datos ficticios
app.get("/api/data", (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener los datos",
      message: error.message,
    });
  }
});

// Ruta para obtener tipos de cambio específicos
app.get("/api/exchange-rates", (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.exchangeRates,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener tipos de cambio",
      message: error.message,
    });
  }
});

// Ruta para obtener acciones del mercado general
app.get("/api/market-stocks", (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.marketStocks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener acciones del mercado",
      message: error.message,
    });
  }
});

// Ruta para obtener NASDAQ 500
app.get("/api/nasdaq500", (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.nasdaq500,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener NASDAQ 500",
      message: error.message,
    });
  }
});

// Ruta para obtener BMV
app.get("/api/bmv", (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.bmv,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener BMV",
      message: error.message,
    });
  }
});

// Ruta para obtener una acción específica por ticker
app.get("/api/stock/:ticker", (req, res) => {
  try {
    const { ticker } = req.params;
    const allStocks = [
      ...mockData.marketStocks,
      ...mockData.nasdaq500,
      ...mockData.bmv,
    ];

    const stock = allStocks.find(
      (s) => s.ticker.toLowerCase() === ticker.toLowerCase()
    );

    if (!stock) {
      return res.status(404).json({
        success: false,
        error: "Acción no encontrada",
      });
    }

    res.json({
      success: true,
      data: stock,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener la acción",
      message: error.message,
    });
  }
});

// Ruta de salud del servidor
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Stock Simulator API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// Middleware para manejar rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
  });
});

// Iniciar servidor con manejo básico de EADDRINUSE
const start = (port, attempt = 0) => {
  const server = app.listen(port, () => {
    console.log(`🚀 Servidor backend ejecutándose en puerto ${port}`);
    console.log(`📊 API disponible en http://localhost:${port}/api`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE" && attempt < 5) {
      const nextPort = Number(port) + 1;
      console.warn(`⚠️  Puerto ${port} en uso. Reintentando en ${nextPort}...`);
      setTimeout(() => start(nextPort, attempt + 1), 300);
    } else {
      console.error("Error al iniciar el servidor:", err);
      process.exit(1);
    }
  });
};

start(config.PORT);

module.exports = app;
