<<<<<<< HEAD
﻿// Geez Alphabet Platformer - Combined Educational Game
=======
// Geez Alphabet Platformer - Backend-Secured Version
>>>>>>> c84c26feba0322eea9ad0d06a4c61b70e615f095
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Initialize Game API
const gameAPI = new GameAPI();

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
    // If the game has started, re-setup the stage to realign platforms with new height
    if (gameStarted) {
        setupStage();
    }
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Start game function (called when continue button is clicked)
async function startGame() {
    console.log('Start button clicked');
    const modal = document.getElementById('instructionsModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
    
    try {
        const lang = localStorage.getItem('selectedLanguage') || 'amharic';
        await initializeGameData(lang);
        gameStarted = true;
        console.log('Game started successfully');
        resizeCanvas();
        pronounceWord();
        setupStage();
    } catch (error) {
        console.error('Failed to start game:', error);
        alert('Failed to connect to game server. Please refresh and try again.');
    }
}
window.startGame = startGame;

// Geez Alphabet Dictionary - loaded from API
let GeezAlphabetDict = {};
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
    'ዐ': 'ah', 'ዑ': 'u', 'ዒ': 'i', 'ዓ': 'aa', 'ዔ': 'ay', 'ዕ': 'ih', 'ዖ': 'o',
    'ዘ': 'ze', 'ዙ': 'zu', 'ዚ': 'zi', 'ዛ': 'za', 'ዜ': 'zey', 'ዝ': 'zih', 'ዞ': 'zo',
    'የ': 'ye', 'ዩ': 'yu', 'ዪ': 'yi', 'ያ': 'ya', 'ዬ': 'yey', 'ይ': 'yih', 'ዮ': 'yo',
    'ደ': 'de', 'ዱ': 'du', 'ዲ': 'di', 'ዳ': 'da', 'ዴ': 'dey', 'ድ': 'dih', 'ዶ': 'do',
    'ጀ': 'je', 'ጁ': 'ju', 'ጂ': 'ji', 'ጃ': 'ja', 'ጄ': 'jey', 'ጅ': 'jih', 'ጆ': 'jo',
    'ገ': 'ge', 'ጉ': 'gu', 'ጊ': 'gi', 'ጋ': 'ga', 'ጌ': 'gey', 'ግ': 'gih', 'ጎ': 'go',
    'ጠ': "t'e", 'ጡ': "t'u", 'ጢ': "t'i", 'ጣ': "t'a", 'ጤ': "t'ey", 'ጥ': "t'ih", 'ጦ': "t'o",
    'ጨ': "ch'e", 'ጩ': "ch'u", 'ጪ': "ch'i", 'ጫ': "ch'a", 'ጬ': "ch'ey", 'ጭ': "ch'ih", 'ጮ': "ch'o",
    'ጰ': "p'e", 'ጱ': "p'u", 'ጲ': "p'i", 'ጳ': "p'a", 'ጴ': "p'ey", 'ጵ': "p'ih", 'ጶ': "p'o",
    'ጸ': "ts'e", 'ጹ': "ts'u", 'ጺ': "ts'i", 'ጻ': "ts'a", 'ጼ': "ts'ey", 'ጽ': "ts'ih", 'ጾ': "ts'o",
    'ፈ': 'fe', 'ፉ': 'fu', 'ፊ': 'fi', 'ፋ': 'fa', 'ፌ': 'fey', 'ፍ': 'fih', 'ፎ': 'fo',
    'ፐ': 'pe', 'ፑ': 'pu', 'ፒ': 'pi', 'ፓ': 'pa', 'ፔ': 'pey', 'ፕ': 'pih', 'ፖ': 'po'
};


// Image cache for word visuals
const wordImages = {};
let currentWordImage = null;
let imageLoadingError = false;

// Player sprite sheet
const playerSprite = new Image();
playerSprite.src = '/assets/boy_spirit.png';
let playerSpriteLoaded = false;
playerSprite.onload = () => {
    playerSpriteLoaded = true;
    console.log('Player sprite loaded:', playerSprite.width, 'x', playerSprite.height);
};
playerSprite.onerror = () => {
    console.warn('Failed to load player sprite, using fallback drawing');
    playerSpriteLoaded = false;
};

// Sprite sheet configuration (8 frames walking, 5 frames jumping)
const SPRITE_CONFIG = {
    walkFrames: 8,
    jumpFrames: 5,
    rows: 2
};

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

// Visual templates cycled across categories
const visualPalette = [
    { name: 'Morning Sky', bgColor: '#87CEEB', coinColor: '#FFD700', platformColor: '#8B4513' },
    { name: 'Sunset', bgColor: '#FF6B35', coinColor: '#FFEB3B', platformColor: '#D84315' },
    { name: 'Night', bgColor: '#1A237E', coinColor: '#FFA726', platformColor: '#4A148C' },
    { name: 'Rainbow Land', bgColor: '#E1BEE7', coinColor: '#F06292', platformColor: '#7B1FA2' },
    { name: 'Ocean Dream', bgColor: '#006064', coinColor: '#FFD54F', platformColor: '#00838F' }
];
let stageTemplates = [];
let categoriesOrder = [];

// Game variables
let currentWord = '';
let currentAmharic = '';
let currentCategory = '';
let collectedLetters = '';
let currentStage = 0;
let score = 0;
let gameOver = false;
let gameOverReason = '';
let stageTimer = 0;
let lastEnemySpawn = 0;
let wordPronunciationComplete = false;
let stageStartTime = 0;

// Keyboard state
const keys = {};

async function initializeGameData(language) {
    // Initialize game session with backend
    const session = await gameAPI.initGame('platformer-tutorial', language);
    console.log('Session initialized:', session.sessionId);
    
    // Load alphabet for character rendering
    const { alphabet } = await gameAPI.getAlphabet(language);
    GeezAlphabetDict = alphabet;
    
    // Store categories order from server
    categoriesOrder = session.categoriesOrder;
    
    // Create stage templates based on categories
    stageTemplates = categoriesOrder.map((cat, i) => ({
        name: `${cat[0].toUpperCase()}${cat.slice(1)}`,
        bgColor: visualPalette[i % visualPalette.length].bgColor,
        coinColor: visualPalette[i % visualPalette.length].coinColor,
        platformColor: visualPalette[i % visualPalette.length].platformColor,
        requiresOrder: i >= Math.floor(categoriesOrder.length / 2)
    }));
    
    // Get first word from server
    const wordData = await gameAPI.getCurrentWord();
    currentWord = wordData.word;
    currentAmharic = wordData.translation;
    currentCategory = wordData.category;
    
    stageStartTime = Date.now();
    
    console.log('First word loaded:', currentWord, '→', currentAmharic);
}

// Platform class
class Platform {
    constructor(x, y, width, height, color = '#8B4513') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw(camera) {
        const screenX = this.x - camera.x;
        ctx.fillStyle = this.color;
        ctx.fillRect(screenX, this.y, this.width, this.height);
        ctx.strokeStyle = adjustBrightness(this.color, -40);
        ctx.lineWidth = 3;
        ctx.strokeRect(screenX, this.y, this.width, this.height);
    }
}

// Player class
class Player {
    constructor() {
        this.x = 100;
        this.y = SCREEN_HEIGHT - 200;
        this.width = 80;
        this.height = 120;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.direction = 1;
        this.animationFrame = 0;
        this.animationTimer = 0;
    }
    jump() {
        if (this.onGround) {
            this.vy = JUMP_STRENGTH;
            this.onGround = false;
        }
    }
    update(platforms) {
        // Horizontal input
        this.vx = 0;
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
            this.vx = -PLAYER_SPEED;
            this.direction = -1;
        }
        if (keys['ArrowRight'] || keys['d'] || keys['D']) {
            this.vx = PLAYER_SPEED;
            this.direction = 1;
        }
        
        // Update animation
        if (this.vx !== 0 && this.onGround) {
            this.animationTimer++;
            if (this.animationTimer > 4) {
                this.animationFrame = (this.animationFrame + 1) % SPRITE_CONFIG.walkFrames;
                this.animationTimer = 0;
            }
        } else {
            this.animationFrame = 0;
            this.animationTimer = 0;
        }

        // Store previous position for collision detection
        const prevY = this.y;

        // Apply physics
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        // World bounds
        this.x = Math.max(0, Math.min(this.x, WORLD_WIDTH - this.width));
        if (this.y > SCREEN_HEIGHT) {
            gameOver = true;
            gameOverReason = 'Fell off the world';
        }

        // Platform collisions (simple AABB with ground check)
        this.onGround = false;
        for (const p of platforms) {
            const withinX = this.x < p.x + p.width && this.x + this.width > p.x;
            const wasAbove = prevY + this.height <= p.y; // Use previous position
            const isNowBelowOrAt = this.y + this.height >= p.y;
            if (withinX && wasAbove && isNowBelowOrAt && this.vy >= 0) {
                this.y = p.y - this.height;
                this.vy = 0;
                this.onGround = true;
            }
        }
    }
    draw(camera) {
        const screenX = this.x - camera.x;
        
        ctx.save();
        
        // Use sprite sheet if loaded
        if (playerSpriteLoaded && playerSprite.width > 0) {
            const frameWidth = playerSprite.width / SPRITE_CONFIG.walkFrames;
            const frameHeight = playerSprite.height / SPRITE_CONFIG.rows;
            
            let row = 0;
            let frame = 0;
            
            if (!this.onGround) {
                // Jumping - bottom row
                row = 1;
                if (this.vy < -8) {
                    frame = 0;
                } else if (this.vy < -4) {
                    frame = 1;
                } else if (this.vy < 4) {
                    frame = 2;
                } else if (this.vy < 8) {
                    frame = 3;
                } else {
                    frame = 4;
                }
            } else if (this.vx !== 0) {
                // Walking - top row
                row = 0;
                frame = this.animationFrame;
            } else {
                // Standing
                row = 0;
                frame = 0;
            }
            
            const sx = frame * frameWidth;
            const sy = row * frameHeight;
            
            if (this.direction === -1) {
                ctx.translate(screenX + this.width, 0);
                ctx.scale(-1, 1);
                ctx.translate(-screenX - this.width, 0);
            }
            
            // Draw with bottom cropping for realistic platform contact
            const cropBottom = frameHeight * 0.2;
            ctx.drawImage(
                playerSprite,
                sx, sy, frameWidth, frameHeight - cropBottom,
                screenX, this.y, this.width, this.height
            );
            
        } else {
            // Fallback: old procedural drawing (commented)
            /*
            const centerX = screenX + this.width / 2;
            const centerY = this.y + this.height / 2;
            
            if (this.direction === -1) {
                ctx.translate(screenX + this.width, 0);
                ctx.scale(-1, 1);
                ctx.translate(-screenX - this.width, 0);
            }
            
            // Body
            ctx.fillStyle = '#4A90E2';
            ctx.beginPath();
            ctx.ellipse(centerX, this.y + 28, 14, 18, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#2E5C8A';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Head
            ctx.fillStyle = '#FFD1A3';
            ctx.beginPath();
            ctx.arc(centerX, this.y + 12, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#D4A574';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // Hair
            ctx.fillStyle = '#3D2817';
            ctx.beginPath();
            ctx.arc(centerX, this.y + 8, 11, Math.PI, 0, true);
            ctx.fill();
            
            // Eyes, arms, legs, etc...
            */
            
            // Simple placeholder
            ctx.fillStyle = '#4A90E2';
            ctx.fillRect(screenX, this.y, this.width, this.height);
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Loading...', screenX + this.width/2, this.y + this.height/2);
        }
        
        ctx.restore();
    }
            ctx.scale(-1, 1);
            ctx.translate(-screenX - this.width, 0);
        }
        
        // Body (torso)
        ctx.fillStyle = '#4A90E2';
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + 28, 14, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2E5C8A';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Head
        ctx.fillStyle = '#FFD1A3';
        ctx.beginPath();
        ctx.arc(centerX, this.y + 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#D4A574';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Hair
        ctx.fillStyle = '#3D2817';
        ctx.beginPath();
        ctx.arc(centerX, this.y + 8, 11, Math.PI, 0, true);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(centerX - 4, this.y + 11, 2.5, 0, Math.PI * 2);
        ctx.arc(centerX + 4, this.y + 11, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(centerX - 4, this.y + 11, 1.2, 0, Math.PI * 2);
        ctx.arc(centerX + 4, this.y + 11, 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Smile
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, this.y + 15, 4, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        // Arms - animated
        const armSwing = this.onGround && this.vx !== 0 ? Math.sin(this.animationFrame * Math.PI / 2) * 15 : 0;
        
        // Left arm
        ctx.strokeStyle = '#FFD1A3';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(centerX - 10, this.y + 26);
        ctx.lineTo(centerX - 10, this.y + 36 + armSwing);
        ctx.stroke();
        
        // Right arm
        ctx.beginPath();
        ctx.moveTo(centerX + 10, this.y + 26);
        ctx.lineTo(centerX + 10, this.y + 36 - armSwing);
        ctx.stroke();
        
        // Legs - animated running
        let leftLegOffset = 0;
        let rightLegOffset = 0;
        
        if (this.onGround && this.vx !== 0) {
            // Running animation
            const legAngle = Math.sin(this.animationFrame * Math.PI / 2) * 20;
            leftLegOffset = legAngle;
            rightLegOffset = -legAngle;
        } else if (!this.onGround) {
            // Jumping pose
            leftLegOffset = -10;
            rightLegOffset = -10;
        }
        
        // Left leg
        ctx.strokeStyle = '#2C5AA0';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(centerX - 6, this.y + 42);
        ctx.lineTo(centerX - 6 + leftLegOffset * 0.3, this.y + 56);
        ctx.stroke();
        
        // Right leg
        ctx.beginPath();
        ctx.moveTo(centerX + 6, this.y + 42);
        ctx.lineTo(centerX + 6 + rightLegOffset * 0.3, this.y + 56);
        ctx.stroke();
        
        // Feet
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(centerX - 6 + leftLegOffset * 0.3, this.y + 58, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(centerX + 6 + rightLegOffset * 0.3, this.y + 58, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Letter collectible
class Letter {
    constructor(char, x, y) {
        this.character = char;
        this.x = x;
        this.y = y;
        this.width = 36;
        this.height = 36;
        this.collected = false;
        this.pulseAnimation = 0;
    }
    draw(camera, themeColor, isNext = false) {
        if (this.collected) return;
        const screenX = this.x - camera.x;
        
        // Draw pulsing indicator for next letter
        if (isNext) {
            this.pulseAnimation += 0.1;
            const pulse = Math.sin(this.pulseAnimation) * 8 + 32;
            
            ctx.save();
            ctx.translate(screenX + this.width / 2, this.y + this.height / 2);
            
            // Draw circling arrow with thicker line
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#FF0000';
            ctx.shadowBlur = 10;
            
            // Rotate the arc
            ctx.rotate(this.pulseAnimation);
            
            ctx.beginPath();
            ctx.arc(0, 0, pulse, 0, Math.PI * 1.5);
            ctx.stroke();
            
            // Draw arrow head
            const arrowX = pulse * Math.cos(Math.PI * 1.5);
            const arrowY = pulse * Math.sin(Math.PI * 1.5);
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(arrowX - 12, arrowY - 8);
            ctx.lineTo(arrowX + 8, arrowY - 12);
            ctx.fill();
            
            ctx.restore();
        }
        
        ctx.save();
        ctx.translate(screenX + this.width / 2, this.y + this.height / 2);
        ctx.fillStyle = isNext ? '#FFD700' : themeColor;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect for next letter
        if (isNext) {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;
        }
        
        ctx.fillStyle = 'black';
        ctx.font = 'bold 20px NotoSansEthiopic, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.character, 0, 2);
        ctx.restore();
    }
    checkCollision(player) {
        if (this.collected) return false;
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
}

// Build letters for currentAmharic word
function buildLettersForWord() {
    const arr = [];
    if (!currentAmharic) return arr;
    const chars = Array.from(currentAmharic);
    
    // Platform positions - each platform can hold ONE letter
    const availablePositions = [
        { x: 550, y: SCREEN_HEIGHT - 240, type: 'platform1' },  // First raised platform (left)
        { x: 700, y: SCREEN_HEIGHT - 240, type: 'platform1' },  // First raised platform (right)
        { x: 950, y: SCREEN_HEIGHT - 300, type: 'platform2' },  // Second raised platform (left)
        { x: 1100, y: SCREEN_HEIGHT - 300, type: 'platform2' }, // Second raised platform (right)
        // Ground positions (small probability)
        { x: 200, y: SCREEN_HEIGHT - 140, type: 'ground' },
        { x: 1400, y: SCREEN_HEIGHT - 140, type: 'ground' },
        { x: 1800, y: SCREEN_HEIGHT - 140, type: 'ground' }
    ];
    
    // Shuffle and assign positions, ensuring no two letters on same raised platform
    const usedPlatforms = new Set();
    const shuffledPositions = [...availablePositions].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < chars.length; i++) {
        // Try to find a position that hasn't been used (for platforms)
        let position = null;
        for (const pos of shuffledPositions) {
            // For ground, allow multiple letters (but with lower priority)
            if (pos.type === 'ground' && Math.random() < 0.2) {
                position = pos;
                break;
            }
            // For platforms, ensure not already used
            if (pos.type !== 'ground' && !usedPlatforms.has(pos.type + '_' + pos.x)) {
                position = pos;
                usedPlatforms.add(pos.type + '_' + pos.x);
                break;
            }
        }
        
        // Fallback to any available position if none found
        if (!position) {
            position = shuffledPositions[i % shuffledPositions.length];
        }
        
        arr.push(new Letter(chars[i], position.x, position.y));
    }
    return arr;
}

// Portal class (moved earlier to ensure availability before first use)
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
        
        // Only draw if portal is on screen
        if (screenX < -this.width || screenX > SCREEN_WIDTH) return;
        
        ctx.save();
        
        // Animated rotating gradient background
        const gradient = ctx.createRadialGradient(
            screenX + this.width / 2, this.y + this.height / 2, 0,
            screenX + this.width / 2, this.y + this.height / 2, this.width
        );
        gradient.addColorStop(0, 'rgba(138, 43, 226, 0.9)');
        gradient.addColorStop(0.5, 'rgba(75, 0, 130, 0.7)');
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0.3)');
        ctx.fillStyle = gradient;
        
        // Draw portal rectangle with pulsing effect
        const pulseSize = Math.sin(this.animationOffset) * 5;
        ctx.fillRect(
            screenX - pulseSize / 2, 
            this.y - pulseSize / 2, 
            this.width + pulseSize, 
            this.height + pulseSize
        );
        
        // Draw border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.strokeRect(screenX, this.y, this.width, this.height);
        
        // Draw "Enter" text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        ctx.fillText('ENTER', screenX + this.width / 2, this.y + this.height / 2);
        ctx.fillText('🚪', screenX + this.width / 2, this.y - 15);
        
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

// Level state


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


let platforms = [];
let letters = [];
let enemies = [];
let portal = new Portal(WORLD_WIDTH - 200, SCREEN_HEIGHT - 200);
let camera = new Camera();
let player = new Player();

function setupStage() {
    // Theme colors
    const stage = stageTemplates[currentStage];

    // Ground + simple steps
    platforms = [
        new Platform(0, SCREEN_HEIGHT - 100, WORLD_WIDTH, 100, stage.platformColor),
        new Platform(500, SCREEN_HEIGHT - 200, 240, 20, stage.platformColor),
        new Platform(900, SCREEN_HEIGHT - 260, 240, 20, stage.platformColor)
    ];
    letters = buildLettersForWord();
    enemies = [];
    portal.active = false;
    player = new Player();
}

async function advanceStage() {
    try {
        const result = await gameAPI.advanceStage();
        
        if (result.gameOver) {
            gameOver = true;
            gameOverReason = `Congratulations! Final Score: ${result.finalScore}`;
            return;
        }
        
        currentStage = result.newStage;
        
        // Get new word from server
        const wordData = await gameAPI.getCurrentWord();
        currentWord = wordData.word;
        currentAmharic = wordData.translation;
        currentCategory = wordData.category;
        
        collectedLetters = '';
        wordPronunciationComplete = false;
        stageStartTime = Date.now();
        
        pronounceWord();
        setupStage();
    } catch (error) {
        console.error('Failed to advance stage:', error);
        gameOver = true;
        gameOverReason = 'Connection error. Please refresh.';
    }
}

function pronounceWord() {
    try {
        const utter = new SpeechSynthesisUtterance(currentWord);
        utter.lang = 'en-US';
        utter.onend = () => { wordPronunciationComplete = true; };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
        setTimeout(() => { wordPronunciationComplete = true; }, 5000);
    } catch (e) {
        wordPronunciationComplete = true;
    }
}

async function restartGame() {
    gameAPI.clearSession();
    score = 0;
    currentStage = 0;
    collectedLetters = '';
    gameOver = false;
    gameOverReason = '';
    
    const lang = localStorage.getItem('selectedLanguage') || 'amharic';
    await initializeGameData(lang);
    wordPronunciationComplete = false;
    pronounceWord();
    setupStage();
}

// Draw HUD and overlays
function drawHUD() {
    const stage = stageTemplates[currentStage];
    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
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
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Collected: ${collectedLetters}`, 10, 140);
    }
    if (stage.requiresOrder) {
        ctx.fillStyle = 'red';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('⚠️ Order Matters!', 10, 165);
    }

    // Intro/instruction overlay
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

    // Listening overlay while TTS plays
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
        if (translations[currentWord]?.phonetic) {
            ctx.fillStyle = '#4A148C';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(`(${translations[currentWord].phonetic})`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 15);
        }
        ctx.textAlign = 'left';
    }
}

// Background
function drawBackground() {
    const stage = stageTemplates[currentStage];
    ctx.fillStyle = stage.bgColor;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

// Initialize first stage after translations ready
function tryInitStage() {
    if (initializeGameData()) {
        pronounceWord();
        setupStage();
        return true;
    }
    return false;
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
        if (player && typeof player.jump === 'function') {
            player.jump();
        }
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
            if (player && typeof player.jump === 'function') {
                player.jump();
            }
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
        // Ensure stage is ready
        if (!tryInitStage()) {
            setTimeout(startGameLoop, 100);
            return;
        }
        gameLoop();
    } else {
        setTimeout(startGameLoop, 100);
    }
}
startGameLoop();

function gameLoop() {
    if (gameOver) {
        // Game over screen
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
        drawVirtualControls();
        requestAnimationFrame(gameLoop);
        return;
    }

    // Update
    player.update(platforms);
    camera.update(player);
    portal.update();

    // Collect letters
    const stage = stageTemplates[currentStage];
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        if (!letter.collected && letter.checkCollision(player)) {
            const expectedIndex = collectedLetters.length;
            const isCorrect = !stage.requiresOrder || letter.character === Array.from(currentAmharic)[expectedIndex];
            if (isCorrect) {
                letter.collected = true;
                collectedLetters += letter.character;
                score += 1;
            } else {
                // Penalty for wrong order
                score = Math.max(0, score - 0.5);
            }
        }
    }

    // Activate portal when all letters collected
    const allCollected = letters.every(l => l.collected);
    
    // Validate with server when word complete
    if (allCollected && !portal.active) {
        validateWordCompletion();
    }
    
    if (portal.active && portal.checkCollision(player)) {
        console.log('Player entered portal!');
        advanceStage();
    }

async function validateWordCompletion() {
    const timeSpent = Date.now() - stageStartTime;
    try {
        const result = await gameAPI.completeWord(
            currentWord,
            collectedLetters,
            timeSpent
        );
        
        if (result.success) {
            score = result.totalScore;
            portal.active = true;
            console.log('Word validated! Score earned:', result.scoreEarned);
        } else {
            console.error('Server rejected word completion');
        }
    } catch (error) {
        console.error('Failed to validate word:', error);
        // Still activate portal even on error to not block gameplay
        portal.active = true;
    }
}

    // Draw
    drawBackground();
    for (const p of platforms) p.draw(camera);
    
    // Draw letters with indicator for next one to collect
    const currentStageData = stageTemplates[currentStage];
    const nextIndex = collectedLetters.length;
    for (let i = 0; i < letters.length; i++) {
        const isNext = currentStageData.requiresOrder && i === nextIndex && !letters[i].collected;
        letters[i].draw(camera, currentStageData.coinColor, isNext);
    }
    
    portal.draw(camera);
    player.draw(camera);
    drawHUD();
    drawVirtualControls();
    requestAnimationFrame(gameLoop);
}
