import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SkipToContent from './components/SkipToContent';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Listings from './pages/Listings';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <SkipToContent />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main
            id="main-content"
            className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/listings" element={<Listings />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
