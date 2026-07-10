import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Briefcase, GraduationCap, Heart } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';
import { Link } from 'react-router-dom';

const jobs = [
  { id: 1, title: 'Import & Export Specialist', type: 'Full-Time', dept: 'Operations', desc: 'Manage day-to-day import/export operations including documentation, customs clearance, and supplier coordination.' },
  { id: 2, title: 'Senior Sales Executive', type: 'Full-Time', dept: 'Sales', desc: 'Drive revenue growth by acquiring new corporate clients and maintaining strong relationships with existing accounts.' },
  { id: 3, title: 'Logistics Coordinator', type: 'Full-Time', dept: 'Logistics', desc: 'Oversee freight transportation, route planning, and warehouse coordination to ensure on-time delivery.' },
  { id: 4, title: 'Business Development Intern', type: 'Internship', dept: 'Business Dev', desc: 'Support the business development team in market research, lead generation, and proposal preparation.' },
];

const Careers = () => {
  const [openJob, setOpenJob] = useState<number | null>(null);

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Careers"
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Careers' }]}
      />

      {/* Why Join Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Why Join El Gibbor Trading?" subtitle="Work With Us" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: <Briefcase size={32} />, title: 'Growth Opportunities', desc: 'We invest in our people through ongoing training, mentorship, and clear career advancement pathways.' },
              { icon: <GraduationCap size={32} />, title: 'Learning Environment', desc: 'Gain deep expertise in international trade, logistics, and the automotive industry within a dynamic team.' },
              { icon: <Heart size={32} />, title: 'Employee Benefits', desc: 'Competitive salary, health support, performance bonuses, and a positive, collaborative workplace culture.' },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-border-gray)] text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-[var(--color-primary)] text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-[var(--color-heading)] mb-3">{item.title}</h4>
                <p className="text-[var(--color-body)] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeading title="Open Positions" subtitle="Current Opportunities" />

          <div className="space-y-4 mt-12">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl border border-[var(--color-border-gray)] overflow-hidden shadow-sm">
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenJob(openJob === job.id ? null : job.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-3 flex-grow">
                    <h4 className="text-lg font-bold text-[var(--color-heading)]">{job.title}</h4>
                    <div className="flex gap-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        job.type === 'Internship' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-[var(--color-primary)]'
                      }`}>{job.type}</span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">{job.dept}</span>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-[var(--color-body)] shrink-0 transition-transform duration-300 ${openJob === job.id ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openJob === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 border-t border-[var(--color-border-gray)] pt-4">
                        <p className="text-[var(--color-body)] leading-relaxed mb-6">{job.desc}</p>
                        <Link
                          to="/contact"
                          className="inline-block bg-[var(--color-primary)] hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
                        >
                          Apply for This Position
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center p-8 bg-[var(--color-primary)] rounded-2xl text-white">
            <h3 className="text-xl font-bold mb-3">Don't See a Suitable Role?</h3>
            <p className="text-gray-200 mb-6 max-w-lg mx-auto">
              We are always looking for talented professionals. Send us your CV and we'll keep you in mind for future openings.
            </p>
            <a
              href="mailto:elgibbor280@gmail.com"
              className="inline-block bg-[var(--color-premium)] hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Send Your CV
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
