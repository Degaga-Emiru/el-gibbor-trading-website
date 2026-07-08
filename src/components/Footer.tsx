import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-primary)] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-[var(--color-primary)] font-bold text-xl">
                EG
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight">El Gibbor</span>
                <span className="text-[var(--color-premium)] text-xs font-semibold tracking-wider uppercase">Trading PLC</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              A premier trading company specializing in the import and export of tyres, automobiles, automotive spare parts, and general trading services.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[var(--color-premium)]">
                <FaFacebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[var(--color-premium)]">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[var(--color-premium)]">
                <FaLinkedin size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[var(--color-premium)]">
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-[var(--font-heading)] border-b border-white/20 pb-3 inline-block">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors text-sm">Products</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors text-sm">Services</Link></li>
              <li><Link to="/projects" className="text-gray-300 hover:text-white transition-colors text-sm">Projects</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-[var(--font-heading)] border-b border-white/20 pb-3 inline-block">Our Services</h3>
            <ul className="flex flex-col gap-3">
              <li className="text-gray-300 text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-premium)]"></span> General Trading</li>
              <li className="text-gray-300 text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-premium)]"></span> Import & Export</li>
              <li className="text-gray-300 text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-premium)]"></span> Distribution</li>
              <li className="text-gray-300 text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-premium)]"></span> Supply Services</li>
              <li className="text-gray-300 text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-premium)]"></span> Logistics</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-[var(--font-heading)] border-b border-white/20 pb-3 inline-block">Contact Info</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[var(--color-premium)] shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">Addis Ababa, Ethiopia<br />(Full Address Placeholder)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-[var(--color-premium)] shrink-0" />
                <span className="text-gray-300 text-sm">+251 911 00 00 00<br />+251 110 00 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-[var(--color-premium)] shrink-0" />
                <span className="text-gray-300 text-sm">info@elgibbortrading.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} El Gibbor Trading One Member PLC. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
