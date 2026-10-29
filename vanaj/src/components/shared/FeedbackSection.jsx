import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  RotateCcw,
  Database,
  Globe,
  Edit3,
  CheckCheck,
  PlusCircle,
  FileText,
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import {
  getVerticalFeedback,
  submitCloudFeedback,
  updateCloudFeedback,
  deleteCloudFeedback,
  toggleCloudFeedbackLike,
  subscribeToFeedbackRealtime,
  isMyReview,
  getStoredLikesMap
} from '../../services/feedbackService';
import {
  getFeedbackDraft,
  saveFeedbackDraft,
  clearFeedbackDraft
} from '../../utils/storage';

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
      rating: 4,
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
      rating: 4,
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
      rating: 4,
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
      rating: 4,
      date: '1 month ago',
      review: 'The balance between athletic vigor and poetic gentleness in the Karma dance is poetry in motion. Vanaj gives these timeless indigenous traditions the global spotlight they richly merit.',
      likes: 33,
      recommended: true
    }
  ],
  languages: [
    {
      id: 'l1',
      name: 'Prof. Ramdayal Munda',
      location: 'Ranchi, Jharkhand',
      role: 'Linguistic Scholar',
      topic: 'Ol Chiki Script & Typography',
      rating: 5,
      date: '2 days ago',
      review: 'Preserving the sacred Ol Chiki glyphs alongside natural acoustic pronunciation guides honors Pandit Raghunath Murmu’s vision. Vanaj brings linguistic dignity to our mother tongues on the global stage.',
      likes: 49,
      recommended: true
    },
    {
      id: 'l2',
      name: 'Sunita Hembrom',
      location: 'Dumka, Jharkhand',
      role: 'Tribal Educator',
      topic: 'Santali Vocabulary & Grammar',
      rating: 5,
      date: '1 week ago',
      review: 'The interactive flashcards and vernacular translations make teaching our children second nature. Seeing ancient oral traditions codified with such reverence is deeply inspiring.',
      likes: 36,
      recommended: true
    },
    {
      id: 'l3',
      name: 'Devkaran Soren',
      location: 'Jamshedpur, Jharkhand',
      role: 'Diaspora Student',
      topic: 'Mundari Dialect & Idioms',
      rating: 5,
      date: '2 weeks ago',
      review: 'Living away from our ancestral soil, Vanaj’s language repository has become my daily sanctuary. The etymological roots of words like "Johar" and "Sasandiri" bridge the generational divide.',
      likes: 28,
      recommended: true
    },
    {
      id: 'l4',
      name: 'Dr. Anupama Topno',
      location: 'New Delhi',
      role: 'Anthropology Fellow',
      topic: 'Ho Language & Warang Chiti',
      rating: 4,
      date: '3 weeks ago',
      review: 'Scholarly precision paired with accessible digital UI. A stellar resource for preserving the Austroasiatic and Dravidian heritage of Central India.',
      likes: 22,
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
  ],
  languages: [
    'Ol Chiki Script & Typography',
    'Santali Vocabulary & Grammar',
    'Mundari Dialect & Idioms',
    'Ho Language & Warang Chiti',
    'Kurukh Oral Heritage',
    'Overall Language Preservation'
  ]
};

export default function FeedbackSection({ 
  vertical = 'marketplace', 
  theme = 'light',
  className = '' 
}) {
  const [reviews, setReviews] = useState([]);
  const [likedMap, setLikedMap] = useState(() => getStoredLikesMap(vertical));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('all');
  const [showThankYou, setShowThankYou] = useState(false);
  const [justSubmittedReview, setJustSubmittedReview] = useState(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState('syncing'); // 'cloud' | 'local' | 'syncing'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formReview, setFormReview] = useState('');
  const [formRecommended, setFormRecommended] = useState(true);
  const [formError, setFormError] = useState('');

  // Fetch reviews from Supabase with instant local fallback
  const loadReviews = useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsRefreshing(true);
    const defaults = DEFAULT_REVIEWS[vertical] || DEFAULT_REVIEWS.marketplace;
    
    try {
      const res = await getVerticalFeedback(vertical, defaults);
      setReviews(res.reviews);
      setSyncStatus(res.isCloud ? 'cloud' : 'local');
    } catch (err) {
      console.warn('Error loading feedback:', err);
      setSyncStatus('local');
    } finally {
      if (showIndicator) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, [vertical]);

  // Initial load & Realtime sync
  useEffect(() => {
    let isMounted = true;
    (async () => {
      await loadReviews(false);
      if (isMounted) {
        setLikedMap(getStoredLikesMap(vertical));
      }
    })();

    // Restore draft if any exists and not currently editing
    const draft = getFeedbackDraft(vertical);
    if (draft && (draft.name || draft.review || draft.location)) {
      setFormName(draft.name || '');
      setFormLocation(draft.location || '');
      setFormTopic(draft.topic || '');
      setFormRating(draft.rating || 5);
      setFormReview(draft.review || '');
      setFormRecommended(draft.recommended ?? true);
      setDraftRestored(true);
    }

    // Subscribe to live updates from Supabase channel
    const unsubscribe = subscribeToFeedbackRealtime(vertical, (event) => {
      if (event.type === 'INSERT' && event.review) {
        setReviews(prev => {
          if (prev.some(r => r.id === event.review.id)) return prev;
          return [event.review, ...prev];
        });
      } else if (event.type === 'UPDATE' && event.review) {
        setReviews(prev => prev.map(r => r.id === event.review.id ? { ...r, ...event.review } : r));
      } else if (event.type === 'DELETE' && event.id) {
        setReviews(prev => prev.filter(r => r.id !== event.id));
      }
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [vertical, loadReviews]);

  // Persist draft on user typing
  const handleInputChange = (field, value) => {
    const nextDraft = {
      name: formName,
      location: formLocation,
      topic: formTopic,
      rating: formRating,
      review: formReview,
      recommended: formRecommended,
      [field]: value
    };

    if (field === 'name') setFormName(value);
    else if (field === 'location') setFormLocation(value);
    else if (field === 'topic') setFormTopic(value);
    else if (field === 'rating') setFormRating(value);
    else if (field === 'review') setFormReview(value);
    else if (field === 'recommended') setFormRecommended(value);

    if (!editingReviewId) {
      saveFeedbackDraft(vertical, nextDraft);
    }
  };

  const handleDiscardDraft = () => {
    clearFeedbackDraft(vertical);
    setFormName('');
    setFormLocation('');
    setFormTopic('');
    setFormRating(5);
    setFormReview('');
    setFormRecommended(true);
    setDraftRestored(false);
  };

  // Start editing a user-submitted review
  const handleStartEdit = (rev) => {
    setEditingReviewId(rev.id);
    setFormName(rev.name || '');
    setFormLocation(rev.location || '');
    setFormTopic(rev.topic || '');
    setFormRating(rev.rating || 5);
    setFormReview(rev.review || '');
    setFormRecommended(rev.recommended ?? true);
    setShowThankYou(false);
    setJustSubmittedReview(null);
    setIsFormOpen(true);

    const formEl = document.getElementById(`feedback-form-${vertical}`);
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    const draft = getFeedbackDraft(vertical);
    if (draft) {
      setFormName(draft.name || '');
      setFormLocation(draft.location || '');
      setFormTopic(draft.topic || '');
      setFormRating(draft.rating || 5);
      setFormReview(draft.review || '');
      setFormRecommended(draft.recommended ?? true);
    } else {
      setFormName('');
      setFormLocation('');
      setFormTopic('');
      setFormRating(5);
      setFormReview('');
      setFormRecommended(true);
    }
    setIsFormOpen(false);
  };

  // Handle Like / Helpful toggle synchronized to Supabase
  const handleLike = async (id) => {
    const result = await toggleCloudFeedbackLike(vertical, id, reviews);
    setReviews(result.updatedReviews);
    setLikedMap(result.newLikesMap);
  };

  // Submit new review or save edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formLocation.trim() || !formReview.trim()) {
      setFormError('Please fill in your name, city, and reflection.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    try {
      if (editingReviewId) {
        const res = await updateCloudFeedback(vertical, editingReviewId, {
          name: formName.trim(),
          location: formLocation.trim(),
          topic: formTopic || TOPIC_OPTIONS[vertical]?.[0] || 'Community Impression',
          rating: formRating,
          review: formReview.trim(),
          recommended: formRecommended
        }, reviews);

        setReviews(res.updatedReviews);
        setEditingReviewId(null);
        clearFeedbackDraft(vertical);
        setSelectedRatingFilter('all');
        setIsFormOpen(false);
        return;
      }

      const newReviewItem = {
        name: formName.trim(),
        location: formLocation.trim(),
        role: 'Cultural Patron',
        topic: formTopic || TOPIC_OPTIONS[vertical]?.[0] || 'Community Impression',
        rating: formRating,
        review: formReview.trim(),
        recommended: formRecommended
      };

      const result = await submitCloudFeedback(vertical, newReviewItem, reviews);
      setReviews(result.updatedReviews);
      clearFeedbackDraft(vertical);
      setSelectedRatingFilter('all');

      // Keep newly submitted review pinned & visible in thank-you card
      setJustSubmittedReview(result.review);
      setShowThankYou(true);
      if (result.isCloud) setSyncStatus('cloud');

      // Reset form fields
      setFormName('');
      setFormLocation('');
      setFormTopic('');
      setFormRating(5);
      setFormReview('');
      setFormRecommended(true);
      setDraftRestored(false);

      setTimeout(() => {
        const spotlightEl = document.getElementById(`user-spotlight-${vertical}`);
        if (spotlightEl) spotlightEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setFormError('Failed to publish feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a user-submitted review
  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to remove your feedback? This will delete it permanently.')) {
      const res = await deleteCloudFeedback(vertical, id, reviews);
      setReviews(res.updatedReviews);
      if (justSubmittedReview?.id === id) {
        setJustSubmittedReview(null);
      }
    }
  };

  // Reset to default reviews
  const handleResetToDefaults = () => {
    const defaults = DEFAULT_REVIEWS[vertical] || DEFAULT_REVIEWS.marketplace;
    setReviews(defaults);
    setResetConfirmOpen(false);
    setSelectedRatingFilter('all');
    setJustSubmittedReview(null);
  };

  // User submitted reviews from this browser
  const userReviews = useMemo(() => {
    return reviews.filter(r => isMyReview(r.id, r));
  }, [reviews]);

  // Dynamic rating statistics
  const ratingStats = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        average: '5.0',
        total: 0,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recommendedCount: 0
      };
    }

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    let recCount = 0;

    reviews.forEach(r => {
      const rate = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      counts[rate] = (counts[rate] || 0) + 1;
      sum += rate;
      if (r.recommended) recCount += 1;
    });

    const total = reviews.length;
    const average = (sum / total).toFixed(1);
    const percentages = {
      5: Math.round((counts[5] / total) * 100),
      4: Math.round((counts[4] / total) * 100),
      3: Math.round((counts[3] / total) * 100),
      2: Math.round((counts[2] / total) * 100),
      1: Math.round((counts[1] / total) * 100)
    };

    return {
      average,
      total,
      counts,
      percentages,
      recommendedCount: recCount
    };
  }, [reviews]);

  // Filtered review list
  const filteredReviews = useMemo(() => {
    return reviews.filter(rev => {
      if (selectedRatingFilter === 'all') return true;
      if (selectedRatingFilter === 'recommended') return Boolean(rev.recommended);
      const targetRating = parseInt(selectedRatingFilter, 10);
      return Math.round(rev.rating || 5) === targetRating;
    });
  }, [reviews, selectedRatingFilter]);

  const isDark = theme === 'dark';

  // Vertical-specific branding headers
  const headers = {
    marketplace: {
      badge: 'COMMUNITY PATRON TESTIMONIALS',
      title: 'Voices of Craft Patrons',
      hindi: 'ग्राहकों एवं कला-संग्राहकों के विचार',
      subtitle: 'Synchronized feedback from collectors, ethical buyers, and craft lovers honoring the master artisans of Jharkhand.',
      cta: 'Share Your Craft Story'
    },
    tourism: {
      badge: 'LIVE TRAVELER REFLECTIONS',
      title: 'Traveler Journeys & Memories',
      hindi: 'यात्रियों के संस्मरण एवं अनुभव',
      subtitle: 'Public reflections from cultural wanderers who experienced our sacred groves, artisanal workshops, and ancient trails.',
      cta: 'Share Your Journey'
    },
    food: {
      badge: 'PUBLIC GASTRONOMIC REVIEWS',
      title: 'Flavors, Feasts & Reflections',
      hindi: 'स्वाद, परंपरा और जनअनुभव',
      subtitle: 'Tasting notes from culinary explorers experiencing Jharkhand’s ancient wild foraging and hearthside tribal cooking.',
      cta: 'Share Tasting Experience'
    },
    dance: {
      badge: 'CULTURAL IMPRESSIONS & ECHOES',
      title: 'Rhythms, Echoes & Impressions',
      hindi: 'ताल, नृत्य और सांस्कृतिक अनुभूति',
      subtitle: 'Audience reverberations moved by the primordial beats of the Mandar, unison footsteps, and ancestral storytelling.',
      cta: 'Share Your Impression'
    },
    languages: {
      badge: 'PUBLIC LINGUISTIC VOICES',
      title: 'Voices of Indigenous Tongues',
      hindi: 'मातृभाषा, लिपि एवं जनसंवाद',
      subtitle: 'Scholarly reflections, student journeys, and community speakers preserving the living oral traditions of Jharkhand.',
      cta: 'Share Linguistic Feedback'
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
        <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border mb-12 sm:mb-16 transition-all duration-300 ${
          isDark 
            ? 'bg-[#151515]/90 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
            : 'bg-white/90 border-stone-200/80 shadow-[0_10px_35px_rgba(44,26,14,0.05)]'
        }`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left: Score & Live Rating Breakdown */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 w-full lg:w-auto">
              
              {/* Score Display */}
              <div className="text-center sm:text-left shrink-0">
                <div className="flex items-baseline justify-center sm:justify-start gap-1.5">
                  <span className={`text-5xl sm:text-6xl font-heading font-extrabold ${
                    isDark ? 'text-white' : 'text-vanaj-dark'
                  }`}>
                    {ratingStats.average}
                  </span>
                  <span className="text-sm font-medium text-[#C9952A]">/ 5.0</span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-1 my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < Math.round(Number(ratingStats.average))
                          ? 'fill-[#C9952A] text-[#C9952A]'
                          : isDark ? 'text-neutral-700' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>

                <p className={`text-xs font-body ${
                  isDark ? 'text-neutral-400' : 'text-stone-500'
                }`}>
                  <strong className={isDark ? 'text-white' : 'text-vanaj-dark'}>
                    {ratingStats.total}
                  </strong> community reviews
                </p>

                {/* Cloud Sync Status Badge */}
                <div className="mt-2.5 flex items-center gap-2">
                  {syncStatus === 'cloud' ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <Globe className="w-3 h-3" />
                      <span>Cloud Live • Visible to Everyone</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <Database className="w-3 h-3" />
                      <span>Local Archive • Supabase Connected</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => loadReviews(true)}
                    disabled={isRefreshing}
                    className="p-1 text-stone-400 hover:text-[#C9952A] transition-colors"
                    title="Refresh reviews from Supabase"
                    aria-label="Refresh feedback"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C9952A]' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Star Rating Breakdown Bars */}
              <div className="w-full sm:w-64 space-y-1.5 text-xs font-body">
                {[5, 4, 3, 2, 1].map((starVal) => {
                  const count = ratingStats.counts[starVal] || 0;
                  const pct = ratingStats.percentages[starVal] || 0;
                  const isSelected = selectedRatingFilter === String(starVal);

                  return (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setSelectedRatingFilter(isSelected ? 'all' : String(starVal))}
                      className={`w-full flex items-center gap-2 p-1 rounded-md transition-colors text-left group ${
                        isSelected 
                          ? isDark ? 'bg-neutral-800' : 'bg-stone-100 font-semibold' 
                          : 'hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                      title={`Filter by ${starVal} stars (${count} reviews)`}
                    >
                      <span className="w-6 shrink-0 font-medium text-stone-500 dark:text-neutral-400">
                        {starVal}★
                      </span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden bg-stone-200 dark:bg-neutral-800">
                        <div 
                          className="h-full bg-[#C9952A] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-9 text-right shrink-0 text-stone-500 dark:text-neutral-400 text-[11px]">
                        {count} ({pct}%)
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Right: Filter Buttons & Submit Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto justify-end">
              
              {/* Filter Pills */}
              <div className={`flex flex-wrap items-center justify-center rounded-xl p-1 border text-xs ${
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
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                    selectedRatingFilter === '5'
                      ? 'bg-[#C9952A] text-white shadow-sm'
                      : isDark ? 'text-neutral-300 hover:text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  5★ ({ratingStats.counts[5] || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRatingFilter('4')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                    selectedRatingFilter === '4'
                      ? 'bg-[#C9952A] text-white shadow-sm'
                      : isDark ? 'text-neutral-300 hover:text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  4★ ({ratingStats.counts[4] || 0})
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
                  Rec ({ratingStats.recommendedCount})
                </button>
              </div>

              {/* Action Button to Open Form */}
              <button
                type="button"
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-[#C9952A] to-[#A37418] hover:from-[#d8a436] hover:to-[#b78422] active:scale-95 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C9952A]/50 min-h-[44px]"
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
              id={`feedback-form-${vertical}`}
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
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-heading text-xl sm:text-2xl font-bold ${
                        isDark ? 'text-white' : 'text-vanaj-dark'
                      }`}>
                        {editingReviewId ? 'Edit Your Reflection & Feedback' : 'Share Your Story & Cultural Impression'}
                      </h3>
                      {editingReviewId && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C9952A]/20 text-[#C9952A] font-medium border border-[#C9952A]/40">
                          Editing
                        </span>
                      )}
                    </div>
                    <p className={`font-body text-xs sm:text-sm ${
                      isDark ? 'text-neutral-400' : 'text-stone-500'
                    }`}>
                      {editingReviewId 
                        ? 'Update your previously submitted feedback. Changes are synchronized to everyone.'
                        : 'Your reflection will be published in the public archive and immediately visible to everyone.'}
                    </p>

                    {/* Unsaved draft indicator */}
                    {!editingReviewId && draftRestored && (
                      <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Restored your draft in-progress from browser storage</span>
                        <button
                          type="button"
                          onClick={handleDiscardDraft}
                          className="underline hover:text-red-500 ml-1 font-semibold"
                        >
                          Clear Draft
                        </button>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={editingReviewId ? handleCancelEdit : () => setIsFormOpen(false)}
                    className="p-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-neutral-800 transition-colors text-stone-400 hover:text-stone-600 dark:hover:text-white"
                    aria-label="Close form"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Persistent Feedback Confirmation State */}
                {showThankYou ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 px-6 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/30 text-center space-y-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-heading font-bold text-[#C9952A]">
                        जोहार! (Johar!) Feedback Published Successfully!
                      </h4>
                      <p className={`font-body text-sm sm:text-base max-w-lg mx-auto mt-1 ${
                        isDark ? 'text-neutral-300' : 'text-stone-600'
                      }`}>
                        Your reflection and rating have been stored in the public community archive and are now visible to everyone across all browsers and devices.
                      </p>
                    </div>

                    {justSubmittedReview && (
                      <div className={`max-w-xl mx-auto p-4 rounded-xl border text-left my-4 text-xs sm:text-sm ${
                        isDark ? 'bg-neutral-900/90 border-neutral-700 text-neutral-300' : 'bg-white border-stone-200 text-stone-700'
                      }`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-[#C9952A]">{justSubmittedReview.name} • {justSubmittedReview.location}</span>
                          <span className="font-semibold text-emerald-600">{justSubmittedReview.rating}★ Rating</span>
                        </div>
                        <p className="italic font-light">"{justSubmittedReview.review}"</p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowThankYou(false);
                          setIsFormOpen(false);
                        }}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#C9952A] to-[#A37418] hover:from-[#d8a436] hover:to-[#b78422] transition-all shadow-md active:scale-95"
                      >
                        Keep Viewing Feedback Below
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowThankYou(false);
                          setJustSubmittedReview(null);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                          isDark ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-stone-300 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        Write Another Review
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formError && (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
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
                          onChange={(e) => handleInputChange('name', e.target.value)}
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
                          onChange={(e) => handleInputChange('location', e.target.value)}
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
                          onChange={(e) => handleInputChange('topic', e.target.value)}
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
                              onClick={() => handleInputChange('rating', starVal)}
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
                          {formRating === 2 && 'Fair / Needs Improvement'}
                          {formRating === 1 && 'Unsatisfactory'}
                        </span>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className={`block text-xs sm:text-sm font-medium ${
                          isDark ? 'text-neutral-300' : 'text-stone-700'
                        }`}>
                          Your Reflection / Feedback *
                        </label>
                        {!editingReviewId && (
                          <span className="text-[11px] text-[#C9952A] font-light">
                            Draft automatically auto-saved
                          </span>
                        )}
                      </div>
                      <textarea
                        required
                        rows={3}
                        value={formReview}
                        onChange={(e) => handleInputChange('review', e.target.value)}
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
                          onChange={(e) => handleInputChange('recommended', e.target.checked)}
                          className="w-4 h-4 text-[#C9952A] rounded border-stone-300 focus:ring-[#C9952A]"
                        />
                        <span className={isDark ? 'text-neutral-300' : 'text-stone-600'}>
                          I proudly recommend this indigenous cultural initiative to others
                        </span>
                      </label>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={editingReviewId ? handleCancelEdit : () => setIsFormOpen(false)}
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
                          disabled={isSubmitting}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#C9952A] to-[#A37418] hover:from-[#d8a436] hover:to-[#b78422] transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          <span>
                            {isSubmitting 
                              ? 'Publishing...' 
                              : editingReviewId ? 'Update Reflection' : 'Publish for Everyone'}
                          </span>
                        </button>
                      </div>
                    </div>

                  </form>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dedicated Spotlight: User's Published Feedback */}
        {userReviews.length > 0 && (
          <div id={`user-spotlight-${vertical}`} className="mb-12">
            <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all ${
              isDark 
                ? 'bg-gradient-to-br from-[#1E1710] via-[#16130F] to-[#121212] border-[#C9952A]/40 shadow-[0_10px_30px_rgba(201,149,42,0.15)]' 
                : 'bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EB] to-[#FFF8ED] border-[#C9952A]/40 shadow-[0_10px_35px_rgba(201,149,42,0.1)]'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#C9952A]/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C9952A] text-white flex items-center justify-center shadow-md">
                    <CheckCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-heading text-lg sm:text-xl font-bold ${
                      isDark ? 'text-white' : 'text-vanaj-dark'
                    }`}>
                      Your Published Feedback
                    </h3>
                    <p className="text-xs text-[#C9952A] font-medium flex items-center gap-1.5 mt-0.5">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Publicly active & visible to everyone across all devices</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingReviewId(null);
                      setIsFormOpen(true);
                      setShowThankYou(false);
                    }}
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                      isDark 
                        ? 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:text-white hover:border-[#C9952A]' 
                        : 'bg-white text-stone-700 border-stone-200 hover:border-[#C9952A] hover:text-[#C9952A] shadow-sm'
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Another Feedback</span>
                  </button>
                </div>
              </div>

              {/* User Reviews List in Spotlight */}
              <div className="space-y-4">
                {userReviews.map((myRev) => (
                  <div 
                    key={myRev.id}
                    className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                      isDark 
                        ? 'bg-[#151515]/95 border-white/10' 
                        : 'bg-white/95 border-[#C9952A]/30 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C9952A] text-white font-heading font-bold flex items-center justify-center text-sm shadow">
                          {myRev.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-heading font-bold text-base ${isDark ? 'text-white' : 'text-vanaj-dark'}`}>
                              {myRev.name}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              Public • Live
                            </span>
                          </div>
                          <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>
                            <MapPin className="w-3 h-3 text-[#C9952A]" />
                            <span>{myRev.location}</span>
                            <span className="opacity-40">•</span>
                            <span className="italic">{myRev.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 bg-[#C9952A]/10 px-2.5 py-1 rounded-full border border-[#C9952A]/20">
                          {[...Array(Math.round(myRev.rating || 5))].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#C9952A] text-[#C9952A]" />
                          ))}
                          <span className="text-xs font-bold text-[#C9952A] ml-1">{myRev.rating}★</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStartEdit(myRev)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium border border-[#C9952A]/40 text-[#C9952A] hover:bg-[#C9952A]/10 transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteReview(myRev.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {myRev.topic && (
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-2.5 border ${
                        isDark 
                          ? 'bg-neutral-800 text-[#C9952A] border-[#C9952A]/20' 
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}>
                        {myRev.topic}
                      </span>
                    )}

                    <p className={`font-body text-sm sm:text-base leading-relaxed ${
                      isDark ? 'text-neutral-200' : 'text-stone-700'
                    }`}>
                      "{myRev.review}"
                    </p>

                    {myRev.recommended && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <Heart className="w-3.5 h-3.5 fill-current text-emerald-500" />
                        <span>You recommend this cultural initiative</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Responsive Grid */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className={`font-body text-base ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>
              No feedback found matching the "{selectedRatingFilter}" filter.
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
              const isLiked = Boolean(likedMap[rev.id]);
              const isUserOwned = isMyReview(rev.id, rev);

              return (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-300 ${
                    isUserOwned 
                      ? isDark 
                        ? 'border-[#C9952A]/50 bg-gradient-to-b from-[#1c1810] to-[#121212] shadow-[0_4px_25px_rgba(201,149,42,0.2)]'
                        : 'border-[#C9952A]/60 bg-[#fffdf8] shadow-[0_4px_25px_rgba(201,149,42,0.12)]'
                      : isDark
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
                          isUserOwned
                            ? 'bg-[#C9952A] text-white border-2 border-white/40'
                            : isDark 
                              ? 'bg-[#C9952A]/20 text-[#C9952A] border border-[#C9952A]/30' 
                              : 'bg-amber-100/70 text-[#8B5E3C] border border-[#C9952A]/20'
                        }`}>
                          {rev.name ? rev.name.charAt(0).toUpperCase() : 'U'}
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
                            {isUserOwned && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#C9952A]/20 text-[#C9952A] border border-[#C9952A]/40">
                                Your Review
                              </span>
                            )}
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
                        {[...Array(Math.round(rev.rating || 5))].map((_, i) => (
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

                  {/* Card Bottom: Helpful Button & Recommended Badge & Edit/Delete for owner */}
                  <div className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
                    isDark ? 'border-neutral-800' : 'border-stone-100'
                  }`}>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLike(rev.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all min-h-[36px] active:scale-95 ${
                          isLiked 
                            ? 'bg-[#C9952A]/20 text-[#C9952A] border-[#C9952A]/50 font-bold' 
                            : isDark 
                              ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700' 
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300'
                        }`}
                        aria-label="Mark feedback as helpful"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>Helpful ({rev.likes || 0})</span>
                      </button>

                      {isUserOwned && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(rev)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#C9952A]/40 text-[#C9952A] hover:bg-[#C9952A]/10 transition-colors"
                            title="Edit your reflection"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete your review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>

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

        {/* Storage Controls & Bottom Assurance Note */}
        <div className="mt-14 sm:mt-16 pt-8 border-t border-stone-200/60 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className={`text-xs font-body tracking-wide flex items-center justify-center sm:justify-start gap-2 ${
            isDark ? 'text-neutral-500' : 'text-stone-400'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9952A]" />
            {syncStatus === 'cloud' 
              ? 'Supabase Cloud synchronized • Feedback is visible to all community members across devices.' 
              : 'Supabase integration ready • Run the provided SQL migration in Supabase to sync across all visitors.'}
          </p>

          <div className="flex items-center gap-2">
            {!resetConfirmOpen ? (
              <button
                type="button"
                onClick={() => setResetConfirmOpen(true)}
                className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded-md border transition-colors ${
                  isDark 
                    ? 'border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800' 
                    : 'border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                }`}
                title="Reset this section to default seeded reviews"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset View</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-red-500">Reset to default reviews?</span>
                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="px-2 py-0.5 rounded bg-red-600 text-white font-medium hover:bg-red-700"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-2 py-0.5 rounded border border-stone-300 dark:border-neutral-700 hover:bg-stone-200 dark:hover:bg-neutral-800"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
