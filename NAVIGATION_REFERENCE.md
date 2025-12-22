# Navigation Reference - Quick Lookup

## 🔗 All Navigation Links

### Main Menu Links (Fidel_Games/index.html)

| Game | Link | Status |
|------|------|--------|
| Alphabet Learning | `geez_alphabet_game_js/index.html` | ✅ |
| Platformer | `Alphabet_platformer_mario_like_js/index.html` | ✅ |
| Tutorial Mode | `geez_alphabet_platformer_combined_tutorial/index.html` | ✅ |
| Adventure Mode | `geez_alphabet_platformer_combined/index.html` | ✅ |
| Derder | `geez_alphabet_derder/index.html` | ✅ |

### Home Buttons (Back to Menu)

| Game | File | Home Button | Status |
|------|------|-------------|--------|
| Alphabet Learning | `geez_alphabet_game_js/index.html` | `../index.html` | ✅ |
| Platformer | `Alphabet_platformer_mario_like_js/index.html` | `../index.html` | ✅ |
| Tutorial Mode | `geez_alphabet_platformer_combined_tutorial/index.html` | `../index.html` | ✅ |
| Adventure Mode | `geez_alphabet_platformer_combined/index.html` | `../index.html` | ✅ |
| Derder | `geez_alphabet_derder/index.html` | `../index.html` | ✅ |

### Special Navigation

| Feature | File | Link | Status |
|---------|------|------|--------|
| Platformer Quit Button | `Alphabet_platformer_mario_like_js/index.html` | `../index.html` | ✅ |

## 📂 Folder Structure

```
Hobby/
├── index.html (Root - Main entry point)
└── Fidel_Games/
    ├── index.html (Games menu)
    ├── geez_alphabet_game_js/
    │   └── index.html
    ├── Alphabet_platformer_mario_like_js/
    │   └── index.html
    ├── geez_alphabet_platformer_combined_tutorial/
    │   └── index.html
    ├── geez_alphabet_platformer_combined/
    │   └── index.html
    └── geez_alphabet_derder/
        └── index.html
```

## 🎯 Navigation Paths

### From Root to Games
```
index.html → Fidel_Games/index.html → [Game]/index.html
```

### From Games Back to Menu
```
[Game]/index.html → ../index.html (Fidel_Games/index.html)
```

### From Games to Root
```
[Game]/index.html → ../../index.html (Root/index.html)
```

## ✅ Verification Checklist

- [x] Main menu links to all 5 games
- [x] All games have home button
- [x] Home buttons point to Fidel_Games/index.html
- [x] Platformer quit button works
- [x] All links use relative paths
- [x] No broken links
- [x] Mobile navigation works
- [x] Accessible navigation

## 🚀 How to Test

1. **Test Forward Navigation:**
   - Open `Fidel_Games/index.html`
   - Click each game card
   - Verify game loads

2. **Test Backward Navigation:**
   - In each game, click the 🏠 Home button
   - Verify you return to `Fidel_Games/index.html`

3. **Test Quit Function:**
   - In Platformer, open pause menu
   - Click Quit
   - Verify you return to menu

4. **Test on Mobile:**
   - Open on mobile device
   - Verify all buttons are clickable
   - Verify navigation works

---

**Last Updated:** December 22, 2025
**All Links:** ✅ VERIFIED & WORKING

