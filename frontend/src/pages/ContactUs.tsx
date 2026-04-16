import { useState } from 'react';
import { Mail, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactChannels = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with our team',
      details: '+91 9843375743',
      link: 'tel:9843375743',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Quick and easy messaging',
      details: '+91 9952573997',
      link: 'https://wa.me/9952573997',
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us your detailed inquiry',
      details: 'support@kodumudinews.com',
      link: 'mailto:support@kodumudinews.com',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Our office location',
      details: 'Market Road, Kodumudi, Tamil Nadu',
      link: '#',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[#c41f24] text-white py-12 sm:py-16 md:py-20 rounded-lg mb-10 sm:mb-14 md:mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Get In Touch
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            We're here to help! Reach out to us with any questions or inquiries.
          </p>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-10 sm:mb-14">
          How to Reach Us
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {contactChannels.map((channel, index) => (
            <a
              key={index}
              href={channel.link}
              target={channel.link.startsWith('http') ? '_blank' : undefined}
              rel={channel.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="bg-white border border-[var(--color-border)] rounded-lg p-6 sm:p-7 hover:shadow-lg hover:border-[var(--color-primary)] transition-all duration-300 group block"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] transition-colors">
                <channel.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-primary)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-2">
                {channel.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm mb-2">
                {channel.description}
              </p>
              <p className="font-semibold text-[var(--color-primary)] text-sm sm:text-base">
                {channel.details}
              </p>
            </a>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16 md:mb-20">
        {/* Contact Form */}
        <div className="md:col-span-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-6 sm:mb-8">
            Send us a Message
          </h2>

          {submitted && (
            <div className="mb-6 p-4 sm:p-5 bg-[var(--color-success)]/10 border border-[var(--color-success)] rounded-lg text-[var(--color-success)] text-sm sm:text-base">
              ✓ Thank you for your message! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-colors text-sm sm:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-colors text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                >
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9843375743"
                  className="w-full px-4 py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-colors text-sm sm:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-colors text-sm sm:text-base"
                >
                  <option value="">Select a subject</option>
                  <option value="business_inquiry">Business Inquiry</option>
                  <option value="technical_support">Technical Support</option>
                  <option value="listing_help">Listing Help</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Please enter your message here..."
                rows={6}
                className="w-full px-4 py-2.5 sm:py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-colors resize-none text-sm sm:text-base"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--color-primary)] text-white px-6 py-3 sm:py-4 rounded-lg font-bold hover:bg-[var(--color-primary-hover)] transition-colors text-sm sm:text-base"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6 sm:space-y-8">
          {/* Business Hours */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-6 h-6 text-[var(--color-primary)] flex-shrink-0 mt-1" />
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
                Business Hours
              </h3>
            </div>
            <div className="space-y-2 text-[var(--color-text-secondary)] text-sm sm:text-base">
              <p className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-medium">9:00 AM - 6:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Saturday</span>
                <span className="font-medium">10:00 AM - 4:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Sunday</span>
                <span className="font-medium">Closed</span>
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-[var(--color-background-gray)] rounded-lg p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: 'How quickly will I get a response?',
                  a: 'We typically respond within 24 hours.',
                },
                {
                  q: 'How do I list my business?',
                  a: 'Visit our Add Business page and fill out the form.',
                },
                {
                  q: 'Is there a fee to list?',
                  a: 'Basic listings are free. Premium options available.',
                },
              ].map((faq, index) => (
                <div key={index} className="border-b border-[var(--color-border)] last:border-b-0 pb-3 last:pb-0">
                  <p className="font-medium text-[var(--color-text-primary)] text-sm mb-1">
                    {faq.q}
                  </p>
                  <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-6 sm:mb-8">
          Our Location
        </h2>
        <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden h-64 sm:h-80 md:h-96">
          <iframe
            title="KodumudiNews Office Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.888255123779!2d78.73599!3d10.89417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baaf3b1f1f1f1f1%3A0x0!2sKodumudi%20Market%20Road!5e0!3m2!1sen!2sin!4v1234567890"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[var(--color-primary)] to-[#c41f24] text-white rounded-lg p-8 sm:p-10 md:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
          Ready to List Your Business?
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
          Have questions? Contact us or get started with your free listing today.
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
