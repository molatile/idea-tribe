import React, { useState, useEffect } from 'react';

const clothesData = [
  {
    id: 1,
    name: 'Asur Tribe Clothing',
    tribe: 'Asur Tribe',
    description: 'Traditional Asur tribe clothing featuring distinct indigenous weaving patterns and earth-toned colors reflecting their deep connection to nature and their iron-smelting heritage.',
    significance: 'Worn during significant community gatherings and festivals to honor ancestral spirits and preserve their unique cultural identity.',
    materials: 'Locally sourced cotton and natural dyes',
    price: '₹1,299',
    discountPrice: '₹899',
    image: '/models/clothes/asur cloth.png'
  },
  {
    id: 2,
    name: 'Ho Tribe Clothing',
    tribe: 'Ho Tribe',
    description: 'Vibrant and intricate Ho tribe attire, characterized by elegant borders and traditional motifs that narrate stories of their agrarian lifestyle.',
    significance: 'An essential part of the Mage Porob festival and marriage ceremonies, symbolizing purity and community solidarity.',
    materials: 'Handwoven cotton threads',
    price: '₹1,499',
    discountPrice: '₹999',
    image: '/models/clothes/ho cloth.png'
  },
  {
    id: 3,
    name: 'Kharia Tribe Clothing',
    tribe: 'Kharia Tribe',
    description: 'Graceful Kharia tribe garments adorned with simple yet striking geometric patterns, embodying their minimalist yet culturally rich traditions.',
    significance: 'Represents a harmonious relationship with the forest and is primarily worn during the Jangkor festival.',
    materials: 'Coarse cotton and natural plant-based dyes',
    price: '₹1,199',
    discountPrice: '₹799',
    image: '/models/clothes/kharia cloth.png'
  },
  {
    id: 4,
    name: 'Khortha Tribe Clothing',
    tribe: 'Khortha Tribe',
    description: 'Beautifully crafted Khortha clothing, showcasing the vibrant cultural blend of the Chota Nagpur plateau through vivid colors and comfortable drapes.',
    significance: 'A symbol of festive joy, frequently worn during Karam and Tusu festivals to celebrate harvest and brotherhood.',
    materials: 'Cotton blend with intricate thread work',
    price: '₹1,399',
    discountPrice: '₹899',
    image: '/models/clothes/khortha cloth.png'
  },
  {
    id: 5,
    name: 'Kurukh Tribe Clothing',
    tribe: 'Kurukh Tribe',
    description: 'Distinctive Kurukh tribe apparel featuring traditional red and white borders, signifying auspiciousness and community pride.',
    significance: 'Integral to the Sarhul festival, celebrating the blossoming of the Sal trees and the union of earth and sun.',
    materials: 'Hand-spun cotton',
    price: '₹1,599',
    discountPrice: '₹1,099',
    image: '/models/clothes/kurukh cloth.png'
  },
  {
    id: 6,
    name: 'Munda Tribe Clothing',
    tribe: 'Munda Tribe',
    description: 'Classic Munda tribe garments, beautifully woven with deep cultural motifs and vibrant borders that stand out against earthy base colors.',
    significance: 'Worn proudly during the Baa (flower) festival and other rituals honoring the supreme deity Singbonga.',
    materials: 'Pure cotton with traditional embroidery',
    price: '₹1,499',
    discountPrice: '₹949',
    image: '/models/clothes/munda cloth.png'
  },
  {
    id: 7,
    name: 'Oraon Tribe Clothing',
    tribe: 'Oraon Tribe',
    description: 'Elegant Oraon traditional wear, reflecting their vibrant agricultural festivals and rich heritage through symbolic weaving styles.',
    significance: 'Signifies cultural vitality and is the central attire during major agricultural and social celebrations like Karma.',
    materials: 'Cotton and sustainable natural fibers',
    price: '₹1,599',
    discountPrice: '₹1,049',
    image: '/models/clothes/oraon cloth.png'
  },
  {
    id: 8,
    name: 'Santhali Tribe Clothing',
    tribe: 'Santhali Tribe',
    description: 'Iconic Santhali clothing, famous for its elegant Phuta Kacha style and striking check patterns that hold profound historical value.',
    significance: 'A symbol of Santhal identity, worn during the Baha festival and Sohrai to honor nature and ancestors.',
    materials: 'High-quality cotton with natural indigo and madder dyes',
    price: '₹1,699',
    discountPrice: '₹1,199',
    image: '/models/clothes/santhali cloth.png'
  }
];

const ornamentsData = [
  {
    id: 1,
    name: 'Tribal Armlet',
    tribe: 'Various Tribes',
    description: 'A beautifully crafted traditional armlet worn during festivals and special occasions.',
    significance: 'Symbolizes strength and serves as a protective charm in tribal culture.',
    materials: 'Brass and mixed metals',
    image: '/models/ornaments/armlet.png'
  },
  {
    id: 2,
    name: 'Banki (traditional bracelet)',
    tribe: 'Santhal & Ho Tribes',
    description: 'An elegant traditional bracelet known as Banki, featuring intricate tribal motifs.',
    significance: 'Worn by women as a symbol of marital bliss and prosperity.',
    materials: 'Silver and bell metal',
    image: '/models/ornaments/banki.png'
  },
  {
    id: 3,
    name: 'Tribal Finger Ring',
    tribe: 'Various Tribes',
    description: 'A distinctive tribal finger ring with unique geometric patterns.',
    significance: 'Often passed down through generations as a family heirloom.',
    materials: 'Silver and copper alloy',
    image: '/models/ornaments/finger%20ring.png'
  },
  {
    id: 4,
    name: 'Hair Ornament',
    tribe: 'Munda & Oraon Tribes',
    description: 'A traditional hair ornament that adds grace to tribal dance attires.',
    significance: 'Worn during the Karma festival to represent the beauty of nature.',
    materials: 'Brass and natural beads',
    image: '/models/ornaments/hair%20ornament.png'
  },
  {
    id: 5,
    name: 'Hair Pin',
    tribe: 'Various Tribes',
    description: 'An intricately designed hair pin used to secure traditional buns.',
    significance: 'A daily wear ornament that also serves to reflect the artisan\'s craftsmanship.',
    materials: 'Silver and bronze',
    image: '/models/ornaments/hair%20pin.png'
  },
  {
    id: 6,
    name: 'Khadag',
    tribe: 'Santhal Tribe',
    description: 'A heavy traditional solid bracelet worn by tribal women.',
    significance: 'Represents social status and is a key part of bridal jewelry.',
    materials: 'Bell metal',
    image: '/models/ornaments/khadag.png'
  },
  {
    id: 7,
    name: 'Kundri (earring)',
    tribe: 'Ho & Kharia Tribes',
    description: 'Classic Kundri earrings featuring hanging floral designs.',
    significance: 'Enhances facial beauty and is believed to ward off evil spirits.',
    materials: 'Silver and brass',
    image: '/models/ornaments/kundri.png'
  },
  {
    id: 8,
    name: 'Tribal Nose Ring',
    tribe: 'Various Tribes',
    description: 'A prominent tribal nose ring with delicate detailing.',
    significance: 'An essential bridal ornament symbolizing purity and womanhood.',
    materials: 'Silver',
    image: '/models/ornaments/nose%20ring.png'
  },
  {
    id: 9,
    name: 'Panwari',
    tribe: 'Oraon Tribe',
    description: 'A beautiful Panwari ornament featuring ethnic tribal patterns.',
    significance: 'Used in traditional ceremonies and harvest dances.',
    materials: 'Mixed metal alloy',
    image: '/models/ornaments/panwari.png'
  },
  {
    id: 10,
    name: 'Tribal Waist Belt',
    tribe: 'Various Tribes',
    description: 'A traditional ornate waist belt worn over tribal sarees.',
    significance: 'Highlights the traditional attire and represents the vitality of the wearer.',
    materials: 'Silver and bells',
    image: '/models/ornaments/waist%20belt.png'
  }
];

const handicraftsData = [
  {
    id: 1,
    name: 'Dhokra Tribal Family Figurine',
    tribe: 'Various Tribes',
    description: 'A beautiful handmade Dhokra metal craft depicting a traditional tribal family.',
    significance: 'Dhokra is an ancient bell metal craft practiced by indigenous artisans, representing traditional family bonds.',
    materials: 'Bell metal (Dhokra)',
    image: '/models/handicrafts/dhokra%20tribal%20family%20figurine.png'
  },
  {
    id: 2,
    name: 'Dhokra Tribal Family Sculpture',
    tribe: 'Various Tribes',
    description: 'An intricately detailed sculpture of a tribal family, created using the lost-wax casting technique.',
    significance: 'Preserves the ancient heritage of Dhokra art and portrays everyday tribal life.',
    materials: 'Bell metal (Dhokra)',
    image: '/models/handicrafts/dhokra%20tribal%20family%20sculpture.png'
  },
  {
    id: 3,
    name: 'Dhokra Tribal Musician Sculpture',
    tribe: 'Various Tribes',
    description: 'A charming sculpture of a tribal musician playing a traditional instrument.',
    significance: 'Celebrates the rich musical traditions and festive spirit of indigenous communities.',
    materials: 'Bell metal (Dhokra)',
    image: '/models/handicrafts/dhokra%20tribal%20musician%20sculpture.png'
  },
  {
    id: 4,
    name: 'Terracotta Tribal Dancer Sculpture',
    tribe: 'Various Tribes',
    description: 'A vibrant terracotta sculpture capturing the graceful movements of a tribal dancer.',
    significance: 'Honors the traditional dance forms that are integral to tribal festivals and rituals.',
    materials: 'Terracotta clay',
    image: '/models/handicrafts/terracotta%20tribal%20dancer%20sculpture.png'
  },
  {
    id: 5,
    name: 'Tribal Bird Terracotta Vessel',
    tribe: 'Various Tribes',
    description: 'A unique terracotta vessel adorned with tribal bird motifs.',
    significance: 'Reflects the close relationship between tribal communities and nature.',
    materials: 'Terracotta clay',
    image: '/models/handicrafts/tribal%20bird%20terracotta%20vessel.png'
  },
  {
    id: 6,
    name: 'Tribal Folk Drummer Figurine',
    tribe: 'Various Tribes',
    description: 'A beautifully crafted figurine of a tribal folk drummer in action.',
    significance: 'Represents the heartbeat of tribal celebrations and the importance of rhythm in their culture.',
    materials: 'Terracotta / Mixed materials',
    image: '/models/handicrafts/tribal%20folk%20drummer%20figurine.png'
  },
  {
    id: 7,
    name: 'Tribal Terracotta Ceremonial Pot',
    tribe: 'Various Tribes',
    description: 'An ornate terracotta pot used in traditional tribal ceremonies.',
    significance: 'Holds sacred significance in rituals, often used to store offerings during festivals.',
    materials: 'Terracotta clay',
    image: '/models/handicrafts/tribal%20terracotta%20ceremonial%20pot.png'
  },
  {
    id: 8,
    name: 'Warli Tribal Wall Hanging',
    tribe: 'Warli / Various Tribes',
    description: 'A decorative wall hanging featuring traditional tribal art motifs.',
    significance: 'Brings the stories and daily life scenes of tribal communities into the home.',
    materials: 'Wood, canvas, and natural pigments',
    image: '/models/handicrafts/warli%20tribal%20wall%20hanging.png'
  },
  {
    id: 9,
    name: 'Wooden Tribal Ceremonial Mask',
    tribe: 'Various Tribes',
    description: 'A striking hand-carved wooden mask used in traditional ceremonies.',
    significance: 'Worn during ritualistic dances to embody spirits and deities, protecting the community.',
    materials: 'Wood and natural colors',
    image: '/models/handicrafts/wooden%20tribal%20ceremonial%20mask.png'
  }
];

const ImageViewer = ({ item, items, onClose, onNext, onPrev }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0D1F17]/95 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen py-10 px-4 md:px-8 w-full flex items-center justify-center">
        <div className="relative w-full max-w-6xl bg-stone-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-[#C68537]/20">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2.5 bg-black/50 hover:bg-[#C68537] text-white rounded-full transition-all border border-white/10 hover:border-transparent group"
            aria-label="Close Viewer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Section */}
          <div className="w-full md:w-3/5 h-[40vh] md:h-[80vh] bg-black relative group flex items-center justify-center">
            <img 
              src={item.image} 
              alt={item.name} 
              className={`w-full h-full cursor-zoom-in transition-transform duration-500 hover:scale-[1.02] ${item.image.includes('clothes') ? 'object-contain md:object-cover' : 'object-contain'}`}
            />
            
            {/* Navigation Arrows */}
            <button 
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-[#C68537] text-white rounded-full backdrop-blur transition-all border border-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100 -translate-x-4 group-hover:translate-x-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-[#C68537] text-white rounded-full backdrop-blur transition-all border border-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100 translate-x-4 group-hover:translate-x-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-stone-900 to-[#121a16] text-white">
            <div className="text-sm font-semibold uppercase tracking-widest text-[#C68537] mb-3 flex items-center">
              <span className="w-8 h-px bg-[#C68537] mr-3"></span>
              {item.tribe}
            </div>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-6 leading-tight">
              {item.name}
            </h2>
            
            <div className="space-y-6 flex-grow">
              <div>
                <h4 className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-2">Description</h4>
                <p className="text-stone-300 leading-relaxed text-[15px] font-light">
                  {item.description}
                </p>
              </div>
              
              <div>
                <h4 className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-2">Cultural Significance</h4>
                <p className="text-stone-300 leading-relaxed text-[15px] font-light italic border-l-2 border-[#C68537]/50 pl-4">
                  "{item.significance}"
                </p>
              </div>
              
              <div>
                <h4 className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-2">Materials Used</h4>
                <p className="text-stone-300 leading-relaxed text-[15px] font-light flex items-center">
                  <svg className="w-4 h-4 mr-2 text-[#C68537]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item.materials}
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <a 
                href={`https://wa.me/1234567890?text=I'm interested in the ${item.name} from the Marketplace.`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-[#25D366] text-white px-6 py-4 rounded-xl font-medium hover:bg-[#20bd5a] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#25D366]/20"
              >
                <svg className="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Contact via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Marketplace = () => {
    const tabs = ['Clothes', 'Ornaments', 'Necklaces', 'Handicrafts', 'Bamboo Crafts'];
    const [activeTab, setActiveTab] = useState('Clothes');
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    // Prevent body scroll when viewer is open
    useEffect(() => {
        if (selectedImageIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedImageIndex]);

    const activeData = activeTab === 'Clothes' ? clothesData : (activeTab === 'Ornaments' ? ornamentsData : (activeTab === 'Handicrafts' ? handicraftsData : []));

    const handleNext = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex + 1) % activeData.length);
        }
    };

    const handlePrev = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex - 1 + activeData.length) % activeData.length);
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-stone-50 pb-20">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-[#1A1A1A] mb-4">
                        Marketplace
                    </h1>
                    <p className="text-stone-600 max-w-2xl mx-auto">
                        Discover authentic tribal craftsmanship. Support indigenous artisans directly.
                    </p>
                </div>
                
                {/* Tabs */}
                <div className="flex overflow-x-auto pb-4 mb-10 space-x-3 md:justify-center scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                                activeTab === tab
                                    ? 'bg-[#C68537] text-white shadow-md transform scale-105'
                                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                            }`}
                        >
                            {tab === 'Clothes' && '👗 '}
                            {tab === 'Ornaments' && '💍 '}
                            {tab === 'Necklaces' && '📿 '}
                            {tab === 'Handicrafts' && '🎨 '}
                            {tab === 'Bamboo Crafts' && '🧺 '}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {activeData.map((item, index) => (
                            <div 
                                key={item.id} 
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-500 group flex flex-col h-full cursor-pointer transform hover:-translate-y-1"
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                {/* Product Image Area */}
                                <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden flex items-center justify-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className={`w-full h-full transition-transform duration-700 group-hover:scale-110 ${activeTab === 'Clothes' ? 'object-cover' : 'object-contain p-4'}`}
                                    />
                                    
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/95 backdrop-blur text-[#1A1A1A] px-6 py-3 rounded-full font-medium shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-[#C68537]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                            View Details
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Product Info */}
                                <div className="p-5 flex flex-col flex-grow bg-white">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-[#C68537] mb-1.5">{item.tribe}</div>
                                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 leading-tight group-hover:text-[#C68537] transition-colors">{item.name}</h3>
                                    
                                    {(activeTab === 'Ornaments' || activeTab === 'Handicrafts') ? (
                                        <>
                                            <p className="text-stone-500 text-sm mb-2 line-clamp-2 font-light">
                                                <span className="font-semibold text-stone-600">Materials:</span> {item.materials}
                                            </p>
                                            <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow font-light">
                                                <span className="font-semibold text-stone-600">Significance:</span> {item.significance}
                                            </p>
                                            <a 
                                                href={`https://wa.me/1234567890?text=I'm interested in the ${item.name} from the Marketplace.`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-auto flex items-center justify-center w-full py-2.5 px-4 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-[#20bd5a] transition-all transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                                Contact via WhatsApp
                                            </a>
                                        </>
                                    ) : (
                                        <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow font-light">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-stone-100 shadow-sm mt-8">
                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-[#1A1A1A] mb-3">
                            Coming Soon
                        </h2>
                        <p className="text-stone-500 max-w-md">
                            We're currently curating the finest {activeTab.toLowerCase()} from our partner tribes. Check back later!
                        </p>
                    </div>
                )}
            </div>

            {/* Image Viewer Modal */}
            {selectedImageIndex !== null && (
                <ImageViewer 
                    item={activeData[selectedImageIndex]} 
                    items={activeData}
                    onClose={() => setSelectedImageIndex(null)}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />
            )}
        </div>
    );
};

export default Marketplace;
