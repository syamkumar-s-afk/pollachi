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

      {/* About Us - Tamil Section */}
      <section className="mb-12 sm:mb-16 md:mb-20">
        <div className="bg-white border border-[var(--color-border)] rounded-lg p-8 sm:p-10 md:p-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2 sm:mb-3">
            About Us (எங்களை பற்றி)
          </h2>
          <div className="w-12 h-1 bg-[var(--color-primary)] mb-6 sm:mb-8"></div>

          <div className="space-y-4 sm:space-y-5 text-[var(--color-text-secondary)] leading-relaxed">
            <p className="text-sm sm:text-base">
              எங்கள் kodumudi Page இணையதளம், கொடுமுடி நகரம் மற்றும் பல பகுதிகளில் உள்ள வணிகங்கள், சேவைகள் மற்றும் தொழில்களை ஒரே டிஜிட்டல் தளத்தில் இணைக்கும் நோக்கத்துடன் உருவாக்கப்பட்டது. இன்றைய வேகமான உலகில், மக்கள் தங்களுக்கு தேவையான சேவைகளை விரைவாகவும் நம்பகமாகவும் கண்டுபிடிக்க வேண்டிய அவசியம் அதிகரித்துள்ளது. அந்த தேவையை பூர்த்தி செய்வதே எங்கள் முக்கிய குறிக்கோள்.
            </p>

            <p className="text-sm sm:text-base">
              எங்கள் தளம் சிறிய, நடுத்தர மற்றும் பெரிய அளவிலான அனைத்து வணிகங்களுக்கும் ஒரு சிறந்த ஆன்லைன் முன்னிலை (Online Presence) வழங்குகிறது. ஒரு சிறிய கடையிலிருந்து ஒரு பெரிய நிறுவனம்வரை, யாரும் தங்கள் வணிகத்தை எங்கள் தளத்தில் பதிவு செய்து, புதிய வாடிக்கையாளர்களை எளிதாக அடையலாம். இதன் மூலம் உள்ளூர் வணிகங்கள் வளர்ச்சியடையவும், அவர்களின் சேவைகள் அதிகமான மக்களிடம் சென்றடையவும் உதவுகிறோம்.
            </p>

            <p className="text-sm sm:text-base">
              பயனர்களுக்காக, எங்கள் தளம் எளிமையான தேடல் வசதி, பட்டியல் வாரியான பிரிவுகள், நேரடி கால் மற்றும் WhatsApp தொடர்பு,  போன்ற வசதிகளை வழங்குகிறது. இதனால், அவர்கள் தேடும் சேவையை சில நொடிகளில் கண்டுபிடித்து, நேரடியாக வணிகர்களுடன் தொடர்பு கொள்ள முடியும்.
            </p>

            <p className="text-sm sm:text-base">
              நாங்கள் தரமான மற்றும் பயனுள்ள தகவல்களை வழங்க முயற்சித்தாலும், வணிக தகவல்கள் சம்பந்தப்பட்ட வணிகர்களால் வழங்கப்படுவதால், அவற்றை சரிபார்த்து பயன்படுத்துவது பயனர்களின் பொறுப்பாகும். எங்கள் தளம் ஒரு தகவல் பாலமாக (Information Bridge) செயல்பட்டு, வணிகர்கள் மற்றும் வாடிக்கையாளர்களை இணைக்கும் பணியை செய்கிறது.
            </p>

            <div className="bg-[var(--color-background-gray)] p-4 sm:p-6 rounded-lg mt-6 sm:mt-8">
              <p className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)] mb-2 sm:mb-3">
                எங்கள் நோக்கம் (Vision) –
              </p>
              <p className="text-sm sm:text-base mb-4">
                ஒவ்வொரு நகரத்திற்கும் ஒரு நம்பகமான டிஜிட்டல் வணிக அடைவு (Business Directory) உருவாக்குவது.
              </p>

              <p className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)] mb-2 sm:mb-3">
                எங்கள் பணி (Mission) –
              </p>
              <p className="text-sm sm:text-base">
                உள்ளூர் வணிகங்களை டிஜிட்டல் உலகிற்கு கொண்டு வந்து, அவர்களின் வளர்ச்சியை வேகப்படுத்துவது.
              </p>
            </div>

            <p className="text-sm sm:text-base pt-2 sm:pt-4">
              எங்கள் தளம் தொடர்ந்து மேம்படுத்தப்பட்டு, பயனர்களுக்கு மேலும் சிறந்த அனுபவத்தை வழங்க முயற்சி செய்து வருகிறது. உங்கள் ஆதரவு மற்றும் நம்பிக்கையே எங்களை முன்னேற்றுகிறது.
            </p>
          </div>
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
