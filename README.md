# 🎮 Geez Alphabet Games 📚

An interactive educational game collection designed to teach the Ge'ez (Ethiopic) alphabet through fun and engaging gameplay. Play on any device - PC, laptop, tablet, or mobile phone!

## 🌟 Features

- **4 Different Games** - Multiple learning experiences from beginner to advanced
- **Fully Responsive** - Automatically adapts to any screen size
- **Multi-Platform Support** - Works on PC, laptops, tablets, and mobile phones
- **Touch Controls** - Virtual on-screen buttons for mobile/tablet gameplay
- **Keyboard & Mouse Support** - Traditional controls for desktop play
- **Audio Pronunciation** - Learn correct pronunciation of Ge'ez letters
- **Progressive Difficulty** - Multiple stages that increase in challenge
- **Visual Learning** - Image-word associations for better retention

## 🎯 Games Included

### 1. 📚 Geez Alphabet Learning
**Path:** `geez_alphabet_game_js/`

A falling-letter collection game where you catch Ge'ez letters to spell words.

**Features:**
- 5 progressive stages (Learning → Practice → Master → Multi-Direction → Diagonal Chaos)
- Word translation challenges
- Letter-by-letter pronunciation
- Score tracking system
- Touch/mouse control support

**Controls:**
- 🖱️ **Desktop:** Move mouse to control collection point
- 📱 **Mobile/Tablet:** Touch and drag to move

### 2. 🏃‍♂️ Alphabet Platformer
**Path:** `Alphabet_platformer_mario_like_js/`

Classic Mario-style platformer with alphabet collection mechanics.

**Features:**
- Multiple themed stages
- Randomized letter challenges
- Moving platforms and obstacles
- Enemy avoidance mechanics
- Portal progression system

**Controls:**
- ⌨️ **Keyboard:** Arrow Keys or A/D to move, Space/↑ to jump
- 📱 **Mobile/Tablet:** Virtual buttons (◄ ► buttons for movement, JUMP button)

### 3. 🌟 Geez Platformer Adventure
**Path:** `geez_alphabet_platformer_combined/`

The ultimate combination - platformer gameplay with educational Ge'ez alphabet learning.

**Features:**
- Platformer + Educational content
- Image-word associations
- Randomized letter challenges
- Progressive difficulty stages
- Enemy spawning after 30 seconds
- Portal advancement system

**Controls:**
- ⌨️ **Keyboard:** Arrow Keys or A/D to move, Space/↑ to jump
- 📱 **Mobile/Tablet:** Virtual buttons for movement and jumping

### 4. 💡 Geez Platformer - Tutorial Mode
**Path:** `geez_alphabet_platformer_combined_tutorial/`

Perfect for beginners! Visual hints show which letter to collect next.

**Features:**
- **Glowing & Pulsing Hints** - Next letter to collect is highlighted
- Beginner-friendly guidance
- All features of the Adventure mode
- Ideal for first-time learners

**Controls:**
- ⌨️ **Keyboard:** Arrow Keys or A/D to move, Space/↑ to jump
- 📱 **Mobile/Tablet:** Virtual buttons for movement and jumping

## 🚀 Getting Started

### Play Online
Simply open `index.html` in your web browser to access the game selection menu.

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/RoTiGe/Alphabets.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Alphabets
   ```

3. Open `index.html` in your web browser:
   - Double-click the file, or
   - Use a local web server (recommended for best performance)

### Using a Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 📱 Mobile & Touch Support

All games are fully optimized for mobile and tablet devices:

- **Responsive Design** - Canvas automatically adjusts to screen size
- **Touch Events** - Full support for touch interactions
- **Virtual Controls** - On-screen buttons appear automatically on touch devices
- **Prevent Zoom** - Mobile-optimized meta tags prevent unwanted zooming
- **No Text Selection** - Touch-friendly CSS prevents accidental text selection

### Virtual Controls (Platformer Games)
On mobile/tablet devices, virtual buttons appear at the bottom of the screen:
- **◄ Left Button** - Move character left
- **► Right Button** - Move character right
- **⚪ JUMP Button** - Jump (circular button on the right)

## ✨ Best Practices Framework

All games now include a comprehensive best practices framework for responsive design and accessibility:

### 🛠️ Shared Utilities
- **best-practices.css** - Mobile-first responsive CSS framework
- **device-detection.js** - Device type and capability detection
- **responsive-canvas.js** - Automatic canvas sizing and scaling

### 📱 Features
- ✅ Mobile-first CSS approach
- ✅ Touch-friendly controls (44x44px minimum)
- ✅ Device detection (mobile, tablet, desktop)
- ✅ Responsive canvas with aspect ratio support
- ✅ Safe area support for notched devices
- ✅ Accessibility features (keyboard nav, reduced motion, high contrast, dark mode)
- ✅ Automatic orientation handling

### 📚 Documentation
- **QUICK_START.md** - 30-second integration guide
- **INTEGRATION_GUIDE.md** - Detailed integration steps
- **BEST_PRACTICES_COMPLETE.md** - Complete overview
- **best-practices-example.html** - Working example

### 🚀 Quick Integration
```html
<link rel="stylesheet" href="../best-practices.css">
<script src="../device-detection.js"></script>
<script src="../responsive-canvas.js"></script>
```

## 🛠️ Technologies Used

- **HTML5 Canvas** - Game rendering
- **Vanilla JavaScript** - Game logic and controls
- **CSS3** - Responsive design and animations
- **Web Audio API** - Sound and pronunciation playback
- **Touch Events API** - Mobile/tablet support
- **LocalStorage** - Save game progress
- **Device Detection API** - Responsive behavior
- **Safe Area API** - Notched device support

## 📖 Educational Content

The games teach the **Ge'ez (Ethiopic) alphabet**, also known as Fidäl, which is used to write several Ethiopian and Eritrean languages including:
- Amharic
- Tigrinya
- Ge'ez

### Learning Features:
- **Visual Word Association** - Images paired with Amharic words
- **Phonetic Pronunciation** - Audio playback of letter sounds
- **Progressive Learning** - Start with basic letters, advance to complex combinations
- **Contextual Learning** - Words used in meaningful contexts

## 🎨 Game Stages & Progression

### Alphabet Learning Game
1. **Stage 1 (Learning)** - Slow falling letters, lenient scoring
2. **Stage 2 (Practice)** - Faster letters, same scoring
3. **Stage 3 (Master)** - Order-sensitive collection
4. **Stage 4 (Multi-Direction)** - Letters from top, left, and right
5. **Stage 5 (Diagonal Chaos)** - Letters from all edges

### Platformer Games
- Multiple themed stages (Morning Sky, Sunset, Night, Rainbow Land, Ocean Dream)
- Progressive difficulty with enemy spawning
- Letter family progression (7 letters per family)
- Save progress feature

## 🎮 Tips for Players

1. **Start with Tutorial Mode** if you're new to Ge'ez alphabet
2. **Use headphones** to hear pronunciations clearly
3. **Practice letter recognition** in the Learning game first
4. **Collect in order** for bonus points in advanced stages
5. **Avoid enemies** that spawn after 30 seconds in platformers
6. **Save your progress** regularly in platformer games

## 🌐 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari (Desktop & iOS)
- ✅ Samsung Internet
- ✅ Mobile Browsers

## 📂 Project Structure

```
.
├── index.html                                    # Main game selection menu
├── README.md                                     # This file
├── geez_alphabet_game_js/                       # Alphabet Learning Game
│   ├── index.html
│   ├── game.js
│   ├── styles.css
│   └── translations.json
├── Alphabet_platformer_mario_like_js/           # Classic Platformer
│   ├── index.html
│   └── game.js
├── geez_alphabet_platformer_combined/           # Adventure Mode
│   ├── index.html
│   ├── game.js
│   └── styles.css
└── geez_alphabet_platformer_combined_tutorial/  # Tutorial Mode
    ├── index.html
    ├── game.js
    └── styles.css
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Improve documentation
- Add more words and translations
- Create new game modes

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Ge'ez alphabet and Amharic language resources
- Educational game design principles
- Open-source web technologies

## 📞 Contact

For questions, suggestions, or feedback about the Geez Alphabet Games project, please open an issue on GitHub.

---

**Made with ❤️ for Ge'ez alphabet learners everywhere!** 🇪🇹 🇪🇷

*Learn, Play, Master the Ge'ez Alphabet!* 📚✨
