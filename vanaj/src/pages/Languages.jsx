import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Sparkles, Volume2, ArrowRightLeft, Globe, BookOpen, PenTool, Sun, Moon, Music, Flame, Wind, Feather } from 'lucide-react';
import jharkhandData from '../data/jharkhand.json';
import { districtInfo, languageColors } from '../data/districtInfo';

function MapClickHandler({ clearSelection }) {
  useMapEvents({
    click: (e) => {
      // Ignore map click if the user clicked on a district (SVG path)
      if (e.originalEvent?.target?.tagName?.toLowerCase() === 'path') {
        return;
      }
      clearSelection();
    }
  });
  return null;
}

const flashcards = {
  Santali: [
    { word: 'Johar', meaning: 'Hello / Greetings' },
    { word: 'Chet leka menama?', meaning: 'How are you?' },
    { word: 'Boge ge menanya', meaning: 'I am fine' },
    { word: 'Amak nyutum do chet?', meaning: 'What is your name?' },
    { word: 'Inyak nyutum do...', meaning: 'My name is...' },
    { word: 'Hẽ', meaning: 'Yes' },
    { word: 'Ba', meaning: 'No' },
    { word: 'Sari ge', meaning: 'Really' },
    { word: 'Aadi sarhao', meaning: 'Thank you very much' },
    { word: 'Daka jom keda?', meaning: 'Have you eaten?' }
  ],
  Mundari: [
    { word: 'Johar', meaning: 'Hello' },
    { word: 'Chilka menama?', meaning: 'How are you?' },
    { word: 'Bugigi menaina', meaning: 'I am fine' },
    { word: 'Am nutum chikana?', meaning: 'What is your name?' },
    { word: 'Aing nutum...', meaning: 'My name is...' },
    { word: 'Hoo', meaning: 'Yes' },
    { word: 'Ka', meaning: 'No' },
    { word: 'Eshuu marang', meaning: 'Thank you' },
    { word: 'Mandi jom keda?', meaning: 'Have you eaten food?' },
    { word: 'Sobenko johar', meaning: 'Greetings to everyone' }
  ]
};

const jharkhandBounds = [
  [21.9, 83.2], // South West
  [25.5, 88.0]  // North East
];

export default function Languages() {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const selectedDistrictRef = useRef(null);
  const geoJsonRef = useRef(null);
  const [showContributeSuccess, setShowContributeSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('Santali');
  
  // Tribal Simulation State
  const [isDrumming, setIsDrumming] = useState(false);

  // AI Translator State
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState('Santali');
  const [isTranslating, setIsTranslating] = useState(false);

  const clearSelection = () => {
    setSelectedDistrict(null);
    selectedDistrictRef.current = null;
  };

  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.eachLayer((layer) => {
        const districtName = layer.feature.properties.Dist_Name;
        const info = districtInfo[districtName] || { dominantLanguage: 'Khortha' };
        const baseColor = languageColors[info.dominantLanguage] || '#755246';
        
        if (selectedDistrict?.name === districtName) {
          layer.setStyle({
            fillColor: '#FFD700', // Highlight color
            fillOpacity: 1,
            weight: 2,
            color: '#4a332a'
          });
          layer.bringToFront();
        } else {
          layer.setStyle({
            fillColor: baseColor,
            fillOpacity: 0.85,
            weight: 1,
            color: '#f4e8d1'
          });
        }
      });
    }
  }, [selectedDistrict]);

  const onEachFeature = (feature, layer) => {
    const districtName = feature.properties.Dist_Name;
    const info = districtInfo[districtName] || { dominantLanguage: 'Khortha' };
    const baseColor = languageColors[info.dominantLanguage] || '#755246';

    layer.setStyle({
      fillColor: baseColor,
      weight: 1,
      opacity: 1,
      color: '#f4e8d1',
      fillOpacity: 0.85
    });

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        if (selectedDistrictRef.current !== districtName) {
          target.setStyle({
            fillOpacity: 1,
            weight: 2,
            color: '#fff'
          });
          target.bringToFront();
        }
      },
      mouseout: (e) => {
        const target = e.target;
        if (selectedDistrictRef.current !== districtName) {
          target.setStyle({
            fillColor: baseColor,
            fillOpacity: 0.85,
            weight: 1,
            color: '#f4e8d1'
          });
        }
      },
      click: () => {
        const newDistrict = {
          name: districtName,
          ...districtInfo[districtName]
        };
        setSelectedDistrict(newDistrict);
        selectedDistrictRef.current = newDistrict.name;
      }
    });
  };

  const handleContributeSubmit = (e) => {
    e.preventDefault();
    setShowContributeSuccess(true);
    setTimeout(() => setShowContributeSuccess(false), 3000);
    e.target.reset();
  };

  const handleTranslate = () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    
    setTimeout(() => {
      const dictionary = {
        'hello': { 'santali': 'Johar', 'mundari': 'Johar', 'ho': 'Johar', 'kurukh': 'Johar' },
        'how are you': { 'santali': 'Chet leka menama?', 'mundari': 'Chilka menama?', 'ho': 'Chilka menama?', 'kurukh': 'Engane ulday?' },
        'thank you': { 'santali': 'Aadi sarhao', 'mundari': 'Eshuu marang', 'ho': 'Eshuu marang', 'kurukh': 'Dhanyavad' },
        'good morning': { 'santali': 'Sagun seta', 'mundari': 'Seta johar', 'ho': 'Seta johar', 'kurukh': 'Pahare johar' },
      };
      
      const lower = sourceText.toLowerCase().trim().replace(/[?!.]/g, '');
      let result = `[AI Translation generated for "${sourceText}" in ${targetLang}. This is a simulated response.]`;
      
      if (dictionary[lower] && dictionary[lower][targetLang.toLowerCase()]) {
        result = dictionary[lower][targetLang.toLowerCase()];
      }
      
      setTranslatedText(result);
      setIsTranslating(false);
    }, 1500);
  };

  return (
    <div className="pt-20 min-h-screen bg-[#f4e8d1] relative overflow-hidden font-serif">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-[#4a332a] mb-6 font-['Tiro_Devanagari_Sanskrit'] border-b-2 border-double border-[#8a6020] inline-block pb-2">
            Linguistic Heritage of Jharkhand
          </h1>
          <p className="text-xl text-[#5c4436] max-w-3xl mx-auto italic mb-6">
            "Discover the ancient voices embedded in the soil of Jharkhand."
          </p>
          
          {/* Seamless Typography Legend */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-[#8a6020] animate-[spin_10s_linear_infinite]" />
              <span className="text-[#8a6020] font-bold text-xs uppercase tracking-widest">Regions</span>
            </div>
            <div className="h-4 w-px bg-[#8a6020]/30 hidden md:block"></div>
            {Object.entries(languageColors).map(([lang, color]) => (
              <div key={lang} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm border border-[#4a332a]/20" style={{ backgroundColor: color }}></div>
                <span className="text-sm font-medium text-[#4a332a]">{lang}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section (Old Map Design) */}
        <div className="relative rounded-xl overflow-hidden mb-16 flex flex-col lg:flex-row h-auto lg:h-[650px] shadow-2xl border-[12px] border-[#4a332a] bg-[#e6d5b8]">
          <div className="flex-1 h-[500px] lg:h-full relative z-0 p-4">
            <div className="absolute inset-0 bg-[#e6d5b8] opacity-50 z-[-1]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-map.png")' }}></div>
            
            {/* Compass Rose Decoration */}
            <div className="absolute top-6 left-6 z-[400] opacity-70 pointer-events-none">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40L50 0Z" fill="#4a332a"/>
                <circle cx="50" cy="50" r="15" fill="#e6d5b8" stroke="#4a332a" strokeWidth="2"/>
              </svg>
            </div>

            <MapContainer 
              bounds={jharkhandBounds}
              maxBounds={jharkhandBounds}
              maxBoundsViscosity={1.0}
              minZoom={7}
              zoomControl={true}
              attributionControl={false}
              className="h-full w-full bg-transparent"
            >
              {/* Removed TileLayer to create a standalone parchment map effect */}
              <MapClickHandler clearSelection={clearSelection} />
              <GeoJSON 
                ref={geoJsonRef}
                data={jharkhandData} 
                onEachFeature={onEachFeature}
              />
            </MapContainer>
          </div>

          {/* Info Panel */}
          <div className={`
            lg:relative top-0 right-0 h-full w-full lg:w-[400px] bg-[#2d1b14] text-[#f4e8d1] p-8 shadow-2xl transition-all duration-500 z-[500] flex flex-col border-l-4 border-[#8a6020]
            ${selectedDistrict ? 'translate-y-0 lg:translate-x-0' : 'hidden lg:flex opacity-100'}
          `}>
            {selectedDistrict ? (
              <div className="h-full overflow-y-auto pr-2 custom-scrollbar relative">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
                
                <button 
                  onClick={clearSelection}
                  className="lg:hidden absolute top-0 right-0 text-[#8a6020] hover:text-white"
                >
                  <X size={28} />
                </button>
                <div className="mb-8 border-b-2 border-[#8a6020] pb-4">
                  <span className="text-[#c7a052] text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    <Globe size={14} /> Territory Profile
                  </span>
                  <h2 className="text-5xl font-bold text-white mt-2 mb-2 font-['Tiro_Devanagari_Sanskrit']">
                    {selectedDistrict.name}
                  </h2>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-black/20 p-4 rounded border border-[#8a6020]/30">
                    <h4 className="text-[#8a6020] text-sm uppercase tracking-widest mb-1 font-bold">Dominant Tongue</h4>
                    <p className="text-3xl font-semibold text-[#FFD700] drop-shadow-md">{selectedDistrict.dominantLanguage}</p>
                  </div>

                  <div>
                    <h4 className="text-[#8a6020] text-sm uppercase tracking-widest mb-2 font-bold">Native Speakers</h4>
                    <p className="text-xl text-[#e6d5b8] font-mono">{selectedDistrict.speakers}</p>
                  </div>

                  <div>
                    <h4 className="text-[#8a6020] text-sm uppercase tracking-widest mb-3 font-bold">Indigenous Clans</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDistrict.tribes?.map(tribe => (
                        <span key={tribe} className="bg-[#8a6020]/20 text-[#FFD700] px-4 py-1.5 rounded text-sm border border-[#8a6020] uppercase tracking-wider font-semibold">
                          {tribe}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[#8a6020] text-sm uppercase tracking-widest mb-2 font-bold">Vitality Status</h4>
                    <div className={`inline-flex items-center px-4 py-2 rounded text-sm font-bold uppercase tracking-wider border
                      ${selectedDistrict.unescoStatus === 'Safe' ? 'bg-green-900/40 text-green-400 border-green-700' : 
                        selectedDistrict.unescoStatus === 'Vulnerable' ? 'bg-yellow-900/40 text-yellow-400 border-yellow-700' : 
                        'bg-red-900/40 text-red-400 border-red-700'}
                    `}>
                      {selectedDistrict.unescoStatus}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#8a6020]">
                <div className="w-20 h-20 border-2 border-dashed border-[#8a6020] rounded-full flex items-center justify-center mb-6 animate-[spin_10s_linear_infinite]">
                  <Globe size={40} className="text-[#c7a052]" />
                </div>
                <p className="text-lg font-medium italic">Unveil the regions by selecting a territory on the map.</p>
              </div>
            )}
          </div>
        </div>

        {/* Tribal Simulations & Interactivity */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#4a332a] mb-2 font-['Tiro_Devanagari_Sanskrit'] flex items-center justify-center gap-3">
              <Sun className="text-[#8a6020] animate-[spin_20s_linear_infinite]" />
              Tribal Essence & Rhythms
              <Moon className="text-[#8a6020] animate-[pulse_4s_ease-in-out_infinite]" />
            </h2>
            <p className="text-[#6e4b17] italic">Experience the heartbeat of the land</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Interactive Drum */}
            <div className="bg-[#2d1b14] rounded-xl p-6 border-2 border-[#8a6020] text-center shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-4 relative z-10 uppercase tracking-widest flex items-center justify-center gap-2">
                <Music size={20} /> The Mandar Rhythm
              </h3>
              <p className="text-[#e6d5b8] text-sm mb-6 relative z-10">Feel the pulse of tribal gatherings. Click to play the sacred rhythm.</p>
              
              <button 
                onClick={() => {
                  setIsDrumming(true);
                  setTimeout(() => setIsDrumming(false), 2000);
                }}
                className={`relative z-10 w-32 h-32 mx-auto rounded-full border-8 border-[#6e4b17] bg-[#e6d5b8] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all ${isDrumming ? 'animate-[pulse_0.2s_ease-in-out_infinite] scale-95 shadow-[0_0_30px_#FFD700]' : 'hover:scale-105'}`}
              >
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#8a6020] flex items-center justify-center">
                  <span className="text-[#4a332a] font-bold text-sm uppercase tracking-widest">Beat</span>
                </div>
              </button>
            </div>

            {/* Tribal Lore Simulation */}
            <div className="bg-[#e6d5b8] rounded-xl p-6 border-2 border-[#4a332a] shadow-xl relative overflow-hidden md:col-span-2">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#8a6020]"></div>
              <h3 className="text-xl font-bold text-[#4a332a] mb-4 flex items-center gap-2 uppercase tracking-widest">
                <Flame size={20} className="text-orange-600 animate-pulse" /> Oral Traditions
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg border border-[#d4c5b0] hover:bg-white transition-colors cursor-pointer group">
                  <p className="text-[#6e4b17] font-bold mb-1">"The earth does not belong to us; we belong to the earth."</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8a6020] uppercase tracking-widest text-xs font-bold">— Oraon Proverb</span>
                    <Wind size={16} className="text-[#a0907d] group-hover:animate-bounce" />
                  </div>
                </div>
                
                <div className="bg-white/60 p-4 rounded-lg border border-[#d4c5b0] hover:bg-white transition-colors cursor-pointer group">
                  <p className="text-[#6e4b17] font-bold mb-1">"A single arrow is easily broken, but not ten in a bundle."</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8a6020] uppercase tracking-widest text-xs font-bold">— Munda Wisdom</span>
                    <Feather size={16} className="text-[#a0907d] group-hover:-rotate-45 transition-transform" />
                  </div>
                </div>
              </div>
              
              {/* Animated Tribal Pattern */}
              <div className="absolute -bottom-10 -right-10 opacity-20 flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-20 border-4 border-[#4a332a] rotate-45 animate-[pulse_3s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.5}s` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Sections Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* AI Translator Section */}
          <div className="bg-[#fffdf8] rounded-xl shadow-xl border border-[#d4c5b0] overflow-hidden">
            <div className="bg-[#4a332a] p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#f4e8d1] flex items-center gap-3">
                  <Sparkles className="text-[#FFD700]" /> 
                  Tribal AI Translator
                </h2>
                <p className="text-[#c7a052] text-sm mt-1 opacity-90">Powered by Neural Vernacular Processing</p>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <div className="w-full">
                  <label className="block text-xs font-bold text-[#8a6020] uppercase tracking-widest mb-2">From</label>
                  <div className="bg-[#f4e8d1] px-4 py-2 rounded border border-[#d4c5b0] font-bold text-[#4a332a]">English</div>
                </div>
                
                <div className="bg-[#f4e8d1] p-3 rounded-full border border-[#d4c5b0] shadow-sm hidden md:block mt-6">
                  <ArrowRightLeft size={20} className="text-[#8a6020]" />
                </div>

                <div className="w-full">
                  <label className="block text-xs font-bold text-[#8a6020] uppercase tracking-widest mb-2">To</label>
                  <select 
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-white px-4 py-2 rounded border-2 border-[#8a6020] font-bold text-[#4a332a] focus:ring-2 focus:ring-[#8a6020] focus:outline-none"
                  >
                    <option value="Santali">Santali</option>
                    <option value="Mundari">Mundari</option>
                    <option value="Ho">Ho</option>
                    <option value="Kurukh">Kurukh</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <textarea 
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter English text to translate..."
                  className="w-full h-32 p-4 bg-white border-2 border-[#d4c5b0] rounded focus:border-[#8a6020] focus:ring-0 resize-none font-medium text-lg placeholder:text-[#a0907d]"
                ></textarea>
                
                <button 
                  onClick={handleTranslate}
                  disabled={isTranslating || !sourceText}
                  className="w-full py-4 bg-[#8a6020] hover:bg-[#6e4b17] disabled:bg-[#d4c5b0] text-white font-bold rounded flex items-center justify-center gap-2 transition-all"
                >
                  {isTranslating ? (
                    <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Translating...</span>
                  ) : (
                    <span className="flex items-center gap-2 uppercase tracking-widest"><Sparkles size={18} /> Translate to {targetLang}</span>
                  )}
                </button>

                <div className="relative">
                  <div className="absolute top-4 right-4 flex gap-2">
                     <button className="p-2 text-[#8a6020] hover:bg-[#f4e8d1] rounded transition" title="Listen">
                       <Volume2 size={20} />
                     </button>
                  </div>
                  <div className={`w-full min-h-[128px] p-4 bg-[#f9f5eb] border-2 border-[#8a6020] rounded text-[#4a332a] font-bold text-xl ${translatedText ? '' : 'text-opacity-40 italic'}`}>
                    {translatedText || "Translation will appear here..."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flashcards Section */}
          <div className="bg-[#2d1b14] rounded-xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#4a332a] flex justify-between items-center bg-[#1a0f0b]">
              <div>
                <h2 className="text-2xl font-bold text-[#FFD700] flex items-center gap-3">
                  <BookOpen /> Vocabulary Lexicon
                </h2>
                <p className="text-[#a0907d] text-sm mt-1">Master the ancient tongues</p>
              </div>
              <div className="flex gap-2">
                {['Santali', 'Mundari'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 py-2 rounded text-sm font-bold transition-all uppercase tracking-wider ${
                      activeTab === lang 
                        ? 'bg-[#8a6020] text-white' 
                        : 'bg-[#3d261e] text-[#a0907d] hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {flashcards[activeTab].map((card, idx) => (
                  <div key={idx} className="group perspective-1000 h-28">
                    <div className="relative h-full w-full transition-all duration-700 transform-style-preserve-3d group-hover:rotate-y-180 cursor-pointer">
                      {/* Front */}
                      <div className="absolute inset-0 backface-hidden bg-[#e6d5b8] border-2 border-[#8a6020] rounded-lg shadow-sm flex items-center justify-center p-4 text-center">
                        <span className="font-bold text-xl text-[#4a332a]">{card.word}</span>
                      </div>
                      {/* Back */}
                      <div className="absolute inset-0 backface-hidden bg-[#8a6020] border-2 border-[#6e4b17] rounded-lg shadow-sm flex items-center justify-center p-4 text-center rotate-y-180">
                        <span className="text-white font-medium italic">{card.meaning}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Contribute Section */}
        <div className="bg-[#e6d5b8] p-10 rounded-xl shadow-2xl border-4 border-[#4a332a] max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
             <PenTool size={300} color="#4a332a" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-[#4a332a] mb-3 font-['Tiro_Devanagari_Sanskrit']">Inscribe a New Word</h2>
            <p className="text-[#6e4b17] mb-8 font-medium italic text-lg border-b border-[#8a6020] pb-4 inline-block">Help preserve the ancient tongues for future generations.</p>
            
            {showContributeSuccess ? (
              <div className="bg-green-900/10 text-green-800 p-6 rounded border-2 border-green-700 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                   <span className="text-3xl">✨</span>
                </div>
                <p className="text-xl font-bold">Your inscription has been recorded!</p>
                <p className="text-green-900">It will be etched into our archives upon review.</p>
              </div>
            ) : (
              <form onSubmit={handleContributeSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#8a6020] uppercase tracking-widest mb-2">Language Branch</label>
                    <select className="w-full bg-[#f4e8d1] border-2 border-[#a0907d] rounded p-3 text-[#4a332a] font-bold focus:border-[#8a6020] focus:outline-none" required>
                      <option value="">Select language...</option>
                      <option value="santali">Santali</option>
                      <option value="mundari">Mundari</option>
                      <option value="ho">Ho</option>
                      <option value="kurukh">Kurukh</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8a6020] uppercase tracking-widest mb-2">The Word</label>
                    <input type="text" className="w-full bg-[#f4e8d1] border-2 border-[#a0907d] rounded p-3 text-[#4a332a] font-bold focus:border-[#8a6020] focus:outline-none placeholder:text-[#bdae9c]" required placeholder="Enter vernacular phrase" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8a6020] uppercase tracking-widest mb-2">Translation & Context</label>
                  <textarea rows={3} className="w-full bg-[#f4e8d1] border-2 border-[#a0907d] rounded p-3 text-[#4a332a] font-bold focus:border-[#8a6020] focus:outline-none placeholder:text-[#bdae9c]" required placeholder="Provide English/Hindi translation and usage context..."></textarea>
                </div>
                <button type="submit" className="w-full md:w-auto px-8 py-4 bg-[#4a332a] hover:bg-[#2d1b14] text-[#FFD700] font-bold rounded border-2 border-[#8a6020] transition-colors uppercase tracking-widest flex items-center justify-center gap-3">
                  <PenTool size={18} /> Seal the Inscription
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
