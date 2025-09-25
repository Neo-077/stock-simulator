import React from 'react';
import { Link } from 'react-router-dom';
import { ExchangeRate, Stock } from '../types';

interface PriceCardProps {
  item: ExchangeRate | Stock;
  type: 'exchange' | 'stock';
  linkTo?: string;
}

const PriceCard: React.FC<PriceCardProps> = ({ item, type, linkTo }) => {
  const isPositive = item.variation > 0;
  const isNegative = item.variation < 0;
  
  const formatPrice = (price: number) => {
    if (type === 'exchange') {
      return price.toFixed(4);
    }
    return price.toFixed(2);
  };

  // Obtener el precio actual según el tipo
  const getCurrentPrice = () => {
    if (type === 'exchange') {
      return (item as ExchangeRate).currentRate;
    }
    return (item as Stock).currentPrice;
  };

  const formatVariation = (variation: number) => {
    const sign = variation > 0 ? '+' : '';
    return `${sign}${variation.toFixed(2)}%`;
  };

  const getVariationClass = () => {
    if (isPositive) return 'price-positive';
    if (isNegative) return 'price-negative';
    return 'price-neutral';
  };

  const cardContent = (
    <div className="card-hover">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {type === 'exchange' ? (item as ExchangeRate).pair : (item as Stock).ticker}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {type === 'exchange' ? (item as ExchangeRate).name : (item as Stock).name}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            ${formatPrice(getCurrentPrice())}
          </div>
          <div className={`text-sm font-medium ${getVariationClass()}`}>
            {formatVariation(item.variation)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Apertura:</span>
          <div className="font-medium">
            ${formatPrice(type === 'exchange' ? (item as ExchangeRate).openingRate : (item as Stock).openingPrice)}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Volumen:</span>
          <div className="font-medium">
            {item.volume.toLocaleString()}
          </div>
        </div>
      </div>

      {type === 'stock' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Market Cap:</span>
              <div className="font-medium">
                ${((item as Stock).marketCap / 1e9).toFixed(1)}B
              </div>
            </div>
            <div>
              <span className="text-gray-500">P/E Ratio:</span>
              <div className="font-medium">
                {(item as Stock).peRatio}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default PriceCard;
