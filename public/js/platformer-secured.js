// Geez Alphabet Platformer - Backend-Secured Version
// Game logic and translations are now server-side

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

function resizeCanvas() {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    WORLD_WIDTH = SCREEN_WIDTH * 3;
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
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
    
    // Show loading indicator
    showLoadingMessage('Connecting to game server...');
    
    try {
        // Get selected language
        const lang = localStorage.getItem('selectedLanguage') || 'amharic';
        
        // Initialize game session with backend
        const session = await gameAPI.initGame('platformer-tutorial', lang);
        console.log('Session initialized:', session.sessionId);
        
        // Load alphabet for character rendering
        const { alphabet } = await gameAPI.getAlphabet(lang);
        GeezAlphabetDict = alphabet;
        
        // Get first word from server
        const wordData = await gameAPI.getCurrentWord();
        currentWord = wordData.word;
        currentAmharic = wordData.translation;
        currentCategory = wordData.category;
        
        console.log('First word loaded:', currentWord, '→', currentAmharic);
        
        // Hide loading, start game
        hideLoadingMessage();
        gameStarted = true;
        stageStartTime = Date.now();
        
        resizeCanvas();
        pronounceWord();
        setupStage();
        
    } catch (error) {
        console.error('Failed to start game:', error);
        hideLoadingMessage();
        showErrorMessage('Failed to connect to server. Please check your connection and try again.');
    }
}
window.startGame = startGame;

// Geez Alphabet Dictionary - Now loaded from server
let GeezAlphabetDict = {};

// Image cache for word visuals
const wordImages = {};
let currentWordImage = null;
let imageLoadingError = false;

function loadWordImage(word) {
    if (wordImages[word]) {
        currentWordImage = wordImages[word];
        imageLoadingError = false;
        return;
    }
    
    const img = new Image();
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

// Visual templates
const visualPalette = [
    { name: 'Morning Sky', bgColor: '#87CEEB', coinColor: '#FFD700', platformColor: '#8B4513' },
    { name: 'Sunset', bgColor: '#FF6B35', coinColor: '#FFEB3B', platformColor: '#D84315' },
    { name: 'Night', bgColor: '#1A237E', coinColor: '#FFA726', platformColor: '#4A148C' },
    { name: 'Rainbow Land', bgColor: '#E1BEE7', coinColor: '#F06292', platformColor: '#7B1FA2' },
    { name: 'Ocean Dream', bgColor: '#006064', coinColor: '#FFD54F', platformColor: '#00838F' }
];

// Game variables - word data now comes from server
let currentWord = '';
let currentAmharic = '';
let currentCategory = '';
let collectedLetters = '';
let currentStage = 0;
let score = 0;
let gameOver = false;
let gameOverReason = '';
let stageTimer = 0;
let stageStartTime = 0;
let wordPronunciationComplete = false;

// ... [Rest of the Platform, Player, Letter, Enemy, Portal classes remain the same]
// ... [Game rendering and physics code stays on client-side]

// MODIFIED: Word completion now validates with server
async function onLetterCollected(letter) {
    collectedLetters += letter.char;
    
    // Check if word is complete
    if (collectedLetters === currentAmharic) {
        const timeSpent = Date.now() - stageStartTime;
        
        try {
            // Validate completion with server and get score
            const result = await gameAPI.completeWord(
                currentWord,
                collectedLetters,
                timeSpent
            );
            
            if (result.success) {
                // Update score from server (prevents cheating)
                score = result.totalScore;
                console.log('Word completed! Score earned:', result.scoreEarned);
                
                // Show portal
                showPortal();
            } else {
                console.error('Server rejected word completion');
            }
        } catch (error) {
            console.error('Failed to validate word:', error);
            showErrorMessage('Connection error. Progress may not be saved.');
        }
    }
}

// MODIFIED: Advance stage now gets new word from server
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
        
        console.log('New stage:', currentStage, 'Word:', currentWord);
        
        collectedLetters = '';
        wordPronunciationComplete = false;
        stageStartTime = Date.now();
        
        pronounceWord();
        setupStage();
        
    } catch (error) {
        console.error('Failed to advance stage:', error);
        showErrorMessage('Failed to load next level. Please try again.');
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
    
    await startGame();
}

// UI Helper functions
function showLoadingMessage(message) {
    const loadingDiv = document.getElementById('loadingMessage') || createLoadingDiv();
    loadingDiv.textContent = message;
    loadingDiv.style.display = 'block';
}

function hideLoadingMessage() {
    const loadingDiv = document.getElementById('loadingMessage');
    if (loadingDiv) loadingDiv.style.display = 'none';
}

function showErrorMessage(message) {
    const errorDiv = document.getElementById('errorMessage') || createErrorDiv();
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function createLoadingDiv() {
    const div = document.createElement('div');
    div.id = 'loadingMessage';
    div.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:20px;border-radius:10px;z-index:10000;font-size:18px;';
    document.body.appendChild(div);
    return div;
}

function createErrorDiv() {
    const div = document.createElement('div');
    div.id = 'errorMessage';
    div.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:rgba(220,53,69,0.9);color:white;padding:15px 30px;border-radius:5px;z-index:10000;display:none;';
    document.body.appendChild(div);
    return div;
}

// NOTE: The rest of the game code (Platform, Player, Letter, Enemy, Portal classes,
// rendering logic, physics, game loop) remains unchanged and stays on the client-side.
// Only the data fetching and validation logic has been moved to the server.
