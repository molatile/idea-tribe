import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Leaf, ChefHat, Calendar, Users } from 'lucide-react';

const foodData = [
  {
    id: 1,
    name: 'Chilka Roti',
    tribe: 'Pan Jharkhand',
    image: '/images/food/chilka%20roti-pan%20jharkhand%20(1).png',
    ingredients: 'Rice, Chana Dal (Lentils)',
    howItsMade: 'A batter of rice and chana dal is spread on a hot griddle and cooked like a crepe.',
    season: 'Year-round, special occasions',
    district: 'Ranchi, Khunti, and surrounding areas'
  },
  {
    id: 2,
    name: 'Da Mani',
    tribe: 'Khariya tribe',
    image: '/images/food/da%20mani-%20khariya.png',
    ingredients: 'Rice, Lentils, local herbs',
    howItsMade: 'A wholesome gruel made by boiling rice and lentils together until very soft.',
    season: 'Winter',
    district: 'Simdega, Gumla'
  },
  {
    id: 3,
    name: 'Dhuska',
    tribe: 'Pan Jharkhand',
    image: '/images/food/dhuska-pan%20jharkhand.png',
    ingredients: 'Rice, Urad Dal, Chana Dal, Spices',
    howItsMade: 'A fermented batter of soaked rice and lentils is deep-fried to make savory pancakes.',
    season: 'Festivals like Holi, Diwali',
    district: 'Across Jharkhand'
  },
  {
    id: 4,
    name: 'JIL Pitha',
    tribe: 'Ho tribe',
    image: '/images/food/JIL%20pitha-ho.png',
    ingredients: 'Rice flour, Meat (often chicken or mutton)',
    howItsMade: 'A stuffed dumpling where rice flour dough is filled with spiced meat and steamed or fried.',
    season: 'Festivals and celebrations',
    district: 'West Singhbhum'
  },
  {
    id: 5,
    name: 'Lapa Lapa',
    tribe: 'Munda tribe',
    image: '/images/food/lapa%20lapa-munda.jpg',
    ingredients: 'Rice, Lentils, Local spices',
    howItsMade: 'A traditional thick, savory porridge made slowly over firewood.',
    season: 'Monsoon, Winter',
    district: 'Khunti, Ranchi'
  },
  {
    id: 6,
    name: 'Maad Jhor',
    tribe: 'Ho tribe',
    image: '/images/food/maad%20jhor-ho.png',
    ingredients: 'Rice water (Maad), local greens, herbs',
    howItsMade: 'A nutritious soup prepared by boiling leftover rice water with wild edible greens.',
    season: 'Summer',
    district: 'West Singhbhum'
  },
  {
    id: 7,
    name: 'Mandia Pej',
    tribe: 'Baiga/Munda tribe',
    image: '/images/food/Mandia%20pej%20-baiga-munda.png',
    ingredients: 'Ragi (Finger Millet), Water, Buttermilk',
    howItsMade: 'A cooling, fermented gruel made from finger millet flour mixed with water and allowed to ferment.',
    season: 'Summer',
    district: 'Simdega, Gumla'
  },
  {
    id: 8,
    name: 'Meat Curry',
    tribe: 'Kharia tribe',
    image: '/images/food/meat%20curry-kharia%20tribe.jpeg',
    ingredients: 'Meat, local spices, mustard oil',
    howItsMade: 'Slow-cooked meat in a spicy, earthy gravy over a wood fire.',
    season: 'Festivals, Weddings',
    district: 'Simdega, Gumla'
  },
  {
    id: 9,
    name: 'Red Ant Chutney',
    tribe: 'Santhali tribe',
    image: '/images/food/red%20ant%20chutney-santhali.png',
    ingredients: 'Red Ants, ant eggs, chillies, garlic, salt',
    howItsMade: 'Red weaver ants and their eggs are crushed with chillies and garlic into a fiery, tangy paste.',
    season: 'Summer',
    district: 'Santhal Pargana region, Mayurbhanj borders'
  },
  {
    id: 10,
    name: 'Rugra',
    tribe: 'Oraon tribe',
    image: '/images/food/rugra-oraon.png',
    ingredients: 'Rugra (local wild mushroom), onions, spices',
    howItsMade: 'These indigenous puffball mushrooms are harvested during monsoons and cooked like a spicy meat curry.',
    season: 'Monsoon (July-August)',
    district: 'Ranchi, Gumla, Lohardaga'
  },
  {
    id: 11,
    name: 'Santhali Thali',
    tribe: 'Santhali tribe',
    image: '/images/food/santhali%20thali-santhali.png',
    ingredients: 'Rice, Dal, Saag, various local sides',
    howItsMade: 'A complete traditional meal featuring rice, lentil soup, wild greens, and side dishes served on a leaf plate.',
    season: 'Year-round',
    district: 'Dumka, Godda, Sahibganj'
  }
];

const heroMessages = [
  {
    text: "Taste the Forest 🌿",
    className: "font-heading text-4xl md:text-5xl font-bold text-vanaj-red"
  },
  {
    text: "Food is Culture, Culture is Life",
    className: "font-body text-2xl md:text-3xl font-light italic text-vanaj-red"
  },
  {
    text: "From Jharkhand's Tribal Hearth to Your Heart",
    className: "font-heading text-3xl md:text-4xl font-medium text-vanaj-red"
  },
  {
    text: "Discover Flavours Untouched by Time",
    className: "font-body text-2xl md:text-3xl font-thin tracking-widest text-vanaj-red"
  }
];

export default function Food() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % heroMessages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-vanaj-cream pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="min-h-[100px] md:min-h-[60px] flex flex-col justify-center items-center mb-4">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentMessageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className={heroMessages[currentMessageIndex].className}
              >
                {heroMessages[currentMessageIndex].text}
              </motion.h1>
            </AnimatePresence>
          </div>
          <p className="text-lg text-vanaj-dark max-w-2xl mx-auto font-body">
            Discover the rich, earthy, and vibrant culinary traditions of Jharkhand's indigenous tribes. Every dish tells a story of harmony with nature.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {foodData.map((food) => (
            <motion.div
              key={food.id}
              layoutId={`card-${food.id}`}
              onClick={() => setSelectedFood(food)}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 bg-vanaj-dark-cream"
              whileHover={{ y: -5 }}
            >
              {/* Image with zoom effect on hover */}
              <motion.img
                layoutId={`image-${food.id}`}
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => {
                  console.error("Image failed to load:", food.image);
                }}
              />
              
              {/* Warm Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-vanaj-very-dark/90 via-vanaj-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              {/* Tribe Badge */}
              <div className="absolute top-4 right-4 bg-vanaj-ochre/90 backdrop-blur-sm text-vanaj-very-dark px-3 py-1 rounded-full text-xs font-bold font-body uppercase tracking-wider shadow-md">
                {food.tribe}
              </div>

              {/* Content at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <motion.h3 
                  layoutId={`title-${food.id}`}
                  className="text-2xl font-heading font-bold text-vanaj-cream mb-1"
                >
                  {food.name}
                </motion.h3>
                {/* Warm overlay tribe name text (shows more prominently on hover) */}
                <p className="text-vanaj-ochre font-body text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex items-center gap-1">
                  <Users size={14} /> {food.tribe} Origin
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded Detail Modal */}
      <AnimatePresence>
        {selectedFood && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-vanaj-very-dark/80 backdrop-blur-sm z-40"
              onClick={() => setSelectedFood(null)}
            />
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 md:p-12 z-50 pointer-events-none">
              <motion.div
                layoutId={`card-${selectedFood.id}`}
                className="bg-vanaj-cream w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl pointer-events-auto flex flex-col md:flex-row relative"
              >
                <button
                  onClick={() => setSelectedFood(null)}
                  className="absolute top-4 right-4 z-10 bg-vanaj-cream/80 backdrop-blur text-vanaj-dark hover:bg-vanaj-ochre hover:text-vanaj-cream p-2 rounded-full transition-colors shadow-sm"
                >
                  <X size={24} />
                </button>

                <motion.div className="md:w-1/2 h-64 md:h-auto relative" layoutId={`image-container-${selectedFood.id}`}>
                  <motion.img
                    layoutId={`image-${selectedFood.id}`}
                    src={selectedFood.image}
                    alt={selectedFood.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-vanaj-ochre text-vanaj-very-dark px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                    {selectedFood.tribe}
                  </div>
                </motion.div>

                <div className="md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                  <motion.h2 
                    layoutId={`title-${selectedFood.id}`}
                    className="text-3xl sm:text-4xl font-heading font-bold text-vanaj-red mb-6"
                  >
                    {selectedFood.name}
                  </motion.h2>

                  <div className="space-y-6 font-body text-vanaj-dark">
                    <div className="flex items-start gap-3">
                      <Leaf className="text-vanaj-green shrink-0 mt-1" size={20} />
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide text-vanaj-green">Ingredients</h4>
                        <p className="mt-1">{selectedFood.ingredients}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <ChefHat className="text-vanaj-ochre shrink-0 mt-1" size={20} />
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide text-vanaj-ochre">How it's made</h4>
                        <p className="mt-1 leading-relaxed">{selectedFood.howItsMade}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="text-vanaj-red shrink-0 mt-1" size={20} />
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide text-vanaj-red">Best Season</h4>
                        <p className="mt-1">{selectedFood.season}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="text-vanaj-green shrink-0 mt-1" size={20} />
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide text-vanaj-green">Region</h4>
                        <p className="mt-1">{selectedFood.district}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
