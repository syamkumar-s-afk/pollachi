import { Users, Target, Lightbulb, Award } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[#c41f24] text-white py-12 sm:py-16 md:py-20 rounded-lg mb-10 sm:mb-14 md:mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            About KodumudiNews
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            Building Tamil Nadu's most comprehensive business directory
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mb-12 sm:mb-16 md:mb-20">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          {/* Mission */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-6 sm:p-8 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[var(--color-primary)] rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
                Our Mission
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm sm:text-base">
              To empower businesses across Tamil Nadu by providing a unified platform for discovery, connection, and growth. We believe in democratizing access to business information and fostering thriving local economies across all 38 districts.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-6 sm:p-8 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[var(--color-primary)] rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
                Our Vision
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm sm:text-base">
              To become the go-to business hub for every entrepreneur, professional, and consumer in Tamil Nadu. Our vision is a connected ecosystem where businesses of all sizes can thrive, innovate, and grow sustainably.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-8 sm:mb-12">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-4 gap-6 sm:gap-8">
          {[
            {
              title: 'Integrity',
              description: 'We operate with transparency and honesty in all interactions',
              icon: Award,
            },
            {
              title: 'Community',
              description: 'We foster collaborative relationships across business ecosystems',
              icon: Users,
            },
            {
              title: 'Innovation',
              description: 'We continuously improve and embrace new technologies',
              icon: Lightbulb,
            },
            {
              title: 'Excellence',
              description: 'We strive for the highest standards in everything we do',
              icon: Target,
            },
          ].map((value, index) => (
            <div
              key={index}
              className="bg-white border border-[var(--color-border)] rounded-lg p-6 sm:p-7 text-center hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center">
                  <value.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-primary)]" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-2">
                {value.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="bg-[var(--color-background-gray)] rounded-lg p-8 sm:p-10 md:p-12 mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-6 sm:mb-8">
          Our Story
        </h2>
        <div className="space-y-4 sm:space-y-5 text-[var(--color-text-secondary)] leading-relaxed">
          <p className="text-sm sm:text-base">
            KodumudiNews started with a simple observation: businesses in Tamil Nadu lacked a centralized platform to connect, showcase, and grow. Our founders recognized the tremendous potential in the state's diverse business landscape and set out to create a solution.
          </p>
          <p className="text-sm sm:text-base">
            What began as a local initiative has grown into a comprehensive business directory serving businesses and customers across all 38 districts of Tamil Nadu. We've partnered with thousands of business owners, entrepreneurs, and professionals to build a thriving community.
          </p>
          <p className="text-sm sm:text-base">
            Today, KodumudiNews continues to evolve, leveraging cutting-edge technology and deep market insights to empower businesses and connect them with opportunities for growth and success.
          </p>
        </div>
      </section>

      {/* By The Numbers */}
      <section className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] text-center mb-10 sm:mb-14">
          By The Numbers
        </h2>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { number: '38', label: 'Districts Covered' },
            { number: '5000+', label: 'Listed Businesses' },
            { number: '50K+', label: 'Active Users' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-[var(--color-border)] rounded-lg p-8 sm:p-10 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--color-primary)] mb-2 sm:mb-3">
                {stat.number}
              </div>
              <div className="text-[var(--color-text-secondary)] font-medium text-sm sm:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[var(--color-primary)] to-[#c41f24] text-white rounded-lg p-8 sm:p-10 md:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
          Ready to Join Our Community?
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
          List your business today and connect with thousands of customers across Tamil Nadu.
        </p>
        <a
          href="/add-business"
          className="inline-block bg-white text-[var(--color-primary)] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base"
        >
          Add Your Business
        </a>
      </section>
    </div>
  );
}
