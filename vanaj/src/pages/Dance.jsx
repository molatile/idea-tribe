import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Share2, Check } from 'lucide-react';

const DANCES = [
  {
    id: 'ho',
    name: 'Ho Folk Dance',
    tribe: 'Ho',
    occasion: 'Mage and Phagu festivals',
    region: 'West Singhbhum',
    significance: 'Celebrates the creation of the world and agricultural cycles. Characterized by synchronized rhythmic movements, often performed in a circle or semi-circle. It emphasizes community bonding and connection to nature.',
    videoSrc: '/videos/dance/ho-folk dance.mp4',
    hasVideo: true,
  },
  {
    id: 'oraon',
    name: 'Oraon Folk Dance',
    tribe: 'Oraon',
    occasion: 'Karma and Sarhul festivals',
    region: 'Ranchi, Gumla',
    significance: 'Vibrant and energetic, honoring nature and the Karam tree. Involves complex footwork and joyous formations, typically accompanied by the rhythmic beats of the Mandar and Nagara.',
    videoSrc: '/videos/dance/oraon-folk dance (2).mp4',
    hasVideo: true,
  },
  {
    id: 'chhau',
    name: 'Chhau Dance',
    tribe: 'Various',
    occasion: 'Chaitra Parva',
    region: 'Seraikela',
    significance: 'A martial and semi-classical dance form originating from the Chota Nagpur Plateau, characterized by elaborate masks, vigorous martial movements, and storytelling based on epics like the Mahabharata and Ramayana.',
    hasVideo: false,
  },
  {
    id: 'karma',
    name: 'Karma Dance',
    tribe: 'Baiga, Oraon, Munda',
    occasion: 'Karma festival',
    region: 'Across Jharkhand',
    significance: 'Performed to please Karam Devta, the god of power and youth. Dancers form a circle, placing arms around each other\'s waists, moving rhythmically to pray for a good harvest and protection.',
    hasVideo: false,
  },
  {
    id: 'jhumair',
    name: 'Jhumair',
    tribe: 'Sadan, Kurmi',
    occasion: 'Harvest season, festivals',
    region: 'Chota Nagpur',
    significance: 'A popular folk dance performed largely by women during the harvest season. It expresses joy and gratitude for a bountiful crop, with songs reflecting the daily life and struggles of the agrarian community.',
    hasVideo: false,
  },
  {
    id: 'paika',
    name: 'Paika Dance',
    tribe: 'Munda',
    occasion: 'Weddings, welcoming guests',
    region: 'Khunti, Ranchi',
    significance: 'A traditional martial dance performed exclusively by men, brandishing swords and shields. It showcases the courage and martial prowess of the Paika warriors who once defended the region.',
    hasVideo: false,
  },
  {
    id: 'santhali',
    name: 'Santhali Dance',
    tribe: 'Santhal',
    occasion: 'Sohrai, Baha festivals',
    region: 'Santhal Pargana',
    significance: 'A vibrant and synchronized group dance, often performed with a large number of participants. Women dance in long lines holding hands, while men play traditional instruments like the Tirio (flute) and Tumdak (drum).',
    hasVideo: false,
  },
];

const UPCOMING_DANCES = [
  'Firkal Dance',
  'Mundari Dance',
  'Barao Dance',
  'Domkach'
];

const CinematicPlayer = ({ dance }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    setShowTitle(true);
    setIsPlaying(true);
    setProgress(0);
    const timer = setTimeout(() => setShowTitle(false), 3000);
    return () => clearTimeout(timer);
  }, [dance]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      if (total > 0) {
        setProgress((current / total) * 100);
      }
    }
  };
  
  const handleProgressClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl shadow-black flex-shrink-0 border border-white/5 group cursor-pointer" onClick={togglePlay}>
      <motion.video 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        ref={videoRef}
        src={encodeURI(dance.videoSrc)}
        className="absolute inset-0 w-full h-full object-cover bg-black"
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Subtle Vignette effect (dark corners) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.8)_100%)] z-10" />

      {/* Elegant Title Overlay */}
      <AnimatePresence>
        {showTitle && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <h2 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-white tracking-wider drop-shadow-2xl font-light text-center px-4">
              {dance.name}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paused Poster Frame (with info) */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none z-20"
          >
             <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md mb-6 border border-white/20 shadow-xl">
               <Play size={36} className="text-white ml-2 opacity-90" fill="currentColor" />
             </div>
             
             <div className="text-center px-6 max-w-3xl">
               <h3 className="font-heading text-4xl sm:text-5xl text-white mb-3 drop-shadow-lg">{dance.name}</h3>
               <div className="flex items-center justify-center gap-4 text-base sm:text-lg text-neutral-200 drop-shadow-md font-medium tracking-wide">
                 <span>{dance.tribe} Tribe</span>
                 <span className="w-1.5 h-1.5 rounded-full bg-[#C9952A]"></span>
                 <span>{dance.region}</span>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 bg-white/20 cursor-pointer z-30 group-hover:h-3 transition-all duration-300"
        onClick={(e) => {
          e.stopPropagation();
          handleProgressClick(e);
        }}
      >
        <div 
          className="h-full bg-[#C9952A] transition-all duration-100 ease-linear relative shadow-[0_0_10px_rgba(201,149,42,0.8)]"
          style={{ width: `${progress}%` }}
        >
          {/* Progress handle knob */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg shadow-black" />
        </div>
      </div>
    </div>
  );
};

const VideoCard = ({ dance, onClick }) => {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (dance.hasVideo && videoRef.current) {
      videoRef.current.play().catch(e => console.log("Play failed", e));
    }
  };

  const handleMouseLeave = () => {
    if (dance.hasVideo && videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <motion.div 
      className="relative w-full aspect-video overflow-hidden rounded-xl bg-[#0a0a0a] border border-white/5 cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(dance)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {dance.hasVideo ? (
        <>
          <video 
            ref={videoRef}
            src={encodeURI(dance.videoSrc)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            muted
            loop
            playsInline
          />
          <div className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-lg">
            <Play size={16} className="text-white ml-0.5" fill="currentColor" />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/10 via-[#0D0D0D] to-[#0D0D0D] transition-transform duration-[1.5s] group-hover:scale-105"></div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500 z-0" />

      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full z-10">
        <div className="mt-auto transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          {!dance.hasVideo && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-[10px] sm:text-xs font-medium tracking-widest uppercase text-[#C9952A] border border-[#C9952A]/30 rounded-full bg-black/50 backdrop-blur-md">
                Video Coming Soon
              </span>
            </div>
          )}
          <h3 className="font-heading text-3xl sm:text-4xl text-white mb-2 group-hover:text-[#C9952A] transition-colors duration-500 drop-shadow-md">{dance.name}</h3>
          
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
            <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              <div className="pt-2 space-y-1 pb-1">
                <p className="font-body text-sm text-neutral-300"><span className="text-white/40 uppercase tracking-wider text-xs mr-2">Tribe</span> {dance.tribe}</p>
                <p className="font-body text-sm text-neutral-300"><span className="text-white/40 uppercase tracking-wider text-xs mr-2">Region</span> {dance.region}</p>
                <p className="font-body text-sm text-neutral-400 mt-3 line-clamp-2 leading-relaxed">{dance.significance}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Modal = ({ dance, onClose, allDances, onSelectRelated }) => {
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('dance', dance.id);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const relatedDances = allDances.filter(d => d.id !== dance.id).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-[#0D0D0D]/98 backdrop-blur-xl p-4 sm:p-6 lg:p-8 overflow-y-auto hide-scrollbar"
    >
      <button 
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[60] p-3 sm:p-4 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all border border-white/10 group hover:scale-105"
      >
        <X size={24} className="group-hover:text-[#C9952A] transition-colors" />
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="w-full max-w-6xl flex flex-col mt-12 sm:mt-4 pb-20 relative"
      >
        {dance.hasVideo ? (
           <CinematicPlayer dance={dance} />
        ) : (
          <div className="relative w-full rounded-2xl overflow-hidden bg-[#0a0a0a] aspect-video flex items-center justify-center shadow-2xl shadow-black flex-shrink-0 border border-white/5 group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-[#0D0D0D] to-[#0D0D0D]"></div>
            <div className="text-center relative z-10">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium tracking-wider text-[#C9952A] border border-[#C9952A]/30 rounded-full bg-black/50 backdrop-blur-md">
                Video Coming Soon
              </span>
              <h3 className="font-heading text-4xl sm:text-5xl text-neutral-600">{dance.name}</h3>
            </div>
          </div>
        )}
        
        {/* Actions & Title */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full px-2">
           <div>
             <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-white mb-3">{dance.name}</h2>
             <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[#C9952A] tracking-[0.15em] uppercase text-xs sm:text-sm font-medium">
               <span>{dance.tribe} Tribe</span>
               <span className="w-1 h-1 bg-white/20 rounded-full"></span>
               <span>{dance.region}</span>
               <span className="w-1 h-1 bg-white/20 rounded-full hidden sm:block"></span>
               <span className="hidden sm:block text-white/50">{dance.occasion}</span>
             </div>
           </div>
           
           <button 
             onClick={handleShare}
             className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-white font-body text-sm hover:scale-105 active:scale-95"
           >
             {copied ? <Check size={18} className="text-green-400" /> : <Share2 size={18} />}
             {copied ? 'Link Copied' : 'Share Dance'}
           </button>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10"></div>
        
        {/* Significance text */}
        <div className="px-2">
          <p className="font-body text-lg sm:text-xl md:text-2xl text-neutral-300 leading-relaxed font-light mb-16 max-w-4xl">
            {dance.significance}
          </p>
        </div>
        
        {/* Related Dances */}
        <div className="px-2">
          <h3 className="font-heading text-2xl sm:text-3xl text-white mb-8">Discover More Dances</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedDances.map(rd => (
              <div 
                key={rd.id} 
                onClick={() => onSelectRelated(rd)}
                className="cursor-pointer group relative aspect-video rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-lg"
              >
                {rd.hasVideo ? (
                  <video 
                    src={encodeURI(rd.videoSrc)} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                    muted 
                    playsInline
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/30 to-[#0D0D0D]">
                    <span className="text-[#C9952A] text-[10px] sm:text-xs uppercase tracking-wider font-medium px-2 text-center border border-[#C9952A]/30 rounded-full py-1 bg-black/40">Video Soon</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4">
                  <p className="font-heading text-white text-base sm:text-lg tracking-wide truncate group-hover:text-[#C9952A] transition-colors">{rd.name}</p>
                  <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider truncate mt-0.5">{rd.tribe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default function Dance() {
  const [selectedDance, setSelectedDance] = useState(null);

  useEffect(() => {
    if (selectedDance) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDance]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pt-24 pb-20 selection:bg-[#C9952A]/30 selection:text-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-6 sm:mb-8 tracking-tight"
        >
          The Dances of Jharkhand
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="font-body text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Rhythm as living history. Where every step tells a story of the earth, the ancestors, and the spirit of the tribe.
        </motion.p>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
          className="w-16 sm:w-24 h-[1px] bg-[#C9952A] mx-auto mt-10 sm:mt-12 origin-center"
        />
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {DANCES.map((dance) => (
            <VideoCard 
              key={dance.id} 
              dance={dance} 
              onClick={setSelectedDance} 
            />
          ))}
        </div>
      </section>

      {/* More Coming Soon Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 pt-20 sm:pt-24">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white mb-4 sm:mb-6">More Coming Soon</h2>
          <p className="font-body text-neutral-400 text-lg font-light max-w-xl mx-auto">
            Our cultural documentation is ongoing. More dances are being added to the archive.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {UPCOMING_DANCES.map((name, i) => (
            <motion.div 
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              className="aspect-square sm:aspect-[4/3] rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-center p-4 text-center group relative overflow-hidden shadow-lg"
            >
              <div className="absolute inset-0 bg-[#C9952A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <motion.div 
                animate={{ opacity: [0.3, 0.7, 0.3] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"
              />
              
              <h4 className="font-heading text-xl sm:text-2xl text-neutral-600 group-hover:text-[#C9952A] transition-colors duration-500 z-10">{name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedDance && (
          <Modal 
            dance={selectedDance} 
            allDances={DANCES}
            onClose={() => setSelectedDance(null)} 
            onSelectRelated={setSelectedDance}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
