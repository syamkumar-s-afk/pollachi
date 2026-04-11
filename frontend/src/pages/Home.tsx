import React, { useState, useEffect } from 'react';
import { Search, Share2, MapPin, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const CATEGORIES = ["Education", "Finance", "Food & Beverage", "Healthcare", "Real Estate", "Retail", "Services", "Technology", "Travel & Transport", "Automotive", "Grocery", "Restaurant"];

  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  const fetchBusinesses = async () => {
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
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Search Section */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg h-[400px] flex text-center items-center justify-center mt-4">
        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80" alt="Pollachi Cityscape" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-gray-900/20 mix-blend-multiply"></div>
        
        <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">
           <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/20 mb-6 inline-block shadow-sm">Premium Directory</span>
           <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight mb-8">Explore Tamil Nadu's <br className="hidden md:block"/> Best Businesses</h1>
           
           <div className="w-full bg-white p-3 rounded-xl shadow-2xl flex flex-col md:flex-row gap-3 max-w-4xl">
             <select value={city} onChange={(e) => setCity(e.target.value)} className="border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none block w-full p-3 rounded-lg flex-grow transition-colors hover:bg-white">
               <option value="">All Districts</option>
               {["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"].map(d => (
                 <option key={d} value={d}>{d}</option>
               ))}
             </select>
             <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none block w-full p-3 rounded-lg flex-grow transition-colors hover:bg-white">
               <option value="">Category</option>
               {["Education", "Finance", "Food & Beverage", "Healthcare", "Real Estate", "Retail", "Services", "Technology", "Travel & Transport", "Automotive", "Grocery", "Restaurant"].map(c => (
                 <option key={c} value={c}>{c}</option>
               ))}
             </select>
             <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none block w-full p-3 rounded-lg flex-grow transition-colors hover:bg-white">
               <option value="">Sub Category</option>
               {["School", "College", "Restaurant", "Cafe", "Hospital", "Clinic", "Pharmacy", "Supermarket", "Men's Wear", "Women's Wear", "Electronics", "Automotive Repair", "Hotels", "Vegetable, Milk", "Non-veg", "Veg"].map(sc => (
                 <option key={sc} value={sc}>{sc}</option>
               ))}
             </select>
             <button onClick={() => fetchBusinesses()} className="bg-[var(--color-primary)] hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md flex items-center justify-center shrink-0 w-full md:w-auto hover:shadow-lg hover:-translate-y-0.5">
               <Search className="w-5 h-5 mr-2" />
               Search
             </button>
           </div>
        </div>
      </div>

      {/* Rotating Categories Marquee */}
      <div className="w-full overflow-hidden bg-white py-6 border-b border-gray-200 shadow-sm relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        <div className="animate-marquee gap-6 px-4">
           {[...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map((c, i) => (
             <button 
               key={i} 
               onClick={() => navigate(`/listings?category=${encodeURIComponent(c)}`)} 
               className="text-[var(--color-primary)] font-bold px-6 py-2.5 bg-red-50 hover:bg-[var(--color-primary)] hover:text-white rounded-full transition-colors border border-red-100 shadow-sm cursor-pointer whitespace-nowrap"
              >
               {c}
             </button>
           ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Listings */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
             Array(6).fill(0).map((_, i) => (
               <div key={i} className="animate-pulse bg-white p-3 shadow-sm border border-gray-200 flex flex-row gap-3 rounded">
                 <div className="w-32 h-28 bg-gray-200 rounded flex-shrink-0"></div>
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
                <h3 className="text-lg font-bold text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-500 text-sm">We couldn't find anything matching your current filters.</p>
             </div>
           ) : businesses.map((biz, index) => (
            <React.Fragment key={biz.id}>
              <div className="bg-white p-2.5 shadow-sm border border-gray-200 flex flex-row gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group">
                <div className="w-[100px] h-[100px] md:w-32 md:h-28 bg-gray-100 relative overflow-hidden flex-shrink-0 border border-gray-100">
                  <img 
                    src={biz.image?.startsWith('/uploads') ? `${API_URL}${biz.image}` : (biz.image || "https://placehold.co/400x300?text=No+Image")} 
                    alt={biz.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300?text=No+Image"; }}
                  />
                </div>
                <div className="flex flex-col flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-[15px] font-bold text-[#f01a30] m-0 line-clamp-1 leading-tight">{biz.name}</h3>
                    <span className="text-[10px] text-gray-500 font-bold flex-shrink-0 tracking-wider pt-0.5">{biz.adId || '#AdSR001'}</span>
                  </div>
                  <div className="mt-1 flex items-start gap-1.5 text-[11px] text-gray-600 flex-grow">
                    <BookOpen className="w-3.5 h-3.5 flex-shrink-0 text-gray-500 mt-[1px]" />
                    <span className="line-clamp-1 font-medium italic">{biz.category}, {biz.sub_category}</span>
                  </div>
                  <div className="mt-1 flex items-start gap-1.5 text-[11px] text-gray-600 flex-grow">
                     <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-500 mt-[2px]" />
                     <span className="line-clamp-2 leading-snug pr-2 font-medium italic">{biz.address}</span>
                  </div>
                  
                  <div className="mt-2 pt-1 flex flex-wrap gap-2 items-center">
                    <a href={`tel:${biz.phone}`} className="bg-[#ff004f] hover:bg-red-700 text-white text-[11px] font-bold py-1.5 px-4 transition-colors">
                      Mobile
                    </a>
                    <a href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="bg-[#00a859] hover:bg-green-700 text-white text-[11px] font-bold py-1.5 px-4 transition-colors">
                      Whatsapp
                    </a>
                    <button className="flex items-center justify-center gap-1.5 text-[12px] font-bold py-1 px-2 transition-colors text-gray-900 hover:text-gray-600 ml-1">
                      <Share2 className="w-4 h-4 font-bold" /> Share
                    </button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Sidebar Ads */}
        <div className="hidden lg:block space-y-4">
           <div className="bg-white border border-gray-200 h-[600px] flex flex-col shadow-sm">
              <div className="bg-[var(--color-primary)] text-white text-xs font-bold py-1.5 text-center">ADVERTISEMENT</div>
              <div className="flex-grow flex items-center justify-center text-gray-400 text-sm bg-gray-50">
                Responsive Space
              </div>
           </div>
        </div>
      </div>

      {/* Popular Brands Section */}
      <div className="pt-8">
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative">
             <span className="text-[var(--color-primary)] text-sm font-bold uppercase bg-[var(--color-background-gray)] px-6">Popular Brands</span>
          </div>
          <h2 className="text-3xl font-bold mt-4 text-gray-900">These are our popular brands</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
             <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80" alt="Brand 1" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
           </div>
           <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
             <img src="https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=600&q=80" alt="Brand 2" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
           </div>
           <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
             <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80" alt="Brand 3" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
           </div>
        </div>
      </div>

    </div>
  );
}
