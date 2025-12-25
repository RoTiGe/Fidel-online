# Oromiffa Translations Usage

This document outlines where and how the repository loads and consumes the Oromiffa translation bundle located at [translations/Oromiffa_translations.js](translations/Oromiffa_translations.js).

## Overview
- The Oromiffa bundle is loaded dynamically based on the selected language (from `localStorage` or `?lang` query parameter).
- Game pages load the translation script first, then their corresponding `game.js` to ensure `window.translations` is available.
- Game logic uses a detected `translationKey` (including `oromo`) to read the correct field from `translations`.

## Load Points (Dynamic Script Mapping)
These pages include a language → file map entry that points `oromo` to `/translations/Oromiffa_translations.js` and inject that script before the game code:
- Alphabet Game HTML: [geez_alphabet_game_js/index.html#L425](geez_alphabet_game_js/index.html#L425)
- Derder Game HTML: [geez_alphabet_derder/index.html#L304](geez_alphabet_derder/index.html#L304)
- Platformer Tutorial HTML: [geez_alphabet_platformer_combined_tutorial/index.html#L277](geez_alphabet_platformer_combined_tutorial/index.html#L277)
- Combined Platformer HTML: [geez_alphabet_platformer_combined/index.html#L274](geez_alphabet_platformer_combined/index.html#L274)
- Mario-like Platformer HTML: [Alphabet_platformer_mario_like_js/index.html#L479](Alphabet_platformer_mario_like_js/index.html#L479)
- Platformer EJS view: [views/platformer.ejs#L282](views/platformer.ejs#L282)

Behavior pattern on these pages:
1. Read `selectedLanguage` from `localStorage` or `lang` from URL.
2. Map the chosen key to a translation file path (e.g., `oromo` → `/translations/Oromiffa_translations.js`).
3. Inject the translation script.
4. On load, inject the corresponding `game.js`.
5. On translation load error, fall back to Amharic and still inject `game.js`.

## Consumption in Game Scripts
Game scripts do not reference the file path directly; they consume `window.translations` and use a detected `translationKey` that includes `oromo`:

- Alphabet Game logic:
  - Key detection includes `oromo`: [geez_alphabet_game_js/game.js#L91](geez_alphabet_game_js/game.js#L91)
  - Access via `translations[currentWord][translationKey]`: [geez_alphabet_game_js/game.js#L113](geez_alphabet_game_js/game.js#L113)

- Derder Game logic:
  - Key detection includes `oromo`: [geez_alphabet_derder/game.js#L92](geez_alphabet_derder/game.js#L92)
  - Access via `translations[currentWord][translationKey]`: [geez_alphabet_derder/game.js#L108](geez_alphabet_derder/game.js#L108)

- Platformer Tutorial logic:
  - Key detection includes `oromo`: [geez_alphabet_platformer_combined_tutorial/game.js#L108](geez_alphabet_platformer_combined_tutorial/game.js#L108)
  - Access via `translations[currentWord][translationKey]`: [geez_alphabet_platformer_combined_tutorial/game.js#L168](geez_alphabet_platformer_combined_tutorial/game.js#L168)

- Platformer (EJS view) logic (`public/js`):
  - Key detection includes `oromo`: [public/js/platformer-game.js#L94](public/js/platformer-game.js#L94)
  - Access via `translations[currentWord][translationKey]`: [public/js/platformer-game.js#L164](public/js/platformer-game.js#L164)

- Mario-like Platformer logic:
  - Key detection includes `oromo`: [Alphabet_platformer_mario_like_js/game.js#L74](Alphabet_platformer_mario_like_js/game.js#L74)
  - Geez letter set derived from the selected language field: [Alphabet_platformer_mario_like_js/game.js#L147](Alphabet_platformer_mario_like_js/game.js#L147)

## Selection Mechanism (Header)
- The header language switcher persists the selected language to `localStorage` and triggers a reload of embedded game iframes or the page to apply changes: see [views/layout.ejs](views/layout.ejs).
- All dynamic loaders above read `selectedLanguage` or `?lang=` to choose which translation script to inject.

## Notes
- The internal field name used for Oromiffa in `translations` objects is `oromo`.
- When `selectedLanguage` is changed, the page or iframe reload ensures the correct translation file (including Oromiffa) is loaded before `game.js` runs.
