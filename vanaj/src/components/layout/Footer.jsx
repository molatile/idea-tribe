import { Link } from 'react-router-dom';

const Footer = () => {
  const links = [
    { name: 'Dance', path: '/dance' },
    { name: 'Languages', path: '/languages' },
    { name: 'Food', path: '/food' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Tourism', path: '/tourism' },
    { name: 'Oral History', path: '/archive' },
  ];

  return (
    <footer className="relative bg-vanaj-very-dark text-vanaj-cream pt-24 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-tribal-pattern opacity-5 mix-blend-overlay"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        
        <Link to="/" className="font-heading font-bold text-6xl md:text-8xl text-vanaj-ochre block mb-4" style={{ textShadow: "0 0 20px rgba(201, 149, 42, 0.3)" }}>
          वनज <span className="text-4xl md:text-6xl font-light tracking-widest text-vanaj-cream ml-4">VANAJ</span>
        </Link>
        <p className="text-vanaj-ochre text-xl md:text-2xl font-heading mb-16 tracking-wide">
          झारखंड की जीवंत विरासत
        </p>

        <ul className="flex flex-wrap justify-center gap-8 md:gap-12 mb-16">
          {links.map((link) => (
            <li key={link.name}>
              <Link to={link.path} className="text-vanaj-cream/80 hover:text-vanaj-ochre transition-colors text-sm uppercase tracking-widest">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-vanaj-ochre/30 to-transparent mb-8"></div>
        
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-vanaj-cream/40 uppercase tracking-wider">
          <p>© {new Date().getFullYear()} Vanaj. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Honoring Jharkhand's Indigenous Roots</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
