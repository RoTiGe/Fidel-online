from gtts import gTTS
import os

oromo_letters = {
    'A': 'ah', 'B': 'bee', 'CH': 'chee', 'D': 'dee', 'DH': 'dhee',
    'E': 'eh', 'F': 'ef', 'G': 'gee', 'H': 'haa', 'I': 'ee',
    'J': 'jee', 'K': 'kaa', 'L': 'el', 'M': 'em', 'N': 'en',
    'NY': 'nyaa', 'O': 'oh', 'P': 'pee', 'Q': 'qaa', 'R': 'ar',
    'S': 'es', 'SH': 'shee', 'T': 'tee', 'TS': 'tsee', 'U': 'oo',
    'V': 'vee', 'W': 'wee', 'X': 'khaa', 'Y': 'yee', 'Z': 'zee'
}

for letter, sound in oromo_letters.items():
    tts = gTTS(text=sound, lang='en', slow=True)
    tts.save(f"{letter}_sound.mp3")