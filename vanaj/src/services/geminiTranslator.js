/**
 * Gemini Translation Service for Indigenous Tribal Languages of Jharkhand
 * Supports: Santali, Mundari, Ho, Kurukh, Kharia, Khortha
 *
 * NOTE: For maximum security, all API calls are proxied through the server-side
 * `/api/translate` endpoint. The API key is NEVER exposed to the client or browser bundle.
 */

// Supported Tribal Languages metadata
export const TRIBAL_LANGUAGES = [
  { id: 'Santali', name: 'Santali', script: 'Ol Chiki', speakers: '~7.6M', region: 'Santhal Pargana & Kolhan' },
  { id: 'Mundari', name: 'Mundari', script: 'Devanagari / Mundari Bani', speakers: '~1.6M', region: 'Ranchi, Khunti & Singhbhum' },
  { id: 'Ho', name: 'Ho', script: 'Warang Citi', speakers: '~1.4M', region: 'West Singhbhum & Kolhan' },
  { id: 'Kurukh', name: 'Kurukh (Oraon)', script: 'Tolong Siki / Devanagari', speakers: '~2.0M', region: 'Chotanagpur Plateau' },
  { id: 'Kharia', name: 'Kharia', script: 'Devanagari', speakers: '~300K', region: 'Simdega, Gumla & Ranchi' },
  { id: 'Khortha', name: 'Khortha', script: 'Devanagari', speakers: '~8M', region: 'North Chotanagpur' },
];

// Offline verified fallback dictionary for instant resilience if offline
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

/**
 * Translates English text to a Jharkhand tribal language.
 * Requests are securely routed to `/api/translate` so the API key is never exposed to the client.
 *
 * @param {string} text - English word or short phrase
 * @param {string} language - Target language (Santali, Mundari, Ho, Kurukh, Kharia, Khortha)
 * @returns {Promise<{
 *   translatedText: string,
 *   pronunciation: string,
 *   script: string,
 *   scriptName: string,
 *   context: string,
 *   modelUsed?: string,
 *   source?: string
 * }>}
 */
export async function translateTribal(text, language = 'Santali') {
  const trimmed = (text || '').trim();
  if (!trimmed) {
    throw new Error('Please enter a word or short phrase to translate.');
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: trimmed,
        language
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Translation failed (HTTP ${response.status})`);
    }

    return {
      translatedText: data.translatedText,
      pronunciation: data.pronunciation || data.translatedText,
      script: data.script || '',
      scriptName: data.scriptName || (language === 'Santali' ? 'Ol Chiki' : 'Devanagari'),
      context: data.context || `Traditional term in ${language} culture.`,
      modelUsed: data.modelUsed,
      source: data.source || 'ai'
    };
  } catch (err) {
    // Resilient fallback to local verified archive if offline or server issue
    const cleanWord = trimmed.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    const langKey = language.toLowerCase().split(' ')[0];
    const dict = FALLBACK_DICTIONARY[langKey];
    if (dict && dict[cleanWord]) {
      return {
        ...dict[cleanWord],
        source: 'local_archive_fallback'
      };
    }

    throw err;
  }
}
