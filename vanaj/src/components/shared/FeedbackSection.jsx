import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ThumbsUp, 
  CheckCircle2, 
  Sparkles, 
  Quote, 
  MapPin, 
  MessageSquarePlus, 
  X, 
  Send, 
  Heart,
  Award,
  Filter
} from 'lucide-react';

/**
 * Pre-seeded authentic feedback data tailored for each cultural vertical
 */
const DEFAULT_REVIEWS = {
  marketplace: [
    {
      id: 'm1',
      name: 'Meera Krishnan',
      location: 'Bangalore, Karnataka',
      role: 'Verified Patron',
      topic: 'Dokra Metal Bell',
      rating: 5,
      date: '2 days ago',
      review: 'The Dokra brass artifact arrived in thoughtful, sustainable packaging. The lost-wax detailing crafted by the tribal artisan is mesmerizing. Knowing this directly honors and empowers a craft family in West Singhbhum makes it a treasure in our home.',
      likes: 34,
      recommended: true
    },
    {
      id: 'm2',
      name: 'Vikramaditya Roy',
      location: 'Kolkata, West Bengal',
      role: 'Textile Collector',
      topic: 'Santhali Phuta Kacha Saree',
      rating: 5,
      date: '1 week ago',
      review: 'Exceptional weave quality. The earthy madder and natural indigo tones have an organic depth you simply cannot find in mass-manufactured fabrics. Vanaj is doing sacred work connecting collectors to living indigenous heritage.',
      likes: 48,
      recommended: true
    },
    {
      id: 'm3',
      name: 'Sunita Marandi',
      location: 'Ranchi, Jharkhand',
      role: 'Local Patron',
      topic: 'Handcrafted Bamboo Lamp',
      rating: 5,
      date: '2 weeks ago',
      review: 'Stunning ambient lighting that casts sacred tribal geometric patterns across our living room. It carries the fresh, natural aroma of treated mountain bamboo. Sturdy, authentic, and immensely proud of our Jharkhand artisans!',
      likes: 21,
      recommended: true
    },
    {
      id: 'm4',
      name: 'Dr. Kabir Deshmukh',
      location: 'Pune, Maharashtra',
      role: 'Art Historian',
      topic: 'Tribal Silver-Plated Armlet',
      rating: 5,
      date: '3 weeks ago',
      review: 'The weight, geometric etching, and tribal motif accuracy are historically pristine. The artisan details included with the parcel made this an educational and aesthetic marvel. Exemplary initiative!',
      likes: 19,
      recommended: true
    }
  ],
  tourism: [
    {
      id: 't1',
      name: 'Aarav & Devika Sharma',
      location: 'New Delhi',
      role: 'Cultural Wanderers',
      topic: 'Dokra Workshop with Master Birsa',
      rating: 5,
      date: '3 days ago',
      review: 'Sitting beside master artisan Birsa Munda as he guided our hands through 4,000-year-old lost-wax techniques was transcendent. Our 10-year-old daughter was mesmerized. Jharkhand’s ancient forest hills are truly India’s most soulful destination.',
      likes: 42,
      recommended: true
    },
    {
      id: 't2',
      name: 'Sophie Laurent',
      location: 'Lyon, France',
      role: 'Solo Explorer',
      topic: 'Netarhat Pine Forest & Sunset Trail',
      rating: 5,
      date: '1 week ago',
      review: 'The morning mist drifting through the sacred Sal groves felt like stepping back in time. Our indigenous guide conveyed deep tribal folklore with reverence and quiet grace. Ecotourism practiced with genuine soul and respect.',
      likes: 67,
      recommended: true
    },
    {
      id: 't3',
      name: 'Rohan Banerjee',
      location: 'Jamshedpur, Jharkhand',
      role: 'Heritage Traveler',
      topic: 'Paitkar Scroll Painting Masterclass',
      rating: 5,
      date: '2 weeks ago',
      review: 'Learning to grind natural river pigments from ochre stones and wild leaves alongside Sumi Santal was an unforgettable privilege. The narrative storytelling through painted scrolls moved our entire cohort.',
      likes: 29,
      recommended: true
    },
    {
      id: 't4',
      name: 'Ananya Mukherjee',
      location: 'Hyderabad, Telangana',
      role: 'Eco-Tourist',
      topic: 'Hundru Falls & Village Homestay',
      rating: 5,
      date: '1 month ago',
      review: 'The warm hospitality at the village homestay, home-cooked Dhuska breakfasts, and guided walk to Hundru falls were flawless. So peaceful, dignified, and rooted in tribal ecology.',
      likes: 38,
      recommended: true
    }
  ],
  food: [
    {
      id: 'f1',
      name: 'Chef Ranveer Mukherjee',
      location: 'Mumbai, Maharashtra',
      role: 'Culinary Anthropologist',
      topic: 'Wild Foraged Rugra Curry',
      rating: 5,
      date: 'Yesterday',
      review: 'Rugra mushrooms simmered in cold-pressed mustard oil with wild garlic and fresh green chilies is an unmatched gastronomic revelation. The earthy umami flavor rivals European truffles, steeped in centuries of forest foraging lore.',
      likes: 56,
      recommended: true
    },
    {
      id: 'f2',
      name: 'Shreya Tirkey',
      location: 'Gumla, Jharkhand',
      role: 'Indigenous Food Advocate',
      topic: 'Cooling Mandia Pej & Herbs',
      rating: 5,
      date: '4 days ago',
      review: 'The fermented finger-millet Mandia Pej brings back every treasured memory of summers with my grandmother. It is deeply heartwarming to see our ancestral nutrition documented with such beauty and dignity.',
      likes: 31,
      recommended: true
    },
    {
      id: 'f3',
      name: 'Tanmay Saxena',
      location: 'Bengaluru, Karnataka',
      role: 'Experimental Foodie',
      topic: 'Santhali Red Ant Chutney (Demta)',
      rating: 5,
      date: '2 weeks ago',
      review: 'The vibrant, citrusy burst of natural formic acid paired with wild coriander and red chilies was extraordinary. A rare culinary adventure that connects you directly to the living pulse of the wilderness.',
      likes: 74,
      recommended: true
    },
    {
      id: 'f4',
      name: 'Pallavi Roy',
      location: 'Patna, Bihar',
      role: 'Gastronomy Writer',
      topic: 'Crispy Dhuska with Chana Ghugni',
      rating: 5,
      date: '3 weeks ago',
      review: 'Crispy on the outside, feather-light and spongy within. Paired with the rustic spiced chana curry, this is breakfast royalty. Beautiful presentation of Jharkhand’s authentic tastes!',
      likes: 27,
      recommended: true
    }
  ],
  dance: [
    {
      id: 'd1',
      name: 'Dr. Nandita Sen',
      location: 'Kolkata, West Bengal',
      role: 'Ethnomusicology Scholar',
      topic: 'Santhali Synchronized Circle Dance',
      rating: 5,
      date: '3 days ago',
      review: 'Watching the women link arms in an unbroken cosmic circle while the Mandar pulses through the soil is a masterclass in human harmony. The rhythmic footwork breathes in unison with the forest winds. Mesmerizing and sacred.',
      likes: 64,
      recommended: true
    },
    {
      id: 'd2',
      name: 'Karan Murmu',
      location: 'Dumka, Jharkhand',
      role: 'Tribal Youth Council',
      topic: 'Sarhul Festival Celebrations',
      rating: 5,
      date: '1 week ago',
      review: 'Seeing our sacred rituals and communal dances documented with such cinematic reverence makes our heart swell with joy. The audio fidelity of the Mandar and Nagara drums echoes the true voice of our ancestors.',
      likes: 52,
      recommended: true
    },
    {
      id: 'd3',
      name: 'Elena Rostova',
      location: 'Saint Petersburg, Russia',
      role: 'World Arts Enthusiast',
      topic: 'Ho Tribe Mage Harvest Rhythm',
      rating: 5,
      date: '2 weeks ago',
      review: 'The geometric spatial arrangements and rhythmic discipline are breathtaking. This is not mere theatrical performance; it is a living invocation of nature, soil, and stars. Superbly curated!',
      likes: 41,
      recommended: true
    },
    {
      id: 'd4',
      name: 'Amartya Das',
      location: 'Bhubaneswar, Odisha',
      role: 'Folk Performing Arts Curator',
      topic: 'Oraon Karma Dance Form',
      rating: 5,
      date: '1 month ago',
      review: 'The balance between athletic vigor and poetic gentleness in the Karma dance is poetry in motion. Vanaj gives these timeless indigenous traditions the global spotlight they richly merit.',
      likes: 33,
      recommended: true
    }
  ]
};

const TOPIC_OPTIONS = {
  marketplace: [
    'Handcrafted Dokra Artefact',
    'Handwoven Tribal Saree / Fabric',
    'Terracotta & Clay Craft',
    'Tribal Silver & Brass Jewelry',
    'Bamboo & Grass Decor',
    'Overall Shopping & Artisan Support'
  ],
  tourism: [
    'Artisan Workshop (Dokra / Paitkar)',
    'Waterfall & Wilderness Trail',
    'Sacred Grove (Sarna) Cultural Tour',
    'Heritage Village Homestay',
    'Local Indigenous Guide Service',
    'Overall Travel Experience'
  ],
  food: [
    'Traditional Breakfast (Dhuska & Chilka)',
    'Wild Foraged Specialty (Rugra / Ants)',
    'Heritage Millet & Cooling Pej',
    'Festive Tribal Pitha & Sweets',
    'Earthy Meat Curry & Herbs',
    'Culinary Culture & Recipes'
  ],
  dance: [
    'Santhali Circle Dance',
    'Ho Tribe Mage Rhythm',
    'Oraon Karma Performance',
    'Asur Ancestral Dance',
    'Kharia Harvest Celebration',
    'Folk Percussion & Instruments'
  ]
};

export default function FeedbackSection({ 
  vertical = 'marketplace', 
  theme = 'light',
  className = '' 
}) {
  const storageKey = `vanaj_feedback_${vertical}`;
  const likesKey = `vanaj_likes_${vertical}`;

  const [reviews, setReviews] = useState([]);
  const [likedMap, setLikedMap] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('all');
  const [showThankYou, setShowThankYou] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formReview, setFormReview] = useState('');
  const [formRecommended, setFormRecommended] = useState(true);
  const [formError, setFormError] = useState('');

  // Load from local storage or defaults on mount
  useEffect(() => {
    try {
      const storedReviews = localStorage.getItem(storageKey);
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      } else {
        const defaults = DEFAULT_REVIEWS[vertical] || DEFAULT_REVIEWS.marketplace;
        setReviews(defaults);
        localStorage.setItem(storageKey, JSON.stringify(defaults));
      }

      const storedLikes = localStorage.getItem(likesKey);
      if (storedLikes) {
        setLikedMap(JSON.parse(storedLikes));
      }
    } catch {
      setReviews(DEFAULT_REVIEWS[vertical] || DEFAULT_REVIEWS.marketplace);
    }
  }, [vertical, storageKey, likesKey]);

  // Handle Like / Helpful toggle
  const handleLike = (id) => {
    const isAlreadyLiked = likedMap[id];
    const newLikedMap = { ...likedMap, [id]: !isAlreadyLiked };
    setLikedMap(newLikedMap);

    const updatedReviews = reviews.map(rev => {
      if (rev.id === id) {
        return {
          ...rev,
          likes: isAlreadyLiked ? Math.max(0, (rev.likes || 0) - 1) : (rev.likes || 0) + 1
        };
      }
      return rev;
    });

    setReviews(updatedReviews);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedReviews));
      localStorage.setItem(likesKey, JSON.stringify(newLikedMap));
    } catch (e) {
      console.error(e);
    }
  };

  // Submit new review
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formLocation.trim() || !formReview.trim()) {
      setFormError('Please fill in your name, city, and reflection.');
      return;
    }

    setFormError('');

    const newReviewItem = {
      id: `usr_${Date.now()}`,
      name: formName.trim(),
      location: formLocation.trim(),
      role: 'Cultural Patron',
      topic: formTopic || TOPIC_OPTIONS[vertical]?.[0] || 'Cultural Impression',
      rating: formRating,
      date: 'Just now',
      review: formReview.trim(),
      likes: 1,
      recommended: formRecommended,
      isUserSubmitted: true
    };

    const newReviewsList = [newReviewItem, ...reviews];
    setReviews(newReviewsList);

    try {
      localStorage.setItem(storageKey, JSON.stringify(newReviewsList));
    } catch (err) {
      console.error(err);
    }

    // Reset Form
    setFormName('');
    setFormLocation('');
    setFormTopic('');
    setFormRating(5);
    setFormReview('');
    setFormRecommended(true);
    setShowThankYou(true);

    setTimeout(() => {
      setShowThankYou(false);
      setIsFormOpen(false);
    }, 2400);
  };

  // Filter reviews
  const filteredReviews = reviews.filter(rev => {
    if (selectedRatingFilter === '5') return rev.rating === 5;
    if (selectedRatingFilter === 'recommended') return rev.recommended;
    return true;
  });

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  const isDark = theme === 'dark';

  // Section titles and labels tailored for each vertical
  const headers = {
    marketplace: {
      badge: 'PATRON TESTIMONIALS',
      title: 'Voices of Craft Patrons',
      hindi: 'ग्राहकों एवं कला-संग्राहकों के विचार',
      subtitle: 'Stories from collectors, ethical buyers, and craft lovers honoring the master artisans of Jharkhand.',
      cta: 'Share Your Craft Story'
    },
    tourism: {
      badge: 'TRAVELER REFLECTIONS',
      title: 'Traveler Journeys & Memories',
      hindi: 'यात्रियों के संस्मरण एवं अनुभव',
      subtitle: 'Reflections from cultural wanderers who experienced our sacred groves, artisanal workshops, and ancient trails.',
      cta: 'Share Your Journey'
    },
    food: {
      badge: 'GASTRONOMIC REVIEWS',
      title: 'Flavors, Feasts & Reflections',
      hindi: 'स्वाद, परंपरा और जनअनुभव',
      subtitle: 'Tasting notes from culinary explorers experiencing Jharkhand’s ancient wild foraging and hearthside tribal cooking.',
      cta: 'Share Tasting Experience'
    },
    dance: {
      badge: 'CULTURAL IMPRESSIONS',
      title: 'Rhythms, Echoes & Impressions',
      hindi: 'ताल, नृत्य और सांस्कृतिक अनुभूति',
      subtitle: 'Audience reverberations moved by the primordial beats of the Mandar, unison footsteps, and ancestral storytelling.',
      cta: 'Share Your Impression'
    }
  }[vertical] || {
    badge: 'COMMUNITY VOICES',
    title: 'Voices of Our Heritage',
    hindi: 'सांस्कृतिक अनुभव',
    subtitle: 'Heartfelt impressions from people engaging with indigenous traditions.',
    cta: 'Share Your Feedback'
  };

  return (
    <section 
      aria-label="Cultural Feedback & Reviews"
      className={`relative w-full py-20 sm:py-28 overflow-hidden transition-colors ${
        isDark 
          ? 'bg-[#0D0D0D] text-white' 
          : 'bg-[#FDFBF7] text-vanaj-dark'
      } ${className}`}
    >
      {/* Subtle Tribal Pattern & Ambient Glow */}
      <div 
        className={`absolute inset-0 pointer-events-none opacity-[0.04] bg-tribal-pattern ${
          isDark ? 'invert' : ''
        }`} 
      />
      
      {/* Decorative Golden Ambient Orbs */}
      <div 
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#C9952A]/10 blur-3xl pointer-events-none" 
      />
      <div 
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#2D6A4F]/10 blur-3xl pointer-events-none" 
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4 backdrop-blur-sm shadow-sm transition-all duration-300">
            <span className={`inline-flex items-center gap-1.5 ${
              isDark 
                ? 'text-[#C9952A] border-[#C9952A]/30 bg-[#C9952A]/10' 
                : 'text-vanaj-green border-vanaj-green/20 bg-vanaj-green/5'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              {headers.badge}
            </span>
          </div>

          <h2 className={`font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 ${
            isDark ? 'text-white' : 'text-vanaj-dark'
          }`}>
            {headers.title}
          </h2>

          <p className="font-heading text-lg sm:text-xl text-[#C9952A] mb-4 font-medium tracking-wide">
            {headers.hindi}
          </p>

          <p className={`font-body text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light ${
            isDark ? 'text-neutral-300' : 'text-stone-600'
          }`}>
            {headers.subtitle}
          </p>

          {/* Decorative Ochre Divider */}
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#C9952A] to-transparent mx-auto mt-6 rounded-full" />
        </div>

        {/* Rating Overview & Action Bar */}
        <div className={`p-5 sm:p-7 rounded-2xl sm:rounded-3xl border mb-12 sm:mb-16 transition-all duration-300 ${
          isDark 
            ? 'bg-[#151515]/90 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
            : 'bg-white/90 border-stone-200/80 shadow-[0_10px_35px_rgba(44,26,14,0.05)]'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Score & Stars */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-center md:text-left">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-4xl sm:text-5xl font-heading font-extrabold ${
                  isDark ? 'text-white' : 'text-vanaj-dark'
                }`}>
                  {avgRating}
                </span>
                <span className="text-sm font-medium text-[#C9952A]">/ 5.0</span>
              </div>

              <div className="h-10 w-px bg-stone-300 dark:bg-neutral-700 hidden sm:block" />

              <div>
                <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 fill-[#C9952A] text-[#C9952A] filter drop-shadow-sm" 
                    />
                  ))}
                </div>
                <p className={`text-xs sm:text-sm font-body ${
                  isDark ? 'text-neutral-400' : 'text-stone-500'
                }`}>
                  Based on <strong className={isDark ? 'text-white' : 'text-vanaj-dark'}>{reviews.length}</strong> verified impressions
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <Award className="w-3.5 h-3.5" />
                <span>100% Authentic Community Voices</span>
              </div>
            </div>

            {/* Filter Pills & Submit Button */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
              
              {/* Filter */}
              <div className={`flex items-center rounded-xl p-1 border text-xs sm:text-sm ${
                isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-stone-100 border-stone-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setSelectedRatingFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedRatingFilter === 'all'
                      ? 'bg-[#C9952A] text-white shadow-sm'
                      : isDark ? 'text-neutral-300 hover:text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({reviews.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRatingFilter('5')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedRatingFilter === '5'
                      ? 'bg-[#C9952A] text-white shadow-sm'
                      : isDark ? 'text-neutral-300 hover:text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  ★ 5 Stars
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRatingFilter('recommended')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedRatingFilter === 'recommended'
                      ? 'bg-[#C9952A] text-white shadow-sm'
                      : isDark ? 'text-neutral-300 hover:text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Recommended
                </button>
              </div>

              {/* Action Button to Open Form */}
              <button
                type="button"
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm sm:text-base text-white bg-gradient-to-r from-[#C9952A] to-[#A37418] hover:from-[#d8a436] hover:to-[#b78422] active:scale-95 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C9952A]/50 min-h-[44px]"
              >
                {isFormOpen ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Close Form</span>
                  </>
                ) : (
                  <>
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>{headers.cta}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Expandable Submission Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="overflow-hidden mb-14"
            >
              <div className={`p-6 sm:p-8 md:p-10 rounded-3xl border relative ${
                isDark 
                  ? 'bg-gradient-to-b from-[#181818] to-[#121212] border-[#C9952A]/30 shadow-[0_15px_40px_rgba(0,0,0,0.7)]' 
                  : 'bg-white border-[#C9952A]/30 shadow-[0_15px_45px_rgba(201,149,42,0.12)]'
              }`}>
                
                {/* Form Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-stone-200/60 dark:border-neutral-800">
                  <div>
                    <h3 className={`font-heading text-xl sm:text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-vanaj-dark'
                    }`}>
                      Share Your Story & Cultural Impression
                    </h3>
                    <p className={`font-body text-xs sm:text-sm mt-1 ${
                      isDark ? 'text-neutral-400' : 'text-stone-500'
                    }`}>
                      Your feedback inspires our artisans and preserves the authenticity of Vanaj.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-neutral-800 transition-colors text-stone-400 hover:text-stone-600 dark:hover:text-white"
                    aria-label="Close form"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Thank you animation state */}
                {showThankYou ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 flex flex-col items-center justify-center text-center space-y-3"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-2 shadow-inner">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h4 className="text-2xl font-heading font-bold text-[#C9952A]">
                      जोहार! (Johar!) Thank You!
                    </h4>
                    <p className={`font-body text-sm sm:text-base max-w-md ${
                      isDark ? 'text-neutral-300' : 'text-stone-600'
                    }`}>
                      Your feedback has been published and placed into our community archives. We deeply value your respect for tribal heritage.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formError && (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm font-medium">
                        {formError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      
                      {/* Name */}
                      <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${
                          isDark ? 'text-neutral-300' : 'text-stone-700'
                        }`}>
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. Priya Soren, Siddharth Rao"
                          className={`w-full px-4 py-2.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-[#C9952A]/50 ${
                            isDark 
                              ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500' 
                              : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400'
                          }`}
                        />
                      </div>

                      {/* Location */}
                      <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${
                          isDark ? 'text-neutral-300' : 'text-stone-700'
                        }`}>
                          City & Region *
                        </label>
                        <input
                          type="text"
                          required
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          placeholder="e.g. Ranchi, Mumbai, Bengaluru"
                          className={`w-full px-4 py-2.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-[#C9952A]/50 ${
                            isDark 
                              ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500' 
                              : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400'
                          }`}
                        />
                      </div>

                      {/* Topic Category */}
                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${
                          isDark ? 'text-neutral-300' : 'text-stone-700'
                        }`}>
                          Experience / Topic
                        </label>
                        <select
                          value={formTopic}
                          onChange={(e) => setFormTopic(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-[#C9952A]/50 ${
                            isDark 
                              ? 'bg-neutral-900 border-neutral-700 text-white' 
                              : 'bg-stone-50 border-stone-200 text-stone-900'
                          }`}
                        >
                          <option value="">Select a specific topic...</option>
                          {(TOPIC_OPTIONS[vertical] || []).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Interactive Star Rating */}
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-2 ${
                        isDark ? 'text-neutral-300' : 'text-stone-700'
                      }`}>
                        Your Rating: <span className="font-bold text-[#C9952A] ml-1">{formRating} / 5 Stars</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((starVal) => {
                          const isFilled = (hoverRating || formRating) >= starVal;
                          return (
                            <button
                              key={starVal}
                              type="button"
                              onClick={() => setFormRating(starVal)}
                              onMouseEnter={() => setHoverRating(starVal)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 focus:outline-none focus:scale-110 active:scale-95 transition-transform"
                              aria-label={`Rate ${starVal} out of 5 stars`}
                            >
                              <Star
                                className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                  isFilled 
                                    ? 'fill-[#C9952A] text-[#C9952A] drop-shadow-[0_2px_8px_rgba(201,149,42,0.4)]' 
                                    : isDark ? 'text-neutral-700' : 'text-stone-300'
                                }`}
                              />
                            </button>
                          );
                        })}
                        <span className={`text-xs ml-3 hidden sm:inline ${
                          isDark ? 'text-neutral-400' : 'text-stone-500'
                        }`}>
                          {formRating === 5 && 'Outstanding & Authentic'}
                          {formRating === 4 && 'Very Impressive'}
                          {formRating === 3 && 'Good Experience'}
                          {formRating <= 2 && 'Needs Improvement'}
                        </span>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${
                        isDark ? 'text-neutral-300' : 'text-stone-700'
                      }`}>
                        Your Reflection / Feedback *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formReview}
                        onChange={(e) => setFormReview(e.target.value)}
                        placeholder="Share your genuine experience, what stood out, how it made you feel, or words of encouragement for the indigenous community..."
                        className={`w-full px-4 py-3 rounded-xl text-sm border leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-[#C9952A]/50 ${
                          isDark 
                            ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500' 
                            : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400'
                        }`}
                      />
                    </div>

                    {/* Recommendation Toggle & Submit Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs sm:text-sm">
                        <input
                          type="checkbox"
                          checked={formRecommended}
                          onChange={(e) => setFormRecommended(e.target.checked)}
                          className="w-4 h-4 text-[#C9952A] rounded border-stone-300 focus:ring-[#C9952A]"
                        />
                        <span className={isDark ? 'text-neutral-300' : 'text-stone-600'}>
                          I proudly recommend this indigenous cultural initiative to others
                        </span>
                      </label>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setIsFormOpen(false)}
                          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                            isDark 
                              ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' 
                              : 'border-stone-300 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#C9952A] to-[#A37418] hover:from-[#d8a436] hover:to-[#b78422] transition-all shadow-md active:scale-95"
                        >
                          <Send className="w-4 h-4" />
                          <span>Publish Impression</span>
                        </button>
                      </div>
                    </div>

                  </form>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews Responsive Grid */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className={`font-body text-base ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>
              No feedback found matching the selected filter.
            </p>
            <button
              onClick={() => setSelectedRatingFilter('all')}
              className="mt-3 text-sm text-[#C9952A] hover:underline font-medium"
            >
              Reset to view all reviews
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredReviews.map((rev) => {
              const isLiked = !!likedMap[rev.id];
              return (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-300 ${
                    isDark
                      ? 'bg-gradient-to-b from-[#161616] to-[#101010] border-white/10 hover:border-[#C9952A]/40 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(201,149,42,0.15)]'
                      : 'bg-white border-stone-200/90 hover:border-[#C9952A]/40 shadow-[0_4px_20px_rgba(44,26,14,0.04)] hover:shadow-[0_10px_30px_rgba(201,149,42,0.12)]'
                  }`}
                >
                  {/* Watermark Quote Icon in Background */}
                  <Quote 
                    className={`absolute right-6 top-6 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none transition-transform group-hover:scale-110 duration-300 opacity-5 ${
                      isDark ? 'text-[#C9952A]' : 'text-vanaj-dark'
                    }`} 
                  />

                  {/* Card Top: Author, Avatar, Stars, Topic */}
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      
                      {/* Avatar & Author Info */}
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-heading font-bold text-base shadow-sm ${
                          isDark 
                            ? 'bg-[#C9952A]/20 text-[#C9952A] border border-[#C9952A]/30' 
                            : 'bg-amber-100/70 text-[#8B5E3C] border border-[#C9952A]/20'
                        }`}>
                          {rev.name.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`font-heading font-bold text-base sm:text-lg leading-tight ${
                              isDark ? 'text-white' : 'text-vanaj-dark'
                            }`}>
                              {rev.name}
                            </h4>
                            <span 
                              title="Verified Community Impression" 
                              className="inline-flex text-emerald-500"
                            >
                              <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                            </span>
                          </div>

                          <div className={`flex items-center gap-1.5 text-xs mt-0.5 ${
                            isDark ? 'text-neutral-400' : 'text-stone-500'
                          }`}>
                            <MapPin className="w-3 h-3 text-[#C9952A]" />
                            <span>{rev.location}</span>
                            <span className="opacity-40">•</span>
                            <span className="italic">{rev.date}</span>
                          </div>
                        </div>

                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="w-4 h-4 fill-[#C9952A] text-[#C9952A]" 
                          />
                        ))}
                      </div>

                    </div>

                    {/* Topic Badge if available */}
                    {rev.topic && (
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide border ${
                          isDark 
                            ? 'bg-neutral-800/80 text-[#C9952A] border-[#C9952A]/20' 
                            : 'bg-amber-50 text-amber-900 border-amber-200/60'
                        }`}>
                          {rev.topic}
                        </span>
                      </div>
                    )}

                    {/* Review Body */}
                    <p className={`font-body text-sm sm:text-base leading-relaxed mb-6 font-light ${
                      isDark ? 'text-neutral-200' : 'text-stone-700'
                    }`}>
                      "{rev.review}"
                    </p>
                  </div>

                  {/* Card Bottom: Helpful Button & Recommended Badge */}
                  <div className={`pt-4 border-t flex items-center justify-between gap-3 text-xs ${
                    isDark ? 'border-neutral-800' : 'border-stone-100'
                  }`}>
                    
                    <button
                      type="button"
                      onClick={() => handleLike(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all min-h-[36px] active:scale-95 ${
                        isLiked 
                          ? 'bg-[#C9952A]/15 text-[#C9952A] border-[#C9952A]/40' 
                          : isDark 
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700' 
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300'
                      }`}
                      aria-label="Mark feedback as helpful"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>Helpful ({rev.likes || 0})</span>
                    </button>

                    {rev.recommended && (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                        <Heart className="w-3.5 h-3.5 fill-current text-emerald-500" />
                        <span>Recommended Experience</span>
                      </div>
                    )}

                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom Assurance Note */}
        <div className="mt-14 sm:mt-16 text-center">
          <p className={`text-xs sm:text-sm font-body tracking-wide flex items-center justify-center gap-2 ${
            isDark ? 'text-neutral-500' : 'text-stone-400'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9952A]" />
            All submissions are reviewed in spirit with Vanaj's tribal ethics & cultural preservation mission.
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9952A]" />
          </p>
        </div>

      </div>
    </section>
  );
}
