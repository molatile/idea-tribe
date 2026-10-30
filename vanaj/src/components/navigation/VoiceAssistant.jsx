import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, X, Volume2, VolumeX, Sparkles, Navigation, AlertCircle, Keyboard } from 'lucide-react';
import {
  isSpeechRecognitionSupported,
  createSpeechRecognizer,
  sendVoiceQuery,
  speakReply,
  stopCurrentAudio
} from '../../services/voiceNavigationService';

const SUGGESTED_COMMANDS = [
  'open dance',
  'show me Santali dances',
  'where can I buy ornaments',
  'show waterfalls in tourism',
  'take me home'
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

  const recognitionRef = useRef(null);
  const hasRecognition = isSpeechRecognitionSupported();
  const [showTextFallback, setShowTextFallback] = useState(!hasRecognition);

  // Clean up audio & speech on unmount
  useEffect(() => {
    return () => {
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
          if (err.error === 'not-allowed') {
            setErrorMsg('Microphone permission blocked. You can type your command below.');
            setShowTextFallback(true);
          } else if (err.error !== 'no-speech') {
            setErrorMsg(`Listening paused (${err.error || 'error'}). Try typing below.`);
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
      const result = await sendVoiceQuery(clean, location.pathname);
      setIsProcessing(false);

      if (result && result.route) {
        setLastReply(result.reply);
        
        // Navigate to the target page and filter
        navigate(result.route);

        // Speak the reply via ElevenLabs (or fallback)
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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-8 z-[85] w-[calc(100vw-2rem)] max-w-sm sm:max-w-md rounded-2xl bg-[#0D0D0D]/95 border border-[#C9952A]/30 backdrop-blur-xl shadow-2xl shadow-black/80 text-white overflow-hidden"
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
                      <span className="text-amber-300">Finding destination...</span>
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
                {isSpeaking && (
                  <button
                    onClick={handleStopSpeech}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Stop speaking"
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
            <div className="p-5 space-y-4">
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
                    Listening... Speak now
                  </span>
                  <p className="text-xs text-neutral-300 mt-1 italic text-center min-h-[1.5rem]">
                    {transcript || 'Say "Show me Santali dances", "Where can I buy ornaments", or "Take me home"'}
                  </p>

                  <button
                    onClick={handleStopListening}
                    className="mt-3 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white border border-white/20 transition-all"
                  >
                    Done Speaking
                  </button>
                </div>
              )}

              {/* Processing State */}
              {isProcessing && (
                <div className="flex items-center justify-center gap-3 py-4 text-[#C9952A] text-sm font-medium">
                  <div className="w-4 h-4 border-2 border-[#C9952A] border-t-transparent rounded-full animate-spin" />
                  <span>Understanding destination...</span>
                </div>
              )}

              {/* Spoken / Last Reply Display */}
              {lastReply && !isListening && (
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#C9952A] uppercase tracking-wider font-semibold">
                    <span className="flex items-center gap-1">
                      <Navigation size={12} /> Vanaj Reply
                    </span>
                    {isSpeaking && (
                      <span className="text-[10px] text-emerald-400">Speaking...</span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-200 font-light leading-relaxed">
                    {lastReply}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-900/30 border border-red-500/30 text-xs text-red-200">
                  <AlertCircle size={15} className="mt-0.5 text-red-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Text Input Fallback (always usable or expanded for browsers without speech recognition) */}
              {(showTextFallback || !hasRecognition) && (
                <form onSubmit={handleTextSubmit} className="relative flex items-center">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type a command (e.g., 'open dance')..."
                    className="w-full bg-white/5 border border-white/15 focus:border-[#C9952A] focus:ring-1 focus:ring-[#C9952A] rounded-xl pl-4 pr-12 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!textInput.trim() || isProcessing}
                    className="absolute right-2 p-1.5 rounded-lg bg-[#C9952A] text-black font-semibold hover:bg-[#d6a540] disabled:opacity-40 disabled:hover:bg-[#C9952A] transition-all"
                    title="Send command"
                    aria-label="Send command"
                  >
                    <Send size={15} />
                  </button>
                </form>
              )}

              {/* Suggested / Supported Command Chips */}
              <div>
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2 flex items-center justify-between">
                  <span>Try saying or tapping:</span>
                  {hasRecognition && (
                    <button
                      type="button"
                      onClick={() => setShowTextFallback(!showTextFallback)}
                      className="text-[11px] text-[#C9952A] hover:underline flex items-center gap-1 font-normal lowercase"
                    >
                      <Keyboard size={12} />
                      {showTextFallback ? 'hide text' : 'type instead'}
                    </button>
                  )}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_COMMANDS.map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => handleSelectSuggested(cmd)}
                      className="px-2.5 py-1 text-xs rounded-full bg-white/5 hover:bg-[#C9952A]/20 hover:text-[#C9952A] border border-white/10 hover:border-[#C9952A]/40 text-neutral-300 transition-all text-left"
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
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[80] flex items-center gap-3">
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
          className={`relative group flex items-center justify-center min-w-[50px] min-h-[50px] w-14 h-14 sm:w-16 sm:h-16 rounded-full border shadow-2xl transition-all duration-300 active:scale-95 ${
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
