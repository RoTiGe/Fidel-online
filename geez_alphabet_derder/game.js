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
    'ሀ': 'he', 'ሁ': 'hu', 'ሂ': 'hi', 'ሃ': 'ha', 'ሄ': 'hey', 'ህ': 'hih', 'ሆ': 'ho',
    'ለ': 'le', 'ሉ': 'lu', 'ሊ': 'li', 'ላ': 'la', 'ሌ': 'ley', 'ል': 'lih', 'ሎ': 'lo',
    'ሐ': 'he', 'ሑ': 'hu', 'ሒ': 'hi', 'ሓ': 'ha', 'ሔ': 'hey', 'ሕ': 'hih', 'ሖ': 'ho',
    'መ': 'me', 'ሙ': 'mu', 'ሚ': 'mi', 'ማ': 'ma', 'ሜ': 'mey', 'ም': 'mih', 'ሞ': 'mo',
    'ሠ': 'se', 'ሡ': 'su', 'ሢ': 'si', 'ሣ': 'sa', 'ሤ': 'sey', 'ሥ': 'sih', 'ሦ': 'so',
    'ረ': 're', 'ሩ': 'ru', 'ሪ': 'ri', 'ራ': 'ra', 'ሬ': 'rey', 'ር': 'rih', 'ሮ': 'ro',
    'ሰ': 'se', 'ሱ': 'su', 'ሲ': 'si', 'ሳ': 'sa', 'ሴ': 'sey', 'ስ': 'sih', 'ሶ': 'so',
    'ሸ': 'she', 'ሹ': 'shu', 'ሺ': 'shi', 'ሻ': 'sha', 'ሼ': 'shey', 'ሽ': 'shih', 'ሾ': 'sho',
    'ቀ': 'qe', 'ቁ': 'qu', 'ቂ': 'qi', 'ቃ': 'qa', 'ቄ': 'qey', 'ቅ': 'qih', 'ቆ': 'qo',
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
    'ጠ': 'te', 'ጡ': 'tu', 'ጢ': 'ti', 'ጣ': 'ta', 'ጤ': 'tey', 'ጥ': 'tih', 'ጦ': 'to',
    'ጨ': 'che', 'ጩ': 'chu', 'ጪ': 'chi', 'ጫ': 'cha', 'ጬ': 'chey', 'ጭ': 'chih', 'ጮ': 'cho',
    'ጰ': 'pe', 'ጱ': 'pu', 'ጲ': 'pi', 'ጳ': 'pa', 'ጴ': 'pey', 'ጵ': 'pih', 'ጶ': 'po',
    'ጸ': 'tse', 'ጹ': 'tsu', 'ጺ': 'tsi', 'ጻ': 'tsa', 'ጼ': 'tsey', 'ጽ': 'tsih', 'ጾ': 'tso',
    'ፀ': 'tse', 'ፁ': 'tsu', 'ፂ': 'tsi', 'ፃ': 'tsa', 'ፄ': 'tsey', 'ፅ': 'tsih', 'ፆ': 'tso',
    'ፈ': 'fe', 'ፉ': 'fu', 'ፊ': 'fi', 'ፋ': 'fa', 'ፌ': 'fey', 'ፍ': 'fih', 'ፎ': 'fo',
    'ፐ': 'pe', 'ፑ': 'pu', 'ፒ': 'pi', 'ፓ': 'pa', 'ፔ': 'pey', 'ፕ': 'pih', 'ፖ': 'po'
};

const translations = {
  // --- 1. BASICS & GREETINGS ---
  "hello": { "amharic": "ሀሎ", "phonetic": "hal-lo", "category": "basics" },
  "goodbye": { "amharic": "ደህና ሁን", "phonetic": "deh-na hoon", "category": "basics" },
  "thank you": { "amharic": "አመሰግናለሁ", "phonetic": "ah-meh-seg-i-nal-hu", "category": "basics" },
  "please": { "amharic": "እባክህ", "phonetic": "ebak-h", "category": "basics" },
  "sorry": { "amharic": "ይቅርታ", "phonetic": "yi-qir-ta", "category": "basics" },

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
  
    // --- 2a. PEOPLE ---
    "friend": { "amharic": "ጓደኛ", "phonetic": "gwah-den-yah", "category": "people" },

  // --- 3. BODY PARTS ---
  "head": { "amharic": "ራስ", "phonetic": "rahs", "category": "body" },
  "eyes": { "amharic": "አይን", "phonetic": "ay-in", "category": "body" },
  "nose": { "amharic": "አፍንጫ", "phonetic": "af-in-ch'a", "category": "body" },
  "mouth": { "amharic": "አፍ", "phonetic": "af", "category": "body" },
  "hands": { "amharic": "እጅ", "phonetic": "edj", "category": "body" },

  // --- 4. CLOTHING ---
  "shirt": { "amharic": "ሸሚዝ", "phonetic": "she-miz", "category": "clothing" },
  "shoes": { "amharic": "ጫማ", "phonetic": "ch'ah-ma", "category": "clothing" },
  "hat": { "amharic": "ቆብ", "phonetic": "q'ob", "category": "clothing" },

  // --- 5. COLORS ---
  "red": { "amharic": "ቀይ", "phonetic": "q'ey", "category": "colors" },
  "blue": { "amharic": "ሰማያዊ", "phonetic": "se-ma-ya-wi", "category": "colors" },
  "yellow": { "amharic": "ቢጫ", "phonetic": "bi-ch'ah", "category": "colors" },

  // --- 6. NUMBERS ---
  "one": { "amharic": "አንድ", "phonetic": "and", "category": "numbers" },
  "two": { "amharic": "ሁለት", "phonetic": "hu-let", "category": "numbers" },
  "three": { "amharic": "ሶስት", "phonetic": "sost", "category": "numbers" },

  // --- 7. EMOTIONS ---
  "happy": { "amharic": "ደስተኛ", "phonetic": "des-te-nya", "category": "emotions" },
  "sad": { "amharic": "አዘንተኛ", "phonetic": "azen-te-nya", "category": "emotions" },

  // --- 12. FARM ANIMALS ---
  "cow": { "amharic": "ላም", "phonetic": "lahm", "category": "farm" },
  "sheep": { "amharic": "በግ", "phonetic": "beg", "category": "farm" },
  "chicken": { "amharic": "ዶሮ", "phonetic": "doro", "category": "farm" },

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

  // --- 19. TRANSPORT ---
  "car": { "amharic": "መኪና", "phonetic": "mek-ina", "category": "transport" },
  "airplane": { "amharic": "አውሮፕላን", "phonetic": "aw-ro-plan", "category": "transport" },
  "bicycle": { "amharic": "ብስክሌት", "phonetic": "bis-ik-lait", "category": "transport" },

  // --- 22. ACTION VERBS ---
  "eat": { "amharic": "መብላት", "phonetic": "meb-lat", "category": "actions" },
  "drink": { "amharic": "መጠጣት", "phonetic": "met-et-at", "category": "actions" },
  "sleep": { "amharic": "መተኛት", "phonetic": "met-en-yat", "category": "actions" },
    "run": { "amharic": "መሮጥ", "phonetic": "me-rot", "category": "actions" },
  
    // --- 1a. FOOD & MEALS ---
    "breakfast": { "amharic": "ቁርስ", "phonetic": "q'oors", "category": "food" },
    "lunch": { "amharic": "ምሳ", "phonetic": "mi-sah", "category": "food" },
    "dinner": { "amharic": "እራት", "phonetic": "eh-raht", "category": "food" },
  
    // --- 23. OBJECTS ---
    "computer": { "amharic": "ኮምፒውተር", "phonetic": "kom-pyu-ter", "category": "objects" },
    "book": { "amharic": "መጽሐፍ", "phonetic": "mets-haf", "category": "objects" }
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
