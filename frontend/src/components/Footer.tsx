import { Phone, Smartphone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-secondary)] text-gray-300 py-16 mt-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-sm font-bold mb-6 tracking-wider uppercase">ABOUT SpotNews</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> Blood Donors</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> Cinema</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> Coimbatore News</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-bold mb-6 tracking-wider uppercase">ADVERTISE</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> Free Listing</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> Paid Enquiries</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> Packages</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> How does SpotNews serve you?</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-bold mb-6 tracking-wider uppercase">POLICY</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> Refund & Cancellation Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> Service Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-gray-600">&gt;</span> FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-bold mb-6 tracking-wider uppercase">CUSTOMER CARE</h3>
            <div className="space-y-5 text-sm text-gray-400">
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-white transition-colors hover:text-[var(--color-primary)] cursor-pointer">0422 4350451</span>
              </div>
              <div className="flex items-center gap-4">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-white transition-colors hover:text-[var(--color-primary)] cursor-pointer">90038 54123</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-white transition-colors hover:text-[var(--color-primary)] cursor-pointer">support@spotnews.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
