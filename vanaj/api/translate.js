// Offline verified fallback dictionary for resilient fallback on server
const FALLBACK_DICTIONARY = {
  'santali': {
    'hello': { translatedText: 'Johar', pronunciation: 'jo-har', script: 'ᱡᱚᱦᱟᱨ', scriptName: 'Ol Chiki', context: 'Traditional greeting conveying deep respect and acknowledgement of the divine within each person.' },
    'thank you': { translatedText: 'Aadi sarhao', pronunciation: 'ah-dee sar-how', script: 'ᱟᱹᱰᱤ ᱥᱟᱨᱦᱟᱣ', scriptName: 'Ol Chiki', context: 'Expression of sincere gratitude in the Santal community.' },
    'water': { translatedText: 'Daah', pronunciation: 'dah', script: 'ᱫᱟᱜ', scriptName: 'Ol Chiki', context: 'Essential life element in tribal reverence for nature.' },
    'friend': { translatedText: 'Gati', pronunciation: 'gah-tee', script: 'ᱜᱟᱛᱮ', scriptName: 'Ol Chiki', context: 'Companion or trusted confidant.' },
    'welcome': { translatedText: 'Sagun daram', pronunciation: 'sah-gun dah-rahm', script: 'ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ', scriptName: 'Ol Chiki', context: 'Warm formal welcome to community and home.' },
    'sun': { translatedText: 'Singi chandu', pronunciation: 'sing-ee chan-doo', script: 'ᱥᱤᱧ ᱪᱟᱸᱫᱚ', scriptName: 'Ol Chiki', context: 'The Sun deity in Sarna spirituality.' }
  },
  'mundari': {
    'hello': { translatedText: 'Johar', pronunciation: 'jo-har', script: 'जोहार', scriptName: 'Devanagari', context: 'Traditional greeting used across Munda festivals and daily encounters.' },
    'thank you': { translatedText: 'Eshuu marang', pronunciation: 'eh-shoo mah-rahng', script: 'एशू मारंग', scriptName: 'Devanagari', context: 'Heartfelt thankfulness and high regard.' },
    'water': { translatedText: 'Da:', pronunciation: 'daah', script: 'दा:', scriptName: 'Devanagari', context: 'Sacred water used in nature rituals in the sacred grove (Jaher).' },
    'friend': { translatedText: 'Gatiing', pronunciation: 'gah-teeng', script: 'गतींग', scriptName: 'Devanagari', context: 'Close friend bonded by shared life and labor.' },
    'welcome': { translatedText: 'Johar goya', pronunciation: 'jo-har go-yah', script: 'जोहार गोया', scriptName: 'Devanagari', context: 'Welcoming greeting to respected kin and visitors.' },
    'sun': { translatedText: 'Singbonga', pronunciation: 'sing-bong-ah', script: 'सिंगबोंगा', scriptName: 'Devanagari', context: 'Supreme creator deity represented by the Sun in Munda cosmology.' }
  },
  'ho': {
    'hello': { translatedText: 'Johar', pronunciation: 'jo-har', script: '𑢠𑢵𑢫𑢲', scriptName: 'Warang Citi', context: 'Traditional salutation expressing mutual honour and unity.' },
    'thank you': { translatedText: 'Eshuu marang', pronunciation: 'eh-shoo mah-rahng', script: '𑢦𑢶𑢵 𑢪𑢲𑢵𑢯', scriptName: 'Warang Citi', context: 'Great gratitude in the Ho society.' },
    'water': { translatedText: 'Daa', pronunciation: 'dah', script: '𑢡𑢲', scriptName: 'Warang Citi', context: 'Water, the sacred life-giver in agrarian rituals.' },
    'friend': { translatedText: 'Gating', pronunciation: 'gah-ting', script: '𑢠𑢵𑢫𑢲', scriptName: 'Warang Citi', context: 'Dear companion in the Kolhan homeland.' },
    'welcome': { translatedText: 'Suku johar', pronunciation: 'soo-koo jo-har', script: '𑢶𑢵𑢱𑢵 𑢠𑢵𑢫𑢲', scriptName: 'Warang Citi', context: 'Joyful welcoming salutation.' },
    'sun': { translatedText: 'Singi', pronunciation: 'sing-ee', script: '𑢶𑢲𑢯𑢲', scriptName: 'Warang Citi', context: 'The Sun, revered as the supreme manifestation of life.' }
  },
  'kurukh': {
    'hello': { translatedText: 'Johar', pronunciation: 'jo-har', script: 'जोहार', scriptName: 'Devanagari / Tolong Siki', context: 'Traditional greeting used across Oraon communities.' },
    'thank you': { translatedText: 'Kripa / Dhanyavad', pronunciation: 'kree-pah', script: 'धन्यवाद', scriptName: 'Devanagari', context: 'Expression of gratitude.' },
    'water': { translatedText: 'Amm', pronunciation: 'uh-mm', script: 'अम्म', scriptName: 'Devanagari', context: 'Water in Kurukh, sacred to village life and the Sarhul flower festival.' },
    'friend': { translatedText: 'Sanghi', pronunciation: 'sahn-ghee', script: 'संगी', scriptName: 'Devanagari', context: 'Lifelong comrade or companion.' },
    'welcome': { translatedText: 'Pahur johar', pronunciation: 'pah-hoor jo-har', script: 'पाहुर जोहार', scriptName: 'Devanagari', context: 'Warm greeting extended to visitors and guests.' },
    'sun': { translatedText: 'Biri', pronunciation: 'bee-ree', script: 'बीड़ी', scriptName: 'Devanagari', context: 'The Sun in Oraon nature worship.' }
  },
  'kharia': {
    'hello': { translatedText: 'Johar', pronunciation: 'jo-har', script: 'जोहार', scriptName: 'Devanagari', context: 'Standard respectful greeting in Kharia villages.' },
    'thank you': { translatedText: 'Dhanbad', pronunciation: 'dhun-bahd', script: 'धनबाद', scriptName: 'Devanagari', context: 'Expression of thanks.' },
    'water': { translatedText: 'Da', pronunciation: 'dah', script: 'दा', scriptName: 'Devanagari', context: 'Vital source of sustenance and village identity.' },
    'friend': { translatedText: 'Mitan', pronunciation: 'mee-tahn', script: 'मितान', scriptName: 'Devanagari', context: 'Sacred friend through traditional kinship pacts.' },
    'welcome': { translatedText: 'Swagat', pronunciation: 'swah-gut', script: 'स्वागत', scriptName: 'Devanagari', context: 'Welcome to hearth and community.' },
    'sun': { translatedText: 'Sing', pronunciation: 'sing', script: 'सिंग', scriptName: 'Devanagari', context: 'The radiant Sun worshipped in Kharia cosmology.' }
  },
  'khortha': {
    'hello': { translatedText: 'Johar / Pranam', pronunciation: 'jo-har', script: 'जोहार', scriptName: 'Devanagari', context: 'Common greeting across northern and eastern Jharkhand.' },
    'thank you': { translatedText: 'Dhanbadi', pronunciation: 'dhun-bah-dee', script: 'धनबादी', scriptName: 'Devanagari', context: 'Grateful acknowledgement.' },
    'water': { translatedText: 'Paani', pronunciation: 'pah-nee', script: 'पानी', scriptName: 'Devanagari', context: 'Water in rural life and agriculture.' },
    'friend': { translatedText: 'Sangi / Yaar', pronunciation: 'sahn-gee', script: 'संगी', scriptName: 'Devanagari', context: 'Close friend or village mate.' },
    'welcome': { translatedText: 'Swagat', pronunciation: 'swah-gut', script: 'स्वागत', scriptName: 'Devanagari', context: 'Hospitality greeting for visitors.' },
    'sun': { translatedText: 'Bero / Suraj', pronunciation: 'beh-ro', script: 'बेरो', scriptName: 'Devanagari', context: 'The morning Sun in folklore and agricultural calendars.' }
  }
};

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

  const { text, language = 'Santali' } = body || {};
  const trimmed = (text || '').trim();

  if (!trimmed) {
    return res.status(400).json({ error: 'Please enter a word or short phrase to translate.' });
  }

  // Reads the key directly from process.env.GEMINI_API_KEY (no VITE_ prefix)
  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key configured, check fallback dictionary
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    const cleanWord = trimmed.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    const langKey = language.toLowerCase().split(' ')[0];
    const dict = FALLBACK_DICTIONARY[langKey];
    if (dict && dict[cleanWord]) {
      return res.status(200).json({
        ...dict[cleanWord],
        source: 'local_archive'
      });
    }
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured on the server.' });
  }

  const prompt = `You are an expert scholar and native linguist of the indigenous tribal languages of Jharkhand, India.
Translate the following English word or short phrase into ${language}.
English text: "${trimmed}"

Specialist Linguistic Instructions:
1. "translatedText": The accurate word or phrase in standard Roman/Latin transliteration (e.g. "Johar", "da:", "gating").
2. "pronunciation": A clear phonetic pronunciation guide with hyphenated syllables for English speakers (e.g. "Jo-har", "Daah", "Ga-ting").
3. "script": The exact word/phrase written in its indigenous script:
   - For Santali: MUST use authentic Ol Chiki script (ᱚᱞ ᱪᱤᱠᱤ) Unicode characters (U+1C50 to U+1C7F).
   - For Ho: Use Warang Citi script (Unicode U+118A0-U+118FF) or Devanagari.
   - For Kurukh: Use Tolong Siki or Devanagari script.
   - For Mundari, Kharia, Khortha: Use Devanagari script.
4. "scriptName": The name of the script used (e.g., "Ol Chiki", "Warang Citi", "Tolong Siki", "Devanagari").
5. "context": A concise 1-2 sentence cultural explanation, spiritual nuance, or everyday traditional usage.

Output strictly valid JSON matching this schema:
{
  "translatedText": "string",
  "pronunciation": "string",
  "script": "string",
  "scriptName": "string",
  "context": "string"
}`;

  const candidateModels = [
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-3.8-flash'
  ];

  let lastError = null;

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const status = response.status;
        const msg = errorData?.error?.message || `HTTP ${status}`;
        lastError = new Error(`[${model}] ${msg}`);
        continue;
      }

      const resultData = await response.json();
      const rawText = resultData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('Empty response received from translation service.');
      }

      const parsed = cleanJsonResponse(rawText);
      if (!parsed || !parsed.translatedText) {
        throw new Error('Invalid translation format received.');
      }

      return res.status(200).json({
        translatedText: parsed.translatedText,
        pronunciation: parsed.pronunciation || parsed.translatedText,
        script: parsed.script || '',
        scriptName: parsed.scriptName || (language === 'Santali' ? 'Ol Chiki' : 'Devanagari'),
        context: parsed.context || `Traditional term in ${language} culture.`,
        modelUsed: model,
        source: 'ai'
      });
    } catch (err) {
      lastError = err;
    }
  }

  // Fallback to local verified dictionary if model quota or error
  const cleanWord = trimmed.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const langKey = language.toLowerCase().split(' ')[0];
  const dict = FALLBACK_DICTIONARY[langKey];
  if (dict && dict[cleanWord]) {
    return res.status(200).json({
      ...dict[cleanWord],
      source: 'local_archive_fallback'
    });
  }

  return res.status(500).json({
    error: lastError?.message || 'Failed to translate. Please check your network or try again.'
  });
}
