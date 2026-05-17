const sharp = require('sharp');
const path = require('path');

const OUT_ADAPTIVE = path.join(__dirname, '..', 'assets', 'adaptive-icon.png');
const OUT_ICON = path.join(__dirname, '..', 'assets', 'icon.png');
const OUT_SPLASH = path.join(__dirname, '..', 'assets', 'splash.png');

function gradientIconSvg({ width, height, fontSize, textY, rounded }) {
  const radius = rounded ? Math.round(Math.min(width, height) * 0.18) : 0;
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#4F6DFF"/>
      <stop offset="100%" stop-color="#9B30FF"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="url(#g)"/>
  <text x="${width / 2}" y="${textY}" text-anchor="middle"
        font-family="Arial Black, Impact, Helvetica, sans-serif"
        font-weight="900" font-size="${fontSize}" fill="white">RT.</text>
</svg>
`;
}

// Adaptive icon: large safe zone — content lives in inner ~66%
async function makeAdaptive() {
  const SIZE = 1024;
  const svg = gradientIconSvg({
    width: SIZE, height: SIZE,
    fontSize: 340,        // smaller so it sits inside the safe zone
    textY: 620,           // visually centered with descender adjustment
    rounded: false,       // adaptive icon canvas is square
  });
  await sharp(Buffer.from(svg)).png().toFile(OUT_ADAPTIVE);
  console.log('Wrote', OUT_ADAPTIVE);
}

// Regular icon (used on iOS / Play Store listing)
async function makeIcon() {
  const SIZE = 1024;
  const svg = gradientIconSvg({
    width: SIZE, height: SIZE,
    fontSize: 460,
    textY: 660,
    rounded: false,
  });
  await sharp(Buffer.from(svg)).png().toFile(OUT_ICON);
  console.log('Wrote', OUT_ICON);
}

// Splash: full-screen gradient with centered logo
async function makeSplash() {
  const W = 1284, H = 2778;
  const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4F6DFF"/>
      <stop offset="100%" stop-color="#9B30FF"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="${W / 2}" y="${H / 2 + 100}" text-anchor="middle"
        font-family="Arial Black, Impact, Helvetica, sans-serif"
        font-weight="900" font-size="320" fill="white">RT.</text>
</svg>
`;
  await sharp(Buffer.from(svg)).png().toFile(OUT_SPLASH);
  console.log('Wrote', OUT_SPLASH);
}

(async () => {
  await makeAdaptive();
  await makeIcon();
  await makeSplash();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
