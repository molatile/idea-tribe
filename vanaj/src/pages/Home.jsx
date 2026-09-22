import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import FestivalStrip from '../components/shared/FestivalStrip';
import OpportunitySection from '../components/shared/OpportunitySection';

// --- SVG Patterns and Icons ---

const HeroPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hero-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <g stroke="#C9952A" strokeWidth="1.5" fill="none" opacity="0.6">
          {/* Khovar inspired comb curves */}
          <path d="M0 30 Q 30 0 60 30 T 120 30" />
          <path d="M0 40 Q 30 10 60 40 T 120 40" />
          <path d="M0 50 Q 30 20 60 50 T 120 50" />
          {/* Sohrai geometric border dots */}
          <circle cx="30" cy="90" r="3" fill="#C9952A" />
          <circle cx="60" cy="90" r="3" fill="#C9952A" />
          <circle cx="90" cy="90" r="3" fill="#C9952A" />
          <line x1="0" y1="90" x2="120" y2="90" strokeDasharray="4 4" />
          {/* Paitkar subtle leaf motif */}
          <path d="M 60 60 C 70 60, 80 70, 60 80 C 40 70, 50 60, 60 60 Z" />
        </g>
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#hero-pattern)" />
  </svg>
);

const SohraiBorder = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="sohrai-border" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M 10 10 L 90 10 L 90 90 L 10 90 Z" fill="none" stroke="#2C1A0E" strokeWidth="2" strokeDasharray="10 5" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="#8B5E3C" strokeWidth="1" />
        <circle cx="50" cy="50" r="5" fill="#8B5E3C" />
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#sohrai-border)" />
  </svg>
);

const TribalSymbols = [
  {
    tribe: 'Santhali',
    name: 'Jaher Than',
    meaning: 'Sacred Grove of the Sal Trees',
    svg: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 mb-6 text-vanaj-ochre drop-shadow-[0_0_15px_rgba(201,149,42,0.4)]" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M50 90 V30 M30 70 Q50 50 50 30 M70 70 Q50 50 50 30 M40 50 Q50 35 50 20 M60 50 Q50 35 50 20" strokeLinecap="round"/>
        <circle cx="50" cy="15" r="4" fill="currentColor"/>
        <circle cx="35" cy="40" r="3" fill="currentColor"/>
        <circle cx="65" cy="40" r="3" fill="currentColor"/>
      </svg>
    )
  },
  {
    tribe: 'Munda',
    name: 'Sasandiri',
    meaning: 'Ancestral Burial Stones',
    svg: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 mb-6 text-vanaj-ochre drop-shadow-[0_0_15px_rgba(201,149,42,0.4)]" fill="none" stroke="currentColor" strokeWidth="3">
        <rect x="20" y="60" width="60" height="20" rx="2" />
        <rect x="35" y="30" width="30" height="30" rx="2" />
        <circle cx="50" cy="45" r="5" fill="currentColor" />
        <path d="M10 80 H90" strokeLinecap="round" />
      </svg>
    )
  },
  {
    tribe: 'Oraon',
    name: 'Mandar',
    meaning: 'The Heartbeat of the Community',
    svg: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 mb-6 text-vanaj-ochre drop-shadow-[0_0_15px_rgba(201,149,42,0.4)]" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M25 30 L75 30 Q90 50 75 70 L25 70 Q10 50 25 30 Z" />
        <line x1="25" y1="30" x2="75" y2="70" />
        <line x1="75" y1="30" x2="25" y2="70" />
        <line x1="50" y1="30" x2="50" y2="70" strokeDasharray="4 4" />
      </svg>
    )
  },
  {
    tribe: 'Ho',
    name: 'Lota',
    meaning: 'Hospitality and Purity',
    svg: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 mb-6 text-vanaj-ochre drop-shadow-[0_0_15px_rgba(201,149,42,0.4)]" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M40 20 Q50 30 60 20" />
        <path d="M35 20 C20 40 20 60 35 80 Q50 90 65 80 C80 60 80 40 65 20 Z" />
        <path d="M30 40 H70 M25 60 H75" strokeDasharray="2 4" />
      </svg>
    )
  }
];

const Home = () => {
  const sections = [
    { title: 'Dance & Rhythms', name: 'नृत्य', path: '/dance', desc: 'Experience the energetic Chhau and Santhali dances.', gradient: 'from-[#4A2E1B] to-[#C9952A]' },
    { title: 'Languages', name: 'भाषा', path: '/languages', desc: 'Explore the map of Santali, Ho, and Mundari.', gradient: 'from-[#3A2015] to-[#8B5E3C]' },
    { title: 'Tribal Cuisine', name: 'भोजन', path: '/food', desc: 'Discover traditional flavors and foraging secrets.', gradient: 'from-[#8B5E3C] to-[#C9952A]' },
    { title: 'Marketplace', name: 'बाज़ार', path: '/marketplace', desc: 'Authentic Dokra art and handcrafted weaves.', gradient: 'from-[#2C1A0E] to-[#4A2E1B]' },
    { title: 'Tourism Map', name: 'पर्यटन', path: '/tourism', desc: 'Navigate sacred groves and vibrant villages.', gradient: 'from-[#5E3A24] to-[#C9952A]' },
    { title: 'Oral History', name: 'इतिहास', path: '/archive', desc: 'Listen to folklore and ancestral songs.', gradient: 'from-[#2C1A0E] to-[#8B5E3C]' },
  ];

  return (
    <div className="w-full bg-vanaj-dark text-vanaj-cream selection:bg-vanaj-ochre selection:text-vanaj-dark">
      
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#2C1A0E] via-[#5E3A24] to-[#8B5E3C]">
        <HeroPattern />
        
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#2C1A0E] to-transparent z-10 pointer-events-none"></div>

        <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-5xl mx-auto mt-16">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-vanaj-cream font-heading font-bold text-[140px] md:text-[220px] leading-[0.8] mb-6 drop-shadow-[0_0_40px_rgba(201,149,42,0.6)]"
          >
            वनज
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-vanaj-ochre text-xl md:text-3xl font-light tracking-[0.6em] uppercase mb-4"
          >
            Vanaj
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="text-vanaj-cream/90 text-sm md:text-lg tracking-[0.2em] font-light mb-16 max-w-2xl leading-relaxed"
          >
            Journey into the heart of Jharkhand. A celebration of living heritage, ancient wisdom, and the rhythm of the forest.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <Link to="/marketplace" className="group relative px-10 py-4 bg-vanaj-ochre text-vanaj-dark rounded-sm font-medium text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(201,149,42,0.5)]">
              <span className="relative z-10">Explore Collection</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
            </Link>
            <Link to="/tourism" className="group relative px-10 py-4 border border-vanaj-ochre text-vanaj-ochre rounded-sm font-medium text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 hover:text-vanaj-dark hover:shadow-[0_0_20px_rgba(201,149,42,0.3)]">
              <span className="relative z-10">Discover Heritage</span>
              <div className="absolute inset-0 bg-vanaj-ochre translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tribal Engravings Section */}
      <section className="py-32 bg-[#1A0F08] relative overflow-hidden border-t border-[#3A2015]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-vanaj-cream text-4xl md:text-5xl font-heading mb-6">Sacred Symbols</h2>
            <div className="w-16 h-1 bg-vanaj-ochre mx-auto rounded-full shadow-[0_0_10px_rgba(201,149,42,0.8)]"></div>
            <p className="mt-8 text-vanaj-cream/60 max-w-2xl mx-auto tracking-wide">
              The language of the earth, etched in mud, stone, and memory. Each tribe carries its own lexicon of symbols connecting them to ancestors and nature.
            </p>
          </div>
          
          <div className="flex overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar gap-8 md:grid md:grid-cols-4 md:gap-12 md:overflow-visible">
            {TribalSymbols.map((item, idx) => (
              <div key={idx} className="min-w-[280px] md:min-w-0 snap-center flex flex-col items-center text-center p-8 border border-[#3A2015] bg-[#22130A] rounded-lg transition-transform duration-500 hover:-translate-y-2 hover:border-vanaj-ochre/50 hover:shadow-[0_10px_40px_rgba(201,149,42,0.1)]">
                {item.svg}
                <h3 className="text-vanaj-ochre text-xl font-heading font-medium mb-1 tracking-wider">{item.tribe}</h3>
                <h4 className="text-vanaj-cream text-lg font-medium mb-3">{item.name}</h4>
                <p className="text-sm text-vanaj-cream/70 leading-relaxed font-light">{item.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Vanaj Section */}
      <section className="py-40 px-6 bg-vanaj-cream relative overflow-hidden text-vanaj-dark">
        <SohraiBorder />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/3 flex justify-center">
            <div className="w-48 h-48 md:w-72 md:h-72 rounded-full border-[10px] border-[#8B5E3C] flex items-center justify-center p-4 relative">
              <div className="absolute inset-0 border-[2px] border-dashed border-[#2C1A0E] rounded-full animate-[spin_60s_linear_infinite]"></div>
              <span className="text-[#8B5E3C] text-8xl md:text-9xl font-heading leading-none drop-shadow-md">व</span>
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-[#2C1A0E] text-4xl md:text-6xl font-heading font-bold mb-10 leading-tight">
              The Spirit of <span className="text-[#8B5E3C]">Aranya</span>
            </h2>
            <div className="border-l-[4px] border-[#8B5E3C] pl-8 py-2 space-y-6">
              <p className="text-[#2C1A0E] text-xl md:text-2xl leading-relaxed font-medium">
                Jharkhand, "The Land of Forests," is home to 32 distinct tribal communities, each carrying thousands of years of wisdom, art, and harmony with nature.
              </p>
              <p className="text-[#4A2E1B] text-lg md:text-xl leading-relaxed font-light">
                Vanaj is a digital canvas dedicated to preserving and celebrating this incredible diversity. From the reverberating beats of the Mandar to the intricate lost-wax casting of Dokra artisans, we bring the heart of Central India to the world in its most authentic form.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Cards */}
      <section className="py-32 px-6 bg-[#1A0F08] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-vanaj-cream text-5xl md:text-6xl font-heading mb-6 drop-shadow-lg">Discover the Heritage</h2>
            <div className="w-16 h-1 bg-vanaj-ochre mx-auto rounded-full shadow-[0_0_10px_rgba(201,149,42,0.8)]"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[320px]">
            {sections.map((s, i) => (
              <Link 
                key={s.title} 
                to={s.path} 
                className={`group block relative p-10 rounded-xl overflow-hidden transition-all duration-700 hover:-translate-y-2 bg-gradient-to-br ${s.gradient} shadow-xl hover:shadow-[0_20px_50px_rgba(201,149,42,0.2)]`}
              >
                {/* Tribal pattern overlay per card */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.07] group-hover:opacity-[0.15] transition-opacity duration-700 pointer-events-none mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
                  <pattern id={`card-pattern-${i}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="#FFF" strokeWidth="1" />
                    <circle cx="20" cy="20" r="3" fill="#FFF" />
                  </pattern>
                  <rect x="0" y="0" width="100%" height="100%" fill={`url(#card-pattern-${i})`} />
                </svg>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-heading text-7xl md:text-8xl mb-2 opacity-20 text-white font-bold tracking-tight transform group-hover:scale-105 transition-transform duration-700 origin-left">{s.name}</h3>
                    <h4 className="font-heading text-3xl mb-4 text-white drop-shadow-md">{s.title}</h4>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-sm leading-relaxed max-w-[85%] text-white/80 font-light">{s.desc}</p>
                    <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white bg-white/5 backdrop-blur-sm group-hover:bg-white group-hover:text-vanaj-dark group-hover:border-white transition-all duration-500">
                      <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunity Section */}
      <OpportunitySection />

      {/* Festival Strip */}
      <FestivalStrip />

    </div>
  );
};

export default Home;
