import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Mail, ExternalLink } from 'lucide-react';

const PHONE    = '+251911684013';
const PHONE_DISPLAY = '+251 911 68 40 13';
const EMAIL    = 'elgibbor280@gmail.com';
const ADDRESS  = 'Addis Ababa, 4 Kilo, Gelen Building';
const ADDRESS2 = '2nd Floor, Bldg No. 983, Room 213';
const MAP_URL  = 'https://www.google.com/maps/place/Gelen+BLDG./@9.0347772,38.7574129,17z/data=!3m1!4b1!4m6!3m5!1s0x164b8fbba11a3f0d:0x583d3842e2974633!8m2!3d9.0347772!4d38.7599878!16s%2Fg%2F11c5q6zg8b';

const Header = () => {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [isMobileMenuOpen, setMobileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home',      path: '/' },
    { name: 'About Us',  path: '/about' },
    { name: 'Products',  path: '/products' },
    { name: 'Services',  path: '/services' },
    { name: 'Contact',   path: '/contact' },
    { name: 'Staff',     path: '/staff' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">

        {/* ── Top info bar (desktop only) ─────────────────────────── */}
        <div className="hidden lg:flex items-center justify-end gap-6 text-xs text-[var(--color-body)] mb-1">
          <a href={`tel:${PHONE}`} className="flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors">
            <Phone size={11} /> {PHONE_DISPLAY}
          </a>
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors">
            <Mail size={11} /> {EMAIL}
          </a>
          <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors">
            <MapPin size={11} /> {ADDRESS}, {ADDRESS2}
          </a>
        </div>

        {/* ── Main nav row ─────────────────────────────────────────── */}
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/images/logo.png" alt="El Gibbor Trading" className="h-11 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-[var(--color-primary)] font-bold text-lg leading-tight">El Gibbor</span>
              <span className="text-[var(--color-premium)] text-xs font-semibold tracking-wider uppercase">Trading PLC</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-[var(--color-primary)] ${
                  location.pathname === link.path ? 'text-[var(--color-primary)]' : 'text-[var(--color-heading)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-2">
            {/* Call Now — shows phone number on hover/click */}
            <a
              href={`tel:${PHONE}`}
              title={PHONE_DISPLAY}
              className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-md font-medium text-sm transition-all hover:bg-blue-900 shadow-sm group"
            >
              <Phone size={15} />
              <span className="group-hover:hidden">Call Now</span>
              <span className="hidden group-hover:inline">{PHONE_DISPLAY}</span>
            </a>

            {/* Visit Us — links to Google Maps */}
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[var(--color-primary)] text-[var(--color-primary)] px-4 py-2 rounded-md font-medium text-sm transition-all hover:bg-[var(--color-primary)] hover:text-white"
            >
              <MapPin size={15} />
              <span>Visit Us</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-[var(--color-heading)]"
            onClick={() => setMobileMenu(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ─────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-[var(--color-border-gray)] max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col py-4 px-5 gap-1">

            {/* Nav links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-base font-medium py-3 border-b border-[var(--color-border-gray)] last:border-0 ${
                  location.pathname === link.path ? 'text-[var(--color-primary)]' : 'text-[var(--color-heading)]'
                }`}
                onClick={() => setMobileMenu(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* ── Contact Info Block ── */}
            <div className="mt-4 bg-[var(--color-background)] rounded-2xl p-5 border border-[var(--color-border-gray)] flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-premium)] mb-1">Contact Info</p>

              {/* Phone */}
              <a href={`tel:${PHONE}`} className="flex items-center gap-3 text-[var(--color-heading)] hover:text-[var(--color-primary)] transition-colors">
                <div className="w-9 h-9 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center shrink-0">
                  <Phone size={15} />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-body)]">Phone</p>
                  <p className="font-semibold text-sm">{PHONE_DISPLAY}</p>
                </div>
              </a>

              {/* Email */}
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-[var(--color-heading)] hover:text-[var(--color-primary)] transition-colors">
                <div className="w-9 h-9 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center shrink-0">
                  <Mail size={15} />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-body)]">Email</p>
                  <p className="font-semibold text-sm">{EMAIL}</p>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-start gap-3 text-[var(--color-heading)]">
                <div className="w-9 h-9 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={15} />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-body)]">Address</p>
                  <p className="font-semibold text-sm leading-snug">{ADDRESS}</p>
                  <p className="text-xs text-[var(--color-body)] mt-0.5">{ADDRESS2}</p>
                </div>
              </div>
            </div>

            {/* ── CTA Buttons ── */}
            <div className="mt-3 flex flex-col gap-3">
              <a
                href={`tel:${PHONE}`}
                className="flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-5 py-3.5 rounded-xl font-semibold w-full"
                onClick={() => setMobileMenu(false)}
              >
                <Phone size={18} /> Call Now — {PHONE_DISPLAY}
              </a>

              <a
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-5 py-3.5 rounded-xl font-semibold w-full hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                onClick={() => setMobileMenu(false)}
              >
                <ExternalLink size={18} /> Visit Our Office on Map
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
