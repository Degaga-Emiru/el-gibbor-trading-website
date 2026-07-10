import { motion } from 'framer-motion';
import { Target, Compass, Award, ShieldCheck, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';
import ProductImageCarousel from '../components/ProductImageCarousel';

// Tyre images for the Company Overview carousel
const tyreImages = [
  '/images/products/triangle1.png',
  '/images/products/triangle102.png',
  '/images/products/triangle5.png',
  '/images/products/triangle4.png',
  '/images/products/triangle11.png',
  '/images/products/triangle.png',
];

// ─── Exportable Sub-Sections ──────────────────────────────────────────────────

export const CompanyOverview = () => (
  <section className="py-20 bg-white" id="about">
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Rotating tyre image carousel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-1/2 w-full"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-[var(--color-border-gray)] aspect-video">
            <ProductImageCarousel images={tyreImages} alt="El Gibbor Trading Products" intervalMs={3000} />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-1/2 w-full"
        >
          <SectionHeading title="Who We Are" subtitle="Company Overview" alignment="left" />
          <p className="text-lg text-[var(--color-body)] leading-relaxed mb-5">
            <strong className="text-[var(--color-heading)]">El Gibbor Trading One Member PLC</strong> is a leading Ethiopian importer and general trader, delivering premium tyres, vehicles, spare parts, and industrial goods to businesses and individuals across the country.
          </p>
          <p className="text-[var(--color-body)] leading-relaxed">
            With a vast international network and deep market expertise, we source only the finest products — ensuring quality, reliability, and on-time delivery for every order.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label: 'Years in Business', value: '10+' },
              { label: 'Products Imported', value: '500+' },
              { label: 'Happy Clients', value: '1,000+' },
              { label: 'Global Partners', value: '20+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[var(--color-background)] rounded-xl p-4 border border-[var(--color-border-gray)]">
                <p className="text-2xl font-bold text-[var(--color-primary)] font-[var(--font-heading)]">{stat.value}</p>
                <p className="text-xs text-[var(--color-body)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export const VisionMission = () => (
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
            To be the most trusted global trading partner — recognized for our unwavering commitment to quality, integrity, and operational excellence.
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
            To deliver high-quality products that exceed expectations, fostering long-term partnerships through transparent practices and continuous innovation.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export const CoreValues = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <SectionHeading title="Core Values" subtitle="What Drives Us" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {[
          { icon: <ShieldCheck size={32} />, title: 'Integrity', desc: 'We conduct business with the highest standards of ethics and professionalism.' },
          { icon: <Award size={32} />, title: 'Quality', desc: 'Premium products and exceptional service in every interaction — no compromise.' },
          { icon: <Users size={32} />, title: 'Customer Focus', desc: "Our clients' success is our success. We build lasting relationships." },
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
);

export const CeoMessage = () => (
  <section className="py-20 bg-[var(--color-primary)] text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-black/10 z-0" />
    <div className="container mx-auto px-4 relative z-10">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="w-full md:w-1/3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white/10 border-4 border-white/20">
            <img
              src="/images/products/BONSA CEO.png"
              alt="Bonsa Saka Tesfa — CEO of El Gibbor Trading"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <h2 className="text-3xl font-bold font-[var(--font-heading)] mb-2">Message from the Leadership</h2>
          <div className="w-16 h-1 bg-[var(--color-premium)] mb-8" />
          <blockquote className="text-xl md:text-2xl font-light italic leading-relaxed mb-8 text-gray-200">
            "At El Gibbor Trading, we believe that success is built on a foundation of trust, quality, and mutual growth. Our dedication to excellence ensures that every partnership we forge and every product we deliver meets the highest global standards."
          </blockquote>
          <div>
            <p className="font-bold text-lg text-white">Bonsa Saka Tesfa</p>
            <p className="text-[var(--color-premium)]">Chief Executive Officer</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Full About Us Page (standalone route) ────────────────────────────────────

const AboutUs = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  return (
    <div className="flex flex-col w-full" id="about">
      {!hideHeader && (
        <PageHeader
          title="About Us"
          breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'About Us' }]}
        />
      )}
      <CompanyOverview />
      <VisionMission />
      <CoreValues />
      <CeoMessage />
    </div>
  );
};

export default AboutUs;
