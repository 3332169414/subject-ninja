# 游戏图片资产生成与替换指南

为了获得更好的游戏体验，我们建议将默认生成的 `.svg` 占位图标替换为由 AI 生成的高质量赛博朋克风格透明 `.png` 图标。

## 资源规格要求
1. **尺寸**：统一为 `512 x 512 px`。
2. **格式**：`PNG`（必须为透明背景，无背景色）。
3. **视觉风格**：赛博朋克、发光图标、青蓝描边、轻微立体感。
4. **命名规范**：文件名必须全部为英文小写（可包含短横线），不使用中文。
5. **主体要求**：无文字 (no text)，无水印 (no watermark)，高对比度，柔和的霓虹边缘光，居中放置。

## 生成工具推荐
- [ChatGPT (DALL·E 3)](https://chat.openai.com/)
- [即梦 (Dreamina)](https://jimeng.jianying.com/)
- [Midjourney](https://www.midjourney.com/)
- [Canva](https://www.canva.com/)

---

## 替换方法
1. 下载生成好的 `.png` 文件。
2. 如果存在背景，请使用在线去背景工具（如 remove.bg）抠除背景。
3. 按照下表的【保存路径】存放图片（直接将 `.png` 放进去即可，不需要删除同名的 `.svg` 文件）。
4. 游戏引擎会优先尝试加载 `.png`，若不存在则回退加载 `.svg`，若都失败则显示 Emoji。

---

## 完整素材清单与 AI 生图提示词

你可以直接复制下面的提示词到 AI 生图工具中。

### 语文 (chinese)
| 物件中文名 | 英文文件名 | 保存路径 | AI 生图提示词 |
| --- | --- | --- | --- |
| 毛笔 | brush.png | `src/assets/subjects/chinese/brush.png` | `512x512 transparent background cyberpunk glowing icon of a Chinese calligraphy brush, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 书卷 | scroll.png | `src/assets/subjects/chinese/scroll.png` | `512x512 transparent background cyberpunk glowing icon of an ancient Chinese scroll, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 诗词 | poem.png | `src/assets/subjects/chinese/poem.png` | `512x512 transparent background cyberpunk glowing icon of an open poetry book, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 活字印刷块 | movable-type.png | `src/assets/subjects/chinese/movable-type.png` | `512x512 transparent background cyberpunk glowing icon of a Chinese movable type printing block, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |

### 数学 (math)
| 物件中文名 | 英文文件名 | 保存路径 | AI 生图提示词 |
| --- | --- | --- | --- |
| 函数图像 | function-graph.png | `src/assets/subjects/math/function-graph.png` | `512x512 transparent background cyberpunk glowing icon of a mathematical function graph, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 圆规 | compass.png | `src/assets/subjects/math/compass.png` | `512x512 transparent background cyberpunk glowing icon of a drawing compass, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 公式 | formula.png | `src/assets/subjects/math/formula.png` | `512x512 transparent background cyberpunk glowing icon of a glowing mathematical formula, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 算盘 | abacus.png | `src/assets/subjects/math/abacus.png` | `512x512 transparent background cyberpunk glowing icon of an abacus, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |

### 英语 (english)
| 物件中文名 | 英文文件名 | 保存路径 | AI 生图提示词 |
| --- | --- | --- | --- |
| 字母 | letters.png | `src/assets/subjects/english/letters.png` | `512x512 transparent background cyberpunk glowing icon of floating ABC letters, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 单词书 | word-book.png | `src/assets/subjects/english/word-book.png` | `512x512 transparent background cyberpunk glowing icon of an English vocabulary book, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 英美人大头照 | western-head.png | `src/assets/subjects/english/western-head.png` | `512x512 transparent background cyberpunk glowing icon of a western person's silhouette portrait, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 自由女神像 | statue-of-liberty.png | `src/assets/subjects/english/statue-of-liberty.png` | `512x512 transparent background cyberpunk glowing icon of the Statue of Liberty, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |

### 物理 (physics)
| 物件中文名 | 英文文件名 | 保存路径 | AI 生图提示词 |
| --- | --- | --- | --- |
| 电路 | circuit.png | `src/assets/subjects/physics/circuit.png` | `512x512 transparent background cyberpunk glowing icon of an electronic circuit board, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 牛顿摆 | newton-cradle.png | `src/assets/subjects/physics/newton-cradle.png` | `512x512 transparent background cyberpunk glowing icon of a Newton's cradle, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 磁铁 | magnet.png | `src/assets/subjects/physics/magnet.png` | `512x512 transparent background cyberpunk glowing icon of a horseshoe magnet, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 火箭 | rocket.png | `src/assets/subjects/physics/rocket.png` | `512x512 transparent background cyberpunk glowing icon of a space rocket, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 三棱镜 | prism.png | `src/assets/subjects/physics/prism.png` | `512x512 transparent background cyberpunk glowing icon of an optical glass prism refracting light, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |

### 化学 (chemistry)
| 物件中文名 | 英文文件名 | 保存路径 | AI 生图提示词 |
| --- | --- | --- | --- |
| 烧杯 | beaker.png | `src/assets/subjects/chemistry/beaker.png` | `512x512 transparent background cyberpunk glowing icon of a chemistry beaker with liquid, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 分子球棍模型 | molecule-model.png | `src/assets/subjects/chemistry/molecule-model.png` | `512x512 transparent background cyberpunk glowing icon of a molecular ball-and-stick model, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 元素周期表方块 | periodic-block.png | `src/assets/subjects/chemistry/periodic-block.png` | `512x512 transparent background cyberpunk glowing icon of a periodic table element block, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 试管 | test-tube.png | `src/assets/subjects/chemistry/test-tube.png` | `512x512 transparent background cyberpunk glowing icon of a test tube, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |

### 生物 (biology)
| 物件中文名 | 英文文件名 | 保存路径 | AI 生图提示词 |
| --- | --- | --- | --- |
| DNA双螺旋模型 | dna.png | `src/assets/subjects/biology/dna.png` | `512x512 transparent background cyberpunk glowing icon of a DNA double helix, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 显微镜 | microscope.png | `src/assets/subjects/biology/microscope.png` | `512x512 transparent background cyberpunk glowing icon of a laboratory microscope, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 细胞 | cell.png | `src/assets/subjects/biology/cell.png` | `512x512 transparent background cyberpunk glowing icon of a biological cell, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |

### 政治 (politics)
| 物件中文名 | 英文文件名 | 保存路径 | AI 生图提示词 |
| --- | --- | --- | --- |
| 法典 | law-code.png | `src/assets/subjects/politics/law-code.png` | `512x512 transparent background cyberpunk glowing icon of a heavy law code book, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 旗帜 | flag.png | `src/assets/subjects/politics/flag.png` | `512x512 transparent background cyberpunk glowing icon of a waving flag, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 人民大会堂 | great-hall.png | `src/assets/subjects/politics/great-hall.png` | `512x512 transparent background cyberpunk glowing icon of the Great Hall of the People architecture, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 中国国旗 | china-flag.png | `src/assets/subjects/politics/china-flag.png` | `512x512 transparent background cyberpunk glowing icon of the Chinese national flag, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |

### 历史 (history)
| 物件中文名 | 英文文件名 | 保存路径 | AI 生图提示词 |
| --- | --- | --- | --- |
| 青铜器 | bronze.png | `src/assets/subjects/history/bronze.png` | `512x512 transparent background cyberpunk glowing icon of an ancient Chinese bronze vessel, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 古书 | ancient-book.png | `src/assets/subjects/history/ancient-book.png` | `512x512 transparent background cyberpunk glowing icon of a dusty ancient history book, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 沙漏 | hourglass.png | `src/assets/subjects/history/hourglass.png` | `512x512 transparent background cyberpunk glowing icon of a classic hourglass, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 考古刷/化石 | fossil-brush.png | `src/assets/subjects/history/fossil-brush.png` | `512x512 transparent background cyberpunk glowing icon of a dinosaur fossil and an archaeology brush, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |

### 地理 (geography)
| 物件中文名 | 英文文件名 | 保存路径 | AI 生图提示词 |
| --- | --- | --- | --- |
| 地球仪 | globe.png | `src/assets/subjects/geography/globe.png` | `512x512 transparent background cyberpunk glowing icon of a globe, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 地图 | map.png | `src/assets/subjects/geography/map.png` | `512x512 transparent background cyberpunk glowing icon of an unfolded map, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 指南针 | compass-nav.png | `src/assets/subjects/geography/compass-nav.png` | `512x512 transparent background cyberpunk glowing icon of a navigational compass, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 岩矿标本 | mineral.png | `src/assets/subjects/geography/mineral.png` | `512x512 transparent background cyberpunk glowing icon of a shiny mineral rock specimen, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |

### 计算机 (computer)
| 物件中文名 | 英文文件名 | 保存路径 | AI 生图提示词 |
| --- | --- | --- | --- |
| 芯片 | chip.png | `src/assets/subjects/computer/chip.png` | `512x512 transparent background cyberpunk glowing icon of a computer microchip, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 代码块 | code-block.png | `src/assets/subjects/computer/code-block.png` | `512x512 transparent background cyberpunk glowing icon of a glowing programming code block, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 键盘 | keyboard.png | `src/assets/subjects/computer/keyboard.png` | `512x512 transparent background cyberpunk glowing icon of a mechanical keyboard, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 终端 | terminal.png | `src/assets/subjects/computer/terminal.png` | `512x512 transparent background cyberpunk glowing icon of a command line terminal window, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |

### 绘画 (painting)
| 物件中文名 | 英文文件名 | 保存路径 | AI 生图提示词 |
| --- | --- | --- | --- |
| 画笔 | paint-brush.png | `src/assets/subjects/painting/paint-brush.png` | `512x512 transparent background cyberpunk glowing icon of an artist's paint brush, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 调色盘 | palette.png | `src/assets/subjects/painting/palette.png` | `512x512 transparent background cyberpunk glowing icon of a color palette, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 画布 | canvas.png | `src/assets/subjects/painting/canvas.png` | `512x512 transparent background cyberpunk glowing icon of a painting canvas on an easel, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 颜料盒 | paint-box.png | `src/assets/subjects/painting/paint-box.png` | `512x512 transparent background cyberpunk glowing icon of a watercolor paint box, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |

### 音乐 (music)
| 物件中文名 | 英文文件名 | 保存路径 | AI 生图提示词 |
| --- | --- | --- | --- |
| 音符 | note.png | `src/assets/subjects/music/note.png` | `512x512 transparent background cyberpunk glowing icon of a musical note, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 钢琴键 | piano.png | `src/assets/subjects/music/piano.png` | `512x512 transparent background cyberpunk glowing icon of piano keys, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
| 吉他 | guitar.png | `src/assets/subjects/music/guitar.png` | `512x512 transparent background cyberpunk glowing icon of an electric guitar, cyan blue outline, clean game asset, centered object, no text, no watermark, high contrast, soft neon rim light, suitable for frontend canvas game` |
