import { motion } from 'framer-motion';
import { Target, Compass, Award, ShieldCheck, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';

const AboutUs = () => {
  return (
    <div className="flex flex-col w-full">
      <PageHeader 
        title="About Us" 
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'About Us' }]} 
      />

      {/* Company Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <SectionHeading title="Company Overview" subtitle="Who We Are" />
            <p className="text-lg text-[var(--color-body)] leading-relaxed mb-8">
              El Gibbor Trading One Member PLC was established with a vision to become a leading force in the global trading industry. Based in Ethiopia, we have strategically positioned ourselves as a reliable importer and exporter of premium automotive solutions, including tyres, spare parts, and vehicles.
            </p>
            <p className="text-lg text-[var(--color-body)] leading-relaxed">
              Our operations extend beyond automotive into comprehensive general trading, where we leverage our expansive network and deep market knowledge to deliver unparalleled value to our clients and partners worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-2xl shadow-sm border border-[var(--color-border-gray)]"
            >
              <div className="w-16 h-16 bg-blue-50 text-[var(--color-primary)] rounded-full flex items-center justify-center mb-6">
                <Compass size={32} />
              </div>
              <h3 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-heading)] mb-4">Our Vision</h3>
              <p className="text-[var(--color-body)] leading-relaxed">
                To be the most trusted and preferred global trading partner, recognized for our unwavering commitment to quality, integrity, and operational excellence in the automotive and general trading sectors.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-2xl shadow-sm border border-[var(--color-border-gray)]"
            >
              <div className="w-16 h-16 bg-yellow-50 text-[var(--color-premium)] rounded-full flex items-center justify-center mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-heading)] mb-4">Our Mission</h3>
              <p className="text-[var(--color-body)] leading-relaxed">
                To consistently deliver high-quality products and services that exceed customer expectations. We strive to foster long-term partnerships through transparent business practices and continuous innovation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Core Values" subtitle="What Drives Us" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: <ShieldCheck size={32} />, title: "Integrity", desc: "We conduct our business with the highest standards of professional behavior and ethics." },
              { icon: <Award size={32} />, title: "Quality", desc: "We are committed to providing premium products and exceptional service in every interaction." },
              { icon: <Users size={32} />, title: "Customer Focus", desc: "Our clients' success is our success. We prioritize their needs and build lasting relationships." }
            ].map((value, idx) => (
              <motion.div 
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-8"
              >
                <div className="w-20 h-20 mx-auto bg-[var(--color-primary)] text-white rounded-2xl flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold text-[var(--color-heading)] mb-3">{value.title}</h4>
                <p className="text-[var(--color-body)]">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Message */}
      <section className="py-20 bg-[var(--color-primary)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white/10 border-4 border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" 
                  alt="CEO" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-bold font-[var(--font-heading)] mb-2">Message from the Leadership</h2>
              <div className="w-16 h-1 bg-[var(--color-premium)] mb-8"></div>
              <blockquote className="text-xl md:text-2xl font-light italic leading-relaxed mb-8 text-gray-200">
                "At El Gibbor Trading, we believe that success is built on a foundation of trust, quality, and mutual growth. Our dedication to excellence ensures that every partnership we forge and every product we deliver meets the highest global standards."
              </blockquote>
              <div>
                <p className="font-bold text-lg text-white">CEO Name Placeholder</p>
                <p className="text-[var(--color-premium)]">Chief Executive Officer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
