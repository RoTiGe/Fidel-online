# Fidel Games - Quick Reference Guide

## 🎮 Game Access

### From Main Menu
Open `index.html` in your browser - all games are linked from there.

### Direct Links
- **Alphabet Learning:** `Fidel_Games/geez_alphabet_game_js/index.html`
- **Platformer:** `Fidel_Games/Alphabet_platformer_mario_like_js/index.html`
- **Tutorial Mode:** `Fidel_Games/geez_alphabet_platformer_combined_tutorial/index.html`
- **Adventure Mode:** `Fidel_Games/geez_alphabet_platformer_combined/index.html`
- **Derder:** `Fidel_Games/geez_alphabet_derder/index.html`

## 🎯 Game Features at a Glance

### Alphabet Learning
- **Type:** Falling letters collection
- **Controls:** Mouse/Touch movement
- **Stages:** 5 progressive difficulty levels
- **Features:** Progress bar, sound toggle, statistics

### Platformer
- **Type:** Mario-style platformer
- **Controls:** Arrow keys/A-D + Space/↑ (Desktop) or Virtual buttons (Mobile)
- **Stages:** Multiple with letter collection
- **Features:** Pause menu, leaderboard, mobile controls

### Tutorial Mode
- **Type:** Guided platformer
- **Controls:** Same as Platformer
- **Stages:** 5 with visual hints
- **Features:** Glowing letter hints, progress checkpoints

### Adventure Mode
- **Type:** Advanced platformer
- **Controls:** Same as Platformer
- **Stages:** 5 with enemies
- **Features:** Achievements, difficulty modes, story elements

### Derder
- **Type:** Drag & drop spelling
- **Controls:** Click/Tap and drag letters
- **Stages:** 5 with increasing difficulty
- **Features:** Undo button, timer, statistics

## 🛠️ Customization

### Change Game Title
Edit the `<title>` tag in each game's `index.html`

### Modify Colors
Update CSS variables in `:root` section:
```css
--primary-color: #667eea;
--success-color: #6BCF7F;
--warning-color: #FFD93D;
```

### Adjust Difficulty
Modify game.js configuration (stage templates, letter counts, etc.)

### Add New Features
- Add buttons to HUD overlay
- Create new modal dialogs
- Extend statistics panel
- Add new game modes

## 📱 Responsive Breakpoints

- **Mobile:** < 768px (Portrait-first)
- **Tablet:** 768px - 1024px (Landscape support)
- **Desktop:** > 1024px (Full features)

## ♿ Accessibility Features

- ARIA labels on all buttons
- Keyboard navigation support
- High contrast mode support
- Reduced motion preferences
- Semantic HTML structure

## 🔊 Audio Control

Each game has a sound toggle button (🔊/🔇) to enable/disable audio.

## 💾 Progress Tracking

Games include:
- Stage progress indicators
- Word/letter counters
- Score displays
- Statistics panels
- Time tracking (where applicable)

## 🎓 Educational Features

- Letter pronunciation
- Word associations
- Progressive difficulty
- Visual feedback
- Interactive hints

## 📊 Performance Tips

1. Use modern browsers (Chrome, Firefox, Safari, Edge)
2. Enable hardware acceleration
3. Close unnecessary tabs
4. Clear browser cache if issues occur
5. Use wired connection for best experience

## 🐛 Troubleshooting

**Game won't load:**
- Check browser console for errors
- Verify all files are in correct folders
- Clear browser cache
- Try different browser

**Audio not working:**
- Check browser audio permissions
- Verify sound toggle is enabled
- Check system volume

**Controls not responding:**
- Refresh the page
- Check if game is paused
- Try different input method (keyboard vs touch)

## 📞 Support

For issues or suggestions, check the game's instructions modal (usually shown on first load).

