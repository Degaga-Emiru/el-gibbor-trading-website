import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const HeroSlider = () => {
  // Local product images — tyres, cars, containers
  const slides = [
    { id: 1,  image: '/images/products/triangle1.png',   label: 'Premium Triangle Tyres' },
    { id: 2,  image: '/images/products/triangle102.png', label: 'Heavy-Duty Truck Tyres' },
    { id: 3,  image: '/images/products/triangle5.png',   label: 'All-Terrain Tyres' },
    { id: 4,  image: '/images/products/triangle4.png',   label: 'Commercial Tyres' },
    { id: 5,  image: '/images/products/triangle11.png',  label: 'Passenger Car Tyres' },
    { id: 6,  image: '/images/products/triangle.png',    label: 'High-Performance Tyres' },
    { id: 7,  image: '/images/products/cars5.png',       label: 'Passenger & SUV Vehicles' },
    { id: 8,  image: '/images/products/cars7.png',       label: 'Commercial Vehicles' },
    { id: 9,  image: '/images/products/cars8.png',       label: 'Automobile Import & Export' },
    { id: 10, image: '/images/products/cars9.png',       label: 'Fleet Solutions' },
    { id: 11, image: '/images/products/conatainer1.png', label: 'Global Shipping & Logistics' },
    { id: 12, image: '/images/products/container2.png',  label: 'Import & Export Containers' },
  ];

  return (
    <section className="relative h-screen min-h-[600px] flex items-center pt-20 overflow-hidden bg-[var(--color-primary)] group">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1000}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true, el: '.hero-pagination' }}
          className="h-full w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              {({ isActive }) => (
                <div className="relative h-full w-full overflow-hidden">
                  {/* Background image with Ken Burns zoom */}
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Slide category badge */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.6 }}
                    className="absolute bottom-24 right-8 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-widest uppercase px-5 py-2 rounded-full hidden md:block"
                  >
                    {slide.label}
                  </motion.div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="max-w-4xl">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 bg-[var(--color-premium)]/90 backdrop-blur-sm text-white text-sm font-semibold tracking-wider uppercase rounded-full mb-8 border border-[var(--color-premium)]/50 shadow-lg"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            El Gibbor Trading One Member PLC
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-[var(--font-heading)] leading-[1.1] mb-6"
          >
            Driving Excellence <br />
            in{' '}
            <span className="text-[var(--color-premium)]">Import &amp; Export</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed"
          >
            A trusted Ethiopian trading company specializing in{' '}
            <strong className="text-white">premium tyres, automobiles, automotive spare parts</strong>, and general trading — delivering quality and reliability to businesses and individuals.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link
              to="/product/triangle-tyres"
              className="bg-[var(--color-premium)] hover:bg-yellow-600 text-white px-8 py-3.5 rounded-md font-semibold transition-all hover:scale-105 shadow-xl text-sm sm:text-base"
            >
              View Tyre Catalog
            </Link>
            <Link
              to="/products"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-[var(--color-primary)] text-white px-8 py-3.5 rounded-md font-semibold transition-all hover:scale-105 text-sm sm:text-base"
            >
              All Products
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white px-8 py-3.5 rounded-md font-semibold transition-all hover:scale-105 text-sm sm:text-base"
            >
              Contact Us
            </Link>
          </motion.div>

          {/* Specialization tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-3"
          >
            {[
              { label: 'Premium Tyres', link: '/product/triangle-tyres' },
              { label: 'Automobiles',   link: '/product/cars' },
              { label: 'Spare Parts',   link: '/product/car-spare-parts' },
              { label: 'Machinery',     link: '/product/machinery' },
              { label: 'Containers',    link: '/product/containers' },
            ].map((badge) => (
              <Link
                key={badge.label}
                to={badge.link}
                className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/15 hover:bg-white/20 hover:text-white transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-premium)]" />
                {badge.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
        <div className="hero-pagination flex justify-center gap-2" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="text-white/50" size={22} />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSlider;
