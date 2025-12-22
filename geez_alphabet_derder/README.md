# Geez Alphabet Game - JavaScript/HTML Version

A browser-based educational game to learn Ge'ez (Ethiopic) alphabet through interactive word collection.

## Features

- Falling Geez letters with large, visible characters
- Mouse-controlled collection circle
- Word completion system
- Score tracking
- Beautiful UI with colored backgrounds for better visibility

## Files

- `index.html` - Main HTML file
- `game.js` - Game logic in JavaScript
- `styles.css` - Styling and layout
- `translations.json` - Word translations (English to Amharic)
- `NotoSansEthiopic-VariableFont_wdth,wght.ttf` - Ethiopic font

## How to Play

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)
2. Move your mouse around the canvas
3. Collect falling Geez letters by moving the red circle close to them
4. Collect all the letters shown in the "Translation" box to complete the word
5. Your score increases with each completed word

## Running the Game

### Option 1: Direct File Open
Simply double-click `index.html` to open it in your default browser.

### Option 2: Local Server (Recommended)
For better font loading and performance, run a local server:

**Using Python:**
```bash
cd geez_alphabet_game_js
python -m http.server 8000
```
Then open http://localhost:8000 in your browser.

**Using Node.js:**
```bash
cd geez_alphabet_game_js
npx http-server
```

**Using VS Code:**
Install the "Live Server" extension and right-click `index.html` → "Open with Live Server"

## Game Controls

- **Mouse Movement**: Control the collection circle
- The red circle collects letters when they get close
- Letters are displayed in large yellow boxes with Geez characters

## Technical Details

- Pure JavaScript (no frameworks)
- HTML5 Canvas for rendering
- Custom Ethiopic font rendering
- Responsive mouse tracking
- 60 FPS game loop using requestAnimationFrame

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- CSS3
- Custom fonts

## Credits

Converted from the Python/Pygame version to JavaScript/HTML5.
Uses Noto Sans Ethiopic font for authentic Ge'ez character display.
