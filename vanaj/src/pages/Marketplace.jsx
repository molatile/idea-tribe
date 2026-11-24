import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import FeedbackSection from '../components/shared/FeedbackSection';
import { getItemLikes, toggleItemLike } from '../utils/storage';
import { Heart, ShoppingBag } from 'lucide-react';
import CheckoutModal from '../components/marketplace/CheckoutModal';
import {
  clothesData,
  ornamentsData,
  handicraftsData,
  bambooCraftsData,
  necklacesData
} from '../data/marketplaceData';

const ImageViewer = ({ item, onClose, onNext, onPrev, onAddToCart, onBuyNow }) => {
  const [loadedSrc, setLoadedSrc] = useState('');
  if (!item) return null;
  const isLoaded = loadedSrc === item.image;

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
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-stone-600 border-t-[#C68537] rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              key={item.image}
              src={item.image} 
              alt={item.name} 
              loading="lazy"
              decoding="async"
              onLoad={() => setLoadedSrc(item.image)}
              className={`w-full h-full cursor-zoom-in transition-all duration-300 hover:scale-[1.02] ${isLoaded ? 'opacity-100' : 'opacity-0'} ${item.image.includes('clothes') ? 'object-contain md:object-cover' : 'object-contain'}`}
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
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-2 leading-tight">
              {item.name}
            </h2>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-[#C68537]">{item.discountPrice || item.price}</span>
              {item.discountPrice && item.discountPrice !== item.price && (
                <span className="text-lg text-stone-400 line-through">{item.price}</span>
              )}
            </div>
            
            <div className="space-y-6 flex-grow">
              <div>
                <h4 className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-2">Description</h4>
                <p className="text-stone-300 leading-relaxed text-[15px] font-light">
                  {item.description}
                </p>
              </div>
              
              {item.significance && (
              <div>
                <h4 className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-2">Cultural Significance</h4>
                <p className="text-stone-300 leading-relaxed text-[15px] font-light italic border-l-2 border-[#C68537]/50 pl-4">
                  "{item.significance}"
                </p>
              </div>
              )}
              
              {item.materials && (
              <div>
                <h4 className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-2">Materials Used</h4>
                <p className="text-stone-300 leading-relaxed text-[15px] font-light flex items-center">
                  <svg className="w-4 h-4 mr-2 text-[#C68537]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item.materials}
                </p>
              </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <button 
                className="flex-1 flex items-center justify-center bg-[#C68537] text-white px-5 py-3.5 rounded-xl font-medium hover:bg-[#b0742f] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#C68537]/20"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (onBuyNow) {
                    onBuyNow(item);
                  } else {
                    onAddToCart(item);
                  }
                }}
              >
                Buy Now
              </button>
              <button 
                className="flex-1 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-xl font-medium transition-all transform hover:-translate-y-0.5 border border-white/20 gap-2"
                onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <a 
                href={`https://wa.me/1234567890?text=I'm interested in the ${item.name} from the Marketplace.`}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3.5 flex items-center justify-center bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#20bd5a] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#25D366]/20"
                title="WhatsApp Inquiry"
              >
                <svg className="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return parseInt(priceStr.replace(/[^\d]/g, ''), 10);
};

const CartSidebar = ({ cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, onProceedToCheckout }) => {
    if (!isCartOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
                <div className="flex items-center justify-between p-6 border-b border-stone-100">
                    <h2 className="text-2xl font-playfair font-bold text-[#1A1A1A]">Your Cart ({cart.reduce((a,b)=>a+b.quantity, 0)})</h2>
                    <button id="close-cart-btn" aria-label="Close cart" onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors cursor-pointer">
                        <svg className="w-6 h-6 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="text-center text-stone-500 mt-10">Your cart is empty.</div>
                    ) : (
                        cart.map(item => (
                            <div key={`${item.name}-${item.id}`} className="flex gap-4 items-center">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-stone-100" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-[#1A1A1A] line-clamp-1">{item.name}</h4>
                                    <div className="text-[#C68537] font-semibold">{item.discountPrice || item.price}</div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <button onClick={() => updateQuantity(item, item.quantity - 1)} className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50">-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item, item.quantity + 1)} className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50">+</button>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
                
                {cart.length > 0 && (
                    <div className="p-6 border-t border-stone-100 bg-stone-50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-stone-600 font-medium">Total</span>
                            <span className="text-2xl font-bold text-[#1A1A1A]">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <button 
                            onClick={() => {
                                setIsCartOpen(false);
                                if (onProceedToCheckout) onProceedToCheckout();
                            }}
                            className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-medium hover:bg-[#C68537] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const CartFloatingButton = ({ cartItemCount, setIsCartOpen }) => (
    <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-24 right-6 sm:bottom-28 sm:right-8 z-[75] bg-[#1A1A1A] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:bg-[#C68537] transition-all transform hover:scale-110 flex items-center justify-center border border-white/10"
        title="View Shopping Cart"
        aria-label="View Shopping Cart"
    >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                {cartItemCount}
            </span>
        )}
    </button>
);

const ProductCard = ({ item, isClothes, onSelect, onDirectBuy, onAddToCart, isLiked, onToggleLike }) => {
    const [loadedSrc, setLoadedSrc] = useState('');
    const isLoaded = loadedSrc === item.image;

    return (
        <div 
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-500 group flex flex-col h-full cursor-pointer transform hover:-translate-y-1"
            onClick={onSelect}
        >
            {/* Product Image Area */}
            <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden flex items-center justify-center">
                {!isLoaded && (
                    <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-stone-300 border-t-[#C68537] rounded-full animate-spin opacity-50"></div>
                    </div>
                )}
                
                <img
                    key={item.image}
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setLoadedSrc(item.image)}
                    className={`w-full h-full transition-all duration-500 group-hover:scale-110 ${
                        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    } ${isClothes ? 'object-cover' : 'object-contain p-4'}`}
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
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 leading-tight group-hover:text-[#C68537] transition-colors line-clamp-1">{item.name}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-[#1A1A1A]">{item.discountPrice || item.price}</span>
                    {item.discountPrice && item.discountPrice !== item.price && (
                        <span className="text-sm text-stone-400 line-through">{item.price}</span>
                    )}
                </div>

                {!isClothes ? (
                    <>
                        <p className="text-stone-500 text-sm mb-1 line-clamp-1 font-light">
                            <span className="font-semibold text-stone-600">Materials:</span> {item.materials}
                        </p>
                        <p className="text-stone-500 text-sm mb-4 line-clamp-1 flex-grow font-light">
                            <span className="font-semibold text-stone-600">Significance:</span> {item.significance}
                        </p>
                    </>
                ) : (
                    <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow font-light">
                        {item.description}
                    </p>
                )}
                
                <div className="mt-auto flex items-center justify-between gap-2">
                    <button 
                        className="flex-1 bg-[#1A1A1A] text-white py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-[#C68537] transition-all shadow-sm hover:shadow-md text-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDirectBuy(item);
                        }}
                    >
                        Buy Now
                    </button>
                    <button
                        type="button"
                        className="p-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-600 hover:text-[#C68537] hover:border-[#C68537] transition-all active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                        }}
                        title="Add to cart"
                    >
                        <ShoppingBag size={18} />
                    </button>
                    <button
                        type="button"
                        className={`p-2.5 rounded-lg border transition-all active:scale-95 ${
                            isLiked
                                ? 'bg-amber-500/15 text-[#C68537] border-[#C68537]'
                                : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-900'
                        }`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleLike(item.id);
                        }}
                        title="Save to favorites"
                    >
                        <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                    </button>
                    <a 
                        href={`https://wa.me/1234567890?text=I'm interested in the ${item.name} from the Marketplace.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-all shadow-sm hover:shadow-md"
                        onClick={(e) => e.stopPropagation()}
                        title="Contact via WhatsApp"
                    >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

const Marketplace = () => {
    const [searchParams] = useSearchParams();
    const tabs = ['Clothes', 'Ornaments', 'Necklaces', 'Handicrafts', 'Bamboo Crafts'];
    const [activeTab, setActiveTab] = useState('Clothes');
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [marketLikes, setMarketLikes] = useState(() => getItemLikes('marketplace'));

    // Safe cart initialization with try/catch
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('marketplace_cart');
            if (!savedCart) return [];
            const parsed = JSON.parse(savedCart);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.warn('Could not read marketplace_cart from localStorage:', e);
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Safe cart sync to localStorage with try/catch
    useEffect(() => {
        try {
            localStorage.setItem('marketplace_cart', JSON.stringify(cart));
        } catch (e) {
            console.warn('Could not save marketplace_cart to localStorage:', e);
        }
    }, [cart]);

    const addToCart = (item) => {
        if (!item) return;
        setCart(prev => {
            const safePrev = Array.isArray(prev) ? prev : [];
            const existing = safePrev.find(i => i.id === item.id && i.name === item.name);
            if (existing) {
                return safePrev.map(i => i.id === item.id && i.name === item.name ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
            }
            return [...safePrev, { ...item, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (itemToRemove) => {
        setCart(prev => (Array.isArray(prev) ? prev : []).filter(i => !(i.id === itemToRemove.id && i.name === itemToRemove.name)));
    };

    const updateQuantity = (itemToUpdate, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prev => (Array.isArray(prev) ? prev : []).map(i => (i.id === itemToUpdate.id && i.name === itemToUpdate.name) ? { ...i, quantity: newQuantity } : i));
    };

    const handleToggleMarketLike = (itemId) => {
        toggleItemLike('marketplace', itemId, 28);
        setMarketLikes(getItemLikes('marketplace'));
    };

    // Tab and URL query param handler + Check for pending actions
    useEffect(() => {
        const tabParam = searchParams.get('tab') || searchParams.get('category');
        if (tabParam) {
            const normalized = tabParam.toLowerCase().replace(/[\s+_]+/g, '');
            const found = tabs.find(t => t.toLowerCase().replace(/[\s+_]+/g, '') === normalized);
            if (found) {
                setActiveTab(found);
            }
        }
        if (searchParams.get('openCart') === 'true') {
            setIsCartOpen(true);
        }
        if (searchParams.get('checkout') === 'true') {
            try {
                const saved = localStorage.getItem('marketplace_cart');
                const parsed = saved ? JSON.parse(saved) : [];
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setCheckoutItems(parsed);
                }
            } catch {}
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
        }

        // Process any pending action stored before this page mounted
        try {
            const rawPending = sessionStorage.getItem('vanaj_pending_action');
            if (rawPending) {
                const pending = JSON.parse(rawPending);
                if (pending && (pending.type === 'ADD_TO_CART' || pending.action === 'ADD')) {
                    if (pending.item) {
                        addToCart(pending.item);
                    } else {
                        setIsCartOpen(true);
                    }
                } else if (pending && (pending.type === 'OPEN_CART' || pending.action === 'OPEN')) {
                    setIsCartOpen(true);
                } else if (pending && (pending.type === 'CHECKOUT' || pending.action === 'CHECKOUT')) {
                    try {
                        const saved = localStorage.getItem('marketplace_cart');
                        const parsed = saved ? JSON.parse(saved) : [];
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setCheckoutItems(parsed);
                        }
                    } catch {}
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                } else if (pending && (pending.type === 'CLEAR_CART' || pending.action === 'CLEAR')) {
                    setCart([]);
                } else if (pending && (pending.type === 'SWITCH_TAB' || pending.tab)) {
                    const targetTab = pending.tab || 'Clothes';
                    const found = tabs.find(t => t.toLowerCase() === targetTab.toLowerCase());
                    if (found) setActiveTab(found);
                } else if (pending && (pending.type === 'REMOVE_FROM_CART' || pending.action === 'REMOVE')) {
                    const itemKey = (pending.itemKey || 'shirt').toLowerCase();
                    setCart(prev => (Array.isArray(prev) ? prev : []).filter(i => 
                        !(i.name.toLowerCase().includes(itemKey) || (itemKey.includes('shirt') && /cloth|shirt|kurta|attire/i.test(i.name)))
                    ));
                    setIsCartOpen(true);
                }
                sessionStorage.removeItem('vanaj_pending_action');
            }
        } catch (e) {
            console.warn('Error processing pending cart action:', e);
        }
    }, [searchParams]);

    // Live Voice assistant event listener when Marketplace is mounted
    useEffect(() => {
        const handleVoiceCartAction = (e) => {
            const detail = e.detail || {};
            if (detail.action === 'ADD' && detail.item) {
                addToCart(detail.item);
            } else if (detail.action === 'OPEN') {
                setIsCartOpen(true);
            } else if (detail.action === 'CHECKOUT') {
                if (cart && cart.length > 0) {
                    setCheckoutItems(cart);
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                } else if (detail.item) {
                    setCheckoutItems([{ ...detail.item, quantity: 1 }]);
                    setIsCheckoutOpen(true);
                } else {
                    setIsCartOpen(true);
                }
            } else if (detail.action === 'CLEAR') {
                setCart([]);
            } else if (detail.action === 'REMOVE') {
                const itemKey = (detail.itemKey || 'shirt').toLowerCase();
                setCart(prev => (Array.isArray(prev) ? prev : []).filter(i => 
                    !(i.name.toLowerCase().includes(itemKey) || (itemKey.includes('shirt') && /cloth|shirt|kurta|attire/i.test(i.name)))
                ));
                setIsCartOpen(true);
            }
        };

        const handleVoiceTabAction = (e) => {
            const tab = e.detail?.tab;
            if (tab) {
                const found = tabs.find(t => t.toLowerCase() === tab.toLowerCase());
                if (found) setActiveTab(found);
            }
        };

        window.addEventListener('vanaj:cart-action', handleVoiceCartAction);
        window.addEventListener('vanaj:marketplace-tab', handleVoiceTabAction);
        return () => {
            window.removeEventListener('vanaj:cart-action', handleVoiceCartAction);
            window.removeEventListener('vanaj:marketplace-tab', handleVoiceTabAction);
        };
    }, [cart]);

    const cartTotal = cart.reduce((total, item) => total + parsePrice(item.discountPrice || item.price) * item.quantity, 0);
    const cartItemCount = cart.reduce((a,b)=>a+b.quantity, 0);

    const handleDirectBuy = (item) => {
        setCheckoutItems([{ ...item, quantity: 1 }]);
        setIsCheckoutOpen(true);
    };

    const handleCartCheckout = () => {
        if (cart.length === 0) return;
        setCheckoutItems(cart);
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };

    const handleOrderSuccess = () => {
        const purchasedIds = new Set(checkoutItems.map(i => `${i.name}-${i.id}`));
        setCart(prev => prev.filter(i => !purchasedIds.has(`${i.name}-${i.id}`)));
    };

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

    const activeData = activeTab === 'Clothes' ? clothesData : (activeTab === 'Ornaments' ? ornamentsData : (activeTab === 'Necklaces' ? necklacesData : (activeTab === 'Handicrafts' ? handicraftsData : (activeTab === 'Bamboo Crafts' ? bambooCraftsData : []))));

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
            <CartFloatingButton cartItemCount={cartItemCount} setIsCartOpen={setIsCartOpen} />
            <CartSidebar 
                cart={cart} 
                isCartOpen={isCartOpen} 
                setIsCartOpen={setIsCartOpen} 
                removeFromCart={removeFromCart} 
                updateQuantity={updateQuantity} 
                cartTotal={cartTotal} 
                onProceedToCheckout={handleCartCheckout} 
            />
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
                            onClick={() => {
                                setActiveTab(tab);
                                setSelectedImageIndex(null);
                            }}
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
                    <motion.div 
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                    >
                        {activeData.map((item, index) => (
                            <ProductCard
                                key={item.id}
                                item={item}
                                isClothes={activeTab === 'Clothes'}
                                onSelect={() => setSelectedImageIndex(index)}
                                onDirectBuy={handleDirectBuy}
                                onAddToCart={addToCart}
                                isLiked={Boolean(marketLikes[item.id]?.liked)}
                                onToggleLike={handleToggleMarketLike}
                            />
                        ))}
                    </motion.div>
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

            {/* Cultural Feedback & Patron Reviews Section */}
            <FeedbackSection vertical="marketplace" theme="light" />

            {/* Image Viewer Modal */}
            {selectedImageIndex !== null && (
                <ImageViewer 
                    item={activeData[selectedImageIndex]} 
                    items={activeData}
                    onClose={() => setSelectedImageIndex(null)}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onAddToCart={addToCart}
                    onBuyNow={(item) => {
                        setSelectedImageIndex(null);
                        handleDirectBuy(item);
                    }}
                />
            )}

            {/* EmailJS Automatic Receipt Checkout Modal */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                items={checkoutItems && checkoutItems.length > 0 ? checkoutItems : cart}
                onOrderSuccess={handleOrderSuccess}
            />
        </div>
    );
};

export default Marketplace;
