import { useState, useEffect } from 'react';
import { Search, Share2, MapPin } from 'lucide-react';

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

export default function Listings() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
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
      
      const res = await fetch(`http://localhost:3001/api/businesses?${query.toString()}`);
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

  const handleSearch = () => {
    fetchBusinesses();
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
          className="border border-gray-300 text-gray-700 text-sm font-medium focus:ring-primary focus:border-[var(--color-primary)] outline-none block w-full p-3"
        >
          <option value="">All Sub-Categories</option>
          {["School", "College", "Restaurant", "Cafe", "Hospital", "Clinic", "Pharmacy", "Supermarket", "Men's Wear", "Women's Wear", "Electronics", "Automotive Repair", "Hotels", "Vegetable, Milk", "Non-veg", "Veg"].map(sc => (
            <option key={sc} value={sc}>{sc}</option>
          ))}
        </select>
        
        <button 
          onClick={handleSearch} 
          className="bg-[var(--color-primary)] hover:bg-red-700 text-white p-3 transition-colors w-full md:w-auto flex items-center justify-center min-w-[120px] font-bold"
        >
          <Search className="w-5 h-5 mr-2" />
          Filter
        </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Listings */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
             <div className="animate-pulse bg-white h-40 rounded shadow-sm border border-gray-200"></div>
           ) : businesses.length === 0 ? (
             <div className="bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-200">
                No businesses found matching your filters.
             </div>
           ) : businesses.map((biz) => (
            <div key={biz.id} className="bg-white p-4 shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
              <div className="sm:w-48 sm:h-auto h-48 flex-shrink-0 bg-gray-100 relative overflow-hidden">
                <img src={biz.image?.startsWith('/uploads') ? `http://localhost:3001${biz.image}` : (biz.image || "https://placehold.co/400x300")} alt={biz.name} className="w-full h-full object-cover" />
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
                  <a href={`tel:${biz.phone}`} className="bg-[var(--color-primary)] hover:bg-red-700 text-white text-sm font-semibold py-2 px-6 transition-colors shadow-sm text-center flex-grow sm:flex-grow-0 rounded">
                    Mobile
                  </a>
                  <a href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="bg-[#1DA851] hover:bg-green-700 text-white text-sm font-semibold py-2 px-6 transition-colors shadow-sm text-center flex-grow sm:flex-grow-0 rounded">
                    Whatsapp
                  </a>
                  <button className="flex items-center justify-center gap-1.5 text-gray-700 hover:text-black text-sm font-semibold py-2 px-4 flex-grow sm:flex-grow-0 bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm rounded">
                    <Share2 className="w-4 h-4" /> Share
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
