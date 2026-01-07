const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Immediate console check
console.log('=== GAME.JS IS LOADING ===');
console.log('Canvas element:', canvas);
console.log('Canvas context:', ctx);

// ==================== CONSTANTS ====================
const CONSTANTS = {
    GRAVITY: 0.6,
    JUMP_STRENGTH: -14,
    PLAYER_SPEED: 5,
    BASE_TILE_WIDTH: 40,
    BASE_TILE_HEIGHT: 20,
    PLAYER_WIDTH: 40,
    PLAYER_HEIGHT: 55,
    COIN_RADIUS: 28,
    COIN_FLOAT_HEIGHT: 30,
    COIN_COLLECTION_DISTANCE: 30,
    COIN_Z_TOLERANCE: 20,
    TREE_SIZE: 50,
    TREE_HEIGHT: 100,
    OBSTACLE_PUSHBACK: 5,
    PLATFORM_COLLISION_TOLERANCE: 3,
    GROUND_TILE_SIZE: 200,
    MAX_LOGS: 100
};

// ==================== LOGGING SYSTEM (Reduced) ====================
const gameLogs = [];
const DEBUG_MODE = false; // Set to true for debugging

function log(message, data = null) {
    if (!DEBUG_MODE) return;

    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, data };

    gameLogs.push(logEntry);

    if (data) {
        console.log(`[${timestamp}] ${message}`, data);
    } else {
        console.log(`[${timestamp}] ${message}`);
    }

    // Keep only last 100 logs
    if (gameLogs.length > CONSTANTS.MAX_LOGS) {
        gameLogs.shift();
    }
}
// ==================== END LOGGING SYSTEM ====================

// Responsive screen dimensions
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 2000;

// Set canvas to fill screen
function resizeCanvas() {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Isometric coordinate conversion (uses camera zoom)
function toIso(x, y, zoom = 1.0) {
    const tileW = CONSTANTS.BASE_TILE_WIDTH * zoom;
    const tileH = CONSTANTS.BASE_TILE_HEIGHT * zoom;
    return {
        x: (x - y) * (tileW / 2),
        y: (x + y) * (tileH / 2)
    };
}

function toCart(isoX, isoY, zoom = 1.0) {
    const tileW = CONSTANTS.BASE_TILE_WIDTH * zoom;
    const tileH = CONSTANTS.BASE_TILE_HEIGHT * zoom;
    return {
        x: (isoX / (tileW / 2) + isoY / (tileH / 2)) / 2,
        y: (isoY / (tileH / 2) - isoX / (tileW / 2)) / 2
    };
}

// Geez alphabet dictionary
const GeezAlphabetDict = {
    'ሀ': 'he', 'ሁ': 'hu', 'ሂ': 'hi', 'ሃ': 'ha', 'ሄ': 'hey', 'ህ': 'hih', 'ሆ': 'ho',
    'ለ': 'le', 'ሉ': 'lu', 'ሊ': 'li', 'ላ': 'la', 'ሌ': 'ley', 'ል': 'lih', 'ሎ': 'lo',
    'ሐ': 'he', 'ሑ': 'hu', 'ሒ': 'hi', 'ሓ': 'ha', 'ሔ': 'hey', 'ሕ': 'hih', 'ሖ': 'ho',
    'መ': 'me', 'ሙ': 'mu', 'ሚ': 'mi', 'ማ': 'ma', 'ሜ': 'mey', 'ም': 'mih', 'ሞ': 'mo',
    'ሠ': 'se', 'ሡ': 'su', 'ሢ': 'si', 'ሣ': 'sa', 'ሤ': 'sey', 'ሥ': 'sih', 'ሦ': 'so',
    'ረ': 're', 'ሩ': 'ru', 'ሪ': 'ri', 'ራ': 'ra', 'ሬ': 'rey', 'ር': 'rih', 'ሮ': 'ro',
    'ሰ': 'se', 'ሱ': 'su', 'ሲ': 'si', 'ሳ': 'sa', 'ሴ': 'sey', 'ስ': 'sih', 'ሶ': 'so',
    'ሸ': 'she', 'ሹ': 'shu', 'ሺ': 'shi', 'ሻ': 'sha', 'ሼ': 'shey', 'ሽ': 'shih', 'ሾ': 'sho',
    'ቀ': 'q\'e', 'ቁ': 'q\'u', 'ቂ': 'q\'i', 'ቃ': 'q\'a', 'ቄ': 'q\'ey', 'ቅ': 'q\'ih', 'ቆ': 'q\'o',
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
    'ጠ': 't\'e', 'ጡ': 't\'u', 'ጢ': 't\'i', 'ጣ': 't\'a', 'ጤ': 't\'ey', 'ጥ': 't\'ih', 'ጦ': 't\'o',
    'ጨ': 'ch\'e', 'ጩ': 'ch\'u', 'ጪ': 'ch\'i', 'ጫ': 'ch\'a', 'ጬ': 'ch\'ey', 'ጭ': 'ch\'ih', 'ጮ': 'ch\'o',
    'ጰ': 'p\'e', 'ጱ': 'p\'u', 'ጲ': 'p\'i', 'ጳ': 'p\'a', 'ጴ': 'p\'ey', 'ጵ': 'p\'ih', 'ጶ': 'p\'o',
    'ጸ': 'ts\'e', 'ጹ': 'ts\'u', 'ጺ': 'ts\'i', 'ጻ': 'ts\'a', 'ጼ': 'ts\'ey', 'ጽ': 'ts\'ih', 'ጾ': 'ts\'o',
    'ፀ': 'ts\'e', 'ፁ': 'ts\'u', 'ፂ': 'ts\'i', 'ፃ': 'ts\'a', 'ፄ': 'ts\'ey', 'ፅ': 'ts\'ih', 'ፆ': 'ts\'o',
    'ፈ': 'fe', 'ፉ': 'fu', 'ፊ': 'fi', 'ፋ': 'fa', 'ፌ': 'fey', 'ፍ': 'fih', 'ፎ': 'fo',
    'ፐ': 'pe', 'ፑ': 'pu', 'ፒ': 'pi', 'ፓ': 'pa', 'ፔ': 'pey', 'ፕ': 'pih', 'ፖ': 'po'
};

// Build unique Geez letters from centralized translations
function detectTranslationKey() {
    try {
        const keys = Object.keys(translations || {});
        if (keys.length) {
            const sample = translations[keys[0]];
            for (const k of ['amharic','tigrinya','oromo','spanish']) {
                if (sample && sample[k]) return k;
            }
        }
    } catch (e) {}
    return 'amharic';
}

const translationKey = detectTranslationKey();

function buildGeezCharactersFromTranslations(translationsObj, key) {
    const set = new Set();
    try {
        const entries = Object.values(translationsObj || {});
        entries.forEach(entry => {
            const am = entry && entry[key];
            if (typeof am === 'string') {
                for (const ch of am) {
                    if (/\s/.test(ch)) continue;
                    const cp = ch.codePointAt(0);
                    if (cp >= 0x1200 && cp <= 0x137F) {
                        set.add(ch);
                    }
                }
            }
        });
    } catch (e) {
        console.warn('Could not derive letters from translations:', e);
    }
    return Array.from(set).sort((a, b) => a.codePointAt(0) - b.codePointAt(0));
}

let geezCharacters = buildGeezCharactersFromTranslations(typeof translations !== 'undefined' ? translations : {}, translationKey);
if (!geezCharacters || geezCharacters.length === 0) {
    geezCharacters = Object.keys(GeezAlphabetDict);
}

// Game variables
let score = 0;
let gameStarted = false;
let gamePaused = false;
let currentLevel = 0;
let worldsData = null;
let animationFrameId = null;
let sharedAudioContext = null;
const keys = {};

// Camera for isometric view
class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1.0;
        this.smoothing = 0.15; // Smooth camera follow
    }

    update(target) {
        // Center camera on target in isometric space with smooth following
        const iso = toIso(target.x, target.y, this.zoom);
        const targetX = iso.x - SCREEN_WIDTH / 2;
        const targetY = iso.y - SCREEN_HEIGHT / 2 + target.z;

        // Smooth camera movement (lerp)
        this.x += (targetX - this.x) * this.smoothing;
        this.y += (targetY - this.y) * this.smoothing;

        // Clamp camera to world bounds (with padding)
        const worldIso = toIso(WORLD_WIDTH, WORLD_HEIGHT, this.zoom);
        const padding = 200;
        this.x = Math.max(-padding, Math.min(worldIso.x - SCREEN_WIDTH + padding, this.x));
        this.y = Math.max(-padding, Math.min(worldIso.y - SCREEN_HEIGHT + padding, this.y));
    }

    setZoom(zoomLevel) {
        this.zoom = Math.max(0.5, Math.min(2.0, zoomLevel));
    }

    getZoom() {
        return this.zoom;
    }
}

// Player class with isometric movement
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = 0; // Height above ground
        this.width = CONSTANTS.PLAYER_WIDTH;
        this.height = CONSTANTS.PLAYER_HEIGHT;
        this.velocityZ = 0;
        this.isJumping = false;
        this.direction = 0; // 0=SE, 1=NE, 2=NW, 3=SW
        this.currentPlatform = null;
    }

    update() {
        if (gamePaused) return;

        // Isometric movement controls
        let dx = 0;
        let dy = 0;

        // WASD or Arrow keys for 4-directional isometric movement
        if (keys['ArrowUp'] || keys['w'] || keys['W']) {
            dx -= 1; // Move NW
            dy -= 1;
            this.direction = 2;
        }
        if (keys['ArrowDown'] || keys['s'] || keys['S']) {
            dx += 1; // Move SE
            dy += 1;
            this.direction = 0;
        }
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
            dx -= 1; // Move SW
            dy += 1;
            this.direction = 3;
        }
        if (keys['ArrowRight'] || keys['d'] || keys['D']) {
            dx += 1; // Move NE
            dy -= 1;
            this.direction = 1;
        }

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }

        this.x += dx * CONSTANTS.PLAYER_SPEED;
        this.y += dy * CONSTANTS.PLAYER_SPEED;

        // Keep within world bounds
        this.x = Math.max(0, Math.min(WORLD_WIDTH, this.x));
        this.y = Math.max(0, Math.min(WORLD_HEIGHT, this.y));

        // Apply gravity
        this.velocityZ += CONSTANTS.GRAVITY;
        this.z += this.velocityZ;

        // Platform collision - check elevated platforms first
        this.currentPlatform = null;
        let onPlatform = false;

        platforms.forEach(platform => {
            // Skip ground platforms (height === 0) for collision check
            if (platform.height > 0 && platform.checkCollision(this)) {
                const platformTop = platform.height;
                // Landing on platform from above
                if (this.velocityZ >= 0 && this.z <= platformTop + CONSTANTS.PLATFORM_COLLISION_TOLERANCE && this.z >= platformTop - 10) {
                    this.z = platformTop;
                    this.velocityZ = 0;
                    this.isJumping = false;
                    this.currentPlatform = platform;
                    onPlatform = true;

                    // Move with platform
                    if (platform.moving) {
                        this.x += platform.moveSpeed * platform.moveDir;
                    }
                }
            }
        });

        // Ground collision - only if not on an elevated platform
        if (!onPlatform && this.z >= 0) {
            this.z = 0;
            this.velocityZ = 0;
            this.isJumping = false;
            this.currentPlatform = null;
        }
    }

    jump() {
        if (!this.isJumping && (this.z === 0 || this.currentPlatform)) {
            this.velocityZ = CONSTANTS.JUMP_STRENGTH;
            this.isJumping = true;
            this.currentPlatform = null;
        }
    }

    isOnPlatform() {
        return this.currentPlatform !== null;
    }

    draw(camera) {
        const iso = toIso(this.x, this.y, camera.zoom);
        const screenX = iso.x - camera.x;
        const screenY = iso.y - camera.y - this.z;

        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(screenX, iso.y - camera.y, this.width / 2 + 5, this.width / 4 + 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw player body (brighter color)
        ctx.fillStyle = '#FF4444';
        ctx.fillRect(screenX - this.width / 2, screenY - this.height, this.width, this.height);

        // Draw border (thicker)
        ctx.strokeStyle = '#CC0000';
        ctx.lineWidth = 3;
        ctx.strokeRect(screenX - this.width / 2, screenY - this.height, this.width, this.height);

        // Draw face
        ctx.fillStyle = 'white';
        ctx.fillRect(screenX - 12, screenY - this.height + 12, 8, 8);
        ctx.fillRect(screenX + 4, screenY - this.height + 12, 8, 8);

        ctx.fillStyle = 'black';
        ctx.fillRect(screenX - 10, screenY - this.height + 14, 4, 4);
        ctx.fillRect(screenX + 6, screenY - this.height + 14, 4, 4);

        // Smile
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(screenX, screenY - this.height + 35, 10, 0, Math.PI);
        ctx.stroke();
    }
}

// Platform class for isometric platforms
class Platform {
    constructor(x, y, width, depth, height, moving = false, moveSpeed = 2, moveRange = 100) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.depth = depth;
        this.height = height;
        this.moving = moving;
        this.moveDir = 1;
        this.moveSpeed = moveSpeed;
        this.startX = x;
        this.startY = y;
        this.moveRange = moveRange;
    }

    update() {
        if (gamePaused) return;

        if (this.moving) {
            this.x += this.moveSpeed * this.moveDir;
            if (Math.abs(this.x - this.startX) > this.moveRange) {
                this.moveDir *= -1;
            }
        }
    }

    checkCollision(player) {
        return player.x > this.x && player.x < this.x + this.width &&
               player.y > this.y && player.y < this.y + this.depth;
    }

    draw(camera) {
        // For large ground platforms, draw as tiled grid
        if (this.height === 0 && this.width > 200 && this.depth > 200) {
            this.drawTiledGround(camera);
            return;
        }

        // Draw isometric platform (for elevated platforms)
        const iso1 = toIso(this.x, this.y, camera.zoom);
        const iso2 = toIso(this.x + this.width, this.y, camera.zoom);
        const iso3 = toIso(this.x + this.width, this.y + this.depth, camera.zoom);
        const iso4 = toIso(this.x, this.y + this.depth, camera.zoom);

        const z = -this.height;

        // Different colors based on moving status (with transparency)
        let topColor, rightColor, leftColor;

        if (this.moving) {
            // Moving platforms - orange/yellow (semi-transparent)
            topColor = 'rgba(255, 167, 38, 0.75)';
            rightColor = 'rgba(245, 124, 0, 0.75)';
            leftColor = 'rgba(251, 140, 0, 0.75)';
        } else {
            // Static elevated platforms - brown (semi-transparent)
            topColor = 'rgba(141, 110, 99, 0.75)';
            rightColor = 'rgba(109, 76, 65, 0.75)';
            leftColor = 'rgba(121, 85, 72, 0.75)';
        }

        // Top face
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(iso1.x - camera.x, iso1.y - camera.y + z);
        ctx.lineTo(iso2.x - camera.x, iso2.y - camera.y + z);
        ctx.lineTo(iso3.x - camera.x, iso3.y - camera.y + z);
        ctx.lineTo(iso4.x - camera.x, iso4.y - camera.y + z);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(27, 94, 32, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Right face
        ctx.fillStyle = rightColor;
        ctx.beginPath();
        ctx.moveTo(iso2.x - camera.x, iso2.y - camera.y + z);
        ctx.lineTo(iso3.x - camera.x, iso3.y - camera.y + z);
        ctx.lineTo(iso3.x - camera.x, iso3.y - camera.y);
        ctx.lineTo(iso2.x - camera.x, iso2.y - camera.y);
        ctx.closePath();
        ctx.fill();

        // Left face
        ctx.fillStyle = leftColor;
        ctx.beginPath();
        ctx.moveTo(iso3.x - camera.x, iso3.y - camera.y + z);
        ctx.lineTo(iso4.x - camera.x, iso4.y - camera.y + z);
        ctx.lineTo(iso4.x - camera.x, iso4.y - camera.y);
        ctx.lineTo(iso3.x - camera.x, iso3.y - camera.y);
        ctx.closePath();
        ctx.fill();
    }

    drawTiledGround(camera) {
        // Draw ground as a grid of tiles for better visual
        const tileSize = 100; // Size of each ground tile
        const tilesX = Math.ceil(this.width / tileSize);
        const tilesY = Math.ceil(this.depth / tileSize);

        for (let ty = 0; ty < tilesY; ty++) {
            for (let tx = 0; tx < tilesX; tx++) {
                const tileX = this.x + tx * tileSize;
                const tileY = this.y + ty * tileSize;
                const tileW = Math.min(tileSize, this.width - tx * tileSize);
                const tileD = Math.min(tileSize, this.depth - ty * tileSize);

                const iso1 = toIso(tileX, tileY, camera.zoom);
                const iso2 = toIso(tileX + tileW, tileY, camera.zoom);
                const iso3 = toIso(tileX + tileW, tileY + tileD, camera.zoom);
                const iso4 = toIso(tileX, tileY + tileD, camera.zoom);

                // Alternate grass colors for checkerboard pattern
                const isLight = (tx + ty) % 2 === 0;
                ctx.fillStyle = isLight ? '#4CAF50' : '#43A047';

                ctx.beginPath();
                ctx.moveTo(iso1.x - camera.x, iso1.y - camera.y);
                ctx.lineTo(iso2.x - camera.x, iso2.y - camera.y);
                ctx.lineTo(iso3.x - camera.x, iso3.y - camera.y);
                ctx.lineTo(iso4.x - camera.x, iso4.y - camera.y);
                ctx.closePath();
                ctx.fill();

                // Draw tile border
                ctx.strokeStyle = '#2E7D32';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

// Tree obstacle
class Tree {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONSTANTS.TREE_SIZE;
        this.depth = CONSTANTS.TREE_SIZE;
        this.height = CONSTANTS.TREE_HEIGHT;
    }

    draw(camera) {
        const iso = toIso(this.x + this.width / 2, this.y + this.depth / 2, camera.zoom);
        const screenX = iso.x - camera.x;
        const screenY = iso.y - camera.y;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY, 30, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Trunk (thicker)
        ctx.fillStyle = '#6D4C41';
        ctx.fillRect(screenX - 10, screenY - 50, 20, 50);
        ctx.strokeStyle = '#4E342E';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX - 10, screenY - 50, 20, 50);

        // Foliage (larger and brighter green)
        ctx.fillStyle = '#66BB6A';
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(screenX, screenY - 75, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(screenX - 20, screenY - 65, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(screenX + 20, screenY - 65, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    blocksMovement(player) {
        return player.x > this.x && player.x < this.x + this.width &&
               player.y > this.y && player.y < this.y + this.depth;
    }
}

// Wall obstacle
class Wall {
    constructor(x, y, width, depth) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.depth = depth;
        this.height = 50;
    }

    draw(camera) {
        const iso1 = toIso(this.x, this.y, camera.zoom);
        const iso2 = toIso(this.x + this.width, this.y, camera.zoom);
        const iso3 = toIso(this.x + this.width, this.y + this.depth, camera.zoom);
        const iso4 = toIso(this.x, this.y + this.depth, camera.zoom);

        // Top face (lighter gray/beige stone)
        ctx.fillStyle = '#BCAAA4';
        ctx.beginPath();
        ctx.moveTo(iso1.x - camera.x, iso1.y - camera.y - this.height);
        ctx.lineTo(iso2.x - camera.x, iso2.y - camera.y - this.height);
        ctx.lineTo(iso3.x - camera.x, iso3.y - camera.y - this.height);
        ctx.lineTo(iso4.x - camera.x, iso4.y - camera.y - this.height);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Right face (darker)
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath();
        ctx.moveTo(iso2.x - camera.x, iso2.y - camera.y - this.height);
        ctx.lineTo(iso3.x - camera.x, iso3.y - camera.y - this.height);
        ctx.lineTo(iso3.x - camera.x, iso3.y - camera.y);
        ctx.lineTo(iso2.x - camera.x, iso2.y - camera.y);
        ctx.closePath();
        ctx.fill();

        // Left face (medium)
        ctx.fillStyle = '#A1887F';
        ctx.beginPath();
        ctx.moveTo(iso3.x - camera.x, iso3.y - camera.y - this.height);
        ctx.lineTo(iso4.x - camera.x, iso4.y - camera.y - this.height);
        ctx.lineTo(iso4.x - camera.x, iso4.y - camera.y);
        ctx.lineTo(iso3.x - camera.x, iso3.y - camera.y);
        ctx.closePath();
        ctx.fill();
    }

    blocksMovement(player) {
        return player.x > this.x && player.x < this.x + this.width &&
               player.y > this.y && player.y < this.y + this.depth;
    }
}

// Coin/Letter collectible
class Coin {
    constructor(x, y, character, pronunciation) {
        this.x = x;
        this.y = y;
        this.z = CONSTANTS.COIN_FLOAT_HEIGHT;
        this.baseZ = CONSTANTS.COIN_FLOAT_HEIGHT; // Base height for floating
        this.character = character;
        this.pronunciation = pronunciation;
        this.collected = false;
        this.rotation = 0;
        this.bobOffset = 0;
        this.collectTime = 0;
        this.particles = [];
    }

    update() {
        if (gamePaused) return;

        if (!this.collected) {
            this.rotation += 0.05;
            this.bobOffset = Math.sin(Date.now() / 300) * 12;
            // Update z based on baseZ + bobOffset
            this.z = this.baseZ + this.bobOffset;
        } else {
            // Animate particles
            this.collectTime++;
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
            });
            this.particles = this.particles.filter(p => p.life > 0);
        }
    }

    draw(camera) {
        if (this.collected && this.collectTime > 30) return;

        const iso = toIso(this.x, this.y, camera.zoom);
        const screenX = iso.x - camera.x;
        const screenY = iso.y - camera.y - this.z;

        if (!this.collected) {
            ctx.save();
            ctx.translate(screenX, screenY);
            ctx.rotate(this.rotation);

            // Draw larger coin with glow effect
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#FF8C00';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, CONSTANTS.COIN_RADIUS, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw character (larger)
            ctx.rotate(-this.rotation);
            ctx.fillStyle = '#1A237E';
            ctx.font = 'bold 28px Arial, "Noto Sans Ethiopic"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.character, 0, 3);

            ctx.restore();
        } else {
            // Draw collection particles
            this.particles.forEach(p => {
                ctx.fillStyle = `rgba(255, 215, 0, ${p.life / 30})`;
                ctx.beginPath();
                ctx.arc(screenX + p.x, screenY + p.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }

    checkCollision(player) {
        if (this.collected) return false;

        const dist = Math.hypot(player.x - this.x, player.y - this.y);
        if (dist < CONSTANTS.COIN_COLLECTION_DISTANCE && Math.abs(player.z - this.z) < CONSTANTS.COIN_Z_TOLERANCE) {
            this.collected = true;
            this.createParticles();
            this.playSound();
            this.speak();
            return true;
        }
        return false;
    }

    createParticles() {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: 0,
                y: 0,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 30
            });
        }
    }

    playSound() {
        try {
            // Use shared audio context
            if (!sharedAudioContext) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    sharedAudioContext = new AudioContextClass();
                }
            }

            if (!sharedAudioContext) return;

            const oscillator = sharedAudioContext.createOscillator();
            const gainNode = sharedAudioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(sharedAudioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, sharedAudioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, sharedAudioContext.currentTime + 0.2);

            oscillator.start(sharedAudioContext.currentTime);
            oscillator.stop(sharedAudioContext.currentTime + 0.2);
        } catch (e) {
            console.warn('Audio not supported:', e);
        }
    }

    speak() {
        try {
            if ('speechSynthesis' in window && this.pronunciation) {
                window.speechSynthesis.cancel(); // Cancel previous speech
                const utterance = new SpeechSynthesisUtterance(this.pronunciation);
                utterance.rate = 0.8;
                utterance.pitch = 1.2;
                window.speechSynthesis.speak(utterance);
            }
        } catch (e) {
            console.warn('Speech synthesis not supported:', e);
        }
    }
}

// Enemy base class
class Enemy {
    constructor(x, y, speed, pursueInterval, color, emoji) {
        this.x = x;
        this.y = y;
        this.z = 0;
        this.width = 40;
        this.height = 40;
        this.speed = speed;
        this.pursueInterval = pursueInterval; // Time between pursuit updates (ms)
        this.lastPursueTime = Date.now();
        this.color = color;
        this.emoji = emoji;
        this.targetX = x;
        this.targetY = y;
        this.active = false;
    }

    update(player) {
        if (gamePaused) return;

        // Activate enemy at intervals
        const now = Date.now();
        if (now - this.lastPursueTime > this.pursueInterval) {
            this.active = true;
            this.lastPursueTime = now;

            // Calculate direction to player
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 10) {
                this.targetX = player.x;
                this.targetY = player.y;
            }
        }

        if (this.active) {
            // Move towards target
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 5) {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            } else {
                this.active = false;
            }

            // Keep within world bounds
            this.x = Math.max(0, Math.min(WORLD_WIDTH, this.x));
            this.y = Math.max(0, Math.min(WORLD_HEIGHT, this.y));
        }
    }

    draw(camera) {
        const iso = toIso(this.x, this.y, camera.zoom);
        const screenX = iso.x - camera.x;
        const screenY = iso.y - camera.y - this.z;

        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY + 5, this.width / 2, this.height / 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw enemy body
        ctx.fillStyle = this.color;
        ctx.fillRect(screenX - this.width / 2, screenY - this.height, this.width, this.height);

        // Draw border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX - this.width / 2, screenY - this.height, this.width, this.height);

        // Draw emoji
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, screenX, screenY - this.height / 2);

        // Draw pursuit indicator when active
        if (this.active) {
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(screenX, screenY - this.height - 10, 8, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    checkCollision(player) {
        return Math.hypot(player.x - this.x, player.y - this.y) < (this.width + player.width) / 2;
    }
}

// Lion - Fast pursuer
class Lion extends Enemy {
    constructor(x, y) {
        super(x, y, 3, 3000, '#D4A574', '🦁'); // Pursues every 3 seconds
    }
}

// Ape - Medium speed, frequent pursuer
class Ape extends Enemy {
    constructor(x, y) {
        super(x, y, 2, 2000, '#8B4513', '🦍'); // Pursues every 2 seconds
    }
}

// Horse - Very fast but infrequent
class Horse extends Enemy {
    constructor(x, y) {
        super(x, y, 4, 5000, '#A0522D', '🐴'); // Pursues every 5 seconds
    }
}

// Game objects
const player = new Player(200, 200);
const camera = new Camera();
const platforms = [];
const trees = [];
const walls = [];
const coins = [];
const enemies = [];

// Load worlds data from JSON
async function loadWorldsData() {
    const loadingEl = document.getElementById('levelName');
    if (loadingEl) loadingEl.textContent = 'Loading...';

    try {
        const response = await fetch('worlds.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        worldsData = await response.json();

        if (!worldsData || !worldsData.worlds || worldsData.worlds.length === 0) {
            throw new Error('Invalid worlds data');
        }

        initLevel();
    } catch (error) {
        console.error('Failed to load worlds.json:', error);
        showError('Failed to load game data. Using fallback level.');
        initLevelFallback();
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 5000;
        font-weight: bold;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

// Initialize level from JSON data
function initLevel() {
    if (!worldsData || !worldsData.worlds || worldsData.worlds.length === 0) {
        console.warn('No world data available, using fallback');
        initLevelFallback();
        return;
    }

    platforms.length = 0;
    trees.length = 0;
    walls.length = 0;
    coins.length = 0;
    enemies.length = 0;

    // Get current world data (cycle through available worlds)
    const worldIndex = currentLevel % worldsData.worlds.length;
    const world = worldsData.worlds[worldIndex];

    console.log('Loading world:', world.name);

    // Set player start position
    if (world.playerStart) {
        player.x = world.playerStart.x;
        player.y = world.playerStart.y;
        player.z = 0;
        player.velocityZ = 0;
        player.isJumping = false;
        player.currentPlatform = null;
    }

    // Load objects from JSON - Optimized ground platform
    world.objects.forEach(obj => {
        switch(obj.type) {
            case 'groundPlatform':
                // Create single large ground platform instead of grid
                platforms.push(new Platform(obj.x, obj.y, obj.width, obj.depth, 0, false));
                break;

            case 'platform':
                platforms.push(new Platform(
                    obj.x,
                    obj.y,
                    obj.width,
                    obj.depth,
                    obj.height,
                    obj.moving || false,
                    obj.moveSpeed || 2,
                    obj.moveRange || 100
                ));
                break;

            case 'tree':
                trees.push(new Tree(obj.x, obj.y));
                break;

            case 'wall':
                walls.push(new Wall(obj.x, obj.y, obj.width, obj.depth));
                break;
        }
    });

    // Load letter positions
    if (world.letterPositions) {
        world.letterPositions.forEach((pos, i) => {
            if (i < geezCharacters.length) {
                const char = geezCharacters[i];
                const pronunciation = GeezAlphabetDict[char] || 'letter';
                const coin = new Coin(pos.x, pos.y, char, pronunciation);
                // Set initial Z position if specified
                if (pos.z !== undefined) {
                    coin.z = pos.z;
                    coin.baseZ = pos.z;
                }
                coins.push(coin);
            }
        });
    }

    // Add enemies (3-5 random enemies per level)
    const enemyCount = 3 + Math.floor(Math.random() * 3);
    const enemyTypes = [Lion, Ape, Horse];

    for (let i = 0; i < enemyCount; i++) {
        const EnemyClass = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const x = 300 + Math.random() * (WORLD_WIDTH - 600);
        const y = 300 + Math.random() * (WORLD_HEIGHT - 600);
        enemies.push(new EnemyClass(x, y));
    }

    // Update UI with world name
    const levelNameEl = document.getElementById('levelName');
    if (levelNameEl) {
        levelNameEl.textContent = world.name;
    }
}

// Fallback level initialization (original hardcoded level)
function initLevelFallback() {
    platforms.length = 0;
    trees.length = 0;
    walls.length = 0;
    coins.length = 0;
    enemies.length = 0;

    // Create single ground platform (optimized)
    platforms.push(new Platform(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 0, false));

    // Add elevated platforms
    platforms.push(new Platform(300, 300, 100, 100, 60, false));
    platforms.push(new Platform(500, 400, 120, 100, 80, false));
    platforms.push(new Platform(700, 200, 100, 100, 100, false));
    platforms.push(new Platform(900, 500, 130, 110, 70, false));
    platforms.push(new Platform(1100, 300, 110, 100, 90, false));
    platforms.push(new Platform(1300, 600, 100, 100, 60, false));
    platforms.push(new Platform(1500, 400, 120, 120, 85, false));

    // Add moving platforms
    platforms.push(new Platform(600, 600, 80, 80, 120, true));
    platforms.push(new Platform(1000, 800, 90, 90, 100, true));
    platforms.push(new Platform(1400, 200, 85, 85, 110, true));

    // Add trees
    trees.push(new Tree(400, 500));
    trees.push(new Tree(800, 300));
    trees.push(new Tree(1200, 700));
    trees.push(new Tree(600, 900));
    trees.push(new Tree(1000, 400));
    trees.push(new Tree(1400, 800));

    // Add walls
    walls.push(new Wall(450, 700, 150, 30));
    walls.push(new Wall(850, 450, 30, 150));
    walls.push(new Wall(1250, 350, 120, 30));
    walls.push(new Wall(1100, 900, 30, 120));

    // Add coins with Geez letters
    const letterPositions = [
        {x: 350, y: 350}, {x: 550, y: 450}, {x: 750, y: 250},
        {x: 950, y: 550}, {x: 1150, y: 350}, {x: 1350, y: 650},
        {x: 1550, y: 450}
    ];

    letterPositions.forEach((pos, i) => {
        if (i < geezCharacters.length) {
            const char = geezCharacters[i];
            const pronunciation = GeezAlphabetDict[char] || 'letter';
            coins.push(new Coin(pos.x, pos.y, char, pronunciation));
        }
    });

    // Add enemies to fallback level
    enemies.push(new Lion(600, 600));
    enemies.push(new Ape(1000, 800));
    enemies.push(new Horse(1400, 400));

    const levelNameEl = document.getElementById('levelName');
    if (levelNameEl) {
        levelNameEl.textContent = 'Fallback Level';
    }
}

// Next level function
function nextLevel() {
    currentLevel++;
    score = 0; // Reset score for new level

    if (worldsData && worldsData.worlds) {
        if (currentLevel >= worldsData.worlds.length) {
            // Game completed!
            showVictoryScreen();
            return;
        }
        initLevel();
    } else {
        // No more levels in fallback mode
        showVictoryScreen();
    }
}

function showVictoryScreen() {
    gamePaused = true;

    const victoryDiv = document.createElement('div');
    victoryDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 4000;
        color: white;
    `;

    victoryDiv.innerHTML = `
        <h1 style="font-size: 48px; margin-bottom: 20px;">🎉 Congratulations! 🎉</h1>
        <p style="font-size: 24px; margin-bottom: 30px;">You completed all levels!</p>
        <button onclick="location.reload()" style="
            padding: 15px 40px;
            font-size: 20px;
            background: linear-gradient(135deg, #6BCF7F 0%, #45a049 100%);
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-weight: bold;
        ">Play Again</button>
    `;

    document.body.appendChild(victoryDiv);
}

// Initialize first level
loadWorldsData();

// Start game function
function startGame() {
    const modal = document.getElementById('instructionsModal');
    if (modal) modal.classList.add('hidden');
    gameStarted = true;
    gamePaused = false;
    resizeCanvas();
}
window.startGame = startGame;

// Pause/Resume game
function togglePause() {
    gamePaused = !gamePaused;
    const pauseBtn = document.getElementById('pauseButton');
    if (pauseBtn) {
        pauseBtn.textContent = gamePaused ? '▶ Resume' : '⏸ Pause';
    }

    if (gamePaused) {
        showPauseOverlay();
    } else {
        hidePauseOverlay();
    }
}

function showPauseOverlay() {
    let overlay = document.getElementById('pauseOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'pauseOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;
        overlay.innerHTML = `
            <div style="
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
            ">
                <h2 style="color: #667eea; margin-bottom: 20px;">Game Paused</h2>
                <button onclick="togglePause()" style="
                    padding: 15px 40px;
                    font-size: 18px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 30px;
                    cursor: pointer;
                    font-weight: bold;
                ">Resume</button>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
}

function hidePauseOverlay() {
    const overlay = document.getElementById('pauseOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

window.togglePause = togglePause;

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw gradient background (brighter sky)
    const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
    gradient.addColorStop(0, '#64B5F6');
    gradient.addColorStop(0.5, '#90CAF9');
    gradient.addColorStop(1, '#BBDEFB');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    if (!gamePaused) {
        // Update game objects
        player.update();
        camera.update(player);
        platforms.forEach(p => p.update());
        coins.forEach(c => c.update());
        enemies.forEach(e => e.update(player));

        // Check tree and wall collisions with stronger pushback
        trees.forEach(tree => {
            if (tree.blocksMovement(player)) {
                const dx = player.x - (tree.x + tree.width / 2);
                const dy = player.y - (tree.y + tree.depth / 2);
                const dist = Math.hypot(dx, dy);
                if (dist > 0) {
                    player.x += (dx / dist) * CONSTANTS.OBSTACLE_PUSHBACK;
                    player.y += (dy / dist) * CONSTANTS.OBSTACLE_PUSHBACK;
                }
            }
        });

        walls.forEach(wall => {
            if (wall.blocksMovement(player)) {
                const dx = player.x - (wall.x + wall.width / 2);
                const dy = player.y - (wall.y + wall.depth / 2);
                const dist = Math.hypot(dx, dy);
                if (dist > 0) {
                    player.x += (dx / dist) * CONSTANTS.OBSTACLE_PUSHBACK;
                    player.y += (dy / dist) * CONSTANTS.OBSTACLE_PUSHBACK;
                }
            }
        });
    }

    // Draw ground platforms first (they should always be behind everything)
    platforms.forEach(platform => {
        if (platform.height === 0) {
            platform.draw(camera);
        }
    });

    // Sort elevated objects by depth for proper isometric rendering
    const allObjects = [
        ...platforms.filter(p => p.height > 0).map(p => ({type: 'platform', obj: p, y: p.y + p.depth})),
        ...trees.map(t => ({type: 'tree', obj: t, y: t.y + t.depth})),
        ...walls.map(w => ({type: 'wall', obj: w, y: w.y + w.depth})),
        ...enemies.map(e => ({type: 'enemy', obj: e, y: e.y})),
        ...coins.filter(c => !c.collected || c.collectTime <= 30).map(c => ({type: 'coin', obj: c, y: c.y})),
        {type: 'player', obj: player, y: player.y}
    ];

    allObjects.sort((a, b) => a.y - b.y);

    // Draw all elevated objects
    allObjects.forEach(item => {
        item.obj.draw(camera);
    });

    if (!gamePaused) {
        // Check enemy collisions
        enemies.forEach(enemy => {
            if (enemy.checkCollision(player)) {
                // Reset player position on collision
                player.x = 200;
                player.y = 200;
                player.z = 0;
                player.velocityZ = 0;

                // Show warning
                const warningEl = document.getElementById('levelName');
                if (warningEl) {
                    const oldText = warningEl.textContent;
                    warningEl.textContent = '⚠️ Caught by enemy! ⚠️';
                    warningEl.style.color = '#FF0000';
                    setTimeout(() => {
                        warningEl.textContent = oldText;
                        warningEl.style.color = '';
                    }, 1000);
                }
            }
        });

        // Check coin collection
        let collected = 0;
        coins.forEach(coin => {
            if (coin.checkCollision(player)) {
                score++;
            }
            if (coin.collected) collected++;
        });

        // Update UI
        const scoreEl = document.getElementById('scoreValue');
        const letterCountEl = document.getElementById('letterCount');
        const totalLettersEl = document.getElementById('totalLetters');

        if (scoreEl) scoreEl.textContent = score;
        if (letterCountEl) letterCountEl.textContent = collected;
        if (totalLettersEl) totalLettersEl.textContent = coins.length;

        // Check level completion
        if (collected === coins.length && coins.length > 0) {
            setTimeout(() => {
                showLevelComplete();
            }, 1000);
        }
    }

    // Draw controls hint
    if (!gameStarted) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(SCREEN_WIDTH / 2 - 200, SCREEN_HEIGHT / 2 - 80, 400, 160);

        ctx.strokeStyle = '#4A148C';
        ctx.lineWidth = 4;
        ctx.strokeRect(SCREEN_WIDTH / 2 - 200, SCREEN_HEIGHT / 2 - 80, 400, 160);

        ctx.fillStyle = '#1976D2';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎮 Isometric Adventure! 🎮', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 40);

        ctx.fillStyle = '#4A148C';
        ctx.font = '18px Arial';
        ctx.fillText('WASD or Arrow Keys to Move', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        ctx.fillText('Space to Jump', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 30);
        ctx.fillText('Collect all Geez letters!', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 60);

        ctx.textAlign = 'left';
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

function showLevelComplete() {
    if (gamePaused) return; // Prevent multiple calls
    gamePaused = true;

    const completeDiv = document.createElement('div');
    completeDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 4000;
        color: white;
    `;

    completeDiv.innerHTML = `
        <h1 style="font-size: 48px; margin-bottom: 20px;">🎉 Level Complete! 🎉</h1>
        <p style="font-size: 24px; margin-bottom: 30px;">Score: ${score}</p>
        <button onclick="continueToNextLevel()" style="
            padding: 15px 40px;
            font-size: 20px;
            background: linear-gradient(135deg, #6BCF7F 0%, #45a049 100%);
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-weight: bold;
        ">Next Level</button>
    `;

    document.body.appendChild(completeDiv);
}

function continueToNextLevel() {
    const completeDiv = document.querySelector('[style*="z-index: 4000"]');
    if (completeDiv) completeDiv.remove();

    gamePaused = false;
    nextLevel();
}

window.continueToNextLevel = continueToNextLevel;

// Keyboard controls
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (!gamePaused) {
            player.jump();
        }
        if (!gameStarted) {
            gameStarted = true;
        }
    }

    // Prevent arrow keys from affecting other elements (like zoom slider)
    if (e.key.startsWith('Arrow')) {
        e.preventDefault();
    }

    // ESC to pause/unpause
    if (e.key === 'Escape') {
        e.preventDefault();
        if (gameStarted) {
            togglePause();
        }
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mobile touch controls
function setupMobileControls() {
    const upLeftBtn = document.getElementById('upLeftBtn');
    const upRightBtn = document.getElementById('upRightBtn');
    const downLeftBtn = document.getElementById('downLeftBtn');
    const downRightBtn = document.getElementById('downRightBtn');
    const jumpBtn = document.getElementById('jumpBtn');

    if (upLeftBtn) {
        upLeftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keys['w'] = true;
            keys['a'] = true;
        });
        upLeftBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            keys['w'] = false;
            keys['a'] = false;
        });
    }

    if (upRightBtn) {
        upRightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keys['w'] = true;
            keys['d'] = true;
        });
        upRightBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            keys['w'] = false;
            keys['d'] = false;
        });
    }

    if (downLeftBtn) {
        downLeftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keys['s'] = true;
            keys['a'] = true;
        });
        downLeftBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            keys['s'] = false;
            keys['a'] = false;
        });
    }

    if (downRightBtn) {
        downRightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keys['s'] = true;
            keys['d'] = true;
        });
        downRightBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            keys['s'] = false;
            keys['d'] = false;
        });
    }

    if (jumpBtn) {
        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!gamePaused) {
                player.jump();
            }
            if (!gameStarted) gameStarted = true;
        });
    }
}

// Initialize mobile controls
setupMobileControls();

// Zoom control
function setupZoomControl() {
    const zoomSlider = document.getElementById('zoomSlider');
    const zoomValue = document.getElementById('zoomValue');

    if (zoomSlider && zoomValue) {
        // Set initial value
        zoomSlider.value = 40;
        zoomValue.textContent = '100%';

        zoomSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            const zoomLevel = value / 40; // 40 is the base (100%)

            // Update camera zoom
            camera.setZoom(zoomLevel);

            // Update display
            const percentage = Math.round(zoomLevel * 100);
            zoomValue.textContent = percentage + '%';
        });
    }
}

// Initialize zoom control
setupZoomControl();

// Start game loop
gameLoop();
