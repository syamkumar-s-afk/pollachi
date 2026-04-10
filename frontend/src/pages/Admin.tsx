import { useState, useEffect } from 'react';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    id: null,
    name: '',
    category: '',
    sub_category: '',
    city: '',
    address: '',
    phone: '',
    whatsapp: '',
    adId: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomSubCategory, setIsCustomSubCategory] = useState(false);
  const [isCustomCity, setIsCustomCity] = useState(false);

  const CATEGORIES = ["Education", "Finance", "Food & Beverage", "Healthcare", "Real Estate", "Retail", "Services", "Technology", "Travel & Transport", "Automotive", "Grocery", "Restaurant"];
  const ALL_SUB_CATEGORIES = ["School", "College", "Restaurant", "Cafe", "Hospital", "Clinic", "Pharmacy", "Supermarket", "Men's Wear", "Women's Wear", "Electronics", "Automotive Repair", "Hotels", "Vegetable, Milk", "Non-veg", "Veg"];
  const CITIES = ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"];

  useEffect(() => {
    if (token) fetchBusinesses();
  }, [token]);

  const fetchBusinesses = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/businesses');
      const data = await res.json();
      setBusinesses(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        alert('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as string);
    });
    if (file) formData.append('imageFile', file);

    const url = form.id ? `http://localhost:3001/api/businesses/${form.id}` : 'http://localhost:3001/api/businesses';
    const method = form.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert('Saved successfully');
        setForm({ id: null, name: '', category: '', sub_category: '', city: '', address: '', phone: '', whatsapp: '', adId: '' });
        setIsCustomCategory(false);
        setIsCustomSubCategory(false);
        setIsCustomCity(false);
        setFile(null);
        fetchBusinesses();
      } else {
        alert('Error saving');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`http://localhost:3001/api/businesses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBusinesses();
    } catch (e) {
      console.error(e);
    }
  };

  const editBusiness = (b: any) => {
    setForm({ ...b });
    setIsCustomCategory(b.category && !CATEGORIES.includes(b.category));
    setIsCustomSubCategory(b.sub_category && !ALL_SUB_CATEGORIES.includes(b.sub_category));
    setIsCustomCity(b.city && !CITIES.includes(b.city));
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded p-2" required />
          </div>
          <button disabled={loading} className="w-full bg-[var(--color-primary)] text-white py-2 rounded hover:bg-red-700 disabled:opacity-50">Log In</button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button onClick={logout} className="text-gray-500 hover:text-black">Logout</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="font-bold text-lg mb-4">{form.id ? 'Edit' : 'Add'} Business</h3>
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border p-2 rounded" required />
            
            <select 
              value={isCustomCategory ? "Others" : form.category} 
              onChange={(e) => {
                if (e.target.value === "Others") {
                  setIsCustomCategory(true);
                  setForm({...form, category: ''});
                } else {
                  setIsCustomCategory(false);
                  setForm({...form, category: e.target.value});
                }
              }}
              className="w-full border p-2 rounded outline-none"
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="Others">Others</option>
            </select>
            
            {isCustomCategory && (
              <input 
                placeholder="Custom Category Name" 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})} 
                className="w-full border p-2 rounded" 
                required 
              />
            )}

            <select 
              value={isCustomSubCategory ? "Others" : form.sub_category} 
              onChange={(e) => {
                if (e.target.value === "Others") {
                  setIsCustomSubCategory(true);
                  setForm({...form, sub_category: ''});
                } else {
                  setIsCustomSubCategory(false);
                  setForm({...form, sub_category: e.target.value});
                }
              }}
              className="w-full border p-2 rounded outline-none"
              required
            >
              <option value="">Select Sub Category</option>
              {ALL_SUB_CATEGORIES.map(sc => <option key={sc} value={sc}>{sc}</option>)}
              <option value="Others">Others</option>
            </select>
            
            {isCustomSubCategory && (
              <input 
                placeholder="Custom Sub Category Name" 
                value={form.sub_category} 
                onChange={e => setForm({...form, sub_category: e.target.value})} 
                className="w-full border p-2 rounded" 
                required 
              />
            )}

            <select 
              value={isCustomCity ? "Others" : form.city} 
              onChange={(e) => {
                if (e.target.value === "Others") {
                  setIsCustomCity(true);
                  setForm({...form, city: ''});
                } else {
                  setIsCustomCity(false);
                  setForm({...form, city: e.target.value});
                }
              }}
              className="w-full border p-2 rounded outline-none"
              required
            >
              <option value="">Select City</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="Others">Others</option>
            </select>
            
            {isCustomCity && (
              <input 
                placeholder="Custom City Name" 
                value={form.city} 
                onChange={e => setForm({...form, city: e.target.value})} 
                className="w-full border p-2 rounded" 
                required 
              />
            )}
            <textarea placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border p-2 rounded" required />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border p-2 rounded" required />
            <input placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full border p-2 rounded" required />
            <input placeholder="Ad ID (e.g. #AdSR001)" value={form.adId} onChange={e => setForm({...form, adId: e.target.value})} className="w-full border p-2 rounded" />
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Image Upload</label>
              <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-xs" />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
            {form.id && <button type="button" onClick={() => {setForm({id: null, name: '', category: '', sub_category: '', city: '', address: '', phone: '', whatsapp: '', adId: ''}); setIsCustomCategory(false); setIsCustomSubCategory(false); setIsCustomCity(false); setFile(null);}} className="w-full bg-gray-300 text-gray-800 py-2 rounded mt-2">Cancel Edit</button>}
          </form>
        </div>

        <div className="lg:col-span-2">
           <h3 className="font-bold text-lg mb-4">Manage Businesses</h3>
           <div className="space-y-3">
             {businesses.map(b => (
               <div key={b.id} className="border border-gray-200 p-3 flex justify-between items-center rounded bg-gray-50">
                 <div>
                   <h4 className="font-bold">{b.name}</h4>
                   <p className="text-xs text-gray-500">{b.category} • {b.city}</p>
                 </div>
                 <div className="space-x-2">
                   <button onClick={() => editBusiness(b)} className="text-blue-600 hover:underline text-sm">Edit</button>
                   <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
