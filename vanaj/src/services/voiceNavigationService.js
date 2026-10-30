// Voice Navigation and Speech Services for Vanaj

// Check Web Speech API availability
export function isSpeechRecognitionSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported() {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

// Create speech recognition instance with optimal settings
export function createSpeechRecognizer({ onResult, onEnd, onError, onStart }) {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  // Try Indian English first, falling back to English
  recognition.lang = 'en-IN';

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

// Send voice query to Gemini via serverless proxy
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

    return await response.json();
  } catch (error) {
    console.warn('Voice navigation API failed, using client fallback:', error);
    // Instant client-side fallback rule matcher for high resilience
    return getClientFallback(query);
  }
}

// Client fallback intent matcher
function getClientFallback(query) {
  const clean = (query || '').toLowerCase().trim();

  if (/home|homepage|main\s+page/i.test(clean)) {
    return { route: '/', reply: 'Taking you home to Vanaj.', source: 'client_fallback' };
  }
  if (/santali|santhali/i.test(clean)) {
    return { route: '/dance?dance=santhali', reply: 'Showing you the authentic Santhali folk dance.', source: 'client_fallback' };
  }
  if (/dance/i.test(clean)) {
    return { route: '/dance', reply: 'Opening the sacred dances of Jharkhand.', source: 'client_fallback' };
  }
  if (/ornament|jewel|banki|armlet/i.test(clean)) {
    return { route: '/marketplace?tab=Ornaments', reply: 'Taking you to tribal ornaments in the marketplace.', source: 'client_fallback' };
  }
  if (/waterfall|hundru|jonha|dassam/i.test(clean)) {
    return { route: '/tourism?filter=Waterfall', reply: 'Showing the scenic waterfalls of Jharkhand in tourism.', source: 'client_fallback' };
  }
  if (/wildlife|sanctuary|betla/i.test(clean)) {
    return { route: '/tourism?filter=Wildlife', reply: 'Showing wildlife sanctuaries in tourism.', source: 'client_fallback' };
  }
  if (/tourism|travel|places/i.test(clean)) {
    return { route: '/tourism', reply: 'Opening cultural tourism in Jharkhand.', source: 'client_fallback' };
  }
  if (/cloth|dress|saree/i.test(clean)) {
    return { route: '/marketplace?tab=Clothes', reply: 'Showing handwoven tribal clothing in the marketplace.', source: 'client_fallback' };
  }
  if (/handicraft|dhokra/i.test(clean)) {
    return { route: '/marketplace?tab=Handicrafts', reply: 'Showing tribal handicrafts in the marketplace.', source: 'client_fallback' };
  }
  if (/food|dish|cuisine/i.test(clean)) {
    return { route: '/food', reply: 'Opening tribal food and recipes.', source: 'client_fallback' };
  }
  if (/language|translate/i.test(clean)) {
    return { route: '/languages', reply: 'Opening indigenous languages and scripts.', source: 'client_fallback' };
  }

  return {
    route: '/',
    reply: `Johar! I heard "${query}". You can ask me to open dance, show Santali dances, find ornaments, or show waterfalls.`,
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
  utterance.lang = 'en-IN';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Prefer a warm English female or neutral voice if available in browser
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => (v.lang === 'en-IN' || v.lang.startsWith('en')) && (v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Natural')));
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
