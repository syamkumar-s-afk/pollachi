import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-secondary)] text-gray-300 w-full" role="contentinfo">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                KN
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Kodumudi<span className="text-[var(--color-primary)]">News</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Tamil Nadu's premier business directory. Discover, connect, and grow
              with local businesses across all 38 districts.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              <span>Coimbatore, Tamil Nadu, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-white text-sm font-bold mb-3 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/listings"
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Business Listings
                </Link>
              </li>
              <li>
                <Link
                  to="/add-business"
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Add Your Business
                </Link>
              </li>
            </ul>
          </nav>

          {/* Policy */}
          <nav aria-label="Legal and policy links">
            <h3 className="text-white text-sm font-bold mb-3 tracking-wider uppercase">
              Policy
            </h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>
                <span className="hover:text-white transition-colors flex items-center gap-2 cursor-default">
                  Terms of Use
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors flex items-center gap-2 cursor-default">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors flex items-center gap-2 cursor-default">
                  Refund &amp; Cancellation
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors flex items-center gap-2 cursor-default">
                  Service Terms
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors flex items-center gap-2 cursor-default">
                  FAQ
                </span>
              </li>
            </ul>
          </nav>

          {/* Customer Care */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white text-sm font-bold mb-3 tracking-wider uppercase">
              Customer Care
            </h3>
            <div className="space-y-2 text-sm">
              <a
                href="tel:9843375743"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium text-white block">
                    9843375743
                  </span>
                  <span className="text-xs text-gray-500">Call</span>
                </div>
              </a>
              <a
                href="https://wa.me/9952573997"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium text-white block">
                    9952573997
                  </span>
                  <span className="text-xs text-gray-500">WhatsApp</span>
                </div>
              </a>
              <div className="flex items-center gap-3 text-gray-400 group">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium text-white block">
                    Market Road, Kodumudi
                  </span>
                  <span className="text-xs text-gray-500">Location</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {currentYear} KodumudiNews. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Made with ❤️ in Tamil Nadu
          </p>
        </div>
      </div>
    </footer>
  );
}
