import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NearKartLogo } from '../common/NearKartLogo';
import { 
  ArrowLeft, 
  Megaphone, 
  Image as ImageIcon, 
  Video, 
  Calendar, 
  Send, 
  Tag, 
  FileText, 
  Eye, 
  CheckCircle2,
  UploadCloud
} from 'lucide-react';

export const SellerCreateAd: React.FC = () => {
  const { goBack, createAd, showToast } = useApp();

  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [mediaUrl, setMediaUrl] = useState<string>(
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'
  );
  const [adTitle, setAdTitle] = useState('Weekend Special: Flat 20% OFF on all Grocery Staples');
  const [description, setDescription] = useState(
    'Stock up your kitchen with fresh Atta, Basmati Rice, and cold-pressed Oils. Valid for all local deliveries!'
  );
  const [validUntil, setValidUntil] = useState('2025-05-25');

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      showToast('Media uploaded for advertisement preview', 'success');
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !description) {
      showToast('Please enter title and description', 'warning');
      return;
    }

    createAd({
      title: adTitle,
      description,
      validUntil,
      mediaType,
      mediaUrl,
      status: 'Published'
    });
  };

  const handleSaveDraft = () => {
    createAd({
      title: adTitle,
      description,
      validUntil,
      mediaType,
      mediaUrl,
      status: 'Draft'
    });
    showToast('Saved advertisement as draft', 'info');
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

      {/* Top bar with back button */}
      <div className="w-full flex items-center justify-between z-10">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <NearKartLogo size="sm" showTagline={false} />
        <div className="w-10" />
      </div>

      <div className="w-full flex flex-col items-center pt-2 z-10">
        
        {/* Title */}
        <div className="text-left w-full max-w-sm mt-3">
          <h1 className="text-2xl font-extrabold text-[#0B2545] tracking-tight">
            Create Shop Ad
          </h1>
        </div>

        {/* Promote Banner matching screenshot 8 */}
        <div className="w-full max-w-sm mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center gap-3.5 shadow-md">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold leading-tight">Promote your shop</h3>
            <p className="text-[11px] text-blue-100 mt-0.5 leading-snug">
              Upload a photo or video to showcase your products and offers.
            </p>
          </div>
        </div>

        {/* Upload Container matching screenshot 8 */}
        <div className="w-full max-w-sm mt-4 border-2 border-dashed border-blue-200 bg-blue-50/40 rounded-3xl p-5 flex flex-col items-center text-center relative">
          <input
            type="file"
            accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
            onChange={handleMediaUpload}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />

          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h4 className="text-sm font-bold text-slate-900">Upload Photo or Video</h4>

          <button
            type="button"
            className="mt-3 px-5 py-2 rounded-xl bg-white border border-blue-600 text-blue-600 text-xs font-bold shadow-xs hover:bg-blue-50 transition-colors pointer-events-none"
          >
            Choose from Gallery
          </button>

          <span className="text-[10px] text-slate-500 mt-2">
            Max 30 MB • JPG, PNG, MP4
          </span>
        </div>

        {/* Segmented Photo / Video Ad Tabs */}
        <div className="w-full max-w-sm mt-4 grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setMediaType('photo')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mediaType === 'photo'
                ? 'bg-[#004BB7] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photo Ad</span>
          </button>

          <button
            type="button"
            onClick={() => setMediaType('video')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mediaType === 'video'
                ? 'bg-[#004BB7] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Ad</span>
          </button>
        </div>

        {/* Form fields */}
        <form onSubmit={handlePublish} className="w-full max-w-sm mt-4 space-y-3.5">
          
          {/* Ad Title */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>Ad Title</span>
            </label>
            <input
              type="text"
              value={adTitle}
              onChange={(e) => setAdTitle(e.target.value)}
              placeholder="e.g. Weekend Special Offer"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-xs"
              required
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Description</span>
              </label>
              <span className="text-[10px] text-slate-400">{description.length}/500</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="Tell customers about your offer"
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-xs resize-none"
              required
            />
          </div>

          {/* Offer Valid Until */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Offer Valid Until</span>
            </label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-xs"
              required
            />
          </div>

          {/* Ad Preview Box */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Ad Preview</span>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-xs">
              <div className="h-28 relative bg-slate-100">
                <img
                  src={mediaUrl}
                  alt="Ad Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                  Sponsored
                </span>
              </div>
              <div className="p-2.5">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{adTitle || 'Ad Title Preview'}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{description || 'Your description will appear here'}</p>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                  Valid until {validUntil}
                </div>
              </div>
            </div>
          </div>

          {/* Publish Ad Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-[#004BB7] hover:bg-[#003C94] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <span>Publish Ad</span>
            <Send className="w-4 h-4" />
          </button>

          {/* Save as Draft Button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="w-full py-3 px-6 rounded-2xl bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-[0.99] font-bold text-sm flex items-center justify-center transition-all cursor-pointer"
          >
            Save as Draft
          </button>

          {/* Footnote */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Your ad will be reviewed before it goes live.</span>
          </div>

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
