import { Link } from 'react-router-dom';
import { Menu, PlusCircle } from 'lucide-react';

export default function Header() {
  const tabs = [
    { name: 'Home', id: '2', path: '/' },
    { name: 'Listings', id: '1', path: '/listings' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-red-700 transition-colors">
                SP
              </div>
              <span className="font-bold text-3xl tracking-tight text-gray-900">Spot<span className="text-[var(--color-primary)]">News</span></span>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                 <Link key={tab.id} to={tab.path} className="text-gray-600 hover:text-[var(--color-primary)] hover:bg-red-50 px-4 py-2 font-semibold transition-colors rounded-md text-sm">
                    {tab.name}
                 </Link>
              ))}
            </div>
            
            <div className="h-6 w-px bg-gray-200"></div>
            
            <Link to="/admin" className="bg-[var(--color-primary)] hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-md">
               <PlusCircle className="w-4 h-4" /> Add Business
            </Link>
          </div>

          <div className="flex lg:hidden items-center">
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
