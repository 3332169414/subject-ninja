import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.resolve(__dirname, '../src/assets/subjects');

const SUBJECTS_DATA = [
  {
    id: "chinese",
    color: "#F6D365",
    objects: [
      { id: "brush", name: "毛笔", emoji: "🖌️" },
      { id: "scroll", name: "书卷", emoji: "📜" },
      { id: "poem", name: "诗词", emoji: "📖" },
      { id: "movable-type", name: "活字印刷块", emoji: "🔠" }
    ]
  },
  {
    id: "math",
    color: "#7DD3FC",
    objects: [
      { id: "function-graph", name: "函数图像", emoji: "📈" },
      { id: "compass", name: "圆规", emoji: "📐" },
      { id: "formula", name: "公式", emoji: "∑" },
      { id: "abacus", name: "算盘", emoji: "🧮" }
    ]
  },
  {
    id: "english",
    color: "#C4B5FD",
    objects: [
      { id: "letters", name: "字母", emoji: "ABC" },
      { id: "word-book", name: "单词书", emoji: "📘" },
      { id: "western-head", name: "英美人大头照", emoji: "👱" },
      { id: "statue-of-liberty", name: "自由女神像", emoji: "🗽" }
    ]
  },
  {
    id: "physics",
    color: "#93C5FD",
    objects: [
      { id: "circuit", name: "电路", emoji: "🔌" },
      { id: "newton-cradle", name: "牛顿摆", emoji: "⚙️" },
      { id: "magnet", name: "磁铁", emoji: "🧲" },
      { id: "rocket", name: "火箭", emoji: "🚀" },
      { id: "prism", name: "三棱镜", emoji: "🔺" }
    ]
  },
  {
    id: "chemistry",
    color: "#86EFAC",
    objects: [
      { id: "beaker", name: "烧杯", emoji: "🧪" },
      { id: "molecule-model", name: "分子球棍模型", emoji: "⚛️" },
      { id: "periodic-block", name: "元素周期表方块", emoji: "H" },
      { id: "test-tube", name: "试管", emoji: "🧫" }
    ]
  },
  {
    id: "biology",
    color: "#A7F3D0",
    objects: [
      { id: "dna", name: "DNA双螺旋模型", emoji: "🧬" },
      { id: "microscope", name: "显微镜", emoji: "🔬" },
      { id: "cell", name: "细胞", emoji: "🦠" }
    ]
  },
  {
    id: "politics",
    color: "#FCA5A5",
    objects: [
      { id: "law-code", name: "法典", emoji: "⚖️" },
      { id: "flag", name: "旗帜", emoji: "🚩" },
      { id: "great-hall", name: "人民大会堂", emoji: "🏛️" },
      { id: "china-flag", name: "中国国旗", emoji: "🇨🇳" }
    ]
  },
  {
    id: "history",
    color: "#FDBA74",
    objects: [
      { id: "bronze", name: "青铜器", emoji: "🏺" },
      { id: "ancient-book", name: "古书", emoji: "📔" },
      { id: "hourglass", name: "沙漏", emoji: "⏳" },
      { id: "fossil-brush", name: "考古刷/化石", emoji: "🦴" }
    ]
  },
  {
    id: "geography",
    color: "#67E8F9",
    objects: [
      { id: "globe", name: "地球仪", emoji: "🌐" },
      { id: "map", name: "地图", emoji: "🗺️" },
      { id: "compass-nav", name: "指南针", emoji: "🧭" },
      { id: "mineral", name: "岩矿标本", emoji: "💎" }
    ]
  },
  {
    id: "computer",
    color: "#22D3EE",
    objects: [
      { id: "chip", name: "芯片", emoji: "💾" },
      { id: "code-block", name: "代码块", emoji: "</>" },
      { id: "keyboard", name: "键盘", emoji: "⌨️" },
      { id: "terminal", name: "终端", emoji: ">_" }
    ]
  },
  {
    id: "painting",
    color: "#F0ABFC",
    objects: [
      { id: "paint-brush", name: "画笔", emoji: "🖌️" },
      { id: "palette", name: "调色盘", emoji: "🎨" },
      { id: "canvas", name: "画布", emoji: "🖼️" },
      { id: "paint-box", name: "颜料盒", emoji: "🧰" }
    ]
  },
  {
    id: "music",
    color: "#FDE68A",
    objects: [
      { id: "note", name: "音符", emoji: "🎵" },
      { id: "piano", name: "钢琴键", emoji: "🎹" },
      { id: "guitar", name: "吉他", emoji: "🎸" }
    ]
  }
];

function generateSVG(color, emoji, name) {
  // 让背景底盘更亮，让 emoji 变大，增强发光效果
  return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- 发光晕层 -->
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
    <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- 底盘辉光 -->
  <circle cx="256" cy="256" r="256" fill="url(#glow)" />
  
  <!-- 深色半透明主底盘 -->
  <circle cx="256" cy="256" r="230" fill="#050a14" fill-opacity="0.9" />
  
  <!-- 多重发光边框 -->
  <circle cx="256" cy="256" r="230" fill="none" stroke="${color}" stroke-width="12" opacity="0.4" filter="blur(6px)"/>
  <circle cx="256" cy="256" r="230" fill="none" stroke="${color}" stroke-width="6" />
  <circle cx="256" cy="256" r="200" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="15, 15" opacity="0.8"/>

  <!-- 中间巨大 emoji -->
  <text x="256" y="240" font-family="Arial, sans-serif" font-size="240" text-anchor="middle" dominant-baseline="middle" filter="url(#neon-glow)">${emoji}</text>

  <!-- 底部显示物件中文名的高亮铭牌 -->
  <rect x="80" y="380" width="352" height="90" rx="16" fill="#000000" fill-opacity="0.8" stroke="${color}" stroke-width="4"/>
  <rect x="80" y="380" width="352" height="90" rx="16" fill="${color}" fill-opacity="0.15" />
  <text x="256" y="430" font-family="'Courier New', Courier, monospace, 'Microsoft YaHei', sans-serif" font-size="46" font-weight="900" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" style="text-shadow: 0 0 12px ${color}, 0 0 24px ${color};">${name}</text>
</svg>`;
}

async function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  let createdCount = 0;
  let skippedCount = 0;

  for (const subject of SUBJECTS_DATA) {
    const subjectDir = path.join(ASSETS_DIR, subject.id);
    if (!fs.existsSync(subjectDir)) {
      fs.mkdirSync(subjectDir, { recursive: true });
    }

    for (const obj of subject.objects) {
      const fileName = `${obj.id}.svg`;
      const filePath = path.join(subjectDir, fileName);

      // 为了强制更新所有的图片，现在去掉 if(fs.existsSync) 跳过逻辑，强制覆盖写入
      const svgContent = generateSVG(subject.color, obj.emoji, obj.name);
      fs.writeFileSync(filePath, svgContent, 'utf-8');
      createdCount++;
      console.log(`[CREATE/OVERWRITE] ${filePath}`);
    }
  }

  console.log(`\nDone! Created/Overwritten: ${createdCount}, Skipped: ${skippedCount}`);
}

main().catch(console.error);