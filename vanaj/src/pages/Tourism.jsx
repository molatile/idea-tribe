import { useState, useEffect } from 'react';
import { Search, MapPin, ArrowLeft, Calendar, Info, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { tourismData } from '../data/tourismData';

// Fix for default marker icon in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Ochre Marker Icon
const ochreMarkerHtml = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#C9952A" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin w-8 h-8">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
`;

const ochreIcon = new L.DivIcon({
  html: ochreMarkerHtml,
  className: 'custom-leaflet-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Helper component to center map on coordinates change
const MapUpdater = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    if (coordinates) {
      map.setView(coordinates, 13);
    }
  }, [coordinates, map]);
  return null;
};

const Filters = ['All', 'Waterfall', 'Wildlife', 'Temple', 'Valley', 'Lake', 'Heritage'];

const Tourism = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Filter logic
  const filteredData = tourismData.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          loc.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || loc.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  if (selectedLocation) {
    return (
      <div className="min-h-screen bg-vanaj-cream pt-20">
        {/* Detail View */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={() => setSelectedLocation(null)}
            className="flex items-center text-vanaj-dark hover:text-vanaj-green transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Destinations
          </button>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-vanaj-dark/10">
            {/* Top Placeholder Image */}
            <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 font-medium">Image Placeholder: {selectedLocation.name}</span>
            </div>

            <div className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl md:text-5xl font-heading text-vanaj-dark mb-3">
                    {selectedLocation.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-vanaj-dark/70 font-medium">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-vanaj-ochre" />
                      {selectedLocation.district}
                    </span>
                    <span className="px-3 py-1 bg-vanaj-dark-cream text-vanaj-dark rounded-full text-sm">
                      {selectedLocation.type}
                    </span>
                  </div>
                </div>
                <button className="px-8 py-3 bg-vanaj-green text-white font-medium rounded-lg hover:bg-vanaj-dark transition-colors disabled:opacity-50 group relative cursor-not-allowed w-full md:w-auto text-center" disabled>
                  <span className="group-hover:opacity-0 transition-opacity">Book Visit</span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">Coming Soon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <h2 className="text-2xl font-heading text-vanaj-dark mb-4 flex items-center">
                      <Info className="w-5 h-5 mr-2 text-vanaj-ochre" /> About
                    </h2>
                    <p className="text-vanaj-dark/80 text-lg leading-relaxed">
                      {selectedLocation.description}
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-heading text-vanaj-dark mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-vanaj-ochre" /> Best Time to Visit
                    </h2>
                    <p className="text-vanaj-dark/80 text-lg">
                      {selectedLocation.bestTime}
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-heading text-vanaj-dark mb-4 flex items-center">
                      <MapIcon className="w-5 h-5 mr-2 text-vanaj-ochre" /> How to Reach
                    </h2>
                    <p className="text-vanaj-dark/80 text-lg">
                      {selectedLocation.howToReach}
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-heading text-vanaj-dark mb-4">
                      Nearby Attractions
                    </h2>
                    <p className="text-vanaj-dark/80 text-lg">
                      {selectedLocation.nearbyAttractions}
                    </p>
                  </section>
                </div>

                <div className="lg:col-span-1">
                  <div className="rounded-xl overflow-hidden border border-vanaj-dark/10 h-80 sticky top-24 shadow-sm z-0">
                    <MapContainer 
                      center={selectedLocation.coordinates} 
                      zoom={13} 
                      scrollWheelZoom={false}
                      className="w-full h-full z-0"
                      style={{ zIndex: 0 }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={selectedLocation.coordinates} icon={ochreIcon} />
                      <MapUpdater coordinates={selectedLocation.coordinates} />
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanaj-cream pt-16">
      {/* Hero Section */}
      <section className="w-full bg-[#1B4332] text-vanaj-cream py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle pattern background for hero if wanted */}
        <div className="absolute inset-0 opacity-10 bg-tribal-pattern"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white mb-6">
            Explore <span className="text-vanaj-ochre">Jharkhand</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-vanaj-cream/90 font-medium">
            Discover the untold stories of nature, wildlife, and ancient heritage in the land of forests.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Search + Filter Bar */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search by location name or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 rounded-xl bg-white border-2 border-vanaj-dark/10 focus:border-vanaj-green focus:outline-none focus:ring-0 transition-colors text-vanaj-dark placeholder:text-vanaj-dark/40 shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vanaj-dark/40 w-5 h-5" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {Filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 border-2 ${
                  activeFilter === filter
                    ? 'bg-vanaj-dark text-white border-vanaj-dark shadow-md'
                    : 'bg-white text-vanaj-dark border-vanaj-dark/10 hover:border-vanaj-dark/30 hover:bg-vanaj-dark-cream'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Location Cards Grid */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((location) => (
              <div 
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-vanaj-dark/5 cursor-pointer group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col"
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-gray-200 w-full flex items-center justify-center overflow-hidden">
                  <span className="text-gray-400 font-medium group-hover:scale-105 transition-transform duration-500">
                    Image: {location.name}
                  </span>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-heading text-vanaj-dark group-hover:text-vanaj-green transition-colors">
                      {location.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-vanaj-cream text-vanaj-dark text-xs font-medium rounded-full whitespace-nowrap ml-3 border border-vanaj-dark/5">
                      {location.type}
                    </span>
                  </div>
                  <div className="flex items-center text-vanaj-dark/60 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1 text-vanaj-ochre" />
                    {location.district}
                  </div>
                  <p className="text-vanaj-dark/80 text-sm line-clamp-2 mt-auto">
                    {location.shortDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-heading text-vanaj-dark mb-2">No locations found</h3>
            <p className="text-vanaj-dark/60">Try adjusting your search or filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
              className="mt-6 px-6 py-2 bg-vanaj-green text-white rounded-lg hover:bg-vanaj-dark transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Tourism;
