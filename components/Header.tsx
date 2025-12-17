
import React from 'react';
import { ShoppingBag, User, MapPin } from 'lucide-react';
import { AppTab } from '../App';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, cartCount }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-20 flex items-center sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-10">
          <button 
            onClick={() => setActiveTab('discovery')}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight hidden sm:block">
              FlavorFinder <span className="text-orange-600">AI</span>
            </h1>
          </button>

          <nav className="hidden md:flex items-center gap-8 h-20">
            <button 
              onClick={() => setActiveTab('discovery')}
              className={`text-sm font-bold h-full transition-all border-b-2 px-1 flex items-center ${
                activeTab === 'discovery' 
                  ? "text-gray-900 border-orange-600" 
                  : "text-gray-400 border-transparent hover:text-orange-600"
              }`}
            >
              Restaurants
            </button>
            <button 
              onClick={() => setActiveTab('offers')}
              className={`text-sm font-bold h-full transition-all border-b-2 px-1 flex items-center ${
                activeTab === 'offers' 
                  ? "text-gray-900 border-orange-600" 
                  : "text-gray-400 border-transparent hover:text-orange-600"
              }`}
            >
              Offers
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`text-sm font-bold h-full transition-all border-b-2 px-1 flex items-center ${
                activeTab === 'orders' 
                  ? "text-gray-900 border-orange-600" 
                  : "text-gray-400 border-transparent hover:text-orange-600"
              }`}
            >
              Past Orders
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
            <MapPin size={18} className="text-orange-600" />
            <span className="text-sm font-bold text-gray-800">Local Area</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-gray-500 hover:text-orange-600 transition-colors rounded-full hover:bg-orange-50">
              <User size={24} />
            </button>
            <button className="relative p-2 text-gray-500 hover:text-orange-600 transition-colors rounded-full hover:bg-orange-50">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
