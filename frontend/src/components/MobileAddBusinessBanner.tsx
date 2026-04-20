import { useNavigate } from 'react-router-dom';

export default function MobileAddBusinessBanner() {
  const navigate = useNavigate();

  const handleAddBusiness = () => {
    navigate('/add-business');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/80 px-3 py-3 z-40 shadow-lg">
      <div className="flex flex-col items-center gap-2">
        <div className="text-center">
          <p className="text-white text-lg font-medium">உங்கள் வியாபார தகவல் இடம் பெற..</p>
         
        </div>
        <button
          onClick={handleAddBusiness}
          className="w-full bg-white text-[var(--color-primary)] font-semibold py-1.5 px-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
        >
          கிளிக் செய்யவும்
        </button>
      </div>
    </div>
  );
}
