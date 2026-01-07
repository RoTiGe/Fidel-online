const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Game sessions storage (in production, use Redis or database)
const gameSessions = new Map();

// Load translations server-side
const translations = {
    amharic: null,
    tigrinya: null,
    oromo: null,
    spanish: null
};

// Helper function to load translation files
function loadTranslation(lang) {
    if (!translations[lang]) {
        try {
            const translationMap = {
                amharic: './translations/amharic_translation.js',
                tigrinya: './translations/tigrigna_translation.js',
                oromo: './translations/Oromiffa_translations.js',
                spanish: './translations/spanish_translation.js'
            };
            const filePath = translationMap[lang];
            if (filePath) {
                delete require.cache[require.resolve(filePath)];
                translations[lang] = require(filePath).translations || require(filePath);
            }
        } catch (error) {
            console.error(`Error loading ${lang} translations:`, error.message);
        }
    }
    return translations[lang];
}

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'geez_alphabet_platformer_combined/assets')));
app.use('/geez_alphabet_platformer_combined_tutorial/assets', express.static(path.join(__dirname, 'geez_alphabet_platformer_combined_tutorial/assets')));

// Serve game directories for backward compatibility
app.use('/geez_alphabet_platformer_combined', express.static(path.join(__dirname, 'geez_alphabet_platformer_combined')));
app.use('/geez_alphabet_platformer_combined_tutorial', express.static(path.join(__dirname, 'geez_alphabet_platformer_combined_tutorial')));
app.use('/geez_alphabet_game_js', express.static(path.join(__dirname, 'geez_alphabet_game_js')));
app.use('/geez_alphabet_derder', express.static(path.join(__dirname, 'geez_alphabet_derder')));
app.use('/Alphabet_platformer_mario_like_js', express.static(path.join(__dirname, 'Alphabet_platformer_mario_like_js')));
app.use('/Alphabet_Isometric_js', express.static(path.join(__dirname, 'Alphabet_Isometric_js')));
app.use('/Alphabet_Snake_Isometric', express.static(path.join(__dirname, 'Alphabet_Snake_Isometric')));
// Serve centralized translations
app.use('/translations', express.static(path.join(__dirname, 'translations')));

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Fidel Games - Geez Alphabet Learning Games'
    });
});

app.get('/platformer', (req, res) => {
    res.render('platformer', { 
        title: 'Geez Alphabet Platformer Game'
    });
});

app.get('/platformer-tutorial', (req, res) => {
    res.render('platformer-tutorial', { 
        title: 'Geez Alphabet Platformer Tutorial'
    });
});

app.get('/alphabet-game', (req, res) => {
    res.render('alphabet-game', { 
        title: 'Geez Alphabet Learning Game'
    });
});

app.get('/derder', (req, res) => {
    res.render('derder', { 
        title: 'Geez Alphabet Derder Game'
    });
});

app.get('/mario-platformer', (req, res) => {
    res.render('mario-platformer', { 
        title: 'AbuGida'
    });
});

// ============ GAME API ENDPOINTS ============

// API: Initialize new game session
app.post('/api/game/init', (req, res) => {
    const { gameType, language } = req.body;
    const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const translationData = loadTranslation(language || 'amharic');
    if (!translationData) {
        return res.status(400).json({ error: 'Invalid language' });
    }

    // Build categories
    const categoriesMap = {};
    Object.keys(translationData).forEach(word => {
        const cat = translationData[word].category || 'uncategorized';
        if (!categoriesMap[cat]) categoriesMap[cat] = [];
        categoriesMap[cat].push(word);
    });

    // Randomize category order
    const categoriesOrder = Object.keys(categoriesMap).sort(() => Math.random() - 0.5);
    
    // Initialize session
    const session = {
        id: sessionId,
        gameType,
        language,
        categoriesMap,
        categoriesOrder,
        currentCategoryIndex: 0,
        currentStage: 0,
        score: 0,
        completedWords: new Set(),
        createdAt: Date.now(),
        lastActivity: Date.now()
    };

    gameSessions.set(sessionId, session);

    // Clean up old sessions (older than 1 hour)
    const oneHourAgo = Date.now() - 3600000;
    for (const [id, sess] of gameSessions.entries()) {
        if (sess.lastActivity < oneHourAgo) {
            gameSessions.delete(id);
        }
    }

    res.json({
        sessionId,
        categoriesOrder,
        totalCategories: categoriesOrder.length
    });
});

// API: Get current word for session
app.post('/api/game/word', (req, res) => {
    const { sessionId } = req.body;
    const session = gameSessions.get(sessionId);
    
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    session.lastActivity = Date.now();
    
    const currentCategory = session.categoriesOrder[session.currentCategoryIndex];
    const wordsInCategory = session.categoriesMap[currentCategory] || [];
    
    // Filter out completed words
    const availableWords = wordsInCategory.filter(w => !session.completedWords.has(w));
    const wordsToChooseFrom = availableWords.length > 0 ? availableWords : wordsInCategory;
    
    // Select random word
    const currentWord = wordsToChooseFrom[Math.floor(Math.random() * wordsToChooseFrom.length)];
    
    const translationData = loadTranslation(session.language);
    const wordData = translationData[currentWord];

    res.json({
        word: currentWord,
        translation: wordData[session.language],
        phonetic: wordData.phonetic,
        category: currentCategory,
        stage: session.currentStage,
        categoryInfo: {
            name: currentCategory,
            index: session.currentCategoryIndex,
            total: session.categoriesOrder.length
        }
    });
});

// API: Validate word completion
app.post('/api/game/complete', (req, res) => {
    const { sessionId, word, collectedLetters, timeSpent } = req.body;
    const session = gameSessions.get(sessionId);
    
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    session.lastActivity = Date.now();
    
    // Validate on server side
    const translationData = loadTranslation(session.language);
    const expectedTranslation = translationData[word]?.[session.language];
    
    if (!expectedTranslation) {
        return res.status(400).json({ error: 'Invalid word' });
    }

    // Simple validation: check if collected letters match (you can make this stricter)
    const isValid = collectedLetters && collectedLetters.length > 0;
    
    if (isValid) {
        session.completedWords.add(word);
        
        // Calculate score (server-side to prevent cheating)
        const baseScore = 100;
        const timeBonus = Math.max(0, 50 - Math.floor(timeSpent / 1000));
        const scoreEarned = baseScore + timeBonus;
        
        session.score += scoreEarned;

        res.json({
            success: true,
            scoreEarned,
            totalScore: session.score,
            completedWords: session.completedWords.size
        });
    } else {
        res.json({
            success: false,
            message: 'Invalid completion'
        });
    }
});

// API: Advance to next stage/category
app.post('/api/game/advance', (req, res) => {
    const { sessionId } = req.body;
    const session = gameSessions.get(sessionId);
    
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    session.lastActivity = Date.now();
    session.currentStage++;
    session.currentCategoryIndex++;
    
    if (session.currentCategoryIndex >= session.categoriesOrder.length) {
        return res.json({
            gameOver: true,
            finalScore: session.score,
            totalWords: session.completedWords.size
        });
    }

    res.json({
        success: true,
        newStage: session.currentStage,
        newCategory: session.categoriesOrder[session.currentCategoryIndex]
    });
});

// API: Get minimal translation data for alphabet rendering
app.get('/api/alphabet/:language', (req, res) => {
    const { language } = req.params;
    
    // Return only the Geez alphabet mapping (no full translations)
    const geezAlphabet = {
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
        'ጻ': 'ts\'a', 'ጼ': 'ts\'ey', 'ጽ': 'ts\'ih', 'ጾ': 'ts\'o',
        'ፀ': 'ts\'e', 'ፁ': 'ts\'u', 'ፂ': 'ts\'i', 'ፃ': 'ts\'a', 'ፄ': 'ts\'ey', 'ፅ': 'ts\'ih', 'ፆ': 'ts\'o',
        'ፈ': 'fe', 'ፉ': 'fu', 'ፊ': 'fi', 'ፋ': 'fa', 'ፌ': 'fey', 'ፍ': 'fih', 'ፎ': 'fo',
        'ፐ': 'pe', 'ፑ': 'pu', 'ፒ': 'pi', 'ፓ': 'pa', 'ፔ': 'pey', 'ፕ': 'pih', 'ፖ': 'po'
    };
    
    res.json({ alphabet: geezAlphabet });
});

// API endpoints for game data
app.get('/api/translations/:game', (req, res) => {
    const game = req.params.game;
    try {
        const translations = require(`./${game}/translations.json`);
        res.json(translations);
    } catch (error) {
        res.status(404).json({ error: 'Translations not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
