import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, TrendingUp, Shield, Globe } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import CardCarousel from '../components/CardCarousel';
import AnimatedCounter from '../components/AnimatedCounter';

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-[var(--color-primary)]">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop")' }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-1.5 bg-[var(--color-premium)] text-white text-sm font-semibold tracking-wider uppercase rounded-full mb-6"
            >
              El Gibbor Trading One Member PLC
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-[var(--font-heading)] leading-tight mb-6"
            >
              Excellence in <br />
              <span className="text-[var(--color-premium)]">Global Trading</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed"
            >
              Your trusted partner in importing and exporting tyres, automobiles, automotive spare parts, and comprehensive general trading services.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link 
                to="/services" 
                className="bg-[var(--color-premium)] hover:bg-yellow-600 text-white px-8 py-3.5 rounded-md font-medium transition-colors flex items-center gap-2"
              >
                Our Services <ArrowRight size={18} />
              </Link>
              <Link 
                to="/contact" 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-[var(--color-primary)] text-white px-8 py-3.5 rounded-md font-medium transition-colors"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Company Introduction */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative z-10 rounded-xl overflow-hidden shadow-2xl"
              >
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" alt="Corporate Office" className="w-full h-auto" />
              </motion.div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[var(--color-background)] rounded-full -z-10"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[var(--color-premium)] rounded-full opacity-20 -z-10"></div>
            </div>
            
            <div className="lg:w-1/2">
              <SectionHeading title="Who We Are" subtitle="About El Gibbor Trading" alignment="left" />
              <p className="text-[var(--color-body)] text-lg mb-6 leading-relaxed">
                El Gibbor Trading One Member PLC is a dynamic and forward-thinking trading company committed to delivering excellence across borders. We specialize in providing high-quality automotive solutions and general trading services to a diverse clientele.
              </p>
              <p className="text-[var(--color-body)] mb-8 leading-relaxed">
                With a robust international network, unwavering commitment to quality, and a customer-centric approach, we bridge the gap between global manufacturers and local markets, ensuring reliability in every transaction.
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-[var(--color-premium)] shrink-0 mt-1" size={20} />
                  <span className="text-[var(--color-heading)] font-medium">Premium Automotive Parts & Tyres</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-[var(--color-premium)] shrink-0 mt-1" size={20} />
                  <span className="text-[var(--color-heading)] font-medium">Reliable Import & Export Operations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-[var(--color-premium)] shrink-0 mt-1" size={20} />
                  <span className="text-[var(--color-heading)] font-medium">Commitment to Business Excellence</span>
                </li>
              </ul>
              
              <Link to="/about" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:text-[var(--color-premium)] transition-colors">
                Discover More About Us <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Services */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          <SectionHeading title="What We Do" subtitle="Our Core Services" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              { title: 'Import & Export', icon: <Globe size={40} />, desc: 'Facilitating seamless international trade with rigorous compliance and efficiency.' },
              { title: 'Automotive Distribution', icon: <TrendingUp size={40} />, desc: 'Supplying top-tier vehicles and authentic spare parts to meet market demands.' },
              { title: 'General Trading', icon: <Shield size={40} />, desc: 'Diversified trading portfolio catering to various industrial and commercial sectors.' }
            ].map((service, index) => (
              <motion.div 
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-[var(--color-border-gray)] hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="text-[var(--color-primary)] mb-6 group-hover:scale-110 transition-transform origin-left">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold font-[var(--font-heading)] mb-4 text-[var(--color-heading)]">{service.title}</h3>
                <p className="text-[var(--color-body)] mb-6 line-clamp-3">
                  {service.desc}
                </p>
                <Link to="/services" className="text-sm font-semibold text-[var(--color-premium)] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products (Carousel) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <SectionHeading title="Featured Products" subtitle="Top Quality Offerings" alignment="left" />
            <Link to="/products" className="hidden md:flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:text-[var(--color-premium)] mb-12">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
          
          <CardCarousel 
            items={[
              { id: 1, title: 'Premium Commercial Tyres', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2000&auto=format&fit=crop', description: 'High-durability tyres designed for heavy-duty commercial vehicles and long hauls.' },
              { id: 2, title: 'Authentic Spare Parts', image: 'https://images.unsplash.com/photo-1530906358829-e84b2769270f?q=80&w=2000&auto=format&fit=crop', description: 'Genuine OEM spare parts ensuring vehicle longevity and optimal performance.' },
              { id: 3, title: 'Passenger Vehicles', image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2000&auto=format&fit=crop', description: 'A diverse fleet of modern passenger vehicles for personal and corporate use.' },
              { id: 4, title: 'Industrial Lubricants', image: 'https://images.unsplash.com/photo-1606167668511-22c51466d311?q=80&w=2000&auto=format&fit=crop', description: 'High-grade oils and lubricants for maximum engine protection.' },
            ]} 
          />
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/products" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:text-[var(--color-premium)]">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Statistics */}
      <section className="py-20 bg-[var(--color-primary)] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedCounter end={15} suffix="+" title="Years Experience" />
            <AnimatedCounter end={500} suffix="+" title="Global Clients" />
            <AnimatedCounter end={50} suffix="+" title="Partner Brands" />
            <AnimatedCounter end={100} suffix="%" title="Satisfaction" />
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-[var(--font-heading)] text-[var(--color-heading)] mb-6">Ready to Partner With Us?</h2>
            <p className="text-lg text-[var(--color-body)] mb-10">
              Get in touch today to discuss how El Gibbor Trading can elevate your business with our premium trading solutions.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex bg-[var(--color-premium)] hover:bg-yellow-600 text-white px-10 py-4 rounded-md font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Request a Quote Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
