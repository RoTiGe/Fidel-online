// Geez Alphabet Derder - Drag and Drop Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Responsive canvas dimensions
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
let gameStarted = false;
// Audio
let musicVolume = 0.15;
let sfxVolume = 0.5;
const bgm = new Audio('/assets/audio/bgm/derder_loop.mp3');
bgm.loop = true; bgm.volume = musicVolume;
const sfx = {
    place: new Audio('/assets/audio/sfx/collect.wav'),
    success: new Audio('/assets/audio/sfx/success.wav')
};
Object.values(sfx).forEach(a => a.volume = sfxVolume);

// Make canvas responsive and fullscreen
function resizeCanvas() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Start game function (called when continue button is clicked)
function startGame() {
    document.getElementById('instructionsModal').classList.add('hidden');
    gameStarted = true;
    resizeCanvas();
    try { bgm.currentTime = 0; bgm.play().catch(()=>{}); } catch(e) {}
}

// Add to window for HTML onclick
window.startGame = startGame;

// Colors - Child-friendly palette
const WHITE = '#FFFFFF';
const BLACK = '#2C3E50';
const RED = '#FF6B9D';
const GREEN = '#6BCF7F';
const YELLOW = '#FFD93D';
const CYAN = '#4ECDC4';
const MAGENTA = '#9D84FF';
const ORANGE = '#FF9A5C';
const LIGHT_BLUE = '#8EC5FC';

// Geez Alphabet Dictionary
const GeezAlphabetDict = {
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

// Categories as stages (fewest words first)
const categoriesMap = {};
Object.keys(translations).forEach(w => {
    const cat = translations[w].category || 'uncategorized';
    (categoriesMap[cat] ||= []).push(w);
});
const categoriesOrder = Object.keys(categoriesMap).sort((a,b) => categoriesMap[a].length - categoriesMap[b].length);
let currentCategoryIndex = 0;
let wordsToTranslate = categoriesMap[categoriesOrder[currentCategoryIndex]];
let currentWord = wordsToTranslate[Math.floor(Math.random() * wordsToTranslate.length)];
let currentAmharic = translations[currentWord].amharic;
let score = 0;
let draggedLetter = null;
let mouseX = 0;
let mouseY = 0;

// Drop zone
const DROP_ZONE_HEIGHT = 120;
const DROP_ZONE_Y = HEIGHT - DROP_ZONE_HEIGHT - 20;
const SLOT_SIZE = 70;
const SLOT_SPACING = 10;

// Draggable letters array
let letters = [];
let dropZoneLetters = [];
let particles = [];

// Game state
let wordsCompletedInStage = 0;
let completedWordsSet = new Set();
let gameOver = false;
let restartButton = { x: 0, y: 0, width: 0, height: 0 };
let exitButton = { x: 0, y: 0, width: 0, height: 0 };

const STAGE_CONFIGS = {
    1: { description: "Stage 1: Learning - Place letters in order" },
    2: { description: "Stage 2: Practice - Faster feedback" },
    3: { description: "Stage 3: Master - Time bonus!" },
    4: { description: "Stage 4: Expert - More words!" },
    5: { description: "Stage 5: Champion - Ultimate challenge!" }
};

// Draggable Letter class
class DraggableLetter {
    constructor(letter, index) {
        this.letter = letter;
        this.size = 60;
        this.originalIndex = index;
        
        // Random position at top third of screen
        this.x = 50 + Math.random() * (WIDTH - 100);
        this.y = 40 + Math.random() * 100;
        
        this.isDragging = false;
        this.color = [YELLOW, CYAN, MAGENTA, ORANGE, LIGHT_BLUE][Math.floor(Math.random() * 5)];
        this.offsetX = 0;
        this.offsetY = 0;
    }

    contains(px, py) {
        return px >= this.x && px <= this.x + this.size &&
               py >= this.y && py <= this.y + this.size;
    }

    draw() {
        ctx.save();
        
        // Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = this.isDragging ? 20 : 10;
        ctx.shadowOffsetY = this.isDragging ? 10 : 5;
        
        // Background
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.size, this.y + this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, adjustBrightness(this.color, -30));
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        
        // Border
        ctx.strokeStyle = WHITE;
        ctx.lineWidth = this.isDragging ? 4 : 2;
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        
        // Letter
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = BLACK;
        ctx.font = 'bold 36px NotoSansEthiopic, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.letter, this.x + this.size / 2, this.y + this.size / 2);
        
        ctx.restore();
    }

    startDrag(px, py) {
        this.isDragging = true;
        this.offsetX = px - this.x;
        this.offsetY = py - this.y;
    }

    drag(px, py) {
        if (this.isDragging) {
            this.x = px - this.offsetX;
            this.y = py - this.offsetY;
        }
    }

    stopDrag() {
        this.isDragging = false;
    }
}

// Particle class for effects
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 3;
        this.life = 1.0;
        this.decay = 0.02;
        this.size = 3 + Math.random() * 5;
        this.color = color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3; // Gravity
        this.life -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// Speech synthesis
function pronounceLetter(letter) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const phoneticPronunciation = GeezAlphabetDict[letter] || letter;
        const utterance = new SpeechSynthesisUtterance(phoneticPronunciation);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.3;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
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
            }, 300);
        };
    }
}

// Initialize letters for current word
function initializeLetters() {
    letters = [];
    dropZoneLetters = [];
    
    // Create draggable letters
    for (let i = 0; i < currentAmharic.length; i++) {
        letters.push(new DraggableLetter(currentAmharic[i], i));
    }
    
    // Initialize empty drop zone
    for (let i = 0; i < currentAmharic.length; i++) {
        dropZoneLetters.push(null);
    }
    
    // Pronounce the word
    pronounceWord(currentWord, translations[currentWord].phonetic);
}

// Check if letter is dropped in a slot
function getDropSlot(x, y) {
    if (y < DROP_ZONE_Y || y > DROP_ZONE_Y + DROP_ZONE_HEIGHT) {
        return -1;
    }
    
    const startX = (WIDTH - (SLOT_SIZE * currentAmharic.length + SLOT_SPACING * (currentAmharic.length - 1))) / 2;
    
    for (let i = 0; i < currentAmharic.length; i++) {
        const slotX = startX + i * (SLOT_SIZE + SLOT_SPACING);
        if (x >= slotX && x <= slotX + SLOT_SIZE) {
            return i;
        }
    }
    return -1;
}

// Check if word is complete and correct
function checkCompletion() {
    // Check if all slots are filled
    for (let i = 0; i < dropZoneLetters.length; i++) {
        if (dropZoneLetters[i] === null) return false;
    }
    
    // Check if letters are in correct order
    for (let i = 0; i < dropZoneLetters.length; i++) {
        if (dropZoneLetters[i] !== currentAmharic[i]) {
            return false;
        }
    }
    
    return true;
}

// Complete word
function completeWord() {
    score += 10;
    wordsCompletedInStage++;
    completedWordsSet.add(currentWord);
    
    // Create success particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(WIDTH / 2, HEIGHT / 2, [GREEN, YELLOW, CYAN, MAGENTA][Math.floor(Math.random() * 4)]));
    }
    
    // Finish category then advance (fewest words first)
    if (wordsCompletedInStage >= wordsToTranslate.length) {
        wordsCompletedInStage = 0;
        completedWordsSet.clear();
        if (currentCategoryIndex < categoriesOrder.length - 1) {
            currentCategoryIndex++;
        }
        wordsToTranslate = categoriesMap[categoriesOrder[currentCategoryIndex]];
    }
    // Get new word from remaining
    const remaining = wordsToTranslate.filter(w => !completedWordsSet.has(w));
    const pool = remaining.length > 0 ? remaining : wordsToTranslate;
    currentWord = pool[Math.floor(Math.random() * pool.length)];
    currentAmharic = translations[currentWord].amharic;
    initializeLetters();
}

// Restart game
function restartGame() {
    score = 0;
    currentCategoryIndex = 0;
    wordsCompletedInStage = 0;
    completedWordsSet.clear();
    gameOver = false;
    wordsToTranslate = categoriesMap[categoriesOrder[currentCategoryIndex]];
    const remaining = wordsToTranslate.filter(w => !completedWordsSet.has(w));
    const pool = remaining.length > 0 ? remaining : wordsToTranslate;
    currentWord = pool[Math.floor(Math.random() * pool.length)];
    currentAmharic = translations[currentWord].amharic;
    initializeLetters();
}

// Adjust color brightness
function adjustBrightness(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// Draw drop zone
function drawDropZone() {
    const startX = (WIDTH - (SLOT_SIZE * currentAmharic.length + SLOT_SPACING * (currentAmharic.length - 1))) / 2;
    
    // Draw zone background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(10, DROP_ZONE_Y - 10, WIDTH - 20, DROP_ZONE_HEIGHT + 20);
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 3;
    ctx.strokeRect(10, DROP_ZONE_Y - 10, WIDTH - 20, DROP_ZONE_HEIGHT + 20);
    
    // Draw slots
    for (let i = 0; i < currentAmharic.length; i++) {
        const x = startX + i * (SLOT_SIZE + SLOT_SPACING);
        const y = DROP_ZONE_Y + (DROP_ZONE_HEIGHT - SLOT_SIZE) / 2;
        
        // Slot background
        if (dropZoneLetters[i] === null) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        } else if (dropZoneLetters[i] === currentAmharic[i]) {
            ctx.fillStyle = 'rgba(107, 207, 127, 0.7)'; // Correct - green
        } else {
            ctx.fillStyle = 'rgba(255, 107, 157, 0.7)'; // Wrong - red
        }
        
        ctx.fillRect(x, y, SLOT_SIZE, SLOT_SIZE);
        ctx.strokeStyle = WHITE;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, SLOT_SIZE, SLOT_SIZE);
        
        // Draw letter if placed
        if (dropZoneLetters[i] !== null) {
            ctx.fillStyle = BLACK;
            ctx.font = 'bold 36px NotoSansEthiopic, Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(dropZoneLetters[i], x + SLOT_SIZE / 2, y + SLOT_SIZE / 2);
        } else {
            // Draw slot number
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(i + 1, x + SLOT_SIZE / 2, y + SLOT_SIZE / 2);
        }
    }
}

// Mouse/Touch event handlers
function updatePointerPosition(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    mouseX = (clientX - rect.left) * (WIDTH / rect.width);
    mouseY = (clientY - rect.top) * (HEIGHT / rect.height);
}

function handlePointerDown(clientX, clientY) {
    updatePointerPosition(clientX, clientY);
    
    if (gameOver) {
        // Check restart button
        if (mouseX >= restartButton.x && mouseX <= restartButton.x + restartButton.width &&
            mouseY >= restartButton.y && mouseY <= restartButton.y + restartButton.height) {
            restartGame();
        }
        // Check exit button
        if (mouseX >= exitButton.x && mouseX <= exitButton.x + exitButton.width &&
            mouseY >= exitButton.y && mouseY <= exitButton.y + exitButton.height) {
            window.close();
            setTimeout(() => {
                alert('Please close this tab manually to exit the game.');
            }, 100);
        }
        return;
    }
    
    // Check if clicking on a letter in drop zone to remove it
    const startX = (WIDTH - (SLOT_SIZE * currentAmharic.length + SLOT_SPACING * (currentAmharic.length - 1))) / 2;
    for (let i = 0; i < dropZoneLetters.length; i++) {
        if (dropZoneLetters[i] !== null) {
            const x = startX + i * (SLOT_SIZE + SLOT_SPACING);
            const y = DROP_ZONE_Y + (DROP_ZONE_HEIGHT - SLOT_SIZE) / 2;
            
            if (mouseX >= x && mouseX <= x + SLOT_SIZE &&
                mouseY >= y && mouseY <= y + SLOT_SIZE) {
                // Remove from drop zone and create new draggable
                const letter = dropZoneLetters[i];
                dropZoneLetters[i] = null;
                const newLetter = new DraggableLetter(letter, i);
                newLetter.x = mouseX - 30;
                newLetter.y = mouseY - 30;
                letters.push(newLetter);
                draggedLetter = newLetter;
                draggedLetter.startDrag(mouseX, mouseY);
                return;
            }
        }
    }
    
    // Check if clicking on a draggable letter
    for (let i = letters.length - 1; i >= 0; i--) {
        if (letters[i].contains(mouseX, mouseY)) {
            draggedLetter = letters[i];
            draggedLetter.startDrag(mouseX, mouseY);
            // Move to end of array (top of drawing order)
            letters.splice(i, 1);
            letters.push(draggedLetter);
            break;
        }
    }
}

function handlePointerMove(clientX, clientY) {
    updatePointerPosition(clientX, clientY);
    
    if (draggedLetter) {
        draggedLetter.drag(mouseX, mouseY);
    }
}

function handlePointerUp(clientX, clientY) {
    updatePointerPosition(clientX, clientY);
    
    if (draggedLetter) {
        const slot = getDropSlot(mouseX + draggedLetter.size / 2, mouseY + draggedLetter.size / 2);
        
        if (slot !== -1) {
            // Place in drop zone
            if (dropZoneLetters[slot] !== null) {
                // Slot occupied, swap them
                const letter = dropZoneLetters[slot];
                const newLetter = new DraggableLetter(letter, slot);
                newLetter.x = 50 + Math.random() * (WIDTH - 100);
                newLetter.y = 40 + Math.random() * 100;
                letters.push(newLetter);
            }
            
            dropZoneLetters[slot] = draggedLetter.letter;
            
            // Remove from draggable letters
            const index = letters.indexOf(draggedLetter);
            if (index > -1) {
                letters.splice(index, 1);
            }
            
            // Pronounce the letter
            pronounceLetter(draggedLetter.letter);
            try { sfx.place.currentTime = 0; sfx.place.play().catch(()=>{}); } catch(e) {}
            
            // Check if word is complete
            if (checkCompletion()) {
                setTimeout(() => {
                    try { sfx.success.currentTime = 0; sfx.success.play().catch(()=>{}); } catch(e) {}
                    completeWord();
                }, 500);
            }
        }
        
        draggedLetter.stopDrag();
        draggedLetter = null;
    }
}

// Event listeners
canvas.addEventListener('mousedown', (e) => handlePointerDown(e.clientX, e.clientY));
canvas.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY));
canvas.addEventListener('mouseup', (e) => handlePointerUp(e.clientX, e.clientY));

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (e.changedTouches.length > 0) {
        handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
}, { passive: false });

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, '#E3F2FD');
    gradient.addColorStop(1, '#FFFACD');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    if (!gameOver) {
        // Draw UI
        ctx.fillStyle = BLACK;
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + score, 20, 35);
        
        ctx.font = 'bold 20px Arial';
        const stageLabel = `Stage ${currentCategoryIndex + 1}: ${categoriesOrder[currentCategoryIndex]} (${wordsToTranslate.length} words)`;
        ctx.fillText(stageLabel, 20, 65);
        
        // Draw target word
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = MAGENTA;
        ctx.fillText('Spell: ' + currentWord, WIDTH / 2, 30);
        ctx.fillStyle = BLACK;
        ctx.font = '18px Arial';
        ctx.fillText('(' + translations[currentWord].phonetic + ')', WIDTH / 2, 55);
        
        // Draw drop zone
        drawDropZone();
        
        // Draw draggable letters
        for (let letter of letters) {
            letter.draw();
        }
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].isDead()) {
                particles.splice(i, 1);
            }
        }
        
        // Draw instruction
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Drag and drop letters to spell the word in order!', WIDTH / 2, HEIGHT - 10);
    } else {
        // Game over screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        
        ctx.fillStyle = RED;
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER!', WIDTH / 2, HEIGHT / 2 - 60);
        
        ctx.fillStyle = WHITE;
        ctx.font = '24px Arial';
        ctx.fillText('Final Score: ' + score, WIDTH / 2, HEIGHT / 2);
        
        // Restart button
        restartButton.x = WIDTH / 2 - 120;
        restartButton.y = HEIGHT / 2 + 40;
        restartButton.width = 240;
        restartButton.height = 50;
        
        ctx.fillStyle = GREEN;
        ctx.fillRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height);
        ctx.strokeStyle = WHITE;
        ctx.lineWidth = 3;
        ctx.strokeRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height);
        ctx.fillStyle = WHITE;
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Try Again', WIDTH / 2, restartButton.y + 33);
        
        // Exit button
        exitButton.x = WIDTH / 2 - 120;
        exitButton.y = HEIGHT / 2 + 110;
        exitButton.width = 240;
        exitButton.height = 50;
        
        ctx.fillStyle = RED;
        ctx.fillRect(exitButton.x, exitButton.y, exitButton.width, exitButton.height);
        ctx.strokeStyle = WHITE;
        ctx.lineWidth = 3;
        ctx.strokeRect(exitButton.x, exitButton.y, exitButton.width, exitButton.height);
        ctx.fillStyle = WHITE;
        ctx.fillText('Exit', WIDTH / 2, exitButton.y + 33);
    }
    
    requestAnimationFrame(gameLoop);
}

// Initialize letters but don't start game loop until button is clicked
initializeLetters();

// Only start game loop after continue button is clicked
function startGameLoop() {
    if (gameStarted) {
        gameLoop();
    } else {
        setTimeout(startGameLoop, 100);
    }
}
startGameLoop();
