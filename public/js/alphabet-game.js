// Geez Alphabet Game - JavaScript Version
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Responsive canvas dimensions - fullscreen
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
const COLLECTION_RADIUS = 50;
let gameStarted = false;

// Make canvas fullscreen and responsive
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
}
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
/*
// Translations
const translations = {
   "breakfast": "ቁርስ",
  "hello": "ሀሎ",
  "world": "ዓለም",
  "computer": "ኮምፒውተር",
  "book": "መጽሐፍ",
  "friend": "ጓደኛ",
  "water": "ውሃ",
  "sun": "ፀሐይ",
  "moon": "ጨረቃ",
  "tree": "ዛፍ",
  "flower": "አበባ",
  "lunch": "ምሳ",
  "dinner": "እራት",
  "mother": "እናት",
  "father": "አባት",
  "sister": "እህት",
  "brother": "ወንድም",
  "uncle": "አጎት",
  "aunt": "አክስት",
  "grandmother": "አያት",
  "grandfather": "አያት" 
}
*/
const translations = {
  "breakfast": { "amharic": "ቁርስ", "phonetic": "q'oors" },
  "hello": { "amharic": "ሀሎ", "phonetic": "hal-lo" },
  "world": { "amharic": "ዓለም", "phonetic": "ah-lem" },
  "computer": { "amharic": "ኮምፒውተር", "phonetic": "kom-pyu-ter" },
  "book": { "amharic": "መጽሐፍ", "phonetic": "mets-haf" },
  "friend": { "amharic": "ጓደኛ", "phonetic": "gwah-den-yah" },
  "water": { "amharic": "ውሃ", "phonetic": "wu-ha" },
  "sun": { "amharic": "ፀሐይ", "phonetic": "tse-hai" },
  "moon": { "amharic": "ጨረቃ", "phonetic": "ch'er-eh-q'ah" },
  "tree": { "amharic": "ዛፍ", "phonetic": "zahf" },
  "flower": { "amharic": "አበባ", "phonetic": "ah-beh-bah" },
  "lunch": { "amharic": "ምሳ", "phonetic": "mi-sah" },
  "dinner": { "amharic": "እራት", "phonetic": "eh-raht" },
  "mother": { "amharic": "እናት", "phonetic": "en-naht" },
  "father": { "amharic": "አባት", "phonetic": "ah-baht" },
  "sister": { "amharic": "እህት", "phonetic": "eh-hit" },
  "brother": { "amharic": "ወንድም", "phonetic": "wen-dim" },
  "uncle": { "amharic": "አጎት", "phonetic": "ah-goht" },
  "aunt": { "amharic": "አክስት", "phonetic": "ah-kist" },
  "grandmother": { "amharic": "አያት", "phonetic": "ah-yaht" },
  "grandfather": { "amharic": "አያት", "phonetic": "ah-yaht" }
};

// Game variables
let wordsToTranslate = Object.keys(translations);
let currentWord = wordsToTranslate[Math.floor(Math.random() * wordsToTranslate.length)];
let currentAmharic = translations[currentWord].amharic;
let collectedLetters = '';
let score = 0;
let mouseX = 0;
let mouseY = 0;

// Particle effects
let particles = [];
let lastMouseX = 0;
let lastMouseY = 0;

// Player circle state
let playerCircleColor = CYAN;
let playerShakeOffset = { x: 0, y: 0 };
let shakeIntensity = 0;
let flashTimer = 0;

// Stage system
let currentStage = 1;
let wordsCompletedInStage = 0;
const WORDS_PER_STAGE = 3;
let lastSpawnTime = 0;
let gameOver = false;
let restartButton = { x: 0, y: 0, width: 0, height: 0 };
let exitButton = { x: 0, y: 0, width: 0, height: 0 };
let collectedOutOfOrder = false; // Track if any letters were collected out of order
let wordPronunciationComplete = false; // Track if word pronunciation is done
const STAGE_CONFIGS = {
    1: { spawnInterval: 3000, letterCount: 5, description: "Stage 1: Learning" },
    2: { spawnInterval: 1500, letterCount: 10, description: "Stage 2: Practice" },
    3: { spawnInterval: 1500, letterCount: 10, description: "Stage 3: Master (Order Matters!)" },
    4: { spawnInterval: 1200, letterCount: 10, description: "Stage 4: Multi-Direction" },
    5: { spawnInterval: 1000, letterCount: 10, description: "Stage 5: Diagonal Chaos" }
};

// Track speech timeout to prevent overlapping pronunciations
let speechTimeout = null;

// Celebration animation for word completion
let celebrationActive = false;
let celebrationTimer = 0;
let celebrationParticles = [];
const CELEBRATION_DURATION = 120; // frames

// Speech synthesis for pronouncing letters
function pronounceLetter(letter) {
    // Don't pronounce letters during word transitions
    if (!wordPronunciationComplete) return;
    
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
        // Clear any pending speech timeout
        if (speechTimeout) {
            clearTimeout(speechTimeout);
            speechTimeout = null;
        }
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Get the phonetic pronunciation from the dictionary
        const phoneticPronunciation = GeezAlphabetDict[letter] || letter;
        
        const utterance = new SpeechSynthesisUtterance(phoneticPronunciation);
        utterance.lang = 'en-US'; // Use English for phonetic pronunciation
        utterance.rate = 0.7; // Slower for clearer syllable pronunciation
        utterance.pitch = 1.2; // Higher pitch for child-friendly sound
        utterance.volume = 1.0;
        
        // Wait a moment to ensure synthesis is ready
        speechTimeout = setTimeout(() => {
            // Double-check we should still speak
            if (wordPronunciationComplete) {
                window.speechSynthesis.speak(utterance);
            }
            speechTimeout = null;
        }, 50);
    }
}

// Pronounce the word in both English and Amharic
function pronounceWord(englishWord, amharicPronunciation) {
    if ('speechSynthesis' in window) {
        // Clear any pending letter pronunciation timeout
        if (speechTimeout) {
            clearTimeout(speechTimeout);
            speechTimeout = null;
        }
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // First, pronounce in English
        const englishUtterance = new SpeechSynthesisUtterance(englishWord);
        englishUtterance.lang = 'en-US';
        englishUtterance.rate = 0.8;
        englishUtterance.pitch = 1.2;
        englishUtterance.volume = 1.0;
        
        // Then, pronounce the Amharic pronunciation
        const amharicUtterance = new SpeechSynthesisUtterance(amharicPronunciation);
        amharicUtterance.lang = 'en-US'; // Use English voice for phonetic pronunciation
        amharicUtterance.rate = 0.7;
        amharicUtterance.pitch = 1.2;
        amharicUtterance.volume = 1.0;
        
        // Speak English first
        window.speechSynthesis.speak(englishUtterance);
        
        // When English is done, speak Amharic pronunciation
        englishUtterance.onend = () => {
            setTimeout(() => {
                window.speechSynthesis.speak(amharicUtterance);
                
                // Mark pronunciation as complete after Amharic is spoken
                amharicUtterance.onend = () => {
                    wordPronunciationComplete = true;
                };
            }, 300); // Small pause between pronunciations
        };
    } else {
        // If speech synthesis not supported, just mark as complete
        wordPronunciationComplete = true;
    }
}

// Falling Letter class
class FallingLetter {
    constructor() {
        this.size = 80;
        this.letter = currentAmharic[Math.floor(Math.random() * currentAmharic.length)];
        this.x = Math.random() * (WIDTH - this.size);
        this.y = 0;
        this.speed = 1 + Math.random();
        this.active = false;
        this.velocityX = 0;
        this.velocityY = 0;
        this.spawnEdge = 'top'; // top, left, right
    }

    move() {
        if (!this.active) return;
        
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Check if letter went off screen
        if (this.y > HEIGHT || this.x > WIDTH || this.x < -this.size || this.y < -this.size) {
            this.reset();
        }
    }

    reset() {
        this.letter = currentAmharic[Math.floor(Math.random() * currentAmharic.length)];
        this.active = false;
        
        // Reset position based on stage
        if (currentStage <= 3) {
            // Stages 1-3: Drop from top only
            this.x = Math.random() * (WIDTH - this.size);
            this.y = 0;
            this.velocityX = 0;
            this.velocityY = 1 + Math.random();
            this.spawnEdge = 'top';
        } else if (currentStage === 4) {
            // Stage 4: Spawn from top, left, or right (straight movement)
            const edge = Math.floor(Math.random() * 3); // 0=top, 1=left, 2=right
            if (edge === 0) {
                // Top
                this.x = Math.random() * (WIDTH - this.size);
                this.y = 0;
                this.velocityX = 0;
                this.velocityY = 1.5 + Math.random();
                this.spawnEdge = 'top';
            } else if (edge === 1) {
                // Left
                this.x = -this.size;
                this.y = Math.random() * (HEIGHT - this.size);
                this.velocityX = 1.5 + Math.random();
                this.velocityY = 0;
                this.spawnEdge = 'left';
            } else {
                // Right
                this.x = WIDTH;
                this.y = Math.random() * (HEIGHT - this.size);
                this.velocityX = -(1.5 + Math.random());
                this.velocityY = 0;
                this.spawnEdge = 'right';
            }
        } else if (currentStage === 5) {
            // Stage 5: Spawn from edges with diagonal/slanted movement
            const edge = Math.floor(Math.random() * 3); // 0=top, 1=left, 2=right
            if (edge === 0) {
                // Top with diagonal movement
                this.x = Math.random() * (WIDTH - this.size);
                this.y = 0;
                this.velocityX = (Math.random() - 0.5) * 2; // Random horizontal component
                this.velocityY = 1.5 + Math.random();
                this.spawnEdge = 'top';
            } else if (edge === 1) {
                // Left with diagonal movement
                this.x = -this.size;
                this.y = Math.random() * (HEIGHT - this.size);
                this.velocityX = 1.5 + Math.random();
                this.velocityY = (Math.random() - 0.5) * 2; // Random vertical component
                this.spawnEdge = 'left';
            } else {
                // Right with diagonal movement
                this.x = WIDTH;
                this.y = Math.random() * (HEIGHT - this.size);
                this.velocityX = -(1.5 + Math.random());
                this.velocityY = (Math.random() - 0.5) * 2; // Random vertical component
                this.spawnEdge = 'right';
            }
        }
    }
    
    spawn() {
        this.active = true;
    }

    draw() {
        if (!this.active) return;
        
        // Add shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        // Draw colorful gradient background
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.size, this.y + this.size);
        gradient.addColorStop(0, '#FFE66D');
        gradient.addColorStop(1, '#FFD93D');
        ctx.fillStyle = gradient;
        
        // Rounded rectangle
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.size, this.size, 15);
        ctx.fill();
        
        // Draw colorful border
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = ORANGE;
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Draw Geez letter
        ctx.fillStyle = '#2C3E50';
        ctx.font = 'bold 50px NotoSansEthiopic, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.letter, this.x + this.size / 2, this.y + this.size / 2);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
    }

    checkCollection() {
        if (!this.active) return;
        
        const dx = (this.x + 40) - mouseX;
        const dy = (this.y + 40) - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < COLLECTION_RADIUS) {
            if (currentAmharic.includes(this.letter)) {
                const nextExpectedLetter = currentAmharic[collectedLetters.length];
                
                // Stage 3+: Check order and apply penalty
                if (currentStage >= 3) {
                    if (this.letter === nextExpectedLetter) {
                        // Correct order
                        if (!collectedLetters.includes(this.letter) || collectedLetters.length < currentAmharic.length) {
                            pronounceLetter(this.letter); // Pronounce the letter
                            collectedLetters += this.letter;
                            this.reset();
                        }
                    } else {
                        // Wrong order - penalty with visual feedback
                        score = Math.max(0, score - 0.5);
                        
                        // Apply knockback to letter
                        const knockbackStrength = 15;
                        this.velocityX = dx / distance * knockbackStrength;
                        this.velocityY = dy / distance * knockbackStrength;
                        
                        // Flash player circle red and shake
                        playerCircleColor = RED;
                        flashTimer = 30; // Flash for 30 frames
                        shakeIntensity = 10; // Shake intensity
                        
                        // Check for game over if score reaches 0
                        if (score === 0) {
                            gameOver = true;
                            console.log("Game Over! Score reached 0");
                        }
                    }
                } else {
                    // Stages 1 and 2: Any order, but track if out of order
                    if (!collectedLetters.includes(this.letter)) {
                        // Check if this letter is out of order
                        if (this.letter !== nextExpectedLetter) {
                            collectedOutOfOrder = true;
                        }
                        pronounceLetter(this.letter); // Pronounce the letter
                        collectedLetters += this.letter;
                        this.reset();
                    }
                }
            }
        }
    }
}

// Celebration particle class for golden sparks
class CelebrationParticle {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.size = 4 + Math.random() * 6;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8 - 3; // Upward bias
        this.life = 1.0;
        this.decay = 0.008 + Math.random() * 0.008;
        this.gravity = 0.15;
        this.angle = Math.random() * Math.PI * 2;
        this.rotation = (Math.random() - 0.5) * 0.2;
    }

    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.angle += this.rotation;
        this.speedX *= 0.98;
    }

    draw() {
        if (this.life > 0) {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            
            // Draw golden star particle
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(0.5, '#FFA500');
            gradient.addColorStop(1, '#FF8C00');
            ctx.fillStyle = gradient;
            
            // Draw star shape
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 4 * Math.PI) / 5;
                const x = Math.cos(angle) * this.size;
                const y = Math.sin(angle) * this.size;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            
            // Add glow
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;
            ctx.fill();
            
            ctx.restore();
        }
    }

    isDead() {
        return this.life <= 0;
    }
}

// Particle class for sparks effect
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3 + Math.random() * 3;
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = (Math.random() - 0.5) * 4;
        this.life = 1.0;
        this.decay = 0.02 + Math.random() * 0.02;
        this.color = ['#FFD93D', '#FF6B9D', '#9D84FF', '#4ECDC4'][Math.floor(Math.random() * 4)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.speedX *= 0.98;
        this.speedY *= 0.98;
    }

    draw() {
        if (this.life > 0) {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    isDead() {
        return this.life <= 0;
    }
}

// Create falling letters
let fallingLetters = [];
for (let i = 0; i < 10; i++) {
    fallingLetters.push(new FallingLetter());
}

// Spawn management
function spawnLetters() {
    // Don't spawn letters until word pronunciation is complete
    if (!wordPronunciationComplete) return;
    
    const currentTime = Date.now();
    const config = STAGE_CONFIGS[currentStage];
    
    if (currentTime - lastSpawnTime >= config.spawnInterval) {
        const inactiveLetters = fallingLetters.filter(l => !l.active);
        if (inactiveLetters.length > 0) {
            const letterToSpawn = inactiveLetters[0];
            letterToSpawn.reset();
            letterToSpawn.spawn();
            lastSpawnTime = currentTime;
        }
    }
}

// Mouse and Touch tracking
function updatePointerPosition(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    mouseX = (clientX - rect.left) * (WIDTH / rect.width);
    mouseY = (clientY - rect.top) * (HEIGHT / rect.height);
}

canvas.addEventListener('mousemove', (e) => {
    updatePointerPosition(e.clientX, e.clientY);
});

// Touch move support for mobile
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
        updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
        updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

// Handle clicks and taps
function handlePointerClick(clientX, clientY) {
    if (!gameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = (clientX - rect.left) * (WIDTH / rect.width);
    const clickY = (clientY - rect.top) * (HEIGHT / rect.height);
    
    // Check if restart button was clicked
    if (clickX >= restartButton.x && clickX <= restartButton.x + restartButton.width &&
        clickY >= restartButton.y && clickY <= restartButton.y + restartButton.height) {
        restartGame();
    }
    
    // Check if exit button was clicked
    if (clickX >= exitButton.x && clickX <= exitButton.x + exitButton.width &&
        clickY >= exitButton.y && clickY <= exitButton.y + exitButton.height) {
        // Close the window/tab
        window.close();
        // If window.close() doesn't work (e.g., not opened by script), show message
        setTimeout(() => {
            alert('Please close this tab manually to exit the game.');
        }, 100);
    }
}

canvas.addEventListener('click', (e) => {
    handlePointerClick(e.clientX, e.clientY);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (e.changedTouches.length > 0) {
        handlePointerClick(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
}, { passive: false });

// Check word completion
function checkWordCompletion() {
    // Stage 3: Order matters
    if (currentStage === 3) {
        if (collectedLetters === currentAmharic) {
            completeWord();
        }
    } else {
        // Stages 1 and 2: Any order
        const collectedSet = new Set(collectedLetters);
        const requiredSet = new Set(currentAmharic);
        
        if (collectedSet.size === requiredSet.size && 
            [...requiredSet].every(letter => collectedSet.has(letter))) {
            completeWord();
        }
    }
}

function completeWord() {
    // Calculate score based on stage and order
    let pointsToAdd = 1;
    
    if (currentStage === 1 || currentStage === 2) {
        // Half points if letters were collected out of order
        if (collectedOutOfOrder) {
            pointsToAdd = 0.5;
            console.log(`Word completed out of order - half points awarded`);
        }
    }
    
    score += pointsToAdd;
    wordsCompletedInStage++;
    console.log(`Word completed! Score: ${score}, Stage: ${currentStage}, Words in stage: ${wordsCompletedInStage}`);
    
    // Deactivate all letters and cancel ongoing speech
    fallingLetters.forEach(letter => {
        letter.active = false;
    });
    
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    
    // Start celebration animation
    celebrationActive = true;
    celebrationTimer = CELEBRATION_DURATION;
    celebrationParticles = [];
    
    // Create golden particles around the completed word areas
    const wordBoxX = 25;
    const wordBoxY = 140;
    const collectedBoxX = 25;
    const collectedBoxY = HEIGHT - 80;
    
    // Spawn celebration particles
    for (let i = 0; i < 60; i++) {
        // Particles from English word
        celebrationParticles.push(new CelebrationParticle(
            wordBoxX + Math.random() * 300,
            wordBoxY,
            wordBoxX + 150,
            wordBoxY
        ));
        
        // Particles from Amharic word
        celebrationParticles.push(new CelebrationParticle(
            collectedBoxX + Math.random() * 400,
            collectedBoxY,
            collectedBoxX + 200,
            collectedBoxY
        ));
    }
    
    // Pronounce the completed word again as celebration
    pronounceWord(currentWord, translations[currentWord].phonetic);
    
    // Delay next word/stage transition
    setTimeout(() => {
        celebrationActive = false;
        
        // Check for stage progression
        if (wordsCompletedInStage >= WORDS_PER_STAGE) {
            // Check for game over after stage 1
            if (currentStage === 1 && score === 0) {
                gameOver = true;
                console.log("Game Over! Score is 0 after Stage 1");
                return;
            }
            
            if (currentStage < 5) {
                currentStage++;
                wordsCompletedInStage = 0;
                console.log(`Advanced to Stage ${currentStage}!`);
            } else {
                wordsCompletedInStage = 0;
            }
        }
        
        // Load next word
        currentWord = wordsToTranslate[Math.floor(Math.random() * wordsToTranslate.length)];
        currentAmharic = translations[currentWord].amharic;
        collectedLetters = '';
        collectedOutOfOrder = false;
        
        // Pronounce the new word before spawning letters
        wordPronunciationComplete = false;
        pronounceWord(currentWord, translations[currentWord].phonetic);
        
        // Reset all falling letters with the new word's letters
        fallingLetters.forEach(letter => letter.reset());
    }, 2500); // 2.5 second celebration
}

// Draw functions
function drawBackground() {
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, '#E3F2FD');
    gradient.addColorStop(0.5, '#F0F8FF');
    gradient.addColorStop(1, '#FFFACD');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawCollectionCircle() {
    // Update shake effect
    if (shakeIntensity > 0) {
        playerShakeOffset.x = (Math.random() - 0.5) * shakeIntensity;
        playerShakeOffset.y = (Math.random() - 0.5) * shakeIntensity;
        shakeIntensity *= 0.9;
        if (shakeIntensity < 0.1) {
            shakeIntensity = 0;
            playerShakeOffset.x = 0;
            playerShakeOffset.y = 0;
        }
    }
    
    // Update flash timer
    if (flashTimer > 0) {
        flashTimer--;
        if (flashTimer === 0) {
            playerCircleColor = CYAN; // Reset to default color
        }
    }
    
    // Create particle trail when mouse moves
    const mouseMoved = Math.abs(mouseX - lastMouseX) > 2 || Math.abs(mouseY - lastMouseY) > 2;
    if (mouseMoved && !gameOver) {
        for (let i = 0; i < 2; i++) {
            particles.push(new Particle(mouseX + playerShakeOffset.x, mouseY + playerShakeOffset.y));
        }
    }
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }
    
    // Outer glow
    const gradient1 = ctx.createRadialGradient(mouseX + playerShakeOffset.x, mouseY + playerShakeOffset.y, 0, 
                                                mouseX + playerShakeOffset.x, mouseY + playerShakeOffset.y, COLLECTION_RADIUS + 15);
    gradient1.addColorStop(0, `${playerCircleColor}80`);
    gradient1.addColorStop(0.7, `${playerCircleColor}30`);
    gradient1.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient1;
    ctx.beginPath();
    ctx.arc(mouseX + playerShakeOffset.x, mouseY + playerShakeOffset.y, COLLECTION_RADIUS + 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Main circle with gradient
    const gradient2 = ctx.createRadialGradient(
        mouseX + playerShakeOffset.x - 15, mouseY + playerShakeOffset.y - 15, 5,
        mouseX + playerShakeOffset.x, mouseY + playerShakeOffset.y, COLLECTION_RADIUS
    );
    gradient2.addColorStop(0, '#FFFFFF');
    gradient2.addColorStop(0.3, playerCircleColor);
    gradient2.addColorStop(1, adjustBrightness(playerCircleColor, -30));
    ctx.fillStyle = gradient2;
    
    ctx.beginPath();
    ctx.arc(mouseX + playerShakeOffset.x, mouseY + playerShakeOffset.y, COLLECTION_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = flashTimer > 0 ? '#FF0000' : '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Inner sparkle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(mouseX + playerShakeOffset.x - 10, mouseY + playerShakeOffset.y - 10, 8, 0, Math.PI * 2);
    ctx.fill();
}

// Helper function to adjust color brightness
function adjustBrightness(color, amount) {
    // Simple brightness adjustment for hex colors
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function drawUI() {
    // Calculate responsive font sizes
    const isMobile = WIDTH < 600;
    const stageFontSize = isMobile ? 20 : 32;
    const wordFontSize = isMobile ? 18 : 28;
    const amharicFontSize = isMobile ? 32 : 48;
    
    // Draw stage indicator (compact)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.font = `bold ${stageFontSize}px Arial`;
    ctx.textAlign = 'center';
    const stageGradient = ctx.createLinearGradient(WIDTH / 2 - 100, 5, WIDTH / 2 + 100, 5);
    stageGradient.addColorStop(0, '#FF6B9D');
    stageGradient.addColorStop(0.5, '#9D84FF');
    stageGradient.addColorStop(1, '#4ECDC4');
    ctx.fillStyle = stageGradient;
    ctx.fillText(`Stage ${currentStage}`, WIDTH / 2, isMobile ? 20 : 30);
    
    ctx.shadowColor = 'transparent';
    
    // Draw current word label (compact)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillStyle = BLACK;
    ctx.font = `bold ${wordFontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(`Word: ${currentWord}`, 10, isMobile ? 45 : 70);
    
    ctx.shadowColor = 'transparent';

    // Draw Amharic translation with rounded background (compact)
    const translationText = `Translation: ${currentAmharic}`;
    ctx.font = `bold ${amharicFontSize}px NotoSansEthiopic, Arial`;
    const textMetrics = ctx.measureText(translationText);
    const textWidth = textMetrics.width;
    
    const boxY = isMobile ? 55 : 95;
    const boxHeight = isMobile ? 50 : 70;
    const textY = isMobile ? 85 : 140;
    
    // Gradient background with golden glow when celebrating
    const gradient1 = ctx.createLinearGradient(10, boxY, 10, boxY + boxHeight);
    if (celebrationActive) {
        const glowIntensity = Math.sin(celebrationTimer / 10) * 0.3 + 0.7;
        gradient1.addColorStop(0, `rgba(255, 215, 0, ${glowIntensity})`);
        gradient1.addColorStop(1, `rgba(255, 165, 0, ${glowIntensity})`);
    } else {
        gradient1.addColorStop(0, '#FFE66D');
        gradient1.addColorStop(1, '#FFD93D');
    }
    ctx.fillStyle = gradient1;
    
    ctx.beginPath();
    ctx.roundRect(10, boxY, textWidth + 30, boxHeight, 15);
    ctx.fill();
    
    // Colorful border with golden glow when celebrating
    if (celebrationActive) {
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#FFD700';
    } else {
        ctx.strokeStyle = ORANGE;
    }
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    
    // Text with gradient and golden glow when celebrating
    const textGradient = ctx.createLinearGradient(20, boxY, 20, boxY + boxHeight);
    if (celebrationActive) {
        textGradient.addColorStop(0, '#FFD700');
        textGradient.addColorStop(1, '#FF8C00');
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15;
    } else {
        textGradient.addColorStop(0, '#FF6B9D');
        textGradient.addColorStop(1, '#9D84FF');
    }
    ctx.fillStyle = textGradient;
    ctx.fillText(translationText, 20, textY);
    ctx.shadowColor = 'transparent';
    
    // Stage 3 hint
    if (currentStage === 3) {
        ctx.fillStyle = RED;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('⚠️ Collect in order!', 15, 185);
    }

    // Draw collected letters label - compact for mobile
    const isMobileUI = WIDTH < 600;
    const collectedLabelSize = isMobileUI ? 16 : 24;
    const collectedTextSize = isMobileUI ? 28 : 48;
    const scoreSize = isMobileUI ? 20 : 32;
    const bottomY = isMobileUI ? HEIGHT - 45 : HEIGHT - 85;
    
    ctx.fillStyle = BLACK;
    ctx.font = `bold ${collectedLabelSize}px Arial`;
    ctx.fillText('Collected:', isMobileUI ? 10 : 25, bottomY);
    
    if (collectedLetters) {
        ctx.font = `bold ${collectedTextSize}px NotoSansEthiopic, Arial`;
        const collectedMetrics = ctx.measureText(collectedLetters);
        const collectedWidth = collectedMetrics.width;
        
        const boxY = isMobileUI ? HEIGHT - 35 : HEIGHT - 75;
        const boxHeight = isMobileUI ? 30 : 60;
        
        // Gradient background with golden glow when celebrating
        const gradient2 = ctx.createLinearGradient(15, boxY, 15, boxY + boxHeight);
        if (celebrationActive) {
            const glowIntensity = Math.sin(celebrationTimer / 10) * 0.3 + 0.7;
            gradient2.addColorStop(0, `rgba(255, 215, 0, ${glowIntensity})`);
            gradient2.addColorStop(1, `rgba(255, 165, 0, ${glowIntensity})`);
        } else {
            gradient2.addColorStop(0, '#8DFAAD');
            gradient2.addColorStop(1, '#6BCF7F');
        }
        ctx.fillStyle = gradient2;
        
        ctx.beginPath();
        ctx.roundRect(15, boxY, collectedWidth + (isMobileUI ? 20 : 30), boxHeight, isMobileUI ? 10 : 15);
        ctx.fill();
        
        // Border with golden glow when celebrating
        if (celebrationActive) {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20;
            ctx.strokeStyle = '#FFD700';
        } else {
            ctx.strokeStyle = '#4CAF50';
        }
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowColor = 'transparent';
        
        // Text with golden glow when celebrating
        if (celebrationActive) {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#FF8C00';
        } else {
            ctx.fillStyle = '#1B5E20';
        }
        ctx.fillText(collectedLetters, isMobileUI ? 20 : 25, isMobileUI ? HEIGHT - 15 : HEIGHT - 40);
        ctx.shadowColor = 'transparent';
    }

    // Draw score with colorful styling - compact for mobile
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.font = `bold ${scoreSize}px Arial`;
    ctx.textAlign = 'right';
    const scoreGradient = ctx.createLinearGradient(0, HEIGHT - 30, WIDTH, HEIGHT - 30);
    scoreGradient.addColorStop(0, '#FF6B9D');
    scoreGradient.addColorStop(1, '#9D84FF');
    ctx.fillStyle = scoreGradient;
    ctx.fillText(`⭐ Score: ${score.toFixed(1)}`, WIDTH - (isMobileUI ? 10 : 15), isMobileUI ? HEIGHT - 15 : HEIGHT - 25);
    
    ctx.shadowColor = 'transparent';
}

// Draw game over screen
function drawGameOver() {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Game Over title with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = RED;
    ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2 - 100);
    
    ctx.shadowColor = 'transparent';
    
    // Message
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = WHITE;
    
    // Different messages based on stage
    if (currentStage === 1) {
        ctx.fillText('No points earned in Stage 1!', WIDTH / 2, HEIGHT / 2 - 30);
    } else {
        ctx.fillText('Your score reached zero!', WIDTH / 2, HEIGHT / 2 - 30);
    }
    ctx.fillText('Better luck next time!', WIDTH / 2, HEIGHT / 2 + 10);
    
    // Restart Button
    const buttonWidth = 200;
    const buttonHeight = 60;
    const buttonY = HEIGHT / 2 + 60;
    
    restartButton = {
        x: WIDTH / 2 - buttonWidth - 20,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight
    };
    
    // Restart button background
    const restartGradient = ctx.createLinearGradient(restartButton.x, restartButton.y, 
                                                      restartButton.x, restartButton.y + restartButton.height);
    restartGradient.addColorStop(0, '#6BCF7F');
    restartGradient.addColorStop(1, '#4CAF50');
    ctx.fillStyle = restartGradient;
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    ctx.beginPath();
    ctx.roundRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height, 15);
    ctx.fill();
    
    // Restart button border
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Restart button text
    ctx.fillStyle = WHITE;
    ctx.font = 'bold 28px Arial';
    ctx.fillText('🔄 Restart', restartButton.x + restartButton.width / 2, restartButton.y + 38);
    
    // Exit Button
    exitButton = {
        x: WIDTH / 2 + 20,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight
    };
    
    // Exit button background
    const exitGradient = ctx.createLinearGradient(exitButton.x, exitButton.y, 
                                                   exitButton.x, exitButton.y + exitButton.height);
    exitGradient.addColorStop(0, '#FF6B9D');
    exitGradient.addColorStop(1, '#E91E63');
    ctx.fillStyle = exitGradient;
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    ctx.beginPath();
    ctx.roundRect(exitButton.x, exitButton.y, exitButton.width, exitButton.height, 15);
    ctx.fill();
    
    // Exit button border
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#C2185B';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Exit button text
    ctx.fillStyle = WHITE;
    ctx.font = 'bold 28px Arial';
    ctx.fillText('🚪 Exit', exitButton.x + exitButton.width / 2, exitButton.y + 38);
    
    ctx.shadowColor = 'transparent';
}

// Restart game function
function restartGame() {
    currentStage = 1;
    wordsCompletedInStage = 0;
    score = 0;
    collectedLetters = '';
    collectedOutOfOrder = false;
    gameOver = false;
    
    // Reset word
    currentWord = wordsToTranslate[Math.floor(Math.random() * wordsToTranslate.length)];
    currentAmharic = translations[currentWord].amharic;
    
    // Pronounce the word before starting
    wordPronunciationComplete = false;
    pronounceWord(currentWord, translations[currentWord].phonetic);
    
    // Reset all falling letters
    fallingLetters.forEach(letter => {
        letter.reset();
        letter.active = false;
    });
    
    lastSpawnTime = Date.now();
    console.log('Game restarted!');
}

// Game loop
function gameLoop() {
    // Clear canvas
    drawBackground();
    
    if (gameOver) {
        drawGameOver();
    } else {
        // Update and render celebration particles
        if (celebrationActive) {
            celebrationTimer--;
            
            for (let i = celebrationParticles.length - 1; i >= 0; i--) {
                celebrationParticles[i].update();
                celebrationParticles[i].draw();
                if (celebrationParticles[i].isDead()) {
                    celebrationParticles.splice(i, 1);
                }
            }
        }
        
        // Only spawn and update letters when not celebrating
        if (!celebrationActive) {
            // Spawn letters based on stage
            spawnLetters();

            // Update and draw falling letters
            fallingLetters.forEach(letter => {
                letter.move();
                letter.checkCollection();
                letter.draw();
            });
        } else {
            // Still draw letters during celebration but don't move them
            fallingLetters.forEach(letter => {
                letter.draw();
            });
        }

        // Draw UI
        drawCollectionCircle();
        drawUI();

        // Check for word completion (only when not celebrating)
        if (!celebrationActive) {
            checkWordCompletion();
        }
    }

    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Start the game
console.log(`Starting game with word: ${currentWord}, Amharic: ${currentAmharic}`);
// Pronounce the first word
wordPronunciationComplete = false;
pronounceWord(currentWord, translations[currentWord].phonetic);
lastSpawnTime = Date.now();

// Only start game loop after continue button is clicked
function startGameLoop() {
    if (gameStarted) {
        gameLoop();
    } else {
        setTimeout(startGameLoop, 100);
    }
}
startGameLoop();
