// Resilient intent dictionary for instant local matching
const LOCAL_INTENT_MAP = [
  // Home commands
  {
    pattern: /(take\s+me\s+home|go\s+home|^home$|back\s+to\s+home|main\s+page|homepage)/i,
    route: '/',
    reply: 'Taking you home to Vanaj.',
    category: 'Home'
  },
  // Santali dances
  {
    pattern: /(santali\s+dance|santhali\s+dance|santhal\s+dance|santali|santhali)/i,
    route: '/dance?dance=santhali',
    reply: 'Showing you the authentic Santhali folk dance from Santhal Pargana.',
    category: 'Dance - Santhali'
  },
  // Specific dances
  {
    pattern: /(ho\s+folk\s+dance|ho\s+dance)/i,
    route: '/dance?dance=ho',
    reply: 'Opening the Ho folk dance of West Singhbhum.',
    category: 'Dance - Ho'
  },
  {
    pattern: /(oraon\s+dance|oraon\s+folk\s+dance)/i,
    route: '/dance?dance=oraon',
    reply: 'Opening the vibrant Oraon folk dance.',
    category: 'Dance - Oraon'
  },
  {
    pattern: /(asur\s+dance|asur\s+folk\s+dance)/i,
    route: '/dance?dance=asur',
    reply: 'Opening the Asur folk dance celebrating tribal traditions.',
    category: 'Dance - Asur'
  },
  {
    pattern: /(kharia\s+dance|khariya\s+dance)/i,
    route: '/dance?dance=kharia',
    reply: 'Opening the harvest dance of the Kharia tribe.',
    category: 'Dance - Kharia'
  },
  // General dance
  {
    pattern: /(open\s+dance|show\s+dances?|tribal\s+dance|dances\s+of\s+jharkhand|^dance$)/i,
    route: '/dance',
    reply: 'Opening the sacred dances of Jharkhand.',
    category: 'Dance'
  },
  // Ornaments & Jewelry
  {
    pattern: /(where\s+can\s+i\s+buy\s+ornaments|buy\s+ornaments|ornaments?|jewel+ry|traditional\s+ornament|banki|armlet|hair\s+pin|kundri|waist\s+belt)/i,
    route: '/marketplace?tab=Ornaments',
    reply: 'Taking you to our handcrafted tribal ornaments in the marketplace.',
    category: 'Marketplace - Ornaments'
  },
  // Clothes & Attire
  {
    pattern: /(tribal\s+cloth|buy\s+clothes|clothing|attire|traditional\s+dress|sarees?|phuta\s+kacha)/i,
    route: '/marketplace?tab=Clothes',
    reply: 'Showing authentic handwoven tribal clothing in the marketplace.',
    category: 'Marketplace - Clothes'
  },
  // Necklaces
  {
    pattern: /(necklaces?|pendants?|dhokra\s+necklace|choker)/i,
    route: '/marketplace?tab=Necklaces',
    reply: 'Showing traditional brass and terracotta necklaces in the marketplace.',
    category: 'Marketplace - Necklaces'
  },
  // Handicrafts
  {
    pattern: /(handicrafts?|dhokra\s+craft|sculptures?|figurines?|terracotta\s+dancer)/i,
    route: '/marketplace?tab=Handicrafts',
    reply: 'Showing ancient Dhokra metal sculptures and handicrafts in the marketplace.',
    category: 'Marketplace - Handicrafts'
  },
  // Bamboo Crafts
  {
    pattern: /(bamboo\s+crafts?|bamboo\s+basket|woven\s+bamboo)/i,
    route: '/marketplace?tab=Bamboo+Crafts',
    reply: 'Showing GI-tagged Mohli bamboo crafts in the marketplace.',
    category: 'Marketplace - Bamboo Crafts'
  },
  // General Marketplace
  {
    pattern: /(open\s+marketplace|marketplace|shop|store|buy\s+tribal|crafts?\s+store)/i,
    route: '/marketplace',
    reply: 'Opening the Vanaj marketplace supporting indigenous artisans.',
    category: 'Marketplace'
  },
  // Tourism - Waterfalls
  {
    pattern: /(show\s+waterfalls?(\s+in\s+tourism)?|waterfalls?|hundru|jonha|dassam|lodh|panchghagh|water\s+fall)/i,
    route: '/tourism?filter=Waterfall',
    reply: 'Showing the scenic waterfalls of Jharkhand in tourism.',
    category: 'Tourism - Waterfalls'
  },
  // Tourism - Wildlife
  {
    pattern: /(wildlife|animals?|sanctuary|betla|dalma|national\s+park|forests?)/i,
    route: '/tourism?filter=Wildlife',
    reply: 'Showing wildlife sanctuaries and national parks in tourism.',
    category: 'Tourism - Wildlife'
  },
  // Tourism - Temple
  {
    pattern: /(temples?|sacred\s+sites?|baidyanath|jyotirlinga|parasnath|rajrappa|worship)/i,
    route: '/tourism?filter=Temple',
    reply: 'Showing sacred temples and heritage shrines in tourism.',
    category: 'Tourism - Temples'
  },
  // Tourism - Valley
  {
    pattern: /(valleys?|patratu|netarhat|hills?|viewpoint)/i,
    route: '/tourism?filter=Valley',
    reply: 'Showing picturesque valleys and hills of Jharkhand in tourism.',
    category: 'Tourism - Valleys'
  },
  // Tourism - Lake
  {
    pattern: /(lakes?|dimna|tilaiya|water\s+bodies)/i,
    route: '/tourism?filter=Lake',
    reply: 'Showing serene lakes of Jharkhand in tourism.',
    category: 'Tourism - Lakes'
  },
  // Tourism - Heritage
  {
    pattern: /(heritage|monuments?|maluti|navratangarh|forts?|ancient\s+ruins)/i,
    route: '/tourism?filter=Heritage',
    reply: 'Showing historical heritage sites and ancient forts in tourism.',
    category: 'Tourism - Heritage'
  },
  // General Tourism
  {
    pattern: /(open\s+tourism|tourism|places\s+to\s+visit|travel|tour|workshops?|destinations?)/i,
    route: '/tourism',
    reply: 'Opening Jharkhand cultural tourism and immersion journeys.',
    category: 'Tourism'
  },
  // Food
  {
    pattern: /(open\s+food|tribal\s+food|cuisine|dishes|recipes?|dhuska|chilka|rugra|what\s+do\s+they\s+eat)/i,
    route: '/food',
    reply: 'Opening the tribal culinary heritage and traditional dishes.',
    category: 'Food'
  },
  // Languages & Translation
  {
    pattern: /(open\s+languages?|tribal\s+languages?|translate|translator|ol\s+chiki|warang\s+citi|dictionary)/i,
    route: '/languages',
    reply: 'Opening the indigenous languages, scripts, and translator.',
    category: 'Languages'
  }
];

function matchLocalIntent(query) {
  if (!query) return null;
  const clean = query.trim().toLowerCase();
  for (const item of LOCAL_INTENT_MAP) {
    if (item.pattern.test(clean)) {
      return {
        route: item.route,
        reply: item.reply,
        category: item.category,
        source: 'local_intent_rule'
      };
    }
  }
  return null;
}

function cleanJsonResponse(rawText) {
  if (!rawText) return null;
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\s*/i, '').replace(/```\s*$/, '').trim();
  }
  return JSON.parse(cleaned);
}

export default async function handler(req, res) {
  // CORS configuration
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

  // Check fast local rule first for deterministic, instantaneous matching on core commands
  const localMatch = matchLocalIntent(trimmed);
  if (localMatch) {
    return res.status(200).json(localMatch);
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  // If no Gemini API key configured, use friendly fallback
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(200).json({
      route: '/',
      reply: `Johar! I heard "${trimmed}". You can ask me to open dance, show Santali dances, find ornaments, or show waterfalls.`,
      category: 'Help',
      source: 'fallback_help'
    });
  }

  const prompt = `You are the intelligent voice navigation assistant for "Vanaj", an interactive cultural archive and artisan platform for the indigenous tribes of Jharkhand, India.
A user has spoken or typed a navigation request: "${trimmed}".
The user is currently on route: "${currentRoute}".

The site routes and filters are:
1. "/" - Home page: Welcome hero, tribal pillars, cultural introduction, mission.
2. "/dance" - Sacred dances of Jharkhand.
   Supports query parameter:
   - "?dance=santhali" : Santhali Dance (Santhal Pargana, Sohrai & Baha festivals)
   - "?dance=ho" : Ho Folk Dance (West Singhbhum, Mage & Phagu)
   - "?dance=oraon" : Oraon Folk Dance (Ranchi/Gumla, Karma & Sarhul)
   - "?dance=asur" : Asur Folk Dance (iron smelting heritage)
   - "?dance=kharia" : Kharia Folk Dance (harvest festivals)
3. "/marketplace" - Authentic tribal crafts and artisan store.
   Supports category tab query parameter:
   - "?tab=Ornaments" : Traditional jewelry, brass armlets, Banki bracelets, earrings, hair ornaments, rings
   - "?tab=Clothes" : Handwoven tribal attire (Santhali, Oraon, Munda, Ho, Kharia, Asur clothing)
   - "?tab=Necklaces" : Terracotta and Dhokra bell-metal necklaces
   - "?tab=Handicrafts" : Dhokra bell-metal sculptures, terracotta figurines
   - "?tab=Bamboo+Crafts" : Bamboo baskets, woven crafts
4. "/tourism" - Jharkhand eco & cultural tourism, workshops.
   Supports filter query parameter:
   - "?filter=Waterfall" : Spectacular waterfalls (Hundru, Jonha, Dassam, Lodh, Panchghagh)
   - "?filter=Wildlife" : Betla National Park, Dalma Wildlife Sanctuary
   - "?filter=Temple" : Baidyanath Jyotirlinga, Parasnath, Rajrappa
   - "?filter=Valley" : Patratu Valley, Netarhat Hills
   - "?filter=Lake" : Dimna Lake, Tilaiya Lake
   - "?filter=Heritage" : Maluti Terracotta Temples, Navratangarh Fort
5. "/food" - Indigenous culinary heritage (Dhuska, Chilka Roti, Rugra, Bamboo shoot curry).
6. "/languages" - Indigenous tribal languages (Santali, Mundari, Ho, Kurukh, Kharia, Khortha), Ol Chiki script, Warang Citi script, Tolong Siki, and interactive translator.

Instructions:
1. Identify user intent and select the single most accurate route (including query parameters if specific filter requested).
2. Generate a warm, concise voice reply (1 to 2 sentences max) describing where you are taking them. Keep it clear and natural for speech synthesis.
3. Specific command examples:
   - "open dance" -> route: "/dance", reply: "Opening the indigenous dances of Jharkhand."
   - "show me Santali dances" -> route: "/dance?dance=santhali", reply: "Showing the Santhali dance from Santhal Pargana."
   - "where can I buy ornaments" -> route: "/marketplace?tab=Ornaments", reply: "Taking you to traditional tribal ornaments in the marketplace."
   - "show waterfalls in tourism" -> route: "/tourism?filter=Waterfall", reply: "Showing the scenic waterfalls of Jharkhand in tourism."
   - "take me home" -> route: "/", reply: "Taking you home to Vanaj."
4. If the intent does not match a specific page, direct them to "/" with a polite, helpful suggestion.

Output strictly valid JSON with this schema:
{
  "route": "string",
  "reply": "string",
  "category": "string"
}`;

  const candidateModels = [
    'gemini-flash-latest',
    'gemini-2.5-flash',
    'gemini-3.5-flash',
    'gemini-3.8-flash'
  ];

  let _lastError = null;

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(4000),
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        _lastError = new Error(`[${model}] ${errorData?.error?.message || response.status}`);
        continue;
      }

      const resultData = await response.json();
      const rawText = resultData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response from navigation model.');

      const parsed = cleanJsonResponse(rawText);
      if (!parsed || !parsed.route || !parsed.reply) {
        throw new Error('Invalid JSON format from navigation model.');
      }

      return res.status(200).json({
        route: parsed.route,
        reply: parsed.reply,
        category: parsed.category || 'Navigation',
        modelUsed: model,
        source: 'ai'
      });
    } catch (err) {
      _lastError = err;
    }
  }

  // If AI generation failed, use local rule match or friendly fallback
  if (localMatch) {
    return res.status(200).json({
      ...localMatch,
      note: 'ai_fallback_to_rules'
    });
  }

  return res.status(200).json({
    route: '/',
    reply: `Johar! I heard "${trimmed}". You can ask me to open dance, show Santali dances, find ornaments, or show waterfalls.`,
    category: 'Help',
    source: 'error_fallback'
  });
}
