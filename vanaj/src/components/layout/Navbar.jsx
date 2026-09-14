import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dance', path: '/dance' },
    { name: 'Languages', path: '/languages' },
    { name: 'Food', path: '/food' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Tourism', path: '/tourism' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-vanaj-cream/95 backdrop-blur-md shadow-md py-4 text-vanaj-dark' : 'bg-transparent py-6 text-vanaj-cream'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="font-heading font-bold text-3xl tracking-wide">
          वनज
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 font-medium">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="hover:text-vanaj-ochre transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-vanaj-cream shadow-xl flex flex-col py-6 px-6 gap-6 text-vanaj-dark">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium border-b border-vanaj-dark/10 pb-2">
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
