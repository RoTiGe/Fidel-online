# Backend Integration Guide

## Overview
This guide shows how to integrate the backend API to protect game logic and translations from being exposed in the browser.

## What's Protected Now

### ✅ Server-Side (Protected)
- **Translation data**: Full word lists and translations stay on server
- **Game logic**: Word selection, category ordering, scoring algorithms
- **Anti-cheat**: Score validation happens server-side
- **Session management**: Game state tracked on server

### ⚠️ Client-Side (Still Visible)
- **Game rendering**: Canvas drawing, animations, physics
- **User interface**: Buttons, modals, progress displays
- **Geez alphabet**: Character to phonetic mapping (minimal exposure)
- **Player controls**: Movement, jumping, interactions

## Architecture

```
┌─────────────────┐
│   Browser       │
│  (Client-Side)  │
│                 │
│  - Game Canvas  │
│  - UI/Controls  │
│  - API Calls    │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│   Express       │
│   Server        │
│                 │
│  - Translations │
│  - Game Logic   │
│  - Scoring      │
│  - Validation   │
└─────────────────┘
```

## API Endpoints

### POST /api/game/init
Initialize a new game session
```javascript
// Request
{
    "gameType": "platformer",
    "language": "amharic"
}

// Response
{
    "sessionId": "1735982401234-xyz789",
    "categoriesOrder": ["basics", "family", "animals", ...],
    "totalCategories": 25
}
```

### POST /api/game/word
Get current word to translate
```javascript
// Request
{
    "sessionId": "1735982401234-xyz789"
}

// Response
{
    "word": "hello",
    "translation": "ሀሎ",
    "phonetic": "hal-lo",
    "category": "basics",
    "stage": 0,
    "categoryInfo": {
        "name": "basics",
        "index": 0,
        "total": 25
    }
}
```

### POST /api/game/complete
Validate word completion and get score
```javascript
// Request
{
    "sessionId": "1735982401234-xyz789",
    "word": "hello",
    "collectedLetters": "ሀሎ",
    "timeSpent": 12500
}

// Response
{
    "success": true,
    "scoreEarned": 137,
    "totalScore": 137,
    "completedWords": 1
}
```

### POST /api/game/advance
Advance to next stage/category
```javascript
// Request
{
    "sessionId": "1735982401234-xyz789"
}

// Response - Success
{
    "success": true,
    "newStage": 1,
    "newCategory": "family"
}

// Response - Game Over
{
    "gameOver": true,
    "finalScore": 2450,
    "totalWords": 25
}
```

### GET /api/alphabet/:language
Get Geez alphabet mapping (minimal data)
```javascript
// Response
{
    "alphabet": {
        "ሀ": "he",
        "ሁ": "hu",
        // ... etc
    }
}
```

## Client Integration Example

### 1. Include the API Client
```html
<script src="/js/game-api.js"></script>
```

### 2. Initialize Game
```javascript
const gameAPI = new GameAPI();

async function startGame() {
    try {
        // Initialize session
        const session = await gameAPI.initGame('platformer', 'amharic');
        console.log('Game initialized:', session);
        
        // Get alphabet for rendering
        const { alphabet } = await gameAPI.getAlphabet('amharic');
        GeezAlphabetDict = alphabet;
        
        // Get first word
        const wordData = await gameAPI.getCurrentWord();
        currentWord = wordData.word;
        currentAmharic = wordData.translation;
        
        // Start gameplay loop
        gameStarted = true;
        gameLoop();
    } catch (error) {
        console.error('Failed to start game:', error);
    }
}
```

### 3. Complete Word
```javascript
async function onWordComplete() {
    const startTime = wordStartTime; // Track when word started
    const timeSpent = Date.now() - startTime;
    
    try {
        // Validate with server
        const result = await gameAPI.completeWord(
            currentWord,
            collectedLetters,
            timeSpent
        );
        
        if (result.success) {
            score = result.totalScore; // Use server-calculated score
            console.log('Score earned:', result.scoreEarned);
            
            // Get next word
            const wordData = await gameAPI.getCurrentWord();
            currentWord = wordData.word;
            currentAmharic = wordData.translation;
        }
    } catch (error) {
        console.error('Word completion failed:', error);
    }
}
```

### 4. Advance Stage
```javascript
async function enterPortal() {
    try {
        const result = await gameAPI.advanceStage();
        
        if (result.gameOver) {
            gameOver = true;
            finalScore = result.finalScore;
            showGameOverScreen();
        } else {
            currentStage = result.newStage;
            // Get first word of new category
            const wordData = await gameAPI.getCurrentWord();
            currentWord = wordData.word;
            currentAmharic = wordData.translation;
            setupStage();
        }
    } catch (error) {
        console.error('Stage advance failed:', error);
    }
}
```

## Migration Steps

### For Platformer Tutorial Game:

1. **Add API client to HTML**
   ```html
   <script src="/js/game-api.js"></script>
   ```

2. **Remove client-side translations**
   - Remove translation file loading from HTML
   - Remove `const translations = {...}` from game.js

3. **Replace initializeGameData()**
   ```javascript
   // OLD (Client-side)
   function initializeGameData() {
       Object.keys(translations).forEach(w => {
           const cat = translations[w].category || 'uncategorized';
           (categoriesMap[cat] ||= []).push(w);
       });
       categoriesOrder = Object.keys(categoriesMap).sort(() => Math.random() - 0.5);
       // ...
   }
   
   // NEW (Server-side)
   async function initializeGameData() {
       const session = await gameAPI.initGame('platformer', translationKey);
       const { alphabet } = await gameAPI.getAlphabet(translationKey);
       GeezAlphabetDict = alphabet;
       
       const wordData = await gameAPI.getCurrentWord();
       currentWord = wordData.word;
       currentAmharic = wordData.translation;
       return true;
   }
   ```

4. **Update advanceStage()**
   ```javascript
   async function advanceStage() {
       const result = await gameAPI.advanceStage();
       
       if (result.gameOver) {
           gameOver = true;
           gameOverReason = 'All categories completed!';
           return;
       }
       
       const wordData = await gameAPI.getCurrentWord();
       currentWord = wordData.word;
       currentAmharic = wordData.translation;
       collectedLetters = '';
       setupStage();
   }
   ```

5. **Update scoring**
   ```javascript
   // When collecting final letter
   if (collectedLetters === currentAmharic) {
       const result = await gameAPI.completeWord(
           currentWord,
           collectedLetters,
           Date.now() - stageStartTime
       );
       
       if (result.success) {
           score = result.totalScore;
           // Show portal, etc.
       }
   }
   ```

## Security Benefits

1. **Translation Data Hidden**: Users can't see all words/translations upfront
2. **Anti-Cheat**: Scores calculated server-side, can't be manipulated
3. **Game Logic Protected**: Word selection algorithm stays on server
4. **Session-Based**: Each game has unique session, harder to reverse engineer
5. **Rate Limiting**: Can add rate limits to prevent API abuse
6. **Analytics**: Server can track genuine gameplay metrics

## Performance Considerations

- **Latency**: API calls add ~50-200ms delay (depends on hosting)
- **Caching**: Alphabet data can be cached client-side
- **Offline**: Game won't work offline (trade-off for security)
- **Connection**: Needs stable internet connection

## Next Steps

1. ✅ Backend API implemented in server.js
2. ✅ Client API wrapper created (game-api.js)
3. ⏳ Update platformer tutorial to use API
4. ⏳ Update derder game to use API
5. ⏳ Update other games to use API
6. ⏳ Add error handling and reconnection logic
7. ⏳ Add loading states for API calls
8. ⏳ Test thoroughly before deployment

## Example: Full Refactored Game Initialization

```javascript
// platformer-tutorial-secured.js
const gameAPI = new GameAPI();
let GeezAlphabetDict = {};
let currentWord = '';
let currentAmharic = '';
let score = 0;
let stageStartTime = 0;

async function startGame() {
    const modal = document.getElementById('instructionsModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
    
    try {
        // Show loading
        showLoadingMessage('Initializing game...');
        
        // Get language preference
        const lang = localStorage.getItem('selectedLanguage') || 'amharic';
        
        // Initialize game session
        const session = await gameAPI.initGame('platformer-tutorial', lang);
        console.log('Game session created:', session.sessionId);
        
        // Load alphabet for rendering
        const { alphabet } = await gameAPI.getAlphabet(lang);
        GeezAlphabetDict = alphabet;
        
        // Get first word
        const wordData = await gameAPI.getCurrentWord();
        currentWord = wordData.word;
        currentAmharic = wordData.translation;
        currentCategory = wordData.category;
        
        // Start game
        stageStartTime = Date.now();
        gameStarted = true;
        hideLoadingMessage();
        
        // Pronounce word
        pronounceWord();
        
        // Setup stage
        setupStage();
        
    } catch (error) {
        console.error('Failed to start game:', error);
        showErrorMessage('Failed to connect to game server. Please try again.');
    }
}
```

## Testing

To test the backend integration:

1. Start the server: `npm run dev`
2. Open browser DevTools → Network tab
3. Play the game and watch API calls
4. Verify translations aren't in client-side JavaScript
5. Try manipulating score in console (should not work)

## Deployment Considerations

- Use environment variables for production
- Add Redis or database for session storage
- Implement rate limiting (express-rate-limit)
- Add CORS configuration if needed
- Use HTTPS in production
- Add authentication if needed
- Monitor API performance
