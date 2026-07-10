import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Mail, AlertCircle, Headphones } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';

const OfficeInfo = () => {
  const schedule = [
    { day: 'Monday', hours: '8:00 AM – 5:00 PM', open: true },
    { day: 'Tuesday', hours: '8:00 AM – 5:00 PM', open: true },
    { day: 'Wednesday', hours: '8:00 AM – 5:00 PM', open: true },
    { day: 'Thursday', hours: '8:00 AM – 5:00 PM', open: true },
    { day: 'Friday', hours: '8:00 AM – 5:00 PM', open: true },
    { day: 'Saturday', hours: '8:00 AM – 12:30 PM', open: true },
    { day: 'Sunday', hours: 'Closed', open: false },
  ];

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Office Information"
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Office Info' }]}
      />

      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Office Details" subtitle="Visit or Contact Us" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-border-gray)] lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 text-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-heading)]">Business Hours</h3>
              </div>
              <div className="space-y-3">
                {schedule.map((row) => (
                  <div
                    key={row.day}
                    className={`flex justify-between items-center py-3 px-4 rounded-xl ${
                      row.open ? 'bg-[var(--color-background)]' : 'bg-red-50'
                    }`}
                  >
                    <span className={`font-semibold ${row.open ? 'text-[var(--color-heading)]' : 'text-red-500'}`}>
                      {row.day}
                    </span>
                    <span className={`text-sm font-medium ${row.open ? 'text-[var(--color-body)]' : 'text-red-500'}`}>
                      {row.hours}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-border-gray)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-50 text-[var(--color-premium)] rounded-full flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-heading)]">Head Office</h3>
                </div>
                <p className="text-[var(--color-body)] leading-relaxed">
                  Addis Ababa, 4 kilo<br />
                  Gelen Building, 2nd Floor<br />
                  Building No. 983, Room No. 213<br />
                  Ethiopia
                </p>
              </div>

              <div className="bg-[var(--color-primary)] rounded-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Headphones size={22} className="text-[var(--color-premium)]" />
                  <h3 className="text-xl font-bold">Customer Support</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">Monday – Saturday<br />8:00 AM – 5:00 PM</p>
                <a href="tel:+251911684013" className="flex items-center gap-2 text-white font-semibold hover:text-[var(--color-premium)] transition-colors">
                  <Phone size={18} /> +251 911 68 40 13
                </a>
                <a href="mailto:elgibbor280@gmail.com" className="flex items-center gap-2 text-white font-semibold hover:text-[var(--color-premium)] transition-colors mt-3">
                  <Mail size={18} /> elgibbor280@gmail.com
                </a>
              </div>
            </motion.div>
          </div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-8 flex items-start gap-4"
          >
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-red-700 mb-2">Emergency / After-Hours Contact</h4>
              <p className="text-red-600 mb-3">
                For urgent business matters outside of normal business hours, please reach us directly:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+251911684013" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
                  <Phone size={16} /> +251 911 68 40 13
                </a>
                <a href="mailto:elgibbor280@gmail.com" className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
                  <Mail size={16} /> elgibbor280@gmail.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Map Embed */}
          <div className="mt-12 rounded-2xl overflow-hidden border border-[var(--color-border-gray)] shadow-sm">
            <div className="bg-gray-200 h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={40} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Addis Ababa, 4 kilo, Gelen Building</p>
                <p className="text-gray-400 text-sm">Google Map Embed (Replace with actual embed)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OfficeInfo;
