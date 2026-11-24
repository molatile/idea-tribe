// Resilient intent dictionary for instant local matching and action execution
const DISTRICT_MATCHERS = [
  { pattern: /(ranchi)/i, name: 'Ranchi', lang: 'Mundari' },
  { pattern: /(jamshedpur|east\s+singhbhum|purba\s+singhbhum|tata)/i, name: 'Purba Singhbhum', lang: 'Santali' },
  { pattern: /(west\s+singhbhum|pashchimi\s+singhbhum|chaibasa)/i, name: 'Pashchimi Singhbhum', lang: 'Ho' },
  { pattern: /(dhanbad)/i, name: 'Dhanbad', lang: 'Khortha' },
  { pattern: /(bokaro)/i, name: 'Bokaro', lang: 'Khortha' },
  { pattern: /(deoghar)/i, name: 'Deoghar', lang: 'Khortha' },
  { pattern: /(dumka)/i, name: 'Dumka', lang: 'Santali' },
  { pattern: /(hazaribag|hazaribagh)/i, name: 'Hazaribag', lang: 'Khortha' },
  { pattern: /(kodarma|koderma)/i, name: 'Kodarma', lang: 'Khortha' },
  { pattern: /(saraikela|seraikela|kharsawan)/i, name: 'Saraikela-Kharsawan', lang: 'Ho' },
  { pattern: /(khunti)/i, name: 'Khunti', lang: 'Mundari' },
  { pattern: /(gumla)/i, name: 'Gumla', lang: 'Kurukh' },
  { pattern: /(simdega)/i, name: 'Simdega', lang: 'Kharia' },
  { pattern: /(lohardaga)/i, name: 'Lohardaga', lang: 'Kurukh' },
  { pattern: /(latehar)/i, name: 'Latehar', lang: 'Kurukh' },
  { pattern: /(palamu|daltonganj)/i, name: 'Palamu', lang: 'Khortha' },
  { pattern: /(garhwa)/i, name: 'Garhwa', lang: 'Khortha' },
  { pattern: /(chatra)/i, name: 'Chatra', lang: 'Khortha' },
  { pattern: /(giridih)/i, name: 'Giridih', lang: 'Khortha' },
  { pattern: /(jamtara)/i, name: 'Jamtara', lang: 'Santali' },
  { pattern: /(godda)/i, name: 'Godda', lang: 'Santali' },
  { pattern: /(sahibganj|sahebganj)/i, name: 'Sahibganj', lang: 'Santali' },
  { pattern: /(pakur)/i, name: 'Pakur', lang: 'Santali' },
  { pattern: /(ramgarh)/i, name: 'Ramgarh', lang: 'Khortha' }
];

const LOCAL_INTENT_MAP = [
  // 1. GENERAL COMMANDS
  {
    pattern: /(go\s+back|previous\s+page|navigate\s+back|पीछे\s*जाओ|वापस\s*जाओ|वापस\s*चलो|piche\s*jao|peeche\s*jao|wapas\s*jao|back\s*jao|peeche\s*chalo|piche\s*chalo|wapas\s*chalo|peeche\s*karo|piche\s*karo)/i,
    route: null,
    reply: 'Going back to the previous page.',
    hindiReply: 'पिछले पृष्ठ पर वापस जा रहे हैं।',
    action: { type: 'GO_BACK' },
    category: 'General - Go Back'
  },
  {
    pattern: /(scroll\s+down|page\s+down|नीचे\s*जाओ|नीचे\s*स्क्रॉल\s*करो|नीचे\s*करो|neeche\s*jao|niche\s*jao|niche\s*scroll|neeche\s*scroll|niche\s*karo|neeche\s*karo|scroll\s*down\s*karo)/i,
    route: null,
    reply: 'Scrolling down.',
    hindiReply: 'नीचे स्क्रॉल कर रहा हूँ।',
    action: { type: 'SCROLL_DOWN' },
    category: 'General - Scroll Down'
  },
  {
    pattern: /(scroll\s+up|page\s+up|ऊपर\s*जाओ|ऊपर\s*स्क्रॉल\s*करो|ऊपर\s*करो|upar\s*jao|upar\s*scroll|upar\s*karo|scroll\s*up\s*karo)/i,
    route: null,
    reply: 'Scrolling up.',
    hindiReply: 'ऊपर स्क्रॉल कर रहा हूँ।',
    action: { type: 'SCROLL_UP' },
    category: 'General - Scroll Up'
  },
  {
    pattern: /(go\s+to\s+top|scroll\s+to\s+top|back\s+to\s+top|to\s+the\s+top|सबसे\s*ऊपर\s*जाओ|शुरुआत\s*में\s*जाओ|शीर्ष\s*पर\s*जाओ|sabse\s*upar\s*jao|top\s*pe\s*jao|top\s*par\s*jao|shuruat\s*me\s*jao|ekdum\s*upar\s*jao)/i,
    route: null,
    reply: 'Scrolling to the top of the page.',
    hindiReply: 'पृष्ठ के सबसे ऊपर जा रहे हैं।',
    action: { type: 'GO_TO_TOP' },
    category: 'General - Go to Top'
  },
  {
    pattern: /(help|what\s+can\s+you\s+do|show\s+help|list\s+commands|commands|मदद|सहायता|मदद\s*करो|आप\s*क्या\s*कर\s*सकते\s*हैं|कमांड\s*बताओ|क्या\s*कर\s*सकते\s*हो|madad|sahayata|madad\s*karo|madad\s*chahiye|help\s*karo|help\s*chahiye|kya\s*kar\s*sakte\s*ho|tum\s*kya\s*kar\s*sakte\s*ho|kya\s*kya\s*kar\s*sakte\s*ho|commands\s*batao)/i,
    route: null,
    reply: 'Here are some things you can ask: open Jharkhand map, play Ho dance, show Dhuska, translate water to Santali, or view cart.',
    hindiReply: "आप ये कमांड्स बोल सकते हैं: 'हो नृत्य चलाओ', 'धुस्का दिखाओ', 'संथाली फ्लैशकार्ड', 'मेरे कार्ट में क्या है', या 'झारखंड का नक्शा खोलो'।",
    action: { type: 'SHOW_HELP' },
    category: 'Help'
  },
  {
    pattern: /(stop\s+talking|be\s+quiet|shut\s+up|silence|mute|चुप\s*रहो|चुप\s*हो\s*जाओ|बोलना\s*बंद\s*करो|शांत\s*रहो|आवाज\s*बंद\s*करो|रुको|chup\s*raho|chup\s*ho\s*jao|bolna\s*band\s*karo|shant\s*raho|awaz\s*band\s*karo|aawaz\s*band\s*karo|kuch\s*mat\s*bolo|mute\s*karo|chup\s*karo)/i,
    route: null,
    reply: 'Spoken reply stopped.',
    hindiReply: 'बोलना बंद कर दिया गया है।',
    action: { type: 'STOP_TALKING' },
    category: 'General - Silence'
  },

  // 2. DANCE COMMANDS
  {
    pattern: /(play\s+(the\s+)?ho\s+dance|watch\s+ho\s+dance|हो\s*नृत्य\s*चलाओ|हो\s*डांस\s*चलाओ|हो\s*नाच\s*चलाओ|हो\s*नृत्य|हो\s*डांस|ho\s*dance\s*chalao|ho\s*dance\s*play\s*karo|ho\s*dance\s*lagao|ho\s*dance\s*dikhao|ho\s*nritya\s*chalao|ho\s*nach\s*chalao|ho\s*wala\s*dance|ho\s*dance)/i,
    route: '/dance?dance=ho',
    reply: 'Playing the Ho folk dance of West Singhbhum.',
    hindiReply: 'पश्चिमी सिंहभूम का पारंपरिक हो लोक नृत्य चला रहा हूँ।',
    action: { type: 'PLAY_DANCE', dance: 'ho' },
    category: 'Dance - Play Ho'
  },
  {
    pattern: /(pause\s+(the\s+)?video|pause\s+dance|वीडियो\s*रोको|वीडियो\s*पॉज़\s*करो|पॉज़\s*करो|रोक\s*दो|नृत्य\s*रोको|video\s*roko|video\s*rok\s*do|video\s*pause\s*karo|pause\s*karo|pause\s*kardo|dance\s*roko)/i,
    route: null,
    reply: 'Pausing the dance video.',
    hindiReply: 'नृत्य वीडियो रोक दिया गया है।',
    action: { type: 'PAUSE_VIDEO' },
    category: 'Dance - Pause'
  },
  {
    pattern: /(close\s+(the\s+)?video|close\s+dance|exit\s+video|वीडियो\s*बंद\s*करो|डांस\s*बंद\s*करो|वीडियो\s*हटाओ|बंद\s*करो|video\s*band\s*karo|video\s*close\s*karo|dance\s*band\s*karo|video\s*hatao|close\s*kardo|band\s*kar\s*do)/i,
    route: null,
    reply: 'Closing the dance video.',
    hindiReply: 'नृत्य वीडियो बंद कर रहा हूँ।',
    action: { type: 'CLOSE_VIDEO' },
    category: 'Dance - Close'
  },
  {
    pattern: /(next\s+dance|next\s+video|another\s+dance|अगला\s*नृत्य|अगला\s*डांस|अगला\s*नाच|दूसरा\s*डांस|agla\s*dance|agla\s*nritya|dusra\s*dance|doosra\s*dance|next\s*dance\s*dikhao|agla\s*video)/i,
    route: '/dance',
    reply: 'Showing the next tribal dance.',
    hindiReply: 'अगला जनजातीय नृत्य दिखा रहा हूँ।',
    action: { type: 'NEXT_DANCE' },
    category: 'Dance - Next'
  },

  // 3. FOOD COMMANDS
  {
    pattern: /((show\s+)?food\s+from\s+(the\s+)?santhal(i)?\s+tribe|filter\s+(food\s+)?by\s+santhal(i)?|संथाली\s*(जनजाति\s*का\s*)?(भोजन|खाना|व्यंजन)|santhali\s*khana|santhali\s*food\s*dikhao|santhali\s*khana\s*dikhao|santhal\s*ka\s*khana|santhali\s*bhojan)/i,
    route: '/food?tribe=Santhali',
    reply: 'Showing traditional dishes from the Santhali tribe.',
    hindiReply: 'संथाली जनजाति के पारंपरिक व्यंजन दिखा रहा हूँ।',
    action: { type: 'FILTER_FOOD_TRIBE', tribe: 'Santhali' },
    category: 'Food - Santhali Tribe'
  },
  {
    pattern: /((show|open|view)?\s*dhuska|धुस्का\s*(दिखाओ|खोलो)?|धुस्का\s*की\s*रेसिपी|धुस्का|dhuska\s*dikhao|dhuska\s*kholo|dhuska\s*recipe|dhuska\s*ki\s*recipe|dhuska\s*kaise\s*banta\s*hai|dhuska\s*dikha\s*do|dhuska\s*banao)/i,
    route: '/food?dish=Dhuska',
    reply: 'Showing Dhuska, Jharkhand’s festive fried rice and lentil delicacy.',
    hindiReply: 'झारखंड का प्रसिद्ध व्यंजन धुस्का दिखा रहा हूँ।',
    action: { type: 'SELECT_FOOD', dish: 'Dhuska' },
    category: 'Food - Dhuska'
  },
  {
    pattern: /(chilka\s+roti|चिल्का\s*रोटी|chilka\s*roti\s*dikhao|chilka\s*roti\s*recipe)/i,
    route: '/food?dish=Chilka+Roti',
    reply: 'Showing Chilka Roti, traditional rice and chana crepe.',
    hindiReply: 'पारंपरिक व्यंजन चिल्का रोटी दिखा रहा हूँ।',
    action: { type: 'SELECT_FOOD', dish: 'Chilka Roti' },
    category: 'Food - Chilka Roti'
  },
  {
    pattern: /(rugra|rugda|रुगड़ा|रुगडा|rugra\s*dikhao|rugda\s*dikhao|rugra\s*mushroom)/i,
    route: '/food?dish=Rugra',
    reply: 'Showing Rugra, the indigenous wild puffball mushroom from the Sal forests.',
    hindiReply: 'साल के जंगलों का प्राकृतिक रुगड़ा मशरूम दिखा रहा हूँ।',
    action: { type: 'SELECT_FOOD', dish: 'Rugra' },
    category: 'Food - Rugra'
  },

  // 4. LANGUAGES COMMANDS
  {
    pattern: /(open\s+flashcards\s+for\s+santali|santali\s+flashcards|show\s+flashcards\s+for\s+santali|संथाली\s*फ्लैशकार्ड|santali\s*flashcards?\s*kholo|santhali\s*flashcard\s*dikhao|santali\s*flashcards?\s*dikha\s*do)/i,
    route: '/languages?section=flashcards&lang=Santali',
    reply: 'Opening Santali language flashcards.',
    hindiReply: 'संथाली भाषा के फ्लैशकार्ड खोल रहा हूँ।',
    action: { type: 'OPEN_FLASHCARDS', language: 'Santali' },
    category: 'Languages - Flashcards'
  },
  {
    pattern: /(flip\s+(the\s+)?card|turn\s+(the\s+)?card|कार्ड\s*पलटो|कार्ड\s*उलटो|पलटो|card\s*palto|card\s*palat\s*do|card\s*flip\s*karo|card\s*flip\s*kardo|card\s*ulto|card\s*ghumao|flip\s*kardo)/i,
    route: '/languages',
    reply: 'Flipped the flashcard.',
    hindiReply: 'फ्लैशकार्ड पलट दिया गया है।',
    action: { type: 'FLIP_CARD' },
    category: 'Languages - Flip Card'
  },
  {
    pattern: /(next\s+card|next\s+flashcard|another\s+card|अगला\s*कार्ड|अगला\s*फ्लैशकार्ड|दूसरा\s*कार्ड|agla\s*card|agla\s*flashcard|dusra\s*card|doosra\s*card|next\s*card\s*dikhao|agla\s*card\s*dikhao)/i,
    route: '/languages',
    reply: 'Showing the next flashcard.',
    hindiReply: 'अगला फ्लैशकार्ड दिखा रहा हूँ।',
    action: { type: 'NEXT_CARD' },
    category: 'Languages - Next Card'
  },
  {
    pattern: /(translate\s+water\s+to\s+santh?ali|पानी\s*(का\s*)?संथाली\s*(में\s*)?अनुवाद|पानी\s*को\s*संथाली\s*में|paani\s*ka\s*santali\s*anuvad|paani\s*ko\s*santali\s*me|water\s*ka\s*santali\s*translation|water\s*translate\s*karo\s*santali|translate\s*paani\s*to\s*santali|pani\s*ka\s*santali\s*anuvad|pani\s*ko\s*santali)/i,
    route: '/languages?translate=true&word=water&lang=Santali',
    reply: 'In Santali, water is Daah (Ol Chiki: ᱫᱟᱜ).',
    hindiReply: 'संथाली में पानी को दाः (Ol Chiki: ᱫᱟᱜ) कहते हैं।',
    action: { type: 'TRANSLATE', word: 'water', language: 'Santali' },
    category: 'Languages - Translate'
  },

  // 5. TOURISM COMMANDS
  {
    pattern: /(show\s+temples?|filter\s+(by\s+)?temples?|मंदिर\s*(दिखाओ|खोलो)?|धार्मिक\s*स्थल|mandir\s*dikhao|mandir\s*kholo|temples\s*dikhao|mandir\s*filter\s*karo|sare\s*mandir\s*dikhao|dharmik\s*sthal\s*dikhao|mandir\s*dikha\s*do)/i,
    route: '/tourism?filter=Temple',
    reply: 'Showing sacred temples and heritage shrines in tourism.',
    hindiReply: 'धार्मिक और ऐतिहासिक मंदिर दिखा रहा हूँ।',
    action: { type: 'FILTER_TOURISM', filter: 'Temple' },
    category: 'Tourism - Temples'
  },
  {
    pattern: /(show\s+waterfalls?|filter\s+(by\s+)?waterfalls?|झरने\s*(दिखाओ|खोलो)?|जलप्रपात\s*(दिखाओ|खोलो)?|jharne\s*dikhao|jharne\s*kholo|waterfalls\s*dikhao|jharna\s*dikhao|waterfall\s*dikhao|jalprapat\s*dikhao|jharne\s*dikha\s*do)/i,
    route: '/tourism?filter=Waterfall',
    reply: 'Showing scenic waterfalls of Jharkhand in tourism.',
    hindiReply: 'झारखंड के खूबसूरत झरने दिखा रहा हूँ।',
    action: { type: 'FILTER_TOURISM', filter: 'Waterfall' },
    category: 'Tourism - Waterfalls'
  },
  {
    pattern: /(show\s+wildlife|filter\s+(by\s+)?wildlife|show\s+animals?|वन्यजीव\s*(दिखाओ|खोलो)?|जंगल\s*(दिखाओ|खोलो)?|अभयारण्य|vanyajeev\s*dikhao|wildlife\s*dikhao|janwar\s*dikhao|animals\s*dikhao|jungle\s*dikhao|sanctuary\s*dikhao|national\s*park\s*dikhao|vanyajeev\s*dikha\s*do)/i,
    route: '/tourism?filter=Wildlife',
    reply: 'Showing wildlife sanctuaries and national parks in tourism.',
    hindiReply: 'वन्यजीव अभयारण्य और राष्ट्रीय उद्यान दिखा रहा हूँ।',
    action: { type: 'FILTER_TOURISM', filter: 'Wildlife' },
    category: 'Tourism - Wildlife'
  },
  {
    pattern: /(search\s+(for\s+)?netarhat|find\s+netarhat|नेतरहाट\s*(खोजो|ढूंढो|दिखाओ)?|netarhat\s*khojo|netarhat\s*search\s*karo|netarhat\s*dikhao|netarhat\s*dhundo|netarhat\s*dhoondho|netarhat\s*kahan\s*hai|netarhat\s*dikha\s*do)/i,
    route: '/tourism?search=Netarhat',
    reply: 'Searching for Netarhat in tourism destinations.',
    hindiReply: 'पर्यटन में नेतरहाट खोज रहा हूँ।',
    action: { type: 'SEARCH_TOURISM', query: 'Netarhat' },
    category: 'Tourism - Search'
  },
  {
    pattern: /(show\s+workshops?|view\s+workshops?|artisan\s+workshops?|कार्यशालाएं\s*दिखाओ|कार्यशाला\s*दिखाओ|वर्कशॉप\s*दिखाओ|karyashala\s*dikhao|karyashalaen\s*dikhao|workshops\s*dikhao|workshop\s*dikhao|artisan\s*workshops\s*dikhao|workshop\s*dikha\s*do)/i,
    route: '/tourism?section=workshops',
    reply: 'Showing artisan cultural immersion workshops.',
    hindiReply: 'कारीगरों की सांस्कृतिक कार्यशालाएं दिखा रहा हूँ।',
    action: { type: 'SHOW_WORKSHOPS' },
    category: 'Tourism - Workshops'
  },
  {
    pattern: /(open\s+(the\s+)?host\s+a\s+workshop\s+form|host\s+a\s+workshop(\s+form)?|कार्यशाला\s*का\s*फॉर्म|वर्कशॉप\s*फॉर्म|workshop\s*form|workshop\s*form\s*kholo|host\s*a\s*workshop\s*form\s*kholo|karyashala\s*form\s*kholo|workshop\s*ka\s*form\s*kholo|workshop\s*host\s*karna\s*hai)/i,
    route: '/tourism?section=host-workshop',
    reply: 'Opening the host a workshop proposal form.',
    hindiReply: 'कार्यशाला आयोजित करने का प्रस्ताव फॉर्म खोल रहा हूँ।',
    action: { type: 'OPEN_HOST_WORKSHOP' },
    category: 'Tourism - Host Workshop'
  },

  // 6. MARKETPLACE COMMANDS
  {
    pattern: /(show\s+ornaments|switch\s+to\s+ornaments|open\s+ornaments(\s+tab)?|गहने\s*(दिखाओ|खोलो)?|आभूषण\s*(दिखाओ|खोलो)?|बांकी|gahne\s*dikhao|gehne\s*dikhao|aabhushan\s*dikhao|ornaments\s*dikhao|jewelry\s*dikhao|gahna\s*dikhao|gehne\s*kholo|gahne\s*dikha\s*do)/i,
    route: '/marketplace?tab=Ornaments',
    reply: 'Showing handcrafted tribal ornaments in the marketplace.',
    hindiReply: 'हस्तनिर्मित पारंपरिक गहने दिखा रहा हूँ।',
    action: { type: 'SWITCH_TAB', tab: 'Ornaments' },
    category: 'Marketplace - Ornaments'
  },
  {
    pattern: /(show\s+clothes|switch\s+to\s+clothes|open\s+clothes(\s+tab)?|कपड़े\s*(दिखाओ|खोलो)?|वस्त्र\s*(दिखाओ|खोलो)?|पोशाक|kapde\s*dikhao|kapda\s*dikhao|clothes\s*dikhao|vastra\s*dikhao|poshak\s*dikhao|kapde\s*kholo|kapde\s*dikha\s*do)/i,
    route: '/marketplace?tab=Clothes',
    reply: 'Showing handwoven tribal clothes in the marketplace.',
    hindiReply: 'पारंपरिक हथकरघा वस्त्र दिखा रहा हूँ।',
    action: { type: 'SWITCH_TAB', tab: 'Clothes' },
    category: 'Marketplace - Clothes'
  },
  {
    pattern: /(show\s+necklaces|switch\s+to\s+necklaces|open\s+necklaces(\s+tab)?|हार\s*(दिखाओ|खोलो)?|माला\s*(दिखाओ|खोलो)?|हंसुली|haar\s*dikhao|mala\s*dikhao|necklaces\s*dikhao|hansuli\s*dikhao|necklace\s*dikhao|haar\s*kholo|mala\s*kholo|haar\s*dikha\s*do)/i,
    route: '/marketplace?tab=Necklaces',
    reply: 'Showing traditional tribal necklaces in the marketplace.',
    hindiReply: 'पारंपरिक जनजातीय हार और हंसुली दिखा रहा हूँ।',
    action: { type: 'SWITCH_TAB', tab: 'Necklaces' },
    category: 'Marketplace - Necklaces'
  },
  {
    pattern: /(what\s+is\s+in\s+my\s+cart|what'?s\s+in\s+my\s+cart|check\s+my\s+cart|items\s+in\s+cart|मेरे\s*कार्ट\s*में\s*क्या\s*है|कार्ट\s*में\s*क्या\s*है|झोली\s*में\s*क्या\s*है|mere\s*cart\s*me\s*kya\s*hai|cart\s*me\s*kya\s*hai|cart\s*me\s*kya\s*kya\s*hai|kya\s*kya\s*hai\s*cart\s*me|kya\s*hai\s*cart\s*me|mera\s*cart\s*kholo|cart\s*dikhao|cart\s*check\s*karo|cart\s*mein\s*kya\s*hai)/i,
    route: '/marketplace?openCart=true',
    reply: 'Opening your shopping cart to view your items.',
    hindiReply: 'आपकी कार्ट खोलने जा रहा हूँ ताकि वस्तुएं देख सकें।',
    action: { type: 'WHAT_IN_CART' },
    category: 'Cart - Contents'
  },
  {
    pattern: /(what\s+is\s+my\s+total|what'?s\s+my\s+total|cart\s+total|how\s+much\s+is\s+my\s+cart|कुल\s*कितना\s*हुआ|कुल\s*कीमत\s*क्या\s*है|टोटल\s*कितना\s*है|kul\s*kitna\s*hua|total\s*kitna\s*hua|total\s*kitna\s*hai|mera\s*total\s*kitna\s*bana|cart\s*ka\s*total\s*batao|kitna\s*kharcha\s*hua|kitne\s*paise\s*hue|kitna\s*bill\s*hua|cart\s*total\s*kitna\s*hai|kitna\s*hua)/i,
    route: '/marketplace?openCart=true',
    reply: 'Opening your shopping cart to check your order total.',
    hindiReply: 'कुल राशि देखने के लिए आपकी कार्ट खोली जा रही है।',
    action: { type: 'WHAT_IS_TOTAL' },
    category: 'Cart - Total'
  },
  {
    pattern: /(remove\s+(the\s+)?shirt(\s+from\s+(my\s+)?cart)?|delete\s+(the\s+)?shirt(\s+from\s+cart)?|शर्ट\s*हटाओ|कार्ट\s*से\s*शर्ट\s*हटाओ|कुर्ता\s*हटाओ|shirt\s*hatao|shirt\s*hata\s*do|cart\s*se\s*shirt\s*hatao|cart\s*se\s*shirt\s*nikal\s*do|shirt\s*remove\s*karo|shirt\s*delete\s*karo|kurta\s*hatao|shirt\s*nikal\s*do)/i,
    route: '/marketplace?openCart=true',
    reply: 'Removing the shirt from your shopping cart.',
    hindiReply: 'आपकी शॉपिंग कार्ट से शर्ट हटा रहा हूँ।',
    action: { type: 'REMOVE_FROM_CART', itemKey: 'shirt' },
    category: 'Cart - Remove'
  },
  {
    pattern: /(add\s+(an?\s+)?(shirt|cloth|clothing|item|dress|saree|banki|bracelet|armlet|ring|necklace|hansuli|dhokra|bamboo|basket)|add\s+to\s+cart|buy\s+(a\s+)?shirt|add\s+items?|कार्ट\s*में\s*जोड़ो|शर्ट\s*खरीदो|शर्ट\s*जोड़ो|shirt\s*add\s*karo|shirt\s*cart\s*me\s*dalo|cart\s*me\s*add\s*karo|shirt\s*kharido|shirt\s*khareedo|cart\s*me\s*dalo)/i,
    route: '/marketplace?openCart=true',
    reply: 'Added the requested handcrafted item to your shopping cart. Opening your cart now.',
    hindiReply: 'संथाली शर्ट को आपकी कार्ट में जोड़ दिया गया है।',
    action: { type: 'ADD_TO_CART', itemKey: 'shirt' },
    category: 'Cart - Add'
  },
  {
    pattern: /(view|open|show|my)\s+(cart|bag|shopping\s+cart)|^cart$/i,
    route: '/marketplace?openCart=true',
    reply: 'Opening your shopping cart.',
    action: { type: 'OPEN_CART' },
    category: 'Cart'
  },
  {
    pattern: /(checkout|proceed\s+to\s+checkout|place\s+order|buy\s+now)/i,
    route: '/marketplace?checkout=true',
    reply: 'Taking you to secure checkout to complete your purchase.',
    action: { type: 'CHECKOUT' },
    category: 'Checkout'
  },
  {
    pattern: /(clear|empty|reset)\s+(the\s+)?(cart|bag)/i,
    route: '/marketplace?openCart=true',
    reply: 'Your shopping cart has been cleared.',
    action: { type: 'CLEAR_CART' },
    category: 'Cart - Clear'
  },

  // 7. DISTRICT MAP COMMANDS
  ...DISTRICT_MATCHERS.map(d => ({
    pattern: new RegExp(`(open|show|focus|locate|find)?\\s*${d.pattern.source}`, 'i'),
    route: `/languages?district=${encodeURIComponent(d.name)}`,
    reply: `Opening Jharkhand's map and focusing on ${d.name}. Its primary tribal language is ${d.lang}.`,
    action: { type: 'SELECT_DISTRICT', district: d.name },
    category: `Map - ${d.name}`
  })),

  {
    pattern: /(open\s+(the\s+)?maps?(\s*\(?jharkhand\)?)?|jharkhand\s+map|map\s+of\s+jharkhand|^maps?$)/i,
    route: '/languages?map=true',
    reply: "Opening the interactive Jharkhand map showing all 24 districts and indigenous linguistic territories.",
    action: { type: 'OPEN_MAP' },
    category: 'Map'
  },

  // 8. MUSIC COMMANDS
  {
    pattern: /(play|start)\s+(music|mandar|drum|beat)/i,
    route: '/languages?playMusic=true',
    reply: 'Playing the authentic Mandar drum rhythms of Jharkhand.',
    action: { type: 'PLAY_MUSIC' },
    category: 'Music'
  },
  {
    pattern: /(stop|pause)\s+(music|mandar|drum|beat)/i,
    route: '/languages',
    reply: 'Stopping the Mandar drum beats.',
    action: { type: 'STOP_MUSIC' },
    category: 'Music'
  },

  // 9. DANCES
  {
    pattern: /(santali\s+dance|santhali\s+dance|santhal\s+dance|santali|santhali)/i,
    route: '/dance?dance=santhali',
    reply: 'Showing you the authentic Santhali folk dance from Santhal Pargana.',
    category: 'Dance - Santhali'
  },
  {
    pattern: /(ho\s+folk\s+dance|ho\s+dance)/i,
    route: '/dance?dance=ho',
    reply: 'Opening the Ho folk dance of West Singhbhum.',
    action: { type: 'PLAY_DANCE', dance: 'ho' },
    category: 'Dance - Ho'
  },
  {
    pattern: /(oraon\s+dance|oraon\s+folk\s+dance)/i,
    route: '/dance?dance=oraon',
    reply: 'Opening the vibrant Oraon folk dance.',
    action: { type: 'PLAY_DANCE', dance: 'oraon' },
    category: 'Dance - Oraon'
  },
  {
    pattern: /(asur\s+dance|asur\s+folk\s+dance)/i,
    route: '/dance?dance=asur',
    reply: 'Opening the Asur folk dance celebrating tribal traditions.',
    action: { type: 'PLAY_DANCE', dance: 'asur' },
    category: 'Dance - Asur'
  },
  {
    pattern: /(kharia\s+dance|khariya\s+dance)/i,
    route: '/dance?dance=kharia',
    reply: 'Opening the harvest dance of the Kharia tribe.',
    action: { type: 'PLAY_DANCE', dance: 'kharia' },
    category: 'Dance - Kharia'
  },
  {
    pattern: /(open\s+dance|show\s+dances?|tribal\s+dance|dances\s+of\s+jharkhand|^dance$)/i,
    route: '/dance',
    reply: 'Opening the sacred dances of Jharkhand.',
    category: 'Dance'
  },

  // General Page Openings (Hindi & Hinglish fallback for main pages)
  {
    pattern: /(नृत्य\s*खोलो|नृत्य\s*दिखाओ|नाच\s*खोलो|नाच\s*दिखाओ|डांस\s*खोलो|डांस\s*दिखाओ|nritya\s*kholo|nritya\s*dikhao|nach\s*kholo|nach\s*dikhao|dance\s*kholo|dance\s*dikhao|dance\s*section\s*kholo)/i,
    route: '/dance',
    reply: 'Opening the sacred dances of Jharkhand.',
    hindiReply: 'झारखंड के पारंपरिक लोक नृत्य खोल रहा हूँ।',
    category: 'Dance - Hindi'
  },
  {
    pattern: /(भोजन\s*दिखाओ|भोजन\s*खोलो|खाना\s*दिखाओ|खाना\s*खोलो|व्यंजन\s*दिखाओ|व्यंजन\s*खोलो|bhojan\s*dikhao|bhojan\s*kholo|khana\s*dikhao|khana\s*kholo|vyanjan\s*dikhao|food\s*dikhao|food\s*kholo)/i,
    route: '/food',
    reply: 'Opening tribal culinary heritage and traditional indigenous recipes.',
    hindiReply: 'पारंपरिक जनजातीय भोजन खोल रहा हूँ।',
    category: 'Food - Hindi'
  },
  {
    pattern: /(बाज़ार\s*खोलो|बाजार\s*खोलो|बाज़ार\s*दिखाओ|मार्केट\s*खोलो|मार्केट\s*दिखाओ|bazar\s*kholo|bazar\s*dikhao|market\s*kholo|market\s*dikhao|marketplace\s*kholo|marketplace\s*dikhao)/i,
    route: '/marketplace',
    reply: 'Opening the indigenous tribal marketplace.',
    hindiReply: 'पारंपरिक जनजातीय बाज़ार खोल रहा हूँ।',
    category: 'Marketplace - Hindi'
  },
  {
    pattern: /(झारखंड\s*का\s*नक्शा|नक्शा\s*खोलो|नक्शा\s*दिखाओ|मैप\s*खोलो|मैप\s*दिखाओ|naksha\s*kholo|naksha\s*dikhao|map\s*kholo|map\s*dikhao|jharkhand\s*ka\s*naksha|jharkhand\s*map\s*dikhao)/i,
    route: '/languages?map=true',
    reply: "Opening the interactive Jharkhand map showing all 24 districts and indigenous linguistic territories.",
    hindiReply: 'झारखंड का नक्शा खोल रहा हूँ जिसमें सभी 24 जिले और उनकी भाषाएं हैं।',
    action: { type: 'OPEN_MAP' },
    category: 'Map - Hindi'
  },
  {
    pattern: /(भाषा\s*खोलो|भाषाएं\s*दिखाओ|अनुवादक\s*खोलो|अनुवादक\s*दिखाओ|bhasha\s*kholo|bhashayein\s*dikhao|anuvadak\s*kholo|translator\s*kholo|languages\s*dikhao)/i,
    route: '/languages',
    reply: 'Opening the indigenous languages, scripts, and translator.',
    hindiReply: 'जनजातीय भाषाएं और अनुवादक खोल रहा हूँ।',
    category: 'Languages - Hindi'
  },
  {
    pattern: /(घर\s*जाओ|होम\s*खोलो|मुख्य\s*पृष्ठ|होम\s*पर\s*जाओ|ghar\s*jao|home\s*kholo|homepage\s*kholo|home\s*pe\s*jao|main\s*page\s*kholo)/i,
    route: '/',
    reply: 'Taking you home to Vanaj.',
    hindiReply: 'वनाज के मुख्य पृष्ठ पर जा रहे हैं।',
    category: 'Home - Hindi'
  },

  // 10. LANGUAGES & HOME
  {
    pattern: /(open\s+languages?|tribal\s+languages?|translate|translator|ol\s+chiki|warang\s+citi|dictionary)/i,
    route: '/languages',
    reply: 'Opening the indigenous languages, scripts, and translator.',
    category: 'Languages'
  },
  {
    pattern: /(take\s+me\s+home|go\s+home|^home$|back\s+to\s+home|main\s+page|homepage)/i,
    route: '/',
    reply: 'Taking you home to Vanaj.',
    category: 'Home'
  }
];

function matchLocalIntent(query) {
  if (!query) return null;
  const clean = query.trim().toLowerCase();
  const isHindi = /[\u0900-\u097F]/.test(clean) || /\b(kholo|dikhao|chalao|karo|hatao|jao|bhojan|nritya|naksha|khana|madad|chup|piche|peeche|upar|neeche|mere|mera|kya\s+hai|kul|kitna|anuvad|jharne|mandir|vanyajeev|gahne|kapde|mala|aabhushan|karyashala|roko|palto|agla|santali|santhali|dhuska)\b/i.test(clean);

  for (const item of LOCAL_INTENT_MAP) {
    if (item.pattern.test(clean)) {
      let action = item.action ? { ...item.action } : null;
      let reply = (isHindi && item.hindiReply) ? item.hindiReply : item.reply;
      if (action && action.type === 'ADD_TO_CART') {
        if (/banki|bracelet/i.test(clean)) {
          action.itemKey = 'banki';
          reply = isHindi ? 'बांकी पारंपरिक कंगन को आपकी कार्ट में जोड़ दिया गया है।' : 'Added Banki traditional bracelet to your shopping cart. Opening your cart now.';
        } else if (/dhokra|sculpture|figurine/i.test(clean)) {
          action.itemKey = 'dhokra';
          reply = isHindi ? 'ढोकरा धातु मूर्ति को आपकी कार्ट में जोड़ दिया गया है।' : 'Added Dhokra tribal sculpture to your shopping cart. Opening your cart now.';
        } else if (/bamboo|basket/i.test(clean)) {
          action.itemKey = 'bamboo';
          reply = isHindi ? 'बांस की हस्तनिर्मित टोकरी को आपकी कार्ट में जोड़ दिया गया है।' : 'Added Bamboo handcrafted basket to your shopping cart. Opening your cart now.';
        } else if (/necklace|hansuli|pendant/i.test(clean)) {
          action.itemKey = 'necklace';
          reply = isHindi ? 'पारंपरिक जनजातीय हार को आपकी कार्ट में जोड़ दिया गया है।' : 'Added traditional tribal necklace to your shopping cart. Opening your cart now.';
        } else if (/ring/i.test(clean)) {
          action.itemKey = 'ring';
          reply = isHindi ? 'जनजातीय अंगूठी को आपकी कार्ट में जोड़ दिया गया है।' : 'Added tribal finger ring to your shopping cart. Opening your cart now.';
        } else if (/armlet/i.test(clean)) {
          action.itemKey = 'armlet';
          reply = isHindi ? 'जनजातीय बाजूबंद को आपकी कार्ट में जोड़ दिया गया है।' : 'Added tribal armlet to your shopping cart. Opening your cart now.';
        } else {
          action.itemKey = 'shirt';
          reply = isHindi ? 'संथाली शर्ट को आपकी कार्ट में जोड़ दिया गया है।' : 'Added authentic Santhali tribal shirt to your shopping cart. Opening your cart now.';
        }
      }

      return {
        route: item.route,
        reply,
        action,
        category: isHindi ? `${item.category} - Hindi` : item.category,
        source: 'local_intent_rule'
      };
    }
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST is accepted.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body.' });
    }
  }

  const { query, currentRoute = '/' } = body || {};
  const trimmed = (query || '').trim();

  if (!trimmed) {
    return res.status(400).json({ error: 'Please provide a voice or text command.' });
  }

  // Fast, deterministic rule matching (works offline & with 0 latency for both Hindi and English)
  const localMatch = matchLocalIntent(trimmed);
  if (localMatch) {
    return res.status(200).json(localMatch);
  }

  const isHindi = /[\u0900-\u097F]/.test(trimmed) || /\b(kholo|khol\s*do|dikhao|dikha\s*do|chalao|chala\s*do|karo|kar\s*do|kardo|hatao|hata\s*do|jao|bhojan|nritya|nach|naksha|khana|madad|sahayata|chup|shant|bolna|piche|peeche|wapas|upar|niche|neeche|mere|mera|meri|kya|kyun|kaise|kitna|kitne|kul|anuvad|jharne|jharna|mandir|vanyajeev|gahne|gehne|kapde|kapda|mala|haar|aabhushan|karyashala|roko|rok\s*do|palto|palat|agla|dusra|doosra|santali|santhali|dhuska|bajao|band|nikal|dalo|batao|chahiye|hai|hain)\b/i.test(trimmed);

  // Gemini AI fallback for complex or conversational natural language commands
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const prompt = `You are the voice navigation assistant for Vanaj, an indigenous cultural platform for Jharkhand, India.
Analyze the user command: "${trimmed}".
The user can speak in English, Hindi (Devanagari), or Hinglish (Hindi written in Roman letters).
Map the command to one of the following application routes and actions:

Available Routes:
- "/dance" (tribal folk dances)
- "/food" (indigenous cuisine and recipes)
- "/languages" (tribal languages, scripts, flashcards, dictionary, map)
- "/tourism" (destinations, temples, waterfalls, wildlife, workshops)
- "/marketplace" (tribal crafts, clothes, ornaments, jewelry, cart)
- "/" (home)

Available Actions:
- { type: "PLAY_DANCE", dance: "ho" | "santhali" | "oraon" | "asur" | "kharia" }
- { type: "PAUSE_VIDEO" }, { type: "CLOSE_VIDEO" }, { type: "NEXT_DANCE" }
- { type: "FILTER_FOOD_TRIBE", tribe: "Santhali" | "Ho" | "Oraon" | "Munda" }
- { type: "SELECT_FOOD", dish: "Dhuska" | "Chilka Roti" | "Rugra" | "Red Ant Chutney" }
- { type: "OPEN_FLASHCARDS", language: "Santali" | "Mundari" | "Ho" }
- { type: "FLIP_CARD" }, { type: "NEXT_CARD" }
- { type: "TRANSLATE", word: "water", language: "Santali" }
- { type: "FILTER_TOURISM", filter: "Temple" | "Waterfall" | "Wildlife" }
- { type: "SEARCH_TOURISM", query: string }
- { type: "SHOW_WORKSHOPS" }, { type: "OPEN_HOST_WORKSHOP" }
- { type: "SWITCH_TAB", tab: "Ornaments" | "Clothes" | "Necklaces" }
- { type: "WHAT_IN_CART" }, { type: "WHAT_IS_TOTAL" }, { type: "REMOVE_FROM_CART", itemKey: "shirt" }
- { type: "OPEN_MAP" }, { type: "SCROLL_DOWN" }, { type: "SCROLL_UP" }, { type: "GO_TO_TOP" }, { type: "GO_BACK" }

Instructions:
1. If the user query is in Hindi or Hinglish, the "reply" MUST be in natural, polite Hindi (Devanagari script).
2. If the user query is in English, the "reply" MUST be in English.
3. If unrecognized, do NOT repeat the user's words. For Hindi reply "माफ़ कीजिये, मैं समझ नहीं पाया। आप कह सकते हैं: 'हो नृत्य चलाओ', 'धुस्का दिखाओ', या 'मेरे कार्ट में क्या है'।" For English reply "I didn't catch that. You can try saying 'open dance', 'show Dhuska', or 'view cart'."

Output strictly JSON:
{ "route": string | null, "reply": string, "action": object | null, "category": string }`;

      const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash'];
      for (const model of candidateModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
            }),
            signal: AbortSignal.timeout(1800)
          });
          if (response.ok) {
            const data = await response.json();
            const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textContent) {
              const parsed = JSON.parse(textContent);
              return res.status(200).json({ ...parsed, source: 'gemini_ai' });
            }
          } else if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 404) {
            break;
          }
        } catch {}
      }
    } catch {}
  }

  // RELIABILITY REQUIREMENT:
  // When a command is not understood, do NOT repeat the user's words back.
  // Say "I didn't catch that" (or Hindi polite equivalent) and suggest 2 or 3 valid commands.
  return res.status(200).json({
    route: null,
    reply: isHindi
      ? "माफ़ कीजिये, मैं समझ नहीं पाया। आप कह सकते हैं: 'हो नृत्य चलाओ', 'धुस्का दिखाओ', या 'मेरे कार्ट में क्या है'।"
      : "I didn't catch that. You can try saying 'open dance', 'show Dhuska', or 'view cart'.",
    category: isHindi ? 'Unrecognized - Hindi' : 'Unrecognized',
    source: 'rule_fallback'
  });
}
