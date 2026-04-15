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
      <div className="max-w-md mx-auto mt-4 md:mt-8 add-biz-fade-in">
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-lg border border-[var(--color-border)] text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg add-biz-bounce">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-1.5">
            Request Sent! 🎉
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mb-4 leading-relaxed">
            Your business listing request is being opened in WhatsApp.
            Our team will review and get back to you shortly.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setSubmitted(false);
                setYourName('');
                setCity('');
                setCompanyName('');
                setContactNumber('');
                setErrors({});
              }}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              Submit Another Request
            </button>
            <Link
              to="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-[var(--color-text-secondary)] py-2.5 rounded-xl font-semibold text-xs transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto mt-3 md:mt-6 pb-4 add-biz-fade-in">
      {/* Main Card - Full width with responsive max-width */}
      <div className="bg-white rounded-2xl shadow-lg border border-[var(--color-border)] overflow-hidden mx-4 md:mx-auto md:max-w-5xl">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] via-red-600 to-red-800 p-5 md:p-6 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full" />
          </div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-2.5 shadow-lg border border-white/20 add-biz-float">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1 tracking-tight">
              Add Your Business
            </h1>
            <p className="text-red-100 text-xs flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              Get listed on Kodumudi News today
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-5 md:p-6">
          <p className="text-xs text-[var(--color-text-muted)] mb-5 text-center leading-relaxed">
            Fill in your details below. Our team will contact you
            to complete your business listing.
          </p>

          <form onSubmit={handleSendRequest} className="space-y-4" id="add-business-form">
            {/* Form Fields Grid - 2 columns on desktop, 1 on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="add-biz-field-enter" style={{ animationDelay: '0.1s' }}>
                <label
                  htmlFor="add-biz-name"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[var(--color-primary)]" />
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
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span className="w-0.5 h-0.5 bg-red-500 rounded-full" />
                    {errors.yourName}
                  </p>
                )}
              </div>

              {/* City/Location */}
              <div className="add-biz-field-enter" style={{ animationDelay: '0.2s' }}>
                <label
                  htmlFor="add-biz-city"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
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
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span className="w-0.5 h-0.5 bg-red-500 rounded-full" />
                    {errors.city}
                  </p>
                )}
              </div>

              {/* Business (Company Name) */}
              <div className="add-biz-field-enter" style={{ animationDelay: '0.3s' }}>
                <label
                  htmlFor="add-biz-company"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
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
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span className="w-0.5 h-0.5 bg-red-500 rounded-full" />
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* Mobile (Contact Number) */}
              <div className="add-biz-field-enter" style={{ animationDelay: '0.4s' }}>
                <label
                  htmlFor="add-biz-contact"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[var(--color-primary)]" />
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
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span className="w-0.5 h-0.5 bg-red-500 rounded-full" />
                    {errors.contactNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Send Request Button - Centered below inputs */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                id="send-request-btn"
                className="bg-[var(--color-whatsapp)] hover:bg-[var(--color-whatsapp-hover)] text-white px-8 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 group hover:-translate-y-0.5 active:translate-y-0"
              >
                <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                Send Request via WhatsApp
                <MessageCircle className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
