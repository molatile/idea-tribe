import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ArrowLeft, Calendar, Info, Map as MapIcon, Clock, User, CheckCircle, ChevronRight, Check, Star } from 'lucide-react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { tourismData } from '../data/tourismData';

// Fix for default marker icon in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Ochre Marker Icon
const ochreMarkerHtml = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#C9952A" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin w-8 h-8">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
`;

const ochreIcon = new L.DivIcon({
  html: ochreMarkerHtml,
  className: 'custom-leaflet-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Helper component to center map on coordinates change
const MapUpdater = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    if (coordinates) {
      map.setView(coordinates, 13);
    }
  }, [coordinates, map]);
  return null;
};

const Filters = ['All', 'Waterfall', 'Wildlife', 'Temple', 'Valley', 'Lake', 'Heritage'];

const workshops = [
  { 
    id: 1, 
    name: 'Dokra Metal Casting', 
    artisan: { name: 'Birsa Munda', tribe: 'Munda', experience: '15 Years', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Birsa' }, 
    duration: '2 hours', 
    price: '₹950', 
    difficulty: 'Intermediate',
    languages: 'Hindi, Sadri',
    seats: { filled: 8, total: 12 },
    learn: ['Wax modeling techniques', 'Clay mould preparation', 'Metal pouring process'],
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800',
    about: 'Dhokra is a 4,000-year-old lost-wax metal casting technique, one of India\'s oldest craft traditions.'
  },
  { 
    id: 2, 
    name: 'Paitkar Scroll Painting', 
    artisan: { name: 'Sumi Santal', tribe: 'Santali', experience: '20 Years', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Sumi' }, 
    duration: '3 hours', 
    price: '₹800', 
    difficulty: 'Beginner',
    languages: 'Santali, Hindi',
    seats: { filled: 11, total: 15 },
    learn: ['Making natural colors', 'Traditional storytelling', 'Brush strokes technique'],
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800',
    about: 'Paitkar is a scroll-based storytelling art where the artist paints myths and daily life panel by panel.'
  },
  { 
    id: 3, 
    name: 'Bamboo Craft Making', 
    artisan: { name: 'Mangal Ho', tribe: 'Ho', experience: '10 Years', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Mangal' }, 
    duration: '2 hours', 
    price: '₹900', 
    difficulty: 'Beginner',
    languages: 'Ho, Hindi',
    seats: { filled: 5, total: 10 },
    learn: ['Bamboo splitting', 'Basic weaving patterns', 'Finishing and polishing'],
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=800',
    about: 'A GI-tagged craft of Jharkhand\'s Mohli tribes using a unique foot-based slicing technique to split bamboo.'
  },
  { 
    id: 4, 
    name: 'Tribal Cooking', 
    artisan: { name: 'Sunita Oraon', tribe: 'Oraon', experience: '25 Years', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Sunita' }, 
    duration: '2.5 hours', 
    price: '₹800', 
    difficulty: 'Beginner',
    languages: 'Kurukh, Hindi',
    seats: { filled: 12, total: 12 },
    learn: ['Identifying local herbs', 'Traditional fire cooking', 'Plating in Sal leaves'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    about: 'Tribal food relies on rice, pulses, foraged greens, wild fungi and river fish — cooked slow on clay hearths.'
  },
  { 
    id: 5, 
    name: 'Sohrai Art Painting', 
    artisan: { name: 'Rani Oraon', tribe: 'Oraon', experience: '12 Years', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Rani' }, 
    duration: '2 hours', 
    price: '₹800', 
    difficulty: 'Beginner',
    languages: 'Hindi, English',
    seats: { filled: 3, total: 15 },
    learn: ['Mud wall preparation', 'Clay color mixing', 'Traditional motifs'],
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800',
    about: 'An ancient mural art painted by tribal women on mud walls during harvest festivals using natural earth pigments.'
  },
  { 
    id: 6, 
    name: 'Tribal Dance Learning', 
    artisan: { name: 'Karma Group', tribe: 'Multiple', experience: '30 Years', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Karma' }, 
    duration: '1.5 hours', 
    price: '₹800', 
    difficulty: 'Beginner',
    languages: 'Hindi, Sadri',
    seats: { filled: 18, total: 20 },
    learn: ['Basic footwork', 'Matching mandar beats', 'Group coordination'],
    image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=800',
    about: 'Jharkhand\'s tribal dances — Jhumair, Chhau, Karma, Paika — are tied to festivals and community life.'
  },
  { 
    id: 7, 
    name: 'Tribal Silver Jewelry Making', 
    artisan: { name: 'Budhu Lohra', tribe: 'Lohra', experience: '22 Years', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Budhu' }, 
    duration: '4 hours', 
    price: '₹3500', 
    difficulty: 'Advanced',
    languages: 'Hindi, Sadri',
    seats: { filled: 4, total: 8 },
    learn: ['Silver wire drawing', 'Bead weaving techniques', 'Traditional motif design'],
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    about: 'Craft authentic tribal jewelry using silver, brass, and colorful beads, learning techniques passed down through generations of the Lohra community.'
  },
  { 
    id: 8, 
    name: 'Kuchai Silk Weaving Masterclass', 
    artisan: { name: 'Sita Devi', tribe: 'Santhal', experience: '35 Years', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Sita' }, 
    duration: '6 hours', 
    price: '₹4500', 
    difficulty: 'Intermediate',
    languages: 'Santhali, Hindi',
    seats: { filled: 2, total: 5 },
    learn: ['Tussar silk cocoon processing', 'Yarn spinning', 'Handloom weaving basics'],
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=800',
    about: 'An immersive full-day experience in Kuchai silk weaving. Learn the organic process of creating famous Jharkhand Tussar silk from cocoon to cloth.'
  },
  { 
    id: 9, 
    name: 'Chhau Mask Crafting', 
    artisan: { name: 'Gurunath', tribe: 'Bhumij', experience: '28 Years', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Gurunath' }, 
    duration: '5 hours', 
    price: '₹2800', 
    difficulty: 'Intermediate',
    languages: 'Bengali, Hindi',
    seats: { filled: 6, total: 10 },
    learn: ['Paper mache layering', 'Clay modeling', 'Mythological painting'],
    image: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?auto=format&fit=crop&q=80&w=800',
    about: 'Design and paint a traditional Seraikela Chhau mask, understanding the deep mythological significance of the colors and expressions.'
  },
  { 
    id: 10, 
    name: 'Jadopatia Scroll Painting', 
    artisan: { name: 'Ram Jadu Patua', tribe: 'Jadu Patua', experience: '18 Years', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Ram' }, 
    duration: '3.5 hours', 
    price: '₹1500', 
    difficulty: 'Beginner',
    languages: 'Santhali, Hindi',
    seats: { filled: 8, total: 12 },
    learn: ['Creating continuous scrolls', 'Natural pigment extraction', 'Folk storytelling'],
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=800',
    about: 'Join the magic painters (Jadu Patua) of Santhal Pargana to create narrative scroll paintings that illustrate local myths and folklore.'
  }
];

const CountUp = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime;
      const animateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animateCount);
        }
      };
      requestAnimationFrame(animateCount);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const HostWorkshopForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nextStep = (e) => {
    e.preventDefault();
    setStep(s => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setStep(1);
      }, 5000);
    }, 1500);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <h3 className="text-xl font-heading text-vanaj-ochre mb-4">Tell us about your organization</h3>
            <div>
              <label className="block text-sm font-medium text-vanaj-cream/80 mb-2">Organization Name</label>
              <input required type="text" className="w-full bg-vanaj-dark/50 border border-vanaj-ochre/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vanaj-ochre focus:ring-1 focus:ring-vanaj-ochre transition-all" placeholder="e.g. Jharkhand Tribal Arts Council" />
            </div>
            <div>
              <label className="block text-sm font-medium text-vanaj-cream/80 mb-2">Organization Type</label>
              <select required className="w-full bg-vanaj-dark/80 border border-vanaj-ochre/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vanaj-ochre focus:ring-1 focus:ring-vanaj-ochre transition-all">
                <option value="">Select type...</option>
                <option value="Government">Government Body</option>
                <option value="NGO">Non-Profit / NGO</option>
                <option value="Private">Private Enterprise</option>
                <option value="Cultural">Cultural Association</option>
                <option value="College">College Workshop</option>
              </select>
            </div>
            <button type="button" onClick={nextStep} className="w-full mt-6 bg-vanaj-ochre/20 hover:bg-vanaj-ochre/30 text-vanaj-ochre font-bold py-3 rounded-xl transition-all flex items-center justify-center group">
              Continue <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <h3 className="text-xl font-heading text-vanaj-ochre mb-4">Contact Details</h3>
            <div>
              <label className="block text-sm font-medium text-vanaj-cream/80 mb-2">Point of Contact</label>
              <input required type="text" className="w-full bg-vanaj-dark/50 border border-vanaj-ochre/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vanaj-ochre focus:ring-1 focus:ring-vanaj-ochre transition-all" placeholder="Full Name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-vanaj-cream/80 mb-2">Phone</label>
                <input required type="tel" className="w-full bg-vanaj-dark/50 border border-vanaj-ochre/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vanaj-ochre focus:ring-1 focus:ring-vanaj-ochre transition-all" placeholder="+91..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-vanaj-cream/80 mb-2">Email</label>
                <input required type="email" className="w-full bg-vanaj-dark/50 border border-vanaj-ochre/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vanaj-ochre focus:ring-1 focus:ring-vanaj-ochre transition-all" placeholder="@" />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button type="button" onClick={prevStep} className="w-1/3 py-3 border border-vanaj-cream/20 text-vanaj-cream rounded-xl hover:bg-vanaj-cream/10 transition-colors">Back</button>
              <button type="button" onClick={nextStep} className="w-2/3 bg-vanaj-ochre/20 hover:bg-vanaj-ochre/30 text-vanaj-ochre font-bold py-3 rounded-xl transition-all flex items-center justify-center group">
                Continue <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <h3 className="text-xl font-heading text-vanaj-ochre mb-4">Workshop Proposal</h3>
            <div>
              <label className="block text-sm font-medium text-vanaj-cream/80 mb-2">Workshop Title</label>
              <input required type="text" className="w-full bg-vanaj-dark/50 border border-vanaj-ochre/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vanaj-ochre focus:ring-1 focus:ring-vanaj-ochre transition-all" placeholder="What is the workshop about?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-vanaj-cream/80 mb-2">Brief Description</label>
              <textarea required rows="3" className="w-full bg-vanaj-dark/50 border border-vanaj-ochre/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vanaj-ochre focus:ring-1 focus:ring-vanaj-ochre transition-all" placeholder="Describe the activities and learning outcomes..."></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-vanaj-cream/80 mb-2">Expected Attendees</label>
                <input required type="number" min="1" className="w-full bg-vanaj-dark/50 border border-vanaj-ochre/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vanaj-ochre focus:ring-1 focus:ring-vanaj-ochre transition-all" placeholder="e.g. 20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-vanaj-cream/80 mb-2">Proposed Date</label>
                <input required type="date" className="w-full bg-vanaj-dark/50 border border-vanaj-ochre/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vanaj-ochre focus:ring-1 focus:ring-vanaj-ochre transition-all" style={{ colorScheme: 'dark' }} />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button type="button" onClick={prevStep} className="w-1/3 py-3 border border-vanaj-cream/20 text-vanaj-cream rounded-xl hover:bg-vanaj-cream/10 transition-colors">Back</button>
              <button type="submit" disabled={isSubmitting} className="w-2/3 bg-vanaj-ochre hover:bg-[#d6a540] text-vanaj-dark font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(201,149,42,0.4)] hover:shadow-[0_0_25px_rgba(201,149,42,0.6)] flex items-center justify-center disabled:opacity-70">
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-vanaj-dark border-t-transparent rounded-full" />
                ) : (
                  <>Submit Proposal <Check className="w-5 h-5 ml-2" /></>
                )}
              </button>
            </div>
          </motion.div>
        );
    }
  };

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 px-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-vanaj-green/20 text-vanaj-green mb-6 relative">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
            <CheckCircle className="w-10 h-10" />
          </motion.div>
          <motion.div className="absolute inset-0 rounded-full border-4 border-vanaj-green/30" animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
        </div>
        <h3 className="text-3xl font-heading text-vanaj-cream mb-4">Proposal Received!</h3>
        <p className="text-vanaj-cream/80 text-lg">Thank you for joining our mission. Our team will review your workshop proposal and contact you within 48 hours.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Decorative top blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-vanaj-ochre/20 rounded-full blur-3xl"></div>
      
      {/* Step Indicators */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= num ? 'bg-vanaj-ochre text-vanaj-dark shadow-[0_0_10px_rgba(201,149,42,0.5)]' : 'bg-vanaj-dark/50 text-vanaj-cream/50 border border-vanaj-cream/10'}`}>
              {step > num ? <Check className="w-5 h-5" /> : num}
            </div>
            {num < 3 && (
              <div className={`w-12 sm:w-20 h-1 mx-2 rounded-full transition-all duration-500 ${step > num ? 'bg-vanaj-ochre' : 'bg-vanaj-dark/50'}`}></div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative z-10">
        {renderStep()}
      </form>
    </div>
  );
};

const Tourism = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState(null);


  // Filter logic
  const filteredData = tourismData.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          loc.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || loc.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  if (selectedLocation) {
    return (
      <div className="min-h-screen bg-vanaj-cream pt-20">
        {/* Detail View */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={() => setSelectedLocation(null)}
            className="flex items-center text-vanaj-dark hover:text-vanaj-green transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Destinations
          </button>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-vanaj-dark/10">
            {/* Top Image */}
            <div className="w-full h-64 md:h-96 bg-gray-200 relative overflow-hidden">
              <img 
                src={selectedLocation.image} 
                alt={selectedLocation.name} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl md:text-5xl font-heading text-vanaj-dark mb-3">
                    {selectedLocation.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-vanaj-dark/70 font-medium">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-vanaj-ochre" />
                      {selectedLocation.district}
                    </span>
                    <span className="px-3 py-1 bg-vanaj-dark-cream text-vanaj-dark rounded-full text-sm">
                      {selectedLocation.type}
                    </span>
                  </div>
                </div>
                <button className="px-8 py-3 bg-vanaj-green text-white font-medium rounded-lg hover:bg-vanaj-dark transition-colors disabled:opacity-50 group relative cursor-not-allowed w-full md:w-auto text-center" disabled>
                  <span className="group-hover:opacity-0 transition-opacity">Book Visit</span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">Coming Soon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <h2 className="text-2xl font-heading text-vanaj-dark mb-4 flex items-center">
                      <Info className="w-5 h-5 mr-2 text-vanaj-ochre" /> About
                    </h2>
                    <p className="text-vanaj-dark/80 text-lg leading-relaxed">
                      {selectedLocation.description}
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-heading text-vanaj-dark mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-vanaj-ochre" /> Best Time to Visit
                    </h2>
                    <p className="text-vanaj-dark/80 text-lg">
                      {selectedLocation.bestTime}
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-heading text-vanaj-dark mb-4 flex items-center">
                      <MapIcon className="w-5 h-5 mr-2 text-vanaj-ochre" /> How to Reach
                    </h2>
                    <p className="text-vanaj-dark/80 text-lg">
                      {selectedLocation.howToReach}
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-heading text-vanaj-dark mb-4">
                      Nearby Attractions
                    </h2>
                    <p className="text-vanaj-dark/80 text-lg">
                      {selectedLocation.nearbyAttractions}
                    </p>
                  </section>
                </div>

                <div className="lg:col-span-1">
                  <div className="rounded-xl overflow-hidden border border-vanaj-dark/10 h-80 sticky top-24 shadow-sm z-0">
                    <MapContainer 
                      center={selectedLocation.coordinates} 
                      zoom={13} 
                      scrollWheelZoom={false}
                      className="w-full h-full z-0"
                      style={{ zIndex: 0 }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={selectedLocation.coordinates} icon={ochreIcon} />
                      <MapUpdater coordinates={selectedLocation.coordinates} />
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanaj-cream pt-16">
      {/* Hero Section */}
      <section className="w-full bg-[#1B4332] text-vanaj-cream py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle pattern background for hero if wanted */}
        <div className="absolute inset-0 opacity-10 bg-tribal-pattern"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white mb-6">
            Explore <span className="text-vanaj-ochre">Jharkhand</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-vanaj-cream/90 font-medium">
            Discover the untold stories of nature, wildlife, and ancient heritage in the land of forests.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Search + Filter Bar */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search by location name or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 rounded-xl bg-white border-2 border-vanaj-dark/10 focus:border-vanaj-green focus:outline-none focus:ring-0 transition-colors text-vanaj-dark placeholder:text-vanaj-dark/40 shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vanaj-dark/40 w-5 h-5" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {Filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 border-2 ${
                  activeFilter === filter
                    ? 'bg-vanaj-dark text-white border-vanaj-dark shadow-md'
                    : 'bg-white text-vanaj-dark border-vanaj-dark/10 hover:border-vanaj-dark/30 hover:bg-vanaj-dark-cream'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Location Cards Grid */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((location) => (
              <div 
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-vanaj-dark/5 cursor-pointer group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col"
              >
                {/* Image */}
                <div className="h-48 bg-gray-200 w-full relative overflow-hidden">
                  <img 
                    src={location.image} 
                    alt={location.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-heading text-vanaj-dark group-hover:text-vanaj-green transition-colors">
                      {location.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-vanaj-cream text-vanaj-dark text-xs font-medium rounded-full whitespace-nowrap ml-3 border border-vanaj-dark/5">
                      {location.type}
                    </span>
                  </div>
                  <div className="flex items-center text-vanaj-dark/60 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1 text-vanaj-ochre" />
                    {location.district}
                  </div>
                  <p className="text-vanaj-dark/80 text-sm line-clamp-2 mt-auto">
                    {location.shortDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-heading text-vanaj-dark mb-2">No locations found</h3>
            <p className="text-vanaj-dark/60">Try adjusting your search or filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
              className="mt-6 px-6 py-2 bg-vanaj-green text-white rounded-lg hover:bg-vanaj-dark transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Immersive Workshop Intro */}
      <section className="w-full relative py-24 bg-vanaj-dark overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=2000" alt="Tribal Art Background" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-vanaj-dark/50 via-vanaj-dark/80 to-vanaj-dark"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-heading text-vanaj-cream mb-6"
          >
            Learn. Create. Experience <span className="text-vanaj-ochre">Jharkhand</span>.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-vanaj-cream/80 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Step into the world of master tribal artisans. By joining these workshops, you're not just learning a craft—you're preserving centuries-old traditions and directly supporting indigenous livelihoods.
          </motion.p>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-4xl font-heading text-vanaj-ochre mb-2">
                <CountUp end={10} />
              </div>
              <div className="text-vanaj-cream/60 uppercase tracking-widest text-sm font-medium">Workshops</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-heading text-vanaj-ochre mb-2">
                <CountUp end={20} suffix="+" />
              </div>
              <div className="text-vanaj-cream/60 uppercase tracking-widest text-sm font-medium">Artisans</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-heading text-vanaj-ochre mb-2">
                <CountUp end={500} suffix="+" />
              </div>
              <div className="text-vanaj-cream/60 uppercase tracking-widest text-sm font-medium">Tourists Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 snap-x snap-mandatory md:snap-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {workshops.map((workshop) => (
            <div key={workshop.id} className="min-w-[300px] w-[85vw] md:w-auto snap-center group relative h-[500px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img src={workshop.image} alt={workshop.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-vanaj-dark via-vanaj-dark/60 to-transparent"></div>
              </div>

              {/* Pulsing Badge */}
              <div className="absolute top-4 right-4 bg-vanaj-ochre/90 backdrop-blur-sm text-vanaj-dark text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg animate-pulse">
                Limited Seats
              </div>

              {/* Default Content (Visible normally) */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                <h3 className="text-3xl font-heading text-vanaj-cream mb-2 leading-tight">{workshop.name}</h3>
                <div className="flex items-center gap-3 mb-4">
                  <img src={workshop.artisan.avatar} alt={workshop.artisan.name} className="w-10 h-10 rounded-full border-2 border-vanaj-ochre" />
                  <div>
                    <div className="text-vanaj-cream font-medium">{workshop.artisan.name}</div>
                    <div className="text-vanaj-ochre text-xs">{workshop.artisan.tribe} Tribe</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-vanaj-cream/80 text-sm">
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {workshop.duration}</span>
                  <span className="font-bold text-vanaj-ochre text-lg">{workshop.price}</span>
                </div>
              </div>

              {/* Expanded Content (Visible on hover) */}
              <div className="absolute inset-0 bg-vanaj-dark/95 backdrop-blur-md p-6 flex flex-col justify-between opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <div>
                  <h3 className="text-2xl font-heading text-vanaj-cream mb-2">{workshop.name}</h3>
                  
                  <p className="text-vanaj-cream/80 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {workshop.about}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-vanaj-cream/80 mb-2">
                      <span>{workshop.seats.filled} of {workshop.seats.total} seats filled</span>
                      <span className="text-vanaj-ochre font-medium">{Math.round((workshop.seats.filled/workshop.seats.total)*100)}%</span>
                    </div>
                    <div className="w-full bg-vanaj-cream/20 rounded-full h-1.5">
                      <div className="bg-vanaj-ochre h-1.5 rounded-full transition-all duration-1000" style={{ width: `${(workshop.seats.filled/workshop.seats.total)*100}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-vanaj-ochre text-xs font-bold uppercase tracking-wider mb-2">What you'll learn</div>
                      <ul className="space-y-2">
                        {workshop.learn.map((point, idx) => (
                          <li key={idx} className="flex items-start text-vanaj-cream/80 text-sm">
                            <Check className="w-4 h-4 mr-2 text-vanaj-green shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-vanaj-cream/10">
                      <div>
                        <div className="text-vanaj-cream/50 text-xs mb-1">Difficulty</div>
                        <div className="text-vanaj-cream text-sm font-medium">{workshop.difficulty}</div>
                      </div>
                      <div>
                        <div className="text-vanaj-cream/50 text-xs mb-1">Languages</div>
                        <div className="text-vanaj-cream text-sm font-medium">{workshop.languages}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 mt-6 bg-vanaj-ochre text-vanaj-dark rounded-xl font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,149,42,0.6)] hover:bg-[#d6a540] flex items-center justify-center relative overflow-hidden group/btn">
                  <span className="relative z-10 flex items-center">
                    Book a Seat <ChevronRight className="w-5 h-5 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Host a Workshop (For Organizations) */}
      <section className="bg-vanaj-dark py-24 relative overflow-hidden text-vanaj-cream">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=2000" alt="Tribal Art Texture" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-vanaj-dark via-vanaj-dark/90 to-vanaj-dark/60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Left side: Visuals & Copy */}
            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                <div className="inline-flex items-center space-x-2 bg-vanaj-ochre/20 text-vanaj-ochre px-4 py-2 rounded-full mb-6">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-wider">For Organizations</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-vanaj-cream leading-tight mb-6">
                  Host a Workshop <br/><span className="text-vanaj-ochre">With Us</span>
                </h2>
                <p className="text-lg text-vanaj-cream/80 leading-relaxed mb-8">
                  Partner with us to create authentic tribal experiences. We connect you directly with master artisans to host workshops for your events, government programs, or cultural delegations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pb-8 border-b border-vanaj-cream/10">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-vanaj-green/20 flex items-center justify-center text-vanaj-green mb-4">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-vanaj-cream">Direct Impact</h4>
                  <p className="text-sm text-vanaj-cream/60">100% of proceeds go directly to the tribal artisans.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-vanaj-ochre/20 flex items-center justify-center text-vanaj-ochre mb-4">
                    <User className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-vanaj-cream">Master Artisans</h4>
                  <p className="text-sm text-vanaj-cream/60">Learn from award-winning indigenous craftsmen.</p>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative">
                <div className="absolute -top-4 -left-2 text-6xl text-vanaj-ochre/30 font-serif">"</div>
                <p className="text-vanaj-cream/90 italic mb-4 relative z-10">
                  "The Dokra casting workshop organized for our delegation was an eye-opener. It beautifully bridged the gap between heritage and modern appreciation."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-vanaj-green flex items-center justify-center text-white font-bold">JT</div>
                  <div>
                    <div className="font-bold text-sm text-vanaj-cream">Jharkhand Tourism Board</div>
                    <div className="text-xs text-vanaj-ochre">Cultural Exchange Program 2025</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Form */}
            <div className="w-full lg:w-1/2">
              <HostWorkshopForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Tourism;
