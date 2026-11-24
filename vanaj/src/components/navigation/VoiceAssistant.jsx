import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, X, Volume2, VolumeX, Sparkles, Navigation, AlertCircle, Keyboard, ArrowDown, HelpCircle, Globe } from 'lucide-react';
import {
  isSpeechRecognitionSupported,
  createSpeechRecognizer,
  sendVoiceQuery,
  executeVoiceAction,
  speakReply,
  stopCurrentAudio,
  isHindiQuery
} from '../../services/voiceNavigationService';

const SUGGESTED_COMMANDS_EN = [
  'play Ho dance',
  'show food from the Santhali tribe',
  'show Dhuska',
  'open flashcards for Santali',
  'translate water to Santali',
  'show waterfalls',
  'search Netarhat',
  'show ornaments',
  'what is in my cart',
  'what is my total',
  'remove the shirt from my cart',
  'help'
];

const SUGGESTED_COMMANDS_HINGLISH = [
  'ho dance chalao',
  'dhuska dikhao',
  'santhali khana dikhao',
  'santali flashcards kholo',
  'card palat do',
  'paani ka santali anuvad',
  'mandir dikhao',
  'jharne dikhao',
  'netarhat khojo',
  'gahne dikhao',
  'cart me kya hai',
  'kul kitna hua',
  'shirt hatao',
  'chup raho',
  'madad'
];

const SUGGESTED_COMMANDS_HI = [
  'हो नृत्य चलाओ',
  'संथाली जनजाति का भोजन दिखाओ',
  'धुस्का दिखाओ',
  'संथाली फ्लैशकार्ड खोलो',
  'पानी का संथाली अनुवाद',
  'झरने दिखाओ',
  'नेतरहाट खोजो',
  'गहने दिखाओ',
  'मेरे कार्ट में क्या है',
  'कुल कितना हुआ',
  'शर्ट हटाओ',
  'मदद'
];

export default function VoiceAssistant() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechProvider, setSpeechProvider] = useState('');
  
  const [transcript, setTranscript] = useState('');
  const [lastReply, setLastReply] = useState('');
  const [textInput, setTextInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [micDenied, setMicDenied] = useState(false);
  const [showHelpDetails, setShowHelpDetails] = useState(false);
  const [assistantLang, setAssistantLang] = useState(() => {
    try {
      return localStorage.getItem('vanaj_voice_lang') || 'en-IN';
    } catch {
      return 'en-IN';
    }
  });

  const recognitionRef = useRef(null);
  const textInputRef = useRef(null);
  const hasRecognition = isSpeechRecognitionSupported();
  const [showTextFallback, setShowTextFallback] = useState(true);

  // Clean up audio & speech on unmount
  useEffect(() => {
    const handleShowHelpEvent = () => {
      setShowHelpDetails(true);
    };
    window.addEventListener('vanaj:show-help', handleShowHelpEvent);

    return () => {
      window.removeEventListener('vanaj:show-help', handleShowHelpEvent);
      stopCurrentAudio();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const handleStartListening = () => {
    setErrorMsg('');
    setMicDenied(false);
    setTranscript('');
    stopCurrentAudio();
    setIsSpeaking(false);
    setIsOpen(true);

    if (!hasRecognition) {
      setShowTextFallback(true);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      setIsListening(true);
      const recognizer = createSpeechRecognizer({
        lang: assistantLang === 'hi-IN' ? 'hi-IN' : 'en-IN',
        onStart: () => {
          setIsListening(true);
        },
        onResult: ({ fullTranscript, finalTranscript }) => {
          setTranscript(fullTranscript || finalTranscript);
          if (finalTranscript) {
            handleProcessCommand(finalTranscript);
          }
        },
        onError: (err) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
          if (err.error === 'not-allowed' || err.error === 'permission-denied') {
            setErrorMsg(
              assistantLang === 'hi-IN'
                ? 'माइक्रोफ़ोन अनुमति अस्वीकृत हो गई। कृपया नीचे दिए गए बॉक्स में कमांड लिखें।'
                : 'Microphone permission was denied. Please use the text box below to type your command.'
            );
            setMicDenied(true);
            setShowTextFallback(true);
            setTimeout(() => {
              if (textInputRef.current) textInputRef.current.focus();
            }, 100);
          } else if (err.error !== 'no-speech') {
            setErrorMsg(
              assistantLang === 'hi-IN'
                ? `सुनना रुका (${err.error || 'error'})। नीचे लिखकर प्रयास करें।`
                : `Listening paused (${err.error || 'error'}). Try typing below.`
            );
            setShowTextFallback(true);
          }
        },
        onEnd: () => {
          setIsListening(false);
        }
      });

      recognitionRef.current = recognizer;
      recognizer.start();
    } catch (err) {
      console.warn('Could not start speech recognition:', err);
      setIsListening(false);
      setShowTextFallback(true);
      setErrorMsg('Speech recognition could not start. Please use text input.');
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const handleProcessCommand = async (commandText) => {
    const clean = (commandText || '').trim();
    if (!clean) return;

    handleStopListening();
    setIsProcessing(true);
    setErrorMsg('');

    try {
      console.log('[VoiceAssistant Command Received]:', clean);
      const result = await sendVoiceQuery(clean, location.pathname);
      console.log('[VoiceAssistant Result to Execute]:', JSON.stringify(result));
      setIsProcessing(false);

      if (result) {
        setLastReply(result.reply);

        if (result.action?.type === 'SHOW_HELP') {
          setShowHelpDetails(true);
        } else {
          setShowHelpDetails(false);
        }

        // Execute voice action (state mutation, cart update, district selection, map scroll, etc.)
        executeVoiceAction(result, navigate);

        // Handle "stop talking" or "be quiet": stop the spoken reply immediately
        if (result.action?.type === 'STOP_TALKING') {
          stopCurrentAudio();
          setIsSpeaking(false);
          return;
        }

        // Speak the reply via ElevenLabs (or fallback)
        if (result.reply) {
          speakReply(result.reply, {
            onStart: ({ provider, voice }) => {
              setIsSpeaking(true);
              setSpeechProvider(provider === 'elevenlabs' ? `ElevenLabs (${voice})` : 'Browser Speech');
            },
            onEnd: () => {
              setIsSpeaking(false);
            },
            onError: () => {
              setIsSpeaking(false);
            }
          });
        }
      }
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg('Could not process request. Please try again.');
      console.error(err);
    }
  };

  const handleTextSubmit = (e) => {
    if (e) e.preventDefault();
    if (!textInput.trim()) return;
    const query = textInput.trim();
    setTextInput('');
    setTranscript(query);
    handleProcessCommand(query);
  };

  const handleSelectSuggested = (cmd) => {
    setTranscript(cmd);
    setTextInput('');
    handleProcessCommand(cmd);
  };

  const handleStopSpeech = () => {
    stopCurrentAudio();
    setIsSpeaking(false);
  };

  return (
    <>
      {/* Floating Dialog / Popup Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="voice-assistant-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-8 z-[9999] w-[calc(100vw-2rem)] max-w-sm sm:max-w-md rounded-2xl bg-[#0D0D0D]/95 border border-[#C9952A]/30 backdrop-blur-xl shadow-2xl shadow-black/80 text-white overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C9952A]/20 border border-[#C9952A]/40 flex items-center justify-center text-[#C9952A]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold tracking-wide text-white">
                    Vanaj Voice Assistant
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-body flex items-center gap-1.5">
                    {isListening ? (
                      <span className="flex items-center gap-1 text-[#C9952A] font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#C9952A] animate-ping" />
                        Listening...
                      </span>
                    ) : isProcessing ? (
                      <span className="text-amber-300">Processing command...</span>
                    ) : isSpeaking ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Volume2 size={11} /> Speaking ({speechProvider || 'Voice'})
                      </span>
                    ) : (
                      <span>Tap mic or type to navigate</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Language Toggle (EN / Hinglish / हिंदी) */}
                <div className="flex items-center bg-white/10 p-0.5 rounded-lg border border-white/15 text-xs mr-1">
                  <button
                    type="button"
                    id="voice-lang-en"
                    onClick={() => {
                      setAssistantLang('en-IN');
                      try { localStorage.setItem('vanaj_voice_lang', 'en-IN'); } catch {}
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      assistantLang === 'en-IN'
                        ? 'bg-[#C9952A] text-black font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    id="voice-lang-hinglish"
                    onClick={() => {
                      setAssistantLang('hinglish');
                      try { localStorage.setItem('vanaj_voice_lang', 'hinglish'); } catch {}
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      assistantLang === 'hinglish'
                        ? 'bg-[#C9952A] text-black font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Hinglish
                  </button>
                  <button
                    type="button"
                    id="voice-lang-hi"
                    onClick={() => {
                      setAssistantLang('hi-IN');
                      try { localStorage.setItem('vanaj_voice_lang', 'hi-IN'); } catch {}
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      assistantLang === 'hi-IN'
                        ? 'bg-[#C9952A] text-black font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>

                {isSpeaking && (
                  <button
                    onClick={handleStopSpeech}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                    title={assistantLang === 'hi-IN' ? "बोलना बंद करें" : "Stop speaking"}
                    aria-label="Stop speaking"
                  >
                    <VolumeX size={16} />
                  </button>
                )}
                <button
                  onClick={() => {
                    handleStopListening();
                    handleStopSpeech();
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close Assistant"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* Listening Active State Animation */}
              {isListening && (
                <div className="flex flex-col items-center justify-center py-4 px-3 rounded-xl bg-gradient-to-b from-[#C9952A]/10 to-transparent border border-[#C9952A]/20">
                  <div className="flex items-center gap-1.5 mb-3 h-8">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ height: ['8px', '28px', '8px'] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          delay: i * 0.15,
                          ease: 'easeInOut'
                        }}
                        className="w-1.5 rounded-full bg-[#C9952A]"
                      />
                    ))}
                  </div>
                  <span className="font-heading text-sm text-[#C9952A] tracking-wider uppercase font-semibold">
                    {assistantLang === 'hi-IN' ? 'सुन रहा हूँ... बोलिए' : assistantLang === 'hinglish' ? 'Sun raha hoon... Boliye' : 'Listening... Speak now'}
                  </span>
                  <p className="text-xs text-neutral-300 mt-1 italic text-center min-h-[1.5rem]">
                    {transcript || (assistantLang === 'hi-IN' ? 'बोलें "हो नृत्य चलाओ", "धुस्का दिखाओ", या "मेरे कार्ट में क्या है"' : assistantLang === 'hinglish' ? 'Bolein "ho dance chalao", "dhuska dikhao", ya "cart me kya hai"' : 'Say "play Ho dance", "show Dhuska", or "what is in my cart"')}
                  </p>

                  <button
                    onClick={handleStopListening}
                    className="mt-3 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white border border-white/20 transition-all cursor-pointer"
                  >
                    {assistantLang === 'hi-IN' ? 'समाप्त' : assistantLang === 'hinglish' ? 'Khatam' : 'Done Speaking'}
                  </button>
                </div>
              )}

              {/* Processing State */}
              {isProcessing && (
                <div className="flex items-center justify-center gap-3 py-4 text-[#C9952A] text-sm font-medium">
                  <div className="w-4 h-4 border-2 border-[#C9952A] border-t-transparent rounded-full animate-spin" />
                  <span>{assistantLang === 'hi-IN' ? 'कमांड समझ रहा हूँ...' : assistantLang === 'hinglish' ? 'Command samajh raha hoon...' : 'Understanding command...'}</span>
                </div>
              )}

              {/* Spoken / Last Reply Display */}
              {lastReply && !isListening && (
                <div id="voice-last-reply" className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#C9952A] uppercase tracking-wider font-semibold">
                    <span className="flex items-center gap-1">
                      <Navigation size={12} /> {assistantLang === 'hi-IN' ? 'वनाज उत्तर' : assistantLang === 'hinglish' ? 'Vanaj Jawab' : 'Vanaj Reply'}
                    </span>
                    {isSpeaking && (
                      <span className="text-[10px] text-emerald-400">{assistantLang === 'hi-IN' ? 'बोल रहा हूँ...' : assistantLang === 'hinglish' ? 'Bol raha hoon...' : 'Speaking...'}</span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-200 font-light leading-relaxed">
                    {lastReply}
                  </p>
                </div>
              )}

              {/* Rich Help Box when user asks for help */}
              {showHelpDetails && (
                <div className="p-3.5 rounded-xl bg-[#C9952A]/10 border border-[#C9952A]/30 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#C9952A] uppercase tracking-wider text-[11px]">
                    <HelpCircle size={14} /> {assistantLang === 'hi-IN' ? 'उपलब्ध कमांड्स:' : 'Available Commands:'}
                  </div>
                  {assistantLang === 'hi-IN' ? (
                    <div className="grid grid-cols-2 gap-2 text-neutral-300 text-[11px]">
                      <div>
                        <strong className="text-white block mb-0.5">नेविगेशन:</strong>
                        • "पीछे जाओ", "सबसे ऊपर जाओ"<br/>
                        • "नीचे स्क्रॉल करो", "ऊपर जाओ"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">नृत्य:</strong>
                        • "हो नृत्य चलाओ"<br/>
                        • "वीडियो रोको"<br/>
                        • "वीडियो बंद करो", "अगला नृत्य"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">भोजन और संस्कृति:</strong>
                        • "संथाली जनजाति का खाना"<br/>
                        • "धुस्का दिखाओ"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">बाज़ार और कार्ट:</strong>
                        • "गहने दिखाओ", "कपड़े दिखाओ"<br/>
                        • "मेरे कार्ट में क्या है"<br/>
                        • "शर्ट हटाओ", "कुल कितना हुआ"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">भाषाएं और अनुवाद:</strong>
                        • "संथाली फ्लैशकार्ड खोलो"<br/>
                        • "कार्ड पलटो", "अगला कार्ड"<br/>
                        • "पानी का संथाली अनुवाद"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">पर्यटन:</strong>
                        • "मंदिर दिखाओ", "झरने दिखाओ"<br/>
                        • "नेतरहाट खोजो", "वर्कशॉप दिखाओ"
                      </div>
                    </div>
                  ) : assistantLang === 'hinglish' ? (
                    <div className="grid grid-cols-2 gap-2 text-neutral-300 text-[11px]">
                      <div>
                        <strong className="text-white block mb-0.5">Navigation:</strong>
                        • "piche jao", "sabse upar jao"<br/>
                        • "niche scroll karo", "upar jao"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Dances:</strong>
                        • "ho dance chalao"<br/>
                        • "video pause karo"<br/>
                        • "video band karo", "agla dance"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Food:</strong>
                        • "santhali khana dikhao"<br/>
                        • "dhuska dikhao"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Marketplace & Cart:</strong>
                        • "gahne dikhao", "kapde dikhao"<br/>
                        • "cart me kya hai"<br/>
                        • "shirt hatao", "kul kitna hua"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Languages:</strong>
                        • "santali flashcards kholo"<br/>
                        • "card palat do", "agla card"<br/>
                        • "paani ka santali anuvad"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Tourism:</strong>
                        • "mandir dikhao", "jharne dikhao"<br/>
                        • "netarhat khojo", "karyashala dikhao"
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-neutral-300 text-[11px]">
                      <div>
                        <strong className="text-white block mb-0.5">Navigation:</strong>
                        • "go back", "go to top"<br/>
                        • "scroll down", "scroll up"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Dances:</strong>
                        • "play Ho dance"<br/>
                        • "pause the video"<br/>
                        • "close the video", "next dance"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Food & Heritage:</strong>
                        • "show food from the Santhali tribe"<br/>
                        • "show Dhuska"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Marketplace:</strong>
                        • "show ornaments", "show clothes"<br/>
                        • "what is in my cart"<br/>
                        • "remove the shirt from my cart"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Languages:</strong>
                        • "open flashcards for Santali"<br/>
                        • "flip the card", "next card"<br/>
                        • "translate water to Santali"
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Tourism:</strong>
                        • "show temples", "show waterfalls"<br/>
                        • "search Netarhat", "show workshops"
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message with pointer to text box if mic denied */}
              {errorMsg && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-900/30 border border-red-500/30 text-xs text-red-200">
                    <AlertCircle size={15} className="mt-0.5 text-red-400 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                  {micDenied && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-300 pl-1 font-medium animate-bounce">
                      <ArrowDown size={14} /> {assistantLang === 'hi-IN' ? 'नीचे दिए गए बॉक्स में कमांड लिखें:' : assistantLang === 'hinglish' ? 'Niche diye gaye box me command likhein:' : 'Type your command below instead:'}
                    </div>
                  )}
                </div>
              )}

              {/* Text Input Fallback */}
              {(showTextFallback || !hasRecognition || micDenied) && (
                <form 
                  onSubmit={handleTextSubmit} 
                  className={`relative flex items-center transition-all ${
                    micDenied ? 'ring-2 ring-amber-400/80 rounded-xl' : ''
                  }`}
                >
                  <input
                    ref={textInputRef}
                    id="voice-command-input"
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={
                      assistantLang === 'hi-IN'
                        ? "हिंदी में कमांड लिखें (जैसे 'हो नृत्य चलाओ')..."
                        : assistantLang === 'hinglish'
                        ? "Hinglish me command likhein (jaise 'dhuska dikhao', 'cart me kya hai')..."
                        : "Type a command (e.g., 'play Ho dance')..."
                    }
                    className="w-full bg-white/5 border border-white/15 focus:border-[#C9952A] focus:ring-1 focus:ring-[#C9952A] rounded-xl pl-4 pr-12 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-all"
                  />
                  <button
                    id="voice-command-submit"
                    type="submit"
                    disabled={!textInput.trim() || isProcessing}
                    className="absolute right-2 p-1.5 rounded-lg bg-[#C9952A] text-black font-semibold hover:bg-[#d6a540] disabled:opacity-40 disabled:hover:bg-[#C9952A] transition-all cursor-pointer"
                    title={assistantLang === 'hi-IN' ? "कमांड भेजें" : assistantLang === 'hinglish' ? "Command bhejein" : "Send command"}
                    aria-label="Send command"
                  >
                    <Send size={15} />
                  </button>
                </form>
              )}

              {/* Suggested / Supported Command Chips */}
              <div>
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2 flex items-center justify-between">
                  <span>{assistantLang === 'hi-IN' ? 'कहें या टैप करें:' : assistantLang === 'hinglish' ? 'Bolein ya tap karein:' : 'Try saying or tapping:'}</span>
                  {hasRecognition && (
                    <button
                      type="button"
                      onClick={() => setShowTextFallback(!showTextFallback)}
                      className="text-[11px] text-[#C9952A] hover:underline flex items-center gap-1 font-normal lowercase"
                    >
                      <Keyboard size={12} />
                      {showTextFallback ? (assistantLang === 'hi-IN' ? 'टेक्स्ट छिपाएं' : assistantLang === 'hinglish' ? 'text chhupayein' : 'hide text') : (assistantLang === 'hi-IN' ? 'टेक्स्ट लिखें' : assistantLang === 'hinglish' ? 'text likhein' : 'type instead')}
                    </button>
                  )}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(assistantLang === 'hi-IN' ? SUGGESTED_COMMANDS_HI : assistantLang === 'hinglish' ? SUGGESTED_COMMANDS_HINGLISH : SUGGESTED_COMMANDS_EN).map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => handleSelectSuggested(cmd)}
                      className="px-2.5 py-1 text-xs rounded-full bg-white/5 hover:bg-[#C9952A]/20 hover:text-[#C9952A] border border-white/10 hover:border-[#C9952A]/40 text-neutral-300 transition-all text-left cursor-pointer"
                    >
                      "{cmd}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Microphone Trigger Button */}
      {/* Positioned bottom-right on every page. Minimum 44px on mobile (min-w-[48px] min-h-[48px]) */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9999] flex items-center gap-3">
        {/* Subtle pill label prompt when idle on desktop */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={handleStartListening}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0D0D0D]/90 border border-[#C9952A]/30 text-xs text-neutral-200 shadow-xl cursor-pointer hover:border-[#C9952A] transition-colors"
          >
            <Sparkles size={14} className="text-[#C9952A]" />
            <span>Voice Navigate</span>
          </motion.div>
        )}

        <button
          id="voice-assistant-toggle"
          type="button"
          onClick={() => {
            if (isListening) {
              handleStopListening();
            } else if (isOpen && !hasRecognition) {
              setIsOpen(false);
            } else {
              handleStartListening();
            }
          }}
          className={`relative group flex items-center justify-center min-w-[50px] min-h-[50px] w-14 h-14 sm:w-16 sm:h-16 rounded-full border shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer ${
            isListening
              ? 'bg-[#C9952A] text-black border-white shadow-[0_0_25px_rgba(201,149,42,0.8)] scale-105'
              : 'bg-[#0D0D0D] text-[#C9952A] border-[#C9952A]/40 hover:border-[#C9952A] hover:shadow-[0_0_25px_rgba(201,149,42,0.4)]'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start voice navigation assistant'}
          title={isListening ? 'Listening... click to stop' : 'Tap to speak voice command'}
        >
          {/* Animated pulsing wave rings when listening */}
          {isListening && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-[#C9952A] animate-ping opacity-75 pointer-events-none" />
              <span className="absolute -inset-2 rounded-full border border-[#C9952A]/40 animate-pulse pointer-events-none" />
            </>
          )}

          {isListening ? (
            <MicOff size={24} className="transition-transform group-hover:scale-110" />
          ) : (
            <Mic size={24} className="transition-transform group-hover:scale-110" />
          )}
        </button>
      </div>
    </>
  );
}
