const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

console.log('=== SNAKE ISOMETRIC GAME LOADING ===');

// ==================== CONSTANTS ====================
const CONSTANTS = {
    GRAVITY: 0.6,
    CLIMB_SPEED: 3,
    BASE_SPEED_OVERLAND: 3,
    BASE_SPEED_CONCRETE: 4.5,
    BASE_SPEED_GRASS: 2.5,
    BASE_SPEED_WATER: 1.5,
    BASE_TILE_WIDTH: 40,
    BASE_TILE_HEIGHT: 20,
    SEGMENT_RADIUS: 15,
    SEGMENT_SPACING: 25,
    INITIAL_SEGMENTS: 2,
    COIN_RADIUS: 28,
    COIN_FLOAT_HEIGHT: 30,
    COIN_COLLECTION_DISTANCE: 40,
    TREE_SIZE: 50,
    TREE_HEIGHT: 100,
    WALL_HEIGHT: 50,
    GROUND_TILE_SIZE: 200
};

// Terrain types
const TERRAIN = {
    OVERLAND: 'overland',
    CONCRETE: 'concrete',
    GRASS: 'grass',
    WATER: 'water'
};

// ==================== SCREEN AND CANVAS ====================
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

function resizeCanvas() {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ==================== ISOMETRIC CONVERSION ====================
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

// ==================== GEEZ ALPHABET ====================
const GeezAlphabetDict = {
    'ሀ': 'he', 'ሁ': 'hu', 'ሂ': 'hi', 'ሃ': 'ha', 'ሄ': 'hey', 'ህ': 'hih', 'ሆ': 'ho',
    'ለ': 'le', 'ሉ': 'lu', 'ሊ': 'li', 'ላ': 'la', 'ሌ': 'ley', 'ል': 'lih', 'ሎ': 'lo',
    'መ': 'me', 'ሙ': 'mu', 'ሚ': 'mi', 'ማ': 'ma', 'ሜ': 'mey', 'ም': 'mih', 'ሞ': 'mo',
    'ረ': 're', 'ሩ': 'ru', 'ሪ': 'ri', 'ራ': 'ra', 'ሬ': 'rey', 'ር': 'rih', 'ሮ': 'ro',
    'ሰ': 'se', 'ሱ': 'su', 'ሲ': 'si', 'ሳ': 'sa', 'ሴ': 'sey', 'ስ': 'sih', 'ሶ': 'so',
    'በ': 'be', 'ቡ': 'bu', 'ቢ': 'bi', 'ባ': 'ba', 'ቤ': 'bey', 'ብ': 'bih', 'ቦ': 'bo',
    'ተ': 'te', 'ቱ': 'tu', 'ቲ': 'ti', 'ታ': 'ta', 'ቴ': 'tey', 'ት': 'tih', 'ቶ': 'to',
    'ነ': 'ne', 'ኑ': 'nu', 'ኒ': 'ni', 'ና': 'na', 'ኔ': 'ney', 'ን': 'nih', 'ኖ': 'no'
};

const alphabet = Object.keys(GeezAlphabetDict);

// ==================== AUDIO SYSTEM ====================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;

function initAudio() {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
}

function playSound(frequency, duration, type = 'sine') {
    if (!audioContext) initAudio();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playCoinSound() {
    playSound(800, 0.1, 'square');
    setTimeout(() => playSound(1000, 0.1, 'square'), 50);
}

function playClimbSound() {
    playSound(400, 0.05, 'triangle');
}

function playJumpSound() {
    playSound(300, 0.15, 'sawtooth');
}

function playCollisionSound() {
    playSound(150, 0.3, 'sawtooth');
}

// ==================== CAMERA ====================
class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.zoom = 1.0;
        this.smoothing = 0.1; // Lower = smoother but slower
    }

    follow(target) {
        this.targetX = target.x;
        this.targetY = target.y;
    }

    update() {
        // Smooth camera interpolation
        this.x += (this.targetX - this.x) * this.smoothing;
        this.y += (this.targetY - this.y) * this.smoothing;
    }

    setZoom(level) {
        this.zoom = Math.max(0.5, Math.min(2.0, level));
    }

    // Get camera offset in isometric screen coordinates
    getIsoOffset() {
        return toIso(this.x, this.y, this.zoom);
    }
}

const camera = new Camera();

// ==================== SNAKE CLASS ====================
class Snake {
    constructor(x, y) {
        this.segments = [];
        this.z = -10; // Start above ground to be visible
        this.vz = 0;
        this.isClimbing = false;
        this.climbingObject = null;
        this.currentTerrain = TERRAIN.GRASS;

        // Initialize segments - start with at least 2 segments
        for (let i = 0; i < CONSTANTS.INITIAL_SEGMENTS; i++) {
            this.segments.push({
                x: x - (i * CONSTANTS.SEGMENT_SPACING),
                y: y,
                z: -10 // Start above ground to be visible
            });
        }
    }

    get head() {
        return this.segments[0];
    }

    get speed() {
        switch (this.currentTerrain) {
            case TERRAIN.CONCRETE: return CONSTANTS.BASE_SPEED_CONCRETE;
            case TERRAIN.GRASS: return CONSTANTS.BASE_SPEED_GRASS;
            case TERRAIN.WATER: return CONSTANTS.BASE_SPEED_WATER;
            default: return CONSTANTS.BASE_SPEED_OVERLAND;
        }
    }

    move(dx, dy, walls = []) {
        if (this.isClimbing) {
            // Climbing mode - move vertically
            this.head.z -= dy * CONSTANTS.CLIMB_SPEED;
            this.head.z = Math.max(-150, this.head.z); // Limit climb height
            return;
        }

        // Calculate new head position
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        if (magnitude > 0) {
            const normalizedX = dx / magnitude;
            const normalizedY = dy / magnitude;

            const newX = this.head.x + normalizedX * this.speed;
            const newY = this.head.y + normalizedY * this.speed;

            // Check wall collisions
            let collided = false;
            for (const wall of walls) {
                if (this.checkWallCollision(newX, newY, wall)) {
                    collided = true;
                    break;
                }
            }

            // Only move if no collision
            if (!collided) {
                // Move segments (follow the leader)
                for (let i = this.segments.length - 1; i > 0; i--) {
                    const dx = this.segments[i - 1].x - this.segments[i].x;
                    const dy = this.segments[i - 1].y - this.segments[i].y;
                    const dz = this.segments[i - 1].z - this.segments[i].z;
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (distance > CONSTANTS.SEGMENT_SPACING) {
                        const ratio = (distance - CONSTANTS.SEGMENT_SPACING) / distance;
                        this.segments[i].x += dx * ratio;
                        this.segments[i].y += dy * ratio;
                        this.segments[i].z += dz * ratio;
                    }
                }

                this.head.x = newX;
                this.head.y = newY;
            }
        }
    }

    checkWallCollision(x, y, wall) {
        // Check if snake head would be inside wall bounds
        const margin = CONSTANTS.SEGMENT_RADIUS;
        return (
            x + margin > wall.x &&
            x - margin < wall.x + wall.width &&
            y + margin > wall.y &&
            y - margin < wall.y + wall.depth &&
            this.head.z >= -CONSTANTS.WALL_HEIGHT &&
            this.head.z <= 0
        );
    }

    update(platforms, trees, walls) {
        // Apply gravity if not on platform and not climbing
        if (!this.isClimbing) {
            this.vz += CONSTANTS.GRAVITY;
            this.head.z += this.vz;

            // Check platform collisions
            let onPlatform = false;
            for (const platform of platforms) {
                if (this.isOnPlatform(platform)) {
                    this.head.z = -platform.height;
                    this.vz = 0;
                    onPlatform = true;
                    this.currentTerrain = platform.terrain || TERRAIN.OVERLAND;
                    break;
                }
            }

            // Ground collision
            if (this.head.z > 0) {
                this.head.z = 0;
                this.vz = 0;
                this.currentTerrain = TERRAIN.GRASS;
            }
        }

        // Check if near climbable objects
        this.checkClimbable(trees, walls);
    }

    isOnPlatform(platform) {
        const platformTop = -platform.height;
        return (
            this.head.x >= platform.x &&
            this.head.x <= platform.x + platform.width &&
            this.head.y >= platform.y &&
            this.head.y <= platform.y + platform.depth &&
            this.head.z >= platformTop - 10 &&
            this.head.z <= platformTop + 10 &&
            this.vz >= 0
        );
    }

    checkClimbable(trees, walls) {
        // Check if near a tree or wall
        let canClimb = false;
        
        for (const tree of trees) {
            const distance = Math.hypot(
                this.head.x - (tree.x + CONSTANTS.TREE_SIZE / 2),
                this.head.y - (tree.y + CONSTANTS.TREE_SIZE / 2)
            );
            if (distance < CONSTANTS.TREE_SIZE) {
                this.climbingObject = tree;
                canClimb = true;
                break;
            }
        }

        if (!canClimb) {
            for (const wall of walls) {
                if (
                    this.head.x > wall.x &&
                    this.head.x < wall.x + wall.width &&
                    this.head.y > wall.y &&
                    this.head.y < wall.y + wall.depth
                ) {
                    this.climbingObject = wall;
                    canClimb = true;
                    break;
                }
            }
        }

        if (!canClimb && !this.isClimbing) {
            this.climbingObject = null;
        }
    }

    startClimbing() {
        if (this.climbingObject) {
            this.isClimbing = true;
            this.vz = 0;
            playClimbSound();
        }
    }

    stopClimbing() {
        this.isClimbing = false;
    }

    jumpDown() {
        if (!this.isClimbing && this.vz === 0) {
            this.vz = 5; // Downward velocity
            playJumpSound();
        }
    }

    addSegment() {
        const tail = this.segments[this.segments.length - 1];
        this.segments.push({ x: tail.x, y: tail.y, z: tail.z });
    }

    checkSelfCollision() {
        // Check if head collides with any body segment (skip first few segments)
        for (let i = 4; i < this.segments.length; i++) {
            const segment = this.segments[i];
            const distance = Math.hypot(
                this.head.x - segment.x,
                this.head.y - segment.y
            );
            const zDistance = Math.abs(this.head.z - segment.z);

            if (distance < CONSTANTS.SEGMENT_RADIUS * 1.5 && zDistance < 20) {
                return true;
            }
        }
        return false;
    }

    draw(camera) {
        // Segments are drawn in the main draw loop for proper depth sorting
    }

    drawCylinder(x, y, radius, index) {
        const height = 20;
        const isHead = index === 0;
        
        // Color gradient from head (bright green) to tail (darker green)
        const brightness = 60 - (index / this.segments.length) * 30;
        const baseColor = isHead ? '#ff7700ff' : `hsl(120, 100%, ${brightness}%)`;
        const darkColor = isHead ? '#cc0044ff' : `hsl(120, 100%, ${brightness - 10}%)`;
        const lightColor = isHead ? '#6f00ffff' : `hsl(120, 100%, ${brightness + 10}%)`;

        // Bottom ellipse
        ctx.fillStyle = darkColor;
        ctx.beginPath();
        ctx.ellipse(x, y + height, radius, radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cylinder sides
        ctx.fillStyle = baseColor;
        ctx.fillRect(x - radius, y, radius * 2, height);

        // Top ellipse
        ctx.fillStyle = lightColor;
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Outline
        ctx.strokeStyle = '#004400';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Head features
        if (isHead) {
            // Eyes
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(x - radius * 0.4, y - 5, 4, 0, Math.PI * 2);
            ctx.arc(x + radius * 0.4, y - 5, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x - radius * 0.4, y - 5, 2, 0, Math.PI * 2);
            ctx.arc(x + radius * 0.4, y - 5, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ==================== PLATFORM CLASS ====================
class Platform {
    constructor(x, y, width, depth, height, moving = false, terrain = TERRAIN.OVERLAND) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.depth = depth;
        this.height = height;
        this.moving = moving;
        this.terrain = terrain;
        
        if (moving) {
            this.startX = x;
            this.moveSpeed = 2;
            this.moveRange = 100;
            this.moveDirection = 1;
        }
    }

    update() {
        if (this.moving) {
            this.x += this.moveSpeed * this.moveDirection;
            if (Math.abs(this.x - this.startX) > this.moveRange) {
                this.moveDirection *= -1;
            }
        }
    }

    draw(camera) {
        const camOffset = camera.getIsoOffset();
        const iso1 = toIso(this.x, this.y, camera.zoom);
        const iso2 = toIso(this.x + this.width, this.y, camera.zoom);
        const iso3 = toIso(this.x + this.width, this.y + this.depth, camera.zoom);
        const iso4 = toIso(this.x, this.y + this.depth, camera.zoom);

        const z = -this.height * camera.zoom;

        const screenX1 = iso1.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY1 = iso1.y - camOffset.y + SCREEN_HEIGHT / 2 + z;
        const screenX2 = iso2.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY2 = iso2.y - camOffset.y + SCREEN_HEIGHT / 2 + z;
        const screenX3 = iso3.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY3 = iso3.y - camOffset.y + SCREEN_HEIGHT / 2 + z;
        const screenX4 = iso4.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY4 = iso4.y - camOffset.y + SCREEN_HEIGHT / 2 + z;

        // Determine color based on terrain type
        let topColor, rightColor, leftColor;
        
        if (this.moving) {
            topColor = '#FFA726';
            rightColor = '#F57C00';
            leftColor = '#FB8C00';
        } else {
            switch (this.terrain) {
                case TERRAIN.CONCRETE:
                    topColor = '#9E9E9E';
                    rightColor = '#757575';
                    leftColor = '#BDBDBD';
                    break;
                case TERRAIN.GRASS:
                    topColor = '#4CAF50';
                    rightColor = '#388E3C';
                    leftColor = '#66BB6A';
                    break;
                case TERRAIN.WATER:
                    topColor = '#2196F3';
                    rightColor = '#1976D2';
                    leftColor = '#42A5F5';
                    break;
                default:
                    topColor = this.height === 0 ? '#4CAF50' : '#8D6E63';
                    rightColor = this.height === 0 ? '#388E3C' : '#6D4C41';
                    leftColor = this.height === 0 ? '#43A047' : '#795548';
            }
        }

        // Top face
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(screenX1, screenY1);
        ctx.lineTo(screenX2, screenY2);
        ctx.lineTo(screenX3, screenY3);
        ctx.lineTo(screenX4, screenY4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Right face (if has height)
        if (this.height > 0) {
            const offset = this.height * camera.zoom;
            ctx.fillStyle = rightColor;
            ctx.beginPath();
            ctx.moveTo(screenX2, screenY2);
            ctx.lineTo(screenX3, screenY3);
            ctx.lineTo(screenX3, screenY3 + offset);
            ctx.lineTo(screenX2, screenY2 + offset);
            ctx.closePath();
            ctx.fill();

            // Left face
            ctx.fillStyle = leftColor;
            ctx.beginPath();
            ctx.moveTo(screenX3, screenY3);
            ctx.lineTo(screenX4, screenY4);
            ctx.lineTo(screenX4, screenY4 + offset);
            ctx.lineTo(screenX3, screenY3 + offset);
            ctx.closePath();
            ctx.fill();
        }
    }
}

// ==================== TREE CLASS ====================
class Tree {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(camera) {
        const camOffset = camera.getIsoOffset();
        const iso = toIso(this.x + CONSTANTS.TREE_SIZE / 2, this.y + CONSTANTS.TREE_SIZE / 2, camera.zoom);
        const screenX = iso.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY = iso.y - camOffset.y + SCREEN_HEIGHT / 2;

        const scale = camera.zoom;

        // Trunk
        ctx.fillStyle = '#6D4C41';
        ctx.fillRect(
            screenX - 5 * scale,
            screenY - 25 * scale,
            10 * scale,
            25 * scale
        );

        // Foliage (3 layers)
        ctx.fillStyle = '#66BB6A';
        ctx.beginPath();
        ctx.arc(screenX, screenY - 37 * scale, 17 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(screenX - 8 * scale, screenY - 30 * scale, 13 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(screenX + 8 * scale, screenY - 30 * scale, 13 * scale, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ==================== WALL CLASS ====================
class Wall {
    constructor(x, y, width, depth) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.depth = depth;
    }

    draw(camera) {
        const camOffset = camera.getIsoOffset();
        const iso1 = toIso(this.x, this.y, camera.zoom);
        const iso2 = toIso(this.x + this.width, this.y, camera.zoom);
        const iso3 = toIso(this.x + this.width, this.y + this.depth, camera.zoom);
        const iso4 = toIso(this.x, this.y + this.depth, camera.zoom);

        const height = CONSTANTS.WALL_HEIGHT * camera.zoom;

        const screenX1 = iso1.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY1 = iso1.y - camOffset.y + SCREEN_HEIGHT / 2 - height;
        const screenX2 = iso2.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY2 = iso2.y - camOffset.y + SCREEN_HEIGHT / 2 - height;
        const screenX3 = iso3.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY3 = iso3.y - camOffset.y + SCREEN_HEIGHT / 2 - height;
        const screenX4 = iso4.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY4 = iso4.y - camOffset.y + SCREEN_HEIGHT / 2 - height;

        // Top
        ctx.fillStyle = '#BCAAA4';
        ctx.beginPath();
        ctx.moveTo(screenX1, screenY1);
        ctx.lineTo(screenX2, screenY2);
        ctx.lineTo(screenX3, screenY3);
        ctx.lineTo(screenX4, screenY4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Right face
        const baseY2 = iso2.y - camera.y + SCREEN_HEIGHT / 2;
        const baseY3 = iso3.y - camera.y + SCREEN_HEIGHT / 2;
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath();
        ctx.moveTo(screenX2, screenY2);
        ctx.lineTo(screenX3, screenY3);
        ctx.lineTo(screenX3, baseY3);
        ctx.lineTo(screenX2, baseY2);
        ctx.closePath();
        ctx.fill();

        // Left face
        const baseY4 = iso4.y - camera.y + SCREEN_HEIGHT / 2;
        ctx.fillStyle = '#A1887F';
        ctx.beginPath();
        ctx.moveTo(screenX3, screenY3);
        ctx.lineTo(screenX4, screenY4);
        ctx.lineTo(screenX4, baseY4);
        ctx.lineTo(screenX3, baseY3);
        ctx.closePath();
        ctx.fill();
    }
}

// ==================== ENEMY CLASSES ====================
class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.z = 0;
        this.type = type;
        this.speed = 0;
        this.detectionRange = 0;
        this.active = true;
        this.stunned = false;
        this.stunnedTime = 0;
    }

    update(snake, platforms) {
        if (!this.active || this.stunned) {
            if (this.stunned) {
                this.stunnedTime--;
                if (this.stunnedTime <= 0) {
                    this.stunned = false;
                }
            }
            return;
        }

        // Check if snake is in detection range
        const distance = Math.hypot(snake.head.x - this.x, snake.head.y - this.y);
        if (distance < this.detectionRange) {
            // Move towards snake
            const dx = snake.head.x - this.x;
            const dy = snake.head.y - this.y;
            const magnitude = Math.sqrt(dx * dx + dy * dy);

            if (magnitude > 0) {
                this.x += (dx / magnitude) * this.speed;
                this.y += (dy / magnitude) * this.speed;
            }
        }

        // Keep on platforms
        let onPlatform = false;
        for (const platform of platforms) {
            if (this.isOnPlatform(platform)) {
                this.z = -platform.height;
                onPlatform = true;
                break;
            }
        }
        if (!onPlatform) {
            this.z = 0;
        }
    }

    isOnPlatform(platform) {
        return (
            this.x >= platform.x &&
            this.x <= platform.x + platform.width &&
            this.y >= platform.y &&
            this.y <= platform.y + platform.depth
        );
    }

    checkCollision(snake) {
        if (!this.active || this.stunned) return false;

        const distance = Math.hypot(snake.head.x - this.x, snake.head.y - this.y);
        const zDistance = Math.abs(snake.head.z - this.z);

        return distance < 30 && zDistance < 20;
    }

    stun(duration) {
        this.stunned = true;
        this.stunnedTime = duration;
    }
}

class Lion extends Enemy {
    constructor(x, y) {
        super(x, y, 'lion');
        this.speed = 2.5; // Fast
        this.detectionRange = 300;
        this.size = 25;
    }

    draw(camera) {
        if (!this.active) return;

        const camOffset = camera.getIsoOffset();
        const iso = toIso(this.x, this.y, camera.zoom);
        const screenX = iso.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY = iso.y - camOffset.y + SCREEN_HEIGHT / 2 + this.z * camera.zoom;
        const size = this.size * camera.zoom;

        // Lion body (orange/yellow)
        ctx.fillStyle = this.stunned ? '#888' : '#FFA500';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY, size, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mane
        if (!this.stunned) {
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.arc(screenX - size * 0.5, screenY - size * 0.3, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Eyes
        ctx.fillStyle = this.stunned ? '#FFF' : '#000';
        ctx.beginPath();
        ctx.arc(screenX - size * 0.3, screenY - size * 0.2, size * 0.15, 0, Math.PI * 2);
        ctx.arc(screenX - size * 0.1, screenY - size * 0.2, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Ape extends Enemy {
    constructor(x, y) {
        super(x, y, 'ape');
        this.speed = 1.5; // Medium
        this.detectionRange = 250;
        this.size = 28;
        this.canClimb = true;
    }

    draw(camera) {
        if (!this.active) return;

        const camOffset = camera.getIsoOffset();
        const iso = toIso(this.x, this.y, camera.zoom);
        const screenX = iso.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY = iso.y - camOffset.y + SCREEN_HEIGHT / 2 + this.z * camera.zoom;
        const size = this.size * camera.zoom;

        // Ape body (dark brown)
        ctx.fillStyle = this.stunned ? '#666' : '#3E2723';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY, size, size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Face
        ctx.fillStyle = this.stunned ? '#999' : '#8D6E63';
        ctx.beginPath();
        ctx.arc(screenX, screenY - size * 0.3, size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = this.stunned ? '#FFF' : '#000';
        ctx.beginPath();
        ctx.arc(screenX - size * 0.2, screenY - size * 0.3, size * 0.12, 0, Math.PI * 2);
        ctx.arc(screenX + size * 0.2, screenY - size * 0.3, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Horse extends Enemy {
    constructor(x, y) {
        super(x, y, 'horse');
        this.speed = 3.5; // Very fast
        this.detectionRange = 350;
        this.size = 30;
    }

    draw(camera) {
        if (!this.active) return;

        const camOffset = camera.getIsoOffset();
        const iso = toIso(this.x, this.y, camera.zoom);
        const screenX = iso.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY = iso.y - camOffset.y + SCREEN_HEIGHT / 2 + this.z * camera.zoom;
        const size = this.size * camera.zoom;

        // Horse body (brown)
        ctx.fillStyle = this.stunned ? '#777' : '#8B4513';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY, size * 1.2, size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = this.stunned ? '#888' : '#A0522D';
        ctx.beginPath();
        ctx.ellipse(screenX - size, screenY - size * 0.5, size * 0.5, size * 0.6, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Mane
        if (!this.stunned) {
            ctx.fillStyle = '#654321';
            ctx.fillRect(screenX - size * 0.8, screenY - size * 0.8, size * 0.3, size * 0.6);
        }

        // Eyes
        ctx.fillStyle = this.stunned ? '#FFF' : '#000';
        ctx.beginPath();
        ctx.arc(screenX - size * 0.9, screenY - size * 0.5, size * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ==================== PARTICLE SYSTEM ====================
class Particle {
    constructor(x, y, z, color, vx, vy, vz, life) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
        this.life = life;
        this.maxLife = life;
        this.size = 3 + Math.random() * 3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        this.vz += 0.5; // Gravity
        this.life--;
    }

    draw(camera) {
        const camOffset = camera.getIsoOffset();
        const iso = toIso(this.x, this.y, camera.zoom);
        const screenX = iso.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY = iso.y - camOffset.y + SCREEN_HEIGHT / 2 + this.z * camera.zoom;

        const alpha = this.life / this.maxLife;
        ctx.fillStyle = this.color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size * camera.zoom, 0, Math.PI * 2);
        ctx.fill();
    }
}

let particles = [];

function createParticles(x, y, z, color, count = 10) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const vz = -5 - Math.random() * 5;
        particles.push(new Particle(x, y, z, color, vx, vy, vz, 30 + Math.random() * 30));
    }
}

// ==================== POWER-UP CLASS ====================
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.z = -50;
        this.type = type; // 'speed' or 'invincibility'
        this.collected = false;
        this.floatOffset = 0;
        this.floatSpeed = 0.08;
        this.rotation = 0;
    }

    update() {
        this.floatOffset = Math.sin(Date.now() * this.floatSpeed * 0.001) * 10;
        this.rotation += 0.05;
    }

    draw(camera) {
        if (this.collected) return;

        const camOffset = camera.getIsoOffset();
        const iso = toIso(this.x, this.y, camera.zoom);
        const screenX = iso.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY = iso.y - camOffset.y + SCREEN_HEIGHT / 2 + (this.z + this.floatOffset) * camera.zoom;
        const size = 20 * camera.zoom;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.rotation);

        if (this.type === 'speed') {
            // Lightning bolt for speed boost
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.lineTo(size * 0.3, 0);
            ctx.lineTo(size * 0.1, 0);
            ctx.lineTo(size * 0.3, size);
            ctx.lineTo(-size * 0.3, 0);
            ctx.lineTo(-size * 0.1, 0);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'invincibility') {
            // Shield for invincibility
            ctx.fillStyle = '#00BFFF';
            ctx.shadowColor = '#00BFFF';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.quadraticCurveTo(size, -size * 0.5, size, size * 0.3);
            ctx.quadraticCurveTo(size, size, 0, size * 1.2);
            ctx.quadraticCurveTo(-size, size, -size, size * 0.3);
            ctx.quadraticCurveTo(-size, -size * 0.5, 0, -size);
            ctx.fill();
        }

        ctx.restore();
    }
}

// ==================== COIN CLASS ====================
class Coin {
    constructor(x, y, letter) {
        this.x = x;
        this.y = y;
        this.z = -CONSTANTS.COIN_FLOAT_HEIGHT;
        this.letter = letter;
        this.collected = false;
        this.floatOffset = 0;
    }

    update() {
        this.floatOffset = Math.sin(Date.now() / 500) * 10;
    }

    draw(camera) {
        if (this.collected) return;

        const camOffset = camera.getIsoOffset();
        const iso = toIso(this.x, this.y, camera.zoom);
        const screenX = iso.x - camOffset.x + SCREEN_WIDTH / 2;
        const screenY = iso.y - camOffset.y + SCREEN_HEIGHT / 2 + (this.z + this.floatOffset) * camera.zoom;

        const radius = CONSTANTS.COIN_RADIUS * camera.zoom;

        // Glow effect
        const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius * 1.5);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Coin
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Letter
        ctx.fillStyle = '#000';
        ctx.font = `bold ${radius * 1.2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.letter, screenX, screenY);
    }
}

// ==================== GAME STATE ====================
let snake;
let platforms = [];
let trees = [];
let walls = [];
let coins = [];
let enemies = [];
let powerUps = [];
let score = 0;
let currentWorld = 1;
let isPaused = false;
let gameRunning = true;
let totalLetters = 0;
let collectedLetters = 0;
let invincible = false;
let invincibleTime = 0;
let speedBoost = false;
let speedBoostTime = 0;

// Keyboard state
const keys = {};
window.addEventListener('keydown', (e) => {
    if (isPaused) return;

    keys[e.key] = true;

    // Climbing controls
    if (e.key === 'c' || e.key === 'C') {
        snake.startClimbing();
    }
    if (e.key === ' ' && !snake.isClimbing) {
        e.preventDefault();
        snake.jumpDown();
    }

    // Pause with Escape or P
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        togglePause();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;

    if (e.key === 'c' || e.key === 'C') {
        snake.stopClimbing();
    }
});

// ==================== MOBILE CONTROLS ====================
function setupMobileControls() {
    const mobileButtons = {
        upLeftBtn: { dx: -1, dy: -1 },
        upRightBtn: { dx: 1, dy: -1 },
        downLeftBtn: { dx: -1, dy: 1 },
        downRightBtn: { dx: 1, dy: 1 }
    };

    // Movement buttons
    Object.entries(mobileButtons).forEach(([id, direction]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (isPaused || !snake || snake.isClimbing) return;
                keys[`mobile_${id}`] = direction;
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                delete keys[`mobile_${id}`];
            });
        }
    });

    // Climb button
    const climbBtn = document.getElementById('climbBtn');
    if (climbBtn) {
        climbBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (isPaused || !snake) return;
            snake.startClimbing();
        });
        climbBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!snake) return;
            snake.stopClimbing();
        });
    }

    // Jump button
    const jumpBtn = document.getElementById('jumpBtn');
    if (jumpBtn) {
        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (isPaused || !snake || snake.isClimbing) return;
            snake.jumpDown();
        });
    }
}

// ==================== PAUSE FUNCTIONALITY ====================
function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pauseButton');
    if (pauseBtn) {
        pauseBtn.textContent = isPaused ? '▶️ Resume' : '⏸ Pause';
    }

    // Show/hide pause overlay
    showPauseOverlay(isPaused);
}

function showPauseOverlay(show) {
    let overlay = document.getElementById('pauseOverlay');

    if (show && !overlay) {
        overlay = document.createElement('div');
        overlay.id = 'pauseOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;
        overlay.innerHTML = `
            <div style="text-align: center; color: white;">
                <h1 style="font-size: 48px; margin-bottom: 20px;">⏸ PAUSED</h1>
                <p style="font-size: 24px;">Press P or Escape to resume</p>
                <button onclick="togglePause()" style="
                    margin-top: 30px;
                    padding: 15px 40px;
                    font-size: 20px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 30px;
                    cursor: pointer;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                ">▶️ Resume Game</button>
            </div>
        `;
        document.body.appendChild(overlay);
    } else if (!show && overlay) {
        overlay.remove();
    }
}

// Make togglePause available globally
window.togglePause = togglePause;

// ==================== WORLD LOADING ====================
async function loadWorld(worldId) {
    try {
        const response = await fetch('worlds.json');
        const data = await response.json();
        const world = data.worlds.find(w => w.id === worldId);

        if (!world) {
            console.error('World not found');
            initializeDefaultWorld();
            return;
        }

        // Clear existing objects
        platforms = [];
        trees = [];
        walls = [];
        coins = [];
        enemies = [];

        // Create objects
        world.objects.forEach(obj => {
            if (obj.type === 'groundPlatform' || obj.type === 'platform') {
                const terrain = obj.terrain || (obj.height === 0 ? TERRAIN.GRASS : TERRAIN.OVERLAND);
                platforms.push(new Platform(
                    obj.x, obj.y, obj.width, obj.depth, obj.height,
                    obj.moving || false, terrain
                ));
            } else if (obj.type === 'tree') {
                trees.push(new Tree(obj.x, obj.y));
            } else if (obj.type === 'wall') {
                walls.push(new Wall(obj.x, obj.y, obj.width, obj.depth));
            } else if (obj.type === 'lion') {
                enemies.push(new Lion(obj.x, obj.y));
            } else if (obj.type === 'ape') {
                enemies.push(new Ape(obj.x, obj.y));
            } else if (obj.type === 'horse') {
                enemies.push(new Horse(obj.x, obj.y));
            }
        });

        // Create coins at letter positions
        if (world.letterPositions) {
            world.letterPositions.forEach((pos, index) => {
                const letter = alphabet[index % alphabet.length];
                coins.push(new Coin(pos.x, pos.y, letter));
            });
        }

        // Create power-ups (spawn a few randomly on platforms)
        const numPowerUps = Math.min(3, platforms.length);
        for (let i = 0; i < numPowerUps; i++) {
            const platform = platforms[Math.floor(Math.random() * platforms.length)];
            const powerUpType = Math.random() < 0.5 ? 'speed' : 'invincibility';
            const x = platform.x + Math.random() * platform.width;
            const y = platform.y + Math.random() * platform.depth;
            powerUps.push(new PowerUp(x, y, powerUpType));
        }

        // Initialize snake
        snake = new Snake(world.playerStart.x, world.playerStart.y);
        camera.follow(snake.head);

        // Set total letters
        totalLetters = coins.length;
        collectedLetters = 0;

        // Update level name
        const levelNameEl = document.getElementById('levelName');
        if (levelNameEl) levelNameEl.textContent = world.name;

        console.log(`World ${worldId} loaded: ${world.name}`);
    } catch (error) {
        console.error('Error loading world:', error);
        initializeDefaultWorld();
    }
}

function initializeDefaultWorld() {
    // Create a default world with different terrains
    platforms.push(new Platform(0, 0, 4000, 4000, 0, false, TERRAIN.GRASS));
    platforms.push(new Platform(300, 300, 200, 100, 60, false, TERRAIN.CONCRETE));
    platforms.push(new Platform(600, 200, 150, 150, 100, true, TERRAIN.OVERLAND));
    platforms.push(new Platform(800, 600, 200, 200, 0, false, TERRAIN.WATER));
    platforms.push(new Platform(400, 700, 150, 150, 40, false, TERRAIN.GRASS));
    
    trees.push(new Tree(400, 400));
    trees.push(new Tree(700, 500));
    trees.push(new Tree(250, 250));
    
    walls.push(new Wall(500, 300, 100, 30));
    walls.push(new Wall(900, 400, 80, 40));
    
    coins.push(new Coin(350, 350, 'ሀ'));
    coins.push(new Coin(650, 250, 'ለ'));
    coins.push(new Coin(850, 650, 'መ'));

    snake = new Snake(200, 200);
    camera.follow(snake.head);
}

// ==================== GAME LOOP ====================
function update() {
    if (isPaused) return;

    // Handle input
    let dx = 0;
    let dy = 0;

    if (snake.isClimbing) {
        // Climbing controls - vertical movement
        if (keys['ArrowUp'] || keys['w'] || keys['W']) dy = -1;
        if (keys['ArrowDown'] || keys['s'] || keys['S']) dy = 1;
    } else {
        // Normal movement - horizontal
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) dx = -1;
        if (keys['ArrowRight'] || keys['d'] || keys['D']) dx = 1;
        if (keys['ArrowUp'] || keys['w'] || keys['W']) dy = -1;
        if (keys['ArrowDown'] || keys['s'] || keys['S']) dy = 1;

        // Mobile controls
        Object.values(keys).forEach(value => {
            if (value && typeof value === 'object' && value.dx !== undefined) {
                dx += value.dx;
                dy += value.dy;
            }
        });

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const magnitude = Math.sqrt(dx * dx + dy * dy);
            dx /= magnitude;
            dy /= magnitude;
        }
    }

    snake.move(dx, dy, walls);
    snake.update(platforms, trees, walls);

    // Update power-up timers
    if (invincibleTime > 0) {
        invincibleTime--;
        if (invincibleTime === 0) invincible = false;
    }
    if (speedBoostTime > 0) {
        speedBoostTime--;
        if (speedBoostTime === 0) {
            speedBoost = false;
            snake.speed = CONSTANTS.SNAKE_SPEED; // Reset to normal speed
        }
    }

    // Check self-collision (unless invincible)
    if (!invincible && snake.checkSelfCollision()) {
        playCollisionSound();
        gameOver('You hit yourself!');
        return;
    }

    // Update platforms
    platforms.forEach(p => p.update());

    // Update enemies
    enemies.forEach(enemy => {
        enemy.update(snake, platforms);

        // Check collision with snake (unless invincible)
        if (!invincible && enemy.checkCollision(snake)) {
            playCollisionSound();
            gameOver('Caught by a ' + enemy.type + '!');
            return;
        }
    });

    // Update coins
    coins.forEach(coin => {
        coin.update();

        if (!coin.collected) {
            const distance = Math.hypot(
                snake.head.x - coin.x,
                snake.head.y - coin.y
            );
            const zDistance = Math.abs(snake.head.z - coin.z);

            if (distance < CONSTANTS.COIN_COLLECTION_DISTANCE && zDistance < 30) {
                coin.collected = true;
                score++;
                collectedLetters++;
                snake.addSegment();

                // Create particles
                createParticles(coin.x, coin.y, coin.z, 'rgb(255, 215, 0)', 15);

                // Play sound
                playCoinSound();

                // Speak the letter
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(GeezAlphabetDict[coin.letter]);
                    speechSynthesis.speak(utterance);
                }

                updateHUD();

                // Check level completion
                if (collectedLetters >= totalLetters) {
                    levelComplete();
                }
            }
        }
    });

    // Update power-ups
    powerUps.forEach(powerUp => {
        powerUp.update();

        if (!powerUp.collected) {
            const distance = Math.hypot(
                snake.head.x - powerUp.x,
                snake.head.y - powerUp.y
            );
            const zDistance = Math.abs(snake.head.z - powerUp.z);

            if (distance < 40 && zDistance < 30) {
                powerUp.collected = true;

                if (powerUp.type === 'speed') {
                    speedBoost = true;
                    speedBoostTime = 300; // 5 seconds at 60fps
                    snake.speed = CONSTANTS.SNAKE_SPEED * 1.5;
                    createParticles(powerUp.x, powerUp.y, powerUp.z, 'rgb(255, 215, 0)', 20);
                    playSound(600, 0.2, 'square');
                } else if (powerUp.type === 'invincibility') {
                    invincible = true;
                    invincibleTime = 600; // 10 seconds at 60fps
                    createParticles(powerUp.x, powerUp.y, powerUp.z, 'rgb(0, 191, 255)', 20);
                    playSound(800, 0.2, 'sine');
                }

                updateHUD();
            }
        }
    });

    // Update particles
    particles = particles.filter(p => {
        p.update();
        return p.life > 0;
    });

    // Update camera
    camera.follow(snake.head);
    camera.update();
}

// ==================== LEADERBOARD SYSTEM ====================
function saveScore(playerScore, playerLength, level) {
    const scores = JSON.parse(localStorage.getItem('snakeIsometricScores') || '[]');
    scores.push({
        score: playerScore,
        length: playerLength,
        level: level,
        date: new Date().toISOString()
    });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem('snakeIsometricScores', JSON.stringify(scores.slice(0, 10)));
}

function getTopScores() {
    return JSON.parse(localStorage.getItem('snakeIsometricScores') || '[]');
}

function gameOver(message) {
    gameRunning = false;
    isPaused = true;

    // Save score
    saveScore(score, snake.segments.length, currentWorld);
    const topScores = getTopScores();

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3000;
        overflow-y: auto;
    `;

    let leaderboardHTML = '<div style="margin-top: 20px; max-height: 200px; overflow-y: auto;">';
    leaderboardHTML += '<h3 style="color: #FFD700; margin-bottom: 10px;">🏆 Top Scores</h3>';
    leaderboardHTML += '<table style="margin: 0 auto; color: white; font-size: 14px;">';
    topScores.slice(0, 5).forEach((s, i) => {
        leaderboardHTML += `<tr><td style="padding: 5px;">${i + 1}.</td><td style="padding: 5px;">Score: ${s.score}</td><td style="padding: 5px;">Length: ${s.length}</td><td style="padding: 5px;">Level: ${s.level}</td></tr>`;
    });
    leaderboardHTML += '</table></div>';

    overlay.innerHTML = `
        <div style="text-align: center; color: white; padding: 20px;">
            <h1 style="font-size: 48px; margin-bottom: 20px; color: #FF6B35;">💀 Game Over!</h1>
            <p style="font-size: 24px; margin-bottom: 20px;">${message}</p>
            <p style="font-size: 20px; margin-bottom: 30px;">Score: ${score} | Length: ${snake.segments.length} | Level: ${currentWorld}</p>
            ${leaderboardHTML}
            <div style="margin-top: 30px;">
                <button onclick="location.reload()" style="
                    padding: 15px 40px;
                    font-size: 20px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 30px;
                    cursor: pointer;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                    margin: 0 10px;
                ">🔄 Try Again</button>
                <button onclick="window.location.href='/'" style="
                    padding: 15px 40px;
                    font-size: 20px;
                    background: linear-gradient(135deg, #6BCF7F, #45a049);
                    color: white;
                    border: none;
                    border-radius: 30px;
                    cursor: pointer;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                    margin: 0 10px;
                ">🏠 Home</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function levelComplete() {
    isPaused = true;

    // Save score
    saveScore(score, snake.segments.length, currentWorld);
    const topScores = getTopScores();

    let leaderboardHTML = '<div style="margin-top: 20px; max-height: 200px; overflow-y: auto;">';
    leaderboardHTML += '<h3 style="color: #FFD700; margin-bottom: 10px;">🏆 Top Scores</h3>';
    leaderboardHTML += '<table style="margin: 0 auto; color: white; font-size: 14px;">';
    topScores.slice(0, 5).forEach((s, i) => {
        leaderboardHTML += `<tr><td style="padding: 5px;">${i + 1}.</td><td style="padding: 5px;">Score: ${s.score}</td><td style="padding: 5px;">Length: ${s.length}</td><td style="padding: 5px;">Level: ${s.level}</td></tr>`;
    });
    leaderboardHTML += '</table></div>';

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3000;
        overflow-y: auto;
    `;
    overlay.innerHTML = `
        <div style="text-align: center; color: white; padding: 20px;">
            <h1 style="font-size: 48px; margin-bottom: 20px; color: #6BCF7F;">🎉 Level Complete!</h1>
            <p style="font-size: 24px; margin-bottom: 20px;">All letters collected!</p>
            <p style="font-size: 20px; margin-bottom: 30px;">Score: ${score} | Length: ${snake.segments.length} | Level: ${currentWorld}</p>
            ${leaderboardHTML}
            <div style="margin-top: 30px;">
                <button onclick="nextLevel()" style="
                    padding: 15px 40px;
                    font-size: 20px;
                    background: linear-gradient(135deg, #6BCF7F, #45a049);
                    color: white;
                    border: none;
                    border-radius: 30px;
                    cursor: pointer;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                    margin: 0 10px;
                ">➡️ Next Level</button>
                <button onclick="window.location.href='/'" style="
                    padding: 15px 40px;
                    font-size: 20px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 30px;
                    cursor: pointer;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                    margin: 0 10px;
                ">🏠 Home</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function nextLevel() {
    currentWorld++;
    location.reload(); // Reload to load next world
}

// Make functions available globally
window.nextLevel = nextLevel;

function draw() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Sort objects by depth for proper rendering
    const allObjects = [
        ...platforms.map(p => ({ obj: p, y: p.y + p.depth, type: 'platform' })),
        ...trees.map(t => ({ obj: t, y: t.y + CONSTANTS.TREE_SIZE, type: 'tree' })),
        ...walls.map(w => ({ obj: w, y: w.y + w.depth, type: 'wall' })),
        ...coins.map(c => ({ obj: c, y: c.y, type: 'coin' })),
        ...powerUps.map(p => ({ obj: p, y: p.y, type: 'powerup' })),
        ...enemies.map(e => ({ obj: e, y: e.y, type: 'enemy' })),
        ...snake.segments.map((s, i) => ({ obj: { segment: s, index: i }, y: s.y, type: 'snake' }))
    ].sort((a, b) => a.y - b.y);

    // Draw all objects in depth order
    allObjects.forEach(item => {
        if (item.type === 'platform') {
            item.obj.draw(camera);
        } else if (item.type === 'tree') {
            item.obj.draw(camera);
        } else if (item.type === 'wall') {
            item.obj.draw(camera);
        } else if (item.type === 'coin') {
            item.obj.draw(camera);
        } else if (item.type === 'powerup') {
            item.obj.draw(camera);
        } else if (item.type === 'enemy') {
            item.obj.draw(camera);
        } else if (item.type === 'snake') {
            const { segment, index } = item.obj;
            const camOffset = camera.getIsoOffset();
            const iso = toIso(segment.x, segment.y, camera.zoom);
            const screenX = iso.x - camOffset.x + SCREEN_WIDTH / 2;
            const screenY = iso.y - camOffset.y + SCREEN_HEIGHT / 2 + segment.z * camera.zoom;

            // Draw invincibility glow
            if (invincible) {
                ctx.save();
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 20 * camera.zoom;
                snake.drawCylinder(screenX, screenY, CONSTANTS.SEGMENT_RADIUS * camera.zoom, index);
                ctx.restore();
            } else {
                snake.drawCylinder(screenX, screenY, CONSTANTS.SEGMENT_RADIUS * camera.zoom, index);
            }
        }
    });

    // Draw particles
    particles.forEach(p => p.draw(camera));

    // Draw UI
    drawTerrainIndicator();
    drawControls();
    drawMinimap();
}

function drawMinimap() {
    const minimapCanvas = document.getElementById('minimap');
    if (!minimapCanvas) return;

    const minimapCtx = minimapCanvas.getContext('2d');
    const width = minimapCanvas.width;
    const height = minimapCanvas.height;

    // Clear minimap
    minimapCtx.clearRect(0, 0, width, height);

    // Calculate bounds
    const allX = [...platforms.map(p => p.x), ...platforms.map(p => p.x + p.width), snake.head.x];
    const allY = [...platforms.map(p => p.y), ...platforms.map(p => p.y + p.depth), snake.head.y];
    const minX = Math.min(...allX) - 50;
    const maxX = Math.max(...allX) + 50;
    const minY = Math.min(...allY) - 50;
    const maxY = Math.max(...allY) + 50;

    const scaleX = width / (maxX - minX);
    const scaleY = height / (maxY - minY);
    const scale = Math.min(scaleX, scaleY) * 0.9;

    const offsetX = (width - (maxX - minX) * scale) / 2;
    const offsetY = (height - (maxY - minY) * scale) / 2;

    function toMinimapCoords(x, y) {
        return {
            x: (x - minX) * scale + offsetX,
            y: (y - minY) * scale + offsetY
        };
    }

    // Draw platforms
    minimapCtx.fillStyle = 'rgba(100, 100, 100, 0.5)';
    platforms.forEach(p => {
        const pos = toMinimapCoords(p.x, p.y);
        minimapCtx.fillRect(pos.x, pos.y, p.width * scale, p.depth * scale);
    });

    // Draw walls
    minimapCtx.fillStyle = 'rgba(139, 69, 19, 0.7)';
    walls.forEach(w => {
        const pos = toMinimapCoords(w.x, w.y);
        minimapCtx.fillRect(pos.x, pos.y, w.width * scale, w.depth * scale);
    });

    // Draw coins
    minimapCtx.fillStyle = '#FFD700';
    coins.forEach(c => {
        if (!c.collected) {
            const pos = toMinimapCoords(c.x, c.y);
            minimapCtx.beginPath();
            minimapCtx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
            minimapCtx.fill();
        }
    });

    // Draw enemies
    minimapCtx.fillStyle = '#FF0000';
    enemies.forEach(e => {
        if (e.active) {
            const pos = toMinimapCoords(e.x, e.y);
            minimapCtx.beginPath();
            minimapCtx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
            minimapCtx.fill();
        }
    });

    // Draw power-ups
    minimapCtx.fillStyle = '#00BFFF';
    powerUps.forEach(p => {
        if (!p.collected) {
            const pos = toMinimapCoords(p.x, p.y);
            minimapCtx.beginPath();
            minimapCtx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
            minimapCtx.fill();
        }
    });

    // Draw snake
    minimapCtx.fillStyle = invincible ? '#FFD700' : '#00FF00';
    const headPos = toMinimapCoords(snake.head.x, snake.head.y);
    minimapCtx.beginPath();
    minimapCtx.arc(headPos.x, headPos.y, 5, 0, Math.PI * 2);
    minimapCtx.fill();

    // Draw snake body
    minimapCtx.strokeStyle = invincible ? 'rgba(255, 215, 0, 0.5)' : 'rgba(0, 255, 0, 0.5)';
    minimapCtx.lineWidth = 2;
    minimapCtx.beginPath();
    snake.segments.forEach((seg, i) => {
        const pos = toMinimapCoords(seg.x, seg.y);
        if (i === 0) {
            minimapCtx.moveTo(pos.x, pos.y);
        } else {
            minimapCtx.lineTo(pos.x, pos.y);
        }
    });
    minimapCtx.stroke();
}

function drawTerrainIndicator() {
    const terrainNames = {
        [TERRAIN.GRASS]: 'Grass (Slow)',
        [TERRAIN.OVERLAND]: 'Ground (Normal)',
        [TERRAIN.CONCRETE]: 'Concrete (Fast)',
        [TERRAIN.WATER]: 'Water (Very Slow)'
    };

    const terrainColors = {
        [TERRAIN.GRASS]: '#4CAF50',
        [TERRAIN.OVERLAND]: '#8D6E63',
        [TERRAIN.CONCRETE]: '#9E9E9E',
        [TERRAIN.WATER]: '#2196F3'
    };

    // Terrain indicator
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(10, SCREEN_HEIGHT - 70, 210, 60);

    ctx.fillStyle = terrainColors[snake.currentTerrain];
    ctx.fillRect(15, SCREEN_HEIGHT - 65, 25, 50);

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(terrainNames[snake.currentTerrain], 50, SCREEN_HEIGHT - 35);

    // Climbing indicator
    if (snake.isClimbing) {
        ctx.fillStyle = 'rgba(255, 165, 0, 0.9)';
        ctx.fillRect(SCREEN_WIDTH / 2 - 80, 20, 160, 40);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🧗 CLIMBING', SCREEN_WIDTH / 2, 45);
        ctx.textAlign = 'left';
    } else if (snake.climbingObject) {
        ctx.fillStyle = 'rgba(100, 200, 100, 0.9)';
        ctx.fillRect(SCREEN_WIDTH / 2 - 100, 20, 200, 40);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press C to Climb', SCREEN_WIDTH / 2, 45);
        ctx.textAlign = 'left';
    }
}

function drawControls() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(SCREEN_WIDTH - 230, 10, 220, 110);

    ctx.fillStyle = '#FFF';
    ctx.font = '14px Arial';
    ctx.fillText('Controls:', SCREEN_WIDTH - 220, 30);
    ctx.fillText('Arrow Keys/WASD: Move', SCREEN_WIDTH - 220, 50);
    ctx.fillText('C: Climb (when near tree/wall)', SCREEN_WIDTH - 220, 70);
    ctx.fillText('Space: Jump Down', SCREEN_WIDTH - 220, 90);
    ctx.fillText('Collect letters to grow!', SCREEN_WIDTH - 220, 110);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function updateHUD() {
    const scoreEl = document.getElementById('score');
    const segmentsEl = document.getElementById('segments');
    const letterCountEl = document.getElementById('letterCount');
    const totalLettersEl = document.getElementById('totalLetters');

    if (scoreEl) scoreEl.textContent = score;
    if (segmentsEl) segmentsEl.textContent = snake.segments.length;
    if (letterCountEl) letterCountEl.textContent = collectedLetters;
    if (totalLettersEl) totalLettersEl.textContent = totalLetters;

    // Update power-up status
    const powerupStatus = document.getElementById('powerupStatus');
    const speedBoostStatus = document.getElementById('speedBoostStatus');
    const invincibilityStatus = document.getElementById('invincibilityStatus');
    const speedBoostTimeEl = document.getElementById('speedBoostTime');
    const invincibilityTimeEl = document.getElementById('invincibilityTime');

    if (speedBoost && speedBoostStatus && speedBoostTimeEl) {
        speedBoostStatus.style.display = 'flex';
        speedBoostTimeEl.textContent = Math.ceil(speedBoostTime / 60) + 's';
        powerupStatus.classList.add('active');
    } else if (speedBoostStatus) {
        speedBoostStatus.style.display = 'none';
    }

    if (invincible && invincibilityStatus && invincibilityTimeEl) {
        invincibilityStatus.style.display = 'flex';
        invincibilityTimeEl.textContent = Math.ceil(invincibleTime / 60) + 's';
        powerupStatus.classList.add('active');
    } else if (invincibilityStatus) {
        invincibilityStatus.style.display = 'none';
    }

    if (!speedBoost && !invincible && powerupStatus) {
        powerupStatus.classList.remove('active');
    }
}

// ==================== ZOOM CONTROL ====================
const zoomSlider = document.getElementById('zoomSlider');
const zoomValue = document.getElementById('zoomValue');
if (zoomSlider) {
    zoomSlider.addEventListener('input', (e) => {
        const zoomPercent = parseInt(e.target.value);
        const zoomLevel = zoomPercent / 40;
        camera.setZoom(zoomLevel);

        // Update zoom value display
        if (zoomValue) {
            const displayPercent = Math.round(zoomLevel * 100);
            zoomValue.textContent = `${displayPercent}%`;
            zoomSlider.setAttribute('aria-valuenow', displayPercent);
        }
    });

    // Prevent arrow keys from changing zoom slider
    zoomSlider.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    });
}

// ==================== START GAME FUNCTION ====================
function startGame() {
    const modal = document.getElementById('instructionsModal');
    if (modal) {
        modal.style.display = 'none';
    }
    // Initialize audio on first user interaction
    initAudio();
    // Focus on canvas for keyboard input
    canvas.focus();
}

// Make startGame available globally
window.startGame = startGame;

// ==================== INITIALIZE ====================
setupMobileControls();

loadWorld(currentWorld).then(() => {
    updateHUD();
    gameLoop();
});

console.log('🐍 Snake Isometric Game initialized!');
console.log('Controls: Arrow keys/WASD to move, C to climb, Space to jump down');
