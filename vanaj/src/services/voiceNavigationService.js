// Voice Navigation, Control, and Speech Services for Vanaj
import { findProductByQuery, allMarketplaceItems } from '../data/marketplaceData';
import { resolveDistrictName, districtInfo } from '../data/districtInfo';

// Check Web Speech API availability
export function isSpeechRecognitionSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported() {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

// Check if a query is in Hindi (Devanagari script or Hinglish phonetics)
export function isHindiQuery(text) {
  if (!text) return false;
  // Check for Devanagari Unicode block U+0900 to U+097F
  if (/[\u0900-\u097F]/.test(text)) return true;
  // Check for comprehensive Hinglish transliterated words & grammar roots
  return /\b(kholo|khol\s*do|dikhao|dikha\s*do|chalao|chala\s*do|karo|kar\s*do|kardo|hatao|hata\s*do|jao|bhojan|nritya|nach|naksha|khana|madad|sahayata|chup|shant|bolna|piche|peeche|wapas|upar|niche|neeche|mere|mera|meri|kya|kyun|kaise|kitna|kitne|kul|anuvad|jharne|jharna|mandir|vanyajeev|gahne|gehne|kapde|kapda|mala|haar|aabhushan|karyashala|roko|rok\s*do|palto|palat|agla|dusra|doosra|santali|santhali|dhuska|bajao|band|nikal|dalo|batao|chahiye|hai|hain)\b/i.test(text);
}

// Create speech recognition instance with optimal settings (supports en-IN or hi-IN for native Hindi)
export function createSpeechRecognizer({ onResult, onEnd, onError, onStart, lang = 'en-IN' }) {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  // Selected recognition language: 'en-IN' (Indian English/Hinglish) or 'hi-IN' (Hindi)
  recognition.lang = lang || 'en-IN';

  recognition.onstart = () => {
    if (onStart) onStart();
  };

  recognition.onresult = (event) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }

    if (onResult) {
      onResult({
        interimTranscript: interim.trim(),
        finalTranscript: final.trim(),
        fullTranscript: (final + ' ' + interim).trim()
      });
    }
  };

  recognition.onerror = (event) => {
    if (onError) onError(event);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  return recognition;
}

// Helper to inspect cart in localStorage with bilingual Hindi & English support
export function getCartSummary(isHindi = false) {
  if (typeof window === 'undefined') return { count: 0, total: 0, items: [], text: isHindi ? 'आपकी शॉपिंग कार्ट अभी खाली है।' : 'Your cart is currently empty.' };
  try {
    const saved = localStorage.getItem('marketplace_cart');
    const cart = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(cart) || cart.length === 0) {
      return { count: 0, total: 0, items: [], text: isHindi ? 'आपकी शॉपिंग कार्ट अभी खाली है।' : 'Your cart is currently empty.' };
    }
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const total = cart.reduce((sum, item) => {
      const p = parseInt(String(item.discountPrice || item.price).replace(/[^\d]/g, ''), 10) || 0;
      return sum + p * (item.quantity || 1);
    }, 0);
    const names = cart.map(i => i.name).join(', ');
    return {
      count,
      total,
      items: cart,
      text: isHindi
        ? `आपकी कार्ट में ${count} वस्तुएं हैं: ${names}। कुल राशि ₹${total.toLocaleString('en-IN')} है।`
        : `You have ${count} item${count > 1 ? 's' : ''} in your cart: ${names}. Total is ₹${total.toLocaleString('en-IN')}.`
    };
  } catch {
    return { count: 0, total: 0, items: [], text: isHindi ? 'आपकी शॉपिंग कार्ट अभी खाली है।' : 'Your cart is currently empty.' };
  }
}

// Helper to remove an item from the cart in localStorage with target verification & bilingual replies
export function removeProductFromCart(itemKey = 'shirt', isHindi = false) {
  if (typeof window === 'undefined') return { success: false, reason: 'no_window', message: isHindi ? 'कार्ट अपडेट करने में असमर्थ।' : 'Unable to update cart.' };
  try {
    const saved = localStorage.getItem('marketplace_cart');
    const cart = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(cart) || cart.length === 0) {
      return { success: false, reason: 'empty', message: isHindi ? 'आपकी शॉपिंग कार्ट अभी खाली है।' : 'Your shopping cart is currently empty.' };
    }

    const cleanKey = itemKey.toLowerCase();
    const idx = cart.findIndex(i => {
      const name = (i.name || '').toLowerCase();
      const keywords = Array.isArray(i.keywords) ? i.keywords.join(' ').toLowerCase() : '';
      if (cleanKey.includes('shirt') && (/shirt|cloth|clothing|kurta|attire|saree/i.test(name) || i.category === 'Clothes')) {
        return true;
      }
      return name.includes(cleanKey) || keywords.includes(cleanKey) || cleanKey.includes(name);
    });

    if (idx === -1) {
      return { success: false, reason: 'not_found', message: isHindi ? `आपकी कार्ट में ${itemKey} नहीं मिला।` : `I couldn't find a ${itemKey} in your shopping cart.` };
    }

    const removedItem = cart[idx];
    cart.splice(idx, 1);
    localStorage.setItem('marketplace_cart', JSON.stringify(cart));
    return {
      success: true,
      removedItem,
      message: isHindi
        ? `${removedItem.name} को आपकी शॉपिंग कार्ट से हटा दिया गया है।`
        : `Removed ${removedItem.name} from your shopping cart.`
    };
  } catch (e) {
    return { success: false, reason: 'error', message: isHindi ? 'कार्ट अपडेट करने में त्रुटि।' : 'Could not update your shopping cart.' };
  }
}

// Send voice query to Gemini via serverless proxy (with full client fallback)
export async function sendVoiceQuery(query, currentRoute = '/') {
  try {
    const response = await fetch('/api/voice-navigate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, currentRoute })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('[VoiceNav API Response]', JSON.stringify(data, null, 2));

    // Dynamic enrichment on client if cart or target check requires client state
    const isHindi = isHindiQuery(query) || (typeof window !== 'undefined' && localStorage.getItem('vanaj_voice_lang') === 'hi-IN');
    if (data.action?.type === 'ADD_TO_CART' && !data.action.item) {
      data.action.item = findProductByQuery(data.action.itemKey || query);
    } else if (data.action?.type === 'WHAT_IN_CART') {
      const summary = getCartSummary(isHindi);
      data.reply = summary.count === 0 
        ? (isHindi ? 'आपकी शॉपिंग कार्ट अभी खाली है।' : 'Your shopping cart is currently empty.') 
        : (isHindi ? `आपकी कार्ट में ${summary.count} वस्तुएं हैं: ${summary.items.map(i => i.name).join(', ')}।` : `You have ${summary.count} item${summary.count > 1 ? 's' : ''} in your cart: ${summary.items.map(i => i.name).join(', ')}.`);
    } else if (data.action?.type === 'WHAT_IS_TOTAL') {
      const summary = getCartSummary(isHindi);
      data.reply = summary.count === 0
        ? (isHindi ? 'आपकी कार्ट अभी खाली है, इसलिए कुल राशि ₹0 है।' : 'Your cart is empty, so your total is ₹0.')
        : (isHindi ? `आपकी कुल राशि ₹${summary.total.toLocaleString('en-IN')} है (${summary.count} वस्तुएं)।` : `Your cart total is ₹${summary.total.toLocaleString('en-IN')} for ${summary.count} item${summary.count > 1 ? 's' : ''}.`);
    } else if (data.action?.type === 'REMOVE_FROM_CART') {
      const res = removeProductFromCart(data.action.itemKey || 'shirt', isHindi);
      data.reply = res.message;
      data.action.success = res.success;
      data.action.removedItem = res.removedItem;
    }

    return data;
  } catch (error) {
    console.warn('Voice navigation API failed or offline, using resilient client fallback:', error);
    const fallback = getClientFallback(query);
    console.log('[VoiceNav Fallback Response]', JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

// Master Action Dispatcher: executes site controls, state updates & navigation
export function executeVoiceAction(actionResult, navigate) {
  if (!actionResult) return;
  const { action, route } = actionResult;
  console.log('[executeVoiceAction] Called with action:', action?.type || 'NONE', 'target route:', route, 'current pathname:', typeof window !== 'undefined' ? window.location.pathname : '');

  if (action) {
    switch (action.type) {
      // --- GENERAL COMMANDS ---
      case 'GO_BACK': {
        if (typeof window !== 'undefined') {
          if (window.history.length > 1) {
            window.history.back();
          } else if (navigate) {
            navigate('/');
          }
        }
        return;
      }

      case 'SCROLL_DOWN': {
        if (typeof window !== 'undefined') {
          window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
        }
        return;
      }

      case 'SCROLL_UP': {
        if (typeof window !== 'undefined') {
          window.scrollBy({ top: -window.innerHeight * 0.75, behavior: 'smooth' });
        }
        return;
      }

      case 'GO_TO_TOP': {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      case 'SHOW_HELP': {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:show-help'));
        }
        return;
      }

      case 'STOP_TALKING': {
        stopCurrentAudio();
        return;
      }

      // --- DANCE COMMANDS ---
      case 'PLAY_DANCE': {
        const danceId = action.dance || 'ho';
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'PLAY_DANCE', dance: danceId }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:dance-action', { detail: { action: 'PLAY', dance: danceId } }));
        }
        if (navigate) {
          navigate(route || `/dance?dance=${encodeURIComponent(danceId)}`);
        }
        return;
      }

      case 'PAUSE_VIDEO': {
        if (typeof window !== 'undefined') {
          const videoEl = document.querySelector('video');
          const isDancePage = window.location.pathname === '/dance';
          if (!isDancePage && !videoEl) {
            // Target does not exist
            actionResult.reply = 'No dance video is currently playing.';
          } else {
            window.dispatchEvent(new CustomEvent('vanaj:dance-action', { detail: { action: 'PAUSE' } }));
          }
        }
        return;
      }

      case 'CLOSE_VIDEO': {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:dance-action', { detail: { action: 'CLOSE' } }));
        }
        return;
      }

      case 'NEXT_DANCE': {
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'NEXT_DANCE' }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:dance-action', { detail: { action: 'NEXT' } }));
        }
        if (navigate) {
          navigate(route || '/dance');
        }
        return;
      }

      // --- FOOD COMMANDS ---
      case 'FILTER_FOOD_TRIBE': {
        const tribe = action.tribe || 'Santhali';
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'FILTER_FOOD_TRIBE', tribe }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:food-filter-tribe', { detail: { tribe } }));
        }
        if (navigate) {
          navigate(route || `/food?tribe=${encodeURIComponent(tribe)}`);
        }
        return;
      }

      case 'SELECT_FOOD': {
        const dish = action.dish || 'Dhuska';
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'SELECT_FOOD', dish }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:select-dish', { detail: { dish } }));
        }
        if (navigate) {
          navigate(route || `/food?dish=${encodeURIComponent(dish)}`);
        }
        return;
      }

      // --- LANGUAGES COMMANDS ---
      case 'OPEN_FLASHCARDS': {
        const language = action.language || 'Santali';
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'OPEN_FLASHCARDS', language }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:flashcards-action', { detail: { action: 'OPEN', language } }));
        }
        if (navigate) {
          navigate(route || `/languages?section=flashcards&lang=${encodeURIComponent(language)}`);
        }
        return;
      }

      case 'FLIP_CARD': {
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'FLIP_CARD' }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:flashcards-action', { detail: { action: 'FLIP' } }));
        }
        if (navigate && typeof window !== 'undefined' && window.location.pathname !== '/languages') {
          navigate('/languages?section=flashcards');
        }
        return;
      }

      case 'NEXT_CARD': {
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'NEXT_CARD' }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:flashcards-action', { detail: { action: 'NEXT' } }));
        }
        if (navigate && typeof window !== 'undefined' && window.location.pathname !== '/languages') {
          navigate('/languages?section=flashcards');
        }
        return;
      }

      case 'TRANSLATE': {
        const word = action.word || 'water';
        const language = action.language || 'Santali';
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'TRANSLATE', word, language }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:translate-action', { detail: { word, language } }));
        }
        if (navigate) {
          navigate(route || `/languages?translate=true&word=${encodeURIComponent(word)}&lang=${encodeURIComponent(language)}`);
        }
        return;
      }

      // --- TOURISM COMMANDS ---
      case 'FILTER_TOURISM': {
        const filter = action.filter || 'Waterfall';
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'FILTER_TOURISM', filter }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:tourism-filter', { detail: { filter } }));
        }
        if (navigate) {
          navigate(route || `/tourism?filter=${encodeURIComponent(filter)}`);
        }
        return;
      }

      case 'SEARCH_TOURISM': {
        const queryText = action.query || '';
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'SEARCH_TOURISM', query: queryText }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:tourism-search', { detail: { query: queryText } }));
        }
        if (navigate) {
          navigate(route || `/tourism?search=${encodeURIComponent(queryText)}`);
        }
        return;
      }

      case 'SHOW_WORKSHOPS': {
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'SHOW_WORKSHOPS' }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:tourism-section', { detail: { section: 'workshops' } }));
        }
        if (navigate) {
          navigate(route || '/tourism?section=workshops');
        }
        return;
      }

      case 'OPEN_HOST_WORKSHOP': {
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'OPEN_HOST_WORKSHOP' }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:tourism-section', { detail: { section: 'host-workshop' } }));
        }
        if (navigate) {
          navigate(route || '/tourism?section=host-workshop');
        }
        return;
      }

      // --- MARKETPLACE COMMANDS ---
      case 'SWITCH_TAB': {
        const tab = action.tab || 'Clothes';
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'SWITCH_TAB', tab }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:marketplace-tab', { detail: { tab } }));
        }
        if (navigate) {
          navigate(route || `/marketplace?tab=${encodeURIComponent(tab)}`);
        }
        return;
      }

      case 'WHAT_IN_CART':
      case 'WHAT_IS_TOTAL': {
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'OPEN_CART' }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:cart-action', { detail: { action: 'OPEN' } }));
        }
        if (navigate) {
          navigate(route || '/marketplace?openCart=true');
        }
        return;
      }

      case 'REMOVE_FROM_CART': {
        const itemKey = action.itemKey || 'shirt';
        const isHindi = isHindiQuery(actionResult?.reply) || (typeof window !== 'undefined' && localStorage.getItem('vanaj_voice_lang') === 'hi-IN');
        const res = removeProductFromCart(itemKey, isHindi);
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'REMOVE_FROM_CART', itemKey }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:cart-action', { detail: { action: 'REMOVE', itemKey, item: res.removedItem } }));
        }
        if (navigate) {
          navigate(route || '/marketplace?openCart=true');
        }
        return;
      }

      case 'ADD_TO_CART': {
        const itemToAdd = action.item || findProductByQuery(action.itemKey || 'shirt');
        try {
          const savedCart = localStorage.getItem('marketplace_cart');
          const cart = savedCart ? JSON.parse(savedCart) : [];
          const existing = Array.isArray(cart) ? cart.find(i => i.id === itemToAdd.id && i.name === itemToAdd.name) : null;
          let updatedCart;
          if (existing) {
            updatedCart = cart.map(i => (i.id === itemToAdd.id && i.name === itemToAdd.name) ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
          } else {
            updatedCart = [...(Array.isArray(cart) ? cart : []), { ...itemToAdd, quantity: 1 }];
          }
          localStorage.setItem('marketplace_cart', JSON.stringify(updatedCart));
        } catch (e) {
          console.warn('Could not write to localStorage cart:', e);
        }

        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'ADD_TO_CART', item: itemToAdd }));
        } catch {}

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:cart-action', { detail: { action: 'ADD', item: itemToAdd } }));
        }

        if (navigate) {
          navigate(route || '/marketplace?openCart=true');
        }
        return;
      }

      case 'OPEN_CART': {
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'OPEN_CART' }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:cart-action', { detail: { action: 'OPEN' } }));
        }
        if (navigate) {
          navigate(route || '/marketplace?openCart=true');
        }
        return;
      }

      case 'CHECKOUT': {
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'CHECKOUT' }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:cart-action', { detail: { action: 'CHECKOUT' } }));
        }
        if (navigate) {
          navigate(route || '/marketplace?checkout=true');
        }
        return;
      }

      case 'CLEAR_CART': {
        try {
          localStorage.setItem('marketplace_cart', JSON.stringify([]));
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'CLEAR_CART' }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:cart-action', { detail: { action: 'CLEAR' } }));
        }
        if (navigate) {
          navigate(route || '/marketplace?openCart=true');
        }
        return;
      }

      case 'SELECT_DISTRICT': {
        const district = action.district || 'Ranchi';
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'SELECT_DISTRICT', district }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:select-district', { detail: { district } }));
        }
        if (navigate) {
          navigate(route || `/languages?district=${encodeURIComponent(district)}`);
        }
        return;
      }

      case 'OPEN_MAP': {
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'OPEN_MAP' }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:open-map'));
        }
        if (navigate) {
          navigate(route || '/languages?map=true');
        }
        return;
      }

      case 'PLAY_MUSIC': {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:mandar-music', { detail: { play: true } }));
        }
        if (navigate) {
          navigate(route || '/languages?playMusic=true');
        }
        return;
      }

      case 'STOP_MUSIC': {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:mandar-music', { detail: { play: false } }));
        }
        return;
      }

      case 'SELECT_SPOT': {
        const spot = action.spot;
        try {
          sessionStorage.setItem('vanaj_pending_action', JSON.stringify({ type: 'SELECT_SPOT', spot }));
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vanaj:select-spot', { detail: { spot } }));
        }
        if (navigate) {
          navigate(route || `/tourism?spot=${encodeURIComponent(spot)}`);
        }
        return;
      }

      default:
        break;
    }
  }

  // General route navigation fallback
  if (route && navigate) {
    navigate(route);
  }
}

// Client fallback intent matcher with complete action execution capability
export function getClientFallback(query) {
  const clean = (query || '').toLowerCase().trim();
  const isHindi = isHindiQuery(clean);

  // 1. GENERAL COMMANDS
  // Go back
  if (/(go\s+back|previous\s+page|navigate\s+back|पीछे\s*जाओ|वापस\s*जाओ|वापस\s*चलो|piche\s*jao|peeche\s*jao|wapas\s*jao|back\s*jao|peeche\s*chalo|piche\s*chalo|wapas\s*chalo|peeche\s*karo|piche\s*karo)/i.test(clean)) {
    return {
      route: null,
      reply: isHindi ? 'पिछले पृष्ठ पर वापस जा रहे हैं।' : 'Going back to the previous page.',
      action: { type: 'GO_BACK' },
      category: isHindi ? 'General - Hindi Go Back' : 'General - Go Back',
      source: 'client_fallback'
    };
  }

  // Scroll down
  if (/(scroll\s+down|page\s+down|नीचे\s*जाओ|नीचे\s*स्क्रॉल\s*करो|नीचे\s*करो|neeche\s*jao|niche\s*jao|niche\s*scroll|neeche\s*scroll|niche\s*karo|neeche\s*karo|scroll\s*down\s*karo)/i.test(clean)) {
    return {
      route: null,
      reply: isHindi ? 'नीचे स्क्रॉल कर रहा हूँ।' : 'Scrolling down.',
      action: { type: 'SCROLL_DOWN' },
      category: isHindi ? 'General - Hindi Scroll Down' : 'General - Scroll Down',
      source: 'client_fallback'
    };
  }

  // Scroll up
  if (/(scroll\s+up|page\s+up|ऊपर\s*जाओ|ऊपर\s*स्क्रॉल\s*करो|ऊपर\s*करो|upar\s*jao|upar\s*scroll|upar\s*karo|scroll\s*up\s*karo)/i.test(clean)) {
    return {
      route: null,
      reply: isHindi ? 'ऊपर स्क्रॉल कर रहा हूँ।' : 'Scrolling up.',
      action: { type: 'SCROLL_UP' },
      category: isHindi ? 'General - Hindi Scroll Up' : 'General - Scroll Up',
      source: 'client_fallback'
    };
  }

  // Go to top
  if (/(go\s+to\s+top|scroll\s+to\s+top|back\s+to\s+top|to\s+the\s+top|सबसे\s*ऊपर\s*जाओ|शुरुआत\s*में\s*जाओ|शीर्ष\s*पर\s*जाओ|sabse\s*upar\s*jao|top\s*pe\s*jao|top\s*par\s*jao|shuruat\s*me\s*jao|ekdum\s*upar\s*jao)/i.test(clean)) {
    return {
      route: null,
      reply: isHindi ? 'पृष्ठ के सबसे ऊपर जा रहे हैं।' : 'Scrolling to the top of the page.',
      action: { type: 'GO_TO_TOP' },
      category: isHindi ? 'General - Hindi Go to Top' : 'General - Go to Top',
      source: 'client_fallback'
    };
  }

  // Help / What can you do
  if (/(help|what\s+can\s+you\s+do|show\s+help|list\s+commands|commands|मदद|सहायता|मदद\s*करो|आप\s*क्या\s*कर\s*सकते\s*हैं|कमांड\s*बताओ|क्या\s*कर\s*सकते\s*हो|madad|sahayata|madad\s*karo|madad\s*chahiye|help\s*karo|help\s*chahiye|kya\s*kar\s*sakte\s*ho|tum\s*kya\s*kar\s*sakte\s*ho|kya\s*kya\s*kar\s*sakte\s*ho|commands\s*batao)/i.test(clean)) {
    return {
      route: null,
      reply: isHindi
        ? "आप ये कमांड्स बोल सकते हैं: 'हो नृत्य चलाओ', 'धुस्का दिखाओ', 'संथाली फ्लैशकार्ड', 'मेरे कार्ट में क्या है', या 'झारखंड का नक्शा खोलो'।"
        : "Here are some things you can ask: open Jharkhand map, play Ho dance, show Dhuska, translate water to Santali, or view cart.",
      action: { type: 'SHOW_HELP' },
      category: isHindi ? 'Help - Hindi' : 'Help',
      source: 'client_fallback'
    };
  }

  // Stop talking / be quiet
  if (/(stop\s+talking|be\s+quiet|shut\s+up|silence|mute|चुप\s*रहो|चुप\s*हो\s*जाओ|बोलना\s*बंद\s*करो|शांत\s*रहो|आवाज\s*बंद\s*करो|रुको|chup\s*raho|chup\s*ho\s*jao|bolna\s*band\s*karo|shant\s*raho|awaz\s*band\s*karo|aawaz\s*band\s*karo|kuch\s*mat\s*bolo|mute\s*karo|chup\s*karo)/i.test(clean)) {
    stopCurrentAudio();
    return {
      route: null,
      reply: isHindi ? 'बोलना बंद कर दिया गया है।' : 'Spoken reply stopped.',
      action: { type: 'STOP_TALKING' },
      category: isHindi ? 'General - Hindi Silence' : 'General - Silence',
      source: 'client_fallback'
    };
  }

  // 2. DANCE COMMANDS
  // Play Ho dance
  if (/(play\s+(the\s+)?ho\s+dance|watch\s+ho\s+dance|हो\s*नृत्य\s*चलाओ|हो\s*डांस\s*चलाओ|हो\s*नाच\s*चलाओ|हो\s*नृत्य|हो\s*डांस|ho\s*dance\s*chalao|ho\s*dance\s*play\s*karo|ho\s*dance\s*lagao|ho\s*dance\s*dikhao|ho\s*nritya\s*chalao|ho\s*nach\s*chalao|ho\s*wala\s*dance|ho\s*dance)/i.test(clean)) {
    return {
      route: '/dance?dance=ho',
      reply: isHindi ? 'पश्चिमी सिंहभूम का पारंपरिक हो लोक नृत्य चला रहा हूँ।' : 'Playing the Ho folk dance of West Singhbhum.',
      action: { type: 'PLAY_DANCE', dance: 'ho' },
      category: isHindi ? 'Dance - Hindi Play Ho' : 'Dance - Play Ho',
      source: 'client_fallback'
    };
  }

  // Pause video
  if (/(pause\s+(the\s+)?video|pause\s+dance|वीडियो\s*रोको|वीडियो\s*पॉज़\s*करो|पॉज़\s*करो|रोक\s*दो|नृत्य\s*रोको|video\s*roko|video\s*rok\s*do|video\s*pause\s*karo|pause\s*karo|pause\s*kardo|dance\s*roko)/i.test(clean)) {
    let reply = isHindi ? 'नृत्य वीडियो रोक दिया गया है।' : 'Pausing the dance video.';
    if (typeof window !== 'undefined') {
      const videoEl = document.querySelector('video');
      const isDancePage = window.location.pathname === '/dance';
      if (!isDancePage && !videoEl) {
        reply = isHindi ? 'इस समय कोई नृत्य वीडियो नहीं चल रहा है।' : 'No dance video is currently playing.';
      }
    }
    return {
      route: null,
      reply,
      action: { type: 'PAUSE_VIDEO' },
      category: isHindi ? 'Dance - Hindi Pause' : 'Dance - Pause',
      source: 'client_fallback'
    };
  }

  // Close video
  if (/(close\s+(the\s+)?video|close\s+dance|exit\s+video|वीडियो\s*बंद\s*करो|डांस\s*बंद\s*करो|वीडियो\s*हटाओ|बंद\s*करो|video\s*band\s*karo|video\s*close\s*karo|dance\s*band\s*karo|video\s*hatao|close\s*kardo|band\s*kar\s*do)/i.test(clean)) {
    let reply = isHindi ? 'नृत्य वीडियो बंद कर रहा हूँ।' : 'Closing the dance video.';
    if (typeof window !== 'undefined') {
      const isDancePage = window.location.pathname === '/dance';
      const videoEl = document.querySelector('video');
      if (!isDancePage && !videoEl) {
        reply = isHindi ? 'इस समय कोई नृत्य वीडियो नहीं खुला है।' : 'No dance video is currently open.';
      }
    }
    return {
      route: null,
      reply,
      action: { type: 'CLOSE_VIDEO' },
      category: isHindi ? 'Dance - Hindi Close' : 'Dance - Close',
      source: 'client_fallback'
    };
  }

  // Next dance
  if (/(next\s+dance|next\s+video|another\s+dance|अगला\s*नृत्य|अगला\s*डांस|अगला\s*नाच|दूसरा\s*डांस|agla\s*dance|agla\s*nritya|dusra\s*dance|doosra\s*dance|next\s*dance\s*dikhao|agla\s*video)/i.test(clean)) {
    return {
      route: '/dance',
      reply: isHindi ? 'अगला जनजातीय नृत्य दिखा रहा हूँ।' : 'Showing the next tribal dance.',
      action: { type: 'NEXT_DANCE' },
      category: isHindi ? 'Dance - Hindi Next' : 'Dance - Next',
      source: 'client_fallback'
    };
  }

  // Specific other dances
  if (/ho\s+dance/i.test(clean)) {
    return {
      route: '/dance?dance=ho',
      reply: 'Opening the Ho folk dance of West Singhbhum.',
      action: { type: 'PLAY_DANCE', dance: 'ho' },
      category: 'Dance - Ho',
      source: 'client_fallback'
    };
  }
  if (/oraon\s+dance|उरांव\s*नृत्य|उरांव\s*डांस|oraon\s*nritya/i.test(clean)) {
    return {
      route: '/dance?dance=oraon',
      reply: isHindi ? 'उरांव जनजाति का लोक नृत्य चला रहा हूँ।' : 'Opening the vibrant Oraon folk dance.',
      action: { type: 'PLAY_DANCE', dance: 'oraon' },
      category: 'Dance - Oraon',
      source: 'client_fallback'
    };
  }
  if (/asur\s+dance|असुर\s*नृत्य/i.test(clean)) {
    return {
      route: '/dance?dance=asur',
      reply: isHindi ? 'असुर जनजाति का पारंपरिक नृत्य दिखा रहा हूँ।' : 'Opening the Asur folk dance celebrating tribal traditions.',
      action: { type: 'PLAY_DANCE', dance: 'asur' },
      category: 'Dance - Asur',
      source: 'client_fallback'
    };
  }
  if (/kharia\s+dance|खड़िया\s*नृत्य/i.test(clean)) {
    return {
      route: '/dance?dance=kharia',
      reply: isHindi ? 'खड़िया जनजाति का फसल नृत्य खोल रहा हूँ।' : 'Opening the harvest dance of the Kharia tribe.',
      action: { type: 'PLAY_DANCE', dance: 'kharia' },
      category: 'Dance - Kharia',
      source: 'client_fallback'
    };
  }
  if (/(santali|santhali)\s+dance|संथाली\s*नृत्य|संथाली\s*डांस/i.test(clean)) {
    return {
      route: '/dance?dance=santhali',
      reply: isHindi ? 'संथाल परगना का प्रामाणिक संथाली लोक नृत्य दिखा रहा हूँ।' : 'Showing you the authentic Santhali folk dance from Santhal Pargana.',
      action: { type: 'PLAY_DANCE', dance: 'santhali' },
      category: 'Dance - Santhali',
      source: 'client_fallback'
    };
  }
  if (/dance|नाच|नृत्य/i.test(clean)) {
    return {
      route: '/dance',
      reply: isHindi ? 'झारखंड के पारंपरिक लोक नृत्य खोल रहा हूँ।' : 'Opening the sacred dances of Jharkhand.',
      category: 'Dance',
      source: 'client_fallback'
    };
  }

  // 3. FOOD COMMANDS
  // Food from Santhali tribe (filter by tribe)
  if (/((show\s+)?food\s+from\s+(the\s+)?santhal(i)?\s+tribe|filter\s+(food\s+)?by\s+santhal(i)?|संथाली\s*(जनजाति\s*का\s*)?(भोजन|खाना|व्यंजन)|santhali\s*khana|santhali\s*food\s*dikhao|santhali\s*khana\s*dikhao|santhal\s*ka\s*khana|santhali\s*bhojan)/i.test(clean)) {
    return {
      route: '/food?tribe=Santhali',
      reply: isHindi ? 'संथाली जनजाति के पारंपरिक व्यंजन दिखा रहा हूँ।' : 'Showing traditional dishes from the Santhali tribe.',
      action: { type: 'FILTER_FOOD_TRIBE', tribe: 'Santhali' },
      category: isHindi ? 'Food - Hindi Santhali' : 'Food - Santhali Tribe',
      source: 'client_fallback'
    };
  }

  // Show Dhuska
  if (/((show|open|view)?\s*dhuska|धुस्का\s*(दिखाओ|खोलो)?|धुस्का\s*की\s*रेसिपी|धुस्का|dhuska\s*dikhao|dhuska\s*kholo|dhuska\s*recipe|dhuska\s*ki\s*recipe|dhuska\s*kaise\s*banta\s*hai|dhuska\s*dikha\s*do|dhuska\s*banao)/i.test(clean)) {
    return {
      route: '/food?dish=Dhuska',
      reply: isHindi ? 'झारखंड का प्रसिद्ध व्यंजन धुस्का दिखा रहा हूँ।' : 'Showing Dhuska, Jharkhand’s festive fried rice and lentil delicacy.',
      action: { type: 'SELECT_FOOD', dish: 'Dhuska' },
      category: isHindi ? 'Food - Hindi Dhuska' : 'Food - Dhuska',
      source: 'client_fallback'
    };
  }

  // Other traditional dishes
  if (/(chilka\s+roti|rugra|rugda|red\s+ant|jil\s+pitha|lapa\s+lapa|mandia\s+pej|da\s+mani|thali|चिल्का\s*रोटी|रुगड़ा)/i.test(clean)) {
    let dish = 'Dhuska';
    if (/chilka/i.test(clean)) dish = 'Chilka Roti';
    else if (/rugra|rugda/i.test(clean)) dish = 'Rugra';
    else if (/red\s+ant/i.test(clean)) dish = 'Red Ant Chutney';
    else if (/jil\s+pitha/i.test(clean)) dish = 'JIL Pitha';
    else if (/lapa/i.test(clean)) dish = 'Lapa Lapa';
    else if (/mandia/i.test(clean)) dish = 'Mandia Pej';
    else if (/thali/i.test(clean)) dish = 'Santhali Thali';

    return {
      route: `/food?dish=${encodeURIComponent(dish)}`,
      reply: isHindi ? `पारंपरिक व्यंजन ${dish} की रेसिपी और इतिहास दिखा रहा हूँ।` : `Opening recipe and cultural heritage of ${dish}.`,
      action: { type: 'SELECT_FOOD', dish },
      category: `Food - ${dish}`,
      source: 'client_fallback'
    };
  }

  if (/food|dish|cuisine|recipe|eat|भोजन|खाना|व्यंजन|पकवान/i.test(clean)) {
    return {
      route: '/food',
      reply: isHindi ? 'पारंपरिक जनजातीय भोजन और व्यंजन खोल रहा हूँ।' : 'Opening tribal culinary heritage and traditional indigenous recipes.',
      category: 'Food',
      source: 'client_fallback'
    };
  }

  // 4. LANGUAGES & FLASHCARDS & TRANSLATOR
  // Open flashcards for Santali
  if (/(open\s+flashcards\s+for\s+santali|santali\s+flashcards|show\s+flashcards\s+for\s+santali|संथाली\s*फ्लैशकार्ड|santali\s*flashcards?\s*kholo|santhali\s*flashcard\s*dikhao|santali\s*flashcards?\s*dikha\s*do)/i.test(clean)) {
    return {
      route: '/languages?section=flashcards&lang=Santali',
      reply: isHindi ? 'संथाली भाषा के फ्लैशकार्ड खोल रहा हूँ।' : 'Opening Santali language flashcards.',
      action: { type: 'OPEN_FLASHCARDS', language: 'Santali' },
      category: isHindi ? 'Languages - Hindi Flashcards' : 'Languages - Flashcards',
      source: 'client_fallback'
    };
  }

  if (/(flip\s+(the\s+)?card|turn\s+(the\s+)?card|कार्ड\s*पलटो|कार्ड\s*उलटो|पलटो|card\s*palto|card\s*palat\s*do|card\s*flip\s*karo|card\s*flip\s*kardo|card\s*ulto|card\s*ghumao|flip\s*kardo)/i.test(clean)) {
    return {
      route: '/languages',
      reply: isHindi ? 'फ्लैशकार्ड पलट दिया गया है।' : 'Flipped the flashcard.',
      action: { type: 'FLIP_CARD' },
      category: isHindi ? 'Languages - Hindi Flip Card' : 'Languages - Flip Card',
      source: 'client_fallback'
    };
  }

  if (/(next\s+card|next\s+flashcard|another\s+card|अगला\s*कार्ड|अगला\s*फ्लैशकार्ड|दूसरा\s*कार्ड|agla\s*card|agla\s*flashcard|dusra\s*card|doosra\s*card|next\s*card\s*dikhao|agla\s*card\s*dikhao)/i.test(clean)) {
    return {
      route: '/languages',
      reply: isHindi ? 'अगला फ्लैशकार्ड दिखा रहा हूँ।' : 'Showing the next flashcard.',
      action: { type: 'NEXT_CARD' },
      category: isHindi ? 'Languages - Hindi Next Card' : 'Languages - Next Card',
      source: 'client_fallback'
    };
  }

  // Translate water to Santali (or other tribal translations)
  if (/(translate\s+water\s+to\s+santh?ali|पानी\s*(का\s*)?संथाली\s*(में\s*)?अनुवाद|पानी\s*को\s*संथाली\s*में|paani\s*ka\s*santali\s*anuvad|paani\s*ko\s*santali\s*me|water\s*ka\s*santali\s*translation|water\s*translate\s*karo\s*santali|translate\s*paani\s*to\s*santali|pani\s*ka\s*santali\s*anuvad|pani\s*ko\s*santali)/i.test(clean)) {
    return {
      route: '/languages?translate=true&word=water&lang=Santali',
      reply: isHindi ? 'संथाली में पानी को दाः (Ol Chiki: ᱫᱟᱜ) कहते हैं।' : "In Santali, water is Daah (written in Ol Chiki script as ᱫᱟᱜ).",
      action: { type: 'TRANSLATE', word: 'water', language: 'Santali' },
      category: isHindi ? 'Languages - Hindi Translate' : 'Languages - Translate',
      source: 'client_fallback'
    };
  }

  const translateMatch = clean.match(/translate\s+([a-zA-Z\s]+)\s+to\s+(santali|mundari|ho|kurukh|kharia|khortha)/i);
  if (translateMatch) {
    const word = translateMatch[1].trim();
    const lang = translateMatch[2].charAt(0).toUpperCase() + translateMatch[2].slice(1).toLowerCase();
    return {
      route: `/languages?translate=true&word=${encodeURIComponent(word)}&lang=${encodeURIComponent(lang)}`,
      reply: `Translating "${word}" to ${lang}.`,
      action: { type: 'TRANSLATE', word, language: lang },
      category: `Languages - Translate ${lang}`,
      source: 'client_fallback'
    };
  }

  // 5. TOURISM COMMANDS
  // Specific Tourism Filters
  if (/(show\s+temples?|filter\s+(by\s+)?temples?|मंदिर\s*(दिखाओ|खोलो)?|धार्मिक\s*स्थल|mandir\s*dikhao|mandir\s*kholo|temples\s*dikhao|mandir\s*filter\s*karo|sare\s*mandir\s*dikhao|dharmik\s*sthal\s*dikhao|mandir\s*dikha\s*do)/i.test(clean)) {
    return {
      route: '/tourism?filter=Temple',
      reply: isHindi ? 'धार्मिक और ऐतिहासिक मंदिर दिखा रहा हूँ।' : 'Showing sacred temples and heritage shrines in tourism.',
      action: { type: 'FILTER_TOURISM', filter: 'Temple' },
      category: isHindi ? 'Tourism - Hindi Temples' : 'Tourism - Temples',
      source: 'client_fallback'
    };
  }

  if (/(show\s+waterfalls?|filter\s+(by\s+)?waterfalls?|झरने\s*(दिखाओ|खोलो)?|जलप्रपात\s*(दिखाओ|खोलो)?|jharne\s*dikhao|jharne\s*kholo|waterfalls\s*dikhao|jharna\s*dikhao|waterfall\s*dikhao|jalprapat\s*dikhao|jharne\s*dikha\s*do)/i.test(clean)) {
    return {
      route: '/tourism?filter=Waterfall',
      reply: isHindi ? 'झारखंड के खूबसूरत झरने दिखा रहा हूँ।' : 'Showing scenic waterfalls of Jharkhand in tourism.',
      action: { type: 'FILTER_TOURISM', filter: 'Waterfall' },
      category: isHindi ? 'Tourism - Hindi Waterfalls' : 'Tourism - Waterfalls',
      source: 'client_fallback'
    };
  }

  if (/(show\s+wildlife|filter\s+(by\s+)?wildlife|show\s+animals?|वन्यजीव\s*(दिखाओ|खोलो)?|जंगल\s*(दिखाओ|खोलो)?|अभयारण्य|vanyajeev\s*dikhao|wildlife\s*dikhao|janwar\s*dikhao|animals\s*dikhao|jungle\s*dikhao|sanctuary\s*dikhao|national\s*park\s*dikhao|vanyajeev\s*dikha\s*do)/i.test(clean)) {
    return {
      route: '/tourism?filter=Wildlife',
      reply: isHindi ? 'वन्यजीव अभयारण्य और राष्ट्रीय उद्यान दिखा रहा हूँ।' : 'Showing wildlife sanctuaries and national parks in tourism.',
      action: { type: 'FILTER_TOURISM', filter: 'Wildlife' },
      category: isHindi ? 'Tourism - Hindi Wildlife' : 'Tourism - Wildlife',
      source: 'client_fallback'
    };
  }

  // Search Netarhat
  if (/(search\s+(for\s+)?netarhat|find\s+netarhat|नेतरहाट\s*(खोजो|ढूंढो|दिखाओ)?|netarhat\s*khojo|netarhat\s*search\s*karo|netarhat\s*dikhao|netarhat\s*dhundo|netarhat\s*dhoondho|netarhat\s*kahan\s*hai|netarhat\s*dikha\s*do)/i.test(clean)) {
    return {
      route: '/tourism?search=Netarhat',
      reply: isHindi ? 'पर्यटन में नेतरहाट खोज रहा हूँ।' : 'Searching for Netarhat in tourism destinations.',
      action: { type: 'SEARCH_TOURISM', query: 'Netarhat' },
      category: isHindi ? 'Tourism - Hindi Search' : 'Tourism - Search',
      source: 'client_fallback'
    };
  }

  // Show workshops
  if (/(show\s+workshops?|view\s+workshops?|artisan\s+workshops?|कार्यशालाएं\s*दिखाओ|कार्यशाला\s*दिखाओ|वर्कशॉप\s*दिखाओ|karyashala\s*dikhao|karyashalaen\s*dikhao|workshops\s*dikhao|workshop\s*dikhao|artisan\s*workshops\s*dikhao|workshop\s*dikha\s*do)/i.test(clean)) {
    return {
      route: '/tourism?section=workshops',
      reply: isHindi ? 'कारीगरों की सांस्कृतिक कार्यशालाएं दिखा रहा हूँ।' : 'Showing artisan cultural immersion workshops.',
      action: { type: 'SHOW_WORKSHOPS' },
      category: isHindi ? 'Tourism - Hindi Workshops' : 'Tourism - Workshops',
      source: 'client_fallback'
    };
  }

  // Host a workshop form
  if (/(open\s+(the\s+)?host\s+a\s+workshop\s+form|host\s+a\s+workshop(\s+form)?|कार्यशाला\s*का\s*फॉर्म|वर्कशॉप\s*फॉर्म|workshop\s*form|workshop\s*form\s*kholo|host\s*a\s*workshop\s*form\s*kholo|karyashala\s*form\s*kholo|workshop\s*ka\s*form\s*kholo|workshop\s*host\s*karna\s*hai)/i.test(clean)) {
    return {
      route: '/tourism?section=host-workshop',
      reply: isHindi ? 'कार्यशाला आयोजित करने का प्रस्ताव फॉर्म खोल रहा हूँ।' : 'Opening the host a workshop proposal form.',
      action: { type: 'OPEN_HOST_WORKSHOP' },
      category: isHindi ? 'Tourism - Hindi Host Workshop' : 'Tourism - Host Workshop',
      source: 'client_fallback'
    };
  }

  // Specific tourism destinations
  if (/(hundru|jonha|dassam|lodh|panchghagh|betla|patratu|netarhat|baidyanath|dimna|tilaiya|maluti|navratangarh)/i.test(clean)) {
    let spot = 'Hundru Falls';
    if (/jonha/i.test(clean)) spot = 'Jonha Falls';
    else if (/dassam/i.test(clean)) spot = 'Dassam Falls';
    else if (/lodh/i.test(clean)) spot = 'Lodh Falls';
    else if (/panchghagh/i.test(clean)) spot = 'Panchghagh Falls';
    else if (/betla/i.test(clean)) spot = 'Betla National Park';
    else if (/patratu/i.test(clean)) spot = 'Patratu Valley';
    else if (/netarhat/i.test(clean)) spot = 'Netarhat';
    else if (/baidyanath/i.test(clean)) spot = 'Baidyanath Temple';
    else if (/dimna/i.test(clean)) spot = 'Dimna Lake';
    else if (/maluti/i.test(clean)) spot = 'Maluti Temples';
    else if (/navratangarh/i.test(clean)) spot = 'Navratangarh Fort';

    return {
      route: `/tourism?spot=${encodeURIComponent(spot)}`,
      reply: isHindi ? `${spot} की जानकारी और मानचित्र खोल रहा हूँ।` : `Showing ${spot} with interactive location map and visit guide.`,
      action: { type: 'SELECT_SPOT', spot },
      category: `Tourism - ${spot}`,
      source: 'client_fallback'
    };
  }

  if (/tourism|travel|places|destinations|पर्यटन|घूमने/i.test(clean)) {
    return {
      route: '/tourism',
      reply: isHindi ? 'झारखंड के पर्यटन स्थल और कार्यशालाएं खोल रहा हूँ।' : 'Opening cultural tourism and artisan workshops in Jharkhand.',
      category: 'Tourism',
      source: 'client_fallback'
    };
  }

  // 6. MARKETPLACE COMMANDS
  // Switch Tabs
  if (/(show\s+ornaments|switch\s+to\s+ornaments|open\s+ornaments(\s+tab)?|गहने\s*(दिखाओ|खोलो)?|आभूषण\s*(दिखाओ|खोलो)?|gahne\s*dikhao|gehne\s*dikhao|aabhushan\s*dikhao|ornaments\s*dikhao|jewelry\s*dikhao|gahna\s*dikhao|gehne\s*kholo|gahne\s*dikha\s*do)/i.test(clean)) {
    return {
      route: '/marketplace?tab=Ornaments',
      reply: isHindi ? 'हस्तनिर्मित पारंपरिक गहने दिखा रहा हूँ।' : 'Showing handcrafted tribal ornaments in the marketplace.',
      action: { type: 'SWITCH_TAB', tab: 'Ornaments' },
      category: isHindi ? 'Marketplace - Hindi Ornaments' : 'Marketplace - Ornaments',
      source: 'client_fallback'
    };
  }

  if (/(show\s+clothes|switch\s+to\s+clothes|open\s+clothes(\s+tab)?|कपड़े\s*(दिखाओ|खोलो)?|वस्त्र\s*(दिखाओ|खोलो)?|kapde\s*dikhao|kapda\s*dikhao|clothes\s*dikhao|vastra\s*dikhao|poshak\s*dikhao|kapde\s*kholo|kapde\s*dikha\s*do)/i.test(clean)) {
    return {
      route: '/marketplace?tab=Clothes',
      reply: isHindi ? 'पारंपरिक हथकरघा वस्त्र दिखा रहा हूँ।' : 'Showing handwoven tribal clothes in the marketplace.',
      action: { type: 'SWITCH_TAB', tab: 'Clothes' },
      category: isHindi ? 'Marketplace - Hindi Clothes' : 'Marketplace - Clothes',
      source: 'client_fallback'
    };
  }

  if (/(show\s+necklaces|switch\s+to\s+necklaces|open\s+necklaces(\s+tab)?|हार\s*(दिखाओ|खोलो)?|माला\s*(दिखाओ|खोलो)?|हंसुली|haar\s*dikhao|mala\s*dikhao|necklaces\s*dikhao|hansuli\s*dikhao|necklace\s*dikhao|haar\s*kholo|mala\s*kholo|haar\s*dikha\s*do)/i.test(clean)) {
    return {
      route: '/marketplace?tab=Necklaces',
      reply: isHindi ? 'पारंपरिक जनजातीय हार और हंसुली दिखा रहा हूँ।' : 'Showing traditional tribal necklaces in the marketplace.',
      action: { type: 'SWITCH_TAB', tab: 'Necklaces' },
      category: isHindi ? 'Marketplace - Hindi Necklaces' : 'Marketplace - Necklaces',
      source: 'client_fallback'
    };
  }

  // What is in my cart
  if (/(what\s+is\s+in\s+my\s+cart|what'?s\s+in\s+my\s+cart|check\s+my\s+cart|items\s+in\s+cart|मेरे\s*कार्ट\s*में\s*क्या\s*है|कार्ट\s*में\s*क्या\s*है|झोली\s*में\s*क्या\s*है|mere\s*cart\s*me\s*kya\s*hai|cart\s*me\s*kya\s*hai|cart\s*me\s*kya\s*kya\s*hai|kya\s*kya\s*hai\s*cart\s*me|kya\s*hai\s*cart\s*me|mera\s*cart\s*kholo|cart\s*dikhao|cart\s*check\s*karo|cart\s*mein\s*kya\s*hai)/i.test(clean)) {
    const summary = getCartSummary(isHindi);
    const reply = summary.count === 0
      ? (isHindi ? 'आपकी शॉपिंग कार्ट अभी खाली है।' : 'Your shopping cart is currently empty.')
      : (isHindi ? `आपकी कार्ट में ${summary.count} वस्तुएं हैं: ${summary.items.map(i => i.name).join(', ')}।` : `You have ${summary.count} item${summary.count > 1 ? 's' : ''} in your cart: ${summary.items.map(i => i.name).join(', ')}.`);

    return {
      route: '/marketplace?openCart=true',
      reply,
      action: { type: 'WHAT_IN_CART' },
      category: isHindi ? 'Cart - Hindi Contents' : 'Cart - Contents',
      source: 'client_fallback'
    };
  }

  // What is my total
  if (/(what\s+is\s+my\s+total|what'?s\s+my\s+total|cart\s+total|how\s+much\s+is\s+my\s+cart|कुल\s*कितना\s*हुआ|कुल\s*कीमत\s*क्या\s*है|टोटल\s*कितना\s*है|kul\s*kitna\s*hua|total\s*kitna\s*hua|total\s*kitna\s*hai|mera\s*total\s*kitna\s*bana|cart\s*ka\s*total\s*batao|kitna\s*kharcha\s*hua|kitne\s*paise\s*hue|kitna\s*bill\s*hua|cart\s*total\s*kitna\s*hai|kitna\s*hua)/i.test(clean)) {
    const summary = getCartSummary(isHindi);
    const reply = summary.count === 0
      ? (isHindi ? 'आपकी कार्ट अभी खाली है, इसलिए कुल राशि ₹0 है।' : 'Your cart is empty, so your total is ₹0.')
      : (isHindi ? `आपकी कुल राशि ₹${summary.total.toLocaleString('en-IN')} है (${summary.count} वस्तुएं)।` : `Your cart total is ₹${summary.total.toLocaleString('en-IN')} for ${summary.count} item${summary.count > 1 ? 's' : ''}.`);

    return {
      route: '/marketplace?openCart=true',
      reply,
      action: { type: 'WHAT_IS_TOTAL' },
      category: isHindi ? 'Cart - Hindi Total' : 'Cart - Total',
      source: 'client_fallback'
    };
  }

  // Remove shirt from cart
  if (/(remove\s+(the\s+)?shirt(\s+from\s+(my\s+)?cart)?|delete\s+(the\s+)?shirt(\s+from\s+cart)?|शर्ट\s*हटाओ|कार्ट\s*से\s*शर्ट\s*हटाओ|कुर्ता\s*हटाओ|shirt\s*hatao|shirt\s*hata\s*do|cart\s*se\s*shirt\s*hatao|cart\s*se\s*shirt\s*nikal\s*do|shirt\s*remove\s*karo|shirt\s*delete\s*karo|kurta\s*hatao|shirt\s*nikal\s*do)/i.test(clean)) {
    const res = removeProductFromCart('shirt', isHindi);
    return {
      route: '/marketplace?openCart=true',
      reply: res.message,
      action: { type: 'REMOVE_FROM_CART', itemKey: 'shirt', success: res.success },
      category: isHindi ? 'Cart - Hindi Remove Shirt' : 'Cart - Remove Shirt',
      source: 'client_fallback'
    };
  }

  // Add items to cart

  // Add items to cart
  if (/(add\s+(an?\s+)?(shirt|cloth|clothing|item|dress|saree|banki|bracelet|armlet|ring|necklace|hansuli|dhokra|bamboo|basket)|add\s+to\s+cart|buy\s+(a\s+)?shirt|add\s+items?|कार्ट\s*में\s*जोड़ो|शर्ट\s*खरीदो)/i.test(clean)) {
    const item = findProductByQuery(clean);
    return {
      route: '/marketplace?openCart=true',
      reply: isHindi
        ? `${item.name} को आपकी शॉपिंग कार्ट में जोड़ दिया गया है।`
        : `Added ${item.name} to your shopping cart for ${item.discountPrice || item.price}. Opening your cart now.`,
      action: { type: 'ADD_TO_CART', item },
      category: isHindi ? 'Cart - Hindi Add Item' : 'Cart - Add Item',
      source: 'client_fallback'
    };
  }

  // Cart View & Controls
  if (/(view|open|show|my)\s+(cart|bag|shopping\s+cart)|^cart$/i.test(clean)) {
    return {
      route: '/marketplace?openCart=true',
      reply: 'Opening your shopping cart.',
      action: { type: 'OPEN_CART' },
      category: 'Cart',
      source: 'client_fallback'
    };
  }

  if (/(checkout|proceed\s+to\s+checkout|place\s+order|buy\s+now|चेकआउट\s*करो|ऑर्डर\s*करो|खरीदारी\s*पूरी\s*करो|checkout\s*karo)/i.test(clean)) {
    return {
      route: '/marketplace?checkout=true',
      reply: isHindi ? 'खरीदारी पूरी करने के लिए चेकआउट खोल रहा हूँ।' : 'Taking you to secure checkout to complete your purchase.',
      action: { type: 'CHECKOUT' },
      category: isHindi ? 'Checkout - Hindi' : 'Checkout',
      source: 'client_fallback'
    };
  }

  if (/(clear|empty|reset)\s+(the\s+)?(cart|bag)|कार्ट\s*खाली\s*करो/i.test(clean)) {
    return {
      route: '/marketplace?openCart=true',
      reply: isHindi ? 'आपकी शॉपिंग कार्ट खाली कर दी गई है।' : 'Your shopping cart has been cleared.',
      action: { type: 'CLEAR_CART' },
      category: 'Cart - Clear',
      source: 'client_fallback'
    };
  }

  // 7. SPECIFIC DISTRICT & MAP COMMANDS
  const matchedDistrict = resolveDistrictName(clean);
  if (matchedDistrict) {
    const info = districtInfo[matchedDistrict] || {};
    return {
      route: `/languages?district=${encodeURIComponent(matchedDistrict)}`,
      reply: isHindi
        ? `झारखंड का नक्शा खोलकर ${matchedDistrict} पर ध्यान केंद्रित कर रहा हूँ। यहाँ की मुख्य जनजातीय भाषा ${info.dominantLanguage || 'संथाली'} है।`
        : `Opening Jharkhand's map and focusing on ${matchedDistrict}. ${
            info.dominantLanguage ? `The dominant tribal tongue is ${info.dominantLanguage}, spoken by ${info.speakers || 'many clans'}.` : ''
          }`,
      action: { type: 'SELECT_DISTRICT', district: matchedDistrict },
      category: `Map - ${matchedDistrict}`,
      source: 'client_fallback'
    };
  }

  if (/(open\s+(the\s+)?maps?|jharkhand\s+map|map\s+of\s+jharkhand|^maps?$)/i.test(clean)) {
    return {
      route: '/languages?map=true',
      reply: "Opening the interactive Jharkhand map showing all 24 districts and indigenous linguistic territories.",
      action: { type: 'OPEN_MAP' },
      category: 'Map',
      source: 'client_fallback'
    };
  }

  // Music & Mandar beats
  if (/(play|start)\s+(music|mandar|drum|beat)|मांदर\s*बजाओ|संगीत\s*चलाओ/i.test(clean)) {
    return {
      route: '/languages?playMusic=true',
      reply: isHindi ? 'झारखंड की पारंपरिक मांदर धुन बजा रहा हूँ।' : 'Playing the authentic Mandar drum rhythms of Jharkhand.',
      action: { type: 'PLAY_MUSIC' },
      category: 'Music',
      source: 'client_fallback'
    };
  }

  if (/(stop|pause)\s+(music|mandar|drum|beat)|मांदर\s*रोको|संगीत\s*बंद\s*करो/i.test(clean)) {
    return {
      route: '/languages',
      reply: isHindi ? 'मांदर की धुन रोक दी गई है।' : 'Stopping the Mandar drum beats.',
      action: { type: 'STOP_MUSIC' },
      category: 'Music',
      source: 'client_fallback'
    };
  }

  // General marketplace category navigation
  if (/ornament|jewel|banki|armlet|kundri/i.test(clean)) {
    return {
      route: '/marketplace?tab=Ornaments',
      reply: 'Taking you to handcrafted tribal ornaments in the marketplace.',
      action: { type: 'SWITCH_TAB', tab: 'Ornaments' },
      category: 'Marketplace - Ornaments',
      source: 'client_fallback'
    };
  }
  if (/necklace|pendant|hansuli/i.test(clean)) {
    return {
      route: '/marketplace?tab=Necklaces',
      reply: 'Showing traditional brass and terracotta necklaces in the marketplace.',
      action: { type: 'SWITCH_TAB', tab: 'Necklaces' },
      category: 'Marketplace - Necklaces',
      source: 'client_fallback'
    };
  }
  if (/bamboo|craft/i.test(clean) && clean.includes('bamboo')) {
    return {
      route: '/marketplace?tab=Bamboo+Crafts',
      reply: 'Showing GI-tagged Mohli bamboo crafts in the marketplace.',
      action: { type: 'SWITCH_TAB', tab: 'Bamboo Crafts' },
      category: 'Marketplace - Bamboo Crafts',
      source: 'client_fallback'
    };
  }
  if (/handicraft|dhokra|sculpture/i.test(clean)) {
    return {
      route: '/marketplace?tab=Handicrafts',
      reply: 'Showing ancient Dhokra metal sculptures and handicrafts in the marketplace.',
      action: { type: 'SWITCH_TAB', tab: 'Handicrafts' },
      category: 'Marketplace - Handicrafts',
      source: 'client_fallback'
    };
  }
  if (/cloth|attire|dress|saree/i.test(clean)) {
    return {
      route: '/marketplace?tab=Clothes',
      reply: 'Showing handwoven tribal clothing in the marketplace.',
      action: { type: 'SWITCH_TAB', tab: 'Clothes' },
      category: 'Marketplace - Clothes',
      source: 'client_fallback'
    };
  }
  if (/marketplace|shop|store|buy/i.test(clean)) {
    return {
      route: '/marketplace',
      reply: 'Opening the Vanaj marketplace supporting indigenous artisans.',
      category: 'Marketplace',
      source: 'client_fallback'
    };
  }

  // Languages & Translator
  if (/translate|translator/i.test(clean)) {
    return {
      route: '/languages?translate=true',
      reply: 'Opening the indigenous language translator.',
      category: 'Languages - Translator',
      source: 'client_fallback'
    };
  }
  if (/language|script|ol\s+chiki|warang\s+citi/i.test(clean)) {
    return {
      route: '/languages',
      reply: 'Opening indigenous tribal languages and scripts.',
      category: 'Languages',
      source: 'client_fallback'
    };
  }

  // Basic Navigation for Main Pages (Hindi & Hinglish)
  if (/(नृत्य\s*खोलो|नृत्य\s*दिखाओ|नाच\s*खोलो|नाच\s*दिखाओ|डांस\s*खोलो|डांस\s*दिखाओ|nritya\s*kholo|nritya\s*dikhao|nach\s*kholo|nach\s*dikhao|dance\s*kholo|dance\s*dikhao|dance\s*section\s*kholo)/i.test(clean)) {
    return {
      route: '/dance',
      reply: 'झारखंड के पारंपरिक लोक नृत्य खोल रहा हूँ।',
      category: 'Dance - Hindi',
      source: 'client_fallback'
    };
  }
  if (/(भोजन\s*दिखाओ|भोजन\s*खोलो|खाना\s*दिखाओ|खाना\s*खोलो|व्यंजन\s*दिखाओ|व्यंजन\s*खोलो|bhojan\s*dikhao|bhojan\s*kholo|khana\s*dikhao|khana\s*kholo|vyanjan\s*dikhao|food\s*dikhao|food\s*kholo)/i.test(clean)) {
    return {
      route: '/food',
      reply: 'पारंपरिक जनजातीय भोजन खोल रहा हूँ।',
      category: 'Food - Hindi',
      source: 'client_fallback'
    };
  }
  if (/(बाज़ार\s*खोलो|बाजार\s*खोलो|बाज़ार\s*दिखाओ|मार्केट\s*खोलो|मार्केट\s*दिखाओ|bazar\s*kholo|bazar\s*dikhao|market\s*kholo|market\s*dikhao|marketplace\s*kholo|marketplace\s*dikhao)/i.test(clean)) {
    return {
      route: '/marketplace',
      reply: 'पारंपरिक जनजातीय बाज़ार खोल रहा हूँ।',
      category: 'Marketplace - Hindi',
      source: 'client_fallback'
    };
  }
  if (/(झारखंड\s*का\s*नक्शा|नक्शा\s*खोलो|नक्शा\s*दिखाओ|मैप\s*खोलो|मैप\s*दिखाओ|naksha\s*kholo|naksha\s*dikhao|map\s*kholo|map\s*dikhao|jharkhand\s*ka\s*naksha|jharkhand\s*map\s*dikhao)/i.test(clean)) {
    return {
      route: '/languages?map=true',
      reply: 'झारखंड का नक्शा खोल रहा हूँ जिसमें सभी 24 जिले और उनकी भाषाएं हैं।',
      action: { type: 'OPEN_MAP' },
      category: 'Map - Hindi',
      source: 'client_fallback'
    };
  }
  if (/(भाषा\s*खोलो|भाषाएं\s*दिखाओ|अनुवादक\s*खोलो|अनुवादक\s*दिखाओ|bhasha\s*kholo|bhashayein\s*dikhao|anuvadak\s*kholo|translator\s*kholo|languages\s*dikhao)/i.test(clean)) {
    return {
      route: '/languages',
      reply: 'जनजातीय भाषाएं और अनुवादक खोल रहा हूँ।',
      category: 'Languages - Hindi',
      source: 'client_fallback'
    };
  }
  if (/(घर\s*जाओ|होम\s*खोलो|मुख्य\s*पृष्ठ|होम\s*पर\s*जाओ|ghar\s*jao|home\s*kholo|homepage\s*kholo|home\s*pe\s*jao|main\s*page\s*kholo)/i.test(clean)) {
    return {
      route: '/',
      reply: 'वनाज के मुख्य पृष्ठ पर जा रहे हैं।',
      category: 'Home - Hindi',
      source: 'client_fallback'
    };
  }

  // Home
  if (/home|homepage|main\s+page/i.test(clean)) {
    return {
      route: '/',
      reply: 'Taking you home to Vanaj.',
      category: 'Home',
      source: 'client_fallback'
    };
  }

  // RELIABILITY REQUIREMENT:
  // When a command is not understood, do NOT repeat the user's words back.
  // Say "I didn't catch that" and suggest 2 or 3 valid commands.
  return {
    route: null,
    reply: isHindi
      ? "माफ़ कीजिये, मैं समझ नहीं पाया। आप कह सकते हैं: 'हो नृत्य चलाओ', 'धुस्का दिखाओ', या 'मेरे कार्ट में क्या है'।"
      : "I didn't catch that. You can try saying 'open dance', 'show Dhuska', or 'view cart'.",
    category: isHindi ? 'Unrecognized - Hindi' : 'Unrecognized',
    source: 'client_fallback'
  };
}

let activeAudio = null;

export function stopCurrentAudio() {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {}
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Speak reply using ElevenLabs serverless API, falling back to browser SpeechSynthesis
export async function speakReply(text, { onStart, onEnd, onError } = {}) {
  stopCurrentAudio();

  if (!text) return;

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs TTS HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('audio')) {
      throw new Error('Non-audio response from TTS server');
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    activeAudio = audio;

    audio.onplay = () => {
      if (onStart) onStart({ provider: 'elevenlabs', voice: 'Sarah' });
    };

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      activeAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      URL.revokeObjectURL(audioUrl);
      activeAudio = null;
      console.warn('ElevenLabs audio playback failed, falling back to browser speech:', e);
      speakWithBrowserSynthesis(text, { onStart, onEnd, onError });
    };

    await audio.play();
  } catch (err) {
    console.warn('ElevenLabs TTS service unreachable or quota exceeded, falling back to browser speech synthesis:', err);
    speakWithBrowserSynthesis(text, { onStart, onEnd, onError });
  }
}

// Resilient browser SpeechSynthesis fallback
export function speakWithBrowserSynthesis(text, { onStart, onEnd, onError } = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const isHindi = /[\u0900-\u097F]/.test(text);
  utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Prefer authentic Hindi voice if Hindi, or warm Indian English voice if English
  const voices = window.speechSynthesis.getVoices();
  let preferredVoice = null;
  if (isHindi) {
    preferredVoice = voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi') || /hindi/i.test(v.name));
  } else {
    preferredVoice = voices.find(v => (v.lang === 'en-IN' || v.lang.startsWith('en')) && (v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Natural')));
  }
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart({ provider: 'browser_synthesis', voice: utterance.voice?.name || 'Browser Voice' });
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (event) => {
    console.warn('Browser speech synthesis error:', event);
    if (onError) onError(event);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}
