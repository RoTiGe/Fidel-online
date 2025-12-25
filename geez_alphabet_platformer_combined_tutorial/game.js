// Geez Alphabet Platformer - Combined Educational Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fullscreen responsive dimensions
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let WORLD_WIDTH = SCREEN_WIDTH * 3;
let gameStarted = false;

const GRAVITY = 0.5;
const JUMP_STRENGTH = -12;
const PLAYER_SPEED = 5;

// Set canvas to fullscreen
function resizeCanvas() {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    WORLD_WIDTH = SCREEN_WIDTH * 3;
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Start game function (called when continue button is clicked)
function startGame() {
    document.getElementById('instructionsModal').classList.add('hidden');
    gameStarted = true;
    resizeCanvas();
}
window.startGame = startGame;

// Geez Alphabet Dictionary with pronunciations
const GeezAlphabetDict = {
    // Note: 'eh' as in 'bed', 'ah' as in 'far', 'ee' as in 'see', 'ay' as in 'say', 'ih' as in 'pin'
    'ሀ': 'he', 'ሁ': 'hu', 'ሂ': 'hi', 'ሃ': 'ha', 'ሄ': 'hey', 'ህ': 'hih', 'ሆ': 'ho',
    'ለ': 'le', 'ሉ': 'lu', 'ሊ': 'li', 'ላ': 'la', 'ሌ': 'ley', 'ል': 'lih', 'ሎ': 'lo',
    'ሐ': 'he', 'ሑ': 'hu', 'ሒ': 'hi', 'ሓ': 'ha', 'ሔ': 'hey', 'ሕ': 'hih', 'ሖ': 'ho',
    'መ': 'me', 'ሙ': 'mu', 'ሚ': 'mi', 'ማ': 'ma', 'ሜ': 'mey', 'ም': 'mih', 'ሞ': 'mo',
    'ሠ': 'se', 'ሡ': 'su', 'ሢ': 'si', 'ሣ': 'sa', 'ሤ': 'sey', 'ሥ': 'sih', 'ሦ': 'so',
    'ረ': 're', 'ሩ': 'ru', 'ሪ': 'ri', 'ራ': 'ra', 'ሬ': 'rey', 'ር': 'rih', 'ሮ': 'ro',
    'ሰ': 'se', 'ሱ': 'su', 'ሲ': 'si', 'ሳ': 'sa', 'ሴ': 'sey', 'ስ': 'sih', 'ሶ': 'so',
    'ሸ': 'she', 'ሹ': 'shu', 'ሺ': 'shi', 'ሻ': 'sha', 'ሼ': 'shey', 'ሽ': 'shih', 'ሾ': 'sho',
    'ቀ': 'q’e', 'ቁ': 'q’u', 'ቂ': 'q’i', 'ቃ': 'q’a', 'ቄ': 'q’ey', 'ቅ': 'q’ih', 'ቆ': 'q’o',
    'በ': 'be', 'ቡ': 'bu', 'ቢ': 'bi', 'ባ': 'ba', 'ቤ': 'bey', 'ብ': 'bih', 'ቦ': 'bo',
    'ተ': 'te', 'ቱ': 'tu', 'ቲ': 'ti', 'ታ': 'ta', 'ቴ': 'tey', 'ት': 'tih', 'ቶ': 'to',
    'ኀ': 'he', 'ኁ': 'hu', 'ኂ': 'hi', 'ኃ': 'ha', 'ኄ': 'hey', 'ኅ': 'hih', 'ኆ': 'ho',
    'ነ': 'ne', 'ኑ': 'nu', 'ኒ': 'ni', 'ና': 'na', 'ኔ': 'ney', 'ን': 'nih', 'ኖ': 'no',
    'አ': 'ah', 'ኡ': 'u', 'ኢ': 'i', 'ኣ': 'aa', 'ኤ': 'ay', 'እ': 'ih', 'ኦ': 'o',
    'ከ': 'ke', 'ኩ': 'ku', 'ኪ': 'ki', 'ካ': 'ka', 'ኬ': 'key', 'ክ': 'kih', 'ኮ': 'ko',
    'ወ': 'we', 'ዉ': 'wu', 'ዊ': 'wi', 'ዋ': 'wa', 'ዌ': 'wey', 'ው': 'wih', 'ዎ': 'wo',
    'ዐ': 'ah', 'ዑ': 'u', 'ዒ': 'i', 'ዓ': 'aa', 'ዔ': 'ay', 'ዕ': 'ih', 'ኦ': 'o',
    'ዘ': 'ze', 'ዙ': 'zu', 'ዚ': 'zi', 'ዛ': 'za', 'ዜ': 'zey', 'ዝ': 'zih', 'ዞ': 'zo',
    'የ': 'ye', 'ዩ': 'yu', 'ዪ': 'yi', 'ያ': 'ya', 'ዬ': 'yey', 'ይ': 'yih', 'ዮ': 'yo',
    'ደ': 'de', 'ዱ': 'du', 'ዲ': 'di', 'ዳ': 'da', 'ዴ': 'dey', 'ድ': 'dih', 'ዶ': 'do',
    'ጀ': 'je', 'ጁ': 'ju', 'ጂ': 'ji', 'ጃ': 'ja', 'ጄ': 'jey', 'ጅ': 'jih', 'ጆ': 'jo',
    'ገ': 'ge', 'ጉ': 'gu', 'ጊ': 'gi', 'ጋ': 'ga', 'ጌ': 'gey', 'ግ': 'gih', 'ጎ': 'go',
    'ጠ': 't’e', 'ጡ': 't’u', 'ጢ': 't’i', 'ጣ': 't’a', 'ጤ': 't’ey', 'ጥ': 't’ih', 'ጦ': 't’o',
    'ጨ': 'ch’e', 'ጩ': 'ch’u', 'ጪ': 'ch’i', 'ጫ': 'ch’a', 'ጬ': 'ch’ey', 'ጭ': 'ch’ih', 'ጮ': 'ch’o',
    'ጰ': 'p’e', 'ጱ': 'p’u', 'ጲ': 'p’i', 'ጳ': 'p’a', 'ጴ': 'p’ey', 'ጵ': 'p’ih', 'ጶ': 'p’o',
    'ጸ': 'ts’e', 'ጹ': 'ts’u', 'ጺ': 'ts’i', 'ጻ': 'ts’a', 'ጼ': 'ts’ey', 'ጽ': 'ts’ih', 'ጾ': 'ts’o',
    'ፀ': 'ts’e', 'ፁ': 'ts’u', 'ፂ': 'ts’i', 'ፃ': 'ts’a', 'ፄ': 'ts’ey', 'ፅ': 'ts’ih', 'ፆ': 'ts’o',
    'ፈ': 'fe', 'ፉ': 'fu', 'ፊ': 'fi', 'ፋ': 'fa', 'ፌ': 'fey', 'ፍ': 'fih', 'ፎ': 'fo',
    'ፐ': 'pe', 'ፑ': 'pu', 'ፒ': 'pi', 'ፓ': 'pa', 'ፔ': 'pey', 'ፕ': 'pih', 'ፖ': 'po'
};

// Translations for educational words with categories
 const translations = {
  // --- 1. BASICS & GREETINGS ---
  "hello": { "amharic": "ሀሎ", "phonetic": "hal-lo", "category": "basics" },
  "goodbye": { "amharic": "ደህና ሁን", "phonetic": "deh-na hoon", "category": "basics" },
  "thank you": { "amharic": "አመሰግናለሁ", "phonetic": "ah-meh-seg-i-nal-hu", "category": "basics" },
  "please": { "amharic": "እባክህ", "phonetic": "ebak-h", "category": "basics" },
  "sorry": { "amharic": "ይቅርታ", "phonetic": "yi-qir-ta", "category": "basics" },
  "yes": { "amharic": "አዎ", "phonetic": "a-wo", "category": "basics" },
  "no": { "amharic": "አይ", "phonetic": "ay", "category": "basics" },
  "okay": { "amharic": "እሺ", "phonetic": "eh-shi", "category": "basics" },
  "excuse me": { "amharic": "ይቅር", "phonetic": "yi-qir", "category": "basics" },
  "welcome": { "amharic": "እንኳን ደህና መጡ", "phonetic": "en-kwan deh-na met-u", "category": "basics" },

  // --- 2. FAMILY ---
  "mother": { "amharic": "እናት", "phonetic": "en-naht", "category": "family" },
  "father": { "amharic": "አባት", "phonetic": "ah-baht", "category": "family" },
  "baby": { "amharic": "ህፃን", "phonetic": "hits-an", "category": "family" },
  "sister": { "amharic": "እህት", "phonetic": "eh-hit", "category": "family" },
  "brother": { "amharic": "ወንድም", "phonetic": "wen-dim", "category": "family" },
  "uncle": { "amharic": "አጎት", "phonetic": "ah-goht", "category": "family" },
  "aunt": { "amharic": "አክስት", "phonetic": "ah-kist", "category": "family" },
  "grandmother": { "amharic": "አያት", "phonetic": "ah-yaht", "category": "family" },
  "grandfather": { "amharic": "አያት", "phonetic": "ah-yaht", "category": "family" },
  "cousin": { "amharic": "አጎቴ", "phonetic": "ah-go-tay", "category": "family" },
  "family": { "amharic": "ቤተሰብ", "phonetic": "bet-e-seb", "category": "family" },
  "child": { "amharic": "ልጅ", "phonetic": "lij", "category": "family" },
  "children": { "amharic": "ልጆች", "phonetic": "lij-och", "category": "family" },

  // --- 2a. PEOPLE ---
  "friend": { "amharic": "ጓደኛ", "phonetic": "gwah-den-yah", "category": "people" },
  "teacher": { "amharic": "መምህር", "phonetic": "mem-hir", "category": "people" },
  "doctor": { "amharic": "ሀኪም", "phonetic": "hak-im", "category": "people" },
  "student": { "amharic": "ተማሪ", "phonetic": "tem-ari", "category": "people" },

  // --- 3. BODY PARTS ---
  "head": { "amharic": "ራስ", "phonetic": "rahs", "category": "body" },
  "eyes": { "amharic": "አይን", "phonetic": "ay-in", "category": "body" },
  "nose": { "amharic": "አፍንጫ", "phonetic": "af-in-ch'a", "category": "body" },
  "mouth": { "amharic": "አፍ", "phonetic": "af", "category": "body" },
  "hands": { "amharic": "እጅ", "phonetic": "edj", "category": "body" },
  "ears": { "amharic": "ጆሮ", "phonetic": "jo-ro", "category": "body" },
  "hair": { "amharic": "ፀጉር", "phonetic": "tse-goor", "category": "body" },
  "teeth": { "amharic": "ጥርስ", "phonetic": "tirs", "category": "body" },
  "feet": { "amharic": "እግር", "phonetic": "eg-ir", "category": "body" },
  "fingers": { "amharic": "ጣት", "phonetic": "tat", "category": "body" },
  "stomach": { "amharic": "ሆድ", "phonetic": "hod", "category": "body" },
  "heart": { "amharic": "ልብ", "phonetic": "lib", "category": "body" },

  // --- 4. CLOTHING ---
  "shirt": { "amharic": "ሸሚዝ", "phonetic": "she-miz", "category": "clothing" },
  "shoes": { "amharic": "ጫማ", "phonetic": "ch'ah-ma", "category": "clothing" },
  "hat": { "amharic": "ቆብ", "phonetic": "q'ob", "category": "clothing" },
  "pants": { "amharic": "ሱሪ", "phonetic": "su-ri", "category": "clothing" },
  "dress": { "amharic": "ኮንዶ", "phonetic": "kon-do", "category": "clothing" },
  "socks": { "amharic": "ጫማ ልብስ", "phonetic": "ch'ah-ma libs", "category": "clothing" },
  "coat": { "amharic": "ኮት", "phonetic": "kot", "category": "clothing" },
  "gloves": { "amharic": "ግብፅ", "phonetic": "geb-ts", "category": "clothing" },

  // --- 5. COLORS ---
  "red": { "amharic": "ቀይ", "phonetic": "q'ey", "category": "colors" },
  "blue": { "amharic": "ሰማያዊ", "phonetic": "se-ma-ya-wi", "category": "colors" },
  "yellow": { "amharic": "ቢጫ", "phonetic": "bi-ch'ah", "category": "colors" },
  "green": { "amharic": "አረንጓዴ", "phonetic": "ah-ren-gwa-de", "category": "colors" },
  "orange": { "amharic": "ብርቱካናማ", "phonetic": "bir-tu-ka-na-ma", "category": "colors" },
  "purple": { "amharic": "ሐምራዊ", "phonetic": "ham-ra-wi", "category": "colors" },
  "pink": { "amharic": "ሮዝ", "phonetic": "roz", "category": "colors" },
  "brown": { "amharic": "ቡናዊ", "phonetic": "bu-na-wi", "category": "colors" },
  "black": { "amharic": "ጥቁር", "phonetic": "t'iqur", "category": "colors" },
  "white": { "amharic": "ነጭ", "phonetic": "nech", "category": "colors" },
  "rainbow": { "amharic": "ቀስተ ደመና", "phonetic": "q'est-e dem-ena", "category": "colors" },

  // --- 6. NUMBERS ---
  "one": { "amharic": "አንድ", "phonetic": "and", "category": "numbers" },
  "two": { "amharic": "ሁለት", "phonetic": "hu-let", "category": "numbers" },
  "three": { "amharic": "ሶስት", "phonetic": "sost", "category": "numbers" },
  "four": { "amharic": "አራት", "phonetic": "a-rat", "category": "numbers" },
  "five": { "amharic": "አምስት", "phonetic": "am-ist", "category": "numbers" },
  "six": { "amharic": "ስድስት", "phonetic": "sid-ist", "category": "numbers" },
  "seven": { "amharic": "ሰባት", "phonetic": "se-bat", "category": "numbers" },
  "eight": { "amharic": "ስምንት", "phonetic": "sim-int", "category": "numbers" },
  "nine": { "amharic": "ዘጠኝ", "phonetic": "ze-ten-y", "category": "numbers" },
  "ten": { "amharic": "አስር", "phonetic": "as-ir", "category": "numbers" },
  "zero": { "amharic": "ዜሮ", "phonetic": "ze-ro", "category": "numbers" },

  // --- 7. EMOTIONS ---
  "happy": { "amharic": "ደስተኛ", "phonetic": "des-te-nya", "category": "emotions" },
  "sad": { "amharic": "አዘንተኛ", "phonetic": "azen-te-nya", "category": "emotions" },
  "angry": { "amharic": "ተናደደ", "phonetic": "ten-a-ded-e", "category": "emotions" },
  "scared": { "amharic": "ፈራ", "phonetic": "fer-a", "category": "emotions" },
  "surprised": { "amharic": "ደነቀ", "phonetic": "den-eq-e", "category": "emotions" },
  "excited": { "amharic": "ከባድ", "phonetic": "keb-ad", "category": "emotions" },
  "tired": { "amharic": "ድካም", "phonetic": "di-kam", "category": "emotions" },

  // --- 8. SCHOOL ---
  "school": { "amharic": "ትምህርት ቤት", "phonetic": "tim-hirt bet", "category": "school" },
  "pencil": { "amharic": "እርሳስ", "phonetic": "er-sas", "category": "school" },
  "paper": { "amharic": "ወረቀት", "phonetic": "wer-e-qet", "category": "school" },
  "draw": { "amharic": "መሳል", "phonetic": "me-sal", "category": "school" },
  "write": { "amharic": "መጻፍ", "phonetic": "mets-af", "category": "school" },
  "read": { "amharic": "መንበብ", "phonetic": "men-beb", "category": "school" },
  "learn": { "amharic": "መማር", "phonetic": "me-mar", "category": "school" },

  // --- 9. TOYS & PLAY ---
  "toy": { "amharic": "መጫወቻ", "phonetic": "mech-a-wech-a", "category": "toys" },
  "ball": { "amharic": "ኳስ", "phonetic": "kwas", "category": "toys" },
  "doll": { "amharic": "አሻንጉሊት", "phonetic": "ash-an-gu-lit", "category": "toys" },
  "game": { "amharic": "ጨዋታ", "phonetic": "ch'e-wa-ta", "category": "toys" },
  "play": { "amharic": "መጫወት", "phonetic": "mech-a-wet", "category": "toys" },
  "fun": { "amharic": "ደስታ", "phonetic": "des-ta", "category": "toys" },

  // --- 10. HOUSE ---
  "house": { "amharic": "ቤት", "phonetic": "bet", "category": "house" },
  "room": { "amharic": "ክፍል", "phonetic": "kif-il", "category": "house" },
  "door": { "amharic": "በር", "phonetic": "ber", "category": "house" },
  "window": { "amharic": "መስኮት", "phonetic": "mes-kot", "category": "house" },
  "bed": { "amharic": "አልጋ", "phonetic": "al-ga", "category": "house" },
  "table": { "amharic": "ጠረጴዛ", "phonetic": "ter-e-p'e-za", "category": "house" },
  "chair": { "amharic": "ወንበር", "phonetic": "wen-ber", "category": "house" },
  "kitchen": { "amharic": "ማዕከላዊ ቤት", "phonetic": "ma-ek-e-la-wi bet", "category": "house" },

  // --- 11. FOOD ---
  "bread": { "amharic": "ዳቦ", "phonetic": "da-bo", "category": "food" },
  "milk": { "amharic": "ወተት", "phonetic": "wet-et", "category": "food" },
  "egg": { "amharic": "እንቁላል", "phonetic": "en-ku-lal", "category": "food" },
  "fruit": { "amharic": "ፍራፍሬ", "phonetic": "fir-af-ray", "category": "food" },
  "apple": { "amharic": "ፖም", "phonetic": "pom", "category": "food" },
  "banana": { "amharic": "ሙዝ", "phonetic": "muz", "category": "food" },
  "juice": { "amharic": "ጭማቂ", "phonetic": "ch'im-a-qi", "category": "food" },
  "water": { "amharic": "ውሃ", "phonetic": "wu-ha", "category": "food" },
  "breakfast": { "amharic": "ቁርስ", "phonetic": "q'oors", "category": "food" },
  "lunch": { "amharic": "ምሳ", "phonetic": "mi-sah", "category": "food" },
  "dinner": { "amharic": "እራት", "phonetic": "eh-raht", "category": "food" },
  "cake": { "amharic": "ኬክ", "phonetic": "kek", "category": "food" },
  "candy": { "amharic": "ስኳር", "phonetic": "suk-war", "category": "food" },

  // --- 12. FARM ANIMALS ---
  "cow": { "amharic": "ላም", "phonetic": "lahm", "category": "animals" },
  "sheep": { "amharic": "በግ", "phonetic": "beg", "category": "animals" },
  "chicken": { "amharic": "ዶሮ", "phonetic": "doro", "category": "animals" },
  "horse": { "amharic": "ፈረስ", "phonetic": "fer-es", "category": "animals" },
  "goat": { "amharic": "ፍየል", "phonetic": "fiyel", "category": "animals" },
  "donkey": { "amharic": "አድጊ", "phonetic": "ad-igi", "category": "animals" },
  "pig": { "amharic": "አሳማ", "phonetic": "as-ama", "category": "animals" },

  // --- 13. PETS ---
  "dog": { "amharic": "ውሻ", "phonetic": "wish-a", "category": "animals" },
  "cat": { "amharic": "ድመት", "phonetic": "dim-et", "category": "animals" },
  "bird": { "amharic": "ወፍ", "phonetic": "wef", "category": "animals" },
  "fish": { "amharic": "አሳ", "phonetic": "as-a", "category": "animals" },
  "rabbit": { "amharic": "ቀጭኔ", "phonetic": "q'ech-in-e", "category": "animals" },

  // --- 14. WILD ANIMALS ---
  "lion": { "amharic": "አንበሳ", "phonetic": "an-bes-a", "category": "animals" },
  "elephant": { "amharic": "ዝሆን", "phonetic": "zi-hon", "category": "animals" },
  "giraffe": { "amharic": "ቀጭኔ", "phonetic": "q'ech-in-e", "category": "animals" },
  "monkey": { "amharic": "ዝንጀሮ", "phonetic": "zin-je-ro", "category": "animals" },
  "zebra": { "amharic": "የበረዶ አጥቢ", "phonetic": "ye-ber-edo at'ibi", "category": "animals" },

  // --- 15. INSECTS ---
  "butterfly": { "amharic": "ቢራቢሮ", "phonetic": "bir-a-bir-o", "category": "animals" },
  "bee": { "amharic": "ንቦ", "phonetic": "nib-o", "category": "animals" },
  "spider": { "amharic": "ሸረሪት", "phonetic": "sher-er-it", "category": "animals" },

  // --- 16. NATURE & WEATHER ---
  "rain": { "amharic": "ዝናብ", "phonetic": "zi-nab", "category": "nature" },
  "cloud": { "amharic": "ደመና", "phonetic": "dem-ena", "category": "nature" },
  "mountain": { "amharic": "ተራራ", "phonetic": "ter-ara", "category": "nature" },
  "water": { "amharic": "ውሃ", "phonetic": "wu-ha", "category": "nature" },
  "sun": { "amharic": "ፀሐይ", "phonetic": "tse-hai", "category": "nature" },
  "moon": { "amharic": "ጨረቃ", "phonetic": "ch'er-eh-q'ah", "category": "nature" },
  "tree": { "amharic": "ዛፍ", "phonetic": "zahf", "category": "nature" },
  "flower": { "amharic": "አበባ", "phonetic": "ah-beh-bah", "category": "nature" },
  "world": { "amharic": "ዓለም", "phonetic": "ah-lem", "category": "nature" },
  "star": { "amharic": "ኮከብ", "phonetic": "kok-eb", "category": "nature" },
  "sky": { "amharic": "ሰማይ", "phonetic": "sem-ay", "category": "nature" },
  "river": { "amharic": "ወንዝ", "phonetic": "wen-iz", "category": "nature" },
  "lake": { "amharic": "ሐይቅ", "phonetic": "hayq", "category": "nature" },
  "sea": { "amharic": "ባሕር", "phonetic": "bah-ir", "category": "nature" },
  "wind": { "amharic": "ነፋስ", "phonetic": "ne-fas", "category": "nature" },
  "snow": { "amharic": "በረዶ", "phonetic": "ber-edo", "category": "nature" },

  // --- 17. TIME ---
  "day": { "amharic": "ቀን", "phonetic": "q'en", "category": "time" },
  "night": { "amharic": "ሌሊት", "phonetic": "lay-lit", "category": "time" },
  "morning": { "amharic": "ጠዋት", "phonetic": "t'ew-at", "category": "time" },
  "afternoon": { "amharic": "ከሰዓት በኋላ", "phonetic": "ke-se-at be-hwa-la", "category": "time" },
  "evening": { "amharic": "ማታ", "phonetic": "ma-ta", "category": "time" },
  "today": { "amharic": "ዛሬ", "phonetic": "zar-ay", "category": "time" },
  "tomorrow": { "amharic": "ነገ", "phonetic": "neg-e", "category": "time" },
  "yesterday": { "amharic": "ትላንት", "phonetic": "til-ant", "category": "time" },

  // --- 18. SEASONS ---
  "summer": { "amharic": "በጋ", "phonetic": "beg-a", "category": "seasons" },
  "winter": { "amharic": "ክረምት", "phonetic": "kiremt", "category": "seasons" },
  "spring": { "amharic": "ጸደይ", "phonetic": "tsed-ey", "category": "seasons" },
  "autumn": { "amharic": "ክረምት", "phonetic": "kiremt", "category": "seasons" },

  // --- 19. TRANSPORT ---
  "car": { "amharic": "መኪና", "phonetic": "mek-ina", "category": "transport" },
  "airplane": { "amharic": "አውሮፕላን", "phonetic": "aw-ro-plan", "category": "transport" },
  "bicycle": { "amharic": "ብስክሌት", "phonetic": "bis-ik-lait", "category": "transport" },
  "bus": { "amharic": "አውቶቡስ", "phonetic": "aw-to-bus", "category": "transport" },
  "train": { "amharic": "ባቡር", "phonetic": "ba-bur", "category": "transport" },
  "boat": { "amharic": "መርከብ", "phonetic": "mer-keb", "category": "transport" },
  "truck": { "amharic": "ጭነት መኪና", "phonetic": "ch'in-et mek-ina", "category": "transport" },

  // --- 20. PLACES ---
  "park": { "amharic": "ፓርክ", "phonetic": "park", "category": "places" },
  "store": { "amharic": "ደንበኛ", "phonetic": "den-ben-ya", "category": "places" },
  "hospital": { "amharic": "ጤና ቤት", "phonetic": "t'ay-na bet", "category": "places" },
  "church": { "amharic": "ቤተ ክርስቲያን", "phonetic": "bet-e kir-sti-yan", "category": "places" },
  "zoo": { "amharic": "የእንስሳት ማሳ", "phonetic": "ye-ins-is-at mas-a", "category": "places" },

  // --- 21. MUSIC ---
  "music": { "amharic": "ሙዚቃ", "phonetic": "muzi-qa", "category": "music" },
  "song": { "amharic": "መዝሙር", "phonetic": "mez-mur", "category": "music" },
  "dance": { "amharic": "መዝፈን", "phonetic": "mez-fen", "category": "music" },
  "sing": { "amharic": "መዝፈን", "phonetic": "mez-fen", "category": "music" },

  // --- 22. ACTION VERBS ---
  "eat": { "amharic": "መብላት", "phonetic": "meb-lat", "category": "actions" },
  "drink": { "amharic": "መጠጣት", "phonetic": "met-et-at", "category": "actions" },
  "sleep": { "amharic": "መተኛት", "phonetic": "met-en-yat", "category": "actions" },
  "run": { "amharic": "መሮጥ", "phonetic": "me-rot", "category": "actions" },
  "jump": { "amharic": "መዝለቅ", "phonetic": "mez-leq", "category": "actions" },
  "walk": { "amharic": "መጓዝ", "phonetic": "me-gwaz", "category": "actions" },
  "talk": { "amharic": "መናገር", "phonetic": "men-a-ger", "category": "actions" },
  "listen": { "amharic": "መስማት", "phonetic": "mes-mat", "category": "actions" },
  "see": { "amharic": "መስተዋት", "phonetic": "mes-te-wat", "category": "actions" },
  "touch": { "amharic": "መንካት", "phonetic": "men-kat", "category": "actions" },
  "hold": { "amharic": "መያዝ", "phonetic": "me-yaz", "category": "actions" },
  "give": { "amharic": "መስጠት", "phonetic": "mes-t'et", "category": "actions" },
  "take": { "amharic": "መውሰድ", "phonetic": "mew-sed", "category": "actions" },

  // --- 23. OBJECTS ---
  "computer": { "amharic": "ኮምፒውተር", "phonetic": "kom-pyu-ter", "category": "objects" },
  "book": { "amharic": "መጽሐፍ", "phonetic": "mets-haf", "category": "objects" },
  "phone": { "amharic": "ስልክ", "phonetic": "sil-ik", "category": "objects" },
  "key": { "amharic": "ቁልፍ", "phonetic": "q'ul-if", "category": "objects" },
  "money": { "amharic": "ገንዘብ", "phonetic": "gen-ze-b", "category": "objects" },
  "clock": { "amharic": "ሰዓት", "phonetic": "se-at", "category": "objects" },
  "light": { "amharic": "ብርሃን", "phonetic": "bir-han", "category": "objects" },
  "bag": { "amharic": "ቦርሳ", "phonetic": "bor-sa", "category": "objects" },

  // --- 24. SHAPES ---
  "circle": { "amharic": "ክብ", "phonetic": "kib", "category": "shapes" },
  "square": { "amharic": "ካሬ", "phonetic": "ka-ray", "category": "shapes" },
  "triangle": { "amharic": "ሶስት ማእዘን", "phonetic": "sost ma-e-zen", "category": "shapes" },
  "heart": { "amharic": "ልብ", "phonetic": "lib", "category": "shapes" },

  // --- 25. HOLIDAYS & CELEBRATIONS ---
  "birthday": { "amharic": "የልደት ቀን", "phonetic": "ye-led-et q'en", "category": "holidays" },
  "gift": { "amharic": "ስጦታ", "phonetic": "sit-ota", "category": "holidays" },
  "party": { "amharic": "ድግስ", "phonetic": "dig-is", "category": "holidays" },
  "Christmas": { "amharic": "ገና", "phonetic": "gen-a", "category": "holidays" }
};

// Image cache for word visuals
const wordImages = {};
let currentWordImage = null;
let imageLoadingError = false;

// Load image for a word (local images only)
function loadWordImage(word) {
    if (wordImages[word]) {
        currentWordImage = wordImages[word];
        imageLoadingError = false;
        return;
    }
    
    const img = new Image();
    
    // Load local image
    img.src = `assets/${word}.jpg`;
    
    img.onload = () => {
        wordImages[word] = img;
        if (word === currentWord) {
            currentWordImage = img;
            imageLoadingError = false;
        }
    };
    
    img.onerror = () => {
        console.warn(`Failed to load image for: ${word}`);
        if (word === currentWord) {
            imageLoadingError = true;
        }
    };
}

// Build categories as stages (fewest words first)
const categoriesMap = {};
Object.keys(translations).forEach(w => {
    const cat = translations[w].category || 'uncategorized';
    (categoriesMap[cat] ||= []).push(w);
});
const categoriesOrder = Object.keys(categoriesMap).sort((a,b) => categoriesMap[a].length - categoriesMap[b].length);

// Visual templates cycled across categories
const visualPalette = [
    { name: 'Morning Sky', bgColor: '#87CEEB', coinColor: '#FFD700', platformColor: '#8B4513' },
    { name: 'Sunset', bgColor: '#FF6B35', coinColor: '#FFEB3B', platformColor: '#D84315' },
    { name: 'Night', bgColor: '#1A237E', coinColor: '#FFA726', platformColor: '#4A148C' },
    { name: 'Rainbow Land', bgColor: '#E1BEE7', coinColor: '#F06292', platformColor: '#7B1FA2' },
    { name: 'Ocean Dream', bgColor: '#006064', coinColor: '#FFD54F', platformColor: '#00838F' }
];
const stageTemplates = categoriesOrder.map((cat, i) => ({
    name: `${cat[0].toUpperCase()}${cat.slice(1)}`,
    bgColor: visualPalette[i % visualPalette.length].bgColor,
    coinColor: visualPalette[i % visualPalette.length].coinColor,
    platformColor: visualPalette[i % visualPalette.length].platformColor,
    requiresOrder: i >= Math.floor(categoriesOrder.length / 2)
}));

// Game variables
let wordsToTranslate = categoriesMap[categoriesOrder[0]];
let currentWord = wordsToTranslate[Math.floor(Math.random() * wordsToTranslate.length)];
let currentAmharic = translations[currentWord].amharic;
let collectedLetters = '';
let currentStage = 0; // now indexes into categoriesOrder
let score = 0;
// gameStarted is already declared at the top of the file
let gameOver = false;
let gameOverReason = '';
let stageTimer = 0;
let lastEnemySpawn = 0;
let wordPronunciationComplete = false;

// Keyboard state
const keys = {};

// Utility function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Speech synthesis helper
function pronounceLetter(letter) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const pronunciation = GeezAlphabetDict[letter] || letter;
        const utterance = new SpeechSynthesisUtterance(pronunciation);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.3;
        utterance.volume = 1.0;
        setTimeout(() => window.speechSynthesis.speak(utterance), 50);
    }
}

function pronounceWord(englishWord, amharicPronunciation) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const englishUtterance = new SpeechSynthesisUtterance(englishWord);
        englishUtterance.lang = 'en-US';
        englishUtterance.rate = 0.8;
        englishUtterance.pitch = 1.2;
        
        const amharicUtterance = new SpeechSynthesisUtterance(amharicPronunciation);
        amharicUtterance.lang = 'en-US';
        amharicUtterance.rate = 0.7;
        amharicUtterance.pitch = 1.2;
        
        window.speechSynthesis.speak(englishUtterance);
        englishUtterance.onend = () => {
            setTimeout(() => {
                window.speechSynthesis.speak(amharicUtterance);
                amharicUtterance.onend = () => {
                    wordPronunciationComplete = true;
                };
            }, 300);
        };
    } else {
        wordPronunciationComplete = true;
    }
}

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.onGround = false;
        this.direction = 1;
    }

    update() {
        // Block movement until word pronunciation is complete
        if (!wordPronunciationComplete) {
            this.applyGravity();
            if (this.y + this.height >= SCREEN_HEIGHT) {
                this.y = SCREEN_HEIGHT - this.height;
                this.velocityY = 0;
                this.isJumping = false;
                this.onGround = true;
            }
            return;
        }
        
        this.velocityX = 0;
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
            this.velocityX = -PLAYER_SPEED;
            this.direction = -1;
        }
        if (keys['ArrowRight'] || keys['d'] || keys['D']) {
            this.velocityX = PLAYER_SPEED;
            this.direction = 1;
        }
        
        this.x += this.velocityX;
        this.applyGravity();
        this.x = Math.max(0, Math.min(WORLD_WIDTH - this.width, this.x));

        // Check platform collisions
        this.onGround = false;
        staticPlatforms.forEach(platform => {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y + this.height > platform.y &&
                this.y < platform.y + platform.height) {
                
                if (this.velocityY > 0 && this.y < platform.y) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.isJumping = false;
                    this.onGround = true;
                }
            }
        });
    }

    applyGravity() {
        this.velocityY += GRAVITY;
        this.y += this.velocityY;

        if (this.y + this.height >= SCREEN_HEIGHT) {
            this.y = SCREEN_HEIGHT - this.height;
            this.velocityY = 0;
            this.isJumping = false;
            this.onGround = true;
        }
    }

    jump() {
        // Block jumping until word pronunciation is complete
        if (!wordPronunciationComplete) return;
        
        if (!this.isJumping) {
            this.velocityY = JUMP_STRENGTH;
            this.isJumping = true;
        }
    }

    draw(camera) {
        const screenX = this.x - camera.x;
        
        // Draw character
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(screenX, this.y, this.width, this.height);
        ctx.strokeStyle = '#C92A2A';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, this.y, this.width, this.height);
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(screenX + 8, this.y + 15, 8, 8);
        ctx.fillRect(screenX + 24, this.y + 15, 8, 8);
        ctx.fillStyle = 'black';
        ctx.fillRect(screenX + 11, this.y + 18, 3, 3);
        ctx.fillRect(screenX + 27, this.y + 18, 3, 3);
        
        // Smile
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screenX + this.width / 2, this.y + 35, 10, 0, Math.PI);
        ctx.stroke();
    }
}

// Platform class
class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(camera) {
        const stage = stageTemplates[currentStage];
        ctx.fillStyle = stage.platformColor;
        ctx.fillRect(this.x - camera.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - camera.x, this.y, this.width, this.height);
    }
}

// Floating Letter Coin class (platformer style)
class FloatingLetter {
    constructor(x, y, character, pronunciation) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.collected = false;
        this.rotation = 0;
        this.character = character;
        this.pronunciation = pronunciation;
        this.bounceOffset = 0;
    }

    update() {
        this.rotation += 0.05;
        this.bounceOffset = Math.sin(Date.now() / 200) * 5;
        
        // Check if this is the next expected letter for tutorial hint
        this.isNextExpected = false;
        if (!this.collected && collectedLetters.length < currentAmharic.length) {
            const nextExpectedLetter = currentAmharic[collectedLetters.length];
            this.isNextExpected = (this.character === nextExpectedLetter);
        }
    }

    draw(camera) {
        if (!this.collected) {
            const screenX = this.x - camera.x;
            const centerX = screenX + this.width / 2;
            const centerY = this.y + this.height / 2 + this.bounceOffset;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotation);
            
            const stage = stageTemplates[currentStage];
            
            // Calculate size multiplier for next expected letter (pulsing effect)
            let sizeMultiplier = 1;
            let glowIntensity = 0;
            if (this.isNextExpected) {
                // Pulse between 1.0 and 1.3
                sizeMultiplier = 1 + 0.3 * (Math.sin(Date.now() / 300) * 0.5 + 0.5);
                // Blink effect (0 to 1)
                glowIntensity = Math.sin(Date.now() / 400) * 0.5 + 0.5;
            }
            
            const radius = (this.width / 2) * sizeMultiplier;
            
            // Draw glow for next expected letter
            if (this.isNextExpected && glowIntensity > 0.3) {
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 20 * glowIntensity;
                ctx.fillStyle = `rgba(255, 215, 0, ${glowIntensity * 0.3})`;
                ctx.beginPath();
                ctx.arc(0, 0, radius + 10, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Draw main coin
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = this.isNextExpected ? '#FFD700' : stage.coinColor;
            ctx.strokeStyle = this.isNextExpected ? '#FFA500' : '#FFA500';
            ctx.lineWidth = this.isNextExpected ? 4 : 3;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Add hint arrow for next expected letter
            if (this.isNextExpected) {
                ctx.fillStyle = '#FF0000';
                ctx.font = 'bold 20px Arial';
                ctx.fillText('▼', 0, -radius - 15);
            }
            
            ctx.rotate(-this.rotation);
            ctx.fillStyle = 'black';
            ctx.font = `bold ${28 * sizeMultiplier}px NotoSansEthiopic, Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.character, 0, 2);
            
            ctx.restore();
        }
    }

    checkCollision(player) {
        if (!this.collected &&
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y) {
            return true;
        }
        return false;
    }
}

// Enemy class
class Enemy {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 3;
        this.direction = 1;
        this.velocityY = 0;
    }

    update(player) {
        if (player.x > this.x) {
            this.direction = 1;
            this.x += this.speed;
        } else {
            this.direction = -1;
            this.x -= this.speed;
        }
        
        this.velocityY += GRAVITY;
        this.y += this.velocityY;
        
        if (this.y + this.height >= SCREEN_HEIGHT) {
            this.y = SCREEN_HEIGHT - this.height;
            this.velocityY = 0;
        }
        
        this.x = Math.max(0, Math.min(WORLD_WIDTH - this.width, this.x));
    }

    draw(camera) {
        const screenX = this.x - camera.x;
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(screenX, this.y, this.width, this.height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeRect(screenX, this.y, this.width, this.height);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.type.toUpperCase(), screenX + this.width / 2, this.y + this.height / 2);
        
        ctx.fillStyle = 'red';
        ctx.font = 'bold 10px Arial';
        ctx.fillText('DANGER!', screenX + this.width / 2, this.y - 5);
    }

    checkCollision(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
}

// Portal class
class Portal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 80;
        this.active = false;
        this.animationOffset = 0;
    }

    update() {
        this.animationOffset += 0.1;
    }

    draw(camera) {
        if (!this.active) return;
        
        const screenX = this.x - camera.x;
        ctx.save();
        
        const gradient = ctx.createRadialGradient(
            screenX + this.width / 2, this.y + this.height / 2, 0,
            screenX + this.width / 2, this.y + this.height / 2, this.width / 2
        );
        gradient.addColorStop(0, 'rgba(138, 43, 226, 0.8)');
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0.2)');
        ctx.fillStyle = gradient;
        ctx.fillRect(screenX, this.y, this.width, this.height);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Enter', screenX + this.width / 2, this.y - 10);
        
        ctx.restore();
    }

    checkCollision(player) {
        if (!this.active) return false;
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
}

// Camera class
class Camera {
    constructor() {
        this.x = 0;
    }

    update(player) {
        this.x = player.x - SCREEN_WIDTH / 2 + player.width / 2;
        this.x = Math.max(0, Math.min(this.x, WORLD_WIDTH - SCREEN_WIDTH));
    }
}

// Platform layouts
const platformLayouts = [
    [
        [250, SCREEN_HEIGHT - 120, 120, 20],
        [450, SCREEN_HEIGHT - 180, 120, 20],
        [700, SCREEN_HEIGHT - 240, 120, 20],
        [1000, SCREEN_HEIGHT - 200, 120, 20],
        [1300, SCREEN_HEIGHT - 240, 120, 20]
    ],
    [
        [200, SCREEN_HEIGHT - 150, 150, 20],
        [500, SCREEN_HEIGHT - 250, 130, 20],
        [800, SCREEN_HEIGHT - 180, 140, 20],
        [1100, SCREEN_HEIGHT - 280, 150, 20],
        [1600, SCREEN_HEIGHT - 200, 130, 20]
    ]
];

// Initialize game objects
const player = new Player(100, 300);
const camera = new Camera();
let staticPlatforms = [];
let floatingLetters = [];
let enemies = [];
let portal = null;

function initializePlatforms() {
    staticPlatforms = [];
    
    // Ground platforms
    for (let i = 0; i < WORLD_WIDTH; i += 100) {
        staticPlatforms.push(new Platform(i, SCREEN_HEIGHT - 50, 100, 50));
    }
    
    // Elevated platforms
    const layoutIndex = currentStage % platformLayouts.length;
    const layout = platformLayouts[layoutIndex];
    layout.forEach(plat => {
        staticPlatforms.push(new Platform(plat[0], plat[1], plat[2], plat[3]));
    });
}

function initializeLevel() {
    floatingLetters = [];
    
    const layoutIndex = currentStage % platformLayouts.length;
    const positions = platformLayouts[layoutIndex];
    
    // Create floating letters for current word (shuffled positions for challenge)
    const lettersArray = Array.from(currentAmharic);
    const shuffledPositions = shuffleArray(positions.slice(0, lettersArray.length));
    
    for (let i = 0; i < lettersArray.length && i < shuffledPositions.length; i++) {
        const character = lettersArray[i];
        const pronunciation = GeezAlphabetDict[character] || character;
        const letterX = shuffledPositions[i][0] + shuffledPositions[i][2] / 2 - 25;
        const letterY = shuffledPositions[i][1] - 60;
        floatingLetters.push(new FloatingLetter(letterX, letterY, character, pronunciation));
    }
    
    // Create portal
    const lastPlatform = positions[positions.length - 1];
    const portalX = lastPlatform[0] + lastPlatform[2] - 60;
    const portalY = lastPlatform[1] - 80;
    portal = new Portal(portalX, portalY);
}

function spawnEnemy() {
    const enemyTypes = ['lion', 'tiger', 'wolf'];
    const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const spawnFromLeft = Math.random() < 0.5;
    const spawnX = spawnFromLeft ? camera.x - 60 : camera.x + SCREEN_WIDTH + 10;
    enemies.push(new Enemy(randomType, spawnX, SCREEN_HEIGHT - 100));
}

function nextWord() {
    currentWord = wordsToTranslate[Math.floor(Math.random() * wordsToTranslate.length)];
    currentAmharic = translations[currentWord].amharic;
    collectedLetters = '';
    wordPronunciationComplete = false;
    currentWordImage = null;
    imageLoadingError = false;
    loadWordImage(currentWord);
    pronounceWord(currentWord, translations[currentWord].phonetic);
    initializeLevel();
}

function advanceStage() {
    currentStage = (currentStage + 1) % stageTemplates.length;
    stageTimer = 0;
    lastEnemySpawn = 0;
    enemies = [];
    player.x = 100;
    player.y = 300;
    camera.x = 0;
    initializePlatforms();
    wordsToTranslate = categoriesMap[categoriesOrder[currentStage]];
    nextWord();
}

function restartGame() {
    currentStage = 0;
    score = 0;
    gameOver = false;
    gameStarted = false;
    stageTimer = 0;
    lastEnemySpawn = 0;
    enemies = [];
    player.x = 100;
    player.y = 300;
    camera.x = 0;
    initializePlatforms();
    nextWord();
}

// Initialize game
initializePlatforms();
loadWordImage(currentWord);
pronounceWord(currentWord, translations[currentWord].phonetic);
initializeLevel();

function gameLoop() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // Draw background
    const stage = stageTemplates[currentStage];
    const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
    gradient.addColorStop(0, stage.bgColor);
    gradient.addColorStop(1, adjustBrightness(stage.bgColor, -30));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // Draw word image if available (top right corner)
    if (currentWordImage && !imageLoadingError) {
        const imgWidth = 200;
        const imgHeight = 150;
        const imgX = SCREEN_WIDTH - imgWidth - 20;
        const imgY = 20;
        
        // Draw semi-transparent background for image
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(imgX - 10, imgY - 10, imgWidth + 20, imgHeight + 50);
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.8)';
        ctx.lineWidth = 5;
        ctx.strokeRect(imgX - 15, imgY - 15, imgWidth + 30, imgHeight + 70);
        
        // Inner border
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(imgX - 10, imgY - 10, imgWidth + 20, imgHeight + 60);
        
        // Draw the image
        try {
            ctx.drawImage(currentWordImage, imgX, imgY, imgWidth, imgHeight);
        } catch (e) {
            console.warn('Error drawing image:', e);
        }
        
        // Label below image with both English and Amharic
        ctx.fillStyle = 'black';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(currentWord.toUpperCase(), imgX + imgWidth / 2, imgY + imgHeight + 30);
        
        ctx.font = 'bold 28px NotoSansEthiopic, Arial';
        ctx.fillStyle = '#8B008B';
        ctx.fillText(currentAmharic, imgX + imgWidth / 2, imgY + imgHeight + 55);
        ctx.textAlign = 'left';
    }
    
    if (!gameOver) {
        camera.update(player);
        player.update();
        
        // Update and draw platforms
        staticPlatforms.forEach(platform => platform.draw(camera));
        
        // Update and draw floating letters
        let allCollected = true;
        floatingLetters.forEach(letter => {
            letter.update();
            letter.draw(camera);
            
            if (!letter.collected) {
                allCollected = false;
                if (letter.checkCollision(player)) {
                    const stage = stageTemplates[currentStage];
                    const nextExpectedLetter = currentAmharic[collectedLetters.length];
                    
                    if (stage.requiresOrder) {
                        if (letter.character === nextExpectedLetter) {
                            letter.collected = true;
                            collectedLetters += letter.character;
                            pronounceLetter(letter.character);
                            score += 1;
                        } else {
                            score = Math.max(0, score - 0.5);
                            if (score === 0) {
                                gameOver = true;
                                gameOverReason = 'Wrong order - Score reached 0!';
                            }
                        }
                    } else {
                        if (!collectedLetters.includes(letter.character)) {
                            letter.collected = true;
                            collectedLetters += letter.character;
                            pronounceLetter(letter.character);
                            score += (letter.character === nextExpectedLetter) ? 1 : 0.5;
                        }
                    }
                }
            }
        });
        
        // Activate portal
        if (allCollected) {
            portal.active = true;
            portal.update();
            portal.draw(camera);
            
            if (portal.checkCollision(player)) {
                advanceStage();
            }
        }
        
        // Update timer and spawn enemies
        if (wordPronunciationComplete) {
            stageTimer++;
            if (stageTimer >= 1800 && stageTimer - lastEnemySpawn >= 900) {
                spawnEnemy();
                lastEnemySpawn = stageTimer;
            }
        }
        
        // Update and draw enemies
        enemies.forEach((enemy, index) => {
            enemy.update(player);
            enemy.draw(camera);
            if (enemy.checkCollision(player)) {
                gameOver = true;
                gameOverReason = `Caught by ${enemy.type}!`;
            }
        });
        
        player.draw(camera);
        
        // Draw UI
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.font = 'bold 24px Arial';
        ctx.strokeText(`⭐ Score: ${score.toFixed(1)}`, 10, 30);
        ctx.fillText(`⭐ Score: ${score.toFixed(1)}`, 10, 30);
        
        ctx.font = 'bold 20px Arial';
        ctx.strokeText(`Stage: ${stage.name}`, 10, 55);
        ctx.fillText(`Stage: ${stage.name}`, 10, 55);
        
        ctx.font = 'bold 18px Arial';
        ctx.strokeText(`Word: ${currentWord}`, 10, 80);
        ctx.fillText(`Word: ${currentWord}`, 10, 80);
        
        ctx.font = 'bold 28px NotoSansEthiopic, Arial';
        ctx.strokeText(`${currentAmharic}`, 10, 110);
        ctx.fillText(`${currentAmharic}`, 10, 110);
        
        if (collectedLetters) {
            ctx.fillStyle = '#4CAF50';
            ctx.strokeText(`Collected: ${collectedLetters}`, 10, 140);
            ctx.fillText(`Collected: ${collectedLetters}`, 10, 140);
        }
        
        if (stage.requiresOrder) {
            ctx.fillStyle = 'red';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('⚠️ Order Matters!', 10, 165);
        }
        
        // Instructions or listening message
        if (!gameStarted && score === 0 && wordPronunciationComplete) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.fillRect(SCREEN_WIDTH / 2 - 200, SCREEN_HEIGHT / 2 - 60, 400, 120);
            ctx.strokeStyle = '#4A148C';
            ctx.lineWidth = 4;
            ctx.strokeRect(SCREEN_WIDTH / 2 - 200, SCREEN_HEIGHT / 2 - 60, 400, 120);
            
            ctx.fillStyle = '#1976D2';
            ctx.font = 'bold 22px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎮 Geez Alphabet Platformer! 🎮', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 30);
            ctx.fillStyle = '#4A148C';
            ctx.font = '16px Arial';
            ctx.fillText('← → or A D to Move', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
            ctx.fillText('Space or ↑ to Jump', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 25);
            ctx.textAlign = 'left';
            
            if (keys['ArrowLeft'] || keys['ArrowRight'] || keys['a'] || keys['d']) {
                gameStarted = true;
            }
        }
        
        // Show "Listen..." message while pronunciation is playing
        if (!wordPronunciationComplete) {
            ctx.fillStyle = 'rgba(255, 215, 0, 0.95)';
            ctx.fillRect(SCREEN_WIDTH / 2 - 150, SCREEN_HEIGHT / 2 - 80, 300, 100);
            ctx.strokeStyle = '#FF6B35';
            ctx.lineWidth = 4;
            ctx.strokeRect(SCREEN_WIDTH / 2 - 150, SCREEN_HEIGHT / 2 - 80, 300, 100);
            
            ctx.fillStyle = '#C92A2A';
            ctx.font = 'bold 28px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🔊 Listen...', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 45);
            
            ctx.fillStyle = '#1976D2';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(currentWord, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 10);
            
            ctx.fillStyle = '#4A148C';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(`(${translations[currentWord].phonetic})`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 15);
            ctx.textAlign = 'left';
        }
    } else {
        // Game Over screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 60);
        
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(gameOverReason, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 20);
        ctx.fillStyle = 'white';
        ctx.fillText(`Final Score: ${score.toFixed(1)}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 20);
        
        // Restart button
        const buttonX = SCREEN_WIDTH / 2 - 100;
        const buttonY = SCREEN_HEIGHT / 2 + 60;
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(buttonX, buttonY, 200, 50);
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 3;
        ctx.strokeRect(buttonX, buttonY, 200, 50);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Try Again', SCREEN_WIDTH / 2, buttonY + 33);
        
        ctx.textAlign = 'left';
    }
    
    // Draw virtual controls for mobile
    drawVirtualControls();
    
    requestAnimationFrame(gameLoop);
}

function adjustBrightness(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// Event listeners
window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
    if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        player.jump();
    }
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Virtual button controls for mobile
let virtualControls = {
    left: { x: 50, y: 0, width: 80, height: 80, active: false },
    right: { x: 150, y: 0, width: 80, height: 80, active: false },
    jump: { x: 0, y: 0, width: 100, height: 100, active: false }
};

function updateVirtualControlPositions() {
    virtualControls.left.y = SCREEN_HEIGHT - 120;
    virtualControls.right.y = SCREEN_HEIGHT - 120;
    virtualControls.jump.x = SCREEN_WIDTH - 130;
    virtualControls.jump.y = SCREEN_HEIGHT - 120;
}

function drawVirtualControls() {
    const isMobile = 'ontouchstart' in window;
    if (!isMobile) return;
    
    updateVirtualControlPositions();
    
    ctx.save();
    ctx.globalAlpha = 0.5;
    
    ctx.fillStyle = virtualControls.left.active ? '#4CAF50' : '#666';
    ctx.fillRect(virtualControls.left.x, virtualControls.left.y, virtualControls.left.width, virtualControls.left.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('◄', virtualControls.left.x + 40, virtualControls.left.y + 40);
    
    ctx.fillStyle = virtualControls.right.active ? '#4CAF50' : '#666';
    ctx.fillRect(virtualControls.right.x, virtualControls.right.y, virtualControls.right.width, virtualControls.right.height);
    ctx.fillStyle = 'white';
    ctx.fillText('►', virtualControls.right.x + 40, virtualControls.right.y + 40);
    
    ctx.fillStyle = virtualControls.jump.active ? '#FF9800' : '#666';
    ctx.beginPath();
    ctx.arc(virtualControls.jump.x + 50, virtualControls.jump.y + 50, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('JUMP', virtualControls.jump.x + 50, virtualControls.jump.y + 50);
    
    ctx.restore();
}

function handleTouchStart(e) {
    e.preventDefault();
    for (let touch of e.touches) {
        const rect = canvas.getBoundingClientRect();
        const touchX = (touch.clientX - rect.left) * (SCREEN_WIDTH / rect.width);
        const touchY = (touch.clientY - rect.top) * (SCREEN_HEIGHT / rect.height);
        
        if (touchX >= virtualControls.left.x && touchX <= virtualControls.left.x + virtualControls.left.width &&
            touchY >= virtualControls.left.y && touchY <= virtualControls.left.y + virtualControls.left.height) {
            virtualControls.left.active = true;
            keys['ArrowLeft'] = true;
        }
        if (touchX >= virtualControls.right.x && touchX <= virtualControls.right.x + virtualControls.right.width &&
            touchY >= virtualControls.right.y && touchY <= virtualControls.right.y + virtualControls.right.height) {
            virtualControls.right.active = true;
            keys['ArrowRight'] = true;
        }
        if (Math.hypot(touchX - (virtualControls.jump.x + 50), touchY - (virtualControls.jump.y + 50)) <= 50) {
            virtualControls.jump.active = true;
            player.jump();
        }
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    virtualControls.left.active = false;
    virtualControls.right.active = false;
    virtualControls.jump.active = false;
    keys['ArrowLeft'] = false;
    keys['ArrowRight'] = false;
}

function handleTouchMove(e) {
    e.preventDefault();
    virtualControls.left.active = false;
    virtualControls.right.active = false;
    keys['ArrowLeft'] = false;
    keys['ArrowRight'] = false;
    
    for (let touch of e.touches) {
        const rect = canvas.getBoundingClientRect();
        const touchX = (touch.clientX - rect.left) * (SCREEN_WIDTH / rect.width);
        const touchY = (touch.clientY - rect.top) * (SCREEN_HEIGHT / rect.height);
        
        if (touchX >= virtualControls.left.x && touchX <= virtualControls.left.x + virtualControls.left.width &&
            touchY >= virtualControls.left.y && touchY <= virtualControls.left.y + virtualControls.left.height) {
            virtualControls.left.active = true;
            keys['ArrowLeft'] = true;
        }
        if (touchX >= virtualControls.right.x && touchX <= virtualControls.right.x + virtualControls.right.width &&
            touchY >= virtualControls.right.y && touchY <= virtualControls.right.y + virtualControls.right.height) {
            virtualControls.right.active = true;
            keys['ArrowRight'] = true;
        }
    }
}

canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

canvas.addEventListener('click', (event) => {
    if (gameOver) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        const buttonX = SCREEN_WIDTH / 2 - 100;
        const buttonY = SCREEN_HEIGHT / 2 + 60;
        
        if (clickX >= buttonX && clickX <= buttonX + 200 &&
            clickY >= buttonY && clickY <= buttonY + 50) {
            restartGame();
        }
    }
});

canvas.addEventListener('touchend', (event) => {
    if (gameOver && event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = (touch.clientX - rect.left) * (SCREEN_WIDTH / rect.width);
        const touchY = (touch.clientY - rect.top) * (SCREEN_HEIGHT / rect.height);
        const buttonX = SCREEN_WIDTH / 2 - 100;
        const buttonY = SCREEN_HEIGHT / 2 + 60;
        
        if (touchX >= buttonX && touchX <= buttonX + 200 &&
            touchY >= buttonY && touchY <= buttonY + 50) {
            restartGame();
        }
    }
}, { passive: false });

// Only start game loop after continue button is clicked
function startGameLoop() {
    if (gameStarted) {
        gameLoop();
    } else {
        setTimeout(startGameLoop, 100);
    }
}
startGameLoop();
