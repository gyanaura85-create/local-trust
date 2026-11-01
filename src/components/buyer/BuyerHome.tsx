import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerBottomNav } from './BuyerBottomNav';
import { 
  Menu, 
  Bell, 
  User, 
  MapPin, 
  ChevronDown, 
  Search, 
  SlidersHorizontal, 
  ArrowRight, 
  CheckCircle,
  Tag,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { NearKartLogo } from '../common/NearKartLogo';

const CATEGORIES = [
  { id: 'grocery', name: 'Grocery', icon: '🧺', color: 'from-amber-100 to-orange-100' },
  { id: 'fashion', name: 'Fashion', icon: '👕', color: 'from-blue-100 to-indigo-100' },
  { id: 'electronics', name: 'Electronics', icon: '💻', color: 'from-sky-100 to-cyan-100' },
  { id: 'home', name: 'Home', icon: '🛋️', color: 'from-indigo-100 to-purple-100' },
  { id: 'beauty', name: 'Beauty', icon: '💄', color: 'from-pink-100 to-rose-100' },
  { id: 'pharmacy', name: 'Pharmacy', icon: '💊', color: 'from-teal-100 to-emerald-100' },
  { id: 'food', name: 'Food', icon: '🍽️', color: 'from-yellow-100 to-amber-100' },
  { id: 'more', name: 'More', icon: '•••', color: 'from-slate-100 to-blue-100' }
];

export const BuyerHome: React.FC = () => {
  const { 
    userLocation, 
    setUserLocation, 
    allShops, 
    navigateTo, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [activePromoIndex, setActivePromoIndex] = useState(0);

  const locations = [
    'Bapuji Nagar, Bhubaneswar, Odisha',
    'Saheed Nagar, Bhubaneswar, Odisha',
    'Patia Square, Bhubaneswar, Odisha',
    'Khandagiri, Bhubaneswar, Odisha',
    'Janpath Market, Bhubaneswar, Odisha'
  ];

  const handleSelectShop = (shopId: string) => {
    navigateTo('buyer_shop_view');
  };

  const handleCategoryClick = (catName: string) => {
    if (catName === 'More') {
      navigateTo('buyer_categories');
    } else {
      navigateTo('buyer_shop_view');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F1F5F9] min-h-full">
      
      {/* Top Royal Blue Header matching screenshot 14 */}
      <div className="w-full bg-[#004BB7] text-white px-5 pt-3 pb-6">
        
        {/* Nav Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('buyer_profile_view')}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <NearKartLogo size="sm" showTagline={false} className="flex-row items-center gap-1.5" />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => showToast('Order #NK1254 status updated to In Progress', 'info')}
              className="relative p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#004BB7]" />
            </button>
            <button
              onClick={() => navigateTo('buyer_profile_view')}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hello Shopper Greeting */}
        <div className="mt-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Hello, <span className="text-emerald-400">Shopper !</span></span>
            <span className="text-xl">👋</span>
          </h1>

          {/* Location Dropdown Selector */}
          <div className="relative mt-1">
            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white transition-colors cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <MapPin className="w-2.5 h-2.5" />
              </div>
              <span className="font-medium">Delivering to •</span>
              <span className="font-bold underline max-w-[200px] truncate">{userLocation.split(',')[0]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
            </button>

            {showLocationPicker && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-40 text-slate-800">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Delivery Location
                </div>
                {locations.map(loc => (
                  <button
                    key={loc}
                    onClick={() => {
                      setUserLocation(loc);
                      setShowLocationPicker(false);
                      showToast(`Showing shops delivering to ${loc.split(',')[0]}`, 'success');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-blue-50 font-medium flex items-center justify-between"
                  >
                    <span className="truncate">{loc}</span>
                    {userLocation === loc && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar matching screenshot 14 */}
        <div className="mt-4 flex items-center bg-white rounded-2xl shadow-sm p-1">
          <div className="pl-3 pr-2 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, shops, and categories"
            className="flex-1 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <div className="h-5 w-px bg-slate-200 mx-1" />
          <button
            onClick={() => showToast('Filters applied to local inventory', 'info')}
            className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Body */}
      <div className="flex-1 px-4 py-4 space-y-4">
        
        {/* Explore Categories Box matching screenshot 14 */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
              <div className="w-3.5 h-3.5 grid grid-cols-2 gap-0.5">
                <div className="bg-blue-600 rounded-xs" />
                <div className="bg-blue-600 rounded-xs" />
                <div className="bg-blue-600 rounded-xs" />
                <div className="bg-blue-600 rounded-xs" />
              </div>
              <span>Explore Categories</span>
            </div>

            <button
              onClick={() => navigateTo('buyer_categories')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 8 Categories Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all cursor-pointer group"
              >
                <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-1.5 text-center group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Great Deals Near You Promo Banner matching screenshot 14 */}
        <div 
          onClick={() => navigateTo('buyer_shop_view')}
          className="relative rounded-3xl bg-gradient-to-r from-emerald-100 via-teal-50 to-blue-100 p-4 shadow-sm border border-emerald-200/60 overflow-hidden cursor-pointer group"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="max-w-[170px]">
              <div className="text-base sm:text-lg font-black leading-tight">
                <span className="text-[#0B2545] block">Great deals</span>
                <span className="text-emerald-600 block">near you</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                Discover offers from local shops
              </p>
              
              {/* Pagination indicators matching screenshot 14 */}
              <div className="flex items-center gap-1.5 mt-3">
                <span className="w-4 h-1.5 bg-blue-600 rounded-full" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
              </div>
            </div>

            {/* Shopping cart with bags 3D graphic */}
            <div className="w-28 h-24 relative flex items-center justify-center">
              <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform">
                {/* Bags */}
                <rect x="25" y="15" width="20" height="35" rx="3" fill="#2563EB" />
                <rect x="42" y="10" width="22" height="40" rx="3" fill="#16A34A" />
                <rect x="60" y="20" width="18" height="30" rx="3" fill="#F59E0B" />
                {/* 3D Discount Tag */}
                <g transform="translate(75, 45)">
                  <polygon points="10,0 30,0 20,30 0,30" fill="#22C55E" />
                  <text x="7" y="22" fill="#FFFFFF" fontSize="16" fontWeight="bold">%</text>
                </g>
                {/* Cart Body */}
                <path d="M10 35H85L78 70H25L10 35Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
                <line x1="20" y1="48" x2="80" y2="48" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <line x1="22" y1="58" x2="75" y2="58" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                {/* Wheels */}
                <circle cx="34" cy="78" r="7" fill="#1E40AF" stroke="#93C5FD" strokeWidth="2" />
                <circle cx="68" cy="78" r="7" fill="#1E40AF" stroke="#93C5FD" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Shops Near You matching screenshot 14 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <span>Shops Near You</span>
            </div>

            <button
              onClick={() => navigateTo('buyer_shop_view')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Local Shops Grid / Carousel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allShops.map(shopItem => (
              <div
                key={shopItem.id}
                onClick={() => handleSelectShop(shopItem.id)}
                className="bg-white rounded-3xl p-3 shadow-xs border border-slate-200/80 hover:shadow-md transition-shadow cursor-pointer flex items-center gap-3"
              >
                {/* Shop Photo */}
                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200/80 shrink-0">
                  <img
                    src={shopItem.photo}
                    alt={shopItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {shopItem.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {shopItem.category}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Open</span>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500 font-medium">
                      {shopItem.distance}
                    </span>
                  </div>
                </div>

                <div className="text-slate-400 pr-1">
                  ›
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Buyer Bottom Nav */}
      <BuyerBottomNav />

    </div>
  );
};
