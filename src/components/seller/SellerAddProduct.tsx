import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NearKartLogo } from '../common/NearKartLogo';
import { 
  ArrowLeft, 
  Camera, 
  Tag, 
  Layers, 
  IndianRupee, 
  Box, 
  Percent, 
  Calendar, 
  FileText, 
  CloudUpload, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

const CATEGORIES = [
  'Atta, Rice & Dal',
  'Oil & Ghee',
  'Masala & Spices',
  'Beverages',
  'Snacks & Biscuits',
  'Personal Care',
  'Home Care',
  'Dairy & Bread',
  'Fashion & Wear',
  'Electronics'
];

export const SellerAddProduct: React.FC = () => {
  const { 
    goBack, 
    addProduct, 
    selectedProductForEdit, 
    updateProduct, 
    setSelectedProductForEdit, 
    showToast,
    navigateTo 
  } = useApp();

  const isEditing = Boolean(selectedProductForEdit);

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [offer, setOffer] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'
  );
  const [showCatMenu, setShowCatMenu] = useState(false);

  useEffect(() => {
    if (selectedProductForEdit) {
      setName(selectedProductForEdit.name);
      setCategory(selectedProductForEdit.category);
      setPrice(selectedProductForEdit.price.toString());
      setStock(selectedProductForEdit.stock.toString());
      setOffer(selectedProductForEdit.offer || '');
      setExpiryDate(selectedProductForEdit.expiryDate || '');
      setDescription(selectedProductForEdit.description || '');
      setImage(selectedProductForEdit.image);
    }
  }, [selectedProductForEdit]);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      showToast('Product photo attached', 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || !description) {
      showToast('Please fill all mandatory fields (*)', 'warning');
      return;
    }

    const numPrice = parseFloat(price);
    const numStock = parseInt(stock, 10);
    const status = numStock === 0 ? 'Out of Stock' : numStock < 20 ? 'Low Stock' : 'In Stock';

    if (isEditing && selectedProductForEdit) {
      updateProduct(selectedProductForEdit.id, {
        name,
        category,
        price: numPrice,
        stock: numStock,
        offer: offer || undefined,
        expiryDate: expiryDate || undefined,
        description,
        image,
        status
      });
      setSelectedProductForEdit(null);
      navigateTo('seller_products');
    } else {
      addProduct({
        name,
        category,
        price: numPrice,
        originalPrice: offer ? numPrice * 1.2 : undefined,
        stock: numStock,
        offer: offer || undefined,
        expiryDate: expiryDate || undefined,
        description,
        image,
        status
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[750px] flex flex-col justify-between p-6 bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#FFFFFF] overflow-y-auto no-scrollbar">
      
      {/* Top curved swooshes */}
      <div className="absolute top-0 left-0 w-80 h-36 pointer-events-none opacity-90">
        <svg viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M-40 -20C40 40 180 60 260 10L180 -40Z" fill="#155EEF" fillOpacity="0.8" />
          <path d="M-20 -10C60 50 200 70 300 -10L220 -30Z" fill="#16A34A" fillOpacity="0.8" />
        </svg>
      </div>

      {/* Top Navigation */}
      <div className="w-full flex items-center justify-between z-10">
        <button
          onClick={() => {
            setSelectedProductForEdit(null);
            goBack();
          }}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <NearKartLogo size="sm" showTagline={false} />
        <div className="w-10" />
      </div>

      <div className="w-full flex flex-col items-center pt-1 z-10">
        
        {/* Header Illustration & Title */}
        <div className="w-full max-w-sm flex items-center justify-between mt-3 mb-2">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0B2545] tracking-tight">
              {isEditing ? 'Edit Product' : 'Add Product'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              List your product and reach more customers
            </p>
          </div>

          {/* Awning with package */}
          <div className="w-16 h-16 relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-700 relative shadow-sm">
              <Box className="w-7 h-7" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                +
              </div>
            </div>
          </div>
        </div>

        {/* Upload Product Photo Box */}
        <div className="w-full max-w-sm mt-3 border-2 border-dashed border-blue-200 bg-blue-50/40 rounded-3xl p-4 flex flex-col items-center text-center relative hover:bg-blue-50/70 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleImagePick}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />

          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-1 overflow-hidden shadow-xs">
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-7 h-7" />
            )}
          </div>

          <h4 className="text-xs font-bold text-slate-900 mt-1">Upload Product Photo</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Tap to select photo from gallery
          </p>
          <span className="text-[9px] text-slate-400 mt-1">
            JPG, PNG • Max 5MB
          </span>
        </div>

        {/* Product Details Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm mt-4 space-y-3">
          
          {/* Product Name */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name (e.g. Aashirvaad Atta 5kg)"
                className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {/* Product Category Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCatMenu(!showCatMenu)}
              className="w-full bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs text-left cursor-pointer hover:border-blue-400"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Product Category <span className="text-rose-500">*</span>
                </label>
                <div className="text-xs font-medium text-slate-900 truncate">{category}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showCatMenu && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl p-1 z-30 max-h-48 overflow-y-auto">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setShowCatMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl font-medium transition-colors ${
                      category === cat ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price & Stock Quantity Grid */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Price */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-2.5 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Price <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="₹ Price"
                  className="w-full text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            {/* Stock Quantity */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-2.5 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Box className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Stock Qty <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Quantity"
                  className="w-full text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  required
                />
              </div>
            </div>

          </div>

          {/* Offer (Optional) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Percent className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Offer <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="e.g. 20% OFF or Buy 1 Get 1"
                className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Expiry Date (Optional) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Expiry Date <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full text-xs font-medium text-slate-900 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Product Description */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <label className="text-[11px] font-bold text-slate-700">
                  Product Description <span className="text-rose-500">*</span>
                </label>
              </div>
              <span className="text-[10px] text-slate-400">{description.length}/500</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="Describe your product in detail..."
              rows={3}
              className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent resize-none"
              required
            />
          </div>

          {/* Green check notice */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Your product will be reviewed before it goes live.</span>
          </div>

          {/* Add Product Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-[#004BB7] hover:bg-[#003C94] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <CloudUpload className="w-4 h-4" />
            <span>{isEditing ? 'Save Product Changes' : 'Add Product'}</span>
          </button>

        </form>

      </div>

      <div className="w-full relative mt-6 flex flex-col items-center pointer-events-none">
        <svg viewBox="0 0 400 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M-10 25C120 10 280 15 410 25V35H-10Z" fill="#155EEF" fillOpacity="0.8" />
          <path d="M-10 28C140 18 270 18 410 28V35H-10Z" fill="#16A34A" />
        </svg>
      </div>

    </div>
  );
};
