import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 'elevators',
    title: 'Elevators',
    image: '/images/products/elevator.png',
    description: 'Modern elevator and lift systems for commercial buildings, hospitals, and residential complexes — meeting international safety standards.',
    features: ['Passenger Elevators', 'Freight Elevators', 'Installation Support', 'Maintenance Packages'],
  },
  {
    id: 'generators',
    title: 'Generators',
    image: '/images/products/genarators1.png',
    description: 'Reliable power generation from portable units to heavy-duty industrial generators — ensuring uninterrupted power for any application.',
    features: ['Diesel Generators', 'Industrial Power Units', 'Portable Generators', 'Spare Parts Supply'],
  },
  {
    id: 'house-finishing',
    title: 'House Finishing Materials',
    image: '/images/products/housefinshing1.png',
    description: 'Premium interior and exterior finishing materials — tiles, sanitary ware, paints, and decorative elements sourced from top global manufacturers.',
    features: ['Tiles & Flooring', 'Sanitary Ware', 'Paints & Coatings', 'Decorative Fixtures'],
  },
  {
    id: 'construction-materials',
    title: 'Construction Materials',
    image: '/images/products/constructionmaterial.png',
    description: 'Premium structural materials for large-scale infrastructure projects — steel, cement, reinforcement bars, and more.',
    features: ['Steel & Iron', 'Cement Products', 'Reinforcement Bars', 'Structural Components'],
  },
  {
    id: 'machinery',
    title: 'Machinery',
    image: '/images/products/machinery1.png',
    description: 'Heavy-duty industrial and construction machinery from world-class manufacturers — built for the toughest conditions.',
    features: ['Construction Equipment', 'Manufacturing Machines', 'Agricultural Machinery', 'Technical Support'],
  },
  {
    id: 'containers',
    title: 'Shipping Containers',
    image: '/images/products/container2.png',
    description: 'High-quality shipping containers for global freight, storage, and logistics — standard and custom options available.',
    features: ['20ft & 40ft Containers', 'Refrigerated Units', 'Open-Top Containers', 'Flat-Rack Containers'],
  },
  {
    id: 'triangle-tyres',
    title: 'Triangle Tyres',
    image: '/images/products/triangle1.png',
    description: 'High-performance Triangle brand tyres for trucks, passenger vehicles, and heavy-duty applications — engineered for durability.',
    features: ['Truck & Bus Tyres', 'Passenger Car Tyres', 'OTR Heavy-Duty', 'All-Season Options'],
  },
];



const Services = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardWidth = 340; // approximate card width + gap

  const goToNext = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % services.length);
  }, []);

  const goToPrev = () => {
    setActiveIdx((prev) => (prev - 1 + services.length) % services.length);
  };

  // Auto-advance every 3 seconds
  useEffect(() => {
    const timer = setInterval(goToNext, 3000);
    return () => clearInterval(timer);
  }, [goToNext]);

  // Scroll carousel to keep active card visible
  useEffect(() => {
    if (carouselRef.current) {
      const el = carouselRef.current;
      const target = activeIdx * cardWidth;
      el.scrollTo({ left: target, behavior: 'smooth' });
    }
  }, [activeIdx]);

  return (
    <div className="flex flex-col w-full" id="services">
      {!hideHeader && (
        <PageHeader
          title="Our Services"
          breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Services' }]}
        />
      )}

      {/* Intro Section with Container Images */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="w-full lg:w-1/2">
              <SectionHeading title="What We Import" subtitle="Our Import Services" alignment="left" />
              <motion.p
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-[var(--color-body)] text-lg leading-relaxed mb-8"
              >
                At El Gibbor Trading, we specialize in importing a wide range of high-quality products from trusted international manufacturers. Our expertise in global trade logistics ensures that every product meets the highest standards of quality and is delivered on time.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-[var(--color-background)] rounded-2xl p-6 md:p-8 border border-[var(--color-border-gray)]"
              >
                <p className="text-[var(--color-heading)] font-semibold text-lg mb-4">
                  We can import a wide range of products, including:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Elevators', 'Generators', 'House Finishing Materials', 'Construction Materials', 'Machinery', 'Shipping Containers', 'Sound Systems', 'And many other products'].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle size={18} className="text-[var(--color-premium)] shrink-0" />
                      <span className="text-[var(--color-heading)] font-medium text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[var(--color-body)] text-sm mt-5 italic">
                  ...based on our customers' needs. If you don't see what you're looking for, just ask!
                </p>
              </motion.div>
            </div>

            {/* Auto-playing Video */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[var(--color-border-gray)] aspect-video relative group bg-black">
                <video
                  src="/videos/tyres-videos.MP4"
                  autoPlay
                  loop
                  muted
                  controls
                  playsInline
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Services Horizontal Auto-Scrolling Carousel */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Import Categories" subtitle="Explore Services" />

          {/* Carousel controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {services.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeIdx
                      ? 'w-8 bg-[var(--color-primary)]'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to service ${idx + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={goToPrev}
                className="w-10 h-10 rounded-full bg-white border border-[var(--color-border-gray)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-sm"
                aria-label="Previous service"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNext}
                className="w-10 h-10 rounded-full bg-white border border-[var(--color-border-gray)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-sm"
                aria-label="Next service"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Scrollable carousel */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-500 group flex flex-col flex-shrink-0 ${
                  idx === activeIdx
                    ? 'border-[var(--color-primary)] shadow-xl shadow-[var(--color-primary)]/10 scale-[1.02]'
                    : 'border-[var(--color-border-gray)] hover:shadow-2xl'
                }`}
                style={{ width: '320px' }}
              >
                {/* Service Image */}
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-extrabold text-white font-[var(--font-heading)] drop-shadow-2xl tracking-wide">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-[var(--color-body)] text-sm mb-5 flex-grow leading-relaxed line-clamp-4">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="mb-6 space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-sm font-medium text-[var(--color-heading)] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-premium)] shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* View More Button — links to product detail page */}
                  <Link
                    to={`/product/${service.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-900 transition-all duration-300 shadow-sm hover:shadow-md group-hover:gap-3"
                  >
                    View More <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--color-primary)] text-white text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--color-premium)] opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] mb-6">
              Need a Custom Import Solution?
            </h2>
            <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              Our team of experts is ready to source and import any product you need from international markets. Tell us your requirements and we'll handle the rest.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[var(--color-premium)] hover:bg-yellow-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl text-lg"
            >
              Contact Our Experts <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
