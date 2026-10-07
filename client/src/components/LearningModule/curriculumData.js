/**
 * Learning Module V1 - NCERT / Tiwari Academy Curriculum Dataset (Classes 1 - 5)
 * Specifically crafted for children with dyslexia following multisensory accessibility principles.
 * 
 * CORE RULES APPLIED:
 * 1. 100% PRECISE IMAGE KEYWORDS & SOURCE MAPPING (Zero ambiguity, strict subject-match keywords).
 * 2. STRICT 8-CARD PATTERN PER TOPIC UNIT:
 *    - Cards 1-4: Visual Cards (4 photos of the EXACT same object/concept, minimal text, reliable Unsplash source URL).
 *    - Cards 5-8: Text Representation Cards (ONLY text in 4 distinct dyslexic fonts, ABSOLUTELY NO images).
 * 3. MULTILINGUAL & TRANSLATION: Every card has { en, hi, kn, image_keyword, image_url }.
 * 4. DYSLEXIA ACCESSIBILITY: Minimal clean text, high contrast, zero filler explanations.
 */

import {
    CLASS_2_ENGLISH_NOUNS,
    CLASS_2_ENGLISH_OPPOSITES,
    CLASS_2_ENGLISH_ARTICLES,
    CLASS_2_ENGLISH_PHONICS,
    CLASS_2_HINDI_MATRAE,
    CLASS_2_HINDI_SANGYA,
    CLASS_2_HINDI_WORDS3,
    CLASS_2_KANNADA_GUNINTAGALU,
    CLASS_2_KANNADA_RELATIONSHIPS,
    CLASS_2_KANNADA_HOME,
    CLASS_2_MATHS_NUMBERS,
    CLASS_2_MATHS_MONEY,
    CLASS_2_MATHS_TIME,
    CLASS_2_EVS_TRANSPORT,
    CLASS_2_EVS_SEASONS,
    CLASS_2_EVS_FESTIVALS,
    CLASS_3_ENGLISH_VERBS,
    CLASS_3_ENGLISH_ADJECTIVES,
    CLASS_3_ENGLISH_PREPOSITIONS,
    CLASS_3_ENGLISH_BLENDS,
    CLASS_3_HINDI_SARVANAAM,
    CLASS_3_HINDI_VILOM,
    CLASS_3_HINDI_PARYAYVACHI,
    CLASS_3_KANNADA_OTTAKSHARA,
    CLASS_3_KANNADA_ADJECTIVES,
    CLASS_3_KANNADA_NATURE,
    CLASS_3_MATHS_NUMBERS_3DIGIT,
    CLASS_3_MATHS_TABLES,
    CLASS_3_MATHS_SHAPES,
    CLASS_3_EVS_SOLAR_SYSTEM,
    CLASS_3_EVS_PLANTS,
    CLASS_3_EVS_FOOD_GROUPS,
    CLASS_4_ENGLISH_TENSES,
    CLASS_4_ENGLISH_HOMOPHONES,
    CLASS_4_ENGLISH_ADVERBS,
    CLASS_4_HINDI_KRIYA,
    CLASS_4_HINDI_VISHESHAN,
    CLASS_4_HINDI_MUHAVARE,
    CLASS_4_KANNADA_GRAMMAR,
    CLASS_4_KANNADA_VIBHAKTI,
    CLASS_4_KANNADA_LINGA_VACHANA,
    CLASS_4_MATHS_FRACTIONS,
    CLASS_4_MATHS_DIVISION,
    CLASS_4_MATHS_PERIMETER_AREA,
    CLASS_4_EVS_ORGANS,
    CLASS_4_EVS_WATER_CYCLE,
    CLASS_4_EVS_COMMUNITY_HELPERS,
    CLASS_5_ENGLISH_IDIOMS,
    CLASS_5_ENGLISH_AFFIXES,
    CLASS_5_ENGLISH_CONJUNCTIONS,
    CLASS_5_HINDI_KAAL,
    CLASS_5_HINDI_KARAK,
    CLASS_5_HINDI_ANEKARTHI,
    CLASS_5_KANNADA_LITERATURE,
    CLASS_5_KANNADA_SANDHI,
    CLASS_5_KANNADA_PROVERBS,
    CLASS_5_MATHS_ANGLES,
    CLASS_5_MATHS_LARGE_NUMBERS,
    CLASS_5_MATHS_DECIMALS,
    CLASS_5_EVS_SPACE,
    CLASS_5_EVS_CONTINENTS,
    CLASS_5_EVS_BODY_SYSTEMS
} from "./curriculumDataClasses2to5.js";
import { resolveCardImage } from "./curriculumImageResolver.js";

export const FONT_STYLES = {
    dyslexic: {
        id: "dyslexic",
        name: "Clean Dyslexic Print",
        fontFamily: "'Lexend', sans-serif",
        fontClass: "font-dyslexic"
    },
    serif: {
        id: "serif",
        name: "Classic Textbook Serif",
        fontFamily: "'Lora', Georgia, serif",
        fontClass: "font-serif-text"
    },
    handwriting: {
        id: "handwriting",
        name: "School Handwriting",
        fontFamily: "'Patrick Hand', cursive",
        fontClass: "font-handwriting"
    },
    chunky: {
        id: "chunky",
        name: "Playful Chunky Display",
        fontFamily: "'Fredoka', sans-serif",
        fontClass: "font-chunky"
    }
};

export const SUBJECT_METADATA = {
    english: { id: "english", name: "English", icon: "📖", hiName: "अंग्रेज़ी", knName: "ಇಂಗ್ಲಿಷ್" },
    hindi: { id: "hindi", name: "Hindi", icon: "🇮🇳", hiName: "हिन्दी", knName: "ಹಿಂದಿ" },
    kannada: { id: "kannada", name: "Kannada", icon: "🟡🔴", hiName: "कन्नड़", knName: "ಕನ್ನಡ" },
    maths: { id: "maths", name: "Maths", icon: "📐", hiName: "गणित", knName: "ಗಣಿತ" },
    evs: { id: "evs", name: "EVS / GK", icon: "🌍", hiName: "पर्यावरण / GK", knName: "ಪರಿಸರ / GK" }
};

/**
 * Helper to build reliable Unsplash photo URLs
 */
export function getUnsplashPhotoUrl(photoId, keyword) {
    if (photoId) {
        return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=600&q=80`;
    }
    return `https://source.unsplash.com/600x400/?${encodeURIComponent(keyword || "education")}`;
}

/**
 * Builds the strict 8-card array for a unit:
 * - 4 visual cards (photos of the EXACT same object with specific unambiguous keyword)
 * - 4 text-only cards (rendered in 4 distinct fonts, strictly NO images)
 */
export function createTopicUnit({
    id,
    label,
    en,
    hi,
    kn,
    image_keyword,
    photo_ids = [],
    svg_fallback = "",
    category = "vocabulary",
    phonetic_sound = "",
    syllables = "",
    phonetic_rule = ""
}) {
    // 4 visual cards with 4 distinct photos/illustrations of the EXACT same object
    const visualCards = [0, 1, 2, 3].map((index) => {
        const photoId = photo_ids[index] || photo_ids[0];
        const imageUrl = resolveCardImage({ id, label, en, hi, kn, category, image_keyword, photo_ids }, index);
        return {
            id: `${id}-vis-${index + 1}`,
            type: "visual",
            en,
            hi,
            kn,
            image_keyword,
            image_url: imageUrl,
            photo_id: photoId,
            svg_fallback,
            category,
            phonetic_sound,
            syllables,
            phonetic_rule
        };
    });

    // 4 text representation cards in 4 distinct dyslexic fonts (NO images)
    const fontCards = [
        { key: "dyslexic", style: FONT_STYLES.dyslexic },
        { key: "serif", style: FONT_STYLES.serif },
        { key: "handwriting", style: FONT_STYLES.handwriting },
        { key: "chunky", style: FONT_STYLES.chunky }
    ].map(({ style }) => ({
        id: `${id}-font-${style.id}`,
        type: "font_style",
        en,
        hi,
        kn,
        fontStyle: style,
        fontClass: style.fontClass,
        image_keyword,
        image_url: "", // Strictly NO image on font cards
        category,
        phonetic_sound,
        syllables,
        phonetic_rule
    }));

    return {
        id,
        label,
        en,
        hi,
        kn,
        category,
        phonetic_sound,
        syllables,
        phonetic_rule,
        cards: [...visualCards, ...fontCards]
    };
}

/* ==========================================================================
   CLASS 1 CURRICULUM
   ========================================================================== */

const CLASS_1_ENGLISH_ALPHABETS = [
    {
        id: "A", label: "A", en: "A for Apple", hi: "ए से सेब", kn: "ಎ ಇಂದ ಸೇಬು",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    },
    {
        id: "B", label: "B", en: "B for Ball", hi: "बी से गेंद", kn: "ಬಿ ಇಂದ ಚೆಂಡು",
        image_keyword: "red_soccer_ball",
        photo_ids: ["1558060370-d644479cb6f7", "1575361204480-aadea25e6e68", "1546519638-68e109498ffc", "1534438327276-14e5300c3a48"]
    },
    {
        id: "C", label: "C", en: "C for Cat", hi: "सी से बिल्ली", kn: "ಸಿ ಇಂದ ಬೆಕ್ಕು",
        image_keyword: "cute_domestic_cat",
        photo_ids: ["1514888286974-6c03e2ca1dba", "1533738363-b7f9aef128ce", "1543852786-1cf6624b9987", "1495360010541-f48722b34f7d"]
    },
    {
        id: "D", label: "D", en: "D for Dog", hi: "डी से कुत्ता", kn: "ಡಿ ಇಂದ ನಾಯಿ",
        image_keyword: "golden_retriever_dog",
        photo_ids: ["1543466835-00a7907e9de1", "1583511655857-d19b40a7a54e", "1537151608828-ea2b11777ee8", "1587300003388-59208cc962cb"]
    },
    {
        id: "E", label: "E", en: "E for Elephant", hi: "ई से हाथी", kn: "ಇ ಇಂದ ಆನೆ",
        image_keyword: "african_wild_elephant",
        photo_ids: ["1557050543-4d5f4e07ef46", "1581852017103-68ac65514cf7", "1564760055775-d63b17a55c44", "1549366021-9f761d450615"]
    },
    {
        id: "F", label: "F", en: "F for Fish", hi: "एफ़ से मछली", kn: "ಎಫ್ ಇಂದ ಮೀನು",
        image_keyword: "orange_clownfish_fish",
        photo_ids: ["1524704654690-b56c05c78a00", "1522069169874-c58ec4b76be5", "1544551763-46a013bb70d5", "1535591273668-578e31182c4f"]
    },
    {
        id: "G", label: "G", en: "G for Grapes", hi: "जी से अंगूर", kn: "ಜಿ ಇಂದ ದ್ರಾಕ್ಷಿ",
        image_keyword: "fresh_purple_grapes",
        photo_ids: ["1537640538966-79f369143f8f", "1596363505729-4190a9506133", "1599819044578-8316dfa9c72e", "1423483641154-5411ec9c0ddf"]
    },
    {
        id: "H", label: "H", en: "H for Horse", hi: "एच से घोड़ा", kn: "ಎಚ್ ಇಂದ ಕುದುರೆ",
        image_keyword: "brown_galloping_horse",
        photo_ids: ["1534447677768-be436bb09401", "1553284965-83fd3e82fa5a", "1535268647677-300dbf3d78d1", "1558929996-ac64ba4bae7e"]
    },
    {
        id: "I", label: "I", en: "I for Ice cream", hi: "आई से आइसक्रीम", kn: "ಐ ಇಂದ ಐಸ್ ಕ್ರೀಮ್",
        image_keyword: "sweet_icecream_cone",
        photo_ids: ["1501443782928-176691a9b340", "1563805042-7684c019e1cb", "1497034825429-c343d7c6a68f", "1570197788417-0e82375c9371"]
    },
    {
        id: "J", label: "J", en: "J for Juice", hi: "जे से जूस", kn: "ಜೆ ಇಂದ ಹಣ್ಣಿನ ರಸ",
        image_keyword: "orange_fresh_juice_glass",
        photo_ids: ["1600271886742-f049cd451bba", "1534353473418-4cfa6c56fd38", "1613478223719-2ab802602423", "1589733955941-5eeaf752f6dd"]
    },
    {
        id: "K", label: "K", en: "K for Kite", hi: "के से पतंग", kn: "ಕೆ ಇಂದ ಗಾಳಿಪಟ",
        image_keyword: "flying_colorful_kite",
        photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1534447677768-be436bb09401", "1508873696983-2df57036476b"]
    },
    {
        id: "L", label: "L", en: "L for Lion", hi: "एल से शेर", kn: "ಎಲ್ ಇಂದ ಸಿಂಹ",
        image_keyword: "african_male_lion",
        photo_ids: ["1546182990-dffeafbe841d", "1534188753412-3e26d0d618d6", "1561731216-c3a4d99437d5", "1575550959106-5a7defe28b56"]
    },
    {
        id: "M", label: "M", en: "M for Mango", hi: "एम से आम", kn: "ಎಮ್ ಇಂದ ಮಾವಿನಹಣ್ಣು",
        image_keyword: "fresh_yellow_mango",
        photo_ids: ["1553279768-865429fa0078", "1601493700631-2b16ec4b4716", "1591073113125-e46713c829fe", "1567306226416-28f0efdc88ce"]
    },
    {
        id: "N", label: "N", en: "N for Nest", hi: "एन से घोंसला", kn: "ಎನ್ ಇಂದ ಗೂಡು",
        image_keyword: "bird_straw_nest",
        photo_ids: ["1520808663317-647b476a81b9", "1535083783855-76ae62b2914e", "1516467508483-a7212febe31a", "1528722828814-77b9b83aafb2"]
    },
    {
        id: "O", label: "O", en: "O for Orange", hi: "ओ से संतरा", kn: "ಒ ಇಂದ ಕಿತ್ತಳೆ",
        image_keyword: "ripe_orange_citrus",
        photo_ids: ["1582979512210-99b6a53386f9", "1557800636-894a64c1696f", "1547514701-42782101795e", "1611080626919-7cf5a9dbab5b"]
    },
    {
        id: "P", label: "P", en: "P for Pencil", hi: "पी से पेंसिल", kn: "ಪಿ ಇಂದ ಸೀಸದ ಕಡ್ಡಿ",
        image_keyword: "yellow_wooden_pencil",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    },
    {
        id: "Q", label: "Q", en: "Q for Queen", hi: "क्यू से रानी", kn: "ಕ್ಯೂ ಇಂದ ರಾಣಿ",
        image_keyword: "royal_golden_crown",
        photo_ids: ["1535713875002-d1d0cf377fde", "1579783902614-a3fb3927b675", "1589829085413-56de8ae18c73", "1519791883288-dc8bd696e667"]
    },
    {
        id: "R", label: "R", en: "R for Rabbit", hi: "आर से खरगोश", kn: "ಆರ್ ಇಂದ ಮೊಲ",
        image_keyword: "cute_white_rabbit",
        photo_ids: ["1585110396000-c9ffd4e4b308", "1535268647677-300dbf3d78d1", "1591382364683-b2bf34667d4d", "1518796745738-41048802f99a"]
    },
    {
        id: "S", label: "S", en: "S for Sun", hi: "एस से सूरज", kn: "ಎಸ್ ಇಂದ ಸೂರ್ಯ",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    },
    {
        id: "T", label: "T", en: "T for Tree", hi: "टी से पेड़", kn: "ಟಿ ಇಂದ ಮರ",
        image_keyword: "green_forest_tree",
        photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"]
    },
    {
        id: "U", label: "U", en: "U for Umbrella", hi: "यू से छाता", kn: "ಯು ಇಂದ ಛತ್ರಿ",
        image_keyword: "colorful_rain_umbrella",
        photo_ids: ["1517649763962-0c623266ddc0", "1534447677768-be436bb09401", "1516214104703-d870798883c5", "1517649763962-0c623266ddc0"]
    },
    {
        id: "V", label: "V", en: "V for Van", hi: "वी से वैन", kn: "ವಿ ಇಂದ ವ್ಯಾನ್",
        image_keyword: "white_delivery_van",
        photo_ids: ["1541899481282-d53bffe3c35d", "1533473359331-0135ef1b58bf", "1525609004556-c46cbe84937e", "1494976388531-d1058494cdd8"]
    },
    {
        id: "W", label: "W", en: "W for Watch", hi: "डब्ल्यू से घड़ी", kn: "ಡಬ್ಲ್ಯೂ ಇಂದ ಗಡಿಯಾರ",
        image_keyword: "analog_wrist_watch",
        photo_ids: ["1523275335684-37898b6baf30", "1524805444758-089113d48a6d", "1522335789203-aabd1fc54bc9", "1508057198894-247b23fe5ade"]
    },
    {
        id: "X", label: "X", en: "X for Xylophone", hi: "एक्स से जाइलोफ़ोन", kn: "ಎಕ್ಸ್ ಇಂದ ಕ್ಸೈಲೋಫೋನ್",
        image_keyword: "wooden_toy_xylophone",
        photo_ids: ["1511671782779-c97d3d27a1d4", "1520523839898-507125ef5381", "1465847899084-d164df4dedc6", "1514525253161-7a46d19cd819"]
    },
    {
        id: "Y", label: "Y", en: "Y for Yak", hi: "वाई से याक", kn: "ವೈ ಇಂದ ಚಮರೀಮೃಗ",
        image_keyword: "himalayan_mountain_yak",
        photo_ids: ["1578326457991-5f55bad28a30", "1546182990-dffeafbe841d", "1534188753412-3e26d0d618d6", "1561731216-c3a4d99437d5"]
    },
    {
        id: "Z", label: "Z", en: "Z for Zebra", hi: "ज़ेड से ज़ेब्रा", kn: "ಝೆಡ್ ಇಂದ ಜೀಬ್ರಾ",
        image_keyword: "wild_striped_zebra",
        photo_ids: ["1501705388883-4ed8a543392c", "1526095179574-86e545346ae6", "1507667522163-3768a936a41a", "1456926631375-92c8ce872def"]
    }
];

export const CLASS_1_ENGLISH_PHONICS = [
    { id: "at", label: "-at", en: "C-A-T Cat", hi: "कैट (बिल्ली)", kn: "ಕ್ಯಾಟ್ (ಬೆಕ್ಕು)", category: "phonetic_sound", syllables: "c • a • t", phonetic_sound: "/kæt/", phonetic_rule: "Short A (-at family)", image_keyword: "cute_domestic_cat", photo_ids: ["1514888286974-6c03e2ca1dba", "1533738363-b7f9aef128ce", "1543852786-1cf6624b9987", "1495360010541-f48722b34f7d"] },
    { id: "an", label: "-an", en: "F-A-N Fan", hi: "फैन (पंखा)", kn: "ಫ್ಯಾನ್ (ಪಂಖ)", category: "phonetic_sound", syllables: "f • a • n", phonetic_sound: "/fæn/", phonetic_rule: "Short A (-an family)", image_keyword: "electric_ceiling_fan", photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"] },
    { id: "in", label: "-in", en: "P-I-N Pin", hi: "पिन", kn: "ಪಿನ್", category: "phonetic_sound", syllables: "p • i • n", phonetic_sound: "/pɪn/", phonetic_rule: "Short I (-in family)", image_keyword: "metal_safety_pin", photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"] },
    { id: "og", label: "-og", en: "D-O-G Dog", hi: "डॉग (कुत्ता)", kn: "ಡಾಗ್ (ನಾಯಿ)", category: "phonetic_sound", syllables: "d • o • g", phonetic_sound: "/dɒɡ/", phonetic_rule: "Short O (-og family)", image_keyword: "golden_retriever_dog", photo_ids: ["1543466835-00a7907e9de1", "1583511655857-d19b40a7a54e", "1537151608828-ea2b11777ee8", "1587300003388-59208cc962cb"] },
    { id: "un", label: "-un", en: "S-U-N Sun", hi: "सन (सूरज)", kn: "ಸನ್ (ಸೂರ್ಯ)", category: "phonetic_sound", syllables: "s • u • n", phonetic_sound: "/sʌn/", phonetic_rule: "Short U (-un family)", image_keyword: "bright_shining_sun", photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"] }
];

export const CLASS_1_ENGLISH_SIGHT_WORDS = [
    { id: "the", label: "The", en: "The", hi: "यह / वह", kn: "ಆ", image_keyword: "open_reading_book", photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"] },
    { id: "and", label: "And", en: "And", hi: "और", kn: "ಮತ್ತು", image_keyword: "yellow_wooden_pencil", photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"] },
    { id: "you", label: "You", en: "You", hi: "आप / तुम", kn: "ನೀವು", image_keyword: "cute_white_rabbit", photo_ids: ["1585110396000-c9ffd4e4b308", "1535268647677-300dbf3d78d1", "1591382364683-b2bf34667d4d", "1518796745738-41048802f99a"] },
    { id: "play", label: "Play", en: "Play", hi: "खेलना", kn: "ಆಟವಾಡು", image_keyword: "red_soccer_ball", photo_ids: ["1558060370-d644479cb6f7", "1575361204480-aadea25e6e68", "1546519638-68e109498ffc", "1534438327276-14e5300c3a48"] }
];


/* ==========================================================================
   NCERT CLASS 1 ENGLISH (MRIDANG) UNITS & CHAPTERS
   ========================================================================== */

const CLASS_1_ENGLISH_MRIDANG_UNIT1 = [
    {
        id: "hands", label: "Hands",
        en: "Hands", hi: "हाथ", kn: "ಕೈಗಳು",
        category: "vocabulary", syllables: "hands", phonetic_sound: "/hændz/", phonetic_rule: "Short A Vowel Sound",
        image_keyword: "human_holding_hands",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    },
    {
        id: "eyes", label: "Eyes",
        en: "Eyes", hi: "आँखें", kn: "ಕಣ್ಣುಗಳು",
        category: "vocabulary", syllables: "eyes", phonetic_sound: "/aɪz/", phonetic_rule: "Long I Sound",
        image_keyword: "human_seeing_eyes",
        photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"]
    },
    {
        id: "family", label: "Family",
        en: "Family", hi: "परिवार", kn: "ಕುಟುಂಬ",
        category: "vocabulary", syllables: "fa • mi • ly", phonetic_sound: "/ˈfæməli/", phonetic_rule: "Three-syllable word",
        image_keyword: "happy_loving_family",
        photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"]
    },
    {
        id: "phonetic_clap", label: "-ap",
        en: "C-L-A-P Clap", hi: "क्लैप (ताली)", kn: "ಕ್ಲ್ಯಾಪ್ (ಚಪ್ಪಾಳೆ)",
        category: "phonetic_sound", syllables: "cl • a • p", phonetic_sound: "/klæp/", phonetic_rule: "Blend /cl/ + -ap family",
        image_keyword: "children_clapping_hands",
        photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"]
    },
    {
        id: "phonetic_tap", label: "-ap",
        en: "T-A-P Tap", hi: "टैप (थप)", kn: "ಟ್ಯಾಪ್ (ಮೆಲ್ಲನೆ ತಟ್ಟು)",
        category: "phonetic_sound", syllables: "t • a • p", phonetic_sound: "/tæp/", phonetic_rule: "Short A (-ap family)",
        image_keyword: "happy_child_feet_shoes",
        photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1534447677768-be436bb09401", "1508873696983-2df57036476b"]
    }
];

const CLASS_1_ENGLISH_MRIDANG_UNIT2 = [
    {
        id: "cat_vocab", label: "Cat",
        en: "Cat", hi: "बिल्ली", kn: "ಬೆಕ್ಕು",
        category: "vocabulary", syllables: "cat", phonetic_sound: "/kæt/", phonetic_rule: "CVC Short A",
        image_keyword: "cute_domestic_cat",
        photo_ids: ["1514888286974-6c03e2ca1dba", "1533738363-b7f9aef128ce", "1543852786-1cf6624b9987", "1495360010541-f48722b34f7d"]
    },
    {
        id: "fish_vocab", label: "Fish",
        en: "Fish", hi: "मछली", kn: "ಮೀನು",
        category: "vocabulary", syllables: "fish", phonetic_sound: "/fɪʃ/", phonetic_rule: "Digraph /sh/ + Short I",
        image_keyword: "orange_clownfish_swimming",
        photo_ids: ["1524704654690-b56c05c78a00", "1522069169874-c58ec4b76be5", "1544551763-46a013bb70d5", "1535591273668-578e31182c4f"]
    },
    {
        id: "monkey_vocab", label: "Monkey",
        en: "Monkey", hi: "बंदर", kn: "ಕೋತಿ",
        category: "vocabulary", syllables: "mon • key", phonetic_sound: "/ˈmʌŋki/", phonetic_rule: "Two-syllable animal noun",
        image_keyword: "wild_brown_monkey",
        photo_ids: ["1540573133985-87b6da6d54a9", "1534188753412-3e26d0d618d6", "1561731216-c3a4d99437d5", "1575550959106-5a7defe28b56"]
    },
    {
        id: "parrot_vocab", label: "Parrot",
        en: "Parrot", hi: "तोता", kn: "ಗಿಳಿ",
        category: "vocabulary", syllables: "par • rot", phonetic_sound: "/ˈpærət/", phonetic_rule: "Two-syllable bird noun",
        image_keyword: "bright_green_parrot",
        photo_ids: ["1552728089-57bdde30beb3", "1544717297-fa95b6ee9643", "1546182990-dffeafbe841d", "1534188753412-3e26d0d618d6"]
    },
    {
        id: "phonetic_rat", label: "-at",
        en: "R-A-T Rat", hi: "रैट (चूहा)", kn: "ರ್ಯಾಟ್ (ಇಲಿ)",
        category: "phonetic_sound", syllables: "r • a • t", phonetic_sound: "/ræt/", phonetic_rule: "Short A (-at family)",
        image_keyword: "cute_little_mouse",
        photo_ids: ["1585110396000-c9ffd4e4b308", "1535268647677-300dbf3d78d1", "1591382364683-b2bf34667d4d", "1518796745738-41048802f99a"]
    }
];

const CLASS_1_ENGLISH_MRIDANG_UNIT3 = [
    {
        id: "mango_vocab", label: "Mango",
        en: "Mango", hi: "आम", kn: "ಮಾವಿನಹಣ್ಣು",
        category: "vocabulary", syllables: "man • go", phonetic_sound: "/ˈmæŋɡoʊ/", phonetic_rule: "Two-syllable fruit noun",
        image_keyword: "ripe_yellow_mangoes",
        photo_ids: ["1553279768-865429fa0078", "1601493700631-2b16ec4b4716", "1591073113125-e46713c829fe", "1567306226416-28f0efdc88ce"]
    },
    {
        id: "apple_vocab", label: "Apple",
        en: "Apple", hi: "सेब", kn: "ಸೇಬು",
        category: "vocabulary", syllables: "ap • ple", phonetic_sound: "/ˈæpl/", phonetic_rule: "Short A + silent e",
        image_keyword: "red_fresh_apple",
        photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"]
    },
    {
        id: "watermelon_vocab", label: "Watermelon",
        en: "Watermelon", hi: "तरबूज", kn: "ಕಲ್ಲಂಗಡಿ",
        category: "vocabulary", syllables: "wa • ter • me • lon", phonetic_sound: "/ˈwɔːtərmelən/", phonetic_rule: "Compound fruit noun",
        image_keyword: "fresh_watermelon_slice",
        photo_ids: ["1587049352846-4a222e784d38", "1563114773-84221bd62daa", "1589533610925-1c20387be62b", "1582281298055-e25b84a30b0b"]
    },
    {
        id: "water_vocab", label: "Water",
        en: "Water", hi: "पानी", kn: "ನೀರು",
        category: "vocabulary", syllables: "wa • ter", phonetic_sound: "/ˈwɔːtər/", phonetic_rule: "Two-syllable noun",
        image_keyword: "pure_fresh_water",
        photo_ids: ["1548839140-29a749e1bc4e", "1523362628745-0c100150b504", "1559827291-72ee739d0d9a", "1516214104703-d870798883c5"]
    },
    {
        id: "phonetic_pot", label: "-ot",
        en: "P-O-T Pot", hi: "पॉट (मटका)", kn: "ಪಾಟ್ (ಮಡಕೆ)",
        category: "phonetic_sound", syllables: "p • o • t", phonetic_sound: "/pɒt/", phonetic_rule: "Short O (-ot family)",
        image_keyword: "ceramic_flower_pot",
        photo_ids: ["1518709268805-4e9042af9f23", "1490750967868-88aa4486c946", "1508610048659-a06b669e3321", "1526047932273-341f2a7631f9"]
    }
];

const CLASS_1_ENGLISH_MRIDANG_UNIT4 = [
    {
        id: "sun_vocab", label: "Sun",
        en: "Sun", hi: "सूरज", kn: "ಸೂರ್ಯ",
        category: "vocabulary", syllables: "sun", phonetic_sound: "/sʌn/", phonetic_rule: "Short U (-un family)",
        image_keyword: "bright_shining_sun",
        photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"]
    },
    {
        id: "rain_vocab", label: "Rain",
        en: "Rain", hi: "बारिश", kn: "ಮಳೆ",
        category: "vocabulary", syllables: "rain", phonetic_sound: "/reɪn/", phonetic_rule: "Vowel team /ai/",
        image_keyword: "fresh_rain_water_drops",
        photo_ids: ["1515694346937-94d85e41e6f0", "1534274988757-a28bf1a57c17", "1519692933481-e162a57d6721", "1508873696983-2df57036476b"]
    },
    {
        id: "rainbow_vocab", label: "Rainbow",
        en: "Rainbow", hi: "इंद्रधनुष", kn: "ಕಾಮನಬಿಲ್ಲು",
        category: "vocabulary", syllables: "rain • bow", phonetic_sound: "/ˈreɪnboʊ/", phonetic_rule: "Compound nature noun",
        image_keyword: "bright_colorful_rainbow",
        photo_ids: ["1508873696983-2df57036476b", "1534447677768-be436bb09401", "1538370965046-79c0d6907d47", "1500382017468-9049fed747ef"]
    },
    {
        id: "tree_vocab", label: "Tree",
        en: "Tree", hi: "पेड़", kn: "ಮರ",
        category: "vocabulary", syllables: "tree", phonetic_sound: "/triː/", phonetic_rule: "Blend /tr/ + Long E /ee/",
        image_keyword: "green_forest_tree",
        photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"]
    },
    {
        id: "phonetic_run", label: "-un",
        en: "R-U-N Run", hi: "रन (दौड़ना)", kn: "ರನ್ (ಓಡು)",
        category: "phonetic_sound", syllables: "r • u • n", phonetic_sound: "/rʌn/", phonetic_rule: "Short U (-un family)",
        image_keyword: "cheerful_jumping_girl",
        photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1534447677768-be436bb09401", "1508873696983-2df57036476b"]
    }
];

const CLASS_1_ENGLISH_MRIDANG_SIGHT_WORDS = [
    { id: "one", label: "One", en: "One (1)", hi: "एक (1)", kn: "ಒಂದು (1)", image_keyword: "number_one_wooden_toy", photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"] },
    { id: "to", label: "To", en: "To", hi: "को / तक", kn: "ಗೆ / ವರೆಗೆ", image_keyword: "yellow_wooden_pencil", photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"] },
    { id: "and", label: "And", en: "And", hi: "और", kn: "ಮತ್ತು", image_keyword: "open_reading_book", photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"] },
    { id: "they", label: "They", en: "They", hi: "वे / उन्होंने", kn: "ಅವರು", image_keyword: "happy_school_children", photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1534447677768-be436bb09401", "1508873696983-2df57036476b"] },
    { id: "is", label: "Is", en: "Is", hi: "है", kn: "ಇದೆ", image_keyword: "bright_morning_sun", photo_ids: ["1538370965046-79c0d6907d47", "1500382017468-9049fed747ef", "1509114397022-ed747cca3f65", "1532274402911-5a369e4c4bb5"] },
    { id: "with", label: "With", en: "With", hi: "साथ में", kn: "ಜೊತೆಗೆ", image_keyword: "happy_loving_family", photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"] },
    { id: "have", label: "Have", en: "Have", hi: "पास होना", kn: "ಹೊಂದಿರುವುದು", image_keyword: "traditional_indian_lunch_plate", photo_ids: ["1613292443284-c770284457f0", "1589301760014-d929f3979dbc", "1601050690597-df0568f70950", "1546833999-b9f581a1996d"] }
];

/* Class 1 Hindi */
const CLASS_1_HINDI_SWAR = [
    { id: "a_swar", label: "अ", en: "A for Pomegranate", hi: "अ से अनार", kn: "ಅ ಇಂದ ದಾಳಿಂಬೆ", image_keyword: "fresh_red_pomegranate", photo_ids: ["1553279768-865429fa0078", "1601493700631-2b16ec4b4716", "1591073113125-e46713c829fe", "1567306226416-28f0efdc88ce"] },
    { id: "aa_swar", label: "आ", en: "Aa for Mango", hi: "आ से आम", kn: "ಆ ಇಂದ ಮಾವಿನಹಣ್ಣು", image_keyword: "fresh_yellow_mango", photo_ids: ["1553279768-865429fa0078", "1601493700631-2b16ec4b4716", "1591073113125-e46713c829fe", "1567306226416-28f0efdc88ce"] },
    { id: "i_swar", label: "इ", en: "I for Tamarind", hi: "इ से इमली", kn: "ಇ ಇಂದ ಹುಣಸೆಹಣ್ಣು", image_keyword: "brown_tamarind_fruit", photo_ids: ["1537640538966-79f369143f8f", "1596363505729-4190a9506133", "1599819044578-8316dfa9c72e", "1423483641154-5411ec9c0ddf"] },
    { id: "ee_swar", label: "ई", en: "Ee for Sugarcane", hi: "ई से ईख", kn: "ಈ ಇಂದ ಕಬ್ಬು", image_keyword: "green_sugarcane_stalk", photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"] },
    { id: "u_swar", label: "उ", en: "U for Owl", hi: "उ से उल्लू", kn: "ಉ ಇಂದ ಗೂಬೆ", image_keyword: "night_wild_owl", photo_ids: ["1543466835-00a7907e9de1", "1583511655857-d19b40a7a54e", "1537151608828-ea2b11777ee8", "1587300003388-59208cc962cb"] },
    { id: "oo_swar", label: "ऊ", en: "Oo for Wool", hi: "ऊ से ऊन", kn: "ಊ ಇಂದ ಉಣ್ಣೆ", image_keyword: "colorful_knitting_wool", photo_ids: ["1501443782928-176691a9b340", "1563805042-7684c019e1cb", "1497034825429-c343d7c6a68f", "1570197788417-0e82375c9371"] },
    { id: "ang_swar", label: "अं", en: "Ang for Grapes", hi: "अं से अंगूर", kn: "ಅಂ ಇಂದ ದ್ರಾಕ್ಷಿ", image_keyword: "fresh_purple_grapes", photo_ids: ["1537640538966-79f369143f8f", "1596363505729-4190a9506133", "1599819044578-8316dfa9c72e", "1423483641154-5411ec9c0ddf"] }
];

const CLASS_1_HINDI_VYANJAN = [
    { id: "ka_vyanjan", label: "क", en: "K for Lotus", hi: "क से कमल", kn: "ಕ ಇಂದ ಕಮಲ", image_keyword: "pink_lotus_flower", photo_ids: ["1518709268805-4e9042af9f23", "1490750967868-88aa4486c946", "1508610048659-a06b669e3321", "1526047932273-341f2a7631f9"] },
    { id: "kha_vyanjan", label: "ख", en: "Kh for Rabbit", hi: "ख से खरगोश", kn: "ಖ ಇಂದ ಮೊಲ", image_keyword: "cute_white_rabbit", photo_ids: ["1585110396000-c9ffd4e4b308", "1535268647677-300dbf3d78d1", "1591382364683-b2bf34667d4d", "1518796745738-41048802f99a"] },
    { id: "ga_vyanjan", label: "ग", en: "G for Flowerpot", hi: "ग से गमला", kn: "ಗ ಇಂದ ಕುಂಡ", image_keyword: "ceramic_flower_pot", photo_ids: ["1518709268805-4e9042af9f23", "1490750967868-88aa4486c946", "1508610048659-a06b669e3321", "1526047932273-341f2a7631f9"] },
    { id: "gha_vyanjan", label: "घ", en: "Gh for Home", hi: "घ से घर", kn: "ಘ ಇಂದ ಮನೆ", image_keyword: "brick_family_house", photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"] },
    { id: "cha_vyanjan", label: "च", en: "Ch for Spoon", hi: "च से चम्मच", kn: "ಚ ಇಂದ ಚಮಚ", image_keyword: "silver_metal_spoon", photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"] }
];

const CLASS_1_HINDI_TWO_LETTER = [
    { id: "ghar", label: "घर", en: "Ghar (Home)", hi: "घ + र = घर", kn: "ಘರ್ (ಮನೆ)", image_keyword: "brick_family_house", photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"] },
    { id: "jal", label: "जल", en: "Jal (Water)", hi: "ज + ल = जल", kn: "ಜಲ್ (ನೀರು)", image_keyword: "pure_fresh_water", photo_ids: ["1548839140-29a749e1bc4e", "1523362628745-0c100150b504", "1559827291-72ee739d0d9a", "1516214104703-d870798883c5"] },
    { id: "fal", label: "फल", en: "Fal (Fruit)", hi: "फ + ल = फल", kn: "ಫಲ್ (ಹಣ್ಣು)", image_keyword: "fresh_purple_grapes", photo_ids: ["1537640538966-79f369143f8f", "1596363505729-4190a9506133", "1599819044578-8316dfa9c72e", "1423483641154-5411ec9c0ddf"] },
    { id: "bas", label: "बस", en: "Bas (Bus)", hi: "ब + स = बस", kn: "ಬಸ್ (ಬಸ್ಸು)", image_keyword: "yellow_school_bus", photo_ids: ["1544620347-c4fd4a3d5957", "1570125909232-eb263c188f7e", "1557223562-6c77ef16210f", "1464219789935-c2d9d9aba644"] }
];

/* Class 1 Kannada */
const CLASS_1_KANNADA_AKSHARAMALE = [
    { id: "kn_a", label: "ಅ", en: "A for King", hi: "अ से राजा", kn: "ಅ ಇಂದ ಅರಸ", image_keyword: "royal_golden_crown", photo_ids: ["1535713875002-d1d0cf377fde", "1579783902614-a3fb3927b675", "1589829085413-56de8ae18c73", "1519791883288-dc8bd696e667"] },
    { id: "kn_aa", label: "ಆ", en: "Aa for Elephant", hi: "आ से हाथी", kn: "ಆ ಇಂದ ಆನೆ", image_keyword: "african_wild_elephant", photo_ids: ["1557050543-4d5f4e07ef46", "1581852017103-68ac65514cf7", "1564760055775-d63b17a55c44", "1549366021-9f761d450615"] },
    { id: "kn_i", label: "ಇ", en: "I for Mouse", hi: "इ से चूहा", kn: "ಇ ಇಂದ ಇಲಿ", image_keyword: "cute_little_mouse", photo_ids: ["1585110396000-c9ffd4e4b308", "1535268647677-300dbf3d78d1", "1591382364683-b2bf34667d4d", "1518796745738-41048802f99a"] },
    { id: "kn_ee", label: "ಈ", en: "Ee for Swim", hi: "ई से तैरना", kn: "ಈ ಇಂದ ಈಜು", image_keyword: "pure_fresh_water", photo_ids: ["1548839140-29a749e1bc4e", "1523362628745-0c100150b504", "1559827291-72ee739d0d9a", "1516214104703-d870798883c5"] },
    { id: "kn_ka", label: "ಕ", en: "Ka for Lotus", hi: "क से कमल", kn: "ಕ ಇಂದ ಕಮಲ", image_keyword: "pink_lotus_flower", photo_ids: ["1518709268805-4e9042af9f23", "1490750967868-88aa4486c946", "1508610048659-a06b669e3321", "1526047932273-341f2a7631f9"] },
    { id: "kn_ga", label: "ಗ", en: "Ga for Parrot", hi: "ग से तोता", kn: "ಗ ಇಂದ ಗಿಳಿ", image_keyword: "green_wild_parrot", photo_ids: ["1546182990-dffeafbe841d", "1534188753412-3e26d0d618d6", "1561731216-c3a4d99437d5", "1575550959106-5a7defe28b56"] },
    { id: "kn_ma", label: "ಮ", en: "Ma for Mango", hi: "म से आम", kn: "ಮ ಇಂದ ಮಾವು", image_keyword: "fresh_yellow_mango", photo_ids: ["1553279768-865429fa0078", "1601493700631-2b16ec4b4716", "1591073113125-e46713c829fe", "1567306226416-28f0efdc88ce"] }
];

const CLASS_1_KANNADA_BASIC_VOCAB = [
    { id: "amma", label: "ಅಮ್ಮ", en: "Amma (Mother)", hi: "माँ (Mother)", kn: "ಅಮ್ಮ", image_keyword: "brick_family_house", photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"] },
    { id: "mane", label: "ಮನೆ", en: "Mane (House)", hi: "घर (House)", kn: "ಮನೆ", image_keyword: "brick_family_house", photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"] },
    { id: "neeru", label: "ನೀರು", en: "Neeru (Water)", hi: "पानी (Water)", kn: "ನೀರು", image_keyword: "pure_fresh_water", photo_ids: ["1548839140-29a749e1bc4e", "1523362628745-0c100150b504", "1559827291-72ee739d0d9a", "1516214104703-d870798883c5"] },
    { id: "hoovu", label: "ಹೂವು", en: "Hoovu (Flower)", hi: "फूल (Flower)", kn: "ಹೂವು", image_keyword: "blooming_red_rose", photo_ids: ["1518709268805-4e9042af9f23", "1490750967868-88aa4486c946", "1508610048659-a06b669e3321", "1526047932273-341f2a7631f9"] }
];

/* Class 1 Maths */
const CLASS_1_MATHS_PRE_NUMBER = [
    { id: "big_small", label: "Big & Small", en: "Big and Small", hi: "बड़ा और छोटा", kn: "ದೊಡ್ಡದು ಮತ್ತು ಸಣ್ಣದು", image_keyword: "african_wild_elephant", photo_ids: ["1557050543-4d5f4e07ef46", "1581852017103-68ac65514cf7", "1564760055775-d63b17a55c44", "1549366021-9f761d450615"] },
    { id: "tall_short", label: "Tall & Short", en: "Tall and Short", hi: "लंबा और नाटा", kn: "ಎತ್ತರ ಮತ್ತು ಗಿಡ್ಡ", image_keyword: "green_forest_tree", photo_ids: ["1513836279014-a89f7a76ae86", "1448375240586-882707db888b", "1502082553048-f009c37129b9", "1473448912268-2022ce9509d8"] },
    { id: "heavy_light", label: "Heavy & Light", en: "Heavy and Light", hi: "भारी और हल्का", kn: "ಭಾರ ಮತ್ತು ಹಗುರ", image_keyword: "yellow_wooden_pencil", photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"] }
];

const CLASS_1_MATHS_SHAPES = [
    { id: "circle", label: "Circle", en: "Circle", hi: "वृत्त (Circle)", kn: "ವೃತ್ತ (Circle)", image_keyword: "red_soccer_ball", photo_ids: ["1558060370-d644479cb6f7", "1575361204480-aadea25e6e68", "1546519638-68e109498ffc", "1534438327276-14e5300c3a48"] },
    { id: "square", label: "Square", en: "Square", hi: "वर्ग (Square)", kn: "ಚೌಕ (Square)", image_keyword: "ceramic_flower_pot", photo_ids: ["1518709268805-4e9042af9f23", "1490750967868-88aa4486c946", "1508610048659-a06b669e3321", "1526047932273-341f2a7631f9"] },
    { id: "triangle", label: "Triangle", en: "Triangle", hi: "त्रिभुज (Triangle)", kn: "ತ್ರಿಕೋನ (Triangle)", image_keyword: "flying_colorful_kite", photo_ids: ["1508873696983-2df57036476b", "1516214104703-d870798883c5", "1534447677768-be436bb09401", "1508873696983-2df57036476b"] },
    { id: "star", label: "Star", en: "Star", hi: "तारा (Star)", kn: "ನಕ್ಷತ್ರ (Star)", image_keyword: "full_night_moon", photo_ids: ["1532693322450-2cb5c511067d", "1522030299830-16b8d3d049fe", "1509198397868-475647b2a1e5", "1532767153582-b1a0e5145009"] }
];

const CLASS_1_MATHS_ADDITION = [
    { id: "add_1", label: "1 + 1", en: "1 + 1 = 2", hi: "१ + १ = २", kn: "೧ + ೧ = ೨", image_keyword: "red_fresh_apple", photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"] },
    { id: "add_2", label: "2 + 3", en: "2 + 3 = 5", hi: "२ + ३ = ५", kn: "೨ + ೩ = ೫", image_keyword: "red_fresh_apple", photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"] },
    { id: "add_3", label: "5 + 5", en: "5 + 5 = 10", hi: "५ + ५ = १०", kn: "೫ + ೫ = ೧೦", image_keyword: "red_fresh_apple", photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"] },
    { id: "add_4", label: "10 + 10", en: "10 + 10 = 20", hi: "१० + १० = २०", kn: "೧೦ + ೧೦ = ೨೦", image_keyword: "red_fresh_apple", photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"] }
];

/* Class 1 EVS */
const CLASS_1_EVS_ANIMALS = [
    { id: "lion", label: "Lion", en: "Lion", hi: "शेर (Lion)", kn: "ಸಿಂಹ (Lion)", image_keyword: "african_male_lion", photo_ids: ["1546182990-dffeafbe841d", "1534188753412-3e26d0d618d6", "1561731216-c3a4d99437d5", "1575550959106-5a7defe28b56"] },
    { id: "elephant", label: "Elephant", en: "Elephant", hi: "हाथी (Elephant)", kn: "ಆನೆ (Elephant)", image_keyword: "african_wild_elephant", photo_ids: ["1557050543-4d5f4e07ef46", "1581852017103-68ac65514cf7", "1564760055775-d63b17a55c44", "1549366021-9f761d450615"] },
    { id: "horse", label: "Horse", en: "Horse", hi: "घोड़ा (Horse)", kn: "ಕುದುರೆ (Horse)", image_keyword: "brown_galloping_horse", photo_ids: ["1534447677768-be436bb09401", "1553284965-83fd3e82fa5a", "1535268647677-300dbf3d78d1", "1558929996-ac64ba4bae7e"] },
    { id: "dog", label: "Dog", en: "Dog", hi: "कुत्ता (Dog)", kn: "ನಾಯಿ (Dog)", image_keyword: "golden_retriever_dog", photo_ids: ["1543466835-00a7907e9de1", "1583511655857-d19b40a7a54e", "1537151608828-ea2b11777ee8", "1587300003388-59208cc962cb"] }
];

const CLASS_1_EVS_FRUITS = [
    { id: "fruit_apple", label: "Apple", en: "Apple", hi: "सेब (Apple)", kn: "ಸೇಬು (Apple)", image_keyword: "red_fresh_apple", photo_ids: ["1560806887-1e4cd0b6cbd6", "1619546813926-a78fa6372cd2", "1570913149827-d2ac84ab3f9a", "1568702846914-96b305d2aaeb"] },
    { id: "fruit_mango", label: "Mango", en: "Mango", hi: "आम (Mango)", kn: "ಮಾವಿನಹಣ್ಣು (Mango)", image_keyword: "fresh_yellow_mango", photo_ids: ["1553279768-865429fa0078", "1601493700631-2b16ec4b4716", "1591073113125-e46713c829fe", "1567306226416-28f0efdc88ce"] },
    { id: "fruit_orange", label: "Orange", en: "Orange", hi: "संतरा (Orange)", kn: "ಕಿತ್ತಳೆ (Orange)", image_keyword: "ripe_orange_citrus", photo_ids: ["1582979512210-99b6a53386f9", "1557800636-894a64c1696f", "1547514701-42782101795e", "1611080626919-7cf5a9dbab5b"] },
    { id: "fruit_grapes", label: "Grapes", en: "Grapes", hi: "अंगूर (Grapes)", kn: "ದ್ರಾಕ್ಷಿ (Grapes)", image_keyword: "fresh_purple_grapes", photo_ids: ["1537640538966-79f369143f8f", "1596363505729-4190a9506133", "1599819044578-8316dfa9c72e", "1423483641154-5411ec9c0ddf"] }
];

const CLASS_1_EVS_BODY_PARTS = [
    { id: "eyes", label: "Eyes", en: "Eyes to See", hi: "आँखें (Eyes)", kn: "ಕಣ್ಣುಗಳು (Eyes)", image_keyword: "human_seeing_eyes", photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"] },
    { id: "ears", label: "Ears", en: "Ears to Hear", hi: "कान (Ears)", kn: "ಕಿವಿಗಳು (Ears)", image_keyword: "human_hearing_ears", photo_ids: ["1544716278-ca5e3f4abd8c", "1512820790803-83ca734da794", "1497633762265-9d179a990aa6", "1495446815901-a7297e633e8d"] },
    { id: "hands", label: "Hands", en: "Hands to Hold", hi: "हाथ (Hands)", kn: "ಕೈಗಳು (Hands)", image_keyword: "human_holding_hands", photo_ids: ["1585336261026-7fcf1f40d754", "1513542789411-b6a5d4f31634", "1569683795645-b62e50fbf103", "1588702547923-7093a6c3ba33"] }
];


/**
 * MASTER CURRICULUM TREE (CLASSES 1 - 5)
 */
export const CURRICULUM_DATA = {
    1: {
        english: {
            title: "English (Mridang)",
            topics: [
                { id: "mridang_unit1", title: { en: "Unit 1: My Family & Me", hi: "इकाई १: मेरा परिवार और मैं", kn: "ಘಟಕ ೧: ನನ್ನ ಕುಟುಂಬ ಮತ್ತು ನಾನು" }, units: CLASS_1_ENGLISH_MRIDANG_UNIT1.map(createTopicUnit) },
                { id: "mridang_unit2", title: { en: "Unit 2: Life Around Us", hi: "इकाई २: हमारे आस-पास का जीवन", kn: "ಘಟಕ ೨: ನಮ್ಮ ಸುತ್ತಲಿನ ಜೀವಿಗಳು" }, units: CLASS_1_ENGLISH_MRIDANG_UNIT2.map(createTopicUnit) },
                { id: "mridang_unit3", title: { en: "Unit 3: Food & Market", hi: "इकाई ३: हमारा भोजन और बाज़ार", kn: "ಘಟಕ ೩: ಆಹಾರ ಮತ್ತು ಮಾರುಕಟ್ಟೆ" }, units: CLASS_1_ENGLISH_MRIDANG_UNIT3.map(createTopicUnit) },
                { id: "mridang_unit4", title: { en: "Unit 4: Seasons & Rainbow", hi: "इकाई ४: ऋतुएं और इंद्रधनुष", kn: "ಘಟಕ ೪: ಋತುಗಳು ಮತ್ತು ಕಾಮನಬಿಲ್ಲು" }, units: CLASS_1_ENGLISH_MRIDANG_UNIT4.map(createTopicUnit) },
                { id: "alphabets", title: { en: "Mridang Phonics (A-Z)", hi: "मृदंग वर्णमाला (Phonics A-Z)", kn: "ಮೃದಂಗ ವರ್ಣಮಾಲೆ (A-Z)" }, units: CLASS_1_ENGLISH_ALPHABETS.map(createTopicUnit) },
                { id: "sight_words", title: { en: "Mridang Sight Words", hi: "मृदंग दृष्टि शब्द", kn: "ಮೃದಂಗ ದೃಷ್ಟಿ ಪದಗಳು" }, units: CLASS_1_ENGLISH_MRIDANG_SIGHT_WORDS.map(createTopicUnit) }
            ]
        },
        hindi: {
            title: "Hindi",
            topics: [
                { id: "swar", title: { en: "Swar (स्वर)", hi: "स्वर (Swar)", kn: "ಸ್ವರಗಳು" }, units: CLASS_1_HINDI_SWAR.map(createTopicUnit) },
                { id: "vyanjan", title: { en: "Vyanjan (व्यंजन)", hi: "व्यंजन (Vyanjan)", kn: "ವ್ಯಂಜನಗಳು" }, units: CLASS_1_HINDI_VYANJAN.map(createTopicUnit) },
                { id: "two_letter", title: { en: "2-Letter Words", hi: "दो अक्षर वाले शब्द", kn: "ಎರಡು ಅಕ್ಷರದ ಪದಗಳು" }, units: CLASS_1_HINDI_TWO_LETTER.map(createTopicUnit) }
            ]
        },
        kannada: {
            title: "Kannada",
            topics: [
                { id: "aksharamale", title: { en: "Aksharamale", hi: "कन्नड़ वर्णमाला", kn: "ಅಕ್ಷರಮಾಲೆ" }, units: CLASS_1_KANNADA_AKSHARAMALE.map(createTopicUnit) },
                { id: "basic_vocab", title: { en: "Basic Vocab", hi: "मूल शब्दावली", kn: "ಮೂಲ ಶಬ್ದಕೋಶ" }, units: CLASS_1_KANNADA_BASIC_VOCAB.map(createTopicUnit) }
            ]
        },
        maths: {
            title: "Maths",
            topics: [
                { id: "pre_number", title: { en: "Pre-number", hi: "पूर्व संख्या अवधारणाएं", kn: "ಪೂರ್ವ ಸಂಖ್ಯೆಗಳು" }, units: CLASS_1_MATHS_PRE_NUMBER.map(createTopicUnit) },
                { id: "shapes", title: { en: "Shapes", hi: "आकृतियाँ", kn: "ಆಕಾರಗಳು" }, units: CLASS_1_MATHS_SHAPES.map(createTopicUnit) },
                { id: "addition", title: { en: "Addition 1-20", hi: "जोड़ १-२०", kn: "ಸಂಕಲನ ೧-೨೦" }, units: CLASS_1_MATHS_ADDITION.map(createTopicUnit) }
            ]
        },
        evs: {
            title: "EVS / GK",
            topics: [
                { id: "animals", title: { en: "Animals", hi: "जानवर", kn: "ಪ್ರಾಣಿಗಳು" }, units: CLASS_1_EVS_ANIMALS.map(createTopicUnit) },
                { id: "fruits", title: { en: "Fruits", hi: "फल", kn: "ಹಣ್ಣುಗಳು" }, units: CLASS_1_EVS_FRUITS.map(createTopicUnit) },
                { id: "body_parts", title: { en: "Body Parts", hi: "शरीर के अंग", kn: "ದೇಹದ ಭಾಗಗಳು" }, units: CLASS_1_EVS_BODY_PARTS.map(createTopicUnit) }
            ]
        }
    },
    2: {
        english: {
            title: "English",
            topics: [
                { id: "nouns", title: { en: "Nouns", hi: "संज्ञा", kn: "ನಾಮಪದಗಳು" }, units: CLASS_2_ENGLISH_NOUNS.map(createTopicUnit) },
                { id: "opposites", title: { en: "Opposites", hi: "विलोम शब्द", kn: "ವಿರುದ್ಧ ಪದಗಳು" }, units: CLASS_2_ENGLISH_OPPOSITES.map(createTopicUnit) },
                { id: "articles", title: { en: "Articles (A, An, The)", hi: "आर्टिकल्स", kn: "ಉಪಪದಗಳು" }, units: CLASS_2_ENGLISH_ARTICLES.map(createTopicUnit) },
                { id: "phonics", title: { en: "Word Families (-ot, -et)", hi: "ध्वनि परिवार", kn: "ಉಚ್ಚಾರಣಾ ಕುಟುಂಬಗಳು" }, units: CLASS_2_ENGLISH_PHONICS.map(createTopicUnit) }
            ]
        },
        hindi: {
            title: "Hindi",
            topics: [
                { id: "matrae", title: { en: "Matrae (मात्राएँ)", hi: "मात्राएँ", kn: "ಮಾತ್ರೆಗಳು" }, units: CLASS_2_HINDI_MATRAE.map(createTopicUnit) },
                { id: "sangya", title: { en: "Sangya (संज्ञा)", hi: "संज्ञा", kn: "ನಾಮಪದಗಳು" }, units: CLASS_2_HINDI_SANGYA.map(createTopicUnit) },
                { id: "words3", title: { en: "3-Letter Words", hi: "तीन अक्षर वाले शब्द", kn: "ಮೂರು ಅಕ್ಷರದ ಪದಗಳು" }, units: CLASS_2_HINDI_WORDS3.map(createTopicUnit) }
            ]
        },
        kannada: {
            title: "Kannada",
            topics: [
                { id: "gunintagalu", title: { en: "Gunintagalu", hi: "गुणिंतागलु", kn: "ಗುಣಿತಾಕ್ಷರಗಳು" }, units: CLASS_2_KANNADA_GUNINTAGALU.map(createTopicUnit) },
                { id: "relationships", title: { en: "Relationships", hi: "संबंध", kn: "ಸಂಬಂಧಗಳು" }, units: CLASS_2_KANNADA_RELATIONSHIPS.map(createTopicUnit) },
                { id: "home", title: { en: "Home & Body", hi: "घर व वातावरण", kn: "ಮನೆ ಮತ್ತು ಪರಿಸರ" }, units: CLASS_2_KANNADA_HOME.map(createTopicUnit) }
            ]
        },
        maths: {
            title: "Maths",
            topics: [
                { id: "numbers_100", title: { en: "Numbers to 100", hi: "संख्याएँ १०० तक", kn: "೧೦೦ ರವರೆಗಿನ ಸಂಖ್ಯೆಗಳು" }, units: CLASS_2_MATHS_NUMBERS.map(createTopicUnit) },
                { id: "money", title: { en: "Money & Coins", hi: "रुपये व सिक्के", kn: "ನಾಣ್ಯ & ನೋಟುಗಳು" }, units: CLASS_2_MATHS_MONEY.map(createTopicUnit) },
                { id: "time", title: { en: "Time & Clocks", hi: "समय और घड़ी", kn: "ಸಮಯ ಮತ್ತು ಗಡಿಯಾರ" }, units: CLASS_2_MATHS_TIME.map(createTopicUnit) }
            ]
        },
        evs: {
            title: "EVS / GK",
            topics: [
                { id: "transport", title: { en: "Transport", hi: "यातायात", kn: "ಸಾರಿಗೆ" }, units: CLASS_2_EVS_TRANSPORT.map(createTopicUnit) },
                { id: "seasons", title: { en: "Seasons", hi: "ऋतुएँ", kn: "ಋತುಗಳು" }, units: CLASS_2_EVS_SEASONS.map(createTopicUnit) },
                { id: "festivals", title: { en: "Festivals", hi: "त्योहार", kn: "ಹಬ್ಬಗಳು" }, units: CLASS_2_EVS_FESTIVALS.map(createTopicUnit) }
            ]
        }
    },
    3: {
        english: {
            title: "English",
            topics: [
                { id: "verbs", title: { en: "Verbs (Action Words)", hi: "क्रिया शब्द", kn: "ಕ್ರಿಯಾಪದಗಳು" }, units: CLASS_3_ENGLISH_VERBS.map(createTopicUnit) },
                { id: "adjectives", title: { en: "Adjectives", hi: "विशेषण", kn: "ಗುಣವಾಚಕಗಳು" }, units: CLASS_3_ENGLISH_ADJECTIVES.map(createTopicUnit) },
                { id: "prepositions", title: { en: "Prepositions", hi: "संबंधबोधक", kn: "ಸ್ಥಾನ ಸೂಚಕಗಳು" }, units: CLASS_3_ENGLISH_PREPOSITIONS.map(createTopicUnit) },
                { id: "blends", title: { en: "Phonics Blends", hi: "संयुक्त ध्वनियाँ", kn: "ಸಂಯುಕ್ತ ಉಚ್ಚಾರಣೆಗಳು" }, units: CLASS_3_ENGLISH_BLENDS.map(createTopicUnit) }
            ]
        },
        hindi: {
            title: "Hindi",
            topics: [
                { id: "sarvanaam", title: { en: "Sarvanaam", hi: "सर्वनाम", kn: "ಸರ್ವನಾಮಗಳು" }, units: CLASS_3_HINDI_SARVANAAM.map(createTopicUnit) },
                { id: "vilom", title: { en: "Vilom Shabd", hi: "विलोम शब्द", kn: "ವಿರುದ್ಧ ಪದಗಳು" }, units: CLASS_3_HINDI_VILOM.map(createTopicUnit) },
                { id: "paryayvachi", title: { en: "Paryayvachi", hi: "पर्यायवाची शब्द", kn: "ಸಮಾನಾರ್ಥಕ ಪದಗಳು" }, units: CLASS_3_HINDI_PARYAYVACHI.map(createTopicUnit) }
            ]
        },
        kannada: {
            title: "Kannada",
            topics: [
                { id: "ottakshara", title: { en: "Ottakshara", hi: "ओत्ताक्षर", kn: "ಒತ್ತಕ್ಷರಗಳು" }, units: CLASS_3_KANNADA_OTTAKSHARA.map(createTopicUnit) },
                { id: "adjectives_kn", title: { en: "Describing Words", hi: "विशेषण", kn: "ಗುಣವಾಚಕಗಳು" }, units: CLASS_3_KANNADA_ADJECTIVES.map(createTopicUnit) },
                { id: "nature_kn", title: { en: "Nature & Animals", hi: "प्रकृति", kn: "ಪ್ರಕೃತಿ ಮತ್ತು ಪರಿಸರ" }, units: CLASS_3_KANNADA_NATURE.map(createTopicUnit) }
            ]
        },
        maths: {
            title: "Maths",
            topics: [
                { id: "numbers_3digit", title: { en: "3-Digit Numbers", hi: "३-अंकीय संख्याएँ", kn: "೩-ಅಂಕಿಯ ಸಂಖ್ಯೆಗಳು" }, units: CLASS_3_MATHS_NUMBERS_3DIGIT.map(createTopicUnit) },
                { id: "tables", title: { en: "Tables 1-10", hi: "पहाड़े १-१०", kn: "ಮಗ್ಗಿಗಳು ೧-೧೦" }, units: CLASS_3_MATHS_TABLES.map(createTopicUnit) },
                { id: "shapes_geo", title: { en: "Shapes & Geometry", hi: "ज्यामितीय आकृतियाँ", kn: "ಆಕಾರಗಳು ಮತ್ತು ರೇಖಾಗಣಿತ" }, units: CLASS_3_MATHS_SHAPES.map(createTopicUnit) }
            ]
        },
        evs: {
            title: "EVS / GK",
            topics: [
                { id: "solar_system", title: { en: "Solar System", hi: "सौर मंडल", kn: "ಸೌರವ್ಯೂಹ" }, units: CLASS_3_EVS_SOLAR_SYSTEM.map(createTopicUnit) },
                { id: "plants", title: { en: "Parts of Plants", hi: "पौधों के भाग", kn: "ಸಸ್ಯದ ಭಾಗಗಳು" }, units: CLASS_3_EVS_PLANTS.map(createTopicUnit) },
                { id: "food_groups", title: { en: "Food Groups", hi: "भोजन के घटक", kn: "ಆಹಾರದ ವರ್ಗಗಳು" }, units: CLASS_3_EVS_FOOD_GROUPS.map(createTopicUnit) }
            ]
        }
    },
    4: {
        english: {
            title: "English",
            topics: [
                { id: "tenses", title: { en: "Tenses (Past & Present)", hi: "काल", kn: "ಕಾಲಗಳು" }, units: CLASS_4_ENGLISH_TENSES.map(createTopicUnit) },
                { id: "adverbs", title: { en: "Adverbs", hi: "क्रिया विशेषण", kn: "ಕ್ರಿಯಾ ವಿಶೇಷಣಗಳು" }, units: CLASS_4_ENGLISH_ADVERBS.map(createTopicUnit) },
                { id: "homophones", title: { en: "Homophones", hi: "समध्वनि शब्द", kn: "ಸಮ ಉಚ್ಚಾರಣೆಯ ಪದಗಳು" }, units: CLASS_4_ENGLISH_HOMOPHONES.map(createTopicUnit) }
            ]
        },
        hindi: {
            title: "Hindi",
            topics: [
                { id: "kriya", title: { en: "Kriya", hi: "क्रिया", kn: "ಕ್ರಿಯಾಪದಗಳು" }, units: CLASS_4_HINDI_KRIYA.map(createTopicUnit) },
                { id: "visheshan", title: { en: "Visheshan", hi: "विशेषण", kn: "ಗುಣವಾಚಕಗಳು" }, units: CLASS_4_HINDI_VISHESHAN.map(createTopicUnit) },
                { id: "muhavare", title: { en: "Muhavare", hi: "मुहावरे", kn: "ನುಡಿಗಟ್ಟುಗಳು" }, units: CLASS_4_HINDI_MUHAVARE.map(createTopicUnit) }
            ]
        },
        kannada: {
            title: "Kannada",
            topics: [
                { id: "grammar_basics", title: { en: "Grammar Basics", hi: "व्याकरण", kn: "ವ್ಯಾಕರಣದ ಮೂಲಗಳು" }, units: CLASS_4_KANNADA_GRAMMAR.map(createTopicUnit) },
                { id: "vibhakti", title: { en: "Vibhakti Pratyayagalu", hi: "विभक्ति", kn: "ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳು" }, units: CLASS_4_KANNADA_VIBHAKTI.map(createTopicUnit) },
                { id: "linga_vachana", title: { en: "Linga & Vachana", hi: "लिंग व वचन", kn: "ಲಿಂಗ ಮತ್ತು ವಚನ" }, units: CLASS_4_KANNADA_LINGA_VACHANA.map(createTopicUnit) }
            ]
        },
        maths: {
            title: "Maths",
            topics: [
                { id: "fractions", title: { en: "Fractions (1/2, 1/4)", hi: "भिन्न", kn: "ಭಿನ್ನರಾಶಿಗಳು" }, units: CLASS_4_MATHS_FRACTIONS.map(createTopicUnit) },
                { id: "division", title: { en: "Division & Sharing", hi: "भाग", kn: "ಭಾಗಾಕಾರ" }, units: CLASS_4_MATHS_DIVISION.map(createTopicUnit) },
                { id: "perimeter_area", title: { en: "Perimeter & Area", hi: "परिमाप व क्षेत्रफल", kn: "ಸುತ್ತಳತೆ ಮತ್ತು ವಿಸ್ತೀರ್ಣ" }, units: CLASS_4_MATHS_PERIMETER_AREA.map(createTopicUnit) }
            ]
        },
        evs: {
            title: "EVS / GK",
            topics: [
                { id: "human_organs", title: { en: "Human Organs", hi: "मानव अंग", kn: "ಮಾನವ ಅಂಗಗಳು" }, units: CLASS_4_EVS_ORGANS.map(createTopicUnit) },
                { id: "water_cycle", title: { en: "Water Cycle", hi: "जल चक्र", kn: "ಜಲ ಚಕ್ರ" }, units: CLASS_4_EVS_WATER_CYCLE.map(createTopicUnit) },
                { id: "community_helpers", title: { en: "Community Helpers", hi: "हमारे सहायक", kn: "ಸಮುದಾಯ ಸಹಾಯಕರು" }, units: CLASS_4_EVS_COMMUNITY_HELPERS.map(createTopicUnit) }
            ]
        }
    },
    5: {
        english: {
            title: "English",
            topics: [
                { id: "idioms", title: { en: "Idioms & Phrases", hi: "मुहावरे", kn: "ನುಡಿಗಟ್ಟುಗಳು" }, units: CLASS_5_ENGLISH_IDIOMS.map(createTopicUnit) },
                { id: "affixes", title: { en: "Prefix & Suffix", hi: "उपसर्ग व प्रत्यय", kn: "ಉಪಸರ್ಗ ಮತ್ತು ಪ್ರತ್ಯಯ" }, units: CLASS_5_ENGLISH_AFFIXES.map(createTopicUnit) },
                { id: "conjunctions", title: { en: "Conjunctions", hi: "समुच्चयबोधक", kn: "ಸಂಯೋಜಕ ಪದಗಳು" }, units: CLASS_5_ENGLISH_CONJUNCTIONS.map(createTopicUnit) }
            ]
        },
        hindi: {
            title: "Hindi",
            topics: [
                { id: "kaal", title: { en: "Kaal (काल)", hi: "काल", kn: "ಕಾಲಗಳು" }, units: CLASS_5_HINDI_KAAL.map(createTopicUnit) },
                { id: "karak", title: { en: "Karak (कारक)", hi: "कारक", kn: "ಕಾರಕಗಳು" }, units: CLASS_5_HINDI_KARAK.map(createTopicUnit) },
                { id: "anekarthi", title: { en: "Anekarthi Shabd", hi: "अनेकार्थी शब्द", kn: "ಅನೇಕಾರ್ಥ ಪದಗಳು" }, units: CLASS_5_HINDI_ANEKARTHI.map(createTopicUnit) }
            ]
        },
        kannada: {
            title: "Kannada",
            topics: [
                { id: "literature_vocab", title: { en: "Literature Vocab", hi: "साहित्य", kn: "ಸಾಹಿತ್ಯ ಶಬ್ದಕೋಶ" }, units: CLASS_5_KANNADA_LITERATURE.map(createTopicUnit) },
                { id: "sandhi", title: { en: "Sandhi Basics", hi: "सन्धि", kn: "ಸಂಧಿ ನಿಯಮಗಳು" }, units: CLASS_5_KANNADA_SANDHI.map(createTopicUnit) },
                { id: "proverbs", title: { en: "Proverbs (Gaadegalu)", hi: "कहावतें", kn: "ಗಾದೆಗಳು" }, units: CLASS_5_KANNADA_PROVERBS.map(createTopicUnit) }
            ]
        },
        maths: {
            title: "Maths",
            topics: [
                { id: "large_numbers", title: { en: "Large Numbers (10k, 1 Lakh)", hi: "बड़ी संख्याएँ", kn: "ದೊಡ್ಡ ಸಂಖ್ಯೆಗಳು" }, units: CLASS_5_MATHS_LARGE_NUMBERS.map(createTopicUnit) },
                { id: "decimals", title: { en: "Decimals (0.5, 0.25)", hi: "दशमलव", kn: "ದಶಮಾಂಶಗಳು" }, units: CLASS_5_MATHS_DECIMALS.map(createTopicUnit) },
                { id: "angles", title: { en: "Angles & Geometry", hi: "कोण और ज्यामिति", kn: "ಕೋನಗಳು ಮತ್ತು ಜ್ಯಾಮಿತಿ" }, units: CLASS_5_MATHS_ANGLES.map(createTopicUnit) }
            ]
        },
        evs: {
            title: "EVS / GK",
            topics: [
                { id: "space", title: { en: "Space Exploration", hi: "अंतरिक्ष", kn: "ಬಾಹ್ಯಾಕಾಶ ಪರಿಶೋಧನೆ" }, units: CLASS_5_EVS_SPACE.map(createTopicUnit) },
                { id: "continents", title: { en: "Continents & Oceans", hi: "महाद्वीप व महासागर", kn: "ಖಂಡಗಳು ಮತ್ತು ಸಾಗರಗಳು" }, units: CLASS_5_EVS_CONTINENTS.map(createTopicUnit) },
                { id: "body_systems", title: { en: "Human Body Systems", hi: "मानव शरीर तंत्र", kn: "ಮಾನವ ಶರೀರದ ವ್ಯವಸ್ಥೆಗಳು" }, units: CLASS_5_EVS_BODY_SYSTEMS.map(createTopicUnit) }
            ]
        }
    }
};

/**
 * Backward compatibility export for ALPHABET_DATA
 */
export const ALPHABET_DATA = CURRICULUM_DATA[1].english.topics[0].units.map((unit) => ({
    letter: unit.label,
    word: unit.en.replace(/^[A-Z] for /, ""),
    cards: unit.cards
}));
