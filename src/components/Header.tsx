import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/#about' },
    { name: 'Products', path: '/#products' },
    { name: 'Services', path: '/#services' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="El Gibbor Trading"
              className="h-11 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="text-[var(--color-primary)] font-bold text-lg leading-tight">El Gibbor</span>
              <span className="text-[var(--color-premium)] text-xs font-semibold tracking-wider uppercase">Trading PLC</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
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

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+251911684013"
              className="hidden md:flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors hover:bg-blue-900 shadow-sm"
            >
              <Phone size={16} />
              <span>Call Now</span>
            </a>
            
            <button
              className="lg:hidden p-2 text-[var(--color-heading)]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-[var(--color-border-gray)]">
          <div className="flex flex-col py-4 px-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-base font-medium py-2 border-b border-[var(--color-border-gray)] last:border-0 ${
                  location.pathname === link.path ? 'text-[var(--color-primary)]' : 'text-[var(--color-heading)]'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="tel:+251911684013"
              className="flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-5 py-3 rounded-md font-medium mt-2 w-full text-center"
            >
              <Phone size={18} />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
