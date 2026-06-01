import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 提取 assetMap.ts 中的路径
const ASSET_MAP_PATH = path.resolve(__dirname, '../src/data/assetMap.ts');
const PROJECT_ROOT = path.resolve(__dirname, '../');

function checkAssets() {
  if (!fs.existsSync(ASSET_MAP_PATH)) {
    console.error(`[ERROR] Cannot find assetMap.ts at ${ASSET_MAP_PATH}`);
    process.exit(1);
  }

  const assetMapContent = fs.readFileSync(ASSET_MAP_PATH, 'utf-8');
  
  // 使用正则匹配所有的路径
  const regex = /:\s*["']([^"']+\.svg)["']/g;
  let match;
  let missingPngs = 0;
  let missingBoth = 0;
  let okCount = 0;

  console.log('--- Checking Game Assets ---\n');

  while ((match = regex.exec(assetMapContent)) !== null) {
    const svgPath = match[1];
    const pngPath = svgPath.replace('.svg', '.png');
    
    // 转换为本地绝对路径 (移除 / 前缀)
    const absoluteSvgPath = path.join(PROJECT_ROOT, svgPath.replace(/^\//, ''));
    const absolutePngPath = path.join(PROJECT_ROOT, pngPath.replace(/^\//, ''));

    const hasSvg = fs.existsSync(absoluteSvgPath);
    const hasPng = fs.existsSync(absolutePngPath);

    if (hasPng) {
      okCount++;
    } else if (hasSvg) {
      missingPngs++;
      console.warn(`[WARNING] PNG missing, fallback to SVG: ${pngPath}`);
    } else {
      missingBoth++;
      console.error(`[ERROR] Both PNG and SVG missing for: ${svgPath}`);
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Ready PNGs: ${okCount}`);
  console.log(`Fallback SVGs: ${missingPngs}`);
  console.log(`Broken Assets: ${missingBoth}`);

  if (missingBoth > 0) {
    console.error('\n[!] Some assets are completely missing. Please run `npm run assets:placeholder` first.');
  } else if (missingPngs > 0) {
    console.warn('\n[!] Using some SVG placeholders. Generate PNGs using `docs/assets-generation-guide.md` for better experience.');
  } else {
    console.log('\n[V] All PNG assets are ready!');
  }
}

checkAssets();