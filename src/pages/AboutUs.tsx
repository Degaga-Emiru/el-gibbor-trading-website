import { motion } from 'framer-motion';
import { Target, Compass, Award, ShieldCheck, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';
import ProductImageCarousel from '../components/ProductImageCarousel';

// ─── Image arrays ─────────────────────────────────────────────────────────────

const tyreImages = [
  '/images/products/triangle1.png',
  '/images/products/triangle102.png',
  '/images/products/triangle5.png',
  '/images/products/triangle4.png',
  '/images/products/triangle11.png',
  '/images/products/triangle.png',
];

// Vision images — global reach / quality
const visionImages = [
  '/images/products/conatainer1.png',
  '/images/products/container2.png',
  '/images/products/container3.png',
];

// Mission images — products & service excellence
const missionImages = [
  '/images/products/machinery1.png',
  '/images/products/machinery5.png',
  '/images/products/machinery9.png',
];

// Core value images
const integrityImages  = ['/images/products/triangle1.png', '/images/products/triangle102.png'];
const qualityImages    = ['/images/products/elevator.png',  '/images/products/elevator3.png'];
const customerImages   = ['/images/products/cars5.png',     '/images/products/cars8.png'];

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
            <ProductImageCarousel images={tyreImages} alt="El Gibbor Trading Products" intervalMs={3000} objectFit="contain" />
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
              { label: 'Happy Clients',     value: '1,000+' },
              { label: 'Global Partners',   value: '20+' },
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

// ─── Vision & Mission ─────────────────────────────────────────────────────────

export const VisionMission = () => (
  <section className="py-20 bg-[var(--color-background)]">
    <div className="container mx-auto px-4">
      <SectionHeading title="Vision & Mission" subtitle="Our Direction" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">

        {/* Vision card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-sm border border-[var(--color-border-gray)] overflow-hidden group"
        >
          {/* Image carousel at top */}
          <div className="h-52 overflow-hidden relative">
            <ProductImageCarousel images={visionImages} alt="Our Vision" intervalMs={3500} />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/80 to-transparent" />
            <div className="absolute bottom-4 left-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur text-white rounded-full flex items-center justify-center border border-white/30">
                <Compass size={22} />
              </div>
              <h3 className="text-xl font-bold text-white font-[var(--font-heading)] drop-shadow">Our Vision</h3>
            </div>
          </div>
          {/* Text */}
          <div className="p-8">
            <p className="text-[var(--color-body)] leading-relaxed">
              To be the most trusted global trading partner — recognized for our unwavering commitment to quality, integrity, and operational excellence in every market we serve.
            </p>
            <div className="mt-4 flex gap-2 flex-wrap">
              {['Quality', 'Integrity', 'Global Reach'].map((tag) => (
                <span key={tag} className="text-xs font-semibold bg-blue-50 text-[var(--color-primary)] px-3 py-1 rounded-full border border-blue-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mission card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-sm border border-[var(--color-border-gray)] overflow-hidden group"
        >
          {/* Image carousel at top */}
          <div className="h-52 overflow-hidden relative">
            <ProductImageCarousel images={missionImages} alt="Our Mission" intervalMs={3500} />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-premium)]/80 to-transparent" />
            <div className="absolute bottom-4 left-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur text-white rounded-full flex items-center justify-center border border-white/30">
                <Target size={22} />
              </div>
              <h3 className="text-xl font-bold text-white font-[var(--font-heading)] drop-shadow">Our Mission</h3>
            </div>
          </div>
          {/* Text */}
          <div className="p-8">
            <p className="text-[var(--color-body)] leading-relaxed">
              To deliver high-quality products that exceed expectations, fostering long-term partnerships through transparent practices, competitive pricing, and continuous innovation.
            </p>
            <div className="mt-4 flex gap-2 flex-wrap">
              {['Excellence', 'Innovation', 'Partnership'].map((tag) => (
                <span key={tag} className="text-xs font-semibold bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  </section>
);

// ─── Core Values ──────────────────────────────────────────────────────────────

const coreValues = [
  {
    icon: <ShieldCheck size={28} />,
    title: 'Integrity',
    desc: 'We conduct business with the highest standards of ethics and professionalism — every promise kept, every deal transparent.',
    images: integrityImages,
    accent: 'from-[var(--color-primary)]/70',
    tags: ['Honesty', 'Transparency'],
  },
  {
    icon: <Award size={28} />,
    title: 'Quality',
    desc: 'Premium products and exceptional service in every interaction — no shortcuts, no compromise on standards.',
    images: qualityImages,
    accent: 'from-[var(--color-premium)]/70',
    tags: ['Premium', 'Standards'],
  },
  {
    icon: <Users size={28} />,
    title: 'Customer Focus',
    desc: "Our clients' success is our success. We listen, adapt, and build relationships that last far beyond a single transaction.",
    images: customerImages,
    accent: 'from-green-700/70',
    tags: ['Partnership', 'Trust'],
  },
];

export const CoreValues = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <SectionHeading title="Core Values" subtitle="What Drives Us" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        {coreValues.map((value, idx) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[var(--color-background)] rounded-2xl overflow-hidden border border-[var(--color-border-gray)] hover:shadow-xl transition-all duration-500 group"
          >
            {/* Image with gradient overlay */}
            <div className="h-44 overflow-hidden relative">
              <ProductImageCarousel images={value.images} alt={value.title} intervalMs={4000 + idx * 500} />
              <div className={`absolute inset-0 bg-gradient-to-t ${value.accent} to-transparent`} />
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <div className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center border border-white/30">
                  {value.icon}
                </div>
                <h4 className="text-lg font-bold text-white drop-shadow font-[var(--font-heading)]">{value.title}</h4>
              </div>
            </div>

            {/* Text */}
            <div className="p-6">
              <p className="text-[var(--color-body)] text-sm leading-relaxed mb-4">{value.desc}</p>
              <div className="flex gap-2 flex-wrap">
                {value.tags.map((tag) => (
                  <span key={tag} className="text-xs font-semibold bg-white text-[var(--color-primary)] px-3 py-1 rounded-full border border-[var(--color-border-gray)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── CEO Message ──────────────────────────────────────────────────────────────

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
              className="w-full h-full object-contain"
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

// ─── Full About Us Page ───────────────────────────────────────────────────────

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
