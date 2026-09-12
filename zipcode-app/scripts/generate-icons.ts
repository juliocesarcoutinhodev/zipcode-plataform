import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(__dirname, '..', 'assets', 'images');

const COLORS = {
  bgDark: '#0a0a1a',
  bgDeep: '#1e1b4b',
  accent: '#6366f1',
  violet: '#8b5cf6',
};

// B path shifted LEFT to compensate for visual center (curves push right)
// Bounds: x 230-740, y 170-854 → visual center ~485,512
// Shifted left ~50px from geometric center to balance visual weight
const B_PATH = `
  M 230 170
  L 230 854
  L 500 854
  C 690 854 780 760 780 630
  C 780 540 730 490 660 465
  C 720 435 780 370 780 280
  C 780 160 680 170 540 170
  Z
  M 350 300
  L 550 300
  C 640 300 680 345 680 420
  C 680 495 640 520 550 520
  L 350 520
  Z
  M 350 580
  L 580 580
  C 660 580 690 620 690 670
  C 690 740 660 780 580 780
  L 350 780
  Z
`;

function createFullIconSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${COLORS.bgDark}"/>
      <stop offset="100%" stop-color="${COLORS.bgDeep}"/>
    </linearGradient>
    <linearGradient id="g" x1="230" y1="170" x2="780" y2="854" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${COLORS.accent}"/>
      <stop offset="100%" stop-color="${COLORS.violet}"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <path d="${B_PATH}" fill="url(#g)"/>
</svg>`;
}

function createForegroundSvg(): string {
  // Foreground: dark background + B centered
  // This prevents the white circle issue — foreground has its own dark bg
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${COLORS.bgDark}"/>
      <stop offset="100%" stop-color="${COLORS.bgDeep}"/>
    </linearGradient>
    <linearGradient id="g" x1="230" y1="170" x2="780" y2="854" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${COLORS.accent}"/>
      <stop offset="100%" stop-color="${COLORS.violet}"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <path d="${B_PATH}" fill="url(#g)"/>
</svg>`;
}

function createBackgroundSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${COLORS.bgDark}"/>
      <stop offset="100%" stop-color="${COLORS.bgDeep}"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
</svg>`;
}

function createMonochromeSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#000000"/>
  <path d="${B_PATH}" fill="#ffffff"/>
</svg>`;
}

function createSplashSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="g" x1="46" y1="34" x2="156" y2="171" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${COLORS.accent}"/>
      <stop offset="100%" stop-color="${COLORS.violet}"/>
    </linearGradient>
  </defs>
  <g transform="translate(46,17) scale(0.108)">
    <path d="${B_PATH}" fill="url(#g)"/>
  </g>
</svg>`;
}

function createFaviconSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${COLORS.bgDark}"/>
      <stop offset="100%" stop-color="${COLORS.bgDeep}"/>
    </linearGradient>
    <linearGradient id="g" x1="11" y1="8" x2="37" y2="41" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${COLORS.accent}"/>
      <stop offset="100%" stop-color="${COLORS.violet}"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="10" fill="url(#bg)"/>
  <g transform="translate(11,8) scale(0.035)">
    <path d="${B_PATH}" fill="url(#g)"/>
  </g>
</svg>`;
}

async function generate() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const tasks = [
    { name: 'icon.png', svg: createFullIconSvg(), size: 1024 },
    { name: 'android-icon-foreground.png', svg: createForegroundSvg(), size: 1024 },
    { name: 'android-icon-background.png', svg: createBackgroundSvg(), size: 1024 },
    { name: 'android-icon-monochrome.png', svg: createMonochromeSvg(), size: 1024 },
    { name: 'splash-icon.png', svg: createSplashSvg(), size: 200 },
    { name: 'favicon.png', svg: createFaviconSvg(), size: 48 },
  ];

  for (const task of tasks) {
    const outputPath = join(OUTPUT_DIR, task.name);
    await sharp(Buffer.from(task.svg))
      .resize(task.size, task.size)
      .png()
      .toFile(outputPath);
    console.log(`✓ ${task.name} (${task.size}x${task.size})`);
  }

  console.log('\nTodos os ícones gerados em assets/images/');
}

generate().catch((err) => {
  console.error('Erro ao gerar ícones:', err);
  process.exit(1);
});
