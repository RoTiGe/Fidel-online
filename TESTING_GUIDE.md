# Testing Guide - Fidel Games

## ⚠️ Important: Use HTTP Server, Not File Protocol

**DO NOT** open games with `file:///` protocol. This causes CORS issues and prevents proper loading of resources.

### ✅ Correct Way to Test

#### Option 1: Python HTTP Server (Recommended)
```bash
cd c:\Users\Robel\Documents\Hobby
python -m http.server 8000
```
Then open: `http://localhost:8000/Fidel_Games/index.html`

#### Option 2: Node.js HTTP Server
```bash
npm install -g http-server
cd c:\Users\Robel\Documents\Hobby
http-server
```

#### Option 3: Live Server (VS Code Extension)
- Install "Live Server" extension in VS Code
- Right-click on `Fidel_Games/index.html`
- Select "Open with Live Server"

## 🎮 Game Testing Checklist

### 1. Alphabet Learning Game
**URL:** `http://localhost:8000/Fidel_Games/geez_alphabet_game_js/index.html`

- [ ] Page loads with instructions modal
- [ ] "Start Learning! 🚀" button is visible
- [ ] Click button to start game
- [ ] Canvas appears with falling letters
- [ ] Letters fall from top
- [ ] Mouse/touch movement works
- [ ] Letters collect when touched
- [ ] Sound toggle button works (🔊/🔇)
- [ ] Stats panel shows score
- [ ] Home button returns to menu

### 2. Platformer Game
**URL:** `http://localhost:8000/Fidel_Games/Alphabet_platformer_mario_like_js/index.html`

- [ ] Page loads with instructions modal
- [ ] "Play Now! 🚀" button is visible
- [ ] Click button to start game
- [ ] Canvas appears with platformer level
- [ ] Arrow keys or WASD work
- [ ] Space bar jumps
- [ ] Mobile: Virtual buttons appear
- [ ] Pause button works
- [ ] Quit button returns to menu
- [ ] Home button returns to menu

### 3. Tutorial Mode
**URL:** `http://localhost:8000/Fidel_Games/geez_alphabet_platformer_combined_tutorial/index.html`

- [ ] Page loads with instructions
- [ ] "Start Tutorial! 🚀" button visible
- [ ] Game starts with hints
- [ ] Hint button shows next letter
- [ ] Glowing effect on target letter
- [ ] Home button works

### 4. Adventure Mode
**URL:** `http://localhost:8000/Fidel_Games/geez_alphabet_platformer_combined/index.html`

- [ ] Page loads with instructions
- [ ] "Play Now! 🚀" button visible
- [ ] Game starts with enemies
- [ ] Achievements button works
- [ ] Home button works

### 5. Derder Game
**URL:** `http://localhost:8000/Fidel_Games/geez_alphabet_derder/index.html`

- [ ] Page loads with instructions
- [ ] "Let's Play! 🚀" button visible
- [ ] Click to start game
- [ ] Letters appear at top
- [ ] Drag & drop works
- [ ] Undo button works
- [ ] Timer button works
- [ ] Stats panel shows progress
- [ ] Home button works

## 🔍 Debugging Tips

### Check Browser Console
1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Look for any red error messages
4. Check for CORS errors

### Common Issues

**Issue:** Game doesn't load
- **Solution:** Use HTTP server, not file:// protocol

**Issue:** Canvas is blank
- **Solution:** Click "Start" button to begin game

**Issue:** No sound
- **Solution:** Check browser audio permissions and volume

**Issue:** Controls don't work
- **Solution:** Make sure canvas has focus (click on it)

## 📊 Expected Behavior

### Game Flow
1. Open game URL
2. See instructions modal
3. Click "Start" button
4. Game canvas appears
5. Game begins
6. Click home button to return to menu

### Navigation
- All games link from `Fidel_Games/index.html`
- All games have home button linking back
- No broken links
- Smooth transitions

## ✅ Verification Checklist

- [x] All game.js files exist
- [x] All index.html files exist
- [x] All navigation links correct
- [x] All home buttons point to menu
- [x] Scripts load correctly
- [x] Canvas elements present
- [x] Instructions modals present
- [x] Start buttons functional

---

**Last Updated:** December 22, 2025
**Status:** Ready for Testing

