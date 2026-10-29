// Procedural high-aesthetic cover and video generator for 34 cards

const PALETTES = [
  { bg1: '#0B0D17', bg2: '#1F1B3C', accent: '#D4AF37', glow: 'rgba(212, 175, 55, 0.3)' }, // Imperial Gold
  { bg1: '#0A1118', bg2: '#0D2735', accent: '#4ECCA3', glow: 'rgba(78, 204, 163, 0.3)' }, // Cyan Aurora
  { bg1: '#140D1B', bg2: '#2B1038', accent: '#F08A5D', glow: 'rgba(240, 138, 93, 0.3)' }, // Dusk Crimson
  { bg1: '#0D131A', bg2: '#162447', accent: '#64DFDF', glow: 'rgba(100, 223, 223, 0.3)' }, // Oceanic Azure
  { bg1: '#16130D', bg2: '#3D2C1D', accent: '#E0A96D', glow: 'rgba(224, 169, 109, 0.3)' }, // Amber Cognac
  { bg1: '#120F1E', bg2: '#2D1B4E', accent: '#B388FF', glow: 'rgba(179, 136, 255, 0.3)' }, // Violet Nebula
];

export function toRomanNumeral(num) {
  const roman = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100,
    XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let str = '';
  for (let i of Object.keys(roman)) {
    let q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }
  return str;
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Generate rich high-resolution SVG cover data URL with geometric motifs and luxury gradients
export function generateCardCover(index, title, category) {
  const palette = PALETTES[index % PALETTES.length];
  const roman = toRomanNumeral(index + 1);
  const patternSeed = (index * 37) % 360;
  const safeCat = escapeXml(category.toUpperCase());

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640" width="360" height="640">
      <defs>
        <linearGradient id="bgGrad_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.bg1}" />
          <stop offset="60%" stop-color="${palette.bg2}" />
          <stop offset="100%" stop-color="#040508" />
        </linearGradient>
        <linearGradient id="goldGrad_${index}" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="${palette.accent}" />
          <stop offset="50%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="${palette.accent}" />
        </linearGradient>
        <radialGradient id="radialGlow_${index}" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="${palette.glow}" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
        <filter id="blur_${index}">
          <feGaussianBlur stdDeviation="30" />
        </filter>
      </defs>

      <!-- Background -->
      <rect width="360" height="640" fill="url(#bgGrad_${index})" />

      <!-- Ambient Glow Orb -->
      <circle cx="180" cy="240" r="140" fill="url(#radialGlow_${index})" filter="url(#blur_${index})" />

      <!-- Geometric Frame Elements -->
      <rect x="20" y="20" width="320" height="600" rx="16" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
      <rect x="26" y="26" width="308" height="588" rx="12" fill="none" stroke="rgba(212,175,55,0.18)" stroke-width="0.8" stroke-dasharray="4 6" />

      <!-- Center Art Motif -->
      <g transform="translate(180, 260) rotate(${patternSeed})">
        <circle r="70" fill="none" stroke="${palette.accent}" stroke-width="1" opacity="0.35" />
        <circle r="85" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="3 9" />
        <polygon points="0,-60 52,30 -52,30" fill="none" stroke="${palette.accent}" stroke-width="1.2" opacity="0.5" />
        <polygon points="0,60 -52,-30 52,-30" fill="none" stroke="url(#goldGrad_${index})" stroke-width="1.2" opacity="0.4" />
        <circle r="6" fill="${palette.accent}" />
      </g>

      <!-- Card Index Badge -->
      <g transform="translate(42, 56)">
        <text x="0" y="0" font-family="'Cinzel', serif" font-size="12" font-weight="700" fill="${palette.accent}" letter-spacing="3">ARCHIVE N° ${roman}</text>
      </g>

      <!-- Category Label -->
      <g transform="translate(42, 80)">
        <text x="0" y="0" font-family="'Poppins', sans-serif" font-size="10" font-weight="600" fill="rgba(255,255,255,0.5)" letter-spacing="2">${safeCat}</text>
      </g>

      <!-- Subtle Bottom Ambient Vignette -->
      <rect x="0" y="440" width="360" height="200" fill="url(#bgGrad_${index})" opacity="0.5" />

      <!-- Corner Accents -->
      <path d="M 30 50 L 30 30 L 50 30" fill="none" stroke="${palette.accent}" stroke-width="1.5" />
      <path d="M 330 50 L 330 30 L 310 30" fill="none" stroke="${palette.accent}" stroke-width="1.5" />
      <path d="M 30 590 L 30 610 L 50 610" fill="none" stroke="${palette.accent}" stroke-width="1.5" />
      <path d="M 330 590 L 330 610 L 310 610" fill="none" stroke="${palette.accent}" stroke-width="1.5" />
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
