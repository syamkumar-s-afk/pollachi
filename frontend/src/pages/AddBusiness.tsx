import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  User,
  Phone,
  Send,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  MapPin,
} from 'lucide-react';

export default function AddBusiness() {
  const [yourName, setYourName] = useState('');
  const [city, setCity] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const WHATSAPP_NUMBER = '919952573997'; // India country code + target number

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!yourName.trim()) newErrors.yourName = 'Name is required';
    if (!city.trim()) newErrors.city = 'City/Location is required';
    if (!companyName.trim()) newErrors.companyName = 'Business name is required';
    if (!contactNumber.trim()) newErrors.contactNumber = 'Mobile number is required';
    else if (!/^[\d\s+\-()]{7,15}$/.test(contactNumber))
      newErrors.contactNumber = 'Enter a valid mobile number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Build the pre-filled WhatsApp message
    const message = `New Business Listing Request\n\n` +
      `Name: ${yourName.trim()}\n` +
      `City/Location: ${city.trim()}\n` +
      `Business: ${companyName.trim()}\n` +
      `Mobile: ${contactNumber.trim()}\n\n` +
      `I would like to add my business to Kodumudi News. Please process my request.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Show success state briefly, then redirect
    setSubmitted(true);

    // Open WhatsApp in a new tab
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 600);
  };

  const inputClass = (field: string) =>
    `w-full border ${errors[field]
      ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400'
      : 'border-[var(--color-border)] bg-white focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]'
    } p-3 rounded-xl text-sm outline-none focus:ring-2 transition-all duration-200 hover:border-gray-300`;

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-8 md:mt-16 add-biz-fade-in">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-[var(--color-border)] text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg add-biz-bounce">
            <MessageCircle className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Request Sent! 🎉
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-6 leading-relaxed">
            Your business listing request is being opened in WhatsApp.
            Our team will review and get back to you shortly.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setYourName('');
                setCity('');
                setCompanyName('');
                setContactNumber('');
                setErrors({});
              }}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              Submit Another Request
            </button>
            <Link
              to="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-[var(--color-text-secondary)] py-3 rounded-xl font-semibold text-sm transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-6 md:mt-12 pb-8 add-biz-fade-in">
      {/* Admin Profile Icon — links to admin login */}
      <div className="flex justify-end mb-4">
        <Link
          to="/admin"
          className="group relative flex items-center gap-2 bg-white hover:bg-gray-50 border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300"
          aria-label="Admin Login"
          id="admin-profile-link"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-red-700 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-bold text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors">
            Admin
          </span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-[var(--color-border)] overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] via-red-600 to-red-800 p-6 md:p-8 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full" />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/20 add-biz-float">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1.5 tracking-tight">
              Add Your Business
            </h1>
            <p className="text-red-100 text-sm flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Get listed on Kodumudi News today
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 md:p-8">
          <p className="text-sm text-[var(--color-text-muted)] mb-6 text-center leading-relaxed">
            Fill in your details below. Our team will contact you
            to complete your business listing.
          </p>

          <form onSubmit={handleSendRequest} className="space-y-5" id="add-business-form">
            {/* Name */}
            <div className="add-biz-field-enter" style={{ animationDelay: '0.1s' }}>
              <label
                htmlFor="add-biz-name"
                className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] mb-2"
              >
                <User className="w-4 h-4 text-[var(--color-primary)]" />
                Name <span className="text-red-400">*</span>
              </label>
              <input
                id="add-biz-name"
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={yourName}
                onChange={(e) => {
                  setYourName(e.target.value);
                  if (errors.yourName) {
                    setErrors((prev) => ({ ...prev, yourName: '' }));
                  }
                }}
                className={inputClass('yourName')}
              />
              {errors.yourName && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  {errors.yourName}
                </p>
              )}
            </div>

            {/* City/Location */}
            <div className="add-biz-field-enter" style={{ animationDelay: '0.2s' }}>
              <label
                htmlFor="add-biz-city"
                className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] mb-2"
              >
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                City/Location <span className="text-red-400">*</span>
              </label>
              <input
                id="add-biz-city"
                type="text"
                placeholder="e.g. Kodumudi"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (errors.city) {
                    setErrors((prev) => ({ ...prev, city: '' }));
                  }
                }}
                className={inputClass('city')}
              />
              {errors.city && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  {errors.city}
                </p>
              )}
            </div>

            {/* Business (Company Name) */}
            <div className="add-biz-field-enter" style={{ animationDelay: '0.3s' }}>
              <label
                htmlFor="add-biz-company"
                className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] mb-2"
              >
                <Building2 className="w-4 h-4 text-[var(--color-primary)]" />
                Business <span className="text-red-400">*</span>
              </label>
              <input
                id="add-biz-company"
                type="text"
                placeholder="e.g. ABC Textiles Pvt Ltd"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (errors.companyName) {
                    setErrors((prev) => ({ ...prev, companyName: '' }));
                  }
                }}
                className={inputClass('companyName')}
              />
              {errors.companyName && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* Mobile (Contact Number) */}
            <div className="add-biz-field-enter" style={{ animationDelay: '0.4s' }}>
              <label
                htmlFor="add-biz-contact"
                className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] mb-2"
              >
                <Phone className="w-4 h-4 text-[var(--color-primary)]" />
                Mobile <span className="text-red-400">*</span>
              </label>
              <input
                id="add-biz-contact"
                type="tel"
                placeholder="e.g. 9876543210"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                  if (errors.contactNumber) {
                    setErrors((prev) => ({ ...prev, contactNumber: '' }));
                  }
                }}
                className={inputClass('contactNumber')}
              />
              {errors.contactNumber && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  {errors.contactNumber}
                </p>
              )}
            </div>

            {/* Send Request Button */}
            <button
              type="submit"
              id="send-request-btn"
              className="w-full bg-[var(--color-whatsapp)] hover:bg-[var(--color-whatsapp-hover)] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2.5 group mt-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              Send Request via WhatsApp
              <MessageCircle className="w-4 h-4 opacity-60" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
