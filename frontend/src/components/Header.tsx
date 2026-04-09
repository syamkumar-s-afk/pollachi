import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

export default function Header() {
  const tabs = [
    { name: 'Listings', id: '1' },
    { name: 'Home', id: '2' },
    { name: '', id: '3' },
    { name: '', id: '4' },
    { name: '', id: '5' },
    { name: '', id: '6' },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-md flex items-center justify-center text-white font-bold text-xl">
                SP
              </div>
              <span className="font-bold text-3xl tracking-tight">Spot<span className="text-[var(--color-primary)]">News</span></span>
            </Link>
          </div>
          
          <div className="hidden lg:flex ml-10 space-x-3 overflow-x-auto">
            {tabs.map((tab) => (
              <div key={tab.id} className="flex flex-col items-center justify-center">
                 {tab.name === 'Listings' ? (
                   <Link to="/listings" className="bg-[var(--color-primary)] hover:bg-red-700 text-white px-6 py-2 text-sm font-medium shadow-sm whitespace-nowrap transition-colors min-w-[110px] min-h-[36px] flex items-center justify-center cursor-pointer">
                      {tab.name}
                   </Link>
                 ) : tab.name === 'Home' ? (
                   <Link to="/" className="bg-[var(--color-primary)] hover:bg-red-700 text-white px-6 py-2 text-sm font-medium shadow-sm whitespace-nowrap transition-colors min-w-[110px] min-h-[36px] flex items-center justify-center cursor-pointer">
                      {tab.name}
                   </Link>
                 ) : (
                   <div className="bg-[var(--color-primary)] text-white px-6 py-2 text-sm font-medium shadow-sm whitespace-nowrap min-w-[110px] min-h-[36px] flex items-center justify-center cursor-default">
                      {tab.name}
                   </div>
                 )}
              </div>
            ))}
          </div>

          <div className="flex lg:hidden items-center">
            <button className="text-gray-500 hover:text-gray-700">
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
