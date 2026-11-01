import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SellerBottomNav } from './SellerBottomNav';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  Package,
  Layers,
  Check
} from 'lucide-react';
import { Product } from '../../types';

export const SellerProducts: React.FC = () => {
  const { 
    products, 
    navigateTo, 
    setSelectedProductForEdit, 
    updateProduct, 
    deleteProduct, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>('All');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeActionDropdownId, setActiveActionDropdownId] = useState<string | null>(null);

  // Categories list
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtering
  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesStock = selectedStockFilter === 'All' || prod.status === selectedStockFilter;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleEdit = (prod: Product) => {
    setSelectedProductForEdit(prod);
    setActiveActionDropdownId(null);
    navigateTo('seller_add_product');
  };

  const handleQuickStockToggle = (prod: Product) => {
    const nextStatus = prod.status === 'In Stock' ? 'Out of Stock' : 'In Stock';
    const nextStock = nextStatus === 'In Stock' ? 25 : 0;
    updateProduct(prod.id, { status: nextStatus, stock: nextStock });
    setActiveActionDropdownId(null);
    showToast(`${prod.name} marked as ${nextStatus}`, 'info');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      setActiveActionDropdownId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-white min-h-full">
      
      {/* Top Header & Search Area */}
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-white sticky top-0 z-20">
        
        {/* Title & Add Product Button */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              All Products
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {products.length} products in total
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedProductForEdit(null);
              navigateTo('seller_add_product');
            }}
            className="px-3.5 py-2 rounded-xl bg-[#004BB7] hover:bg-[#003C94] active:scale-[0.98] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilterModal(!showFilterModal)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              selectedCategory !== 'All' || selectedStockFilter !== 'All'
                ? 'bg-blue-50 border-blue-400 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
            {(selectedCategory !== 'All' || selectedStockFilter !== 'All') && (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </button>
        </div>

        {/* Filter Popover */}
        {showFilterModal && (
          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-md space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Stock Status</label>
              <div className="flex gap-1.5">
                {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedStockFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedStockFilter === st
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedStockFilter('All');
                  setShowFilterModal(false);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 mr-3"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Products Table Container */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3 sm:px-4">Product</th>
              <th className="py-3 px-2 sm:px-3">Price</th>
              <th className="py-3 px-2 sm:px-3">Stock</th>
              <th className="py-3 px-2 sm:px-3">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">No products found</p>
                  <p className="text-xs text-slate-400 mt-1">Try a different search term or add a product</p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Product Cell: Image + Name + Subcategory */}
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate">
                          {prod.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-2 sm:px-3 font-extrabold text-slate-900 whitespace-nowrap">
                    ₹{prod.price.toFixed(2)}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-2 sm:px-3 whitespace-nowrap font-semibold">
                    <span className={
                      prod.stock === 0 ? 'text-rose-600' :
                      prod.stock < 30 ? 'text-amber-600' : 'text-emerald-700'
                    }>
                      {prod.stock} units
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-2 sm:px-3 whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      prod.status === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : prod.status === 'Low Stock'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    }`}>
                      {prod.status}
                    </span>
                  </td>

                  {/* Action Dropdown */}
                  <td className="py-3 px-3 text-right whitespace-nowrap relative">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionDropdownId(activeActionDropdownId === prod.id ? null : prod.id);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Edit</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeActionDropdownId === prod.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 text-left">
                          <button
                            onClick={() => handleEdit(prod)}
                            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 flex items-center gap-2"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Edit Product</span>
                          </button>

                          <button
                            onClick={() => handleQuickStockToggle(prod)}
                            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 flex items-center gap-2"
                          >
                            <Layers className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{prod.status === 'In Stock' ? 'Mark Out of Stock' : 'Restock 25 units'}</span>
                          </button>

                          <div className="h-px bg-slate-100 my-1" />

                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Delete Product</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Seller Bottom Nav */}
      <SellerBottomNav />

    </div>
  );
};
