import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Dance', path: '/dance' },
    { name: 'Languages', path: '/languages' },
    { name: 'Food', path: '/food' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Tourism', path: '/tourism' },
  ];

  const isHome = location.pathname === '/';
  const isDance = location.pathname === '/dance';

  // Determine navbar appearance based on page type and scroll state
  let navClasses = 'fixed w-full z-50 transition-all duration-300 ';
  let textColor = '';
  let activeColor = 'text-vanaj-ochre';
  let hoverColor = 'hover:text-vanaj-ochre';
  let mobileDrawerBg = 'bg-vanaj-cream text-vanaj-dark';

  if (isDance) {
    // Dance page is completely dark (#0D0D0D)
    navClasses += isScrolled
      ? 'bg-[#0D0D0D]/95 backdrop-blur-md shadow-lg border-b border-white/10 py-3.5 '
      : 'bg-transparent py-5 ';
    textColor = 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]';
    mobileDrawerBg = 'bg-[#0D0D0D] text-white border-b border-white/10';
  } else if (isHome) {
    // Home page has a dark hero section, followed by mixed dark/cream sections
    navClasses += isScrolled
      ? 'bg-vanaj-cream/95 backdrop-blur-md shadow-md border-b border-vanaj-dark/10 py-3.5 '
      : 'bg-transparent py-5 ';
    textColor = isScrolled
      ? 'text-vanaj-dark'
      : 'text-vanaj-cream drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]';
    mobileDrawerBg = 'bg-vanaj-cream text-vanaj-dark';
  } else {
    // All other pages (Food, Languages, Marketplace, Tourism, etc.) have light backgrounds
    // Never allow transparent with white/cream text here!
    navClasses += isScrolled
      ? 'bg-vanaj-cream/95 backdrop-blur-md shadow-md border-b border-vanaj-dark/10 py-3.5 '
      : 'bg-vanaj-cream/90 backdrop-blur-md shadow-sm border-b border-vanaj-dark/10 py-4 ';
    textColor = 'text-vanaj-dark';
    mobileDrawerBg = 'bg-vanaj-cream text-vanaj-dark';
  }

  const logoColor = isDance
    ? 'text-white hover:text-vanaj-ochre'
    : isHome && !isScrolled
    ? 'text-vanaj-cream drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] hover:text-vanaj-ochre'
    : 'text-vanaj-dark hover:text-vanaj-ochre';

  const toggleColor = isDance
    ? 'text-white'
    : isHome && !isScrolled
    ? 'text-vanaj-cream'
    : 'text-vanaj-dark';

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className={`font-heading font-bold text-3xl tracking-wide transition-colors duration-200 ${logoColor}`}>
          वनज
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 font-medium">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative py-1 transition-colors duration-200 font-medium ${
                  isActive
                    ? 'text-vanaj-ochre font-semibold'
                    : `${textColor} ${hoverColor}`
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-vanaj-ochre rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden p-1 transition-colors ${toggleColor}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 w-full shadow-2xl flex flex-col py-6 px-6 gap-5 ${mobileDrawerBg}`}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-medium border-b pb-2 flex items-center justify-between transition-colors ${
                  isDance
                    ? `border-white/10 ${isActive ? 'text-vanaj-ochre font-semibold' : 'text-white/90 hover:text-vanaj-ochre'}`
                    : `border-vanaj-dark/10 ${isActive ? 'text-vanaj-ochre font-semibold' : 'text-vanaj-dark hover:text-vanaj-ochre'}`
                }`}
              >
                <span>{link.name}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-vanaj-ochre" />}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
