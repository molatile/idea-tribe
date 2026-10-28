import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRightLeft, 
  Volume2, 
  Copy, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  BookOpen, 
  Languages as LangIcon 
} from 'lucide-react';
import { translateTribal, TRIBAL_LANGUAGES } from '../../services/geminiTranslator';

// Quick sample phrases for easy exploration
const SAMPLE_PHRASES = [
  'Hello',
  'Thank you',
  'Water',
  'Friend',
  'Welcome',
  'Sun',
  'Forest',
  'Peace'
];

export default function GeminiTranslator() {
  const [sourceText, setSourceText] = useState('');
  const [targetLang, setTargetLang] = useState('Santali');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const selectedLangMeta = TRIBAL_LANGUAGES.find(l => l.id === targetLang) || TRIBAL_LANGUAGES[0];

  const handleTranslate = async (textToTranslate = sourceText, lang = targetLang) => {
    const query = (textToTranslate || '').trim();
    if (!query) {
      setErrorMessage('Please type an English word or short phrase to translate.');
      return;
    }

    setIsTranslating(true);
    setErrorMessage(null);

    try {
      const result = await translateTribal(query, lang);
      setTranslationResult(result);
    } catch (err) {
      console.error('Translation error:', err);
      setErrorMessage(
        err.message || 'Unable to complete translation. Please check your network and try again.'
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const handleSampleClick = (word) => {
    setSourceText(word);
    handleTranslate(word, targetLang);
  };

  const handleCopy = () => {
    if (!translationResult) return;
    const textToCopy = `${translationResult.translatedText} (${translationResult.script}) - ${translationResult.pronunciation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!translationResult || !window.speechSynthesis) return;
    setIsPlayingAudio(true);
    window.speechSynthesis.cancel();
    
    // Attempt phonetic or transliterated reading
    const utterance = new SpeechSynthesisUtterance(translationResult.pronunciation || translationResult.translatedText);
    utterance.rate = 0.85; // slightly slower for clear tribal phonetics
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-[#0D1F17] rounded-2xl shadow-2xl border-2 border-[#C9952A]/40 overflow-hidden text-[#FDF0E0] font-sans transition-all">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#08140F] via-[#0D1F17] to-[#122B20] p-6 md:p-8 border-b border-[#C9952A]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#C9952A]/15 border border-[#C9952A]/40 text-[#C9952A]">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#FDF0E0] tracking-wide">
                  Tribal AI Translator
                </h2>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-[#C9952A]/20 text-[#C9952A] rounded border border-[#C9952A]/40">
                  Gemini API
                </span>
              </div>
              <p className="text-[#E6D5B8]/80 text-sm mt-1">
                Preserving & translating indigenous heritage languages of Jharkhand
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#C9952A] bg-[#08140F] px-3 py-1.5 rounded-full border border-[#C9952A]/20 self-start sm:self-auto">
            <LangIcon size={14} />
            <span>6 Indigenous Languages</span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Language Selection Row */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
          {/* Source Language (Fixed English) */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-[#C9952A] uppercase tracking-wider mb-2">
              From (Source Language)
            </label>
            <div className="w-full bg-[#08140F]/90 px-4 py-3 min-h-[46px] rounded-xl border border-[#C9952A]/30 font-medium text-[#FDF0E0] flex items-center justify-between shadow-inner">
              <span className="font-semibold">English</span>
              <span className="text-xs text-[#C9952A]/70 uppercase tracking-wider">Latin Alphabet</span>
            </div>
          </div>

          {/* Swap Indicator Icon */}
          <div className="md:col-span-1 flex justify-center py-1 md:pt-6">
            <div className="w-10 h-10 rounded-full bg-[#132A20] border border-[#C9952A]/40 flex items-center justify-center text-[#C9952A] shadow-md">
              <ArrowRightLeft size={16} />
            </div>
          </div>

          {/* Target Language Dropdown */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-[#C9952A] uppercase tracking-wider mb-2">
              To (Tribal Language)
            </label>
            <div className="relative">
              <select
                value={targetLang}
                onChange={(e) => {
                  setTargetLang(e.target.value);
                  if (sourceText.trim()) {
                    handleTranslate(sourceText, e.target.value);
                  }
                }}
                className="w-full bg-[#08140F] hover:bg-[#0a1812] px-4 py-3 min-h-[46px] rounded-xl border-2 border-[#C9952A]/60 font-semibold text-[#FDF0E0] focus:ring-2 focus:ring-[#C9952A] focus:border-[#C9952A] focus:outline-none transition cursor-pointer appearance-none shadow-inner"
              >
                {TRIBAL_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-[#0D1F17] text-[#FDF0E0] py-2">
                    {lang.name} — {lang.script} ({lang.region})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#C9952A]">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Input Text Box */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-[#C9952A] uppercase tracking-wider">
              Enter English Text
            </label>
            <span className="text-xs text-[#E6D5B8]/60">
              {sourceText.length}/150 characters
            </span>
          </div>
          <div className="relative">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value.slice(0, 150))}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Hello, Welcome to our village, Thank you my friend..."
              rows={3}
              className="w-full p-4 bg-[#08140F] border-2 border-[#C9952A]/40 rounded-xl font-medium text-lg text-[#FDF0E0] placeholder:text-[#E6D5B8]/40 focus:border-[#C9952A] focus:ring-2 focus:ring-[#C9952A]/30 focus:outline-none resize-none transition shadow-inner"
            />
          </div>
        </div>

        {/* Quick Example Chips */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={14} className="text-[#C9952A]" />
            <span className="text-xs font-semibold text-[#E6D5B8]/70 uppercase tracking-wider">
              Quick explore:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PHRASES.map((phrase) => (
              <button
                key={phrase}
                type="button"
                onClick={() => handleSampleClick(phrase)}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#142C21] hover:bg-[#C9952A] text-[#E6D5B8] hover:text-[#0D1F17] border border-[#C9952A]/30 transition font-medium cursor-pointer"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Translate Action Button */}
        <div>
          <button
            type="button"
            onClick={() => handleTranslate()}
            disabled={isTranslating || !sourceText.trim()}
            className="w-full py-4 px-6 min-h-[50px] bg-[#C9952A] hover:bg-[#d49e35] active:scale-[0.99] disabled:bg-[#34463C] disabled:text-[#7A8E82] disabled:cursor-not-allowed text-[#0D1F17] font-bold text-base md:text-lg rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#C9952A]/20 cursor-pointer"
          >
            {isTranslating ? (
              <>
                <div className="w-5 h-5 border-3 border-[#0D1F17] border-t-transparent rounded-full animate-spin" />
                <span>Translating to {targetLang} with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} className="text-[#0D1F17]" />
                <span className="uppercase tracking-wider">
                  Translate to {targetLang}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="animate-fade-in p-4 rounded-xl bg-[#2A1010] border border-red-500/50 text-red-200 flex items-start justify-between gap-3 shadow-md">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Translation Notice</p>
                <p className="text-xs mt-0.5 text-red-300">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => handleTranslate()}
              className="px-3 py-1 bg-red-900/60 hover:bg-red-800 text-xs rounded border border-red-500/40 text-red-100 flex items-center gap-1 shrink-0 transition"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {/* Translation Result Card */}
        {translationResult && (
          <div className="animate-fade-in rounded-xl bg-gradient-to-b from-[#132A20] to-[#0A1A12] border-2 border-[#C9952A]/60 p-6 shadow-2xl relative">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#C9952A]/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C9952A]">
                  {targetLang} Translation
                </span>
                {translationResult.scriptName && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#C9952A]/20 text-[#C9952A] font-semibold border border-[#C9952A]/40">
                    {translationResult.scriptName} Script
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSpeak}
                  disabled={isPlayingAudio}
                  title="Pronounce word"
                  className="p-2 min-h-[38px] min-w-[38px] rounded-lg bg-[#08140F] hover:bg-[#C9952A] text-[#C9952A] hover:text-[#0D1F17] border border-[#C9952A]/40 transition flex items-center justify-center cursor-pointer"
                >
                  <Volume2 size={18} className={isPlayingAudio ? 'animate-pulse text-amber-300' : ''} />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy translation"
                  className="p-2 min-h-[38px] min-w-[38px] rounded-lg bg-[#08140F] hover:bg-[#C9952A] text-[#C9952A] hover:text-[#0D1F17] border border-[#C9952A]/40 transition flex items-center justify-center cursor-pointer"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            {/* Tribal Script Display (Large Featured Script) */}
            {translationResult.script && (
              <div className="mb-4 p-4 rounded-xl bg-[#08140F]/80 border border-[#C9952A]/30 text-center">
                <div className="text-xs uppercase tracking-wider text-[#C9952A]/80 font-bold mb-1">
                  Tribal Script ({translationResult.scriptName || selectedLangMeta.script})
                </div>
                <div className="text-3xl md:text-5xl font-bold text-[#FFD700] tracking-wide py-2 select-all font-sans">
                  {translationResult.script}
                </div>
              </div>
            )}

            {/* Transliteration & Pronunciation */}
            <div className="space-y-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C9952A] font-bold block mb-1">
                  Transliteration
                </span>
                <p className="text-2xl md:text-3xl font-extrabold text-[#FDF0E0] tracking-wide">
                  {translationResult.translatedText}
                </p>
              </div>

              {/* Pronunciation Guide */}
              {translationResult.pronunciation && (
                <div className="p-3 rounded-lg bg-[#08140F]/60 border border-[#C9952A]/20 flex items-center gap-3">
                  <div className="text-xs uppercase tracking-wider text-[#C9952A] font-bold shrink-0">
                    Pronunciation:
                  </div>
                  <div className="text-base md:text-lg font-mono text-[#E5B25D] font-medium tracking-wide">
                    /{translationResult.pronunciation}/
                  </div>
                </div>
              )}

              {/* Cultural Context Note */}
              {translationResult.context && (
                <div className="mt-4 pt-4 border-t border-[#C9952A]/20 text-xs text-[#E6D5B8]/80 leading-relaxed italic">
                  <span className="font-semibold text-[#C9952A] not-italic">Cultural context: </span>
                  {translationResult.context}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
