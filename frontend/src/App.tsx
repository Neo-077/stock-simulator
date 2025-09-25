import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import ExchangeRatesPage from './pages/ExchangeRatesPage';
import MarketStocksPage from './pages/MarketStocksPage';
import Nasdaq500Page from './pages/Nasdaq500Page';
import BMVPage from './pages/BMVPage';
import StockDetailPage from './pages/StockDetailPage';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Header />}
        
        <main className={user ? 'pt-16' : ''}>
          <Routes>
            {/* Rutas públicas */}
            <Route 
              path="/auth" 
              element={user ? <Navigate to="/" replace /> : <AuthPage />} 
            />
            
            {/* Rutas protegidas */}
            <Route 
              path="/" 
              element={user ? <Dashboard /> : <Navigate to="/auth" replace />} 
            />
            <Route 
              path="/exchange-rates" 
              element={user ? <ExchangeRatesPage /> : <Navigate to="/auth" replace />} 
            />
            <Route 
              path="/market-stocks" 
              element={user ? <MarketStocksPage /> : <Navigate to="/auth" replace />} 
            />
            <Route 
              path="/nasdaq500" 
              element={user ? <Nasdaq500Page /> : <Navigate to="/auth" replace />} 
            />
            <Route 
              path="/bmv" 
              element={user ? <BMVPage /> : <Navigate to="/auth" replace />} 
            />
            <Route 
              path="/stock/:ticker" 
              element={user ? <StockDetailPage /> : <Navigate to="/auth" replace />} 
            />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to={user ? "/" : "/auth"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
