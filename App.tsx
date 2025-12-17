
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Restaurant, Location } from './types';
import { GeminiService } from './services/geminiService';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import RestaurantCard from './components/RestaurantCard';
import { UtensilsCrossed, Navigation, AlertCircle, Search, Gift, Clock } from 'lucide-react';

const gemini = new GeminiService();

export type AppTab = 'discovery' | 'offers' | 'orders';

const App: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [query, setQuery] = useState('Best rated restaurants');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(4);
  const [activeTab, setActiveTab] = useState<AppTab>('discovery');
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const fetchRestaurants = useCallback(async (searchQuery: string, loc: Location) => {
    setLoading(true);
    setError(null);
    try {
      const results = await gemini.searchRestaurants(searchQuery, loc);
      setRestaurants(results);
      if (results.length === 0) {
        setError("We couldn't find any results for that search in your area.");
      }
    } catch (err) {
      setError("Failed to fetch restaurants. Please check your connection or API key.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setLocation(loc);
          fetchRestaurants(query, loc);
        },
        (err) => {
          console.error("Location error:", err);
          const fallbackLoc = { latitude: 37.7749, longitude: -122.4194 };
          setLocation(fallbackLoc);
          fetchRestaurants(query, fallbackLoc);
        }
      );
    } else {
      const fallbackLoc = { latitude: 37.7749, longitude: -122.4194 };
      setLocation(fallbackLoc);
      fetchRestaurants(query, fallbackLoc);
    }
  }, []);

  const handleSearch = () => {
    if (location) {
      fetchRestaurants(query, location);
    }
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      const matchesRating = r.rating >= minRating;
      const matchesCuisine = selectedCuisine === 'All' || r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase());
      const matchesPrice = r.priceLevel <= maxPrice;
      return matchesRating && matchesCuisine && matchesPrice;
    });
  }, [restaurants, minRating, selectedCuisine, maxPrice]);

  const renderDiscovery = () => (
    <>
      <FilterBar 
        query={query} 
        setQuery={setQuery} 
        onSearch={handleSearch} 
        isLoading={loading}
        minRating={minRating}
        setMinRating={setMinRating}
        selectedCuisine={selectedCuisine}
        setSelectedCuisine={setSelectedCuisine}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {loading ? (
                <>AI is analyzing your area...</>
              ) : (
                <>
                  <UtensilsCrossed className="text-orange-600" />
                  {selectedCuisine !== 'All' ? `${selectedCuisine} Restaurants` : 'Featured Restaurants'}
                </>
              )}
            </h2>
            {!loading && filteredRestaurants.length > 0 && (
              <p className="text-sm text-gray-500 font-medium">
                Showing {filteredRestaurants.length} results
              </p>
            )}
          </div>
          {location && (
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
              <Navigation size={14} className="text-orange-600" />
              <span>Current Location</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 space-y-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-20 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} onAddToCart={() => setCartCount(prev => prev + 1)} />
            ))}
          </div>
        )}

        {!loading && filteredRestaurants.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No restaurants match your filters</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Try expanding your search parameters or clearing filters.
            </p>
            <button 
              onClick={() => {
                setMinRating(0);
                setSelectedCuisine('All');
                setMaxPrice(4);
              }}
              className="mt-6 text-orange-600 font-bold hover:text-orange-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
    </>
  );

  const renderOffers = () => (
    <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <Gift size={64} className="mx-auto text-orange-600 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Exclusive AI Offers</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Personalized deals based on your favorite restaurants are coming soon. Check back often!
        </p>
        <button 
          onClick={() => setActiveTab('discovery')}
          className="px-8 py-3 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all"
        >
          Explore Restaurants
        </button>
      </div>
    </main>
  );

  const renderOrders = () => (
    <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <Clock size={64} className="mx-auto text-gray-400 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">No Recent Orders</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Once you place an order, you'll be able to track it here in real-time.
        </p>
        <button 
          onClick={() => setActiveTab('discovery')}
          className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all"
        >
          Find Your Next Meal
        </button>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} cartCount={cartCount} />
      
      {activeTab === 'discovery' && renderDiscovery()}
      {activeTab === 'offers' && renderOffers()}
      {activeTab === 'orders' && renderOrders()}

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-4">FlavorFinder AI</h2>
              <p className="text-gray-400 max-w-sm">
                Revolutionizing food delivery by using cutting-edge Gemini AI to help you find the perfect meal every time.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Discover</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => setActiveTab('discovery')} className="hover:text-white">Popular Cities</button></li>
                <li><button onClick={() => { setActiveTab('discovery'); setSelectedCuisine('Italian'); }} className="hover:text-white">Cuisines Near Me</button></li>
                <li><button onClick={() => { setActiveTab('discovery'); setMinRating(4.5); }} className="hover:text-white">Top Rated</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} FlavorFinder AI. Powered by Google Gemini API.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
