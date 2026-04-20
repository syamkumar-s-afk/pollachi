import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileAddBusinessBanner from './components/MobileAddBusinessBanner';
import SkipToContent from './components/SkipToContent';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Listings from './pages/Listings';
import AddBusiness from './pages/AddBusiness';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import WhyJoin from './pages/WhyJoin';
import ContactUs from './pages/ContactUs';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <SkipToContent />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main
            id="main-content"
            className="flex-grow max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-6 py-3 pb-24 md:pb-3"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/add-business" element={<AddBusiness />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/why-join" element={<WhyJoin />} />
              <Route path="/contact-us" element={<ContactUs />} />
            </Routes>
          </main>
          <Footer />
          <MobileAddBusinessBanner />
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
