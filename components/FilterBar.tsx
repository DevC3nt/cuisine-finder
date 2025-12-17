
import React from 'react';
import { Search, SlidersHorizontal, ChevronDown, Star, DollarSign, X } from 'lucide-react';

interface FilterBarProps {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  minRating: number;
  setMinRating: (rating: number) => void;
  selectedCuisine: string;
  setSelectedCuisine: (cuisine: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  query, 
  setQuery, 
  onSearch, 
  isLoading,
  minRating,
  setMinRating,
  selectedCuisine,
  setSelectedCuisine,
  maxPrice,
  setMaxPrice
}) => {
  const cuisines = ["All", "Italian", "Japanese", "Mexican", "Chinese", "Indian", "American", "Thai"];
  
  const ratingOptions = [
    { label: "Any Rating", value: 0 },
    { label: "3.5+ Stars", value: 3.5 },
    { label: "4.0+ Stars", value: 4.0 },
    { label: "4.5+ Stars", value: 4.5 },
  ];

  const priceOptions = [
    { label: "All Prices", value: 4 },
    { label: "Under $$", value: 2 },
    { label: "Under $$$", value: 3 },
  ];

  const isFiltered = minRating > 0 || selectedCuisine !== 'All' || maxPrice < 4;

  return (
    <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search for restaurants, cuisines, or dishes..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-gray-800"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            />
          </div>
          <button 
            onClick={onSearch}
            disabled={isLoading}
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-200 flex items-center justify-center min-w-[140px]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : 'Find Food'}
          </button>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => {
              setMinRating(0);
              setSelectedCuisine('All');
              setMaxPrice(4);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
              isFiltered 
                ? "bg-gray-900 border-gray-900 text-white" 
                : "bg-white border-gray-200 text-gray-700 hover:border-orange-500"
            }`}
          >
            {isFiltered ? <X size={16} /> : <SlidersHorizontal size={16} />}
            {isFiltered ? "Clear Filters" : "Filters"}
          </button>
          
          <div className="h-6 w-px bg-gray-200 mx-2 flex-shrink-0" />

          {/* Rating Dropdown */}
          <div className="relative group flex-shrink-0">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              minRating > 0 ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-white border-gray-200 text-gray-600 hover:border-orange-500"
            }`}>
              <Star size={14} className={minRating > 0 ? "fill-orange-600" : ""} />
              {minRating === 0 ? "Rating" : `${minRating}+`}
              <ChevronDown size={14} />
            </div>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              {ratingOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMinRating(opt.value)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-orange-50 transition-colors ${
                    minRating === opt.value ? "text-orange-600 font-bold bg-orange-50/50" : "text-gray-700 font-medium"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Dropdown */}
          <div className="relative group flex-shrink-0">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              maxPrice < 4 ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-white border-gray-200 text-gray-600 hover:border-orange-500"
            }`}>
              <DollarSign size={14} className={maxPrice < 4 ? "text-orange-600" : ""} />
              {maxPrice === 4 ? "Price" : `Under ${'$'.repeat(maxPrice)}`}
              <ChevronDown size={14} />
            </div>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              {priceOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMaxPrice(opt.value)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-orange-50 transition-colors ${
                    maxPrice === opt.value ? "text-orange-600 font-bold bg-orange-50/50" : "text-gray-700 font-medium"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-gray-200 mx-2 flex-shrink-0" />

          {cuisines.map(cuisine => (
            <button 
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                cuisine === selectedCuisine 
                  ? "bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-100" 
                  : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
