const FestivalStrip = () => {
  const festivals = [
    { name: 'Sarhul', emoji: '🔥' },
    { name: 'Karma', emoji: '🥁' },
    { name: 'Sohrai', emoji: '🔥' },
    { name: 'Tusu Parab', emoji: '🥁' },
    { name: 'Bhagta Parab', emoji: '🔥' },
    { name: 'Manda', emoji: '🥁' },
    { name: 'Roha Puna', emoji: '🔥' },
    { name: 'Baha', emoji: '🥁' },
  ];

  return (
    <div className="bg-vanaj-very-dark text-vanaj-ochre py-6 overflow-hidden flex relative w-full border-y border-vanaj-ochre/20">
      {/* 
        We use two identical wrappers to create a seamless infinite scroll.
        The animation duration controls the speed.
      */}
      <div className="flex whitespace-nowrap animate-scroll items-center gap-12 pl-12 min-w-max">
        {[...festivals, ...festivals, ...festivals, ...festivals].map((fest, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="text-2xl drop-shadow-[0_0_15px_rgba(201,149,42,0.6)]">{fest.emoji}</span>
            <span className="text-2xl font-heading tracking-wider uppercase" style={{ textShadow: "0 0 15px rgba(201, 149, 42, 0.4)" }}>
              {fest.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FestivalStrip;
