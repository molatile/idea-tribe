const fs = require('fs');
const path = require('path');

// 1. DANCE.JSX
const dancePath = path.join(__dirname, '..', 'src', 'pages', 'Dance.jsx');
let dance = fs.readFileSync(dancePath, 'utf8').replace(/\r\n/g, '\n');

dance = dance.replace(
  `<VideoCard \n              key={dance.id} \n              dance={dance} \n              onClick={setSelectedDance} \n            />`,
  `<VideoCard 
              key={dance.id} 
              dance={dance} 
              onClick={setSelectedDance}
              isLiked={danceLikes[dance.id]?.liked}
              likesCount={danceLikes[dance.id]?.count ?? 42}
              onToggleLike={handleToggleDanceLike}
            />`
);

dance = dance.replace(
  `<Modal \n            dance={selectedDance} \n            allDances={DANCES}\n            onClose={() => setSelectedDance(null)} \n            onSelectRelated={setSelectedDance}\n          />`,
  `<Modal 
            dance={selectedDance} 
            allDances={DANCES}
            onClose={() => setSelectedDance(null)} 
            onSelectRelated={setSelectedDance}
            isLiked={danceLikes[selectedDance.id]?.liked}
            likesCount={danceLikes[selectedDance.id]?.count ?? 42}
            onToggleLike={handleToggleDanceLike}
          />`
);

fs.writeFileSync(dancePath, dance, 'utf8');
console.log('Dance.jsx fixed!');

// 2. FOOD.JSX
const foodPath = path.join(__dirname, '..', 'src', 'pages', 'Food.jsx');
let food = fs.readFileSync(foodPath, 'utf8').replace(/\r\n/g, '\n');

const oldTribeBadge = `<div className="absolute top-4 right-4 bg-vanaj-ochre/90 backdrop-blur-sm text-vanaj-very-dark px-3 py-1 rounded-full text-xs font-bold font-body uppercase tracking-wider shadow-md">
                {food.tribe}
              </div>`;

const newTribeBadge = `<div className="absolute top-4 left-4 bg-vanaj-ochre/90 backdrop-blur-sm text-vanaj-very-dark px-3 py-1 rounded-full text-xs font-bold font-body uppercase tracking-wider shadow-md">
                {food.tribe}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFoodLike(food.id);
                }}
                className={\`absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md transition-all active:scale-95 \${
                  foodLikes[food.id]?.liked
                    ? 'bg-vanaj-red text-white shadow-red-900/30'
                    : 'bg-vanaj-cream/90 text-vanaj-dark hover:bg-white'
                }\`}
                title="Like dish"
              >
                <Heart size={13} className={foodLikes[food.id]?.liked ? 'fill-current text-white' : ''} />
                <span>{foodLikes[food.id]?.count ?? 36}</span>
              </button>`;

if (food.includes(oldTribeBadge)) {
  food = food.replace(oldTribeBadge, newTribeBadge);
  fs.writeFileSync(foodPath, food, 'utf8');
  console.log('Food.jsx badge and like button fixed!');
} else {
  console.log('Food.jsx oldTribeBadge not found');
}
