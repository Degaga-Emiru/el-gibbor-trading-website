import { motion } from 'framer-motion';
import { ArrowRight, Globe, TrendingUp, Shield, Truck, Briefcase, Boxes } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      id: 'general-trading',
      title: 'General Trading',
      icon: <Globe size={48} />,
      description: 'Our general trading division operates across various sectors, ensuring the supply of high-quality goods that meet diverse market demands. We leverage our extensive network to source and deliver products efficiently.',
      features: ['Market Analysis', 'Diverse Product Range', 'Quality Assurance', 'Competitive Pricing']
    },
    {
      id: 'import-export',
      title: 'Import & Export',
      icon: <TrendingUp size={48} />,
      description: 'We facilitate seamless cross-border trade, managing the complexities of international logistics, customs clearance, and regulatory compliance. Our expertise ensures timely and secure delivery of goods worldwide.',
      features: ['Customs Clearance', 'International Freight', 'Regulatory Compliance', 'Trade Financing']
    },
    {
      id: 'distribution',
      title: 'Distribution',
      icon: <Boxes size={48} />,
      description: 'Our robust distribution network guarantees that products reach their intended markets efficiently. We optimize supply chains to minimize lead times and maximize market penetration for our partners.',
      features: ['Warehousing', 'Inventory Management', 'Last-Mile Delivery', 'Retail Integration']
    },
    {
      id: 'supply-services',
      title: 'Supply Services',
      icon: <Shield size={48} />,
      description: 'We provide comprehensive supply solutions tailored to the specific needs of industrial and commercial clients. From raw materials to finished goods, we ensure a steady and reliable supply chain.',
      features: ['Procurement Strategy', 'Supplier Auditing', 'Contract Management', 'Continuous Supply']
    },
    {
      id: 'logistics',
      title: 'Logistics',
      icon: <Truck size={48} />,
      description: 'Our logistics services encompass transportation, warehousing, and inventory management. We utilize advanced tracking and management systems to provide end-to-end visibility and control over your goods.',
      features: ['Fleet Management', 'Route Optimization', 'Secure Warehousing', 'Real-time Tracking']
    },
    {
      id: 'business-consultation',
      title: 'Business Consultation',
      icon: <Briefcase size={48} />,
      description: 'Leveraging our deep industry knowledge, we offer strategic consultation services to help businesses navigate the complexities of international trade, market entry, and supply chain optimization.',
      features: ['Market Entry Strategy', 'Risk Assessment', 'Operational Audits', 'Growth Planning']
    }
  ];

  return (
    <div className="flex flex-col w-full">
      <PageHeader 
        title="Our Services" 
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Services' }]} 
      />

      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <SectionHeading title="Comprehensive Trading Solutions" subtitle="What We Offer" />
            <p className="text-[var(--color-body)] text-lg">
              At El Gibbor Trading, we provide a holistic suite of services designed to streamline your business operations and drive global success. Explore our specialized divisions below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-border-gray)] hover:shadow-xl transition-shadow group flex flex-col h-full"
              >
                <div className="text-[var(--color-primary)] mb-6 group-hover:scale-110 transition-transform origin-left">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-heading)] mb-4 group-hover:text-[var(--color-primary)] transition-colors">
                  {service.title}
                </h3>
                <p className="text-[var(--color-body)] mb-6 flex-grow leading-relaxed">
                  {service.description}
                </p>
                <ul className="mb-8 space-y-2">
                  {service.features.map(feature => (
                    <li key={feature} className="text-sm font-medium text-[var(--color-heading)] flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-premium)]"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="mt-auto inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:text-[var(--color-premium)] transition-colors">
                  Request Service <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--color-primary)] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] mb-6">Need a Custom Solution?</h2>
          <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto">
            Our team of experts is ready to tailor a trading or logistics strategy specifically for your unique business requirements.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-[var(--color-premium)] hover:bg-yellow-600 text-white px-8 py-4 rounded-md font-semibold transition-colors shadow-lg"
          >
            Contact Our Experts
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
