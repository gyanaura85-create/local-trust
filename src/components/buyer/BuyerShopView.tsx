import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerBottomNav } from './BuyerBottomNav';
import { 
  ArrowLeft, 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CheckCircle, 
  Share2,
  Tag
} from 'lucide-react';
import { Product } from '../../types';

export const BuyerShopView: React.FC = () => {
  const { 
    shop, 
    products, 
    cart, 
    addToCart, 
    updateCartQuantity, 
    cartTotal, 
    cartItemCount, 
    navigateTo, 
    goBack,
    showToast 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getProductCartQty = (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 min-h-full pb-16 relative">
      
      {/* Top Shop Banner & Header */}
      <div className="bg-white border-b border-slate-200">
        
        {/* Top Navbar */}
        <div className="p-4 flex items-center justify-between pb-2">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="text-sm font-bold text-slate-800">Store Catalog</span>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('Shop link copied to share with friends', 'success');
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Shop Info Card */}
        <div className="px-4 pb-4 flex items-start gap-3.5">
          <div className="w-18 h-18 rounded-2xl bg-slate-100 overflow-hidden border-2 border-emerald-500 shadow-sm shrink-0">
            <img src={shop.photo} alt={shop.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-slate-900 truncate">{shop.name}</h1>
              <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-600 text-white shrink-0" />
            </div>

            <p className="text-xs text-slate-500 font-medium mt-0.5">{shop.category}</p>

            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3 h-3 fill-amber-500" />
                <span>{shop.rating}</span>
                <span className="text-slate-400 font-normal">({shop.reviewCount})</span>
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Open</span>
              <span>•</span>
              <span>Closes {shop.closingTime}</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{shop.address.split(',')[0]}</span>
            </div>
          </div>
        </div>

        {/* Search inside shop */}
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search products in ${shop.name}...`}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Categories scroll row */}
        <div className="flex items-center gap-1.5 px-4 overflow-x-auto no-scrollbar pb-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Product List Grid */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-3 max-w-lg mx-auto w-full">
        {filteredProducts.map(prod => {
          const qty = getProductCartQty(prod.id);

          return (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-3 shadow-xs border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                {/* Image & Offer badge */}
                <div className="relative w-full h-28 rounded-2xl bg-slate-100 overflow-hidden mb-2">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                  {prod.offer && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold shadow-xs">
                      {prod.offer}
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h3>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{prod.unit || prod.category}</p>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-900">₹{prod.price.toFixed(2)}</div>
                  {prod.originalPrice && (
                    <span className="text-[10px] text-slate-400 line-through">
                      ₹{prod.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {qty > 0 ? (
                  <div className="flex items-center bg-blue-600 text-white rounded-xl shadow-xs">
                    <button
                      onClick={() => updateCartQuantity(prod.id, -1)}
                      className="px-2 py-1 text-xs font-bold hover:bg-blue-700 rounded-l-xl"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-1.5 text-xs font-bold">{qty}</span>
                    <button
                      onClick={() => updateCartQuantity(prod.id, 1)}
                      className="px-2 py-1 text-xs font-bold hover:bg-blue-700 rounded-r-xl"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(prod, shop.id)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar if items in cart */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-16 left-0 right-0 p-4 z-40 max-w-[430px] mx-auto pointer-events-none">
          <div
            onClick={() => navigateTo('buyer_cart')}
            className="pointer-events-auto w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-[#004BB7] text-white shadow-xl shadow-blue-600/30 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs">
                {cartItemCount}
              </div>
              <div>
                <span className="text-xs font-bold block">₹{cartTotal.toFixed(2)}</span>
                <span className="text-[10px] text-blue-200">Extra taxes & fee calculated at checkout</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-extrabold bg-white/20 px-3 py-1.5 rounded-xl">
              <span>View Cart</span>
              <span>›</span>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Bottom Nav */}
      <BuyerBottomNav />

    </div>
  );
};
