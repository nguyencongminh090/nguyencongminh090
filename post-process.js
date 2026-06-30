const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'profile-summary-card-output', 'tokyonight');

const files = [
  '0-profile-details.svg',
  '1-repos-per-language.svg',
  '2-most-commit-language.svg',
  '3-stats.svg',
  '4-productive-time.svg'
];

const defsBlock = `
  <defs>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#08070d" />
      <stop offset="100%" stop-color="#0e0d16" />
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f2fe" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
`;

files.forEach(file => {
  const filePath = path.join(outputDir, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Inject defs right after the opening <svg> tag
  content = content.replace(/(<svg[^>]*>)/, `$1${defsBlock}`);

  // Replace background and border values on the main rect
  content = content.replace(/fill="#1a1b27"/g, 'fill="url(#cardGrad)"');
  content = content.replace(/stroke="#1a1b27"/g, 'stroke="#ffffff10" stroke-width="1.5"');
  content = content.replace(/rx="5" ry="5"/g, 'rx="12" ry="12"');

  // Colors mapping (Tokyo Night to premium glassmorphism theme)
  // 1. Blue Titles -> Glowing Neon Cyan
  content = content.replace(/#70a5fd/gi, '#00f2fe');
  
  // 2. Teal labels/axis -> Muted Slate Gray
  content = content.replace(/#38bdae/gi, '#94a3b8');
  
  // 3. Purple accents (icons, commits line, bars) -> Neon Violet/Purple
  content = content.replace(/#bf91f3/gi, '#8b5cf6');

  // Let's make the commit line and area charts look ultra premium by using gradients
  // e.g. stroke or fill of the chart elements
  content = content.replace(/fill="#bf91f3"/g, 'fill="url(#glowGrad)"');
  content = content.replace(/stroke="#bf91f3"/g, 'stroke="url(#glowGrad)"');

  // In the details card, let's make the text labels cleaner
  content = content.replace(/font-family: 'Segoe UI'/g, "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully post-processed: ${file}`);
});
