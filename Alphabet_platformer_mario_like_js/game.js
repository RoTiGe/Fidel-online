const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Responsive screen dimensions
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let WORLD_WIDTH = SCREEN_WIDTH * 3;

const GRAVITY = 0.5;
const JUMP_STRENGTH = -12;
const PLAYER_SPEED = 5;

// Set canvas to fill screen
function resizeCanvas() {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    WORLD_WIDTH = SCREEN_WIDTH * 3;
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Geez alphabet characters
/*
const geezAlphabet = [
    'ሀ', 'ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ',
    'ለ', 'ሉ', 'ሊ', 'ላ', 'ሌ', 'ል', 'ሎ',
    'መ', 'ሙ', 'ሚ', 'ማ', 'ሜ', 'ም', 'ሞ',
    'ረ', 'ሩ', 'ሪ', 'ራ', 'ሬ', 'ር', 'ሮ',
    'ሰ', 'ሱ', 'ሲ', 'ሳ', 'ሴ', 'ስ', 'ሶ'
];
*/

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

// Game stages configuration
const stageTemplates = [
    { name: 'Morning Sky', bgColor: '#87CEEB', coinColor: '#FFD700', platformColor: '#8B4513' },
    { name: 'Sunset', bgColor: '#FF6B35', coinColor: '#FFEB3B', platformColor: '#D84315' },
    { name: 'Night', bgColor: '#1A237E', coinColor: '#FFA726', platformColor: '#4A148C' },
    { name: 'Rainbow Land', bgColor: '#E1BEE7', coinColor: '#F06292', platformColor: '#7B1FA2' },
    { name: 'Ocean Dream', bgColor: '#006064', coinColor: '#FFD54F', platformColor: '#00838F' }
];

// Generate random clouds for each stage (static positions)
let stageClouds = [];

function generateStageClouds() {
    stageClouds = [];
    const cloudCount = 15 + Math.floor(Math.random() * 10); // 15-25 clouds
    
    for (let i = 0; i < cloudCount; i++) {
        stageClouds.push({
            x: Math.random() * WORLD_WIDTH,
            y: Math.random() * (SCREEN_HEIGHT / 2),
            size: 20 + Math.random() * 40,
            opacity: 0.3 + Math.random() * 0.4
        });
    }
}

// Randomize starting stage at multiples of 7 (letter families)
function getRandomLetterFamilyStage() {
    const totalFamilies = Math.floor(Object.keys(GeezAlphabetDict).length / 7);
    return Math.floor(Math.random() * totalFamilies) * 7;
}

let currentStage = 0;
let coinsPerStage = 7;
let lettersPerBatch = 35; // 5 stages × 7 letters
let currentBatch = Math.floor(getRandomLetterFamilyStage() / lettersPerBatch);
let stageOffset = getRandomLetterFamilyStage() % lettersPerBatch; // Track offset within batch
let totalLettersCollected = 0;
let showCongratulations = false;
const geezCharacters = Object.keys(GeezAlphabetDict);
const stages = stageTemplates;

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

// Keyboard state
const keys = {};
let previousPlayerX = 0;
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
        this.onPlatform = null; // Track which platform player is on
        this.direction = 1; // 1 for right, -1 for left
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 5; // Change frame every 5 game loops
    }

    update() {
        // Keyboard controls for horizontal movement
        this.velocityX = 0;
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
            this.velocityX = -PLAYER_SPEED;
            this.direction = -1; // Moving left
        }
        if (keys['ArrowRight'] || keys['d'] || keys['D']) {
            this.velocityX = PLAYER_SPEED;
            this.direction = 1; // Moving right
        }
        
        // Animate sprite when moving
        if (this.velocityX !== 0) {
            this.animationTimer++;
            if (this.animationTimer >= this.animationSpeed) {
                this.animationTimer = 0;
                this.animationFrame = (this.animationFrame + 1) % 6; // 6 frames
            }
        } else {
            this.animationFrame = 0; // Reset to standing pose when not moving
        }
        
        // Move with platform if standing on one
        if (this.onPlatform && this.onPlatform instanceof MovingPlatform) {
            this.x += this.onPlatform.speedX * this.onPlatform.direction;
        }
        
        this.x += this.velocityX;
        
        this.applyGravity();

        // Ensure player stays within world bounds
        this.x = Math.max(0, Math.min(WORLD_WIDTH - this.width, this.x));

        // Check collision with static platforms
        this.onGround = false;
        this.onPlatform = null;
        const allPlatforms = [...staticPlatforms, ...movingPlatforms];
        
        allPlatforms.forEach(platform => {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y + this.height > platform.y &&
                this.y < platform.y + platform.height) {
                
                // Landing on top of platform
                if (this.velocityY > 0 && this.y < platform.y) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.isJumping = false;
                    this.onGround = true;
                    this.onPlatform = platform;
                }
            }
        });
    }

    applyGravity() {
        this.velocityY += GRAVITY;
        this.y += this.velocityY;

        // Check for collision with ground
        if (this.y + this.height >= SCREEN_HEIGHT) {
            this.y = SCREEN_HEIGHT - this.height;
            this.velocityY = 0;
            this.isJumping = false;
            this.onGround = true;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = JUMP_STRENGTH;
            this.isJumping = true;
        }
    }

    draw(camera) {
        const screenX = this.x - camera.x;
        
        // Try to draw player sprite if loaded, otherwise draw default character
        if (playerSprite && playerSprite.loaded) {
            ctx.save();
            
            // Sprite sheet: 360x100 with 6 frames (60x100 each)
            const frameWidth = 60;
            const frameHeight = 100;
            const sourceX = this.animationFrame * frameWidth;
            const sourceY = 0;
            
            // Flip horizontally when moving left
            if (this.direction === -1) {
                ctx.translate(screenX + this.width, this.y);
                ctx.scale(-1, 1);
                ctx.drawImage(
                    playerSprite.image,
                    sourceX, sourceY, frameWidth, frameHeight,
                    0, 0, this.width, this.height
                );
            } else {
                ctx.drawImage(
                    playerSprite.image,
                    sourceX, sourceY, frameWidth, frameHeight,
                    screenX, this.y, this.width, this.height
                );
            }
            
            ctx.restore();
        } else {
            // Draw a cute character with a smiley face
            // Body
            ctx.fillStyle = '#FF6B6B';
            ctx.fillRect(screenX, this.y, this.width, this.height);
            
            // Border
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
}

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(camera) {
        const stage = stages[currentStage];
        ctx.fillStyle = stage.platformColor;
        ctx.fillRect(this.x - camera.x, this.y, this.width, this.height);
        
        // Add border for better visibility
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - camera.x, this.y, this.width, this.height);
    }
}

class MovingPlatform {
    constructor(x, y, width, height, speedY = 0, speedX = 2) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedY = speedY;
        this.speedX = speedX;
        this.startX = x;
        this.direction = 1;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX * this.direction;
        
        // Bounce horizontally
        if (this.x > this.startX + 100 || this.x < this.startX - 100) {
            this.direction *= -1;
        }
    }

    draw(camera) {
        const stage = stages[currentStage];
        // Lighter color for moving platforms
        ctx.fillStyle = stage.platformColor;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(this.x - camera.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1.0;
        
        // Border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - camera.x, this.y, this.width, this.height);
    }

    isOffScreen() {
        return this.y > SCREEN_HEIGHT + 100;
    }
}

class Coin {
    constructor(x, y, character, pronunciation) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.collected = false;
        this.rotation = 0;
        this.character = character;
        this.pronunciation = pronunciation;
        this.bounceOffset = 0;
    }

    update() {
        this.rotation += 0.05;
        this.bounceOffset = Math.sin(Date.now() / 200) * 3;
    }

    draw(camera) {
        if (!this.collected) {
            const screenX = this.x - camera.x;
            const centerX = screenX + this.width / 2;
            const centerY = this.y + this.height / 2 + this.bounceOffset;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotation);
            
            // Draw coin background
            const stage = stages[currentStage];
            ctx.fillStyle = stage.coinColor;
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Draw Geez character
            ctx.rotate(-this.rotation); // Keep text upright
            ctx.fillStyle = 'black';
            ctx.font = 'bold 24px Arial, "Noto Sans Ethiopic"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.character, 0, 2);
            
            ctx.restore();
        }
    }

    playCollectSound() {
        // Create a simple coin sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    speakPronunciation() {
        // Use Web Speech API for text-to-speech
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.pronunciation);
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }

    checkCollision(player) {
        if (!this.collected &&
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y) {
            this.collected = true;
            return true;
        }
        return false;
    }
}

class Background {
    constructor(imageSrc, scrollSpeed, fallback = true) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.scrollSpeed = scrollSpeed;
        this.x = 0;
        this.loaded = false;
        this.fallback = fallback;
        this.image.onload = () => { this.loaded = true; };
        this.image.onerror = () => { this.loaded = false; };
    }

    update(cameraX) {
        this.x = -cameraX * this.scrollSpeed;
    }

    draw() {
        if (!this.loaded) {
            if (!this.fallback) return;
            
            // Draw colored gradient background if images don't load
            const stage = stages[currentStage];
            const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
            gradient.addColorStop(0, stage.bgColor);
            gradient.addColorStop(1, this.adjustBrightness(stage.bgColor, -20));
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            
            // Add static clouds for this stage
            this.drawStaticClouds();
            return;
        }
        
        // Draw repeating background image with parallax
        const imgWidth = this.image.width;
        const imgHeight = this.image.height;
        const scale = SCREEN_HEIGHT / imgHeight;
        const scaledWidth = imgWidth * scale;
        
        const offsetX = this.x % scaledWidth;
        
        ctx.globalAlpha = 0.8;
        for (let x = -scaledWidth; x < SCREEN_WIDTH + scaledWidth; x += scaledWidth) {
            ctx.drawImage(this.image, x - offsetX, 0, scaledWidth, SCREEN_HEIGHT);
        }
        ctx.globalAlpha = 1.0;
    }
    
    adjustBrightness(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }
    
    drawStaticClouds() {
        // Draw static clouds for this stage
        if (currentStage === 0 || currentStage === 1 || currentStage === 3 || currentStage === 4) {
            stageClouds.forEach(cloud => {
                ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
                this.drawCloud(cloud.x - camera.x * this.scrollSpeed, cloud.y, cloud.size);
            });
        } else {
            // Draw stars for night stage
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            stageClouds.forEach(cloud => {
                const x = cloud.x - camera.x * this.scrollSpeed * 0.5;
                if (x >= -10 && x <= SCREEN_WIDTH + 10) {
                    ctx.fillRect(x, cloud.y, 2, 2);
                }
            });
        }
    }
    
    drawCloud(x, y, size = 20) {
        const scale = size / 20;
        ctx.beginPath();
        ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
        ctx.arc(x + 25 * scale, y, 25 * scale, 0, Math.PI * 2);
        ctx.arc(x + 50 * scale, y, 20 * scale, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Camera {
    constructor() {
        this.x = 0;
    }

    update(player) {
        // Center camera on player
        this.x = player.x - SCREEN_WIDTH / 2 + player.width / 2;
        
        // Keep camera within world bounds
        this.x = Math.max(0, Math.min(this.x, WORLD_WIDTH - SCREEN_WIDTH));
    }
}

class Balloon {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.alpha = 1.0;
        this.riseSpeed = 1.5;
        this.life = 120;
        this.scale = 0.5; // Start small and grow
        this.maxScale = 1.5; // Grow to 1.5x size
    }

    update() {
        this.y -= this.riseSpeed;
        this.life--;
        
        // Grow balloon in first 30 frames, then maintain size, fade out in last 30
        if (this.life > 90) {
            this.scale = 0.5 + (0.5 - (this.life - 90) / 30 * 0.5) * (this.maxScale - 0.5) / 0.5;
        } else if (this.life > 30) {
            this.scale = this.maxScale;
        } else {
            this.scale = this.maxScale;
        }
        
        // Keep high opacity for most of life, only fade at very end
        if (this.life > 20) {
            this.alpha = 0.95;
        } else {
            this.alpha = 0.95 * (this.life / 20);
        }
    }

    draw(camera) {
        if (this.life > 0) {
            const screenX = this.x - camera.x;
            
            ctx.save();
            ctx.globalAlpha = this.alpha;
            
            // Draw balloon shape (larger)
            ctx.fillStyle = '#FF69B4';
            ctx.beginPath();
            ctx.ellipse(screenX, this.y, 40 * this.scale, 48 * this.scale, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Balloon outline for better visibility
            ctx.strokeStyle = '#C2185B';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Balloon shine
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.ellipse(screenX - 10 * this.scale, this.y - 12 * this.scale, 10 * this.scale, 12 * this.scale, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Balloon string
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(screenX, this.y + 48 * this.scale);
            ctx.lineTo(screenX, this.y + 60 * this.scale);
            ctx.stroke();
            
            // Draw pronunciation text (larger and more visible)
            ctx.globalAlpha = 1.0; // Full opacity for text
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.font = `bold ${Math.floor(22 * this.scale)}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeText(this.text, screenX, this.y);
            ctx.fillText(this.text, screenX, this.y);
            
            ctx.restore();
        }
    }

    isDead() {
        return this.life <= 0;
    }
}

class Portal {
    constructor(x, y, targetStage) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 80;
        this.targetStage = targetStage;
        this.animationOffset = 0;
        this.active = false; // Only active when all coins collected
    }

    update() {
        this.animationOffset += 0.1;
    }

    draw(camera) {
        if (!this.active) return;
        
        const screenX = this.x - camera.x;
        
        ctx.save();
        
        // Draw portal glow
        const gradient = ctx.createRadialGradient(
            screenX + this.width / 2, this.y + this.height / 2, 0,
            screenX + this.width / 2, this.y + this.height / 2, this.width / 2
        );
        gradient.addColorStop(0, 'rgba(138, 43, 226, 0.8)');
        gradient.addColorStop(0.5, 'rgba(75, 0, 130, 0.6)');
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0.2)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(screenX, this.y, this.width, this.height);
        
        // Draw swirling effect
        for (let i = 0; i < 3; i++) {
            ctx.strokeStyle = `rgba(147, 112, 219, ${0.6 - i * 0.2})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            const offset = this.animationOffset + i * Math.PI / 1.5;
            ctx.arc(
                screenX + this.width / 2,
                this.y + this.height / 2,
                20 + i * 10 + Math.sin(offset) * 5,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
        
        // Draw "Enter" prompt
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'purple';
        ctx.lineWidth = 2;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.strokeText('Enter', screenX + this.width / 2, this.y - 10);
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

class Enemy {
    constructor(type, x, y) {
        this.type = type; // 'lion', 'hyena', 'baboon', 'tiger'
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = type === 'lion' ? 4 : type === 'hyena' ? 5 : type === 'tiger' ? 3.5 : 3;
        this.canClimb = type === 'baboon' || type === 'tiger';
        this.direction = 1;
        this.velocityY = 0;
        this.onGround = false;
        
        // Visual properties based on type
        this.colors = {
            lion: { body: '#D4A017', mane: '#8B4513', eyes: '#000' },
            hyena: { body: '#B8860B', spots: '#654321', eyes: '#000' },
            baboon: { body: '#8B4513', face: '#D2691E', eyes: '#000' },
            tiger: { body: '#FF6600', stripes: '#000', eyes: '#FFD700' }
        };
    }

    update(player) {
        // Move towards player
        if (player.x > this.x) {
            this.direction = 1;
            this.x += this.speed;
        } else {
            this.direction = -1;
            this.x -= this.speed;
        }
        
        // Climbing enemies can move vertically
        if (this.canClimb) {
            if (player.y < this.y - 10) {
                this.y -= this.speed * 0.7;
            } else if (player.y > this.y + 10) {
                this.y += this.speed * 0.7;
            }
            
            // Keep within screen bounds
            this.y = Math.max(0, Math.min(SCREEN_HEIGHT - this.height, this.y));
        } else {
            // Ground enemies use gravity
            this.velocityY += GRAVITY;
            this.y += this.velocityY;
            
            // Check ground collision
            if (this.y + this.height >= SCREEN_HEIGHT) {
                this.y = SCREEN_HEIGHT - this.height;
                this.velocityY = 0;
                this.onGround = true;
            }
            
            // Check platform collisions for ground enemies
            const allPlatforms = [...staticPlatforms, ...movingPlatforms];
            allPlatforms.forEach(platform => {
                if (this.x < platform.x + platform.width &&
                    this.x + this.width > platform.x &&
                    this.y + this.height > platform.y &&
                    this.y < platform.y + platform.height) {
                    
                    if (this.velocityY > 0 && this.y < platform.y) {
                        this.y = platform.y - this.height;
                        this.velocityY = 0;
                        this.onGround = true;
                    }
                }
            });
        }
        
        // Keep within world bounds
        this.x = Math.max(0, Math.min(WORLD_WIDTH - this.width, this.x));
    }

    draw(camera) {
        const screenX = this.x - camera.x;
        const colors = this.colors[this.type];
        
        ctx.save();
        
        // Simple geometric representation for testing
        // Draw main body as a rectangle
        ctx.fillStyle = colors.body;
        ctx.fillRect(screenX, this.y, this.width, this.height);
        
        // Draw border
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeRect(screenX, this.y, this.width, this.height);
        
        // Draw type label
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.type.toUpperCase(), screenX + this.width / 2, this.y + this.height / 2 + 5);
        
        // Draw direction indicator (triangle)
        ctx.fillStyle = colors.eyes;
        ctx.beginPath();
        if (this.direction === 1) {
            ctx.moveTo(screenX + this.width - 5, this.y + 10);
            ctx.lineTo(screenX + this.width - 5, this.y + 25);
            ctx.lineTo(screenX + this.width + 5, this.y + 17.5);
        } else {
            ctx.moveTo(screenX + 5, this.y + 10);
            ctx.lineTo(screenX + 5, this.y + 25);
            ctx.lineTo(screenX - 5, this.y + 17.5);
        }
        ctx.fill();
        
        ctx.restore();
        
        // Warning label
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.strokeText('DANGER!', screenX + this.width / 2, this.y - 5);
        ctx.fillText('DANGER!', screenX + this.width / 2, this.y - 5);
    }

    checkCollision(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
}
const player = new Player(100, 300);
const camera = new Camera();

// Create ground platforms across the world
const staticPlatforms = [];
for (let i = 0; i < WORLD_WIDTH; i += 100) {
    staticPlatforms.push(new Platform(i, SCREEN_HEIGHT - 50, 100, 50));
}

// Add elevated platforms
staticPlatforms.push(
    new Platform(200, SCREEN_HEIGHT - 150, 150, 20),
    new Platform(400, SCREEN_HEIGHT - 200, 120, 20),
    new Platform(650, SCREEN_HEIGHT - 250, 200, 20),
    new Platform(950, SCREEN_HEIGHT - 180, 150, 20),
    new Platform(1200, SCREEN_HEIGHT - 300, 180, 20),
    new Platform(1500, SCREEN_HEIGHT - 220, 140, 20),
    new Platform(1800, SCREEN_HEIGHT - 350, 150, 20),
    new Platform(2100, SCREEN_HEIGHT - 280, 160, 20)
);

const movingPlatforms = [
    new MovingPlatform(800, 300, 100, 15, 0, 2),
    new MovingPlatform(1400, 400, 120, 15, 0, 1.5)
];

// Platform layout templates for variety
const platformLayouts = [
    // Layout 0: Staircase up
    [
        [250, SCREEN_HEIGHT - 120, 120, 20],
        [450, SCREEN_HEIGHT - 180, 120, 20],
        [700, SCREEN_HEIGHT - 240, 120, 20],
        [1000, SCREEN_HEIGHT - 300, 120, 20],
        [1300, SCREEN_HEIGHT - 240, 120, 20],
        [1600, SCREEN_HEIGHT - 180, 120, 20],
        [1900, SCREEN_HEIGHT - 280, 120, 20]
    ],
    // Layout 1: Zigzag pattern
    [
        [200, SCREEN_HEIGHT - 150, 150, 20],
        [500, SCREEN_HEIGHT - 250, 130, 20],
        [800, SCREEN_HEIGHT - 180, 140, 20],
        [1100, SCREEN_HEIGHT - 280, 150, 20],
        [1400, SCREEN_HEIGHT - 200, 130, 20],
        [1700, SCREEN_HEIGHT - 300, 140, 20],
        [2000, SCREEN_HEIGHT - 220, 150, 20]
    ],
    // Layout 2: Wave pattern
    [
        [300, SCREEN_HEIGHT - 200, 140, 20],
        [550, SCREEN_HEIGHT - 280, 120, 20],
        [800, SCREEN_HEIGHT - 200, 140, 20],
        [1050, SCREEN_HEIGHT - 280, 120, 20],
        [1300, SCREEN_HEIGHT - 200, 140, 20],
        [1550, SCREEN_HEIGHT - 280, 120, 20],
        [1800, SCREEN_HEIGHT - 350, 150, 20]
    ],
    // Layout 3: High jumps
    [
        [250, SCREEN_HEIGHT - 160, 130, 20],
        [480, SCREEN_HEIGHT - 260, 120, 20],
        [750, SCREEN_HEIGHT - 320, 150, 20],
        [1050, SCREEN_HEIGHT - 240, 130, 20],
        [1350, SCREEN_HEIGHT - 340, 140, 20],
        [1650, SCREEN_HEIGHT - 260, 130, 20],
        [1950, SCREEN_HEIGHT - 300, 150, 20]
    ],
    // Layout 4: Gentle slopes
    [
        [220, SCREEN_HEIGHT - 140, 140, 20],
        [450, SCREEN_HEIGHT - 190, 130, 20],
        [720, SCREEN_HEIGHT - 240, 140, 20],
        [1000, SCREEN_HEIGHT - 210, 130, 20],
        [1280, SCREEN_HEIGHT - 270, 150, 20],
        [1560, SCREEN_HEIGHT - 230, 140, 20],
        [1840, SCREEN_HEIGHT - 290, 140, 20]
    ]
];

// Initialize coins with Geez characters
let coins = [];
let balloons = [];
let portal = null;
let enemies = [];
let stageTimer = 0;
let lastEnemySpawn = 0;
let gameOver = false;
let gameOverReason = '';

function initializeCoins() {
    coins = [];
    
    // Get platform layout for current stage
    const layoutIndex = currentStage % platformLayouts.length;
    const positions = platformLayouts[layoutIndex];
    
    for (let i = 0; i < positions.length; i++) {
        const absoluteIndex = currentBatch * lettersPerBatch + stageOffset + i;
        
        // Check if we have more characters to show
        if (absoluteIndex >= geezCharacters.length) {
            break;
        }
        
        const character = geezCharacters[absoluteIndex];
        const pronunciation = GeezAlphabetDict[character];
        
        // Position coin above the platform
        const coinX = positions[i][0] + positions[i][2] / 2 - 20;
        const coinY = positions[i][1] - 50;
        
        coins.push(new Coin(coinX, coinY, character, pronunciation));
    }
    
    // Create portal
    // After stage 2, place portals at random achievable positions
    if (currentStage >= 2) {
        // Choose a random platform (not first or last)
        const randomIndex = Math.floor(Math.random() * (positions.length - 2)) + 1;
        const randomPlatform = positions[randomIndex];
        const portalX = randomPlatform[0] + randomPlatform[2] / 2 - 30;
        const portalY = randomPlatform[1] - 80;
        
        // Random target - jump to a random letter family (multiple of 7)
        const totalFamilies = Math.floor(geezCharacters.length / 7);
        const randomFamily = Math.floor(Math.random() * totalFamilies) * 7;
        portal = new Portal(portalX, portalY, randomFamily);
    } else if (currentStage < stageTemplates.length - 1) {
        // For early stages (0-1), keep portal at the end
        const lastPlatform = positions[positions.length - 1];
        const portalX = lastPlatform[0] + lastPlatform[2] - 60;
        const portalY = lastPlatform[1] - 80;
        portal = new Portal(portalX, portalY, currentStage + 1);
    } else {
        portal = null;
    }
}
initializeCoins();

function rebuildPlatforms() {
    // Clear elevated platforms
    staticPlatforms.length = 0;
    
    // Rebuild ground platforms
    for (let i = 0; i < WORLD_WIDTH; i += 100) {
        staticPlatforms.push(new Platform(i, SCREEN_HEIGHT - 50, 100, 50));
    }
    
    // Add platforms based on current layout
    const layoutIndex = currentStage % platformLayouts.length;
    const layout = platformLayouts[layoutIndex];
    
    layout.forEach(plat => {
        staticPlatforms.push(new Platform(plat[0], plat[1], plat[2], plat[3]));
    });
}

rebuildPlatforms();

function spawnEnemy() {
    const enemyTypes = ['lion', 'hyena', 'baboon', 'tiger'];
    const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
    // Spawn from left or right side of screen
    const spawnFromLeft = Math.random() < 0.5;
    const spawnX = spawnFromLeft ? camera.x - 60 : camera.x + SCREEN_WIDTH + 10;
    const spawnY = SCREEN_HEIGHT - 100; // Start near ground
    
    enemies.push(new Enemy(randomType, spawnX, spawnY));
    console.log('Enemy spawned:', randomType, 'at x:', spawnX);
}

// Create background layers with PNG support
const backgroundFar = new Background('background_far.png', 0.1, true);
const backgroundMiddle = new Background('background_middle.png', 0.3, false);
const backgroundNear = new Background('background_near.png', 0.5, false);

// Load player sprite from chala.png (360x100, 6 frames of 60x100 each)
const playerSprite = {
    image: new Image(),
    loaded: false
};
playerSprite.image.onload = () => { playerSprite.loaded = true; };
playerSprite.image.onerror = () => { playerSprite.loaded = false; };
playerSprite.image.src = 'chala.png';

// Initialize clouds for first stage
generateStageClouds();

let score = 0;
let gameStarted = false;
let continueButtonBounds = null;

// Start game function (called when Play Now button is clicked)
function startGame() {
    document.getElementById('instructionsModal').classList.add('hidden');
    gameStarted = true;
    resizeCanvas();
}
window.startGame = startGame;

// Try to load saved progress
function loadSavedProgress() {
    try {
        const saved = localStorage.getItem('geezGameProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            const savedDate = new Date(progress.timestamp);
            const message = '📂 Found saved progress!\n\n' +
                'Score: ' + progress.score + '\n' +
                'Batch: ' + (progress.currentBatch + 1) + '\n' +
                'Saved: ' + savedDate.toLocaleString() + '\n\n' +
                'Load this progress?';
            
            if (confirm(message)) {
                currentBatch = progress.currentBatch;
                stageOffset = progress.stageOffset || 0;
                currentStage = progress.currentStage || 0;
                score = progress.score;
                totalLettersCollected = progress.totalLettersCollected || 0;
                
                rebuildPlatforms();
                initializeCoins();
                generateStageClouds();
                
                alert('✅ Progress loaded successfully!');
            }
        }
    } catch (e) {
        console.error('Could not load progress:', e);
    }
}

// Check for saved progress after a short delay
setTimeout(() => {
    if (!gameStarted && score === 0) {
        loadSavedProgress();
    }
}, 1000);

function handleContinueClick() {
    showCongratulations = false;
    
    // Check if we've completed all letters
    const nextBatchStart = (currentBatch + 1) * lettersPerBatch;
    if (nextBatchStart >= geezCharacters.length) {
        // Restart from beginning with a random letter family
        currentBatch = Math.floor(getRandomLetterFamilyStage() / lettersPerBatch);
        stageOffset = getRandomLetterFamilyStage() % lettersPerBatch;
        score = 0;
    } else {
        // Continue to next batch
        currentBatch++;
        stageOffset = 0;
    }
    
    currentStage = Math.floor(Math.random() * stageTemplates.length);
    totalLettersCollected = 0;
    balloons = [];
    enemies = [];
    stageTimer = 0;
    lastEnemySpawn = 0;
    player.x = 100;
    player.y = 300;
    camera.x = 0;
    rebuildPlatforms();
    initializeCoins();
    generateStageClouds();
    window.gameCompletionButtons = null;
}

function spawnMovingPlatform() {
    const platformWidth = Math.random() * 100 + 50;
    const x = camera.x + Math.random() * SCREEN_WIDTH;
    const newPlatform = new MovingPlatform(x, -20, platformWidth, 20, 2, 0);
    movingPlatforms.push(newPlatform);
}

function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw stage background color
    const stage = stages[currentStage];
    const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
    gradient.addColorStop(0, stage.bgColor);
    gradient.addColorStop(1, adjustBrightness(stage.bgColor, -30));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Update camera
    camera.update(player);

    // Update and draw backgrounds with parallax
    backgroundFar.update(camera.x);
    backgroundMiddle.update(camera.x);
    backgroundNear.update(camera.x);

    backgroundFar.draw();
    backgroundMiddle.draw();
    backgroundNear.draw();

    // Update player
    player.update();

    // Update and draw static platforms
    staticPlatforms.forEach(platform => platform.draw(camera));

    // Update and draw moving platforms
    for (let i = movingPlatforms.length - 1; i >= 0; i--) {
        const platform = movingPlatforms[i];
        platform.update();
        platform.draw(camera);
        if (platform.isOffScreen()) {
            movingPlatforms.splice(i, 1);
        }
    }

    // Update and draw coins
    let allCoinsCollected = true;
    coins.forEach(coin => {
        coin.update();
        coin.draw(camera);
        if (!coin.collected) {
            allCoinsCollected = false;
            if (coin.checkCollision(player)) {
                coin.playCollectSound();
                coin.speakPronunciation();
                // Create balloon with pronunciation
                balloons.push(new Balloon(coin.x + coin.width / 2, coin.y, coin.pronunciation));
                score++;
                totalLettersCollected++;
            }
        }
    });
    
    // Activate portal when all coins collected
    if (portal && allCoinsCollected) {
        portal.active = true;
        portal.update();
        portal.draw(camera);
        
        // Check portal collision
        if (portal.checkCollision(player)) {
            // Reset enemy timer for new stage
            stageTimer = 0;
            lastEnemySpawn = 0;
            enemies = [];
            
            // For early stages, progress linearly
            if (currentStage < 2) {
                currentStage++;
                stageOffset = currentStage * coinsPerStage;
            } else {
                // For later stages, jump to random letter family
                const newFamilyIndex = portal.targetStage;
                currentBatch = Math.floor(newFamilyIndex / lettersPerBatch);
                stageOffset = newFamilyIndex % lettersPerBatch;
                currentStage = Math.floor(Math.random() * stageTemplates.length);
            }
            
            rebuildPlatforms();
            initializeCoins();
            generateStageClouds();
            balloons = [];
            player.x = 100;
            player.y = 300;
            camera.x = 0;
        }
    }
    
    // Update and draw balloons
    for (let i = balloons.length - 1; i >= 0; i--) {
        balloons[i].update();
        balloons[i].draw(camera);
        if (balloons[i].isDead()) {
            balloons.splice(i, 1);
        }
    }
    
    // Update stage timer (only if not in game over state)
    if (!gameOver && !showCongratulations && !window.gameCompletionButtons) {
        stageTimer++;
        
        // After 30 seconds (1800 frames at 60fps), start spawning enemies
        if (stageTimer >= 1800) {
            // Spawn enemy every 15 seconds (900 frames)
            if (stageTimer - lastEnemySpawn >= 900) {
                spawnEnemy();
                lastEnemySpawn = stageTimer;
            }
        }
    }
    
    // Update and draw enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update(player);
        enemy.draw(camera);
        
        // Check collision with player
        if (enemy.checkCollision(player)) {
            gameOver = true;
            gameOverReason = 'Caught by ' + enemy.type + '!';
        }
        
        // Remove enemies that are too far off screen
        if (enemy.x < camera.x - 200 || enemy.x > camera.x + SCREEN_WIDTH + 200) {
            enemies.splice(i, 1);
        }
    }
    
    // Check for batch completion (only when no portal or after using last stage's portal)
    if (allCoinsCollected && !showCongratulations && !portal) {
        // Check if we completed 35 letters (5 stages)
        if (totalLettersCollected >= lettersPerBatch) {
            // Check if there are more letters to learn
            const nextBatchStart = (currentBatch + 1) * lettersPerBatch;
            if (nextBatchStart < geezCharacters.length) {
                showCongratulations = true;
            }
        }
    }

    // Draw player
    player.draw(camera);

    // Draw UI with child-friendly colors
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.font = 'bold 28px Arial';
    ctx.strokeText(`⭐ Score: ${score}`, 10, 35);
    ctx.fillText(`⭐ Score: ${score}`, 10, 35);
    
    ctx.font = 'bold 22px Arial';
    ctx.strokeText(`Stage: ${stage.name}`, 10, 65);
    ctx.fillText(`Stage: ${stage.name}`, 10, 65);
    
    // Draw controls hint
    if (!gameStarted && score === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(SCREEN_WIDTH / 2 - 180, SCREEN_HEIGHT / 2 - 80, 360, 140);
        
        ctx.strokeStyle = '#4A148C';
        ctx.lineWidth = 4;
        ctx.strokeRect(SCREEN_WIDTH / 2 - 180, SCREEN_HEIGHT / 2 - 80, 360, 140);
        
        ctx.fillStyle = '#1976D2';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎮 Learn Ge\'ez Alphabet! 🎮', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 40);
        
        ctx.fillStyle = '#4A148C';
        ctx.font = '18px Arial';
        ctx.fillText('← → or A D to Move', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        ctx.fillText('Space or ↑ to Jump', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 30);
        
        ctx.textAlign = 'left';
        
        if (keys['ArrowLeft'] || keys['ArrowRight'] || keys['a'] || keys['d'] || keys['A'] || keys['D']) {
            gameStarted = true;
        }
    }
    
    // Batch completion message with continue button
    if (showCongratulations) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
        ctx.fillRect(SCREEN_WIDTH / 2 - 220, SCREEN_HEIGHT / 2 - 120, 440, 240);
        
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 5;
        ctx.strokeRect(SCREEN_WIDTH / 2 - 220, SCREEN_HEIGHT / 2 - 120, 440, 240);
        
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 Amazing Work! 🎉', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 70);
        
        ctx.fillStyle = '#1976D2';
        ctx.font = 'bold 22px Arial';
        ctx.fillText(`You learned ${lettersPerBatch} Ge'ez letters!`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 30);
        
        const remaining = geezCharacters.length - (currentBatch + 1) * lettersPerBatch;
        ctx.font = '18px Arial';
        ctx.fillStyle = '#666';
        ctx.fillText(`${remaining > 0 ? remaining : 0} more letters to go!`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 5);
        
        // Draw continue button
        const buttonX = SCREEN_WIDTH / 2 - 80;
        const buttonY = SCREEN_HEIGHT / 2 + 40;
        const buttonW = 160;
        const buttonH = 50;
        
        continueButtonBounds = { x: buttonX, y: buttonY, width: buttonW, height: buttonH };
        
        // Button background with gradient
        const gradient = ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonH);
        gradient.addColorStop(0, '#4CAF50');
        gradient.addColorStop(1, '#45a049');
        ctx.fillStyle = gradient;
        ctx.fillRect(buttonX, buttonY, buttonW, buttonH);
        
        // Button border
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 3;
        ctx.strokeRect(buttonX, buttonY, buttonW, buttonH);
        
        // Button text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Continue ➡️', SCREEN_WIDTH / 2, buttonY + 32);
        
        ctx.textAlign = 'left';
    }
    
    // Game completion options when all letters in current batch are learned
    if (allCoinsCollected && !showCongratulations && (currentBatch + 1) * lettersPerBatch >= geezCharacters.length) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
        ctx.fillRect(SCREEN_WIDTH / 2 - 250, SCREEN_HEIGHT / 2 - 140, 500, 280);
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 5;
        ctx.strokeRect(SCREEN_WIDTH / 2 - 250, SCREEN_HEIGHT / 2 - 140, 500, 280);
        
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏆 Great Progress! 🏆', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 80);
        
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 22px Arial';
        ctx.fillText(`You completed ${score} letters!`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 35);
        
        // Draw three buttons: Continue, Save Progress, Exit
        const buttonWidth = 140;
        const buttonHeight = 50;
        const buttonY = SCREEN_HEIGHT / 2 + 20;
        const spacing = 20;
        
        // Continue button
        const continueX = SCREEN_WIDTH / 2 - buttonWidth - spacing;
        const gradient1 = ctx.createLinearGradient(continueX, buttonY, continueX, buttonY + buttonHeight);
        gradient1.addColorStop(0, '#4CAF50');
        gradient1.addColorStop(1, '#45a049');
        ctx.fillStyle = gradient1;
        ctx.fillRect(continueX, buttonY, buttonWidth, buttonHeight);
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 3;
        ctx.strokeRect(continueX, buttonY, buttonWidth, buttonHeight);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px Arial';
        const continueText = (currentBatch + 1) * lettersPerBatch >= geezCharacters.length ? 'Restart 🔄' : 'Continue ▶';
        ctx.fillText(continueText, continueX + buttonWidth / 2, buttonY + 32);
        
        // Save Progress button
        const saveX = SCREEN_WIDTH / 2 - buttonWidth / 2;
        const gradient2 = ctx.createLinearGradient(saveX, buttonY, saveX, buttonY + buttonHeight);
        gradient2.addColorStop(0, '#2196F3');
        gradient2.addColorStop(1, '#1976D2');
        ctx.fillStyle = gradient2;
        ctx.fillRect(saveX, buttonY, buttonWidth, buttonHeight);
        ctx.strokeStyle = '#0D47A1';
        ctx.lineWidth = 3;
        ctx.strokeRect(saveX, buttonY, buttonWidth, buttonHeight);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Save 💾', saveX + buttonWidth / 2, buttonY + 32);
        
        // Exit button
        const exitX = SCREEN_WIDTH / 2 + spacing;
        const gradient3 = ctx.createLinearGradient(exitX, buttonY, exitX, buttonY + buttonHeight);
        gradient3.addColorStop(0, '#f44336');
        gradient3.addColorStop(1, '#d32f2f');
        ctx.fillStyle = gradient3;
        ctx.fillRect(exitX, buttonY, buttonWidth, buttonHeight);
        ctx.strokeStyle = '#B71C1C';
        ctx.lineWidth = 3;
        ctx.strokeRect(exitX, buttonY, buttonWidth, buttonHeight);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Exit ✖', exitX + buttonWidth / 2, buttonY + 32);
        
        // Store button bounds for click detection
        window.gameCompletionButtons = {
            continue: { x: continueX, y: buttonY, width: buttonWidth, height: buttonHeight },
            save: { x: saveX, y: buttonY, width: buttonWidth, height: buttonHeight },
            exit: { x: exitX, y: buttonY, width: buttonWidth, height: buttonHeight }
        };
        
        ctx.textAlign = 'left';
    } else {
        window.gameCompletionButtons = null;
    }
    
    // Game Over screen
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        
        ctx.fillStyle = 'rgba(255, 0, 0, 0.95)';
        ctx.fillRect(SCREEN_WIDTH / 2 - 250, SCREEN_HEIGHT / 2 - 150, 500, 300);
        
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 5;
        ctx.strokeRect(SCREEN_WIDTH / 2 - 250, SCREEN_HEIGHT / 2 - 150, 500, 300);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER!', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 80);
        
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(gameOverReason, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 30);
        
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Final Score: ' + score, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 10);
        
        // Restart button
        const buttonX = SCREEN_WIDTH / 2 - 100;
        const buttonY = SCREEN_HEIGHT / 2 + 60;
        const buttonW = 200;
        const buttonH = 50;
        
        const gradient = ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonH);
        gradient.addColorStop(0, '#4CAF50');
        gradient.addColorStop(1, '#45a049');
        ctx.fillStyle = gradient;
        ctx.fillRect(buttonX, buttonY, buttonW, buttonH);
        
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 3;
        ctx.strokeRect(buttonX, buttonY, buttonW, buttonH);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Try Again', SCREEN_WIDTH / 2, buttonY + 33);
        
        window.gameOverButton = { x: buttonX, y: buttonY, width: buttonW, height: buttonH };
        
        ctx.textAlign = 'left';
    } else {
        window.gameOverButton = null;
    }

    // Draw virtual controls for mobile
    drawVirtualControls();

    // Request next frame
    requestAnimationFrame(gameLoop);
}

function adjustBrightness(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

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
    
    // Left button
    ctx.fillStyle = virtualControls.left.active ? '#4CAF50' : '#666';
    ctx.fillRect(virtualControls.left.x, virtualControls.left.y, virtualControls.left.width, virtualControls.left.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('◄', virtualControls.left.x + 40, virtualControls.left.y + 40);
    
    // Right button
    ctx.fillStyle = virtualControls.right.active ? '#4CAF50' : '#666';
    ctx.fillRect(virtualControls.right.x, virtualControls.right.y, virtualControls.right.width, virtualControls.right.height);
    ctx.fillStyle = 'white';
    ctx.fillText('►', virtualControls.right.x + 40, virtualControls.right.y + 40);
    
    // Jump button
    ctx.fillStyle = virtualControls.jump.active ? '#FF9800' : '#666';
    ctx.beginPath();
    ctx.arc(virtualControls.jump.x + 50, virtualControls.jump.y + 50, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('JUMP', virtualControls.jump.x + 50, virtualControls.jump.y + 50);
    
    ctx.restore();
}

// Touch event handlers
function handleTouchStart(e) {
    e.preventDefault();
    
    // First check if touching menu buttons
    if (e.touches.length > 0) {
        const handled = handleMenuButtonTouch(e.touches[0].clientX, e.touches[0].clientY);
        if (handled) return;
    }
    
    for (let touch of e.touches) {
        const rect = canvas.getBoundingClientRect();
        const touchX = (touch.clientX - rect.left) * (SCREEN_WIDTH / rect.width);
        const touchY = (touch.clientY - rect.top) * (SCREEN_HEIGHT / rect.height);
        
        // Check virtual buttons
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
    // Reset all
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

// Keyboard event listeners
window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
    
    // Jump on Space or Up Arrow
    if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        player.jump();
    }
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Optional: Keep mouse controls for jumping
canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Check if clicking continue button
    if (showCongratulations && continueButtonBounds) {
        if (mouseX >= continueButtonBounds.x && 
            mouseX <= continueButtonBounds.x + continueButtonBounds.width &&
            mouseY >= continueButtonBounds.y && 
            mouseY <= continueButtonBounds.y + continueButtonBounds.height) {
            handleContinueClick();
            return;
        }
    }
    
    // Check game completion buttons
    if (window.gameCompletionButtons) {
        const buttons = window.gameCompletionButtons;
        
        // Continue button
        if (mouseX >= buttons.continue.x && 
            mouseX <= buttons.continue.x + buttons.continue.width &&
            mouseY >= buttons.continue.y && 
            mouseY <= buttons.continue.y + buttons.continue.height) {
            handleContinueClick();
            return;
        }
        
        // Save Progress button
        if (mouseX >= buttons.save.x && 
            mouseX <= buttons.save.x + buttons.save.width &&
            mouseY >= buttons.save.y && 
            mouseY <= buttons.save.y + buttons.save.height) {
            handleSaveProgress();
            return;
        }
        
        // Exit button
        if (mouseX >= buttons.exit.x && 
            mouseX <= buttons.exit.x + buttons.exit.width &&
            mouseY >= buttons.exit.y && 
            mouseY <= buttons.exit.y + buttons.exit.height) {
            handleExit();
            return;
        }
    }
    
    // Check game over restart button
    if (window.gameOverButton) {
        if (mouseX >= window.gameOverButton.x && 
            mouseX <= window.gameOverButton.x + window.gameOverButton.width &&
            mouseY >= window.gameOverButton.y && 
            mouseY <= window.gameOverButton.y + window.gameOverButton.height) {
            // Restart game
            gameOver = false;
            gameOverReason = '';
            enemies = [];
            stageTimer = 0;
            lastEnemySpawn = 0;
            score = 0;
            totalLettersCollected = 0;
            currentBatch = Math.floor(getRandomLetterFamilyStage() / lettersPerBatch);
            stageOffset = getRandomLetterFamilyStage() % lettersPerBatch;
            currentStage = Math.floor(Math.random() * stageTemplates.length);
            balloons = [];
            player.x = 100;
            player.y = 300;
            camera.x = 0;
            rebuildPlatforms();
            initializeCoins();
            generateStageClouds();
            gameStarted = false;
            return;
        }
    }
    
    // Normal jump
    if (!showCongratulations && !window.gameCompletionButtons) {
        player.jump();
    }
});

// Touch handler for menu buttons
function handleMenuButtonTouch(touchX, touchY) {
    const rect = canvas.getBoundingClientRect();
    const x = (touchX - rect.left) * (SCREEN_WIDTH / rect.width);
    const y = (touchY - rect.top) * (SCREEN_HEIGHT / rect.height);
    
    // Check if clicking continue button
    if (showCongratulations && continueButtonBounds) {
        if (x >= continueButtonBounds.x && 
            x <= continueButtonBounds.x + continueButtonBounds.width &&
            y >= continueButtonBounds.y && 
            y <= continueButtonBounds.y + continueButtonBounds.height) {
            handleContinueClick();
            return true;
        }
    }
    
    // Check game completion buttons
    if (window.gameCompletionButtons) {
        const buttons = window.gameCompletionButtons;
        
        if (x >= buttons.continue.x && 
            x <= buttons.continue.x + buttons.continue.width &&
            y >= buttons.continue.y && 
            y <= buttons.continue.y + buttons.continue.height) {
            handleContinueClick();
            return true;
        }
        
        if (x >= buttons.save.x && 
            x <= buttons.save.x + buttons.save.width &&
            y >= buttons.save.y && 
            y <= buttons.save.y + buttons.save.height) {
            handleSaveProgress();
            return true;
        }
        
        if (x >= buttons.exit.x && 
            x <= buttons.exit.x + buttons.exit.width &&
            y >= buttons.exit.y && 
            y <= buttons.exit.y + buttons.exit.height) {
            handleExit();
            return true;
        }
    }
    
    // Check game over restart button
    if (window.gameOverButton) {
        if (x >= window.gameOverButton.x && 
            x <= window.gameOverButton.x + window.gameOverButton.width &&
            y >= window.gameOverButton.y && 
            y <= window.gameOverButton.y + window.gameOverButton.height) {
            // Restart game
            gameOver = false;
            gameOverReason = '';
            enemies = [];
            stageTimer = 0;
            lastEnemySpawn = 0;
            score = 0;
            totalLettersCollected = 0;
            currentBatch = Math.floor(getRandomLetterFamilyStage() / lettersPerBatch);
            stageOffset = getRandomLetterFamilyStage() % lettersPerBatch;
            currentStage = Math.floor(Math.random() * stageTemplates.length);
            balloons = [];
            player.x = 100;
            player.y = 300;
            camera.x = 0;
            rebuildPlatforms();
            initializeCoins();
            generateStageClouds();
            gameStarted = false;
            return true;
        }
    }
    
    return false;
}

function handleSaveProgress() {
    // Save progress to localStorage
    const progress = {
        currentBatch: currentBatch,
        stageOffset: stageOffset,
        currentStage: currentStage,
        score: score,
        totalLettersCollected: totalLettersCollected,
        timestamp: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('geezGameProgress', JSON.stringify(progress));
        
        // Visual feedback
        const savedMessage = '✅ Progress Saved!\n\n' +
            'Batch: ' + (currentBatch + 1) + '\n' +
            'Total Score: ' + score + '\n' +
            'Stage: ' + stages[currentStage].name + '\n' +
            'Saved at: ' + new Date().toLocaleTimeString();
        
        alert(savedMessage);
    } catch (e) {
        alert('❌ Could not save progress: ' + e.message);
    }
}

function handleExit() {
    const message = 'Exit and start fresh?\n\n' +
        'Current score: ' + score + '\n\n' +
        'Make sure to save your progress first if you want to continue later!';
    
    if (confirm(message)) {
        // Reset game to initial state
        currentBatch = Math.floor(getRandomLetterFamilyStage() / lettersPerBatch);
        stageOffset = getRandomLetterFamilyStage() % lettersPerBatch;
        currentStage = Math.floor(Math.random() * stageTemplates.length);
        score = 0;
        totalLettersCollected = 0;
        showCongratulations = false;
        balloons = [];
        player.x = 100;
        player.y = 300;
        camera.x = 0;
        rebuildPlatforms();
        initializeCoins();
        generateStageClouds();
        gameStarted = false;
        window.gameCompletionButtons = null;
    }
}

// Load images before starting the game loop
let imagesLoaded = 0;
const totalImages = 3;

// Replace the image loading code at the end of your file with this:
Promise.all([
    loadImage(backgroundFar.image),
    loadImage(backgroundMiddle.image),
    loadImage(backgroundNear.image)
]).then(() => {
    gameLoop();
}).catch(error => {
    console.error("Error loading images:", error);
});

function loadImage(img) {
    return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });
}