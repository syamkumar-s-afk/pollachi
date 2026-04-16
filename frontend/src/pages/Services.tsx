import { Search, Globe, TrendingUp, BarChart3, Users, Shield, MapPin, Zap } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Search,
      title: 'Business Discovery',
      description: 'Browse and search through thousands of businesses across Tamil Nadu with advanced filters and categories.',
    },
    {
      icon: Globe,
      title: 'Online Presence',
      description: 'Establish a strong online presence for your business with comprehensive business profiles and listings.',
    },
    {
      icon: TrendingUp,
      title: 'Growth Analytics',
      description: 'Track your business performance and customer engagement with detailed analytics and insights.',
    },
    {
      icon: BarChart3,
      title: 'Business Intelligence',
      description: 'Access market insights, trends, and competitive analysis to make informed business decisions.',
    },
    {
      icon: Users,
      title: 'Networking',
      description: 'Connect with other business owners, entrepreneurs, and professionals in your industry.',
    },
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'Trust verified business information with our authentication and verification system.',
    },
    {
      icon: MapPin,
      title: 'Location-Based Services',
      description: 'Find businesses near you with location-based search and mapping integration.',
    },
    {
      icon: Zap,
      title: 'Quick Response',
      description: 'Connect with customers quickly through direct contact options and instant messaging.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[#c41f24] text-white py-12 sm:py-16 md:py-20 rounded-lg mb-10 sm:mb-14 md:mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Our Services
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            Comprehensive solutions to grow your business and connect with opportunities
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-10 sm:mb-14">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-[var(--color-border)] rounded-lg p-6 sm:p-7 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] transition-colors">
                <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-primary)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-2 sm:mb-3">
                {service.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm sm:text-base leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* For Business Owners */}
      <section className="bg-white border border-[var(--color-border)] rounded-lg p-8 sm:p-10 md:p-12 mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-6 sm:mb-8">
          For Business Owners
        </h2>
        <div className="space-y-4 sm:space-y-5 text-[var(--color-text-secondary)] leading-relaxed">
          <p className="text-sm sm:text-base">
            <strong>Complete Business Profiles:</strong> Create comprehensive business profiles with detailed information, images, contact details, and service descriptions to attract more customers.
          </p>
          <p className="text-sm sm:text-base">
            <strong>Easy Management:</strong> Update your business information anytime, manage customer inquiries, and monitor engagement through our intuitive dashboard.
          </p>
          <p className="text-sm sm:text-base">
            <strong>Enhanced Visibility:</strong> Reach thousands of potential customers across Tamil Nadu with our advanced search and recommendation algorithms.
          </p>
          <p className="text-sm sm:text-base">
            <strong>Customer Engagement:</strong> Respond to customer inquiries quickly, build relationships, and get valuable feedback to improve your business.
          </p>
        </div>
      </section>

      {/* For Customers */}
      <section className="bg-[var(--color-background-gray)] rounded-lg p-8 sm:p-10 md:p-12 mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-6 sm:mb-8">
          For Customers
        </h2>
        <div className="space-y-4 sm:space-y-5 text-[var(--color-text-secondary)] leading-relaxed">
          <p className="text-sm sm:text-base">
            <strong>Trusted Directory:</strong> Access verified business information from a curated directory of businesses across Tamil Nadu's 38 districts.
          </p>
          <p className="text-sm sm:text-base">
            <strong>Smart Search:</strong> Find exactly what you're looking for with advanced filters by category, location, ratings, and reviews.
          </p>
          <p className="text-sm sm:text-base">
            <strong>Direct Connection:</strong> Contact businesses directly through phone, WhatsApp, or messaging for inquiries and support.
          </p>
          <p className="text-sm sm:text-base">
            <strong>Community Insights:</strong> Discover new businesses, read reviews, and stay updated with local business news and trends.
          </p>
        </div>
      </section>

      {/* Service Levels */}
      <section className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] text-center mb-10 sm:mb-14">
          Service Plans
        </h2>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              name: 'Basic',
              price: 'Free',
              features: [
                'Free business listing',
                'Basic profile information',
                'Contact details',
                'Customer inquiries',
                'Category tags',
              ],
            },
            {
              name: 'Professional',
              price: '$9.99',
              period: '/month',
              features: [
                'All Basic features',
                'Multiple images & gallery',
                'Analytics dashboard',
                'Priority support',
                'Featured listing',
                'Ad-free appearance',
              ],
              highlighted: true,
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              features: [
                'All Professional features',
                'Custom branding',
                'Advanced analytics',
                'Dedicated support',
                'API access',
                'White-label options',
              ],
            },
          ].map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg p-8 sm:p-10 border transition-all duration-300 ${
                plan.highlighted
                  ? 'border-[var(--color-primary)] bg-white shadow-lg scale-105'
                  : 'border-[var(--color-border)] bg-white hover:shadow-md'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[var(--color-primary)] text-white px-4 py-1 rounded-full text-xs font-bold">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)]">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-[var(--color-text-secondary)] ml-2">{plan.period}</span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-[var(--color-text-secondary)] flex items-start gap-2 text-sm sm:text-base">
                    <span className="text-[var(--color-primary)] font-bold mt-1">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-bold transition-colors text-sm sm:text-base ${
                  plan.highlighted
                    ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]'
                    : 'bg-[var(--color-background-gray)] text-[var(--color-text-primary)] hover:bg-gray-200'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[var(--color-primary)] to-[#c41f24] text-white rounded-lg p-8 sm:p-10 md:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
          Start Using Our Services Today
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
          Join thousands of businesses already growing with KodumudiNews.
        </p>
        <a
          href="/add-business"
          className="inline-block bg-white text-[var(--color-primary)] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base"
        >
          List Your Business
        </a>
      </section>
    </div>
  );
}
