const sharp = require('sharp');
const path = require('path');

const OUT_ADAPTIVE = path.join(__dirname, '..', 'assets', 'adaptive-icon.png');
const OUT_ICON = path.join(__dirname, '..', 'assets', 'icon.png');
const OUT_SPLASH = path.join(__dirname, '..', 'assets', 'splash.png');
const OUT_LOGO = path.join(__dirname, '..', 'assets', 'logo.png');

// Brand colors (warm sunset)
const GRAD_START = '#FB923C';  // warm orange
const GRAD_END = '#F43F5E';    // coral / rose
const WORDMARK = 'Ss.';        // capital S + lowercase s + period

function gradientIconSvg({ width, height, fontSize, textY }) {
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${GRAD_START}"/>
      <stop offset="100%" stop-color="${GRAD_END}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <text x="${width / 2}" y="${textY}" text-anchor="middle"
        font-family="Arial Black, Impact, Helvetica, sans-serif"
        font-weight="900" font-size="${fontSize}" fill="white">${WORDMARK}</text>
</svg>
`;
}

// Adaptive icon: ~20% safe-zone padding for Android launcher cropping
async function makeAdaptive() {
  const SIZE = 1024;
  const svg = gradientIconSvg({
    width: SIZE, height: SIZE,
    fontSize: 260,
    textY: 600,
  });
  await sharp(Buffer.from(svg)).png().toFile(OUT_ADAPTIVE);
  console.log('Wrote', OUT_ADAPTIVE);
}

// Regular icon (iOS / Play Store thumbnail)
async function makeIcon() {
  const SIZE = 1024;
  const svg = gradientIconSvg({
    width: SIZE, height: SIZE,
    fontSize: 340,
    textY: 630,
  });
  await sharp(Buffer.from(svg)).png().toFile(OUT_ICON);
  console.log('Wrote', OUT_ICON);
}

// In-app logo (used in Splash/Login/Settings) — same as the icon at 512x512
async function makeLogo() {
  const SIZE = 512;
  const svg = gradientIconSvg({
    width: SIZE, height: SIZE,
    fontSize: 170,
    textY: 315,
  });
  await sharp(Buffer.from(svg)).png().toFile(OUT_LOGO);
  console.log('Wrote', OUT_LOGO);
}

// Splash: full-screen gradient with centered logo
async function makeSplash() {
  const W = 1284, H = 2778;
  const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${GRAD_START}"/>
      <stop offset="100%" stop-color="${GRAD_END}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="${W / 2}" y="${H / 2 + 100}" text-anchor="middle"
        font-family="Arial Black, Impact, Helvetica, sans-serif"
        font-weight="900" font-size="320" fill="white">${WORDMARK}</text>
</svg>
`;
  await sharp(Buffer.from(svg)).png().toFile(OUT_SPLASH);
  console.log('Wrote', OUT_SPLASH);
}

(async () => {
  await makeAdaptive();
  await makeIcon();
  await makeLogo();
  await makeSplash();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
