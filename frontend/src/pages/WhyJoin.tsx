import { CheckCircle, Users, TrendingUp, Zap, Award, MessageCircle, BarChart3, Globe } from 'lucide-react';

export default function WhyJoin() {
  const benefits = [
    {
      icon: Globe,
      title: 'Expand Your Reach',
      description: 'Access 50,000+ active users across all 38 districts of Tamil Nadu and showcase your business to potential customers.',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Increase sales and customer engagement with our comprehensive marketing and visibility tools.',
    },
    {
      icon: Users,
      title: 'Connect with Others',
      description: 'Network with other business owners, entrepreneurs, and professionals in your industry.',
    },
    {
      icon: BarChart3,
      title: 'Track Performance',
      description: 'Access detailed analytics and insights to understand your customers better and optimize your business.',
    },
    {
      icon: Zap,
      title: 'Quick & Easy Setup',
      description: 'Get your business listed in minutes with our simple and intuitive listing process.',
    },
    {
      icon: Award,
      title: 'Build Trust',
      description: 'Establish credibility and trust with verified listings and customer reviews.',
    },
    {
      icon: MessageCircle,
      title: 'Direct Communication',
      description: 'Connect with customers through multiple channels - phone, WhatsApp, and messaging.',
    },
    {
      icon: CheckCircle,
      title: '24/7 Support',
      description: 'Our dedicated support team is always ready to help you succeed on our platform.',
    },
  ];

  const successStories = [
    {
      business: 'TechSoft Solutions',
      location: 'Coimbatore',
      result: 'Increased customer inquiries by 250% within 3 months',
    },
    {
      business: 'Artisan Crafts',
      location: 'Chennai',
      result: 'Expanded from local to state-wide customer base',
    },
    {
      business: 'FreshMart Groceries',
      location: 'Salem',
      result: 'Became top-rated business in their category',
    },
    {
      business: 'Design Studio Pro',
      location: 'Madurai',
      result: 'Tripled monthly revenue through platform exposure',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[#c41f24] text-white py-12 sm:py-16 md:py-20 rounded-lg mb-10 sm:mb-14 md:mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Why Join KodumudiNews?
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            Discover the advantages of becoming part of Tamil Nadu's leading business community
          </p>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-10 sm:mb-14">
          Benefits of Joining
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white border border-[var(--color-border)] rounded-lg p-6 sm:p-7 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] transition-colors">
                <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-primary)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-2 sm:mb-3">
                {benefit.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm sm:text-base leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Now */}
      <section className="bg-[var(--color-background-gray)] rounded-lg p-8 sm:p-10 md:p-12 mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-6 sm:mb-8">
          Why Now is the Perfect Time to Join
        </h2>
        <div className="space-y-4 sm:space-y-5 text-[var(--color-text-secondary)] leading-relaxed">
          <p className="text-sm sm:text-base">
            <strong>Market Growth:</strong> The business sector in Tamil Nadu is experiencing unprecedented growth. More businesses are coming online, and consumers are actively searching for local services. By joining now, you'll establish your presence early and capture market share.
          </p>
          <p className="text-sm sm:text-base">
            <strong>Digital Transformation:</strong> Customers are increasingly using digital platforms to discover businesses. Our platform makes it easy for you to transition from traditional to digital marketing without the complexity.
          </p>
          <p className="text-sm sm:text-base">
            <strong>Community Effect:</strong> Join a rapidly growing community of over 5,000 businesses already benefiting from our platform. The more businesses we have, the more valuable the platform becomes for everyone.
          </p>
          <p className="text-sm sm:text-base">
            <strong>Competitive Advantage:</strong> Early members enjoy higher visibility and better positioning. Don't let competitors get ahead—claim your spot in your category today.
          </p>
        </div>
      </section>

      {/* Success Stories */}
      <section className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-10 sm:mb-14">
          Success Stories
        </h2>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {successStories.map((story, index) => (
            <div
              key={index}
              className="bg-white border border-[var(--color-border)] rounded-lg p-6 sm:p-8 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
                    {story.business}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    {story.location}
                  </p>
                </div>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm sm:text-base">
                {story.result}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How to Get Started */}
      <section className="bg-white border border-[var(--color-border)] rounded-lg p-8 sm:p-10 md:p-12 mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-8 sm:mb-10">
          How to Get Started
        </h2>
        <div className="space-y-6 sm:space-y-8">
          {[
            {
              step: '1',
              title: 'Create Your Account',
              description: 'Sign up quickly with your email and basic business information.',
            },
            {
              step: '2',
              title: 'Complete Your Profile',
              description: 'Add detailed information about your business, services, and contact details.',
            },
            {
              step: '3',
              title: 'Add Business Images',
              description: 'Upload professional photos of your business, products, or services.',
            },
            {
              step: '4',
              title: 'Start Connecting',
              description: 'Begin receiving customer inquiries and grow your business immediately.',
            },
          ].map((item, index) => (
            <div key={index} className="flex gap-4 sm:gap-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{item.step}</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-1 sm:mb-2">
                  {item.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] text-center mb-10 sm:mb-14">
          What Members Say
        </h2>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              text: "KodumudiNews transformed how we reach customers. Within weeks, we saw a significant increase in inquiries.",
              author: 'Raj Kumar',
              role: 'Business Owner, Coimbatore',
            },
            {
              text: 'The platform is user-friendly and the support team is incredibly helpful. Highly recommended!',
              author: 'Priya Singh',
              role: 'Entrepreneur, Chennai',
            },
            {
              text: 'Being part of this community has opened doors to networking and partnership opportunities I never expected.',
              author: 'Arun Patel',
              role: 'Service Provider, Salem',
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-[var(--color-border)] rounded-lg p-6 sm:p-8"
            >
              <p className="text-[var(--color-text-secondary)] italic mb-4 text-sm sm:text-base">
                "{testimonial.text}"
              </p>
              <div className="pt-4 border-t border-[var(--color-border)]">
                <p className="font-bold text-[var(--color-text-primary)] text-sm sm:text-base">
                  {testimonial.author}
                </p>
                <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[var(--color-primary)] to-[#c41f24] text-white rounded-lg p-8 sm:p-10 md:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
          Ready to Grow Your Business?
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
          Join thousands of successful businesses on KodumudiNews today.
        </p>
        <a
          href="/add-business"
          className="inline-block bg-white text-[var(--color-primary)] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base"
        >
          Get Started Free
        </a>
      </section>
    </div>
  );
}
