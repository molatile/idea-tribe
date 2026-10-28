const fs = require('fs');
const path = require('path');

// ----------------------------------------------------
// 1. UPDATE DANCE.JSX
// ----------------------------------------------------
const dancePath = path.join(__dirname, '..', 'src', 'pages', 'Dance.jsx');
let danceContent = fs.readFileSync(dancePath, 'utf8').replace(/\r\n/g, '\n');

// Import Heart and storage helpers
if (!danceContent.includes('getItemLikes')) {
  danceContent = danceContent.replace(
    "import { X, Play, Share2, Check } from 'lucide-react';",
    "import { X, Play, Share2, Check, Heart } from 'lucide-react';\nimport { getItemLikes, toggleItemLike } from '../utils/storage';"
  );

  // Update VideoCard to accept likes info and render like button
  danceContent = danceContent.replace(
    'const VideoCard = ({ dance, onClick }) => {',
    'const VideoCard = ({ dance, onClick, isLiked, likesCount, onToggleLike }) => {'
  );

  // Add like button on top-left of VideoCard
  const videoCardTarget = `<div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500 z-0" />`;
  const videoCardReplacement = `<div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500 z-0" />
      {/* Top Left Like Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike(dance.id);
        }}
        className={\`absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all border \${
          isLiked
            ? 'bg-[#C9952A] text-black border-[#C9952A] shadow-[0_0_12px_rgba(201,149,42,0.6)]'
            : 'bg-black/60 text-white/80 border-white/10 hover:text-white hover:bg-black/80'
        }\`}
        title="Like this indigenous dance"
      >
        <Heart size={13} className={isLiked ? 'fill-current' : ''} />
        <span>{likesCount}</span>
      </button>`;
  danceContent = danceContent.replace(videoCardTarget, videoCardReplacement);

  // Update Modal signature & like button
  danceContent = danceContent.replace(
    'const Modal = ({ dance, onClose, allDances, onSelectRelated }) => {',
    'const Modal = ({ dance, onClose, allDances, onSelectRelated, isLiked, likesCount, onToggleLike }) => {'
  );

  const modalActionsTarget = `<button \n             onClick={handleShare}\n             className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-white font-body text-sm hover:scale-105 active:scale-95"\n           >\n             {copied ? <Check size={18} className="text-green-400" /> : <Share2 size={18} />}\n             {copied ? 'Link Copied' : 'Share Dance'}\n           </button>`;
  
  const modalActionsReplacement = `<div className="flex items-center gap-3">
             <button
               type="button"
               onClick={() => onToggleLike(dance.id)}
               className={\`flex items-center gap-2 px-6 py-3 rounded-full border transition-all text-sm font-body active:scale-95 \${
                 isLiked
                   ? 'bg-[#C9952A] text-black font-semibold border-[#C9952A] shadow-[0_0_15px_rgba(201,149,42,0.5)]'
                   : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
               }\`}
             >
               <Heart size={18} className={isLiked ? 'fill-current text-black' : ''} />
               <span>{isLiked ? 'Favorited' : 'Favorite'} ({likesCount})</span>
             </button>
             <button 
               onClick={handleShare}
               className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-white font-body text-sm hover:scale-105 active:scale-95"
             >
               {copied ? <Check size={18} className="text-green-400" /> : <Share2 size={18} />}
               {copied ? 'Link Copied' : 'Share Dance'}
             </button>
           </div>`;

  danceContent = danceContent.replace(modalActionsTarget, modalActionsReplacement);

  // Add state to Dance component
  danceContent = danceContent.replace(
    "const [selectedDance, setSelectedDance] = useState(null);",
    `const [selectedDance, setSelectedDance] = useState(null);
  const [danceLikes, setDanceLikes] = useState(() => getItemLikes('dance'));

  const handleToggleDanceLike = (danceId) => {
    toggleItemLike('dance', danceId, 42);
    setDanceLikes(getItemLikes('dance'));
  };`
  );

  // Pass props to VideoCard and Modal in Dance component
  danceContent = danceContent.replace(
    `<VideoCard \n                key={dance.id} \n                dance={dance} \n                onClick={setSelectedDance} \n              />`,
    `<VideoCard 
                key={dance.id} 
                dance={dance} 
                onClick={setSelectedDance}
                isLiked={danceLikes[dance.id]?.liked}
                likesCount={danceLikes[dance.id]?.count ?? 42}
                onToggleLike={handleToggleDanceLike}
              />`
  );

  danceContent = danceContent.replace(
    `<Modal \n            dance={selectedDance} \n            onClose={() => setSelectedDance(null)} \n            allDances={DANCES}\n            onSelectRelated={setSelectedDance}\n          />`,
    `<Modal 
            dance={selectedDance} 
            onClose={() => setSelectedDance(null)} 
            allDances={DANCES}
            onSelectRelated={setSelectedDance}
            isLiked={danceLikes[selectedDance.id]?.liked}
            likesCount={danceLikes[selectedDance.id]?.count ?? 42}
            onToggleLike={handleToggleDanceLike}
          />`
  );

  fs.writeFileSync(dancePath, danceContent, 'utf8');
  console.log('Dance.jsx updated with like system!');
}

// ----------------------------------------------------
// 2. UPDATE FOOD.JSX
// ----------------------------------------------------
const foodPath = path.join(__dirname, '..', 'src', 'pages', 'Food.jsx');
let foodContent = fs.readFileSync(foodPath, 'utf8').replace(/\r\n/g, '\n');

if (!foodContent.includes('getItemLikes')) {
  foodContent = foodContent.replace(
    "import { X, MapPin, Leaf, ChefHat, Calendar, Users } from 'lucide-react';",
    "import { X, MapPin, Leaf, ChefHat, Calendar, Users, Heart } from 'lucide-react';\nimport { getItemLikes, toggleItemLike } from '../utils/storage';"
  );

  foodContent = foodContent.replace(
    "const [selectedFood, setSelectedFood] = useState(null);",
    `const [selectedFood, setSelectedFood] = useState(null);
  const [foodLikes, setFoodLikes] = useState(() => getItemLikes('food'));

  const handleToggleFoodLike = (foodId) => {
    toggleItemLike('food', foodId, 36);
    setFoodLikes(getItemLikes('food'));
  };`
  );

  // Add like button on Food Card
  const cardBadge = `<div className="absolute top-4 left-4 bg-vanaj-ochre text-vanaj-very-dark px-3 py-1 rounded-full text-xs font-bold shadow-md">
                {food.tribe}
              </div>`;
  const cardBadgeReplacement = `<div className="absolute top-4 left-4 bg-vanaj-ochre text-vanaj-very-dark px-3 py-1 rounded-full text-xs font-bold shadow-md">
                {food.tribe}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFoodLike(food.id);
                }}
                className={\`absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md transition-all \${
                  foodLikes[food.id]?.liked
                    ? 'bg-vanaj-red text-white shadow-red-900/30'
                    : 'bg-vanaj-cream/90 text-vanaj-dark hover:bg-white'
                }\`}
                title="Like dish"
              >
                <Heart size={13} className={foodLikes[food.id]?.liked ? 'fill-current text-white' : ''} />
                <span>{foodLikes[food.id]?.count ?? 36}</span>
              </button>`;

  foodContent = foodContent.replace(cardBadge, cardBadgeReplacement);

  // Add Like button in Modal
  const modalTitleTarget = `<motion.h2 \n                    layoutId={\`title-\${selectedFood.id}\`}\n                    className="text-3xl sm:text-4xl font-heading font-bold text-vanaj-red mb-6"\n                  >\n                    {selectedFood.name}\n                  </motion.h2>`;
  
  const modalTitleReplacement = `<div className="flex items-center justify-between gap-4 mb-6">
                    <motion.h2 
                      layoutId={\`title-\${selectedFood.id}\`}
                      className="text-3xl sm:text-4xl font-heading font-bold text-vanaj-red"
                    >
                      {selectedFood.name}
                    </motion.h2>
                    <button
                      type="button"
                      onClick={() => handleToggleFoodLike(selectedFood.id)}
                      className={\`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 \${
                        foodLikes[selectedFood.id]?.liked
                          ? 'bg-vanaj-red text-white border-vanaj-red shadow-md'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }\`}
                    >
                      <Heart size={15} className={foodLikes[selectedFood.id]?.liked ? 'fill-current text-white' : 'text-vanaj-red'} />
                      <span>{foodLikes[selectedFood.id]?.liked ? 'Liked' : 'Like Dish'} ({foodLikes[selectedFood.id]?.count ?? 36})</span>
                    </button>
                  </div>`;

  foodContent = foodContent.replace(modalTitleTarget, modalTitleReplacement);

  fs.writeFileSync(foodPath, foodContent, 'utf8');
  console.log('Food.jsx updated with like system!');
}

// ----------------------------------------------------
// 3. UPDATE MARKETPLACE.JSX
// ----------------------------------------------------
const marketPath = path.join(__dirname, '..', 'src', 'pages', 'Marketplace.jsx');
let marketContent = fs.readFileSync(marketPath, 'utf8').replace(/\r\n/g, '\n');

if (!marketContent.includes('getItemLikes')) {
  marketContent = marketContent.replace(
    "import FeedbackSection from '../components/shared/FeedbackSection';",
    "import FeedbackSection from '../components/shared/FeedbackSection';\nimport { getItemLikes, toggleItemLike } from '../utils/storage';\nimport { Heart } from 'lucide-react';"
  );

  marketContent = marketContent.replace(
    "const [cart, setCart] = useState(() => {",
    `const [marketLikes, setMarketLikes] = useState(() => getItemLikes('marketplace'));

    const handleToggleMarketLike = (itemId) => {
        toggleItemLike('marketplace', itemId, 28);
        setMarketLikes(getItemLikes('marketplace'));
    };

    const [cart, setCart] = useState(() => {`
  );

  // Update card buttons
  const oldBuyButtons = `<div className="mt-auto flex items-center justify-between gap-3">
                                        <button 
                                            className="flex-1 bg-[#1A1A1A] text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#C68537] transition-all shadow-sm hover:shadow-md"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(item);
                                            }}
                                        >
                                            Buy Now
                                        </button>`;

  const newBuyButtons = `<div className="mt-auto flex items-center justify-between gap-2">
                                        <button 
                                            className="flex-1 bg-[#1A1A1A] text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#C68537] transition-all shadow-sm hover:shadow-md"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(item);
                                            }}
                                        >
                                            Buy Now
                                        </button>
                                        <button
                                            type="button"
                                            className={\`p-2.5 rounded-lg border transition-all active:scale-95 \${
                                                marketLikes[item.id]?.liked
                                                    ? 'bg-amber-500/15 text-[#C68537] border-[#C68537]'
                                                    : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-900'
                                            }\`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleMarketLike(item.id);
                                            }}
                                            title="Save to favorites"
                                        >
                                            <Heart size={18} className={marketLikes[item.id]?.liked ? 'fill-current' : ''} />
                                        </button>`;

  marketContent = marketContent.replace(oldBuyButtons, newBuyButtons);

  fs.writeFileSync(marketPath, marketContent, 'utf8');
  console.log('Marketplace.jsx updated with favorites/likes system!');
}

// ----------------------------------------------------
// 4. UPDATE TOURISM.JSX
// ----------------------------------------------------
const tourismPath = path.join(__dirname, '..', 'src', 'pages', 'Tourism.jsx');
let tourismContent = fs.readFileSync(tourismPath, 'utf8').replace(/\r\n/g, '\n');

if (!tourismContent.includes('getItemLikes')) {
  tourismContent = tourismContent.replace(
    "import { Search, MapPin, ArrowLeft, Calendar, Info, Map as MapIcon, Clock, User, CheckCircle, ChevronRight, Check, Compass, Eye, ShieldCheck, Heart } from 'lucide-react';",
    "import { Search, MapPin, ArrowLeft, Calendar, Info, Map as MapIcon, Clock, User, CheckCircle, ChevronRight, Check, Compass, Eye, ShieldCheck, Heart } from 'lucide-react';\nimport { getItemLikes, toggleItemLike, saveWorkshopProposal } from '../utils/storage';"
  );

  // In HostWorkshopForm, connect inputs to state and save
  const oldHostForm = `const HostWorkshopForm = () => {
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
  };`;

  const newHostForm = `const HostWorkshopForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('NGO');
  const [contactName, setContactName] = useState('');
  const [proposalDetails, setProposalDetails] = useState('');

  const nextStep = (e) => {
    e.preventDefault();
    setStep(s => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save proposal to local storage
    saveWorkshopProposal({
      orgName: orgName || 'Cultural Initiative',
      orgType: orgType || 'Cultural',
      contactName: contactName || 'Partner Representative',
      proposalDetails: proposalDetails || 'Tribal Craft Immersion Workshop'
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setOrgName('');
      setContactName('');
      setProposalDetails('');
      setTimeout(() => {
        setIsSuccess(false);
        setStep(1);
      }, 5000);
    }, 1200);
  };`;

  tourismContent = tourismContent.replace(oldHostForm, newHostForm);

  // Add state for tourism likes in Tourism main component
  tourismContent = tourismContent.replace(
    "const [selectedLocation, setSelectedLocation] = useState(null);",
    `const [selectedLocation, setSelectedLocation] = useState(null);
  const [tourismLikes, setTourismLikes] = useState(() => getItemLikes('tourism'));

  const handleToggleTourismLike = (locId) => {
    toggleItemLike('tourism', locId, 54);
    setTourismLikes(getItemLikes('tourism'));
  };`
  );

  // Add like button on destination cards
  const oldTourismCardContent = `<div className="flex items-center text-vanaj-dark/60 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1 text-vanaj-ochre" />
                    {location.district}
                  </div>`;

  const newTourismCardContent = `<div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center text-vanaj-dark/60">
                      <MapPin className="w-4 h-4 mr-1 text-vanaj-ochre" />
                      {location.district}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTourismLike(location.id);
                      }}
                      className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 \${
                        tourismLikes[location.id]?.liked
                          ? 'bg-vanaj-ochre text-vanaj-dark border-vanaj-ochre shadow-sm'
                          : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
                      }\`}
                      title="Like destination"
                    >
                      <Heart size={13} className={tourismLikes[location.id]?.liked ? 'fill-current' : ''} />
                      <span>{tourismLikes[location.id]?.count ?? 54}</span>
                    </button>
                  </div>`;

  tourismContent = tourismContent.replace(oldTourismCardContent, newTourismCardContent);

  fs.writeFileSync(tourismPath, tourismContent, 'utf8');
  console.log('Tourism.jsx updated with likes and proposal storage!');
}
