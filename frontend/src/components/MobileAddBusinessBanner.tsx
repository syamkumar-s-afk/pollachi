import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function MobileAddBusinessBanner() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-purple-600 px-4 py-3 z-40 shadow-lg flex items-center justify-between gap-3">
      <span className="text-white font-semibold text-sm flex-1">உங்கள் வியாபாரத் தகவல் சேர்க்க</span>
      <button onClick={() => navigate('/add-business')} className="bg-white text-purple-600 font-semibold py-2 px-4 rounded hover:bg-gray-100 transition-colors text-sm whitespace-nowrap">
        கிளிக் செய்யவும்
      </button>
      <button onClick={handleDismiss} className="text-white hover:text-gray-200 transition-colors p-1" aria-label="Close banner">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
