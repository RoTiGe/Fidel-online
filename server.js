const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
