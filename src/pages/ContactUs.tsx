import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, ExternalLink } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';

const ContactUs = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full" id="contact">
      {!hideHeader && (
        <PageHeader 
          title="Contact Us" 
          breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Contact' }]} 
        />
      )}

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Get in Touch" subtitle="If you want to work with us, need business guidance, or counsel — contact us below and we will reply" />
          
          <div className="flex flex-col lg:flex-row gap-12 mt-12">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-3/5 bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-[var(--color-border-gray)]"
            >
              <h3 className="text-2xl font-bold font-[var(--font-heading)] mb-6 text-[var(--color-heading)]">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--color-heading)] mb-2">Full Name *</label>
                    <input type="text" id="name" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--color-heading)] mb-2">Email Address *</label>
                    <input type="email" id="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-heading)] mb-2">Phone Number</label>
                    <input type="tel" id="phone" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all" placeholder="+251 911 00 00 00" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[var(--color-heading)] mb-2">Subject *</label>
                    <input type="text" id="subject" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all" placeholder="How can we help?" />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--color-heading)] mb-2">Message *</label>
                  <textarea id="message" required rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all resize-none" placeholder="Write your message here..."></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={formStatus !== 'idle'}
                  className={`w-full py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    formStatus === 'success' ? 'bg-green-600' : 'bg-[var(--color-primary)] hover:bg-blue-900'
                  }`}
                >
                  {formStatus === 'idle' && <><Send size={18} /> Send Message</>}
                  {formStatus === 'submitting' && 'Sending...'}
                  {formStatus === 'success' && 'Message Sent Successfully!'}
                </button>
              </form>
            </motion.div>

            {/* Contact Details */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-2/5 flex flex-col gap-6"
            >
              <div className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-border-gray)] flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--color-primary)] shrink-0 shadow-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-[var(--font-heading)] text-[var(--color-heading)] mb-2">Head Office</h4>
                  <p className="text-[var(--color-body)] leading-relaxed">
                    Addis Ababa, 4 kilo, Gelen Building<br />
                    2nd floor, Building No 983 Room No 213
                  </p>
                </div>
              </div>

              <div className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-border-gray)] flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--color-primary)] shrink-0 shadow-sm">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-[var(--font-heading)] text-[var(--color-heading)] mb-2">Phone</h4>
                  <p className="text-[var(--color-body)] leading-relaxed flex flex-col">
                    <a href="tel:+251911684013" className="hover:text-[var(--color-premium)] transition-colors">+251 911 68 40 13</a>
                  </p>
                </div>
              </div>

              <div className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-border-gray)] flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--color-primary)] shrink-0 shadow-sm">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-[var(--font-heading)] text-[var(--color-heading)] mb-2">Email</h4>
                  <p className="text-[var(--color-body)] leading-relaxed flex flex-col">
                    <a href="mailto:elgibbor280@gmail.com" className="hover:text-[var(--color-premium)] transition-colors">elgibbor280@gmail.com</a>
                  </p>
                </div>
              </div>

              <div className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-border-gray)] flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--color-primary)] shrink-0 shadow-sm">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-[var(--font-heading)] text-[var(--color-heading)] mb-2">Business Hours</h4>
                  <p className="text-[var(--color-body)] leading-relaxed">
                    Monday - Friday: 8:00 AM - 5:00 PM<br />
                    Saturday: 8:00 AM - 12:30 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="bg-[var(--color-background)] py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Banner above map */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6 bg-white rounded-2xl border border-[var(--color-border-gray)] shadow-sm px-8 py-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--color-heading)] font-[var(--font-heading)]">
                  Use the map below to visit our office
                </h3>
                <p className="text-[var(--color-body)] text-sm mt-1">
                  Addis Ababa, 4 Kilo, Gelen Building<br />
                  2nd Floor, Building No. 983, Room No. 213
                </p>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/place/Gelen+BLDG./@9.0347772,38.7574129,17z/data=!3m1!4b1!4m6!3m5!1s0x164b8fbba11a3f0d:0x583d3842e2974633!8m2!3d9.0347772!4d38.7599878!16s%2Fg%2F11c5q6zg8b"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--color-premium)] hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-md hover:shadow-lg whitespace-nowrap shrink-0"
            >
              <ExternalLink size={16} /> Open in Google Maps
            </a>
          </div>

          {/* Embedded map */}
          <div className="rounded-2xl overflow-hidden shadow-xl border border-[var(--color-border-gray)]" style={{ height: '420px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.317468804887!2d38.75741287479406!3d9.034777191026775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8fbba11a3f0d%3A0x583d3842e2974633!2zR2VsZW4gQkxERy4gfCDhjIjhiIjhipUg4YiV4YqV4Y2D!5e0!3m2!1sen!2set!4v1783670021717!5m2!1sen!2set"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="El Gibbor Trading Office Location — Gelen Building, Addis Ababa"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
