
import React from 'react';
import { Restaurant } from '../types';
import { Star, MapPin, DollarSign, ExternalLink, Plus } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onAddToCart: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onAddToCart }) => {
  const renderPrice = (level: number) => {
    return Array(4).fill(0).map((_, i) => (
      <DollarSign 
        key={i} 
        size={14} 
        className={i < level ? "text-orange-600" : "text-gray-300"} 
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={restaurant.imageUrl} 
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-gray-800">{restaurant.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
            {restaurant.name}
          </h3>
          <div className="flex items-center">
            {renderPrice(restaurant.priceLevel)}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3 font-medium uppercase tracking-wider">
          {restaurant.cuisine}
        </p>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <MapPin size={14} className="flex-shrink-0" />
          <span className="truncate">{restaurant.address}</span>
        </div>

        <div className="bg-orange-50 p-3 rounded-xl mb-4">
          <p className="text-sm text-orange-800 leading-relaxed italic line-clamp-2">
            "{restaurant.summary}"
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {restaurant.tags.map(tag => (
            <span key={tag} className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            {restaurant.links && restaurant.links.length > 0 && (
              <a 
                href={restaurant.links[0].uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-tighter"
              >
                Maps <ExternalLink size={10} />
              </a>
            )}
          </div>
          <button 
            onClick={onAddToCart}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-orange-100 active:scale-95"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
