import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import FestivalStrip from '../components/shared/FestivalStrip';

const Home = () => {
  const sections = [
    { title: 'Dance & Rhythms', name: 'नृत्य', emoji: '🥁', path: '/dance', desc: 'Experience the energetic Chhau and Santhali dances.', className: 'md:col-span-2 md:row-span-2 bg-[#1B4332]', shadow: 'hover:shadow-[0_20px_40px_rgba(45,106,79,0.3)]' },
    { title: 'Languages', name: 'भाषा', emoji: '🗣️', path: '/languages', desc: 'Explore the map of Santali, Ho, and Mundari.', className: 'md:col-span-1 md:row-span-1 bg-[#8B1A1A]', shadow: 'hover:shadow-[0_20px_40px_rgba(139,26,26,0.3)]' },
    { title: 'Tribal Cuisine', name: 'भोजन', emoji: '🍲', path: '/food', desc: 'Discover traditional flavors.', className: 'md:col-span-1 md:row-span-2 bg-[#C9952A] text-vanaj-dark', shadow: 'hover:shadow-[0_20px_40px_rgba(201,149,42,0.3)]' },
    { title: 'Marketplace', name: 'बाज़ार', emoji: '🏺', path: '/marketplace', desc: 'Authentic Dokra art and crafts.', className: 'md:col-span-1 md:row-span-1 bg-[#2c1b10]', shadow: 'hover:shadow-[0_20px_40px_rgba(44,27,16,0.3)]' },
    { title: 'Tourism Map', name: 'पर्यटन', emoji: '🗺️', path: '/tourism', desc: 'Navigate sacred groves and villages.', className: 'md:col-span-1 md:row-span-2 bg-[#17322a]', shadow: 'hover:shadow-[0_20px_40px_rgba(23,50,42,0.3)]' },
    { title: 'Oral History', name: 'इतिहास', emoji: '🎙️', path: '/archive', desc: 'Listen to folklore and songs.', className: 'md:col-span-2 md:row-span-1 bg-[#3a2015]', shadow: 'hover:shadow-[0_20px_40px_rgba(58,32,21,0.3)]' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-vanaj-dark">
        {/* Deep layered background */}
        <div className="absolute inset-0 bg-gradient-to-b from-vanaj-dark via-vanaj-dark/90 to-vanaj-red opacity-90 z-0"></div>
        
        {/* Drifting tribal pattern */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-tribal-pattern opacity-10 z-0 pointer-events-none"
        ></motion.div>

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-vanaj-cream font-heading font-bold text-[120px] md:text-[180px] leading-none mb-0"
            style={{ textShadow: "0 0 50px rgba(201, 149, 42, 0.4)" }}
          >
            वनज
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-vanaj-ochre text-2xl md:text-3xl font-light tracking-[0.5em] uppercase mt-2 mb-8"
          >
            Vanaj
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-vanaj-cream/80 text-sm md:text-base tracking-[0.3em] font-light uppercase mb-16"
          >
            Jharkhand's Living Heritage
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-8"
          >
            <Link to="/marketplace" className="bg-vanaj-ochre text-vanaj-dark px-12 py-5 rounded-sm font-semibold hover:bg-vanaj-cream transition-all duration-300 text-sm tracking-widest uppercase hover:shadow-[0_0_20px_rgba(201,149,42,0.4)]">
              Explore Marketplace
            </Link>
            <Link to="/tourism" className="border border-vanaj-ochre text-vanaj-ochre px-12 py-5 rounded-sm font-semibold hover:bg-vanaj-ochre hover:text-vanaj-dark transition-all duration-300 text-sm tracking-widest uppercase hover:shadow-[0_0_20px_rgba(201,149,42,0.2)]">
              Discover Culture
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Vanaj */}
      <section className="py-32 px-6 bg-vanaj-dark-cream relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 opacity-5 pointer-events-none text-[500px] text-vanaj-ochre font-heading leading-none select-none">
          व
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center relative z-10">
          <div className="md:col-span-5 hidden md:block">
            {/* Visual spacer for the oversized symbol */}
          </div>
          <div className="md:col-span-7">
            <h2 className="text-vanaj-dark text-4xl md:text-6xl font-heading font-bold mb-10">The Spirit of the Forest</h2>
            <div className="border-l-[3px] border-vanaj-ochre pl-8 py-2">
              <p className="text-vanaj-dark text-lg md:text-xl leading-relaxed mb-6 font-medium">
                Jharkhand, meaning "The Land of Forests," is home to 32 distinct tribal communities, each carrying thousands of years of wisdom, art, and harmony with nature.
              </p>
              <p className="text-vanaj-dark/80 text-lg md:text-xl leading-relaxed">
                Vanaj is a digital canvas dedicated to preserving and celebrating this incredible diversity. From the reverberating beats of the Mandar to the intricate lost-wax casting of Dokra artisans, we bring the heart of Central India to the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Cards */}
      <section className="py-32 px-6 bg-[#0a140f] relative">
        <div className="absolute inset-0 bg-tribal-pattern opacity-5 pointer-events-none"></div>
        <div className="text-center mb-24 relative z-10">
          <h2 className="text-vanaj-cream text-5xl md:text-6xl font-heading mb-6">Discover the Heritage</h2>
          <div className="w-16 h-1 bg-vanaj-ochre mx-auto"></div>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px] relative z-10">
          {sections.map((s) => (
            <Link key={s.title} to={s.path} className={`group block relative p-10 rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-2 border-b-2 border-transparent hover:border-vanaj-ochre ${s.className} ${s.shadow}`}>
              {/* Noise overlay */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <span className="text-4xl block mb-6">{s.emoji}</span>
                  <h3 className={`font-heading text-6xl mb-2 opacity-30 ${s.title === 'Tribal Cuisine' ? 'text-vanaj-dark' : 'text-vanaj-cream'}`}>{s.name}</h3>
                  <h4 className={`font-heading text-3xl mb-4 ${s.title === 'Tribal Cuisine' ? 'text-vanaj-dark' : 'text-vanaj-cream'}`}>{s.title}</h4>
                </div>
                <div className="flex justify-between items-end">
                  <p className={`text-sm leading-relaxed max-w-[80%] ${s.title === 'Tribal Cuisine' ? 'text-vanaj-dark/80' : 'text-vanaj-cream/80'}`}>{s.desc}</p>
                  <div className={`opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 ${s.title === 'Tribal Cuisine' ? 'text-vanaj-dark' : 'text-vanaj-ochre'}`}>
                    <ArrowRight size={28} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tribal History Section */}
      <section className="py-32 px-6 bg-vanaj-very-dark relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-24 text-center">
            <h2 className="text-vanaj-cream text-5xl md:text-7xl font-heading font-bold mb-8">Roots of the Soil</h2>
            <div className="w-24 h-1 bg-vanaj-ochre mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              { name: 'Santhal', icon: '🏹', desc: 'Austroasiatic roots, renowned for their Ol Chiki script and sacred Jaher Than groves.' },
              { name: 'Munda', icon: '🌿', desc: 'Ancient agrarian wisdom and intricate customary laws spanning generations.' },
              { name: 'Ho', icon: '🌾', desc: 'Deep reverence for nature, guided by traditional governance and Desauli.' },
              { name: 'Oraon', icon: '🥁', desc: 'Dravidian heritage, celebrated globally through the majestic Sarhul festival.' }
            ].map(tribe => (
              <div key={tribe.name} className="flex flex-col relative group">
                <div className="text-5xl mb-6">{tribe.icon}</div>
                <h3 className="text-vanaj-ochre text-3xl font-heading mb-4 group-hover:text-vanaj-cream transition-colors">{tribe.name}</h3>
                <p className="text-vanaj-cream/60 text-sm leading-relaxed flex-grow">{tribe.desc}</p>
                <div className="mt-8 w-12 h-px bg-vanaj-ochre/50 group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Strip */}
      <FestivalStrip />

    </div>
  );
};

export default Home;
