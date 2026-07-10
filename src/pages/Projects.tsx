import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';

const Projects = () => {
  const [activeTab, setActiveTab] = useState<'completed' | 'ongoing'>('completed');

  const completed = [
    { id: 1, title: 'Large-Scale Tyre Import — Construction Sector', year: '2024', desc: 'Successfully imported and distributed 5,000+ heavy-duty tyres for major construction companies across Ethiopia.', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800' },
    { id: 2, title: 'Government Fleet Spare Parts Supply', year: '2023', desc: 'Supplied authentic spare parts and maintenance components for a national government vehicle fleet program.', img: 'https://images.unsplash.com/photo-1530906358829-e84b2769270f?q=80&w=800' },
    { id: 3, title: 'Commercial Vehicle Distribution — Addis Ababa', year: '2023', desc: 'Coordinated the distribution of 120 commercial vehicles to businesses in the Addis Ababa metro area.', img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800' },
    { id: 4, title: 'Premium Tyre Export to East Africa', year: '2022', desc: 'Executed export of premium passenger and truck tyres to clients in Kenya, Uganda, and Tanzania.', img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800' },
  ];

  const ongoing = [
    { id: 5, title: 'Industrial OTR Tyre Procurement', year: '2025', desc: 'Ongoing procurement and supply of Off-The-Road tyres for mining and industrial clients in the region.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800' },
    { id: 6, title: 'Automotive Parts Logistics Partnership', year: '2025', desc: 'Active logistics partnership with international auto-parts manufacturers for continuous supply chain management.', img: 'https://images.unsplash.com/photo-1486262715619-6708146bc9a5?q=80&w=800' },
  ];

  const data = activeTab === 'completed' ? completed : ongoing;

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Projects & Portfolio"
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Projects' }]}
      />

      {/* Tab Switch */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Work" subtitle="Track Record of Excellence" />

          <div className="flex justify-center gap-4 mb-14">
            {(['completed', 'ongoing'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-full font-semibold text-sm capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-[var(--color-primary)] text-white shadow-lg scale-105'
                    : 'bg-white text-[var(--color-body)] border border-[var(--color-border-gray)] hover:border-[var(--color-primary)]'
                }`}
              >
                {tab === 'completed' ? 'Completed Projects' : 'Ongoing Projects'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border-gray)] hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[var(--color-primary)]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {project.year}
                  </div>
                  <div className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full ${
                    activeTab === 'completed'
                      ? 'bg-green-600/90 text-white'
                      : 'bg-[var(--color-premium)]/90 text-white'
                  }`}>
                    {activeTab === 'completed' ? '✓ Completed' : '⟳ In Progress'}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[var(--color-heading)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-[var(--color-body)] mb-6 flex-grow leading-relaxed">{project.desc}</p>
                  <button className="flex items-center gap-2 text-[var(--color-premium)] font-semibold text-sm group-hover:gap-3 transition-all">
                    View Details <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Success Stories" subtitle="What We've Achieved" light />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { number: '10,000+', label: 'Tyres Imported & Distributed' },
              { number: '500+', label: 'Satisfied Business Clients' },
              { number: '15+', label: 'Countries Served' },
            ].map((item) => (
              <div key={item.label} className="text-center bg-white/10 p-8 rounded-2xl border border-white/10">
                <div className="text-5xl font-bold text-[var(--color-premium)] mb-3">{item.number}</div>
                <div className="text-gray-200 text-lg">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeading title="Why Our Projects Succeed" subtitle="Our Strengths" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {[
              'Strong international supplier network',
              'End-to-end logistics management',
              'On-time delivery guarantee',
              'Quality-assured products',
              'Dedicated project management team',
              'Competitive and transparent pricing',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 bg-[var(--color-background)] rounded-xl">
                <CheckCircle2 size={22} className="text-[var(--color-premium)] shrink-0" />
                <span className="text-[var(--color-heading)] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
