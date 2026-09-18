import React, { useState, useEffect } from 'react';

const ModelViewer = ({ modelPath, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0D1F17] overflow-hidden">
      <model-viewer
        src={modelPath}
        auto-rotate
        camera-controls
        shadow-intensity="1"
        style={{ width: '100%', height: '500px', background: '#0D1F17' }}
      >
      </model-viewer>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 md:top-8 md:right-8 z-10 p-3 bg-black/40 hover:bg-black/80 text-white/90 hover:text-white rounded-full backdrop-blur-md transition-all border border-white/10 hover:scale-105"
        aria-label="Close Viewer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const Marketplace = () => {
    const tabs = ['Clothes', 'Ornaments', 'Necklaces', 'Handicrafts', 'Bamboo Crafts'];
    const [activeTab, setActiveTab] = useState('Clothes');
    const [viewerModel, setViewerModel] = useState(null);

    // Prevent body scroll when viewer is open
    useEffect(() => {
        if (viewerModel) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [viewerModel]);

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
                {activeTab === 'Clothes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Product Card */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl transition-shadow duration-300 group flex flex-col h-full">
                            {/* Product Image Area */}
                            <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                                {/* Thumbnail Image */}
                                <model-viewer
                                    src="/models/clothes/adivasi_pride_tshirt_new.glb"
                                    auto-rotate
                                    camera-controls
                                    shadow-intensity="1"
                                    style={{ width: '100%', height: '100%', background: '#f5edd9' }}
                                    disable-zoom
                                    className="absolute inset-0 w-full h-full"
                                >
                                </model-viewer>
                                
                                {/* 3D Badge */}
                                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur text-[#C68537] text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                    </svg>
                                    3D View
                                </div>

                                {/* 3D View Button Overlay */}
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <button 
                                        onClick={() => setViewerModel('/models/clothes/adivasi_pride_tshirt_new.glb')}
                                        className="bg-[#C68537] text-white px-6 py-3 rounded-full font-medium shadow-xl transform transition-transform hover:scale-105 active:scale-95 flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View in 3D
                                    </button>
                                </div>
                            </div>
                            
                            {/* Product Info */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="text-xs font-semibold uppercase tracking-wider text-[#C68537] mb-2">Warli Tribe</div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Adivasi Pride T-Shirt</h3>
                                <p className="text-stone-500 text-sm mb-6 line-clamp-2 flex-grow">
                                    Premium cotton t-shirt featuring authentic tribal motifs. Connect with heritage through modern fashion.
                                </p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-stone-400 font-medium line-through">₹1,299</span>
                                        <span className="text-2xl font-bold text-[#1A1A1A]">₹899</span>
                                    </div>
                                    <a 
                                        href="https://wa.me/1234567890" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center bg-[#25D366] text-white px-5 py-2.5 rounded-full font-medium hover:bg-[#20bd5a] transition-colors shadow-sm"
                                    >
                                        <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                        Order
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Coming Soon for other tabs */}
                {activeTab !== 'Clothes' && (
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

            {/* 3D Viewer Modal */}
            {viewerModel && (
                <ModelViewer 
                    modelPath={viewerModel} 
                    onClose={() => setViewerModel(null)} 
                />
            )}
        </div>
    );
};

export default Marketplace;
