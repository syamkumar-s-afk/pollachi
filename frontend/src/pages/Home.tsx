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

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8">
      {/* Hero Ad Slot */}
      <div className="w-full h-auto bg-yellow-400 rounded-xl overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center relative">
        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80" alt="Banner" className="w-full h-[200px] md:h-[300px] object-cover mix-blend-overlay" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
           <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg uppercase italic tracking-wider filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"><span className="text-yellow-300">Advertise Your</span><br /> Business <span className="text-yellow-300">Digitally</span></h1>
           <span className="bg-[var(--color-primary)] text-white font-bold px-6 py-2 rounded-full mt-4 text-xl tracking-wide shadow-lg border-2 border-white">JUST ₹3/DAY</span>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[var(--color-primary)] text-sm font-bold uppercase">Popular Businesses</span>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Explore Business Around Me</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Online business directory and local search platform.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <select value={city} onChange={(e) => setCity(e.target.value)} className="border border-gray-400 text-gray-700 text-sm font-medium focus:ring-primary focus:border-[var(--color-primary)] block w-full md:w-40 p-2.5 bg-white">
            <option value="">All Districts</option>
            {["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-400 text-gray-700 text-sm font-medium focus:ring-primary focus:border-[var(--color-primary)] block w-full md:w-40 p-2.5 bg-white">
            <option value="">Category</option>
            {["Education", "Finance", "Food & Beverage", "Healthcare", "Real Estate", "Retail", "Services", "Technology", "Travel & Transport", "Automotive", "Grocery", "Restaurant"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="border border-gray-400 text-gray-700 text-sm font-medium focus:ring-primary focus:border-[var(--color-primary)] block w-full md:w-40 p-2.5 bg-white">
            <option value="">Sub Category</option>
            {["School", "College", "Restaurant", "Cafe", "Hospital", "Clinic", "Pharmacy", "Supermarket", "Men's Wear", "Women's Wear", "Electronics", "Automotive Repair", "Hotels", "Vegetable, Milk", "Non-veg", "Veg"].map(sc => (
              <option key={sc} value={sc}>{sc}</option>
            ))}
          </select>
          <button onClick={() => fetchBusinesses()} className="bg-[var(--color-primary)] hover:bg-red-700 text-white p-2.5 border border-[var(--color-primary)] transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Listings */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
             <div className="animate-pulse bg-white h-40 rounded shadow-sm"></div>
           ) : businesses.map((biz) => (
            <div key={biz.id} className="bg-white p-4 shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
              <div className="sm:w-48 sm:h-auto h-48 flex-shrink-0 bg-gray-100 relative">
                <img src={biz.image?.startsWith('/uploads') ? `http://localhost:3001${biz.image}` : (biz.image || "https://placehold.co/400x300")} alt={biz.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-[var(--color-primary)] m-0">{biz.name}</h3>
                  <span className="text-xs text-gray-500 font-medium">{biz.adId || '#AdSR001'}</span>
                </div>
                <div className="mt-1 flex items-start gap-2 text-sm text-gray-600 font-medium">
                  <span className="mt-0.5 text-gray-400">#</span> {biz.category}, {biz.sub_category}
                </div>
                <div className="mt-1 flex items-start gap-2 text-sm text-gray-600 font-medium">
                   <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                   <span>{biz.address}</span>
                </div>
                
                <div className="mt-auto pt-4 flex flex-wrap gap-2">
                  <a href={`tel:${biz.phone}`} className="bg-[var(--color-primary)] hover:bg-red-700 text-white text-sm font-semibold py-1.5 px-6 transition-colors shadow-sm text-center flex-grow sm:flex-grow-0">
                    Mobile
                  </a>
                  <a href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="bg-[#1DA851] hover:bg-green-700 text-white text-sm font-semibold py-1.5 px-6 transition-colors shadow-sm text-center flex-grow sm:flex-grow-0">
                    Whatsapp
                  </a>
                  <button className="flex items-center justify-center gap-1.5 text-gray-700 hover:text-black text-sm font-semibold py-1.5 px-4 flex-grow sm:flex-grow-0 bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Inline Ad */}
          <div className="bg-blue-100 h-28 border border-blue-200 shadow-sm flex items-center justify-center relative overflow-hidden">
             <img src="https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?w=800&q=80" alt="Small Banner" className="w-full h-full object-cover opacity-80 absolute" />
             <div className="relative text-white font-bold text-xl drop-shadow-md">Middle Ad Slot Placeholder</div>
          </div>
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
           <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80" alt="Brand 1" className="w-full h-48 object-cover rounded-xl shadow-sm border border-gray-200" />
           <img src="https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=600&q=80" alt="Brand 2" className="w-full h-48 object-cover rounded-xl shadow-sm border border-gray-200" />
           <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80" alt="Brand 3" className="w-full h-48 object-cover rounded-xl shadow-sm border border-gray-200" />
        </div>
      </div>

    </div>
  );
}
