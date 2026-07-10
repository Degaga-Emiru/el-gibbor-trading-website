import { motion } from 'framer-motion';
import { FaLinkedin } from 'react-icons/fa';
import { Mail, UserCircle, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';

/**
 * HOW TO UPDATE THIS PAGE:
 * 1. Add your team photos to: public/images/team/
 *    Name them like: ceo.jpg, director.jpg, manager1.jpg etc.
 * 2. Replace the `img` field below with: "/images/team/your-photo.jpg"
 * 3. Replace name, title, and email with real information.
 */
const teamMembers = [
  {
    id: 1,
    name: 'CEO Full Name',          // ← Replace with real name
    title: 'Chief Executive Officer',
    dept: 'Leadership',
    img: '',                         // ← Replace with "/images/team/ceo.jpg"
    email: 'elgibbor280@gmail.com',
    linkedin: '#'
  },
  {
    id: 2,
    name: 'Director Full Name',
    title: 'Managing Director',
    dept: 'Leadership',
    img: '',
    email: 'elgibbor280@gmail.com',
    linkedin: '#'
  },
  {
    id: 3,
    name: 'Operations Manager',
    title: 'Head of Operations',
    dept: 'Management',
    img: '',
    email: 'elgibbor280@gmail.com',
    linkedin: '#'
  },
  {
    id: 4,
    name: 'Trade Manager',
    title: 'Import & Export Manager',
    dept: 'Management',
    img: '',
    email: 'elgibbor280@gmail.com',
    linkedin: '#'
  },
  {
    id: 5,
    name: 'Logistics Officer',
    title: 'Senior Logistics Officer',
    dept: 'Staff',
    img: '',
    email: 'elgibbor280@gmail.com',
    linkedin: '#'
  },
  {
    id: 6,
    name: 'Sales Executive',
    title: 'Senior Sales Executive',
    dept: 'Staff',
    img: '',
    email: 'elgibbor280@gmail.com',
    linkedin: '#'
  },
];

const departments = ['Leadership', 'Management', 'Staff'];

const Team = () => {
  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Our Team"
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Our Team' }]}
      />

      {/* Info notice */}
      <div className="bg-blue-50 border-b border-blue-200 py-4">
        <div className="container mx-auto px-4 flex items-start gap-3">
          <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-blue-700 text-sm">
            <strong>To complete this page:</strong> Add your team photos to <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">public/images/team/</code> and update the names, titles, and emails in <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">src/pages/Team.tsx</code>.
          </p>
        </div>
      </div>

      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          <SectionHeading title="Meet the Team" subtitle="The People Behind El Gibbor" />

          {departments.map((dept) => {
            const members = teamMembers.filter(m => m.dept === dept);
            return (
              <div key={dept} className="mb-20">
                <h3 className="text-2xl font-bold text-[var(--color-heading)] mb-8 border-l-4 border-[var(--color-premium)] pl-4">
                  {dept} Team
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {members.map((member, idx) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border-gray)] group hover:shadow-xl transition-all"
                    >
                      {/* Photo area */}
                      <div className="relative h-72 overflow-hidden bg-gray-100">
                        {member.img ? (
                          <img
                            src={member.img}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <UserCircle size={80} className="text-gray-300 mb-3" />
                            <span className="text-gray-400 text-xs text-center px-4">
                              Add photo to<br /><code className="text-[10px]">/public/images/team/</code>
                            </span>
                          </div>
                        )}
                        {/* Hover overlay with social links */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-4">
                          <a
                            href={`mailto:${member.email}`}
                            className="w-10 h-10 bg-white/20 hover:bg-[var(--color-premium)] rounded-full flex items-center justify-center transition-colors text-white"
                          >
                            <Mail size={18} />
                          </a>
                          <a
                            href={member.linkedin}
                            className="w-10 h-10 bg-white/20 hover:bg-[var(--color-premium)] rounded-full flex items-center justify-center transition-colors text-white"
                          >
                            <FaLinkedin size={18} />
                          </a>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-6 text-center">
                        <h4 className="text-xl font-bold text-[var(--color-heading)] mb-1">{member.name}</h4>
                        <p className="text-[var(--color-premium)] font-semibold text-sm">{member.title}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Team;
