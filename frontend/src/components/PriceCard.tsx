import React from 'react';
import { Link } from 'react-router-dom';

interface PriceCardProps {
  item: {
    name: string;
    ticker: string;
    price: number;
    changePct: number;
  };
  type: 'stock' | 'exchange';
  linkTo?: string;
}

const PriceCard: React.FC<PriceCardProps> = ({ item, type, linkTo }) => {
  const isPositive = item.changePct > 0;
  const isNegative = item.changePct < 0;

  const formatPrice = (price: number) => {
    if (type === 'exchange') {
      return price.toFixed(4);
    }
    return price.toFixed(2);
  };

  const formatVariation = (variation: number) => {
    const sign = variation > 0 ? '+' : '';
    return `${sign}${variation.toFixed(2)}%`;
  };

  const getVariationClass = () => {
    if (isPositive) return 'text-green-600';
    if (isNegative) return 'text-red-600';
    return 'text-gray-600';
  };

  const getVariationIcon = () => {
    if (isPositive) return '▲';
    if (isNegative) return '▼';
    return '─';
  };

  const cardContent = (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {item.ticker}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.name}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-gray-500">Precio</span>
          <div className="text-2xl font-bold text-gray-900">
            ${formatPrice(item.price)}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Cambio</span>
          <div className={`text-sm font-semibold ${getVariationClass()}`}>
            <span className="mr-1">{getVariationIcon()}</span>
            {formatVariation(item.changePct)}
          </div>
        </div>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default PriceCard;