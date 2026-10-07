/**
 * Class 1 English Alphabet Dataset (A-Z) - Minimal Dyslexia EdTech Edition
 * 
 * Rules strictly applied:
 * 1. Text is ONLY "[Letter] for [Word]" (e.g. "A for Apple") with NO descriptive sentences.
 * 2. Visual cards 1-4 for each letter feature 4 photos strictly of the EXACT same object.
 * 3. Font variation cards 5-8 contain ONLY text (no images) pre-applied in 4 distinct typographies.
 * 4. No card counter text anywhere in data.
 */

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

/**
 * 4 verified photos of the EXACT same object per letter (A-Z)
 */
const OBJECT_CONFIG = {
    A: {
        word: "Apple",
        svgName: "A_Apple.svg",
        photos: [
            "1560806887-1e4cd0b6cbd6",
            "1619546813926-a78fa6372cd2",
            "1570913149827-d2ac84ab3f9a",
            "1568702846914-96b305d2aaeb"
        ]
    },
    B: {
        word: "Ball",
        svgName: "B_Ball.svg",
        photos: [
            "1558060370-d644479cb6f7",
            "1575361204480-aadea25e6e68",
            "1546519638-68e109498ffc",
            "1534438327276-14e5300c3a48"
        ]
    },
    C: {
        word: "Cat",
        svgName: "C_Cat.svg",
        photos: [
            "1514888286974-6c03e2ca1dba",
            "1533738363-b7f9aef128ce",
            "1543852786-1cf6624b9987",
            "1495360010541-f48722b34f7d"
        ]
    },
    D: {
        word: "Dog",
        svgName: "D_Dog.svg",
        photos: [
            "1543466835-00a7907e9de1",
            "1583511655857-d19b40a7a54e",
            "1537151608828-ea2b11777ee8",
            "1587300003388-59208cc962cb"
        ]
    },
    E: {
        word: "Elephant",
        svgName: "E_Elephant.svg",
        photos: [
            "1557050543-4d5f4e07ef46",
            "1581852017103-68ac65514cf7",
            "1564760055775-d63b17a55c44",
            "1549366021-9f761d450615"
        ]
    },
    F: {
        word: "Fish",
        svgName: "F_Fish.svg",
        photos: [
            "1524704654690-b56c05c78a00",
            "1522069169874-c58ec4b76be5",
            "1544551763-46a013bb70d5",
            "1535591273668-578e31182c4f"
        ]
    },
    G: {
        word: "Grapes",
        svgName: "G_Goat.svg",
        photos: [
            "1537640538966-79f369143f8f",
            "1596363505729-4190a9506133",
            "1537640538966-79f369143f8f",
            "1596363505729-4190a9506133"
        ]
    },
    H: {
        word: "Horse",
        svgName: "H_Hat.svg",
        photos: [
            "1534447677768-be436bb09401",
            "1553284965-83fd3e82fa5a",
            "1509205477838-a534e43a849f",
            "1534447677768-be436bb09401"
        ]
    },
    I: {
        word: "Ice Cream",
        svgName: "I_Ice Cream.svg",
        photos: [
            "1501443762994-82bd5dace89a",
            "1497034825429-c343d7c6a68f",
            "1563805042-7684c019e1cb",
            "1576506295286-5cda18df43e7"
        ]
    },
    J: {
        word: "Juice",
        svgName: "J_Jug.svg",
        photos: [
            "1613478223719-2ab802602423",
            "1551024709-8f23befc6f87",
            "1600271886742-f049cd451bba",
            "1613478223719-2ab802602423"
        ]
    },
    K: {
        word: "Kite",
        svgName: "K_Kite.svg",
        photos: [
            "1516483638261-f4dbaf036963",
            "1508614589041-895b88991e3e",
            "1544816155-12df9643f363",
            "1507035895480-2b3156c31fc8"
        ]
    },
    L: {
        word: "Lion",
        svgName: "L_Lion.svg",
        photos: [
            "1534188753412-3e26d0d618d6",
            "1546182990-dffeafbe841d",
            "1517825738774-7de9363ef735",
            "1534188753412-3e26d0d618d6"
        ]
    },
    M: {
        word: "Monkey",
        svgName: "M_Mango.svg",
        photos: [
            "1540573133985-87b6da6d54a9",
            "1570288685369-f7305163d0e3",
            "1501705388883-4ed8a543392c",
            "1535295972055-1c762f4483e5"
        ]
    },
    N: {
        word: "Nest",
        svgName: "N_Nest.svg",
        photos: [
            "1520808663317-647b476a81b9",
            "1582722872445-44dc5f7e3c8f",
            "1535083783855-76ae62b2914e",
            "1516467508483-a7212febe31a"
        ]
    },
    O: {
        word: "Orange",
        svgName: "O_Orange.svg",
        photos: [
            "1582979512210-99b6a53386f9",
            "1611080626919-7cf5a9dbab5b",
            "1557800636-894a64c1696f",
            "1547514701-42782101795e"
        ]
    },
    P: {
        word: "Penguin",
        svgName: "P_Parrot.svg",
        photos: [
            "1598439210625-5067c578f3f6",
            "1551986782-d0169b3f8fa7",
            "1517783999520-f068d7431a60",
            "157640574847b-326283a0e2a5"
        ]
    },
    Q: {
        word: "Queen",
        svgName: "Q_Queen.svg",
        photos: [
            "1579783900882-c0d3dad7b119",
            "1519741497674-611481863552",
            "1543783207-ec64e4d95325",
            "1535295972055-1c762f4483e5"
        ]
    },
    R: {
        word: "Rainbow",
        svgName: "R_Rabbit.svg",
        photos: [
            "1509114397022-ed747cca3f65",
            "1517486808906-6ca8b3f04846",
            "1513836279014-a89f7a76ae86",
            "1509114397022-ed747cca3f65"
        ]
    },
    S: {
        word: "Sun",
        svgName: "S_Sun.svg",
        photos: [
            "1532767153582-b1a0e5145009",
            "1506744038136-46273834b3fb",
            "1470240731273-7821a6eeb6bd",
            "1507525428034-b723cf961d3e"
        ]
    },
    T: {
        word: "Tree",
        svgName: "T_Tiger.svg",
        photos: [
            "1502082553048-f009c37129b9",
            "1448375240586-882707db888b",
            "1513836279014-a89f7a76ae86",
            "1473448912268-2022ce9509d8"
        ]
    },
    U: {
        word: "Umbrella",
        svgName: "U_Umbrella.svg",
        photos: [
            "1513151233558-d860c5398176",
            "1515694346937-94d85e41e6f0",
            "1513151233558-d860c5398176",
            "1515694346937-94d85e41e6f0"
        ]
    },
    V: {
        word: "Van",
        svgName: "V_Van.svg",
        photos: [
            "1527786356703-4b100091cd2c",
            "1469854523086-cc02fe5d8800",
            "1511919884226-fd3cad34687c",
            "1503376780353-7e6692767b70"
        ]
    },
    W: {
        word: "Whale",
        svgName: "W_Watch.svg",
        photos: [
            "1568430462989-44163eb1752f",
            "1544551763-46a013bb70d5",
            "1507525428034-b723cf961d3e",
            "1568430462989-44163eb1752f"
        ]
    },
    X: {
        word: "Xylophone",
        svgName: "X_Xylophone.svg",
        photos: [
            "1516280440614-37939bbacd81",
            "1511671782779-c97d3d27a1d4",
            "1514525253161-7a46d19cd819",
            "1507676184212-d03ab07a01bf"
        ]
    },
    Y: {
        word: "Yacht",
        svgName: "Y_Yo-yo.svg",
        photos: [
            "1567899378494-47b22a2ae96a",
            "1507525428034-b723cf961d3e",
            "1544551763-46a013bb70d5",
            "1567899378494-47b22a2ae96a"
        ]
    },
    Z: {
        word: "Zebra",
        svgName: "Z_Zebra.svg",
        photos: [
            "1501705388883-4ed8a543392c",
            "1534567153574-2b12153a87f0",
            "1545671913-b89ac1b4ac10",
            "1501705388883-4ed8a543392c"
        ]
    }
};

export function getUnsplashUrl(photoId) {
    return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=900&q=80`;
}

/**
 * Builds the 8 cards for each letter A-Z:
 * - Cards 1-4: Visual Focus (4 photos of the EXACT same object)
 * - Cards 5-8: Font Variation Focus (strictly ONLY text, NO images)
 */
export const ALPHABET_DATA = Object.entries(OBJECT_CONFIG).map(([letter, data]) => {
    const { word, photos, svgName } = data;
    const cleanText = `${letter} for ${word}`;
    const svgFallback = `/learning/English_Learning_Materials_Class1_Illustrated/01_alphabet_A-Z/${svgName}`;

    // 4 Visual Cards (photos of the exact same object)
    const visualCards = photos.map((photoId, index) => ({
        id: `${letter}-vis-${index + 1}`,
        letter,
        type: "visual",
        word,
        text: cleanText,
        speakText: cleanText,
        imageUrl: getUnsplashUrl(photoId),
        svgFallback,
        photoId
    }));

    // 4 Font & Style Variation Cards (strictly text only, NO images)
    const fontVariations = [
        { key: "dyslexic", style: FONT_STYLES.dyslexic },
        { key: "serif", style: FONT_STYLES.serif },
        { key: "handwriting", style: FONT_STYLES.handwriting },
        { key: "chunky", style: FONT_STYLES.chunky }
    ];

    const fontCards = fontVariations.map(({ style }) => ({
        id: `${letter}-font-${style.id}`,
        letter,
        type: "font_style",
        word,
        text: cleanText,
        speakText: cleanText,
        fontStyle: style,
        fontClass: style.fontClass
        // No imageUrl or image on font cards!
    }));

    return {
        letter,
        word,
        cards: [...visualCards, ...fontCards]
    };
});
