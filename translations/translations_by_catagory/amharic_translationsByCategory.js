const translationsByCategory = {
  "basics": {
    "hello": { "amharic": "ሀሎ", "phonetic": "hal-lo" },
    "goodbye": { "amharic": "ደህና ሁን", "phonetic": "deh-na hoon" },
    "thank you": { "amharic": "አመሰግናለሁ", "phonetic": "ah-meh-seg-i-nal-hu" },
    "please": { "amharic": "እባክህ", "phonetic": "ebak-h" },
    "sorry": { "amharic": "ይቅርታ", "phonetic": "yi-qir-ta" },
    "yes": { "amharic": "አዎ", "phonetic": "a-wo" },
    "no": { "amharic": "አይ", "phonetic": "ay" },
    "okay": { "amharic": "እሺ", "phonetic": "eh-shi" },
    "excuse me": { "amharic": "ይቅር", "phonetic": "yi-qir" },
    "welcome": { "amharic": "እንኳን ደህና መጡ", "phonetic": "en-kwan deh-na met-u" }
  },
  "family": {
    "mother": { "amharic": "እናት", "phonetic": "en-naht" },
    "father": { "amharic": "አባት", "phonetic": "ah-baht" },
    "baby": { "amharic": "ህፃን", "phonetic": "hits-an" },
    "sister": { "amharic": "እህት", "phonetic": "eh-hit" },
    "brother": { "amharic": "ወንድም", "phonetic": "wen-dim" },
    "uncle": { "amharic": "አጎት", "phonetic": "ah-goht" },
    "aunt": { "amharic": "አክስት", "phonetic": "ah-kist" },
    "grandmother": { "amharic": "አያት", "phonetic": "ah-yaht" },
    "grandfather": { "amharic": "አያት", "phonetic": "ah-yaht" },
    "cousin": { "amharic": "አጎቴ", "phonetic": "ah-go-tay" },
    "family": { "amharic": "ቤተሰብ", "phonetic": "bet-e-seb" },
    "child": { "amharic": "ልጅ", "phonetic": "lij" },
    "children": { "amharic": "ልጆች", "phonetic": "lij-och" }
  },
  "people": {
    "friend": { "amharic": "ጓደኛ", "phonetic": "gwah-den-yah" },
    "teacher": { "amharic": "መምህር", "phonetic": "mem-hir" },
    "doctor": { "amharic": "ሀኪም", "phonetic": "hak-im" },
    "student": { "amharic": "ተማሪ", "phonetic": "tem-ari" },
    "enemy": { "amharic": "ጠላት", "phonetic": "te-lat" },
    "ally": { "amharic": "አጋር", "phonetic": "a-gar" },
    "warrior": { "amharic": "ወታደር", "phonetic": "we-ta-der" },
    "commander": { "amharic": "ባለሥልጣን", "phonetic": "ba-le-sil-tan" }
  },
  "body": {
    "head": { "amharic": "ራስ", "phonetic": "rahs" },
    "eyes": { "amharic": "አይን", "phonetic": "ay-in" },
    "nose": { "amharic": "አፍንጫ", "phonetic": "af-in-ch'a" },
    "mouth": { "amharic": "አፍ", "phonetic": "af" },
    "hands": { "amharic": "እጅ", "phonetic": "edj" },
    "ears": { "amharic": "ጆሮ", "phonetic": "jo-ro" },
    "hair": { "amharic": "ፀጉር", "phonetic": "tse-goor" },
    "teeth": { "amharic": "ጥርስ", "phonetic": "tirs" },
    "feet": { "amharic": "እግር", "phonetic": "eg-ir" },
    "fingers": { "amharic": "ጣት", "phonetic": "tat" },
    "stomach": { "amharic": "ሆድ", "phonetic": "hod" },
    "heart": { "amharic": "ልብ", "phonetic": "lib" }
  },
  "clothing": {
    "shirt": { "amharic": "ሸሚዝ", "phonetic": "she-miz" },
    "shoes": { "amharic": "ጫማ", "phonetic": "ch'ah-ma" },
    "hat": { "amharic": "ቆብ", "phonetic": "q'ob" },
    "pants": { "amharic": "ሱሪ", "phonetic": "su-ri" },
    "dress": { "amharic": "ኮንዶ", "phonetic": "kon-do" },
    "socks": { "amharic": "ጫማ ልብስ", "phonetic": "ch'ah-ma libs" },
    "coat": { "amharic": "ኮት", "phonetic": "kot" },
    "gloves": { "amharic": "ግብፅ", "phonetic": "geb-ts" },
    "uniform": { "amharic": "አንድ ዓይነት ልብስ", "phonetic": "and a-yi-net libs" }
  },
  "colors": {
    "red": { "amharic": "ቀይ", "phonetic": "q'ey" },
    "blue": { "amharic": "ሰማያዊ", "phonetic": "se-ma-ya-wi" },
    "yellow": { "amharic": "ቢጫ", "phonetic": "bi-ch'ah" },
    "green": { "amharic": "አረንጓዴ", "phonetic": "ah-ren-gwa-de" },
    "orange": { "amharic": "ብርቱካናማ", "phonetic": "bir-tu-ka-na-ma" },
    "purple": { "amharic": "ሐምራዊ", "phonetic": "ham-ra-wi" },
    "pink": { "amharic": "ሮዝ", "phonetic": "roz" },
    "brown": { "amharic": "ቡናዊ", "phonetic": "bu-na-wi" },
    "black": { "amharic": "ጥቁር", "phonetic": "t'iqur" },
    "white": { "amharic": "ነጭ", "phonetic": "nech" },
    "rainbow": { "amharic": "ቀስተ ደመና", "phonetic": "q'est-e dem-ena" }
  },
  "numbers": {
    "one": { "amharic": "አንድ", "phonetic": "and" },
    "two": { "amharic": "ሁለት", "phonetic": "hu-let" },
    "three": { "amharic": "ሶስት", "phonetic": "sost" },
    "four": { "amharic": "አራት", "phonetic": "a-rat" },
    "five": { "amharic": "አምስት", "phonetic": "am-ist" },
    "six": { "amharic": "ስድስት", "phonetic": "sid-ist" },
    "seven": { "amharic": "ሰባት", "phonetic": "se-bat" },
    "eight": { "amharic": "ስምንት", "phonetic": "sim-int" },
    "nine": { "amharic": "ዘጠኝ", "phonetic": "ze-ten-y" },
    "ten": { "amharic": "አስር", "phonetic": "as-ir" },
    "zero": { "amharic": "ዜሮ", "phonetic": "ze-ro" }
  },
  "emotions": {
    "happy": { "amharic": "ደስተኛ", "phonetic": "des-te-nya" },
    "sad": { "amharic": "አዘንተኛ", "phonetic": "azen-te-nya" },
    "angry": { "amharic": "ተናደደ", "phonetic": "ten-a-ded-e" },
    "scared": { "amharic": "ፈራ", "phonetic": "fer-a" },
    "surprised": { "amharic": "ደነቀ", "phonetic": "den-eq-e" },
    "excited": { "amharic": "ከባድ", "phonetic": "keb-ad" },
    "tired": { "amharic": "ድካም", "phonetic": "di-kam" }
  },
  "school": {
    "school": { "amharic": "ትምህርት ቤት", "phonetic": "tim-hirt bet" },
    "pencil": { "amharic": "እርሳስ", "phonetic": "er-sas" },
    "paper": { "amharic": "ወረቀት", "phonetic": "wer-e-qet" },
    "draw": { "amharic": "መሳል", "phonetic": "me-sal" },
    "write": { "amharic": "መጻፍ", "phonetic": "mets-af" },
    "read": { "amharic": "መንበብ", "phonetic": "men-beb" },
    "learn": { "amharic": "መማር", "phonetic": "me-mar" }
  },
  "toys": {
    "toy": { "amharic": "መጫወቻ", "phonetic": "mech-a-wech-a" },
    "ball": { "amharic": "ኳስ", "phonetic": "kwas" },
    "doll": { "amharic": "አሻንጉሊት", "phonetic": "ash-an-gu-lit" },
    "game": { "amharic": "ጨዋታ", "phonetic": "ch'e-wa-ta" },
    "play": { "amharic": "መጫወት", "phonetic": "mech-a-wet" },
    "fun": { "amharic": "ደስታ", "phonetic": "des-ta" }
  },
  "house": {
    "house": { "amharic": "ቤት", "phonetic": "bet" },
    "room": { "amharic": "ክፍል", "phonetic": "kif-il" },
    "door": { "amharic": "በር", "phonetic": "ber" },
    "window": { "amharic": "መስኮት", "phonetic": "mes-kot" },
    "bed": { "amharic": "አልጋ", "phonetic": "al-ga" },
    "table": { "amharic": "ጠረጴዛ", "phonetic": "ter-e-p'e-za" },
    "chair": { "amharic": "ወንበር", "phonetic": "wen-ber" },
    "kitchen": { "amharic": "ማዕከላዊ ቤት", "phonetic": "ma-ek-e-la-wi bet" }
  },
  "food": {
    "bread": { "amharic": "ዳቦ", "phonetic": "da-bo" },
    "milk": { "amharic": "ወተት", "phonetic": "wet-et" },
    "egg": { "amharic": "እንቁላል", "phonetic": "en-ku-lal" },
    "fruit": { "amharic": "ፍራፍሬ", "phonetic": "fir-af-ray" },
    "apple": { "amharic": "ፖም", "phonetic": "pom" },
    "banana": { "amharic": "ሙዝ", "phonetic": "muz" },
    "juice": { "amharic": "ጭማቂ", "phonetic": "ch'im-a-qi" },
    "water": { "amharic": "ውሃ", "phonetic": "wu-ha" },
    "breakfast": { "amharic": "ቁርስ", "phonetic": "q'oors" },
    "lunch": { "amharic": "ምሳ", "phonetic": "mi-sah" },
    "dinner": { "amharic": "እራት", "phonetic": "eh-raht" },
    "cake": { "amharic": "ኬክ", "phonetic": "kek" },
    "candy": { "amharic": "ስኳር", "phonetic": "suk-war" }
  },
  "animals": {
    "cow": { "amharic": "ላም", "phonetic": "lahm" },
    "sheep": { "amharic": "በግ", "phonetic": "beg" },
    "chicken": { "amharic": "ዶሮ", "phonetic": "doro" },
    "horse": { "amharic": "ፈረስ", "phonetic": "fer-es" },
    "goat": { "amharic": "ፍየል", "phonetic": "fiyel" },
    "donkey": { "amharic": "አድጊ", "phonetic": "ad-igi" },
    "pig": { "amharic": "አሳማ", "phonetic": "as-ama" },
    "dog": { "amharic": "ውሻ", "phonetic": "wish-a" },
    "cat": { "amharic": "ድመት", "phonetic": "dim-et" },
    "bird": { "amharic": "ወፍ", "phonetic": "wef" },
    "fish": { "amharic": "አሳ", "phonetic": "as-a" },
    "rabbit": { "amharic": "ቀጭኔ", "phonetic": "q'ech-in-e" },
    "lion": { "amharic": "አንበሳ", "phonetic": "an-bes-a" },
    "elephant": { "amharic": "ዝሆን", "phonetic": "zi-hon" },
    "giraffe": { "amharic": "ቀጭኔ", "phonetic": "q'ech-in-e" },
    "monkey": { "amharic": "ዝንጀሮ", "phonetic": "zin-je-ro" },
    "zebra": { "amharic": "የበረዶ አጥቢ", "phonetic": "ye-ber-edo at'ibi" },
    "butterfly": { "amharic": "ቢራቢሮ", "phonetic": "bir-a-bir-o" },
    "bee": { "amharic": "ንቦ", "phonetic": "nib-o" },
    "spider": { "amharic": "ሸረሪት", "phonetic": "sher-er-it" }
  },
  "nature": {
    "rain": { "amharic": "ዝናብ", "phonetic": "zi-nab" },
    "cloud": { "amharic": "ደመና", "phonetic": "dem-ena" },
    "mountain": { "amharic": "ተራራ", "phonetic": "ter-ara" },
    "water": { "amharic": "ውሃ", "phonetic": "wu-ha" },
    "sun": { "amharic": "ፀሐይ", "phonetic": "tse-hai" },
    "moon": { "amharic": "ጨረቃ", "phonetic": "ch'er-eh-q'ah" },
    "tree": { "amharic": "ዛፍ", "phonetic": "zahf" },
    "flower": { "amharic": "አበባ", "phonetic": "ah-beh-bah" },
    "world": { "amharic": "ዓለም", "phonetic": "ah-lem" },
    "star": { "amharic": "ኮከብ", "phonetic": "kok-eb" },
    "sky": { "amharic": "ሰማይ", "phonetic": "sem-ay" },
    "river": { "amharic": "ወንዝ", "phonetic": "wen-iz" },
    "lake": { "amharic": "ሐይቅ", "phonetic": "hayq" },
    "sea": { "amharic": "ባሕር", "phonetic": "bah-ir" },
    "wind": { "amharic": "ነፋስ", "phonetic": "ne-fas" },
    "snow": { "amharic": "በረዶ", "phonetic": "ber-edo" }
  },
  "time": {
    "day": { "amharic": "ቀን", "phonetic": "q'en" },
    "night": { "amharic": "ሌሊት", "phonetic": "lay-lit" },
    "morning": { "amharic": "ጠዋት", "phonetic": "t'ew-at" },
    "afternoon": { "amharic": "ከሰዓት በኋላ", "phonetic": "ke-se-at be-hwa-la" },
    "evening": { "amharic": "ማታ", "phonetic": "ma-ta" },
    "today": { "amharic": "ዛሬ", "phonetic": "zar-ay" },
    "tomorrow": { "amharic": "ነገ", "phonetic": "neg-e" },
    "yesterday": { "amharic": "ትላንት", "phonetic": "til-ant" }
  },
  "seasons": {
    "summer": { "amharic": "በጋ", "phonetic": "beg-a" },
    "winter": { "amharic": "ክረምት", "phonetic": "kiremt" },
    "spring": { "amharic": "ጸደይ", "phonetic": "tsed-ey" },
    "autumn": { "amharic": "ክረምት", "phonetic": "kiremt" }
  },
  "transport": {
    "car": { "amharic": "መኪና", "phonetic": "mek-ina" },
    "airplane": { "amharic": "አውሮፕላን", "phonetic": "aw-ro-plan" },
    "bicycle": { "amharic": "ብስክሌት", "phonetic": "bis-ik-lait" },
    "bus": { "amharic": "አውቶቡስ", "phonetic": "aw-to-bus" },
    "train": { "amharic": "ባቡር", "phonetic": "ba-bur" },
    "boat": { "amharic": "መርከብ", "phonetic": "mer-keb" },
    "truck": { "amharic": "ጭነት መኪና", "phonetic": "ch'in-et mek-ina" }
  },
  "places": {
    "park": { "amharic": "ፓርክ", "phonetic": "park" },
    "store": { "amharic": "ደንበኛ", "phonetic": "den-ben-ya" },
    "hospital": { "amharic": "ጤና ቤት", "phonetic": "t'ay-na bet" },
    "church": { "amharic": "ቤተ ክርስቲያን", "phonetic": "bet-e kir-sti-yan" },
    "zoo": { "amharic": "የእንስሳት ማሳ", "phonetic": "ye-ins-is-at mas-a" },
    "camp": { "amharic": "ሰፈር", "phonetic": "se-fer" },
    "front line": { "amharic": "ፊት ለፊት መስመር", "phonetic": "fit le-fit mes-mer" }
  },
  "music": {
    "music": { "amharic": "ሙዚቃ", "phonetic": "muzi-qa" },
    "song": { "amharic": "መዝሙር", "phonetic": "mez-mur" },
    "dance": { "amharic": "መዝፈን", "phonetic": "mez-fen" },
    "sing": { "amharic": "መዝፈን", "phonetic": "mez-fen" }
  },
  "actions": {
    "eat": { "amharic": "መብላት", "phonetic": "meb-lat" },
    "drink": { "amharic": "መጠጣት", "phonetic": "met-et-at" },
    "sleep": { "amharic": "መተኛት", "phonetic": "met-en-yat" },
    "run": { "amharic": "መሮጥ", "phonetic": "me-rot" },
    "jump": { "amharic": "መዝለቅ", "phonetic": "mez-leq" },
    "walk": { "amharic": "መጓዝ", "phonetic": "me-gwaz" },
    "talk": { "amharic": "መናገር", "phonetic": "men-a-ger" },
    "listen": { "amharic": "መስማት", "phonetic": "mes-mat" },
    "see": { "amharic": "መስተዋት", "phonetic": "mes-te-wat" },
    "touch": { "amharic": "መንካት", "phonetic": "men-kat" },
    "hold": { "amharic": "መያዝ", "phonetic": "me-yaz" },
    "give": { "amharic": "መስጠት", "phonetic": "mes-t'et" },
    "take": { "amharic": "መውሰድ", "phonetic": "mew-sed" },
    "attack": { "amharic": "መምታት", "phonetic": "mem-tat" },
    "defend": { "amharic": "መከላከል", "phonetic": "me-ke-la-kel" },
    "fight": { "amharic": "መጋጠም", "phonetic": "me-ga-tem" },
    "protect": { "amharic": "መጠበቅ", "phonetic": "met-e-beq" },
    "retreat": { "amharic": "መመለስ", "phonetic": "me-me-les" },
    "capture": { "amharic": "መማረክ", "phonetic": "me-ma-rek" },
    "invasion": { "amharic": "መስጠበቅ", "phonetic": "mes-te-beq" },
    "resistance": { "amharic": "ተቃውሞ", "phonetic": "te-qaw-mo" },
    "surrender": { "amharic": "ማስገባት", "phonetic": "mas-ge-bat" }
  },
  "objects": {
    "computer": { "amharic": "ኮምፒውተር", "phonetic": "kom-pyu-ter" },
    "book": { "amharic": "መጽሐፍ", "phonetic": "mets-haf" },
    "phone": { "amharic": "ስልክ", "phonetic": "sil-ik" },
    "key": { "amharic": "ቁልፍ", "phonetic": "q'ul-if" },
    "money": { "amharic": "ገንዘብ", "phonetic": "gen-ze-b" },
    "clock": { "amharic": "ሰዓት", "phonetic": "se-at" },
    "light": { "amharic": "ብርሃን", "phonetic": "bir-han" },
    "bag": { "amharic": "ቦርሳ", "phonetic": "bor-sa" }
  },
  "shapes": {
    "circle": { "amharic": "ክብ", "phonetic": "kib" },
    "square": { "amharic": "ካሬ", "phonetic": "ka-ray" },
    "triangle": { "amharic": "ሶስት ማእዘን", "phonetic": "sost ma-e-zen" },
    "heart": { "amharic": "ልብ", "phonetic": "lib" }
  },
  "holidays": {
    "birthday": { "amharic": "የልደት ቀን", "phonetic": "ye-led-et q'en" },
    "gift": { "amharic": "ስጦታ", "phonetic": "sit-ota" },
    "party": { "amharic": "ድግስ", "phonetic": "dig-is" },
    "Christmas": { "amharic": "ገና", "phonetic": "gen-a" }
  },
  "military": {
    "war": { "amharic": "ጦርነት", "phonetic": "tor-net" },
    "peace": { "amharic": "ሰላም", "phonetic": "se-lam" },
    "soldier": { "amharic": "ወታደር", "phonetic": "we-ta-der" },
    "army": { "amharic": "ሰራዊት", "phonetic": "se-ra-wit" },
    "battle": { "amharic": "ትግል", "phonetic": "tig-il" },
    "ceasefire": { "amharic": "እልፍ አድማ", "phonetic": "ilif ad-ma" }
  },
  "weapons": {
    "gun": { "amharic": "ሽጉጥ", "phonetic": "shig-ut" },
    "weapon": { "amharic": "የጦር መሣርያ", "phonetic": "ye-tor me-sa-ri-ya" },
    "knife": { "amharic": "ቢላ", "phonetic": "bi-la" },
    "sword": { "amharic": "ነጭ ሰይፍ", "phonetic": "nech seyf" },
    "shield": { "amharic": "ጋሻ", "phonetic": "ga-sha" }
  },
  "medical": {
    "wound": { "amharic": "ጉዳት", "phonetic": "gu-dat" },
    "death": { "amharic": "ሞት", "phonetic": "mot" }
  },
  "outcomes": {
    "victory": { "amharic": "ድል", "phonetic": "dil" },
    "defeat": { "amharic": "ሽንፈት", "phonetic": "shin-fet" }
  },
  "qualities": {
    "bravery": { "amharic": "ደፋርነት", "phonetic": "de-far-net" },
    "courage": { "amharic": "ትዕግስት", "phonetic": "tig-ist" }
  },
  "tactics": {
    "strategy": { "amharic": "ስልት", "phonetic": "silt" }
  },
  "vehicles": {
    "tank": { "amharic": "ታንክ", "phonetic": "tank" },
    "helicopter": { "amharic": "ሄሊኮፕተር", "phonetic": "he-li-kop-ter" }
  },
  "equipment": {
    "uniform": { "amharic": "አንድ ዓይነት ልብስ", "phonetic": "and a-yi-net libs" }
  },
  "political": {
    "occupation": { "amharic": "ቅኝ ግዛት", "phonetic": "qin-y gizat" },
    "revolution": { "amharic": "መቃወም", "phonetic": "me-qa-wem" },
    "liberation": { "amharic": "ነፃ መውጣት", "phonetic": "ne-tsa mew-tat" },
    "independence": { "amharic": "ነፃነት", "phonetic": "ne-tsa-net" }
  }
};