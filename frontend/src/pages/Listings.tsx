import { useState, useEffect, useCallback } from 'react';
import { Search, Share2, MapPin, SearchX, Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface Business {
  id: number;
  name: string;
  category: string;
  sub_category: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  image: string;
  adId: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const CATEGORY_MAP: Record<string, string[]> = {
  "Education": ["School", "College"],
  "Food & Beverage": ["Cafe"],
  "Healthcare": ["Hospital", "Clinic", "Pharmacy"],
  "Retail": ["Supermarket", "Men's Wear", "Women's Wear", "Electronics"],
  "Services": ["Hotels"],
  "Automotive": ["Automotive Repair"],
  "Grocery": ["Vegetable, Milk"],
  "Restaurant": ["Veg", "Non-veg", "Restaurant"]
};
const ALL_SUB_CATEGORIES = ["School", "College", "Restaurant", "Cafe", "Hospital", "Clinic", "Pharmacy", "Supermarket", "Men's Wear", "Women's Wear", "Electronics", "Automotive Repair", "Hotels", "Vegetable, Milk", "Non-veg", "Veg"];

export default function Listings() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  // Filter States initialized from URL
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [subCategory, setSubCategory] = useState(searchParams.get('sub_category') || '');

  // Keep state in sync if URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCity(params.get('city') || '');
    setCategory(params.get('category') || '');
    setSubCategory(params.get('sub_category') || '');
  }, [location.search]);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (city) query.append('city', city);
      if (category) query.append('category', category);
      if (subCategory) query.append('sub_category', subCategory);
      
      const res = await fetch(`${API_URL}/api/businesses?${query.toString()}`);
      const data = await res.json();
      setBusinesses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [city, category, subCategory]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  useEffect(() => {
    if (category && CATEGORY_MAP[category] && !CATEGORY_MAP[category].includes(subCategory)) {
      setSubCategory('');
    }
  }, [category]);

  const handleShare = async (biz: Business) => {
    const shareData = {
      title: biz.name,
      text: `Check out ${biz.name} in ${biz.city} on Pollachi Directory!`,
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setCopiedId(biz.id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const clearFilters = () => {
    setCity('');
    setCategory('');
    setSubCategory('');
  };

  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div className="bg-white p-6 shadow-sm border border-gray-200 text-center">
         <h1 className="text-3xl font-black text-gray-900 tracking-tight">Business Listings</h1>
         <p className="text-sm text-gray-500 font-medium mt-2">Filter and find the best local businesses.</p>
      </div>

      {/* Search/Filter Section */}
      <div className="bg-white p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <select 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          className="border border-gray-300 text-gray-700 text-sm font-medium focus:ring-primary focus:border-[var(--color-primary)] outline-none block w-full p-3"
        >
          <option value="">All Districts</option>
          {["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="border border-gray-300 text-gray-700 text-sm font-medium focus:ring-primary focus:border-[var(--color-primary)] outline-none block w-full p-3"
        >
          <option value="">All Categories</option>
          {["Education", "Finance", "Food & Beverage", "Healthcare", "Real Estate", "Retail", "Services", "Technology", "Travel & Transport", "Automotive", "Grocery", "Restaurant"].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        
        <select 
          value={subCategory} 
          onChange={(e) => setSubCategory(e.target.value)} 
          className="border border-gray-300 text-gray-700 text-sm font-medium focus:ring-primary focus:border-[var(--color-primary)] outline-none block w-full p-3 disabled:opacity-50 disabled:bg-gray-100"
          disabled={!!category && (!CATEGORY_MAP[category] || CATEGORY_MAP[category].length === 0)}
        >
          <option value="">All Sub-Categories</option>
          {(category && CATEGORY_MAP[category] ? CATEGORY_MAP[category] : ALL_SUB_CATEGORIES).map(sc => (
            <option key={sc} value={sc}>{sc}</option>
          ))}
        </select>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Listings */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
             Array(4).fill(0).map((_, i) => (
               <div key={i} className="animate-pulse bg-white p-4 shadow-sm border border-gray-200 flex flex-col xl:flex-row gap-4 rounded">
                 <div className="xl:w-48 xl:h-auto h-48 flex-shrink-0 bg-gray-200 rounded"></div>
                 <div className="flex flex-col flex-grow w-full space-y-3 pt-2">
                   <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                   <div className="mt-auto h-12 w-full bg-gray-200 rounded pt-4 mt-6"></div>
                 </div>
               </div>
             ))
           ) : businesses.length === 0 ? (
             <div className="md:col-span-2 bg-white p-12 text-center shadow-sm border border-gray-200 flex flex-col items-center justify-center rounded">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <SearchX className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-500 mb-6 text-sm">We couldn't find anything matching your current filters.</p>
                <button onClick={clearFilters} className="bg-[var(--color-primary)] hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition-colors text-sm shadow-sm inline-flex items-center">
                  Clear all filters
                </button>
             </div>
           ) : businesses.map((biz) => (
            <div key={biz.id} className="bg-white p-4 shadow-sm border border-gray-200 flex flex-col xl:flex-row gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300 rounded group">
              <div className="xl:w-48 xl:h-auto h-48 flex-shrink-0 bg-gray-100 relative overflow-hidden rounded">
                <img 
                  src={biz.image?.startsWith('/uploads') ? `${API_URL}${biz.image}` : (biz.image || "https://placehold.co/400x300?text=No+Image")} 
                  alt={biz.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300?text=No+Image"; }}
                />
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-[var(--color-primary)] m-0">{biz.name}</h3>
                  <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">{biz.adId || '#AdSR001'}</span>
                </div>
                <div className="mt-2 flex items-start gap-2 text-sm text-gray-600 font-medium">
                  <span className="mt-0.5 text-gray-400">#</span> {biz.category}, {biz.sub_category}
                </div>
                <div className="mt-1 flex items-start gap-2 text-sm text-gray-600 font-medium">
                   <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                   <span>{biz.address}</span>
                </div>
                
                <div className="mt-auto pt-4 flex flex-wrap gap-2">
                  <a href={`tel:${biz.phone}`} className="bg-[var(--color-primary)] hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 transition-colors shadow-sm text-center flex-grow xl:flex-grow-0 rounded hover:scale-[1.02] active:scale-95">
                    Mobile
                  </a>
                  <a href={`https://wa.me/${biz.whatsapp.replace(/\\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="bg-[#1DA851] hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 transition-colors shadow-sm text-center flex-grow xl:flex-grow-0 rounded hover:scale-[1.02] active:scale-95">
                    Whatsapp
                  </a>
                  <button onClick={() => handleShare(biz)} className={`flex items-center justify-center gap-1.5 text-sm font-semibold py-2 px-4 flex-grow xl:flex-grow-0 transition-colors shadow-sm rounded border ${copiedId === biz.id ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 hover:text-[var(--color-primary)] hover:bg-red-50 border-gray-100'}`}>
                    {copiedId === biz.id ? <><Check className="w-4 h-4" /> Copied!</> : <><Share2 className="w-4 h-4" /> Share</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Ads */}
        <div className="hidden lg:block space-y-4">
           {/* Top part red, bottom gray area */}
           <div className="bg-white border border-gray-200 h-[600px] flex flex-col shadow-sm overflow-hidden">
              <div className="bg-[var(--color-primary)] text-white text-xs font-bold py-2 text-center">ADVERTISEMENT</div>
              <div className="flex-grow flex items-center justify-center text-gray-400 text-sm bg-gray-50">
                Responsive Space
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
