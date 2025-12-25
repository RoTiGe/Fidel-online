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
    // Ensure translations are loaded and data initialized before starting
    const attemptInit = () => {
        if (initializeGameData()) {
            gameStarted = true;
            resizeCanvas();
        } else {
            setTimeout(attemptInit, 50);
        }
    };
    attemptInit();
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
 'ጻ': 'ts’a', 'ጼ': 'ts’ey', 'ጽ': 'ts’ih', 'ጾ': 'ts’o',
    'ፀ': 'ts’e', 'ፁ': 'ts’u', 'ፂ': 'ts’i', 'ፃ': 'ts’a', 'ፄ': 'ts’ey', 'ፅ': 'ts’ih', 'ፆ': 'ts’o',
    'ፈ': 'fe', 'ፉ': 'fu', 'ፊ': 'fi', 'ፋ': 'fa', 'ፌ': 'fey', 'ፍ': 'fih', 'ፎ': 'fo',
    'ፐ': 'pe', 'ፑ': 'pu', 'ፒ': 'pi', 'ፓ': 'pa', 'ፔ': 'pey', 'ፕ': 'pih', 'ፖ': 'po'
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

// Build categories as stages (fewest words first) — deferred until translations are ready
let categoriesMap = {};
let categoriesOrder = [];

// Visual templates cycled across categories
const visualPalette = [
    { name: 'Morning Sky', bgColor: '#87CEEB', coinColor: '#FFD700', platformColor: '#8B4513' },
    { name: 'Sunset', bgColor: '#FF6B35', coinColor: '#FFEB3B', platformColor: '#D84315' },
    { name: 'Night', bgColor: '#1A237E', coinColor: '#FFA726', platformColor: '#4A148C' },
    { name: 'Rainbow Land', bgColor: '#E1BEE7', coinColor: '#F06292', platformColor: '#7B1FA2' },
    { name: 'Ocean Dream', bgColor: '#006064', coinColor: '#FFD54F', platformColor: '#00838F' }
];
let stageTemplates = [];

// Game variables
let wordsToTranslate = [];
let currentWord = '';
let currentAmharic = '';
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

function initializeGameData() {
    if (categoriesOrder.length > 0) return true; // already initialized
    if (!window.translations) {
        console.warn('Translations not loaded yet; delaying init.');
        return false;
    }

    categoriesMap = {};
    Object.keys(translations).forEach(w => {
        const cat = translations[w].category || 'uncategorized';
        (categoriesMap[cat] ||= []).push(w);
    });
    categoriesOrder = Object.keys(categoriesMap).sort((a,b) => categoriesMap[a].length - categoriesMap[b].length);

    stageTemplates = categoriesOrder.map((cat, i) => ({
        name: `${cat[0].toUpperCase()}${cat.slice(1)}`,
        bgColor: visualPalette[i % visualPalette.length].bgColor,
        coinColor: visualPalette[i % visualPalette.length].coinColor,
        platformColor: visualPalette[i % visualPalette.length].platformColor,
        requiresOrder: i >= Math.floor(categoriesOrder.length / 2)
    }));

    wordsToTranslate = categoriesMap[categoriesOrder[0]] || [];
    currentWord = wordsToTranslate.length ? wordsToTranslate[Math.floor(Math.random() * wordsToTranslate.length)] : '';
    currentAmharic = currentWord && translations[currentWord] ? translations[currentWord].amharic : '';

    return true;
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
        this.width = 40;
        this.height = 60;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
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
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) this.vx = -PLAYER_SPEED;
        if (keys['ArrowRight'] || keys['d'] || keys['D']) this.vx = PLAYER_SPEED;

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
            const wasAbove = this.y + this.height <= p.y;
            const willOverlapY = this.y + this.height >= p.y && this.y + this.height <= p.y + p.height + 10;
            if (withinX && wasAbove && willOverlapY && this.vy >= 0) {
                this.y = p.y - this.height;
                this.vy = 0;
                this.onGround = true;
            }
        }
    }
    draw(camera) {
        const screenX = this.x - camera.x;
        ctx.fillStyle = '#1976D2';
        ctx.fillRect(screenX, this.y, this.width, this.height);
        ctx.strokeStyle = '#0D47A1';
        ctx.lineWidth = 3;
        ctx.strokeRect(screenX, this.y, this.width, this.height);
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
    }
    draw(camera, themeColor) {
        if (this.collected) return;
        const screenX = this.x - camera.x;
        ctx.save();
        ctx.translate(screenX + this.width / 2, this.y + this.height / 2);
        ctx.fillStyle = themeColor;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
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
    const startX = 300;
    const step = 120;
    const baseY = SCREEN_HEIGHT - 240;
    for (let i = 0; i < chars.length; i++) {
        arr.push(new Letter(chars[i], startX + i * step, baseY));
    }
    return arr;
}

// Level state
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

function advanceStage() {
    currentStage++;
    if (currentStage >= categoriesOrder.length) {
        gameOver = true;
        gameOverReason = 'All categories completed!';
        return;
    }
    const cat = categoriesOrder[currentStage];
    const words = categoriesMap[cat] || [];
    currentWord = words.length ? words[Math.floor(Math.random() * words.length)] : '';
    currentAmharic = currentWord && translations[currentWord] ? translations[currentWord].amharic : '';
    collectedLetters = '';
    wordPronunciationComplete = false;
    pronounceWord();
    setupStage();
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

function restartGame() {
    gameOver = false;
    gameOverReason = '';
    collectedLetters = '';
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
        if (window.player && typeof player.jump === 'function') {
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
            if (window.player && typeof player.jump === 'function') {
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
    portal.active = allCollected;
    if (portal.active && portal.checkCollision(player)) {
        advanceStage();
    }

    // Draw
    drawBackground();
    for (const p of platforms) p.draw(camera);
    for (const l of letters) l.draw(camera, stageTemplates[currentStage].coinColor);
    portal.draw(camera);
    player.draw(camera);
    drawHUD();
    drawVirtualControls();
    requestAnimationFrame(gameLoop);
}
