const FestivalStrip = () => {
  const festivals = [
    { name: 'Sarhul', emoji: '🥁' },
    { name: 'Karma', emoji: '🥁' },
    { name: 'Sohrai', emoji: '🥁' },
    { name: 'Tusu Parab', emoji: '🥁' },
    { name: 'Bhagta Parab', emoji: '🥁' },
    { name: 'Manda', emoji: '🥁' },
    { name: 'Roha Puna', emoji: '🥁' },
    { name: 'Baha', emoji: '🥁' },
  ];

  return (
    <div className="bg-[#2C1A0E] text-[#C9952A] py-6 overflow-hidden flex relative w-full border-y border-[#C9952A]/30">
      {/* 
        We use two identical wrappers to create a seamless infinite scroll.
        The animation duration controls the speed.
      */}
      <div className="flex whitespace-nowrap animate-scroll items-center gap-12 pl-12 min-w-max">
        {[...festivals, ...festivals, ...festivals, ...festivals].map((fest, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="text-2xl drop-shadow-[0_0_15px_rgba(201,149,42,0.8)]">{fest.emoji}</span>
            <span className="text-2xl font-heading tracking-wider uppercase text-[#C9952A]" style={{ textShadow: "0 0 20px rgba(201, 149, 42, 0.8), 0 0 10px rgba(201, 149, 42, 0.5)" }}>
              {fest.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FestivalStrip;
