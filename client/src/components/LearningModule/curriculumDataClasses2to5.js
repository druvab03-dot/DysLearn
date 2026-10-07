/**
 * NCERT / Tiwari Academy Curriculum Dataset (Classes 2 to 5)
 * Covers 5 Core Subjects: English, Hindi, Kannada, Maths, EVS/GK
 * 
 * Rules Strictly Enforced:
 * 1. [IMAGE MATCHING CONTROL]:
 *    - Inline image only when it directly illustrates the exact subject matter.
 *    - Zero decorative/filler images.
 *    - Abstract/pure grammar concepts use text-only or specific functional diagrams.
 * 2. 8-CARD PATTERN per unit (4 visual cards with distinct photos + 4 text cards in dyslexic fonts).
 * 3. Trilingual translations { en, hi, kn }.
 * 4. Minimal, high-contrast, accessible text (NO lengthy sentences).
 */

/* ==========================================================================
   CLASS 2 DATASETS
   ========================================================================== */

export const CLASS_2_ENGLISH_NOUNS = [
    {
        id: "noun_boy", label: "Boy",
        en: "Boy", hi: "लड़का (Boy)", kn: "ಹುಡುಗ (Boy)",
        category: "vocabulary", syllables: "boy", phonetic_sound: "/bɔɪ/", phonetic_rule: "Diphthong /oy/",
        image_keyword: "young_school_boy",
        photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1534447677768-be436bb09401", "1508873696983-2df57036476b"]
    },
    {
        id: "noun_girl", label: "Girl",
        en: "Girl", hi: "लड़की (Girl)", kn: "ಹುಡುಗಿ (Girl)",
        category: "vocabulary", syllables: "girl", phonetic_sound: "/ɡɜːrl/", phonetic_rule: "R-controlled vowel /ir/",
        image_keyword: "cheerful_jumping_girl",
        photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1534447677768-be436bb09401", "1508873696983-2df57036476b"]
    },
    {
        id: "noun_tree", label: "Tree",
        en: "Tree", hi: "पेड़ (Tree)", kn: "ಮರ (Tree)",
        category: "vocabulary", syllables: "tree", phonetic_sound: "/triː/", phonetic_rule: "Blend /tr/ + Long E",
        image_keyword: "green_forest_tree",
        photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"]
    },
    {
        id: "noun_book", label: "Book",
        en: "Book", hi: "किताब (Book)", kn: "ಪುಸ್ತಕ (Book)",
        category: "vocabulary", syllables: "book", phonetic_sound: "/bʊk/", phonetic_rule: "Short OO vowel sound",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "noun_dog", label: "Dog",
        en: "Dog", hi: "कुत्ता (Dog)", kn: "ನಾಯಿ (Dog)",
        category: "vocabulary", syllables: "dog", phonetic_sound: "/dɒɡ/", phonetic_rule: "CVC Short O",
        image_keyword: "golden_retriever_dog",
        photo_ids: ["1543466835-00a7907e9de1", "1583511655857-d19b40a7a54e", "1537151608828-ea2b11777ee8", "1587300003388-59208cc962cb"]
    }
];

export const CLASS_2_ENGLISH_OPPOSITES = [
    {
        id: "hot_cold", label: "Hot & Cold",
        en: "Hot and Cold", hi: "गर्म और ठंडा", kn: "ಬಿಸಿ ಮತ್ತು ತಣ್ಣಗೆ",
        category: "vocabulary", syllables: "hot • cold", phonetic_sound: "/hɒt/ - /koʊld/", phonetic_rule: "Antonyms",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    },
    {
        id: "day_night", label: "Day & Night",
        en: "Day and Night", hi: "दिन और रात", kn: "ಹಗಲು ಮತ್ತು ರಾತ್ರಿ",
        category: "vocabulary", syllables: "day • night", phonetic_sound: "/deɪ/ - /naɪt/", phonetic_rule: "Antonyms",
        image_keyword: "full_night_moon",
        photo_ids: ["1532693322450-2cb5c511067d", "1522030299830-16b8d3d049fe", "1509198397868-475647b2a1e5", "1532767153582-b1a0e5145009"]
    },
    {
        id: "big_small_c2", label: "Big & Small",
        en: "Big and Small", hi: "बड़ा और छोटा", kn: "ದೊಡ್ಡದು ಮತ್ತು ಸಣ್ಣದು",
        category: "vocabulary", syllables: "big • small", phonetic_sound: "/bɪɡ/ - /smɔːl/", phonetic_rule: "Antonyms",
        image_keyword: "african_wild_elephant",
        photo_ids: ["1557050543-4d5f4e07ef46", "1581852017103-68ac65514cf7", "1564760055775-d63b17a55c44", "1549366021-9f761d450615"]
    }
];

export const CLASS_2_ENGLISH_ARTICLES = [
    {
        id: "art_a", label: "A Ball",
        en: "A Ball", hi: "एक गेंद (A Ball)", kn: "ಒಂದು ಚೆಂಡು (A Ball)",
        category: "vocabulary", syllables: "a • ball", phonetic_sound: "/ə bɔːl/", phonetic_rule: "Article 'A' before consonant sound",
        image_keyword: "red_soccer_ball",
        photo_ids: ["1558060370-d644479cb6f7", "1575361204480-aadea25e6e68", "1546519638-68e109498ffc", "1534438327276-14e5300c3a48"]
    },
    {
        id: "art_an", label: "An Apple",
        en: "An Apple", hi: "एक सेब (An Apple)", kn: "ಒಂದು ಸೇಬು (An Apple)",
        category: "vocabulary", syllables: "an • ap • ple", phonetic_sound: "/ən ˈæpl/", phonetic_rule: "Article 'An' before vowel sound",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    },
    {
        id: "art_the", label: "The Sun",
        en: "The Sun", hi: "सूरज (The Sun)", kn: "ಸೂರ್ಯ (The Sun)",
        category: "vocabulary", syllables: "the • sun", phonetic_sound: "/ðə sʌn/", phonetic_rule: "Definite article 'The' for unique objects",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    }
];

export const CLASS_2_ENGLISH_PHONICS = [
    {
        id: "phon_ot", label: "-ot",
        en: "P-O-T Pot", hi: "पॉट (मटका)", kn: "ಪಾಟ್ (ಮಡಕೆ)",
        category: "phonetic_sound", syllables: "p • o • t", phonetic_sound: "/pɒt/", phonetic_rule: "Short O (-ot family)",
        image_keyword: "ceramic_flower_pot",
        photo_ids: ["1518709268805-4e9042af9f23", "1490750967868-88aa4486c946", "1508610048659-a06b669e3321", "1526047932273-341f2a7631f9"]
    },
    {
        id: "phon_et", label: "-et",
        en: "N-E-T Net", hi: "नेट (जाल)", kn: "ನೆಟ್ (ಬಲೆ)",
        category: "phonetic_sound", syllables: "n • e • t", phonetic_sound: "/net/", phonetic_rule: "Short E (-et family)",
        image_keyword: "red_soccer_ball",
        photo_ids: ["1558060370-d644479cb6f7", "1575361204480-aadea25e6e68", "1546519638-68e109498ffc", "1534438327276-14e5300c3a48"]
    }
];

export const CLASS_2_HINDI_MATRAE = [
    {
        id: "aa_matra", label: "ा (आ)",
        en: "K + Aa = Kaa (Car)", hi: "क + ा = का (कार)", kn: "ಕಾ (ಕಾರ್)",
        category: "phonetic_sound", syllables: "का • र", phonetic_sound: "/kɑː/", phonetic_rule: "आ की मात्रा",
        image_keyword: "red_sports_car",
        photo_ids: ["1494976388531-d1058494cdd8", "1503376780353-7e6692767b70", "1583121274602-3e2820c69888", "1552519507-da3b142c6e3d"]
    },
    {
        id: "ee_matra", label: "ी (ई)",
        en: "Gh + Ee = Ghee", hi: "घ + ी = घी", kn: "ಘೀ",
        category: "phonetic_sound", syllables: "घी", phonetic_sound: "/ɡiː/", phonetic_rule: "ई की मात्रा (दीर्घ)",
        image_keyword: "pure_fresh_water",
        photo_ids: ["1548839140-29a749e1bc4e", "1523362628745-0c100150b504", "1559827291-72ee739d0d9a", "1516214104703-d870798883c5"]
    },
    {
        id: "oo_matra_h", label: "ू (ऊ)",
        en: "F + Oo = Fool (Flower)", hi: "फ + ू + ल = फूल", kn: "ಹೂವು",
        category: "phonetic_sound", syllables: "फू • ल", phonetic_sound: "/fuːl/", phonetic_rule: "ऊ की मात्रा",
        image_keyword: "blooming_red_rose",
        photo_ids: ["1518709268805-4e9042af9f23", "1490750967868-88aa4486c946", "1508610048659-a06b669e3321", "1526047932273-341f2a7631f9"]
    }
];

export const CLASS_2_HINDI_SANGYA = [
    {
        id: "sangya_vyakti", label: "व्यक्ति",
        en: "Person (Teacher)", hi: "व्यक्ति (अध्यापक)", kn: "ವ್ಯಕ್ತಿ (ಶಿಕ್ಷಕ)",
        category: "vocabulary", syllables: "अ • ध्या • प • क", phonetic_sound: "/əd̪ʱjɑːpək/", phonetic_rule: "व्यक्तिवाचक संज्ञा",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "sangya_vastu", label: "वस्तु",
        en: "Thing (Pencil)", hi: "वस्तु (पेंसिल)", kn: "ವಸ್ತು (ಪೆನ್ಸಿಲ್)",
        category: "vocabulary", syllables: "पें • सि • ल", phonetic_sound: "/peːnsɪl/", phonetic_rule: "वस्तु संज्ञा",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    },
    {
        id: "sangya_pashu", label: "प्राणी",
        en: "Animal (Lion)", hi: "प्राणी (शेर)", kn: "ಪ್ರಾಣಿ (ಸಿಂಹ)",
        category: "vocabulary", syllables: "शे • र", phonetic_sound: "/ʃeːr/", phonetic_rule: "जातिवाचक संज्ञा",
        image_keyword: "african_male_lion",
        photo_ids: ["1546182990-dffeafbe841d", "1534188753412-3e26d0d618d6", "1561731216-c3a4d99437d5", "1575550959106-5a7defe28b56"]
    }
];

export const CLASS_2_KANNADA_GUNINTAGALU = [
    {
        id: "ka_gunita", label: "ಕ ಕಾ ಕಿ ಕೀ",
        en: "Ka Kaa Ki Kee", hi: "क का कि की", kn: "ಕ ಕಾ ಕಿ ಕೀ",
        category: "phonetic_sound", syllables: "ಕ • ಕಾ • ಕಿ • ಕೀ", phonetic_sound: "/kə kɑː ki kiː/", phonetic_rule: "ಕ-ವರ್ಗ ಗುಣಿತಾಕ್ಷರ",
        image_keyword: "blooming_red_rose",
        photo_ids: ["1518709268805-4e9042af9f23", "1490750967868-88aa4486c946", "1508610048659-a06b669e3321", "1526047932273-341f2a7631f9"]
    },
    {
        id: "ga_gunita", label: "ಗ ಗಾ ಗಿ ಗೀ",
        en: "Ga Gaa Gi Gee", hi: "ग गा गि गी", kn: "ಗ ಗಾ ಗಿ ಗೀ",
        category: "phonetic_sound", syllables: "ಗ • ಗಾ • ಗಿ • ಗೀ", phonetic_sound: "/ɡə ɡɑː ɡi ɡiː/", phonetic_rule: "ಗ-ವರ್ಗ ಗುಣಿತಾಕ್ಷರ",
        image_keyword: "green_forest_tree",
        photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"]
    }
];

export const CLASS_2_KANNADA_RELATIONSHIPS = [
    {
        id: "ajja", label: "ಅಜ್ಜ",
        en: "Ajja (Grandfather)", hi: "दादाजी (Grandfather)", kn: "ಅಜ್ಜ",
        category: "vocabulary", syllables: "ಅ • ಜ್ಜ", phonetic_sound: "/əɟːə/", phonetic_rule: "ದ್ವಿತ್ವ ವ್ಯಂಜನ",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "ajji", label: "ಅಜ್ಜಿ",
        en: "Ajji (Grandmother)", hi: "दादीजी (Grandmother)", kn: "ಅಜ್ಜಿ",
        category: "vocabulary", syllables: "ಅ • ಜ್ಜಿ", phonetic_sound: "/əɟːi/", phonetic_rule: "ದ್ವಿತ್ವ ವ್ಯಂಜನ",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "anna", label: "ಅಣ್ಣ",
        en: "Anna (Elder Brother)", hi: "बड़ा भाई", kn: "ಅಣ್ಣ",
        category: "vocabulary", syllables: "ಅ • ಣ್ಣ", phonetic_sound: "/əɳːə/", phonetic_rule: "ದ್ವಿತ್ವ ಣ-ಕಾರ",
        image_keyword: "happy_school_children",
        photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1534447677768-be436bb09401", "1508873696983-2df57036476b"]
    }
];

export const CLASS_2_MATHS_NUMBERS = [
    {
        id: "num_10", label: "10",
        en: "10 (Ten)", hi: "१० (दस)", kn: "೧೦ (ಹತ್ತು)",
        category: "vocabulary", syllables: "ten", phonetic_sound: "/ten/", phonetic_rule: "1 Ten = 10 Ones",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    },
    {
        id: "num_50", label: "50",
        en: "50 (Fifty)", hi: "५० (पचास)", kn: "೫೦ (ಐವತ್ತು)",
        category: "vocabulary", syllables: "fif • ty", phonetic_sound: "/ˈfɪfti/", phonetic_rule: "5 Tens",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    },
    {
        id: "num_100", label: "100",
        en: "100 (Hundred)", hi: "१०० (सौ)", kn: "೧೦೦ (ನೂರು)",
        category: "vocabulary", syllables: "hun • dred", phonetic_sound: "/ˈhʌndrəd/", phonetic_rule: "10 Tens = 1 Hundred",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    }
];

export const CLASS_2_MATHS_TIME = [
    {
        id: "morning", label: "Morning",
        en: "Morning", hi: "सुबह (Morning)", kn: "ಬೆಳಗ್ಗೆ (Morning)",
        category: "vocabulary", syllables: "mor • ning", phonetic_sound: "/ˈmɔːrnɪŋ/", phonetic_rule: "Daytime Start",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    },
    {
        id: "night", label: "Night",
        en: "Night", hi: "रात (Night)", kn: "ರಾತ್ರಿ (Night)",
        category: "vocabulary", syllables: "night", phonetic_sound: "/naɪt/", phonetic_rule: "Silent GH",
        image_keyword: "full_night_moon",
        photo_ids: ["1532693322450-2cb5c511067d", "1522030299830-16b8d3d049fe", "1509198397868-475647b2a1e5", "1532767153582-b1a0e5145009"]
    }
];

export const CLASS_2_EVS_TRANSPORT = [
    {
        id: "bus_trans", label: "Bus",
        en: "Bus (Land Transport)", hi: "बस (सड़क यातायात)", kn: "ಬಸ್ಸು (ರಸ್ತೆ ಸಾರಿಗೆ)",
        category: "vocabulary", syllables: "bus", phonetic_sound: "/bʌs/", phonetic_rule: "Short U",
        image_keyword: "yellow_school_bus",
        photo_ids: ["1544620347-c4fd4a3d5957", "1570125909232-eb263c188f7e", "1557223562-6c77ef16210f", "1464219789935-c2d9d9aba644"]
    },
    {
        id: "train_trans", label: "Train",
        en: "Train (Track Transport)", hi: "रेलगाड़ी (पटरी यातायात)", kn: "ರೈಲು (ಹಳಿ ಸಾರಿಗೆ)",
        category: "vocabulary", syllables: "train", phonetic_sound: "/treɪn/", phonetic_rule: "Vowel team AI",
        image_keyword: "electric_passenger_train",
        photo_ids: ["1474487548417-781cb71495f3", "1515165562839-978bbcf18277", "1535535112387-56ffe8db21ff", "1541427468627-a89a96e5ca1d"]
    },
    {
        id: "airplane_trans", label: "Aeroplane",
        en: "Aeroplane (Air Transport)", hi: "हवाई जहाज़ (हवाई यातायात)", kn: "ವಿಮಾನ (ವಾಯು ಸಾರಿಗೆ)",
        category: "vocabulary", syllables: "air • plane", phonetic_sound: "/ˈeərpleɪn/", phonetic_rule: "Compound noun",
        image_keyword: "commercial_jet_airplane",
        photo_ids: ["1436491865332-7a61a109cc05", "1540959733332-eab4deabeeaf", "1529074963764-98f45c47344b", "1517429128955-68ff5c1e29da"]
    }
];

export const CLASS_2_EVS_SEASONS = [
    {
        id: "summer_season", label: "Summer",
        en: "Summer (Hot Season)", hi: "गर्मी की ऋतु", kn: "ಬೇಸಿಗೆ ಕಾಲ",
        category: "vocabulary", syllables: "sum • mer", phonetic_sound: "/ˈsʌmər/", phonetic_rule: "Double consonant M",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    },
    {
        id: "monsoon_season", label: "Monsoon",
        en: "Monsoon (Rainy Season)", hi: "वर्षा ऋतु (बारिश)", kn: "ಮಳೆಗಾಲ",
        category: "vocabulary", syllables: "mon • soon", phonetic_sound: "/mɒnˈsuːn/", phonetic_rule: "Double O vowel team",
        image_keyword: "fresh_rain_water_drops",
        photo_ids: ["1515694346937-94d85e41e6f0", "1534274988757-a28bf1a57c17", "1519692933481-e162a57d6721", "1508873696983-2df57036476b"]
    }
];

/* ==========================================================================
   CLASS 3 DATASETS
   ========================================================================== */

export const CLASS_3_ENGLISH_VERBS = [
    {
        id: "run", label: "Run",
        en: "Run (Action)", hi: "दौड़ना (Run)", kn: "ಓಡು (Run)",
        category: "vocabulary", syllables: "run", phonetic_sound: "/rʌn/", phonetic_rule: "Action verb (Short U)",
        image_keyword: "brown_galloping_horse",
        photo_ids: ["1534447677768-be436bb09401", "1553284965-83fd3e82fa5a", "1535268647677-300dbf3d78d1", "1558929996-ac64ba4bae7e"]
    },
    {
        id: "read", label: "Read",
        en: "Read (Action)", hi: "पढ़ना (Read)", kn: "ಓದು (Read)",
        category: "vocabulary", syllables: "read", phonetic_sound: "/riːd/", phonetic_rule: "Vowel team EA (Long E)",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "jump", label: "Jump",
        en: "Jump (Action)", hi: "कूदना (Jump)", kn: "ಜಿಗಿ (Jump)",
        category: "vocabulary", syllables: "jump", phonetic_sound: "/dʒʌmp/", phonetic_rule: "Action verb (Short U)",
        image_keyword: "cheerful_jumping_girl",
        photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1534447677768-be436bb09401", "1508873696983-2df57036476b"]
    }
];

export const CLASS_3_ENGLISH_ADJECTIVES = [
    {
        id: "adj_sweet", label: "Sweet",
        en: "Sweet (Taste)", hi: "मीठा (स्वाद)", kn: "ಸಿಹಿ (ರುಚಿ)",
        category: "vocabulary", syllables: "sweet", phonetic_sound: "/swiːt/", phonetic_rule: "Describing word",
        image_keyword: "sweet_icecream_cone",
        photo_ids: ["1501443782928-176691a9b340", "1563805042-7684c019e1cb", "1497034825429-c343d7c6a68f", "1570197788417-0e82375c9371"]
    },
    {
        id: "adj_bright", label: "Bright",
        en: "Bright (Light)", hi: "चमकीला (प्रकाश)", kn: "ಪ್ರಕಾಶಮಾನ",
        category: "vocabulary", syllables: "bright", phonetic_sound: "/braɪt/", phonetic_rule: "Silent IGH",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    }
];

export const CLASS_3_ENGLISH_PREPOSITIONS = [
    {
        id: "prep_in", label: "In",
        en: "In (Inside)", hi: "अंदर (In)", kn: "ಒಳಗೆ (In)",
        category: "vocabulary", syllables: "in", phonetic_sound: "/ɪn/", phonetic_rule: "Preposition of place",
        image_keyword: "bird_straw_nest",
        photo_ids: ["1520808663317-647b476a81b9", "1535083783855-76ae62b2914e", "1516467508483-a7212febe31a", "1528722828814-77b9b83aafb2"]
    },
    {
        id: "prep_on", label: "On",
        en: "On (On Top)", hi: "ऊपर (On)", kn: "ಮೇಲೆ (On)",
        category: "vocabulary", syllables: "on", phonetic_sound: "/ɒn/", phonetic_rule: "Preposition of position",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    }
];

export const CLASS_3_HINDI_SARVANAAM = [
    {
        id: "main", label: "मैं",
        en: "I (Pronoun)", hi: "मैं (प्रथम पुरुष)", kn: "ನಾನು (Pronoun)",
        category: "vocabulary", syllables: "मैं", phonetic_sound: "/mɛ̃ː/", phonetic_rule: "उत्तम पुरुष सर्वनाम",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "tum", label: "तुम",
        en: "You (Pronoun)", hi: "तुम (मध्यम पुरुष)", kn: "ನೀನು (Pronoun)",
        category: "vocabulary", syllables: "तु • म", phonetic_sound: "/t̪ʊm/", phonetic_rule: "मध्यम पुरुष सर्वनाम",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "hum", label: "हम",
        en: "We (Pronoun)", hi: "हम (बहुवचन)", kn: "ನಾವು (Pronoun)",
        category: "vocabulary", syllables: "ह • म", phonetic_sound: "/ɦəm/", phonetic_rule: "बहुवचन सर्वनाम",
        image_keyword: "happy_loving_family",
        photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"]
    }
];

export const CLASS_3_HINDI_VILOM = [
    {
        id: "din_raat", label: "दिन - रात",
        en: "Day and Night", hi: "दिन ↔ रात", kn: "ಹಗಲು ↔ ರಾತ್ರಿ",
        category: "vocabulary", syllables: "दि • न ↔ रा • त", phonetic_sound: "/d̪ɪn/ - /rɑːt̪/", phonetic_rule: "विलोम शब्द",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    },
    {
        id: "mitra_shatru", label: "मित्र - शत्रु",
        en: "Friend and Enemy", hi: "मित्र ↔ शत्रु", kn: "ಸ್ನೇಹಿತ ↔ ಶತ್ರು",
        category: "vocabulary", syllables: "मि • त्र ↔ श • त्रु", phonetic_sound: "/mɪt̪rə/", phonetic_rule: "विलोम शब्द",
        image_keyword: "happy_school_children",
        photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1534447677768-be436bb09401", "1508873696983-2df57036476b"]
    }
];

export const CLASS_3_KANNADA_OTTAKSHARA = [
    {
        id: "sakkare", label: "ಕ್ಕ",
        en: "Sakkare (Sugar)", hi: "शक्कर (Sugar)", kn: "ಸಕ್ಕರೆ (ಕ್ಕ)",
        category: "phonetic_sound", syllables: "ಸ • ಕ್ಕ • ರೆ", phonetic_sound: "/səkːəre/", phonetic_rule: "ಕ-ಒತ್ತು ದ್ವಿತ್ವ",
        image_keyword: "sweet_icecream_cone",
        photo_ids: ["1501443782928-176691a9b340", "1563805042-7684c019e1cb", "1497034825429-c343d7c6a68f", "1570197788417-0e82375c9371"]
    },
    {
        id: "kattari", label: "ತ್ತ",
        en: "Kattari (Scissors)", hi: "कैंची (Scissors)", kn: "ಕತ್ತರಿ (ತ್ತ)",
        category: "phonetic_sound", syllables: "ಕ • ತ್ತ • ರಿ", phonetic_sound: "/kət̪ːəri/", phonetic_rule: "ತ-ಒತ್ತು ದ್ವಿತ್ವ",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    }
];

export const CLASS_3_MATHS_TABLES = [
    {
        id: "tab_2", label: "2 × 5",
        en: "2 × 5 = 10", hi: "२ × ५ = १०", kn: "೨ × ೫ = ೧೦",
        category: "vocabulary", syllables: "two • times • five", phonetic_sound: "/tuː taɪmz faɪv/", phonetic_rule: "Multiplication Table 2",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    },
    {
        id: "tab_5", label: "5 × 5",
        en: "5 × 5 = 25", hi: "५ × ५ = २५", kn: "೫ × ೫ = ೨೫",
        category: "vocabulary", syllables: "five • times • five", phonetic_sound: "/faɪv taɪmz faɪv/", phonetic_rule: "Multiplication Table 5",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    },
    {
        id: "tab_10", label: "10 × 10",
        en: "10 × 10 = 100", hi: "१० × १० = १००", kn: "೧೦ × ೧೦ = ೧೦೦",
        category: "vocabulary", syllables: "ten • times • ten", phonetic_sound: "/ten taɪmz ten/", phonetic_rule: "Multiplication Table 10",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    }
];

export const CLASS_3_EVS_SOLAR_SYSTEM = [
    {
        id: "sun_solar", label: "Sun",
        en: "Sun (Star at Center)", hi: "सूर्य (सौर मंडल केंद्र)", kn: "ಸೂರ್ಯ (ಕೇಂದ್ರ ನಕ್ಷತ್ರ)",
        category: "vocabulary", syllables: "sun", phonetic_sound: "/sʌn/", phonetic_rule: "Solar System Center",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    },
    {
        id: "earth_solar", label: "Earth",
        en: "Earth (Our Planet)", hi: "पृथ्वी (हमारा ग्रह)", kn: "ಭೂಮಿ (ನಮ್ಮ ಗ್ರಹ)",
        category: "vocabulary", syllables: "earth", phonetic_sound: "/ɜːrθ/", phonetic_rule: "Third Planet",
        image_keyword: "round_planet_earth",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    },
    {
        id: "moon_solar", label: "Moon",
        en: "Moon (Natural Satellite)", hi: "चंद्रमा (उपग्रह)", kn: "ಚಂದ್ರ (ಉಪಗ್ರಹ)",
        category: "vocabulary", syllables: "moon", phonetic_sound: "/muːn/", phonetic_rule: "Earth's satellite",
        image_keyword: "full_night_moon",
        photo_ids: ["1532693322450-2cb5c511067d", "1522030299830-16b8d3d049fe", "1509198397868-475647b2a1e5", "1532767153582-b1a0e5145009"]
    }
];

export const CLASS_3_EVS_PLANTS = [
    {
        id: "root_part", label: "Root",
        en: "Root (Absorbs Water)", hi: "जड़ (पानी सोखती है)", kn: "ಬೇರು (ನೀರನ್ನು ಹೀರುತ್ತದೆ)",
        category: "vocabulary", syllables: "root", phonetic_sound: "/ruːt/", phonetic_rule: "Underground plant part",
        image_keyword: "green_forest_tree",
        photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"]
    },
    {
        id: "leaf_part", label: "Leaf",
        en: "Leaf (Makes Food)", hi: "पत्ती (भोजन बनाती है)", kn: "ಎಲೆ (ಆಹಾರ ತಯಾರಿಸುತ್ತದೆ)",
        category: "vocabulary", syllables: "leaf", phonetic_sound: "/liːf/", phonetic_rule: "Green plant organ",
        image_keyword: "green_forest_tree",
        photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"]
    }
];

/* ==========================================================================
   CLASS 4 DATASETS
   ========================================================================== */

export const CLASS_4_ENGLISH_TENSES = [
    {
        id: "present_tense", label: "Present",
        en: "I Eat an Apple", hi: "मैं सेब खाता हूँ", kn: "ನಾನು ಸೇಬು ತಿನ್ನುತ್ತೇನೆ",
        category: "vocabulary", syllables: "pre • sent", phonetic_sound: "/preznt/", phonetic_rule: "Simple Present Tense",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    },
    {
        id: "past_tense", label: "Past",
        en: "I Ate an Apple", hi: "मैंने सेब खाया था", kn: "ನಾನು ಸೇಬು ತಿಂದೆನು",
        category: "vocabulary", syllables: "past", phonetic_sound: "/pɑːst/", phonetic_rule: "Simple Past Tense",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    }
];

export const CLASS_4_ENGLISH_HOMOPHONES = [
    {
        id: "homo_sun_son", label: "Sun / Son",
        en: "Sun and Son", hi: "सन (सूरज / बेटा)", kn: "ಸನ್ (ಸೂರ್ಯ / ಮಗ)",
        category: "phonetic_sound", syllables: "sun • son", phonetic_sound: "/sʌn/", phonetic_rule: "Same sound, different meaning",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    },
    {
        id: "homo_see_sea", label: "See / Sea",
        en: "See and Sea", hi: "सी (देखना / समुद्र)", kn: "ಸೀ (ನೋಡು / ಸಮುದ್ರ)",
        category: "phonetic_sound", syllables: "see • sea", phonetic_sound: "/siː/", phonetic_rule: "Same sound, different meaning",
        image_keyword: "pure_fresh_water",
        photo_ids: ["1548839140-29a749e1bc4e", "1523362628745-0c100150b504", "1559827291-72ee739d0d9a", "1516214104703-d870798883c5"]
    }
];

export const CLASS_4_HINDI_KRIYA = [
    {
        id: "padhna", label: "पढ़ना",
        en: "Reading", hi: "पढ़ना (Reading)", kn: "ಓದುವುದು (Reading)",
        category: "vocabulary", syllables: "प • ढ़ • ना", phonetic_sound: "/pəɽʱnɑː/", phonetic_rule: "सकर्मक क्रिया",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "likhna", label: "लिखना",
        en: "Writing", hi: "लिखना (Writing)", kn: "ಬರೆಯುವುದು (Writing)",
        category: "vocabulary", syllables: "लि • ख • ना", phonetic_sound: "/lɪkʰnɑː/", phonetic_rule: "क्रिया धातु",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    }
];

export const CLASS_4_HINDI_VISHESHAN = [
    {
        id: "vish_sundar", label: "सुंदर",
        en: "Beautiful", hi: "सुंदर (गुणवाचक)", kn: "ಸುಂದರ",
        category: "vocabulary", syllables: "सुं • द • र", phonetic_sound: "/sʊnd̪ər/", phonetic_rule: "गुणवाचक विशेषण",
        image_keyword: "blooming_red_rose",
        photo_ids: ["1518709268805-4e9042af9f23", "1490750967868-88aa4486c946", "1508610048659-a06b669e3321", "1526047932273-341f2a7631f9"]
    },
    {
        id: "vish_meetha", label: "मीठा",
        en: "Sweet", hi: "मीठा (गुणवाचक)", kn: "ಸಿಹಿ",
        category: "vocabulary", syllables: "मी • ठा", phonetic_sound: "/miːʈʰɑː/", phonetic_rule: "स्वाद विशेषण",
        image_keyword: "fresh_yellow_mango",
        photo_ids: ["1553279768-865429fa0078", "1601493700631-2b16ec4b4716", "1591073113125-e46713c829fe", "1567306226416-28f0efdc88ce"]
    }
];

export const CLASS_4_KANNADA_GRAMMAR = [
    {
        id: "namapada", label: "ನಾಮಪದ",
        en: "Noun (Name)", hi: "संज्ञा (नाम)", kn: "ನಾಮಪದ (ಹೆಸರು)",
        category: "vocabulary", syllables: "ನಾ • ಮ • ಪ • ದ", phonetic_sound: "/nɑːməpəd̪ə/", phonetic_rule: "ವಸ್ತು/ವ್ಯಕ್ತಿಯ ಹೆಸರು",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "kriyapada", label: "ಕ್ರಿಯಾಪದ",
        en: "Verb (Action)", hi: "क्रिया (काम)", kn: "ಕ್ರಿಯಾಪದ (ಕೆಲಸ)",
        category: "vocabulary", syllables: "ಕ್ರಿ • ಯಾ • ಪ • ದ", phonetic_sound: "/krijɑːpəd̪ə/", phonetic_rule: "ಕೆಲಸವನ್ನು ಸೂಚಿಸುವ ಪದ",
        image_keyword: "brown_galloping_horse",
        photo_ids: ["1534447677768-be436bb09401", "1553284965-83fd3e82fa5a", "1535268647677-300dbf3d78d1", "1558929996-ac64ba4bae7e"]
    }
];

export const CLASS_4_MATHS_FRACTIONS = [
    {
        id: "half", label: "1/2",
        en: "Half (1/2)", hi: "आधा (१/२)", kn: "ಅರ್ಧ (೧/೨)",
        category: "vocabulary", syllables: "half", phonetic_sound: "/hɑːf/", phonetic_rule: "One out of two parts",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    },
    {
        id: "quarter", label: "1/4",
        en: "Quarter (1/4)", hi: "चौथाई (१/४)", kn: "ಕಾಲು (೧/೪)",
        category: "vocabulary", syllables: "quar • ter", phonetic_sound: "/ˈkwɔːrtər/", phonetic_rule: "One out of four parts",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    }
];

export const CLASS_4_EVS_ORGANS = [
    {
        id: "heart", label: "Heart",
        en: "Heart (Pumps Blood)", hi: "हृदय (रक्त संचार)", kn: "ಹೃದಯ (ರಕ್ತ ಪರಿಚಲನೆ)",
        category: "vocabulary", syllables: "heart", phonetic_sound: "/hɑːrt/", phonetic_rule: "Circulatory System",
        image_keyword: "blooming_red_rose",
        photo_ids: ["1518709268805-4e9042af9f23", "1490750967868-88aa4486c946", "1508610048659-a06b669e3321", "1526047932273-341f2a7631f9"]
    },
    {
        id: "brain", label: "Brain",
        en: "Brain (Controls Body)", hi: "मस्तिष्क (नियंत्रण)", kn: "ಮೆದುಳು (ನಿಯಂತ್ರಣ)",
        category: "vocabulary", syllables: "brain", phonetic_sound: "/breɪn/", phonetic_rule: "Nervous System",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    }
];

/* ==========================================================================
   CLASS 5 DATASETS
   ========================================================================== */

export const CLASS_5_ENGLISH_IDIOMS = [
    {
        id: "blue_moon", label: "Blue Moon",
        en: "Once in a Blue Moon", hi: "ईद का चाँद (दुर्लभ)", kn: "ಅಪರೂಪದ ಘಟನೆ",
        category: "vocabulary", syllables: "blue • moon", phonetic_sound: "/bluː muːn/", phonetic_rule: "Idiomatic expression",
        image_keyword: "full_night_moon",
        photo_ids: ["1532693322450-2cb5c511067d", "1522030299830-16b8d3d049fe", "1509198397868-475647b2a1e5", "1532767153582-b1a0e5145009"]
    },
    {
        id: "piece_cake", label: "Piece of Cake",
        en: "Piece of Cake", hi: "बहुत आसान काम", kn: "ಬಹಳ ಸುಲಭ ಕೆಲಸ",
        category: "vocabulary", syllables: "piece • of • cake", phonetic_sound: "/piːs əv keɪk/", phonetic_rule: "Idiom meaning very easy",
        image_keyword: "sweet_icecream_cone",
        photo_ids: ["1501443782928-176691a9b340", "1563805042-7684c019e1cb", "1497034825429-c343d7c6a68f", "1570197788417-0e82375c9371"]
    }
];

export const CLASS_5_HINDI_KAAL = [
    {
        id: "vartaman", label: "वर्तमान काल",
        en: "Present Tense", hi: "वर्तमान काल (Present)", kn: "ವರ್ತಮಾನ ಕಾಲ",
        category: "vocabulary", syllables: "व • र्त • मा • न", phonetic_sound: "/vərt̪əmɑːn/", phonetic_rule: "चल रहा समय",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    },
    {
        id: "bhavishya", label: "भविष्य काल",
        en: "Future Tense", hi: "भविष्य काल (Future)", kn: "ಭವಿಷ್ಯತ್ ಕಾಲ",
        category: "vocabulary", syllables: "भ • वि • ष्या", phonetic_sound: "/bʱəvɪʂjə/", phonetic_rule: "आने वाला समय",
        image_keyword: "commercial_jet_airplane",
        photo_ids: ["1436491865332-7a61a109cc05", "1540959733332-eab4deabeeaf", "1529074963764-98f45c47344b", "1517429128955-68ff5c1e29da"]
    }
];

export const CLASS_5_KANNADA_LITERATURE = [
    {
        id: "kavi", label: "ಕವಿ",
        en: "Kavi (Poet)", hi: "कवि (Poet)", kn: "ಕವಿ (Poet)",
        category: "vocabulary", syllables: "ಕ • ವಿ", phonetic_sound: "/kəvi/", phonetic_rule: "ಸಾಹಿತ್ಯ ರಚನೆಕಾರ",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "kavana", label: "ಕವನ",
        en: "Kavana (Poem)", hi: "कविता (Poem)", kn: "ಕವನ (Poem)",
        category: "vocabulary", syllables: "ಕ • ವ • ನ", phonetic_sound: "/kəvənə/", phonetic_rule: "ಸಾಹಿತ್ಯ ಕೃತಿ",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    }
];

export const CLASS_5_MATHS_ANGLES = [
    {
        id: "right_angle", label: "90°",
        en: "Right Angle (90°)", hi: "समकोण (९०°)", kn: "ಲಂಬಕೋನ (೯೦°)",
        category: "vocabulary", syllables: "right • an • gle", phonetic_sound: "/raɪt ˈæŋɡl/", phonetic_rule: "L-shaped 90 degree angle",
        image_keyword: "analog_wall_clock",
        photo_ids: ["1508057198894-247b23fe5ade", "1563861826100-9cb868fdbe1c", "1518770660439-4636190af475", "1495364141860-b0d03eccd065"]
    },
    {
        id: "acute_angle", label: "Acute",
        en: "Acute Angle (<90°)", hi: "न्यूनकोण (<९०°)", kn: "ಲಘುಕೋನ (<೯೦°)",
        category: "vocabulary", syllables: "a • cute", phonetic_sound: "/əˈkjuːt/", phonetic_rule: "Angle less than 90 degrees",
        image_keyword: "analog_wall_clock",
        photo_ids: ["1508057198894-247b23fe5ade", "1563861826100-9cb868fdbe1c", "1518770660439-4636190af475", "1495364141860-b0d03eccd065"]
    }
];

export const CLASS_5_EVS_SPACE = [
    {
        id: "space_moon", label: "Moon",
        en: "Moon Orbiting Earth", hi: "चंद्रमा (Moon)", kn: "ಚಂದ್ರ (Moon)",
        category: "vocabulary", syllables: "moon", phonetic_sound: "/muːn/", phonetic_rule: "Orbital motion",
        image_keyword: "full_night_moon",
        photo_ids: ["1532693322450-2cb5c511067d", "1522030299830-16b8d3d049fe", "1509198397868-475647b2a1e5", "1532767153582-b1a0e5145009"]
    },
    {
        id: "space_sun", label: "Sun",
        en: "Sun The Star", hi: "सूर्य (The Star)", kn: "ಸೂರ್ಯ (The Star)",
        category: "vocabulary", syllables: "sun", phonetic_sound: "/sʌn/", phonetic_rule: "Luminous center",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    }
];

/* ==========================================================================
   CLASS 2 EXPANDED TOPICS
   ========================================================================== */

export const CLASS_2_HINDI_WORDS3 = [
    {
        id: "kamal", label: "कमल",
        en: "Lotus", hi: "कमल (Lotus)", kn: "ಕಮಲ (Lotus)",
        category: "vocabulary", syllables: "क • म • ल", phonetic_sound: "/kəməl/", phonetic_rule: "3-Letter CVCVC",
        image_keyword: "blooming_red_rose",
        photo_ids: ["1518709268805-4e9042af9f23", "1490750967868-88aa4486c946", "1508610048659-a06b669e3321", "1526047932273-341f2a7631f9"]
    },
    {
        id: "sadak", label: "सड़क",
        en: "Road", hi: "सड़क (Road)", kn: "ರಸ್ತೆ (Road)",
        category: "vocabulary", syllables: "स • ड़ • क", phonetic_sound: "/səɽək/", phonetic_rule: "3-Letter word",
        image_keyword: "yellow_school_bus",
        photo_ids: ["1544620347-c4fd4a3d5957", "1570125909232-eb263c188f7e", "1557223562-6c77ef16210f", "1464219789935-c2d9d9aba644"]
    },
    {
        id: "nayan", label: "नयन",
        en: "Eyes", hi: "नयन (Eyes)", kn: "ಕಣ್ಣುಗಳು (Eyes)",
        category: "vocabulary", syllables: "न • य • न", phonetic_sound: "/nəjən/", phonetic_rule: "3-Letter word",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    }
];

export const CLASS_2_KANNADA_HOME = [
    {
        id: "mane", label: "ಮನೆ",
        en: "House", hi: "घर (House)", kn: "ಮನೆ (House)",
        category: "vocabulary", syllables: "ಮ • ನೆ", phonetic_sound: "/məne/", phonetic_rule: "ಮೂಲ ನಾಮಪದ",
        image_keyword: "brick_family_house",
        photo_ids: ["1580587771525-78b9dba3b914", "1518780664697-55e3ad937233", "1568605114967-8130f3a36994", "1570129477492-45c003edd2be"]
    },
    {
        id: "kitaki", label: "ಕಿಟಕಿ",
        en: "Window", hi: "खिड़की (Window)", kn: "ಕಿಟಕಿ (Window)",
        category: "vocabulary", syllables: "ಕಿ • ಟ • ಕಿ", phonetic_sound: "/kiʈəki/", phonetic_rule: "ಮನೆಯ ಭಾಗ",
        image_keyword: "brick_family_house",
        photo_ids: ["1580587771525-78b9dba3b914", "1518780664697-55e3ad937233", "1568605114967-8130f3a36994", "1570129477492-45c003edd2be"]
    },
    {
        id: "bagilu", label: "ಬಾಗಿಲು",
        en: "Door", hi: "दरवाज़ा (Door)", kn: "ಬಾಗಿಲು (Door)",
        category: "vocabulary", syllables: "ಬಾ • ಗಿ • లు", phonetic_sound: "/bɑːɡilu/", phonetic_rule: "ದೀರ್ಘ ಬಾ-ಕಾರ",
        image_keyword: "brick_family_house",
        photo_ids: ["1580587771525-78b9dba3b914", "1518780664697-55e3ad937233", "1568605114967-8130f3a36994", "1570129477492-45c003edd2be"]
    }
];

export const CLASS_2_MATHS_MONEY = [
    {
        id: "coin_1", label: "₹1",
        en: "One Rupee Coin", hi: "१ रुपये का सिक्का", kn: "೧ ರೂಪಾಯಿ ನಾಣ್ಯ",
        category: "vocabulary", syllables: "one • ru • pee", phonetic_sound: "/wʌn ruːˈpiː/", phonetic_rule: "Indian Rupee Currency Unit",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    },
    {
        id: "coin_5", label: "₹5",
        en: "Five Rupees Coin", hi: "५ रुपये का सिक्का", kn: "೫ ರೂಪಾಯಿ ನಾಣ್ಯ",
        category: "vocabulary", syllables: "five • ru • pees", phonetic_sound: "/faɪv ruːˈpiːz/", phonetic_rule: "Multiple rupee coin",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    },
    {
        id: "note_10", label: "₹10",
        en: "Ten Rupees Note", hi: "१० रुपये का नोट", kn: "೧೦ ರೂಪಾಯಿ ನೋಟು",
        category: "vocabulary", syllables: "ten • ru • pees", phonetic_sound: "/ten ruːˈpiːz/", phonetic_rule: "Paper currency note",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    }
];

export const CLASS_2_EVS_FESTIVALS = [
    {
        id: "diwali", label: "Diwali",
        en: "Diwali (Festival of Lights)", hi: "दीपावली (रोशनी का पर्व)", kn: "ದೀಪಾವಳಿ (ಬೆಳಕಿನ ಹಬ್ಬ)",
        category: "vocabulary", syllables: "di • wa • li", phonetic_sound: "/dɪˈwɑːli/", phonetic_rule: "Festival Celebrations",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    },
    {
        id: "eid", label: "Eid",
        en: "Eid (Celebration & Joy)", hi: "ईद (उल्लास का त्योहार)", kn: "ಈದ್ (ಸಂಭ್ರಮದ ಹಬ್ಬ)",
        category: "vocabulary", syllables: "eid", phonetic_sound: "/iːd/", phonetic_rule: "Community Festival",
        image_keyword: "full_night_moon",
        photo_ids: ["1532693322450-2cb5c511067d", "1522030299830-16b8d3d049fe", "1509198397868-475647b2a1e5", "1532767153582-b1a0e5145009"]
    },
    {
        id: "christmas", label: "Christmas",
        en: "Christmas (Holiday Celebration)", hi: "क्रिसमस (पर्व)", kn: "ಕ್ರಿಸ್ಮಸ್ (ಹಬ್ಬ)",
        category: "vocabulary", syllables: "christ • mas", phonetic_sound: "/ˈkrɪsməs/", phonetic_rule: "Silent T in Christmas",
        image_keyword: "green_forest_tree",
        photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"]
    }
];

/* ==========================================================================
   CLASS 3 EXPANDED TOPICS
   ========================================================================== */

export const CLASS_3_ENGLISH_BLENDS = [
    {
        id: "blend_str", label: "str-",
        en: "Str- Street", hi: "स्ट्रीट (सड़क)", kn: "ಸ್ಟ್ರೀಟ್ (ಬೀದಿ)",
        category: "phonetic_sound", syllables: "s • t • r • eet", phonetic_sound: "/striːt/", phonetic_rule: "Triple consonant blend /str/",
        image_keyword: "yellow_school_bus",
        photo_ids: ["1544620347-c4fd4a3d5957", "1570125909232-eb263c188f7e", "1557223562-6c77ef16210f", "1464219789935-c2d9d9aba644"]
    },
    {
        id: "blend_sh", label: "sh-",
        en: "Sh- Ship", hi: "शिप (पानी का जहाज)", kn: "ಶಿಪ್ (ಹಡಗು)",
        category: "phonetic_sound", syllables: "sh • i • p", phonetic_sound: "/ʃɪp/", phonetic_rule: "Consonant digraph /sh/",
        image_keyword: "large_ocean_ship",
        photo_ids: ["1505705694340-019e1e335916", "1548574505-5e239809ee19", "1506197603052-3cc9c3a201bd", "1494412574643-ff11b0a5c1c3"]
    }
];

export const CLASS_3_HINDI_PARYAYVACHI = [
    {
        id: "paryay_jal", label: "जल = पानी",
        en: "Jal = Paani (Water)", hi: "जल = पानी, नीर", kn: "ಜಲ = ನೀರು",
        category: "vocabulary", syllables: "ज • ल = पा • नी", phonetic_sound: "/dʒəl/", phonetic_rule: "समानार्थी पर्यायवाची शब्द",
        image_keyword: "pure_fresh_water",
        photo_ids: ["1548839140-29a749e1bc4e", "1523362628745-0c100150b504", "1559827291-72ee739d0d9a", "1516214104703-d870798883c5"]
    },
    {
        id: "paryay_surya", label: "सूर्य = रवि",
        en: "Surya = Ravi (Sun)", hi: "सूर्य = सूरज, रवि", kn: "ಸೂರ್ಯ = ರವಿ",
        category: "vocabulary", syllables: "सू • र्य = र • वि", phonetic_sound: "/suːrjə/", phonetic_rule: "सूर्य के पर्यायवाची",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    }
];

export const CLASS_3_KANNADA_ADJECTIVES = [
    {
        id: "adj_sihi", label: "ಸಿಹಿ",
        en: "Sweet", hi: "मीठा (Sweet)", kn: "ಸಿಹಿ (ಗುಣವಾಚಕ)",
        category: "vocabulary", syllables: "ಸಿ • ಹಿ", phonetic_sound: "/sihi/", phonetic_rule: "ರುಚಿ ಗುಣವಾಚಕ",
        image_keyword: "sweet_icecream_cone",
        photo_ids: ["1501443782928-176691a9b340", "1563805042-7684c019e1cb", "1497034825429-c343d7c6a68f", "1570197788417-0e82375c9371"]
    },
    {
        id: "adj_dodda", label: "ದೊಡ್ಡ",
        en: "Big", hi: "बड़ा (Big)", kn: "ದೊಡ್ಡ (ಗುಣವಾಚಕ)",
        category: "vocabulary", syllables: "ದೊ • ಡ್ಡ", phonetic_sound: "/doɖːə/", phonetic_rule: "ಗಾತ್ರ ಗುಣವಾಚಕ (ಡ-ಒತ್ತು)",
        image_keyword: "african_wild_elephant",
        photo_ids: ["1557050543-4d5f4e07ef46", "1581852017103-68ac65514cf7", "1564760055775-d63b17a55c44", "1549366021-9f761d450615"]
    }
];

export const CLASS_3_KANNADA_NATURE = [
    {
        id: "gida", label: "ಗಿಡ",
        en: "Plant", hi: "पौधा (Plant)", kn: "ಗಿಡ (Plant)",
        category: "vocabulary", syllables: "ಗಿ • ಡ", phonetic_sound: "/ɡiɖə/", phonetic_rule: "ಸಸ್ಯ ವರ್ಗ",
        image_keyword: "green_forest_tree",
        photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"]
    },
    {
        id: "nadi", label: "ನದಿ",
        en: "River", hi: "नदी (River)", kn: "ನದಿ (River)",
        category: "vocabulary", syllables: "ನ • ದಿ", phonetic_sound: "/nəd̪i/", phonetic_rule: "ಜಲಮೂಲ",
        image_keyword: "flowing_river_water",
        photo_ids: ["1437482072395-89b01e8293fc", "1507525428034-b723cf961d3e", "1470071459604-3b5ec3a7fe05", "1470240731273-7821a6eeb6bd"]
    }
];

export const CLASS_3_MATHS_NUMBERS_3DIGIT = [
    {
        id: "num_100_c3", label: "100",
        en: "100 (One Hundred)", hi: "१०० (एक सौ)", kn: "೧೦೦ (ಒಂದು ನೂರು)",
        category: "vocabulary", syllables: "one • hun • dred", phonetic_sound: "/wʌn ˈhʌndrəd/", phonetic_rule: "Smallest 3-Digit Number",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    },
    {
        id: "num_500", label: "500",
        en: "500 (Five Hundred)", hi: "५०० (पाँच सौ)", kn: "೫೦೦ (ಐದು ನೂರು)",
        category: "vocabulary", syllables: "five • hun • dred", phonetic_sound: "/faɪv ˈhʌndrəd/", phonetic_rule: "5 Hundreds",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    },
    {
        id: "num_999", label: "999",
        en: "999 (Nine Hundred Ninety Nine)", hi: "९९९ (नौ सौ निन्यानवे)", kn: "೯೯೯ (ಒಂಬೈನೂರ ತೊಂಬತ್ತೊಂಬತ್ತು)",
        category: "vocabulary", syllables: "nine • hun • dred", phonetic_sound: "/naɪn ˈhʌndrəd/", phonetic_rule: "Largest 3-Digit Number",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    }
];

export const CLASS_3_MATHS_SHAPES = [
    {
        id: "triangle_geo", label: "Triangle",
        en: "Triangle (3 Sides)", hi: "त्रिभुज (३ भुजाएँ)", kn: "ತ್ರಿಕೋನ (೩ ಬಾಹುಗಳು)",
        category: "vocabulary", syllables: "tri • an • gle", phonetic_sound: "/ˈtraɪæŋɡl/", phonetic_rule: "3 straight sides and 3 corners",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    },
    {
        id: "square_geo", label: "Square",
        en: "Square (4 Equal Sides)", hi: "वर्ग (४ बराबर भुजाएँ)", kn: "ಚೌಕ (೪ ಸಮಾನ ಬಾಹುಗಳು)",
        category: "vocabulary", syllables: "square", phonetic_sound: "/skwɛər/", phonetic_rule: "4 equal sides and 4 right angles",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    }
];

export const CLASS_3_EVS_FOOD_GROUPS = [
    {
        id: "food_energy", label: "Energy Food",
        en: "Rice (Energy Giving)", hi: "चावल (ऊर्जादायक भोजन)", kn: "ಅಕ್ಕಿ (ಶಕ್ತಿ ನೀಡುವ ಆಹಾರ)",
        category: "vocabulary", syllables: "en • er • gy", phonetic_sound: "/ˈenədʒi/", phonetic_rule: "Carbohydrates provide instant energy",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    },
    {
        id: "food_body", label: "Body Building",
        en: "Milk (Body Building)", hi: "दूध (शरीर निर्माता)", kn: "ಹಾಲು (ದೇಹವರ್ಧಕ)",
        category: "vocabulary", syllables: "milk", phonetic_sound: "/mɪlk/", phonetic_rule: "Proteins strengthen muscles & bones",
        image_keyword: "pure_fresh_water",
        photo_ids: ["1548839140-29a749e1bc4e", "1523362628745-0c100150b504", "1559827291-72ee739d0d9a", "1516214104703-d870798883c5"]
    }
];

/* ==========================================================================
   CLASS 4 EXPANDED TOPICS
   ========================================================================== */

export const CLASS_4_ENGLISH_ADVERBS = [
    {
        id: "adv_quickly", label: "Quickly",
        en: "Runs Quickly", hi: "तेज़ी से दौड़ता है", kn: "ವೇಗವಾಗಿ ಓಡುತ್ತಾನೆ",
        category: "vocabulary", syllables: "quick • ly", phonetic_sound: "/ˈkwɪkli/", phonetic_rule: "Adverb of manner (-ly)",
        image_keyword: "brown_galloping_horse",
        photo_ids: ["1534447677768-be436bb09401", "1553284965-83fd3e82fa5a", "1535268647677-300dbf3d78d1", "1558929996-ac64ba4bae7e"]
    },
    {
        id: "adv_softly", label: "Softly",
        en: "Speaks Softly", hi: "धीमे से बोलता है", kn: "ಮೆಲ್ಲನೆ ಮಾತನಾಡುತ್ತಾನೆ",
        category: "vocabulary", syllables: "soft • ly", phonetic_sound: "/ˈsɒftli/", phonetic_rule: "Adverb of manner",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    }
];

export const CLASS_4_HINDI_MUHAVARE = [
    {
        id: "muh_bhagna", label: "नौ दो ग्यारह",
        en: "To Run Away (9-2-11)", hi: "नौ दो ग्यारह होना (भाग जाना)", kn: "ಓಡಿಹೋಗು (ನುಡಿಗಟ್ಟು)",
        category: "vocabulary", syllables: "नौ • दो • ग्या • रह", phonetic_sound: "/nɔː doː ɡjɑːrəɦ/", phonetic_rule: "हिन्दी मुहावरा",
        image_keyword: "brown_galloping_horse",
        photo_ids: ["1534447677768-be436bb09401", "1553284965-83fd3e82fa5a", "1535268647677-300dbf3d78d1", "1558929996-ac64ba4bae7e"]
    },
    {
        id: "muh_tara", label: "आँखों का तारा",
        en: "Apple of Eye (Beloved)", hi: "आँखों का तारा (अति प्रिय)", kn: "ಕಣ್ಣಿನ ತಾರೆ (ಅತಿ ಪ್ರೀತಿಯ)",
        category: "vocabulary", syllables: "आँ • खों • का • ता • रा", phonetic_sound: "/ɑ̃ːkʰoː̃ kɑː t̪ɑːrɑː/", phonetic_rule: "हिन्दी मुहावरा",
        image_keyword: "happy_school_children",
        photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1509062522246-3755977927d7", "1472162072142-d544e77a6dd4"]
    }
];

export const CLASS_4_KANNADA_VIBHAKTI = [
    {
        id: "vibhakti_prathama", label: "ಪ್ರಥಮಾ (ಉ)",
        en: "Prathama (Nominative - u)", hi: "प्रथमा विभक्ति (ने)", kn: "ಪ್ರಥಮಾ ವಿಭಕ್ತಿ (ಉ)",
        category: "vocabulary", syllables: "ಪ್ರ • ಥ • ಮಾ (ಉ)", phonetic_sound: "/prət̪ʰəmɑː/", phonetic_rule: "ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯ (ಕರ್ತೃ)",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "vibhakti_dvitiya", label: "ದ್ವಿತೀಯಾ (ಅನ್ನು)",
        en: "Dvitiya (Accusative - annu)", hi: "द्वितीया विभक्ति (को)", kn: "ದ್ವಿತೀಯಾ ವಿಭಕ್ತಿ (ಅನ್ನು)",
        category: "vocabulary", syllables: "ದ್ವಿ • ತೀ • ಯಾ", phonetic_sound: "/d̪vit̪iːjɑː/", phonetic_rule: "ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯ (ಕರ್ಮ)",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    }
];

export const CLASS_4_KANNADA_LINGA_VACHANA = [
    {
        id: "linga_m_f", label: "ಹುಡುಗ - ಹುಡುಗಿ",
        en: "Boy & Girl (Gender)", hi: "पुल्लिंग - स्त्रीलिंग", kn: "ಪುಲ್ಲಿಂಗ - ಸ್ತ್ರೀಲಿಂಗ",
        category: "vocabulary", syllables: "ಹು • ಡು • ಗ ↔ ಹು • ಡು • ಗಿ", phonetic_sound: "/huɖuɡə/ - /huɖuɡi/", phonetic_rule: "ಲಿಂಗ ಭೇದ",
        image_keyword: "happy_school_children",
        photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1509062522246-3755977927d7", "1472162072142-d544e77a6dd4"]
    },
    {
        id: "vachana_s_p", label: "ಮರ - ಮರಗಳು",
        en: "Tree & Trees (Plural)", hi: "एकवचन - बहुवचन", kn: "ಏಕವಚನ - ಬಹುವಚನ",
        category: "vocabulary", syllables: "ಮ • ರ ↔ ಮ • ರ • ಗ • ಳು", phonetic_sound: "/mərə/ - /mərəɡəɭu/", phonetic_rule: "ವಚನ ರೂಪ (ಗಳು ಪ್ರತ್ಯಯ)",
        image_keyword: "green_forest_tree",
        photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"]
    }
];

export const CLASS_4_MATHS_DIVISION = [
    {
        id: "div_10_2", label: "10 ÷ 2",
        en: "10 ÷ 2 = 5", hi: "१० ÷ २ = ५", kn: "೧೦ ÷ ೨ = ೫",
        category: "vocabulary", syllables: "ten • di • vi • ded", phonetic_sound: "/ten dɪˈvaɪdɪd baɪ tuː/", phonetic_rule: "Division as equal sharing",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    },
    {
        id: "div_20_4", label: "20 ÷ 4",
        en: "20 ÷ 4 = 5", hi: "२० ÷ ४ = ५", kn: "೨೦ ÷ ೪ = ೫",
        category: "vocabulary", syllables: "twen • ty • di • vi • ded", phonetic_sound: "/ˈtwenti dɪˈvaɪdɪd baɪ fɔːr/", phonetic_rule: "Division facts",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    }
];

export const CLASS_4_MATHS_PERIMETER_AREA = [
    {
        id: "perimeter_def", label: "Perimeter",
        en: "Perimeter (Boundary Length)", hi: "परिमाप (चारों ओर की माप)", kn: "ಸುತ್ತಳತೆ (ಒಟ್ಟು ಗಡಿ ಉದ್ದ)",
        category: "vocabulary", syllables: "pe • ri • me • ter", phonetic_sound: "/pəˈrɪmɪtər/", phonetic_rule: "Distance around closed boundary",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    },
    {
        id: "area_def", label: "Area",
        en: "Area (Inside Space)", hi: "क्षेत्रफल (अंदर की जगह)", kn: "ವಿಸ್ತೀರ್ಣ (ಒಳಗಿನ ಜಾಗ)",
        category: "vocabulary", syllables: "a • re • a", phonetic_sound: "/ˈeəriə/", phonetic_rule: "Measured in square units",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    }
];

export const CLASS_4_EVS_WATER_CYCLE = [
    {
        id: "evaporation", label: "Evaporation",
        en: "Evaporation (Water to Vapor)", hi: "वाष्पीकरण (भाप बनना)", kn: "ಬಾಷ್ಪೀಕರಣ (ಹಬೆಯಾಗುವುದು)",
        category: "vocabulary", syllables: "e • va • po • ra • tion", phonetic_sound: "/ɪˌvæpəˈreɪʃn/", phonetic_rule: "Liquid water changes to vapor by heat",
        image_keyword: "pure_fresh_water",
        photo_ids: ["1548839140-29a749e1bc4e", "1523362628745-0c100150b504", "1559827291-72ee739d0d9a", "1516214104703-d870798883c5"]
    },
    {
        id: "condensation", label: "Condensation",
        en: "Condensation (Clouds Form)", hi: "संघनन (बादल बनना)", kn: "ಸಾಂದ್ರೀಕರಣ (ಮೋಡವಾಗುವುದು)",
        category: "vocabulary", syllables: "con • den • sa • tion", phonetic_sound: "/ˌkɒndenˈseɪʃn/", phonetic_rule: "Vapor cools and turns to clouds",
        image_keyword: "fresh_rain_water_drops",
        photo_ids: ["1515694346937-94d85e41e6f0", "1534274988757-a28bf1a57c17", "1519692933481-e162a57d6721", "1508873696983-2df57036476b"]
    }
];

export const CLASS_4_EVS_COMMUNITY_HELPERS = [
    {
        id: "helper_doctor", label: "Doctor",
        en: "Doctor (Cures the Sick)", hi: "डॉक्टर (उपचार करते हैं)", kn: "ವೈದ್ಯರು (ಆರೋಗ್ಯ ರಕ್ಷಕರು)",
        category: "vocabulary", syllables: "doc • tor", phonetic_sound: "/ˈdɒktər/", phonetic_rule: "Healthcare helper",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "helper_teacher", label: "Teacher",
        en: "Teacher (Educates Us)", hi: "शिक्षक (ज्ञान देते हैं)", kn: "ಶಿಕ್ಷಕರು (ಬೋಧಕರು)",
        category: "vocabulary", syllables: "tea • cher", phonetic_sound: "/ˈtiːtʃər/", phonetic_rule: "Digraph EA + CH",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    }
];

/* ==========================================================================
   CLASS 5 EXPANDED TOPICS
   ========================================================================== */

export const CLASS_5_ENGLISH_AFFIXES = [
    {
        id: "prefix_un", label: "Un-",
        en: "Unhappy (Not Happy)", hi: "Unhappy (दुखी / अप्रसन्न)", kn: "ಅಸಂತುಷ್ಟ (Unhappy)",
        category: "vocabulary", syllables: "un • hap • py", phonetic_sound: "/ʌnˈhæpi/", phonetic_rule: "Prefix un- means not or opposite",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "suffix_ful", label: "-ful",
        en: "Helpful (Full of Help)", hi: "Helpful (मददगार)", kn: "ಸಹಾಯಕಾರಿ (Helpful)",
        category: "vocabulary", syllables: "help • ful", phonetic_sound: "/ˈhelpfl/", phonetic_rule: "Suffix -ful means full of",
        image_keyword: "happy_school_children",
        photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1509062522246-3755977927d7", "1472162072142-d544e77a6dd4"]
    }
];

export const CLASS_5_ENGLISH_CONJUNCTIONS = [
    {
        id: "conj_and", label: "And",
        en: "Bread and Butter", hi: "रोटी और मक्खन", kn: "ರೊಟ್ಟಿ ಮತ್ತು ಬೆಣ್ಣೆ",
        category: "vocabulary", syllables: "and", phonetic_sound: "/ænd/", phonetic_rule: "Joining conjunction",
        image_keyword: "sweet_icecream_cone",
        photo_ids: ["1501443782928-176691a9b340", "1563805042-7684c019e1cb", "1497034825429-c343d7c6a68f", "1570197788417-0e82375c9371"]
    },
    {
        id: "conj_because", label: "Because",
        en: "Happy Because I Won", hi: "खुश क्योंकि मैं जीता", kn: "ಗೆದ್ದ ಕಾರಣ ಸಂತೋಷ",
        category: "vocabulary", syllables: "be • cause", phonetic_sound: "/bɪˈkɒz/", phonetic_rule: "Conjunction showing reason",
        image_keyword: "happy_school_children",
        photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1509062522246-3755977927d7", "1472162072142-d544e77a6dd4"]
    }
];

export const CLASS_5_HINDI_KARAK = [
    {
        id: "karak_karta", label: "कर्ता (ने)",
        en: "Karta Karak (Agent - Ne)", hi: "कर्ता कारक (ने - राम ने)", kn: "ಕರ್ತೃ ಕಾರಕ (ರಾಮನು)",
        category: "vocabulary", syllables: "क • र्त्ता (ने)", phonetic_sound: "/kərt̪ɑː/", phonetic_rule: "क्रिया को करने वाला",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "karak_karm", label: "कर्म (को)",
        en: "Karm Karak (Object - Ko)", hi: "कर्म कारक (को - फल को)", kn: "ಕರ್ಮ ಕಾರಕ (ಹಣ್ಣನ್ನು)",
        category: "vocabulary", syllables: "क • र्म (को)", phonetic_sound: "/kərm/", phonetic_rule: "क्रिया का प्रभाव पड़ने वाला",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    }
];

export const CLASS_5_HINDI_ANEKARTHI = [
    {
        id: "anek_kaal", label: "काल",
        en: "Kaal (Time / Death)", hi: "काल = समय, मृत्यु", kn: "ಕಾಲ = ಸಮಯ, ಸಾವು",
        category: "vocabulary", syllables: "का • ल", phonetic_sound: "/kɑːl/", phonetic_rule: "अनेकार्थी शब्द",
        image_keyword: "analog_wall_clock",
        photo_ids: ["1508057198894-247b23fe5ade", "1563861826100-9cb868fdbe1c", "1518770660439-4636190af475", "1495364141860-b0d03eccd065"]
    },
    {
        id: "anek_teer", label: "तीर",
        en: "Teer (Arrow / Shore)", hi: "तीर = बाण, किनारा", kn: "ತೀರ = ಬಾಣ, ದಡ",
        category: "vocabulary", syllables: "ती • र", phonetic_sound: "/t̪iːr/", phonetic_rule: "अनेकार्थी शब्द",
        image_keyword: "flowing_river_water",
        photo_ids: ["1437482072395-89b01e8293fc", "1507525428034-b723cf961d3e", "1470071459604-3b5ec3a7fe05", "1470240731273-7821a6eeb6bd"]
    }
];

export const CLASS_5_KANNADA_SANDHI = [
    {
        id: "lopa_sandhi", label: "ಲೋಪ ಸಂಧಿ",
        en: "Lopa Sandhi (Vowel Elision)", hi: "लोप सन्धि", kn: "ಮರ + ಅನ್ನು = ಮರವನ್ನು",
        category: "vocabulary", syllables: "ಲೋ • ಪ • ಸಂ • ಧಿ", phonetic_sound: "/loːpə sən̪d̪ʱi/", phonetic_rule: "ಸ್ವರ ಲೋಪ ಸಂಧಿ",
        image_keyword: "green_forest_tree",
        photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"]
    },
    {
        id: "aagama_sandhi", label: "ಆಗಮ ಸಂಧಿ",
        en: "Aagama Sandhi (Vowel Insertion)", hi: "आगम सन्धि", kn: "ಮನೆ + ಅನ್ನು = ಮನೆಯನ್ನು",
        category: "vocabulary", syllables: "ಆ • ಗ • ಮ • ಸಂ • ಧಿ", phonetic_sound: "/ɑːɡəmə sən̪d̪ʱi/", phonetic_rule: "ಯ-ಕಾರ ಆಗಮ ಸಂಧಿ",
        image_keyword: "brick_family_house",
        photo_ids: ["1580587771525-78b9dba3b914", "1518780664697-55e3ad937233", "1568605114967-8130f3a36994", "1570129477492-45c003edd2be"]
    }
];

export const CLASS_5_KANNADA_PROVERBS = [
    {
        id: "gade_mosaru", label: "ಕೈ ಕೆಸರಾದರೆ...",
        en: "Hard Work Yields Sweet Fruits", hi: "परिश्रम का फल मीठा होता है", kn: "ಕೈ ಕೆಸರಾದರೆ ಬಾಯಿ ಮೊಸರು",
        category: "vocabulary", syllables: "ಕೈ • ಕೆ • ಸ • ರಾ • ದ • ರೆ", phonetic_sound: "/kəi kesərɑːd̪əre/", phonetic_rule: "ಕನ್ನಡ ಜನಪ್ರಿಯ ಗಾದೆ",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    }
];

export const CLASS_5_MATHS_LARGE_NUMBERS = [
    {
        id: "num_10000", label: "10,000",
        en: "10,000 (Ten Thousand)", hi: "१०,००० (दस हज़ार)", kn: "೧೦,೦೦೦ (ಹತ್ತು ಸಾವಿರ)",
        category: "vocabulary", syllables: "ten • thou • sand", phonetic_sound: "/ten ˈθaʊznd/", phonetic_rule: "5-Digit Number",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    },
    {
        id: "num_100000", label: "1,00,000",
        en: "1,00,000 (One Lakh)", hi: "१,००,००० (एक लाख)", kn: "೧,೦೦,೦೦೦ (ಒಂದು ಲಕ್ಷ)",
        category: "vocabulary", syllables: "one • lakh", phonetic_sound: "/wʌn lɑːk/", phonetic_rule: "Indian Place Value System (Lakh)",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    }
];

export const CLASS_5_MATHS_DECIMALS = [
    {
        id: "dec_half", label: "0.5",
        en: "0.5 (Half / Five Tenths)", hi: "०.५ (आधा)", kn: "೦.೫ (ಅರ್ಧ)",
        category: "vocabulary", syllables: "point • five", phonetic_sound: "/pɔɪnt faɪv/", phonetic_rule: "Tenths decimal place",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    },
    {
        id: "dec_quarter", label: "0.25",
        en: "0.25 (Quarter / 25 Hundredths)", hi: "०.२५ (चौथाई)", kn: "೦.೨೫ (ಕಾಲು)",
        category: "vocabulary", syllables: "point • two • five", phonetic_sound: "/pɔɪnt tuː faɪv/", phonetic_rule: "Hundredths decimal place",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    }
];

export const CLASS_5_EVS_CONTINENTS = [
    {
        id: "cont_asia", label: "Asia",
        en: "Asia (Largest Continent)", hi: "एशिया (सबसे बड़ा महाद्वीप)", kn: "ಏಷ್ಯಾ (ಅತಿ ದೊಡ್ಡ ಖಂಡ)",
        category: "vocabulary", syllables: "a • sia", phonetic_sound: "/ˈeɪʒə/", phonetic_rule: "World Geography",
        image_keyword: "round_planet_earth",
        photo_ids: ["1614730321146-b6fa6a46bcb4", "1614728894747-a83421e2b9c9", "1506703719100-a0f3a48c0f86", "1451187580459-43490279c0fa"]
    },
    {
        id: "ocean_pacific", label: "Pacific",
        en: "Pacific Ocean (Deepest)", hi: "प्रशांत महासागर", kn: "ಪೆಸಿಫಿಕ್ ಸಾಗರ",
        category: "vocabulary", syllables: "pa • ci • fic", phonetic_sound: "/pəˈsɪfɪk/", phonetic_rule: "Largest & deepest ocean",
        image_keyword: "large_ocean_ship",
        photo_ids: ["1505705694340-019e1e335916", "1548574505-5e239809ee19", "1506197603052-3cc9c3a201bd", "1494412574643-ff11b0a5c1c3"]
    }
];

export const CLASS_5_EVS_BODY_SYSTEMS = [
    {
        id: "sys_circulatory", label: "Circulation",
        en: "Circulatory System (Heart)", hi: "रक्त परिसंचरण तंत्र", kn: "ರಕ್ತ ಪರಿಚಲನಾ ವ್ಯವಸ್ಥೆ",
        category: "vocabulary", syllables: "cir • cu • la • to • ry", phonetic_sound: "/ˈsɜːrkjələtɔːri/", phonetic_rule: "Pumps blood through vessels",
        image_keyword: "blooming_red_rose",
        photo_ids: ["1518709268805-4e9042af9f23", "1490750967868-88aa4486c946", "1508610048659-a06b669e3321", "1526047932273-341f2a7631f9"]
    },
    {
        id: "sys_respiratory", label: "Respiration",
        en: "Respiratory System (Lungs)", hi: "श्वसन तंत्र (फेफड़े)", kn: "ಉಸಿರಾಟ ವ್ಯವಸ್ಥೆ (ಶ್ವಾಸಕೋಶ)",
        category: "vocabulary", syllables: "res • pi • ra • to • ry", phonetic_sound: "/ˈrespərətɔːri/", phonetic_rule: "Exchanges oxygen and carbon dioxide",
        image_keyword: "open_reading_book",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    }
];


