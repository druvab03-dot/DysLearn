/**
 * High-accuracy Educational SVG Illustrations for Abstract, Mathematical,
 * and Anatomical Concepts in DysLearn.
 *
 * Designed specifically for dyslexia accessibility:
 * - High contrast (#1E293B on soft pastel backgrounds)
 * - Clear geometric and biological shapes with zero clutter
 * - Zero external network dependency
 */

function createSvgDataUri(svgString) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const EDUCATIONAL_SVGS = {
    // Shapes
    triangle: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <polygon points="300,60 120,330 480,330" fill="#F59E0B" stroke="#1E293B" stroke-width="12" stroke-linejoin="round"/>
            <text x="300" y="240" font-family="'Lexend', sans-serif" font-size="32" font-weight="bold" fill="#1E293B" text-anchor="middle">TRIANGLE</text>
            <text x="300" y="280" font-family="'Lexend', sans-serif" font-size="22" fill="#1E293B" text-anchor="middle">3 Sides • 3 Corners</text>
        </svg>
    `),
    square: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="175" y="75" width="250" height="250" rx="16" fill="#3B82F6" stroke="#1E293B" stroke-width="12"/>
            <text x="300" y="200" font-family="'Lexend', sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SQUARE</text>
            <text x="300" y="240" font-family="'Lexend', sans-serif" font-size="20" fill="#FFFFFF" text-anchor="middle">4 Equal Sides</text>
        </svg>
    `),
    circle: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <circle cx="300" cy="200" r="130" fill="#EC4899" stroke="#1E293B" stroke-width="12"/>
            <text x="300" y="200" font-family="'Lexend', sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF" text-anchor="middle">CIRCLE</text>
            <text x="300" y="240" font-family="'Lexend', sans-serif" font-size="20" fill="#FFFFFF" text-anchor="middle">Round • 0 Corners</text>
        </svg>
    `),
    rectangle: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="110" y="100" width="380" height="200" rx="16" fill="#10B981" stroke="#1E293B" stroke-width="12"/>
            <text x="300" y="200" font-family="'Lexend', sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF" text-anchor="middle">RECTANGLE</text>
            <text x="300" y="240" font-family="'Lexend', sans-serif" font-size="20" fill="#FFFFFF" text-anchor="middle">Opposite Sides Equal</text>
        </svg>
    `),

    // Fractions
    fraction_half: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Left Half Colored -->
            <path d="M 300 70 A 130 130 0 0 0 300 330 Z" fill="#3B82F6" stroke="#1E293B" stroke-width="10"/>
            <!-- Right Half Uncolored -->
            <path d="M 300 70 A 130 130 0 0 1 300 330 Z" fill="#E2E8F0" stroke="#1E293B" stroke-width="10"/>
            <line x1="300" y1="70" x2="300" y2="330" stroke="#1E293B" stroke-width="10"/>
            <!-- Fraction Label -->
            <rect x="440" y="140" width="120" height="120" rx="16" fill="#1E293B"/>
            <text x="500" y="190" font-family="'Lexend', sans-serif" font-size="44" font-weight="bold" fill="#FDE047" text-anchor="middle">1</text>
            <line x1="460" y1="205" x2="540" y2="205" stroke="#FFFFFF" stroke-width="6"/>
            <text x="500" y="245" font-family="'Lexend', sans-serif" font-size="44" font-weight="bold" fill="#FFFFFF" text-anchor="middle">2</text>
        </svg>
    `),
    fraction_quarter: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <circle cx="280" cy="200" r="130" fill="#E2E8F0" stroke="#1E293B" stroke-width="10"/>
            <!-- One quarter highlighted -->
            <path d="M 280 200 L 280 70 A 130 130 0 0 1 410 200 Z" fill="#F59E0B" stroke="#1E293B" stroke-width="8"/>
            <line x1="280" y1="70" x2="280" y2="330" stroke="#1E293B" stroke-width="8"/>
            <line x1="150" y1="200" x2="410" y2="200" stroke="#1E293B" stroke-width="8"/>
            <!-- Fraction Label -->
            <rect x="450" y="140" width="120" height="120" rx="16" fill="#1E293B"/>
            <text x="510" y="190" font-family="'Lexend', sans-serif" font-size="44" font-weight="bold" fill="#FDE047" text-anchor="middle">1</text>
            <line x1="470" y1="205" x2="550" y2="205" stroke="#FFFFFF" stroke-width="6"/>
            <text x="510" y="245" font-family="'Lexend', sans-serif" font-size="44" font-weight="bold" fill="#FFFFFF" text-anchor="middle">4</text>
        </svg>
    `),

    // Angles
    angle_90: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Vertical and horizontal rays -->
            <line x1="180" y1="310" x2="180" y2="90" stroke="#1E293B" stroke-width="14" stroke-linecap="round"/>
            <polygon points="180,70 168,100 192,100" fill="#1E293B"/>
            <line x1="180" y1="310" x2="440" y2="310" stroke="#1E293B" stroke-width="14" stroke-linecap="round"/>
            <polygon points="460,310 430,298 430,322" fill="#1E293B"/>
            <!-- 90 deg corner square -->
            <rect x="180" y="260" width="50" height="50" fill="none" stroke="#EF4444" stroke-width="8"/>
            <text x="250" y="250" font-family="'Lexend', sans-serif" font-size="34" font-weight="bold" fill="#EF4444">90°</text>
            <text x="360" y="160" font-family="'Lexend', sans-serif" font-size="32" font-weight="bold" fill="#1E293B">RIGHT ANGLE</text>
            <text x="360" y="200" font-family="'Lexend', sans-serif" font-size="22" fill="#475569">Exactly 90 Degrees</text>
        </svg>
    `),
    angle_acute: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <line x1="160" y1="310" x2="440" y2="310" stroke="#1E293B" stroke-width="14" stroke-linecap="round"/>
            <polygon points="460,310 430,298 430,322" fill="#1E293B"/>
            <line x1="160" y1="310" x2="350" y2="120" stroke="#1E293B" stroke-width="14" stroke-linecap="round"/>
            <polygon points="365,105 338,122 355,138" fill="#1E293B"/>
            <!-- Arc -->
            <path d="M 230 310 A 70 70 0 0 0 215 255" fill="none" stroke="#F59E0B" stroke-width="8"/>
            <text x="260" y="280" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#F59E0B">&lt; 90°</text>
            <text x="380" y="180" font-family="'Lexend', sans-serif" font-size="32" font-weight="bold" fill="#1E293B">ACUTE ANGLE</text>
            <text x="380" y="220" font-family="'Lexend', sans-serif" font-size="22" fill="#475569">Less Than 90°</text>
        </svg>
    `),

    // Human Internal Organs
    heart: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Anatomical heart shape -->
            <path d="M 300 130 C 270 70 190 70 160 130 C 130 190 190 270 300 340 C 410 270 470 190 440 130 C 410 70 330 70 300 130 Z" fill="#DC2626" stroke="#991B1B" stroke-width="10"/>
            <!-- Aorta & Vena Cava vessels -->
            <path d="M 270 100 L 270 50 A 25 25 0 0 1 320 50 L 320 90" fill="none" stroke="#2563EB" stroke-width="14" stroke-linecap="round"/>
            <path d="M 320 95 L 340 40" fill="none" stroke="#DC2626" stroke-width="14" stroke-linecap="round"/>
            <text x="300" y="220" font-family="'Lexend', sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle">HEART</text>
            <text x="300" y="255" font-family="'Lexend', sans-serif" font-size="18" fill="#FEE2E2" text-anchor="middle">Pumps Blood Through Body</text>
        </svg>
    `),
    brain: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Left and right hemispheres -->
            <path d="M 300 90 C 230 70 170 120 170 190 C 170 260 220 300 280 310 C 285 310 290 280 300 280 C 310 280 315 310 320 310 C 380 300 430 260 430 190 C 430 120 370 70 300 90 Z" fill="#F472B6" stroke="#BE185D" stroke-width="10"/>
            <!-- Convolutions (Gyri/Sulci) -->
            <path d="M 230 150 C 260 170 240 220 270 240" fill="none" stroke="#9D174D" stroke-width="8" stroke-linecap="round"/>
            <path d="M 370 150 C 340 170 360 220 330 240" fill="none" stroke="#9D174D" stroke-width="8" stroke-linecap="round"/>
            <line x1="300" y1="95" x2="300" y2="280" stroke="#BE185D" stroke-width="6" stroke-dasharray="8 6"/>
            <text x="300" y="200" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#831843" text-anchor="middle">BRAIN</text>
            <text x="300" y="235" font-family="'Lexend', sans-serif" font-size="18" fill="#831843" text-anchor="middle">Controls Thoughts &amp; Actions</text>
        </svg>
    `),
    lungs: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Trachea -->
            <line x1="300" y1="60" x2="300" y2="150" stroke="#1E293B" stroke-width="14" stroke-linecap="round"/>
            <line x1="300" y1="150" x2="230" y2="190" stroke="#1E293B" stroke-width="12"/>
            <line x1="300" y1="150" x2="370" y2="190" stroke="#1E293B" stroke-width="12"/>
            <!-- Left lung -->
            <path d="M 230 180 C 180 180 160 240 170 300 C 180 340 230 330 250 310 C 270 290 260 200 230 180 Z" fill="#FB923C" stroke="#C2410C" stroke-width="8"/>
            <!-- Right lung -->
            <path d="M 370 180 C 420 180 440 240 430 300 C 420 340 370 330 350 310 C 330 290 340 200 370 180 Z" fill="#FB923C" stroke="#C2410C" stroke-width="8"/>
            <text x="300" y="340" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">LUNGS</text>
            <text x="300" y="370" font-family="'Lexend', sans-serif" font-size="18" fill="#475569" text-anchor="middle">Breathes In Oxygen</text>
        </svg>
    `),

    // Money & Currency
    coin_1: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <circle cx="300" cy="200" r="130" fill="#E2E8F0" stroke="#94A3B8" stroke-width="16"/>
            <circle cx="300" cy="200" r="105" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="6"/>
            <text x="300" y="190" font-family="'Lexend', sans-serif" font-size="90" font-weight="bold" fill="#1E293B" text-anchor="middle">₹1</text>
            <text x="300" y="240" font-family="'Lexend', sans-serif" font-size="24" font-weight="bold" fill="#475569" text-anchor="middle">RUPEE COIN</text>
        </svg>
    `),
    coin_5: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <circle cx="300" cy="200" r="130" fill="#FDE047" stroke="#CA8A04" stroke-width="16"/>
            <circle cx="300" cy="200" r="105" fill="#FEF08A" stroke="#EAB308" stroke-width="6"/>
            <text x="300" y="190" font-family="'Lexend', sans-serif" font-size="90" font-weight="bold" fill="#713F12" text-anchor="middle">₹5</text>
            <text x="300" y="240" font-family="'Lexend', sans-serif" font-size="24" font-weight="bold" fill="#854D0E" text-anchor="middle">FIVE RUPEES</text>
        </svg>
    `),
    note_10: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="100" y="90" width="400" height="220" rx="16" fill="#D97706" stroke="#92400E" stroke-width="12"/>
            <rect x="120" y="110" width="360" height="180" rx="8" fill="#F59E0B" stroke="#B45309" stroke-width="4"/>
            <text x="210" y="210" font-family="'Lexend', sans-serif" font-size="70" font-weight="bold" fill="#FFFFFF">₹10</text>
            <text x="370" y="180" font-family="'Lexend', sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF">RESERVE BANK</text>
            <text x="370" y="220" font-family="'Lexend', sans-serif" font-size="20" fill="#FEF3C7">TEN RUPEES NOTE</text>
        </svg>
    `),

    // Math Counting & Operation Visuals
    table_2: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="80" y="60" width="440" height="120" rx="20" fill="#1E293B"/>
            <text x="300" y="140" font-family="'Lexend', sans-serif" font-size="54" font-weight="bold" fill="#FDE047" text-anchor="middle">2 × 5 = 10</text>
            <!-- 5 groups of 2 dots -->
            <g fill="#EF4444">
                <circle cx="140" cy="240" r="16"/><circle cx="140" cy="290" r="16"/>
                <circle cx="220" cy="240" r="16"/><circle cx="220" cy="290" r="16"/>
                <circle cx="300" cy="240" r="16"/><circle cx="300" cy="290" r="16"/>
                <circle cx="380" cy="240" r="16"/><circle cx="380" cy="290" r="16"/>
                <circle cx="460" cy="240" r="16"/><circle cx="460" cy="290" r="16"/>
            </g>
            <text x="300" y="360" font-family="'Lexend', sans-serif" font-size="22" font-weight="bold" fill="#1E293B" text-anchor="middle">5 Groups of 2 = 10 Total</text>
        </svg>
    `),
    table_5: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="80" y="60" width="440" height="120" rx="20" fill="#1E293B"/>
            <text x="300" y="140" font-family="'Lexend', sans-serif" font-size="54" font-weight="bold" fill="#FDE047" text-anchor="middle">5 × 5 = 25</text>
            <!-- 5 rows of 5 dots -->
            <g fill="#3B82F6">
                <circle cx="220" cy="220" r="12"/><circle cx="260" cy="220" r="12"/><circle cx="300" cy="220" r="12"/><circle cx="340" cy="220" r="12"/><circle cx="380" cy="220" r="12"/>
                <circle cx="220" cy="250" r="12"/><circle cx="260" cy="250" r="12"/><circle cx="300" cy="250" r="12"/><circle cx="340" cy="250" r="12"/><circle cx="380" cy="250" r="12"/>
                <circle cx="220" cy="280" r="12"/><circle cx="260" cy="280" r="12"/><circle cx="300" cy="280" r="12"/><circle cx="340" cy="280" r="12"/><circle cx="380" cy="280" r="12"/>
                <circle cx="220" cy="310" r="12"/><circle cx="260" cy="310" r="12"/><circle cx="300" cy="310" r="12"/><circle cx="340" cy="310" r="12"/><circle cx="380" cy="310" r="12"/>
                <circle cx="220" cy="340" r="12"/><circle cx="260" cy="340" r="12"/><circle cx="300" cy="340" r="12"/><circle cx="340" cy="340" r="12"/><circle cx="380" cy="340" r="12"/>
            </g>
        </svg>
    `),
    division_10_2: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="80" y="40" width="440" height="100" rx="16" fill="#1E293B"/>
            <text x="300" y="105" font-family="'Lexend', sans-serif" font-size="48" font-weight="bold" fill="#FDE047" text-anchor="middle">10 ÷ 2 = 5</text>
            <!-- 2 boxes of 5 -->
            <rect x="90" y="160" width="190" height="160" rx="16" fill="#DBEAFE" stroke="#2563EB" stroke-width="6"/>
            <text x="185" y="295" font-family="'Lexend', sans-serif" font-size="22" font-weight="bold" fill="#1E40AF" text-anchor="middle">Group 1: 5</text>
            <g fill="#2563EB">
                <circle cx="140" cy="200" r="14"/><circle cx="185" cy="200" r="14"/><circle cx="230" cy="200" r="14"/>
                <circle cx="160" cy="245" r="14"/><circle cx="210" cy="245" r="14"/>
            </g>
            <rect x="320" y="160" width="190" height="160" rx="16" fill="#DCFCE7" stroke="#16A34A" stroke-width="6"/>
            <text x="415" y="295" font-family="'Lexend', sans-serif" font-size="22" font-weight="bold" fill="#166534" text-anchor="middle">Group 2: 5</text>
            <g fill="#16A34A">
                <circle cx="370" cy="200" r="14"/><circle cx="415" cy="200" r="14"/><circle cx="460" cy="200" r="14"/>
                <circle cx="390" cy="245" r="14"/><circle cx="440" cy="245" r="14"/>
            </g>
            <text x="300" y="365" font-family="'Lexend', sans-serif" font-size="20" font-weight="bold" fill="#1E293B" text-anchor="middle">10 Shared Equally into 2 Groups</text>
        </svg>
    `),
    decimal_half: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="100" y="70" width="400" height="100" rx="16" fill="#1E293B"/>
            <text x="300" y="135" font-family="'Lexend', sans-serif" font-size="52" font-weight="bold" fill="#FDE047" text-anchor="middle">0.5 = 1/2</text>
            <!-- 10-block bar, 5 shaded -->
            <g stroke="#1E293B" stroke-width="4">
                <rect x="100" y="210" width="40" height="80" fill="#3B82F6"/>
                <rect x="140" y="210" width="40" height="80" fill="#3B82F6"/>
                <rect x="180" y="210" width="40" height="80" fill="#3B82F6"/>
                <rect x="220" y="210" width="40" height="80" fill="#3B82F6"/>
                <rect x="260" y="210" width="40" height="80" fill="#3B82F6"/>
                <rect x="300" y="210" width="40" height="80" fill="#E2E8F0"/>
                <rect x="340" y="210" width="40" height="80" fill="#E2E8F0"/>
                <rect x="380" y="210" width="40" height="80" fill="#E2E8F0"/>
                <rect x="420" y="210" width="40" height="80" fill="#E2E8F0"/>
                <rect x="460" y="210" width="40" height="80" fill="#E2E8F0"/>
            </g>
            <text x="300" y="340" font-family="'Lexend', sans-serif" font-size="24" font-weight="bold" fill="#1E293B" text-anchor="middle">5 Out of 10 Tenths = 0.5 (Half)</text>
        </svg>
    `),
    decimal_quarter: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="100" y="70" width="400" height="100" rx="16" fill="#1E293B"/>
            <text x="300" y="135" font-family="'Lexend', sans-serif" font-size="52" font-weight="bold" fill="#FDE047" text-anchor="middle">0.25 = 1/4</text>
            <!-- 4-block bar, 1 shaded -->
            <g stroke="#1E293B" stroke-width="4">
                <rect x="100" y="210" width="100" height="80" fill="#F59E0B"/>
                <rect x="200" y="210" width="100" height="80" fill="#E2E8F0"/>
                <rect x="300" y="210" width="100" height="80" fill="#E2E8F0"/>
                <rect x="400" y="210" width="100" height="80" fill="#E2E8F0"/>
            </g>
            <text x="300" y="340" font-family="'Lexend', sans-serif" font-size="24" font-weight="bold" fill="#1E293B" text-anchor="middle">1 Out of 4 Quarters = 0.25</text>
        </svg>
    `),
    number_10: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <text x="220" y="230" font-family="'Lexend', sans-serif" font-size="130" font-weight="bold" fill="#1E293B">10</text>
            <!-- 1 Ten Rod (10 stacked blocks) -->
            <g stroke="#1E293B" stroke-width="3" fill="#3B82F6">
                <rect x="420" y="70" width="40" height="24"/><rect x="420" y="94" width="40" height="24"/>
                <rect x="420" y="118" width="40" height="24"/><rect x="420" y="142" width="40" height="24"/>
                <rect x="420" y="166" width="40" height="24"/><rect x="420" y="190" width="40" height="24"/>
                <rect x="420" y="214" width="40" height="24"/><rect x="420" y="238" width="40" height="24"/>
                <rect x="420" y="262" width="40" height="24"/><rect x="420" y="286" width="40" height="24"/>
            </g>
            <text x="300" y="360" font-family="'Lexend', sans-serif" font-size="26" font-weight="bold" fill="#1E293B" text-anchor="middle">1 Ten = 10 Ones</text>
        </svg>
    `),
    number_100: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <text x="200" y="220" font-family="'Lexend', sans-serif" font-size="110" font-weight="bold" fill="#1E293B">100</text>
            <!-- 10x10 Flat Hundred Grid -->
            <rect x="360" y="100" width="160" height="160" fill="#10B981" stroke="#1E293B" stroke-width="8"/>
            <text x="440" y="190" font-family="'Lexend', sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">10 × 10</text>
            <text x="300" y="340" font-family="'Lexend', sans-serif" font-size="26" font-weight="bold" fill="#1E293B" text-anchor="middle">1 Hundred = 10 Tens</text>
        </svg>
    `),
    perimeter_area: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="140" y="90" width="320" height="200" fill="#93C5FD" stroke="#1D4ED8" stroke-width="12" stroke-dasharray="16 10"/>
            <text x="300" y="190" font-family="'Lexend', sans-serif" font-size="34" font-weight="bold" fill="#1E40AF" text-anchor="middle">AREA (Inside)</text>
            <text x="300" y="230" font-family="'Lexend', sans-serif" font-size="20" fill="#1E40AF" text-anchor="middle">Square Units Inside</text>
            <text x="300" y="340" font-family="'Lexend', sans-serif" font-size="24" font-weight="bold" fill="#1E293B" text-anchor="middle">PERIMETER = Boundary (Length Around)</text>
        </svg>
    `),
    star: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <polygon points="300,50 338,168 463,168 362,241 400,360 300,286 200,360 238,241 137,168 262,168" fill="#FBBF24" stroke="#D97706" stroke-width="12" stroke-linejoin="round"/>
            <text x="300" y="235" font-family="'Lexend', sans-serif" font-size="28" font-weight="bold" fill="#78350F" text-anchor="middle">STAR</text>
        </svg>
    `),
    division_20_4: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="80" y="30" width="440" height="90" rx="16" fill="#1E293B"/>
            <text x="300" y="90" font-family="'Lexend', sans-serif" font-size="44" font-weight="bold" fill="#FDE047" text-anchor="middle">20 ÷ 4 = 5</text>
            <g fill="#3B82F6">
                <rect x="50" y="150" width="105" height="150" rx="12" fill="#DBEAFE" stroke="#2563EB" stroke-width="4"/>
                <circle cx="80" cy="190" r="12"/><circle cx="125" cy="190" r="12"/><circle cx="80" cy="230" r="12"/><circle cx="125" cy="230" r="12"/><circle cx="102" cy="270" r="12"/>
                <rect x="175" y="150" width="105" height="150" rx="12" fill="#DBEAFE" stroke="#2563EB" stroke-width="4"/>
                <circle cx="205" cy="190" r="12"/><circle cx="250" cy="190" r="12"/><circle cx="205" cy="230" r="12"/><circle cx="250" cy="230" r="12"/><circle cx="227" cy="270" r="12"/>
                <rect x="300" y="150" width="105" height="150" rx="12" fill="#DBEAFE" stroke="#2563EB" stroke-width="4"/>
                <circle cx="330" cy="190" r="12"/><circle cx="375" cy="190" r="12"/><circle cx="330" cy="230" r="12"/><circle cx="375" cy="230" r="12"/><circle cx="352" cy="270" r="12"/>
                <rect x="425" y="150" width="105" height="150" rx="12" fill="#DBEAFE" stroke="#2563EB" stroke-width="4"/>
                <circle cx="455" cy="190" r="12"/><circle cx="500" cy="190" r="12"/><circle cx="455" cy="230" r="12"/><circle cx="500" cy="230" r="12"/><circle cx="477" cy="270" r="12"/>
            </g>
            <text x="300" y="355" font-family="'Lexend', sans-serif" font-size="20" font-weight="bold" fill="#1E293B" text-anchor="middle">4 Equal Groups of 5</text>
        </svg>
    `),
    lotus: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <ellipse cx="300" cy="300" rx="200" ry="25" fill="#38BDF8" opacity="0.6"/>
            <!-- Lotus Petals -->
            <path d="M 300 130 C 270 200 280 270 300 280 C 320 270 330 200 300 130 Z" fill="#F472B6" stroke="#DB2777" stroke-width="6"/>
            <path d="M 300 280 C 230 270 190 220 210 180 C 240 210 270 250 300 280 Z" fill="#F43F5E" stroke="#BE123C" stroke-width="6"/>
            <path d="M 300 280 C 370 270 410 220 390 180 C 360 210 330 250 300 280 Z" fill="#F43F5E" stroke="#BE123C" stroke-width="6"/>
            <text x="300" y="350" font-family="'Lexend', sans-serif" font-size="28" font-weight="bold" fill="#1E293B" text-anchor="middle">कमल • LOTUS</text>
        </svg>
    `),
    road: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <polygon points="260,80 340,80 480,340 120,340" fill="#334155" stroke="#1E293B" stroke-width="8"/>
            <line x1="300" y1="90" x2="300" y2="130" stroke="#FDE047" stroke-width="8"/>
            <line x1="300" y1="160" x2="300" y2="210" stroke="#FDE047" stroke-width="12"/>
            <line x1="300" y1="240" x2="300" y2="330" stroke="#FDE047" stroke-width="16"/>
            <text x="300" y="375" font-family="'Lexend', sans-serif" font-size="28" font-weight="bold" fill="#1E293B" text-anchor="middle">सड़क • ROAD</text>
        </svg>
    `),
    eyes: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Left Eye -->
            <path d="M 120 200 Q 210 120 300 200 Q 210 280 120 200 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="10"/>
            <circle cx="210" cy="200" r="38" fill="#3B82F6" stroke="#1E293B" stroke-width="6"/>
            <circle cx="210" cy="200" r="18" fill="#1E293B"/>
            <!-- Right Eye -->
            <path d="M 300 200 Q 390 120 480 200 Q 390 280 300 200 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="10"/>
            <circle cx="390" cy="200" r="38" fill="#3B82F6" stroke="#1E293B" stroke-width="6"/>
            <circle cx="390" cy="200" r="18" fill="#1E293B"/>
            <text x="300" y="340" font-family="'Lexend', sans-serif" font-size="28" font-weight="bold" fill="#1E293B" text-anchor="middle">EYES • EYES TO SEE</text>
        </svg>
    `),
    rice: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <path d="M 180 200 C 180 310 420 310 420 200 Z" fill="#EF4444" stroke="#991B1B" stroke-width="10"/>
            <ellipse cx="300" cy="190" rx="120" ry="40" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="6"/>
            <circle cx="280" cy="180" r="6" fill="#E2E8F0"/><circle cx="320" cy="185" r="6" fill="#E2E8F0"/>
            <text x="300" y="350" font-family="'Lexend', sans-serif" font-size="28" font-weight="bold" fill="#1E293B" text-anchor="middle">RICE • ENERGY GIVING FOOD</text>
        </svg>
    `),
    milk: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="230" y="110" width="140" height="200" rx="16" fill="#FFFFFF" stroke="#3B82F6" stroke-width="10"/>
            <path d="M 230 190 Q 300 220 370 190 L 370 300 L 230 300 Z" fill="#DBEAFE"/>
            <text x="300" y="250" font-family="'Lexend', sans-serif" font-size="28" font-weight="bold" fill="#1D4ED8" text-anchor="middle">MILK</text>
            <text x="300" y="360" font-family="'Lexend', sans-serif" font-size="24" font-weight="bold" fill="#1E293B" text-anchor="middle">BODY BUILDING FOOD</text>
        </svg>
    `),
    window: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="180" y="80" width="240" height="240" rx="12" fill="#E0F2FE" stroke="#78350F" stroke-width="16"/>
            <line x1="300" y1="80" x2="300" y2="320" stroke="#78350F" stroke-width="12"/>
            <line x1="180" y1="200" x2="420" y2="200" stroke="#78350F" stroke-width="12"/>
            <text x="300" y="365" font-family="'Lexend', sans-serif" font-size="28" font-weight="bold" fill="#1E293B" text-anchor="middle">ಕಿಟಕಿ • WINDOW</text>
        </svg>
    `),
    door: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="220" y="60" width="160" height="280" rx="8" fill="#B45309" stroke="#78350F" stroke-width="14"/>
            <circle cx="350" cy="200" r="12" fill="#FDE047" stroke="#78350F" stroke-width="4"/>
            <text x="300" y="375" font-family="'Lexend', sans-serif" font-size="28" font-weight="bold" fill="#1E293B" text-anchor="middle">ಬಾಗಿಲು • DOOR</text>
        </svg>
    `),
    doctor: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="180" y="70" width="240" height="240" rx="20" fill="#EFF6FF" stroke="#2563EB" stroke-width="10"/>
            <rect x="280" y="110" width="40" height="120" rx="8" fill="#DC2626"/>
            <rect x="240" y="150" width="120" height="40" rx="8" fill="#DC2626"/>
            <text x="300" y="270" font-family="'Lexend', sans-serif" font-size="26" font-weight="bold" fill="#1E40AF" text-anchor="middle">DOCTOR</text>
            <text x="300" y="355" font-family="'Lexend', sans-serif" font-size="24" font-weight="bold" fill="#1E293B" text-anchor="middle">Cures the Sick • Community Helper</text>
        </svg>
    `),
    teacher: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <rect x="140" y="70" width="320" height="200" rx="12" fill="#15803D" stroke="#78350F" stroke-width="14"/>
            <text x="300" y="150" font-family="'Lexend', sans-serif" font-size="44" font-weight="bold" fill="#FEF08A" text-anchor="middle">A B C • 1 2 3</text>
            <text x="300" y="200" font-family="'Lexend', sans-serif" font-size="26" fill="#FFFFFF" text-anchor="middle">TEACHER</text>
            <text x="300" y="340" font-family="'Lexend', sans-serif" font-size="24" font-weight="bold" fill="#1E293B" text-anchor="middle">Educates Us • Community Helper</text>
        </svg>
    `),
    hands: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <g transform="translate(180, 50) scale(6.5)">
                <path fill="#EF9645" d="M20.5 2.965c-1.381 0-2.5 1.119-2.5 2.5v.005L15.5.465c-1.381 0-2.5 1.119-2.5 2.5V4.25l-2.5-1.535c-1.381 0-2.5 1.119-2.5 2.5V8.75L7 18h13.542L20.5 2.965z"/>
                <path fill="#FFDC5D" d="M31.375 16.219c-1.381-.611-3.354.208-4.75 2.188-.917 1.3-1.187 3.151-2.391 3.344-.46.073-1.234-.313-1.234-1.397V4.5s0-2-2-2-2 2-2 2v11.633c0-.029-1-.064-1-.082V2s0-2-2-2-2 2-2 2v14.053c0 .017-1 .041-1 .069V4.25s0-2-2-2-2 2-2 2v12.638c0 .118-1 .251-1 .398V8.75s0-2-2-2-2 2-2 2V24c0 6.627 5.373 12 12 12 4.775 0 8.06-2.598 9.896-5.292 1.557-2.285 2.009-4.658 2.104-5.375 0 0 .123-1.479 1.156-2.865 1.469-1.969 2.5-3.156 3.125-3.866.317-.358.625-1.706-.906-2.383z"/>
                <path fill="#EF9645" d="M23.439 21.471c-.297-.266-.372-.552-.417-.808-1.892.259-4.457.789-6.427 2.715-2.556 2.499-2.992 5.2-2.971 7.007.017 1.457.812 2.147 1.045-.012.292-2.706 2.254-8.063 8.784-8.58.028-.002.387-.024.591-.035 0 0-.352-.06-.605-.287z"/>
            </g>
            <text x="300" y="365" font-family="'Lexend', sans-serif" font-size="28" font-weight="bold" fill="#1E293B" text-anchor="middle">HANDS • HANDS TO HOLD</text>
        </svg>
    `),
    ears: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <path d="M 240 110 C 180 110 180 260 260 290 C 280 290 290 270 280 240 C 260 240 230 220 230 190 C 230 150 260 140 270 160" fill="#FDBA74" stroke="#1E293B" stroke-width="12" stroke-linecap="round"/>
            <path d="M 330 150 A 60 60 0 0 1 330 250" fill="none" stroke="#3B82F6" stroke-width="8" stroke-linecap="round"/>
            <path d="M 370 120 A 100 100 0 0 1 370 280" fill="none" stroke="#3B82F6" stroke-width="10" stroke-linecap="round"/>
            <text x="300" y="355" font-family="'Lexend', sans-serif" font-size="28" font-weight="bold" fill="#1E293B" text-anchor="middle">EARS • EARS TO HEAR</text>
        </svg>
    `),
    clap: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Two hands clapping together -->
            <path d="M 250 280 L 210 200 L 260 130 L 290 170 L 300 240 Z" fill="#FDBA74" stroke="#1E293B" stroke-width="10"/>
            <path d="M 350 280 L 390 200 L 340 130 L 310 170 L 300 240 Z" fill="#FDBA74" stroke="#1E293B" stroke-width="10"/>
            <!-- Sound lines -->
            <line x1="300" y1="100" x2="300" y2="70" stroke="#F59E0B" stroke-width="8" stroke-linecap="round"/>
            <line x1="260" y1="110" x2="230" y2="90" stroke="#F59E0B" stroke-width="8" stroke-linecap="round"/>
            <line x1="340" y1="110" x2="370" y2="90" stroke="#F59E0B" stroke-width="8" stroke-linecap="round"/>
            <text x="300" y="350" font-family="'Lexend', sans-serif" font-size="32" font-weight="bold" fill="#1E293B" text-anchor="middle">CLAP • CLAP HANDS</text>
        </svg>
    `),
    smile: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <circle cx="300" cy="190" r="120" fill="#FDE047" stroke="#1E293B" stroke-width="12"/>
            <!-- Eyes -->
            <circle cx="250" cy="150" r="16" fill="#1E293B"/>
            <circle cx="350" cy="150" r="16" fill="#1E293B"/>
            <!-- Smile -->
            <path d="M 230 200 Q 300 270 370 200" fill="none" stroke="#1E293B" stroke-width="12" stroke-linecap="round"/>
            <text x="300" y="360" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">SMILE • HAPPY SMILE</text>
        </svg>
    `),
    family: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Father -->
            <circle cx="210" cy="130" r="35" fill="#FDBA74" stroke="#1E293B" stroke-width="8"/>
            <path d="M 160 280 L 175 180 Q 210 170 245 180 L 260 280 Z" fill="#3B82F6" stroke="#1E293B" stroke-width="8"/>
            <!-- Mother -->
            <circle cx="390" cy="135" r="35" fill="#FDBA74" stroke="#1E293B" stroke-width="8"/>
            <path d="M 340 280 L 355 185 Q 390 175 425 185 L 440 280 Z" fill="#EC4899" stroke="#1E293B" stroke-width="8"/>
            <!-- Child -->
            <circle cx="300" cy="190" r="28" fill="#FDBA74" stroke="#1E293B" stroke-width="8"/>
            <path d="M 265 290 L 275 225 Q 300 220 325 225 L 335 290 Z" fill="#10B981" stroke="#1E293B" stroke-width="8"/>
            <text x="300" y="355" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">FAMILY • LOVING FAMILY</text>
        </svg>
    `),
    cap: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Dome -->
            <path d="M 180 240 C 180 120 380 120 380 240 Z" fill="#2563EB" stroke="#1E293B" stroke-width="12"/>
            <!-- Visor/bill -->
            <path d="M 320 240 Q 480 240 460 280 Q 320 280 320 240 Z" fill="#1D4ED8" stroke="#1E293B" stroke-width="10"/>
            <circle cx="280" cy="140" r="10" fill="#FDE047"/>
            <text x="300" y="350" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">CAP • BASEBALL CAP</text>
        </svg>
    `),
    tap: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Pipe & Faucet -->
            <rect x="140" y="160" width="160" height="40" fill="#94A3B8" stroke="#1E293B" stroke-width="10"/>
            <path d="M 300 160 L 350 160 L 350 230 L 310 230 L 300 160 Z" fill="#64748B" stroke="#1E293B" stroke-width="10"/>
            <!-- Handle -->
            <rect x="280" y="110" width="80" height="20" rx="6" fill="#EF4444" stroke="#1E293B" stroke-width="8"/>
            <rect x="315" y="130" width="10" height="30" fill="#1E293B"/>
            <!-- Water drop -->
            <path d="M 330 260 C 315 285 345 285 330 260 Z" fill="#38BDF8" stroke="#0284C7" stroke-width="4"/>
            <text x="300" y="350" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">TAP • WATER TAP</text>
        </svg>
    `),
    pan: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <ellipse cx="270" cy="220" rx="140" ry="70" fill="#334155" stroke="#1E293B" stroke-width="12"/>
            <ellipse cx="270" cy="215" rx="120" ry="55" fill="#475569"/>
            <!-- Handle -->
            <rect x="410" y="205" width="120" height="30" rx="8" fill="#B45309" stroke="#1E293B" stroke-width="10"/>
            <text x="300" y="350" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">PAN • FRYING PAN</text>
        </svg>
    `),
    mat: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <polygon points="170,120 430,120 490,280 110,280" fill="#F59E0B" stroke="#1E293B" stroke-width="12"/>
            <!-- Stripes -->
            <polygon points="200,120 240,120 220,280 180,280" fill="#DC2626"/>
            <polygon points="280,120 320,120 320,280 280,280" fill="#3B82F6"/>
            <polygon points="360,120 400,120 420,280 380,280" fill="#10B981"/>
            <text x="300" y="350" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">MAT • FLOOR MAT</text>
        </svg>
    `),
    pot: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Plant -->
            <path d="M 300 160 C 270 120 250 80 280 60 C 310 80 310 120 300 160 Z" fill="#22C55E" stroke="#15803D" stroke-width="6"/>
            <path d="M 300 160 C 330 120 350 80 320 60 C 290 80 290 120 300 160 Z" fill="#16A34A" stroke="#15803D" stroke-width="6"/>
            <!-- Clay Pot -->
            <polygon points="210,170 390,170 360,300 240,300" fill="#EA580C" stroke="#1E293B" stroke-width="12" stroke-linejoin="round"/>
            <rect x="195" y="155" width="210" height="25" rx="6" fill="#C2410C" stroke="#1E293B" stroke-width="8"/>
            <text x="300" y="360" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">POT • FLOWER POT</text>
        </svg>
    `),
    rainbow: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <g fill="none" stroke-width="16">
                <circle cx="300" cy="300" r="180" stroke="#EF4444"/>
                <circle cx="300" cy="300" r="164" stroke="#F97316"/>
                <circle cx="300" cy="300" r="148" stroke="#EAB308"/>
                <circle cx="300" cy="300" r="132" stroke="#22C55E"/>
                <circle cx="300" cy="300" r="116" stroke="#3B82F6"/>
                <circle cx="300" cy="300" r="100" stroke="#8B5CF6"/>
            </g>
            <text x="300" y="360" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">RAINBOW • 7 COLOURS</text>
        </svg>
    `),
    root: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Soil line -->
            <rect x="0" y="160" width="600" height="240" fill="#78350F" opacity="0.3"/>
            <line x1="0" y1="160" x2="600" y2="160" stroke="#78350F" stroke-width="8"/>
            <!-- Stem above ground -->
            <path d="M 300 160 L 300 80" stroke="#15803D" stroke-width="16" stroke-linecap="round"/>
            <path d="M 300 110 Q 340 70 380 90" fill="none" stroke="#15803D" stroke-width="8"/>
            <!-- Underground roots branching -->
            <g stroke="#92400E" stroke-width="10" stroke-linecap="round" fill="none">
                <path d="M 300 160 Q 300 240 300 320"/>
                <path d="M 300 200 Q 240 240 200 300"/>
                <path d="M 300 220 Q 360 250 400 310"/>
                <path d="M 240 240 Q 200 270 170 310"/>
                <path d="M 350 250 Q 390 280 430 310"/>
            </g>
            <text x="300" y="370" font-family="'Lexend', sans-serif" font-size="28" font-weight="bold" fill="#1E293B" text-anchor="middle">ROOT • ABSORBS WATER &amp; MINERALS</text>
        </svg>
    `),
    leaf: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <path d="M 160 300 C 140 180 280 60 440 80 C 460 200 320 320 160 300 Z" fill="#22C55E" stroke="#166534" stroke-width="12" stroke-linejoin="round"/>
            <!-- Midrib & Veins -->
            <path d="M 160 300 Q 300 200 440 80" fill="none" stroke="#166534" stroke-width="10"/>
            <path d="M 250 230 Q 280 200 310 210" fill="none" stroke="#166534" stroke-width="6"/>
            <path d="M 280 180 Q 240 160 210 170" fill="none" stroke="#166534" stroke-width="6"/>
            <path d="M 340 150 Q 370 120 400 130" fill="none" stroke="#166534" stroke-width="6"/>
            <text x="300" y="365" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">LEAF • MAKES FOOD FOR PLANT</text>
        </svg>
    `),
    flower: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Stem -->
            <line x1="300" y1="200" x2="300" y2="340" stroke="#166534" stroke-width="14" stroke-linecap="round"/>
            <!-- Petals -->
            <g fill="#EF4444" stroke="#991B1B" stroke-width="6">
                <circle cx="300" cy="130" r="45"/>
                <circle cx="300" cy="230" r="45"/>
                <circle cx="250" cy="180" r="45"/>
                <circle cx="350" cy="180" r="45"/>
            </g>
            <!-- Center -->
            <circle cx="300" cy="180" r="35" fill="#FDE047" stroke="#CA8A04" stroke-width="6"/>
            <text x="300" y="375" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">FLOWER • BLOOMING FLOWER</text>
        </svg>
    `),
    sun: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Sun Rays -->
            <g stroke="#F59E0B" stroke-width="12" stroke-linecap="round">
                <line x1="300" y1="60" x2="300" y2="90"/><line x1="300" y1="270" x2="300" y2="300"/>
                <line x1="180" y1="180" x2="210" y2="180"/><line x1="390" y1="180" x2="420" y2="180"/>
                <line x1="215" y1="95" x2="235" y2="115"/><line x1="365" y1="245" x2="385" y2="265"/>
                <line x1="385" y1="95" x2="365" y2="115"/><line x1="235" y1="245" x2="215" y2="265"/>
            </g>
            <circle cx="300" cy="180" r="75" fill="#FDE047" stroke="#D97706" stroke-width="10"/>
            <text x="300" y="355" font-family="'Lexend', sans-serif" font-size="32" font-weight="bold" fill="#1E293B" text-anchor="middle">SUN • THE BRIGHT STAR</text>
        </svg>
    `),
    moon: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#1E293B"/>
            <!-- Crescent Moon -->
            <path d="M 340 90 A 90 90 0 1 0 340 270 A 70 70 0 1 1 340 90 Z" fill="#FDE047" stroke="#EAB308" stroke-width="8"/>
            <!-- Stars -->
            <g fill="#FFFFFF">
                <circle cx="160" cy="110" r="5"/><circle cx="200" cy="220" r="4"/><circle cx="450" cy="140" r="6"/><circle cx="420" cy="240" r="4"/>
            </g>
            <text x="300" y="355" font-family="'Lexend', sans-serif" font-size="32" font-weight="bold" fill="#FEF3C7" text-anchor="middle">MOON • NIGHT SKY</text>
        </svg>
    `),
    earth: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <circle cx="300" cy="180" r="95" fill="#3B82F6" stroke="#1E293B" stroke-width="10"/>
            <!-- Continents -->
            <path d="M 260 120 Q 310 110 330 140 Q 300 170 270 150 Z" fill="#22C55E"/>
            <path d="M 280 200 Q 340 190 350 230 Q 310 260 270 240 Z" fill="#22C55E"/>
            <text x="300" y="355" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">EARTH • OUR HOME PLANET</text>
        </svg>
    `),
    bus: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Bus Body -->
            <rect x="120" y="110" width="360" height="150" rx="20" fill="#FACC15" stroke="#1E293B" stroke-width="12"/>
            <!-- Windows -->
            <rect x="150" y="140" width="60" height="45" rx="6" fill="#E0F2FE" stroke="#1E293B" stroke-width="6"/>
            <rect x="230" y="140" width="60" height="45" rx="6" fill="#E0F2FE" stroke="#1E293B" stroke-width="6"/>
            <rect x="310" y="140" width="60" height="45" rx="6" fill="#E0F2FE" stroke="#1E293B" stroke-width="6"/>
            <rect x="390" y="140" width="60" height="45" rx="6" fill="#E0F2FE" stroke="#1E293B" stroke-width="6"/>
            <!-- Wheels -->
            <circle cx="200" cy="265" r="30" fill="#334155" stroke="#1E293B" stroke-width="8"/>
            <circle cx="400" cy="265" r="30" fill="#334155" stroke="#1E293B" stroke-width="8"/>
            <text x="300" y="355" font-family="'Lexend', sans-serif" font-size="32" font-weight="bold" fill="#1E293B" text-anchor="middle">BUS • SCHOOL BUS</text>
        </svg>
    `),
    train: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Engine -->
            <rect x="150" y="120" width="280" height="130" rx="16" fill="#DC2626" stroke="#1E293B" stroke-width="12"/>
            <rect x="320" y="80" width="100" height="50" rx="10" fill="#EF4444" stroke="#1E293B" stroke-width="8"/>
            <rect x="180" y="150" width="80" height="45" rx="6" fill="#FEF08A" stroke="#1E293B" stroke-width="6"/>
            <!-- Wheels -->
            <circle cx="210" cy="255" r="25" fill="#334155" stroke="#1E293B" stroke-width="8"/>
            <circle cx="290" cy="255" r="25" fill="#334155" stroke="#1E293B" stroke-width="8"/>
            <circle cx="370" cy="255" r="25" fill="#334155" stroke="#1E293B" stroke-width="8"/>
            <!-- Track -->
            <line x1="100" y1="285" x2="500" y2="285" stroke="#1E293B" stroke-width="8"/>
            <text x="300" y="355" font-family="'Lexend', sans-serif" font-size="32" font-weight="bold" fill="#1E293B" text-anchor="middle">TRAIN • RAIL TRANSPORT</text>
        </svg>
    `),
    aeroplane: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Fuselage -->
            <ellipse cx="300" cy="180" rx="160" ry="35" fill="#FFFFFF" stroke="#1E293B" stroke-width="10"/>
            <!-- Wings -->
            <polygon points="260,180 340,70 380,70 320,180" fill="#2563EB" stroke="#1E293B" stroke-width="8"/>
            <polygon points="260,180 340,290 380,290 320,180" fill="#2563EB" stroke="#1E293B" stroke-width="8"/>
            <!-- Tail -->
            <polygon points="150,180 130,120 160,120 180,180" fill="#DC2626" stroke="#1E293B" stroke-width="8"/>
            <text x="300" y="360" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">AEROPLANE • AIR TRANSPORT</text>
        </svg>
    `),
    diwali: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Clay Diya -->
            <path d="M 180 230 C 180 300 420 300 420 230 Z" fill="#EA580C" stroke="#9A3412" stroke-width="12"/>
            <ellipse cx="300" cy="230" rx="120" ry="20" fill="#CA8A04" stroke="#854D0E" stroke-width="6"/>
            <!-- Flame -->
            <path d="M 300 130 Q 330 190 300 220 Q 270 190 300 130 Z" fill="#FDE047" stroke="#EA580C" stroke-width="6"/>
            <circle cx="300" cy="180" r="15" fill="#EF4444"/>
            <text x="300" y="360" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">DIWALI • FESTIVAL OF LIGHTS</text>
        </svg>
    `),
    eid: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Crescent -->
            <path d="M 280 100 A 70 70 0 1 0 280 240 A 55 55 0 1 1 280 100 Z" fill="#059669" stroke="#047857" stroke-width="8"/>
            <!-- Lantern -->
            <rect x="360" y="120" width="50" height="80" rx="8" fill="#F59E0B" stroke="#B45309" stroke-width="6"/>
            <line x1="385" y1="90" x2="385" y2="120" stroke="#B45309" stroke-width="6"/>
            <text x="300" y="360" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">EID • CELEBRATION &amp; JOY</text>
        </svg>
    `),
    christmas: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <!-- Tree Layers -->
            <polygon points="300,70 230,150 370,150" fill="#15803D" stroke="#14532D" stroke-width="8"/>
            <polygon points="300,130 200,220 400,220" fill="#16A34A" stroke="#14532D" stroke-width="8"/>
            <polygon points="300,190 170,290 430,290" fill="#22C55E" stroke="#14532D" stroke-width="8"/>
            <!-- Star -->
            <circle cx="300" cy="65" r="15" fill="#FBBF24"/>
            <!-- Trunk -->
            <rect x="280" y="290" width="40" height="40" fill="#78350F"/>
            <text x="300" y="370" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">CHRISTMAS • HOLIDAY JOY</text>
        </svg>
    `),
    water: createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
            <rect width="600" height="400" fill="#FEF3C7"/>
            <path d="M 300 90 C 240 180 200 220 200 260 C 200 320 245 350 300 350 C 355 350 400 320 400 260 C 400 220 360 180 300 90 Z" fill="#38BDF8" stroke="#0284C7" stroke-width="12"/>
            <ellipse cx="270" cy="250" rx="20" ry="40" fill="#BAE6FD" opacity="0.8"/>
            <text x="300" y="380" font-family="'Lexend', sans-serif" font-size="30" font-weight="bold" fill="#1E293B" text-anchor="middle">WATER • PURE WATER</text>
        </svg>
    `)
};

/**
 * Returns a fallback educational SVG data URI for a given concept ID or label
 */
export function getEducationalFallbackSvg(idOrLabel) {
    const key = (idOrLabel || "").toLowerCase();

    if (key.includes("triangle")) return EDUCATIONAL_SVGS.triangle;
    if (key.includes("square")) return EDUCATIONAL_SVGS.square;
    if (key.includes("circle")) return EDUCATIONAL_SVGS.circle;
    if (key.includes("rectangle")) return EDUCATIONAL_SVGS.rectangle;
    if (key.includes("star")) return EDUCATIONAL_SVGS.star;

    if (key.includes("hand") || key.includes("हाथ") || key.includes("ಕೈ")) return EDUCATIONAL_SVGS.hands;
    if (key.includes("ear") || key.includes("कान") || key.includes("ಕಿವಿ")) return EDUCATIONAL_SVGS.ears;
    if (key.includes("clap") || key.includes("ताली")) return EDUCATIONAL_SVGS.clap;
    if (key.includes("smile") || key.includes("मुस्कान")) return EDUCATIONAL_SVGS.smile;
    if (key.includes("family") || key.includes("परिवार") || key.includes("ಕುಟುಂಬ")) return EDUCATIONAL_SVGS.family;
    if (key.includes("cap") || key.includes("टोपी")) return EDUCATIONAL_SVGS.cap;
    if (key.includes("tap") || key.includes("नल")) return EDUCATIONAL_SVGS.tap;
    if (key.includes("pan") || key.includes("तवा")) return EDUCATIONAL_SVGS.pan;
    if (key.includes("mat") || key.includes("चटाई")) return EDUCATIONAL_SVGS.mat;
    if (key.includes("pot") || key.includes("घड़ा") || key.includes("मटका")) return EDUCATIONAL_SVGS.pot;
    if (key.includes("rainbow") || key.includes("इंद्रधनुष")) return EDUCATIONAL_SVGS.rainbow;

    if (key.includes("lotus") || key.includes("कमल")) return EDUCATIONAL_SVGS.lotus;
    if (key.includes("road") || key.includes("सड़क")) return EDUCATIONAL_SVGS.road;
    if (key.includes("eye") || key.includes("नयन") || key.includes("see")) return EDUCATIONAL_SVGS.eyes;
    if (key.includes("window") || key.includes("ಕಿಟಕಿ")) return EDUCATIONAL_SVGS.window;
    if (key.includes("door") || key.includes("ಬಾಗಿಲು")) return EDUCATIONAL_SVGS.door;
    if (key.includes("doctor")) return EDUCATIONAL_SVGS.doctor;
    if (key.includes("teacher")) return EDUCATIONAL_SVGS.teacher;
    if (key.includes("rice") || key.includes("energy")) return EDUCATIONAL_SVGS.rice;
    if (key.includes("milk") || key.includes("body_building")) return EDUCATIONAL_SVGS.milk;

    if (key.includes("root") || key.includes("जड़") || key.includes("ಬೇರು")) return EDUCATIONAL_SVGS.root;
    if (key.includes("leaf") || key.includes("पत्ता") || key.includes("ಎಲೆ")) return EDUCATIONAL_SVGS.leaf;
    if (key.includes("flower") || key.includes("फूल") || key.includes("ಹೂವು") || key.includes("rose")) return EDUCATIONAL_SVGS.flower;
    if (key.includes("sun") || key.includes("सूरज") || key.includes("ಸೂರ್ಯ")) return EDUCATIONAL_SVGS.sun;
    if (key.includes("moon") || key.includes("चाँद") || key.includes("ಚಂದ್ರ")) return EDUCATIONAL_SVGS.moon;
    if (key.includes("earth") || key.includes("पृथ्वी") || key.includes("ಭೂಮಿ")) return EDUCATIONAL_SVGS.earth;
    if (key.includes("bus") || key.includes("बस") || key.includes("ಬಸ್ಸು")) return EDUCATIONAL_SVGS.bus;
    if (key.includes("train") || key.includes("ट्रेन") || key.includes("ರೈಲು")) return EDUCATIONAL_SVGS.train;
    if (key.includes("aeroplane") || key.includes("airplane") || key.includes("विमान") || key.includes("ವಿಮಾನ")) return EDUCATIONAL_SVGS.aeroplane;
    if (key.includes("diwali") || key.includes("दिवाली") || key.includes("ದೀಪಾವಳಿ")) return EDUCATIONAL_SVGS.diwali;
    if (key.includes("eid") || key.includes("ईद") || key.includes("ಈದ್")) return EDUCATIONAL_SVGS.eid;
    if (key.includes("christmas") || key.includes("क्रिसमस") || key.includes("ಕ್ರಿಸ್ಮಸ್")) return EDUCATIONAL_SVGS.christmas;
    if (key.includes("water") || key.includes("पानी") || key.includes("ನೀರು") || key.includes("जल")) return EDUCATIONAL_SVGS.water;

    if (key.includes("half") || key.includes("1/2") || key.includes("0.5") || key.includes("dec_half")) {
        return key.includes("0.5") ? EDUCATIONAL_SVGS.decimal_half : EDUCATIONAL_SVGS.fraction_half;
    }
    if (key.includes("quarter") || key.includes("1/4") || key.includes("0.25") || key.includes("dec_quarter")) {
        return key.includes("0.25") ? EDUCATIONAL_SVGS.decimal_quarter : EDUCATIONAL_SVGS.fraction_quarter;
    }

    if (key.includes("right_angle") || key.includes("90°")) return EDUCATIONAL_SVGS.angle_90;
    if (key.includes("acute")) return EDUCATIONAL_SVGS.angle_acute;

    if (key.includes("heart") || key.includes("circulat")) return EDUCATIONAL_SVGS.heart;
    if (key.includes("brain")) return EDUCATIONAL_SVGS.brain;
    if (key.includes("lung") || key.includes("respirat")) return EDUCATIONAL_SVGS.lungs;

    if (key.includes("coin_1") || key.includes("₹1")) return EDUCATIONAL_SVGS.coin_1;
    if (key.includes("coin_5") || key.includes("₹5")) return EDUCATIONAL_SVGS.coin_5;
    if (key.includes("note_10") || key.includes("₹10")) return EDUCATIONAL_SVGS.note_10;

    if (key.includes("tab_2") || key.includes("2 × 5")) return EDUCATIONAL_SVGS.table_2;
    if (key.includes("tab_5") || key.includes("5 × 5")) return EDUCATIONAL_SVGS.table_5;
    if (key.includes("div_10_2") || key.includes("10 ÷ 2")) return EDUCATIONAL_SVGS.division_10_2;
    if (key.includes("div_20_4") || key.includes("20 ÷ 4")) return EDUCATIONAL_SVGS.division_20_4;

    if (key.includes("num_10") && !key.includes("100")) return EDUCATIONAL_SVGS.number_10;
    if (key.includes("num_100") || key.includes("100")) return EDUCATIONAL_SVGS.number_100;
    if (key.includes("perimeter") || key.includes("area")) return EDUCATIONAL_SVGS.perimeter_area;

    return null;
}
