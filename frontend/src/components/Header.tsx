import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Header: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Tipos de Cambio', href: '/exchange-rates' },
    { name: 'Acciones Generales', href: '/market-stocks' },
    { name: 'NASDAQ 500', href: '/nasdaq500' },
    { name: 'BMV', href: '/bmv' },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📈</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Stock Simulator</h1>
            </div>
          </div>

          {/* Navegación */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Información del usuario y logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm text-gray-600">
              Bienvenido, <span className="font-medium">{user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="btn-secondary text-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Navegación móvil */}
        <div className="md:hidden border-t border-gray-200 py-3">
          <nav className="flex flex-wrap gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
