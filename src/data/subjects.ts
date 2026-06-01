import type { SubjectItem } from "../types/game";
import { ASSET_MAP } from "./assetMap";

export const SUBJECTS: SubjectItem[] = [
  { 
    id: "chinese", 
    name: "语文", 
    color: "#F6D365",
    objects: [
      { id: "brush", name: "毛笔", emoji: "🖌️", image: ASSET_MAP["brush"] },
      { id: "scroll", name: "书卷", emoji: "📜", image: ASSET_MAP["scroll"] },
      { id: "poem", name: "诗词", emoji: "📖", image: ASSET_MAP["poem"] },
      { id: "movable-type", name: "活字印刷块", emoji: "🔠", image: ASSET_MAP["movable-type"] }
    ]
  },
  { 
    id: "math", 
    name: "数学", 
    color: "#7DD3FC",
    objects: [
      { id: "function-graph", name: "函数图像", emoji: "📈", image: ASSET_MAP["function-graph"] },
      { id: "compass", name: "圆规", emoji: "📐", image: ASSET_MAP["compass"] },
      { id: "formula", name: "公式", emoji: "∑", image: ASSET_MAP["formula"] },
      { id: "abacus", name: "算盘", emoji: "🧮", image: ASSET_MAP["abacus"] }
    ]
  },
  { 
    id: "english", 
    name: "英语", 
    color: "#C4B5FD",
    objects: [
      { id: "letters", name: "字母", emoji: "ABC", image: ASSET_MAP["letters"] },
      { id: "word-book", name: "单词书", emoji: "📘", image: ASSET_MAP["word-book"] },
      { id: "western-head", name: "英美人大头照", emoji: "👱", image: ASSET_MAP["western-head"] },
      { id: "statue-of-liberty", name: "自由女神像", emoji: "🗽", image: ASSET_MAP["statue-of-liberty"] }
    ]
  },
  { 
    id: "physics", 
    name: "物理", 
    color: "#93C5FD",
    objects: [
      { id: "circuit", name: "电路", emoji: "🔌", image: ASSET_MAP["circuit"] },
      { id: "newton-cradle", name: "牛顿摆", emoji: "⚙️", image: ASSET_MAP["newton-cradle"] },
      { id: "magnet", name: "磁铁", emoji: "🧲", image: ASSET_MAP["magnet"] },
      { id: "rocket", name: "火箭", emoji: "🚀", image: ASSET_MAP["rocket"] },
      { id: "prism", name: "三棱镜", emoji: "🔺", image: ASSET_MAP["prism"] }
    ]
  },
  { 
    id: "chemistry", 
    name: "化学", 
    color: "#86EFAC",
    objects: [
      { id: "beaker", name: "烧杯", emoji: "🧪", image: ASSET_MAP["beaker"] },
      { id: "molecule-model", name: "分子球棍模型", emoji: "⚛️", image: ASSET_MAP["molecule-model"] },
      { id: "periodic-block", name: "元素周期表方块", emoji: "H", image: ASSET_MAP["periodic-block"] },
      { id: "test-tube", name: "试管", emoji: "🧫", image: ASSET_MAP["test-tube"] }
    ]
  },
  { 
    id: "biology", 
    name: "生物", 
    color: "#A7F3D0",
    objects: [
      { id: "dna", name: "DNA双螺旋模型", emoji: "🧬", image: ASSET_MAP["dna"] },
      { id: "microscope", name: "显微镜", emoji: "🔬", image: ASSET_MAP["microscope"] },
      { id: "cell", name: "细胞", emoji: "🦠", image: ASSET_MAP["cell"] }
    ]
  },
  { 
    id: "politics", 
    name: "政治", 
    color: "#FCA5A5",
    objects: [
      { id: "law-code", name: "法典", emoji: "⚖️", image: ASSET_MAP["law-code"] },
      { id: "flag", name: "旗帜", emoji: "🚩", image: ASSET_MAP["flag"] },
      { id: "great-hall", name: "人民大会堂", emoji: "🏛️", image: ASSET_MAP["great-hall"] },
      { id: "china-flag", name: "中国国旗", emoji: "🇨🇳", image: ASSET_MAP["china-flag"] }
    ]
  },
  { 
    id: "history", 
    name: "历史", 
    color: "#FDBA74",
    objects: [
      { id: "bronze", name: "青铜器", emoji: "🏺", image: ASSET_MAP["bronze"] },
      { id: "ancient-book", name: "古书", emoji: "📔", image: ASSET_MAP["ancient-book"] },
      { id: "hourglass", name: "沙漏", emoji: "⏳", image: ASSET_MAP["hourglass"] },
      { id: "fossil-brush", name: "考古刷/化石", emoji: "🦴", image: ASSET_MAP["fossil-brush"] }
    ]
  },
  { 
    id: "geography", 
    name: "地理", 
    color: "#67E8F9",
    objects: [
      { id: "globe", name: "地球仪", emoji: "🌐", image: ASSET_MAP["globe"] },
      { id: "map", name: "地图", emoji: "🗺️", image: ASSET_MAP["map"] },
      { id: "compass-nav", name: "指南针", emoji: "🧭", image: ASSET_MAP["compass-nav"] },
      { id: "mineral", name: "岩矿标本", emoji: "💎", image: ASSET_MAP["mineral"] }
    ]
  },
  { 
    id: "computer", 
    name: "计算机", 
    color: "#22D3EE",
    objects: [
      { id: "chip", name: "芯片", emoji: "💾", image: ASSET_MAP["chip"] },
      { id: "code-block", name: "代码块", emoji: "</>", image: ASSET_MAP["code-block"] },
      { id: "keyboard", name: "键盘", emoji: "⌨️", image: ASSET_MAP["keyboard"] },
      { id: "terminal", name: "终端", emoji: ">_", image: ASSET_MAP["terminal"] }
    ]
  },
  { 
    id: "painting", 
    name: "绘画", 
    color: "#F0ABFC",
    objects: [
      { id: "paint-brush", name: "画笔", emoji: "🖌️", image: ASSET_MAP["paint-brush"] },
      { id: "palette", name: "调色盘", emoji: "🎨", image: ASSET_MAP["palette"] },
      { id: "canvas", name: "画布", emoji: "🖼️", image: ASSET_MAP["canvas"] },
      { id: "paint-box", name: "颜料盒", emoji: "🧰", image: ASSET_MAP["paint-box"] }
    ]
  },
  { 
    id: "music", 
    name: "音乐", 
    color: "#FDE68A",
    objects: [
      { id: "note", name: "音符", emoji: "🎵", image: ASSET_MAP["note"] },
      { id: "piano", name: "钢琴键", emoji: "🎹", image: ASSET_MAP["piano"] },
      { id: "guitar", name: "吉他", emoji: "🎸", image: ASSET_MAP["guitar"] }
    ]
  }
];