import React from 'react';
import { motion } from 'framer-motion';
import { User, Handshake, MapPin, Palette, Coins, Wallet, PieChart } from 'lucide-react';

const OpportunitySection = () => {
  const tourismData = [
    { year: 2019, val: 3.56, label: '3.56 Cr' },
    { year: 2020, val: 0.26, label: '0.26 Cr' },
    { year: 2021, val: 0.34, label: '0.34 Cr' },
    { year: 2022, val: 3.83, label: '3.83 Cr' },
    { year: 2023, val: 3.58, label: '3.58 Cr' },
    { year: 2024, val: 5.40, label: '5.40 Cr' },
  ];

  const clusterData = [
    { name: 'Bamboo Craft (West Singhbhum)', count: 1048 },
    { name: 'Bishnugarh Brass & Bronze (Hazaribagh)', count: 832 },
    { name: 'Bamboo Craft (Ramgarh)', count: 820 },
    { name: 'Bamboo Crafts (Ranchi)', count: 698 },
    { name: 'Gold & Silver Jewellery (Ramgarh)', count: 500 },
    { name: 'Anjeneya Bamboo (East Singhbhum)', count: 405 },
  ];
  const maxCluster = 1100;

  const conversionData = [
    { rate: '0.1%', participants: 54041, label: '54,041', highlight: false },
    { rate: '0.5%', participants: 270204, label: '2.70 Lakh', highlight: false },
    { rate: '1.0%', participants: 540408, label: '5.40 Lakh', highlight: true },
    { rate: '2.0%', participants: 1080816, label: '10.80 Lakh', highlight: false },
  ];
  const maxConversion = 1100000;

  const revenueData = [
    { price: '₹500 / person', revenue: 27.02, label: '₹27.02 Cr' },
    { price: '₹750 / person', revenue: 40.53, label: '₹40.53 Cr' },
    { price: '₹1,000 / person', revenue: 54.04, label: '₹54.04 Cr' },
  ];
  const maxRevenue = 60;

  const flowSteps = [
    { label: 'Tourist', Icon: User },
    { label: 'Tourism Partner', Icon: Handshake },
    { label: 'Tribal Heritage Location', Icon: MapPin },
    { label: 'Hands-on Art Workshop', Icon: Palette },
    { label: 'Artisan Income', Icon: Wallet },
    { label: 'Platform Commission', Icon: PieChart },
  ];

  return (
    <section className="py-32 px-6 bg-[#22130A] relative border-t border-[#3A2015] font-body text-vanaj-cream">
      {/* Background SVG Pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
         <pattern id="opp-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
           <circle cx="30" cy="30" r="1" fill="#C9952A" />
           <path d="M 30 10 L 30 50 M 10 30 L 50 30" stroke="#C9952A" strokeWidth="0.5" strokeDasharray="2 4" />
         </pattern>
         <rect x="0" y="0" width="100%" height="100%" fill="url(#opp-pattern)" />
      </svg>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Intro */}
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-vanaj-ochre text-4xl md:text-5xl font-heading mb-6 drop-shadow-md"
          >
            Turning Tourism Into Cultural Experiences
          </motion.h2>
          <div className="w-16 h-1 bg-vanaj-ochre mx-auto rounded-full shadow-[0_0_10px_rgba(201,149,42,0.8)] mb-8"></div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, delay: 0.2 }}
            className="text-vanaj-cream/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light"
          >
            Jharkhand welcomed more than <strong className="text-white font-medium">5.4 crore domestic tourist visits in 2024</strong>, creating a significant opportunity for authentic, hands-on tribal art experiences.
          </motion.p>
        </div>

        {/* Top 2 Columns: Line Chart and 2025 Stat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Tourism Trend Graph */}
          <div className="lg:col-span-2 bg-[#1A0F08] p-8 md:p-10 rounded-xl border border-[#3A2015] shadow-xl relative overflow-hidden">
             <h3 className="text-2xl font-heading text-white mb-2">Domestic Tourist Visits</h3>
             <p className="text-vanaj-cream/60 text-sm mb-10">Jharkhand — calendar years</p>
             
             <div className="w-full relative">
               <svg viewBox="0 0 500 260" className="w-full h-auto overflow-visible">
                 {/* Grid */}
                 {[0, 1, 2, 3, 4, 5, 6].map(v => (
                   <g key={v}>
                      <line x1="45" y1={200 - (v/6)*180} x2="480" y2={200 - (v/6)*180} stroke="#3A2015" strokeDasharray="4 4" />
                      <text x="35" y={200 - (v/6)*180 + 4} fill="#8B5E3C" fontSize="14" textAnchor="end">{v} Cr</text>
                   </g>
                 ))}
                 
                 {/* Line Path */}
                 <motion.path 
                   initial={{ pathLength: 0 }}
                   whileInView={{ pathLength: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1.5, ease: "easeInOut" }}
                   d={`M ${tourismData.map((d, i) => `${45 + i * 87} ${200 - (d.val/6)*180}`).join(' L ')}`} 
                   fill="none" 
                   stroke="#C9952A" 
                   strokeWidth="3.5" 
                   className="drop-shadow-[0_0_8px_rgba(201,149,42,0.6)]"
                 />

                 {/* Points & Labels */}
                 {tourismData.map((d, i) => (
                    <g key={i} className="group">
                      <circle 
                        cx={45 + i * 87} 
                        cy={200 - (d.val/6)*180} 
                        r="6" 
                        fill="#1A0F08" 
                        stroke="#C9952A" 
                        strokeWidth="2.5" 
                        className="transition-all duration-300 group-hover:r-8 group-hover:fill-[#C9952A]" 
                      />
                      <rect x={45 + i * 87 - 28} y={200 - (d.val/6)*180 - 36} width="56" height="24" rx="4" fill="#2C1A0E" opacity="0.8" />
                      <text x={45 + i * 87} y={200 - (d.val/6)*180 - 19} fill="#FDF0E0" fontSize="14" textAnchor="middle" fontWeight="500">{d.label}</text>
                      <text x={45 + i * 87} y="235" fill="#FDF0E0" fontSize="15" textAnchor="middle">{d.year}</text>
                    </g>
                 ))}
               </svg>
             </div>
             <p className="text-[#8B5E3C] text-xs mt-4">Source: Ministry of Tourism. Calendar-year data.</p>
          </div>

          {/* 2025 Partial-Year Statistic */}
          <div className="bg-gradient-to-br from-[#2C1A0E] to-[#1A0F08] p-8 md:p-10 rounded-xl border border-[#3A2015] shadow-xl flex flex-col justify-center">
            <h3 className="text-xl font-heading text-vanaj-ochre mb-8">Continuing Momentum</h3>
            
            <div className="mb-8">
              <div className="text-sm text-vanaj-cream/60 uppercase tracking-widest mb-2">2024 (Full Year)</div>
              <div className="text-4xl text-white font-light">5.40 <span className="text-xl text-vanaj-cream/70">Cr visits</span></div>
            </div>

            <div className="mb-6 relative">
              <div className="absolute left-0 top-0 w-1 h-full bg-vanaj-ochre rounded-full shadow-[0_0_10px_rgba(201,149,42,0.8)]"></div>
              <div className="pl-6">
                <div className="text-sm text-vanaj-ochre uppercase tracking-widest mb-2 font-medium">Jan–Nov 2025</div>
                <div className="text-5xl text-white font-heading mb-2 drop-shadow-md">5.32 <span className="text-2xl font-body text-vanaj-cream/70 font-light">Cr visits</span></div>
                <p className="text-xs text-vanaj-cream/50 mt-2 italic">* 2025 figure covers January–November only.</p>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-[#3A2015]">
              <p className="text-sm text-vanaj-cream/60">2024 foreign visitors: <span className="text-white">~45,000</span></p>
            </div>
          </div>
        </div>

        {/* Middle Section: Clusters and Workshops */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Artisan Cluster Visualization */}
          <div className="bg-[#1A0F08] p-8 md:p-10 rounded-xl border border-[#3A2015]">
            <h3 className="text-2xl font-heading text-white mb-2">Artisan Clusters</h3>
            <p className="text-vanaj-cream/60 text-sm mb-8 max-w-sm">Documented artisan participation across selected government-supported clusters.</p>
            
            <div className="space-y-5">
              {clusterData.map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-vanaj-cream/90">{c.name}</span>
                    <span className="text-vanaj-ochre font-medium">{c.count}</span>
                  </div>
                  <div className="w-full bg-[#2C1A0E] rounded-full h-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(c.count/maxCluster)*100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      className="h-full bg-[#8B5E3C]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workshop Conversion Opportunity */}
          <div className="bg-[#1A0F08] p-8 md:p-10 rounded-xl border border-vanaj-ochre/30 shadow-[0_0_30px_rgba(201,149,42,0.05)]">
            <h3 className="text-2xl font-heading text-white mb-2">Estimated Workshop Opportunity</h3>
            <p className="text-vanaj-cream/60 text-sm mb-8">Illustrative tourist-to-workshop conversion scenarios based on 2024 domestic visits.</p>
            
            <div className="space-y-6">
              {conversionData.map((c, i) => (
                <div key={i} className={c.highlight ? "p-4 bg-vanaj-ochre/10 border border-vanaj-ochre/40 rounded-lg -mx-4" : ""}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-vanaj-cream/90 font-medium">At {c.rate} Conversion</span>
                    <span className={c.highlight ? "text-vanaj-ochre font-bold text-base" : "text-white font-medium"}>{c.label} <span className="text-vanaj-cream/60 text-xs font-normal">participants</span></span>
                  </div>
                  <div className="w-full bg-[#2C1A0E] rounded-full h-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(c.participants/maxConversion)*100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      className={`h-full ${c.highlight ? 'bg-vanaj-ochre' : 'bg-[#5E3A24]'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-[#8B5E3C] text-xs mt-6 border-t border-[#3A2015] pt-4">
              <strong className="text-vanaj-ochre font-medium">Note:</strong> 1% is a business-planning assumption, not an observed conversion rate.
            </p>
          </div>
        </div>

        {/* Revenue Scenario & Key Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          
          {/* Revenue Graph */}
          <div className="lg:col-span-2 bg-[#1A0F08] p-8 md:p-10 rounded-xl border border-[#3A2015]">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-heading text-white mb-2">Illustrative Workshop Revenue</h3>
                <p className="text-vanaj-cream/60 text-sm">Potential gross revenue at an estimated 5.40 lakh participants.</p>
              </div>
              <span className="inline-block px-3 py-1 bg-[#2C1A0E] text-[#8B5E3C] text-xs rounded-full uppercase tracking-wider border border-[#3A2015]">
                Scenario / Illustrative
              </span>
            </div>
            
            <div className="space-y-7 mt-8">
              {revenueData.map((r, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-vanaj-cream/80 text-sm">{r.price}</span>
                    <span className="text-2xl text-white font-light font-heading tracking-wide">{r.label}</span>
                  </div>
                  <div className="w-full bg-[#2C1A0E] rounded-full h-4 overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(r.revenue/maxRevenue)*100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#5E3A24] to-[#C9952A]"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-[#8B5E3C] text-xs mt-8 italic">
              Based on 5,40,408 participants at the stated workshop price. Does not represent guaranteed demand or revenue.
            </p>
          </div>

          {/* Key Stats Block */}
          <div className="bg-vanaj-ochre p-8 md:p-10 rounded-xl text-vanaj-dark shadow-[0_0_40px_rgba(201,149,42,0.15)] flex flex-col justify-center">
            <h3 className="text-xl font-heading font-bold mb-8 uppercase tracking-widest opacity-80 border-b border-vanaj-dark/20 pb-4">Key Scenario</h3>
            
            <div className="space-y-6">
              <div>
                <div className="text-3xl font-bold font-heading">5.40 Cr</div>
                <div className="text-sm opacity-80 font-medium mt-1">Domestic tourist visits — 2024</div>
              </div>
              
              <div className="pt-4 border-t border-vanaj-dark/10">
                <div className="text-3xl font-bold font-heading">1%</div>
                <div className="text-sm opacity-80 font-medium mt-1">Illustrative conversion assumption*</div>
              </div>
              
              <div className="pt-4 border-t border-vanaj-dark/10">
                <div className="text-3xl font-bold font-heading">5.40 Lakh</div>
                <div className="text-sm opacity-80 font-medium mt-1">Potential participants at 1%*</div>
              </div>
              
              <div className="pt-4 border-t border-vanaj-dark/10">
                <div className="text-3xl font-bold font-heading">₹27.02 Cr</div>
                <div className="text-sm opacity-80 font-medium mt-1">Illustrative gross workshop value (at ₹500)*</div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Model Flow */}
        <div className="mb-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2C1A0E] to-transparent opacity-50 rounded-3xl pointer-events-none"></div>
          <div className="relative z-10 py-12 px-4 md:px-8">
            <h3 className="text-center text-2xl font-heading text-vanaj-ochre mb-12">The Ecosystem Flow</h3>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-2 max-w-5xl mx-auto">
              {flowSteps.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center text-center w-32 group">
                    <div className="w-16 h-16 rounded-full bg-[#1A0F08] border border-[#3A2015] flex items-center justify-center mb-4 text-vanaj-ochre transition-all duration-300 group-hover:scale-110 group-hover:border-vanaj-ochre shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(201,149,42,0.3)]">
                      <step.Icon size={28} />
                    </div>
                    <span className="text-xs text-vanaj-cream/80 font-medium uppercase tracking-wider">{step.label}</span>
                  </div>
                  
                  {i < flowSteps.length - 1 && (
                    <div className="hidden md:flex flex-1 justify-center relative">
                      <div className="w-full h-px bg-[#3A2015] relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-[5px] border-b-[5px] border-l-[5px] border-y-transparent border-l-[#3A2015]"></div>
                      </div>
                    </div>
                  )}
                  {i < flowSteps.length - 1 && (
                    <div className="md:hidden h-8 w-px bg-[#3A2015] relative my-2">
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[5px] border-x-transparent border-t-[#3A2015]"></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Craft Sales Note */}
        <div className="bg-[#1A0F08] border border-[#3A2015] rounded-xl p-8 mb-16 text-center max-w-4xl mx-auto">
          <h4 className="text-lg font-heading text-vanaj-ochre mb-4">What the Data Tells Us</h4>
          <p className="text-vanaj-cream/80 text-sm mb-6 max-w-3xl mx-auto leading-relaxed">
            State-wide craft turnover is not consistently reported by craft category. For <strong className="text-white font-medium">Sohrai & Khovar</strong>, <strong className="text-white font-medium">Dhokra</strong>, <strong className="text-white font-medium">Bamboo Crafts</strong>, and <strong className="text-white font-medium">Tribal Jewellery</strong>, there is currently no consolidated Jharkhand-wide annual turnover figure publicly established.
          </p>
        </div>

        {/* Methodology Note */}
        <div className="text-center">
          <p className="text-[#8B5E3C] text-[11px] leading-relaxed max-w-4xl mx-auto uppercase tracking-wide opacity-70">
            Data note: Tourism figures are calendar-year figures. January–November 2025 is partial-year data. Workshop participation and revenue figures are illustrative scenarios based on a 1% conversion assumption and stated workshop prices; they are not measured market demand or guaranteed revenue. Craft turnover figures are not presented as state-wide totals where consolidated official data is unavailable.
          </p>
        </div>

      </div>
    </section>
  );
};

export default OpportunitySection;
