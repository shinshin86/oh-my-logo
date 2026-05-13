# oh-my-logo

English | [简体中文](./README-zh.md)


[![Mentioned in Awesome Gemini CLI](https://awesome.re/mentioned-badge.svg)](https://github.com/Piebald-AI/awesome-gemini-cli)

![Logo](https://raw.githubusercontent.com/shinshin86/oh-my-logo/main/images/logo.png)

在终端中创建带有精美渐变色的 ASCII 艺术 Logo！适用于项目横幅、启动标志，或让你的终端更加炫酷。

你还可以在程序中将其作为库使用，创建令人惊艳的动画效果！

![GIF Demo](https://raw.githubusercontent.com/shinshin86/oh-my-logo/refs/heads/main/images/demo.gif)

![GIF Demo 2](https://raw.githubusercontent.com/shinshin86/oh-my-logo/main/images/demo2.gif)

`oh-my-logo` 生成的 Logo 采用 CC0（公共领域）许可，可自由使用。

## ✨ 特性

- 🎨 **两种渲染模式**：选择轮廓 ASCII 艺术或填充块字符
- 🌈 **13 种精美调色板**：从日落渐变到矩阵绿
- 📐 **渐变方向**：垂直、水平和对角线渐变
- 🔤 **多行支持**：创建包含多行文本的 Logo
- ⚡ **零依赖**：使用 `npx` 即时运行 - 无需安装
- 🎛️ **可自定义**：使用不同字体和创建自己的配色方案
- 🎭 **阴影样式**：在填充模式下使用不同块字体自定义阴影效果
- 🔄 **字间距**：`--filled` 模式下可调节字符间距以获得不同的视觉密度
- 🔄 **反转渐变**：翻转调色板以获得独特效果

## 🚀 快速开始

无需安装！立即尝试：

```bash
npx oh-my-logo "HELLO WORLD"
```

想要填充字符？添加 `--filled` 标志：

```bash
npx oh-my-logo "YOUR LOGO" sunset --filled
```

### 🆕 v0.3.0 新功能

**在填充模式下自定义阴影样式：**
```bash
# 绘图阴影（默认）
npx oh-my-logo "STYLE" fire --filled --block-font block

# 极简阴影
npx oh-my-logo "STYLE" fire --filled --block-font chrome

# 点状/阴影效果
npx oh-my-logo "STYLE" fire --filled --block-font shade
```

**控制块字体的字间距：**
```bash
# 宽间距（字母间 5 个空格）
npx oh-my-logo "WIDE" ocean --filled --letter-spacing 5

# 紧凑间距（无空格）
npx oh-my-logo "TIGHT" ocean --filled --letter-spacing 0
```

**反转渐变获得独特效果：**
```bash
# 反转任意调色板
npx oh-my-logo "REVERSE" sunset --reverse-gradient

# 填充模式同样适用
npx oh-my-logo "REVERSE" sunset --filled --reverse-gradient
```

## 📦 安装

### 全局安装（CLI）
```bash
npm install -g oh-my-logo
```

### 或使用 npx 直接运行
```bash
npx oh-my-logo "Your Text"
```

### 作为库使用
```bash
npm install oh-my-logo
```

## 🎯 使用方法

### CLI 用法

```bash
oh-my-logo <text> [palette] [options]
```

#### 自定义调色板（CLI）

通过 `--palette-colors <colors>` 提供自定义渐变色。

```bash
# JSON 数组（推荐使用双引号）
npx oh-my-logo "MY LOGO" --palette-colors '["#00ff00","#ffa500","#ff0000"]'

# 简单逗号分隔格式（每个颜色用引号包裹）
npx oh-my-logo "MY LOGO" --palette-colors "'#00ff00', '#ffa500', '#ff0000'"
```

- 逗号分隔格式便于快速 CLI 使用和单行命令
- JSON 数组格式适合在 shell 脚本或 CI 变量中存储调色板
- 多余的空白会自动去除
- 颜色字符串可以是十六进制代码或 `gradient-string` 支持的任何 CSS 颜色
- 可以将自定义调色板与 `--reverse-gradient` 或 `--filled` 等其他选项组合使用
- 位置参数 `[palette]` 仅接受内置调色板名称

### 库用法

```javascript
import { render, renderFilled, PALETTES, getPaletteNames } from 'oh-my-logo';

// 基本 ASCII 艺术渲染
const logo = await render('HELLO WORLD', {
  palette: 'sunset',
  direction: 'horizontal'
});
console.log(logo);

// 使用自定义颜色
const customLogo = await render('MY BRAND', {
  palette: ['#ff0000', '#00ff00', '#0000ff'],
  font: 'Big',
  direction: 'diagonal'
});
console.log(customLogo);

// 填充块字符
await renderFilled('AWESOME', {
  palette: 'fire'
});

// 使用自定义阴影样式的填充模式
await renderFilled('SHADOW', {
  palette: 'sunset',
  font: 'shade'  // 使用点状阴影效果
});

// 使用宽字间距的填充模式
await renderFilled('WIDE', {
  palette: 'fire',
  letterSpacing: 3
});

// TypeScript 用法
import { render, RenderOptions, PaletteName } from 'oh-my-logo';

const options: RenderOptions = {
  palette: 'ocean' as PaletteName,
  direction: 'vertical',
  font: 'Standard'
};

const typedLogo = await render('TYPESCRIPT', options);
console.log(typedLogo);

// 访问调色板信息
console.log('可用调色板:', getPaletteNames());
console.log('日落颜色:', PALETTES.sunset);
```

### 参数

- **`<text>`**：要显示的文本
  - 使用 `"\n"` 换行：`"LINE1\nLINE2"`
  - 使用 `"-"` 从标准输入读取
- **`[palette]`**：调色板名称（默认：`grad-blue`）

### 选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-f, --font <name>` | Figlet 字体名称 | `Standard` |
| `-d, --direction <dir>` | 渐变方向（`vertical`、`horizontal`、`diagonal`） | `vertical` |
| `--filled` | 使用填充块字符代替轮廓 ASCII | `false` |
| `--block-font <font>` | 填充模式字体（`3d`、`block`、`chrome`、`grid`、`huge`、`pallet`、`shade`、`simple`、`simple3d`、`simpleBlock`、`slick`、`tiny`） | - |
| `--letter-spacing <n>` | 填充模式字间距（整数空格，0+） | `1` |
| `--reverse-gradient` | 反转渐变颜色 | `false` |
| `--palette-colors <colors>` | 自定义颜色（JSON 数组或逗号分隔列表） | - |
| `-l, --list-palettes` | 显示所有可用调色板 | - |
| `--gallery` | 使用所有可用调色板渲染文本 | - |
| `--color` | 强制彩色输出（用于管道） | - |
| `--no-color` | 禁用彩色输出 | - |
| `-v, --version` | 显示版本号 | - |
| `-h, --help` | 显示帮助信息 | - |

## 🎨 可用调色板（共 13 种）

查看所有调色板及预览颜色：

```bash
npx oh-my-logo "" --list-palettes
```

| 调色板 | 颜色 | 说明 |
|--------|------|------|
| `grad-blue` | `#4ea8ff → #7f88ff` | 蓝色渐变（默认） |
| `sunset` | `#ff9966 → #ff5e62 → #ffa34e` | 温暖日落色 |
| `dawn` | `#00c6ff → #0072ff` | 清凉晨蓝 |
| `nebula` | `#654ea3 → #eaafc8` | 紫色星空 |
| `ocean` | `#667eea → #764ba2` | 深海蓝 |
| `fire` | `#ff0844 → #ffb199` | 烈焰红 |
| `forest` | `#134e5e → #71b280` | 自然绿 |
| `gold` | `#f7971e → #ffd200` | 奢华金 |
| `purple` | `#667db6 → #0082c8 → #0078ff` | 皇家紫蓝 |
| `mint` | `#00d2ff → #3a7bd5` | 清新薄荷 |
| `coral` | `#ff9a9e → #fecfef` | 柔和珊瑚粉 |
| `matrix` | `#00ff41 → #008f11` | 经典矩阵绿 |
| `mono` | `#f07178 → #f07178` | 单色珊瑚 |

## 💡 示例

### 基本用法

```bash
# 使用默认蓝色渐变的简单 Logo
npx oh-my-logo "STARTUP"

# 多行公司 Logo
npx oh-my-logo "MY\nCOMPANY" sunset

# 矩阵风格黑客文本
npx oh-my-logo "HACK THE PLANET" matrix --filled
```

### 不同渲染模式

```bash
# 轮廓 ASCII 艺术（默认）
npx oh-my-logo "CODE" fire

# 填充块字符
npx oh-my-logo "CODE" fire --filled

# 使用不同阴影样式的填充模式
npx oh-my-logo "CODE" fire --filled --block-font chrome   # 极简阴影
npx oh-my-logo "CODE" fire --filled --block-font shade    # 点状阴影效果
npx oh-my-logo "CODE" fire --filled --block-font simpleBlock # 简单 ASCII 阴影
```

### 阴影样式（仅 --filled 模式）

使用 `--block-font` 自定义填充模式下的阴影字符：

#### 阴影样式视觉对比

**`block`（默认）** - 绘图阴影：
```
 ██╗  ██╗ ██╗
 ██║  ██║ ██║
 ███████║ ██║
 ██╔══██║ ██║
 ██║  ██║ ██║
 ╚═╝  ╚═╝ ╚═╝
```

**`chrome`** - 极简阴影：
```
 ╦ ╦ ╦
 ╠═╣ ║
 ╩ ╩ ╩
```

**`shade`** - 点状阴影效果：
```
░░░░░░░░░
░█░░█░███
░█░░█░ █
░████░░█
░█  █░░█
░█░░█░███
░ ░░ ░
░░░░░░░░░
```

**`simpleBlock`** - 基本 ASCII 阴影：
```
  _|    _|  _|_|_|
  _|    _|    _|
  _|_|_|_|    _|
  _|    _|    _|
  _|    _|  _|_|_|
```

```bash
# 尝试不同阴影样式
npx oh-my-logo "SHADOW" sunset --filled --block-font block
npx oh-my-logo "SHADOW" sunset --filled --block-font chrome
npx oh-my-logo "SHADOW" sunset --filled --block-font shade
npx oh-my-logo "SHADOW" sunset --filled --block-font simpleBlock
```

### 字间距控制

调整字符间距以获得不同的视觉密度：

```bash
# 默认间距（1 个空格）
npx oh-my-logo "HI" --filled
# 输出:  ██╗  ██╗

# 宽间距（3 个空格）
npx oh-my-logo "HI" --filled --letter-spacing 3
# 输出:  ██╗   ██╗

# 无间距（紧密相连）
npx oh-my-logo "HI" --filled --letter-spacing 0  
# 输出: ██╗██╗

# 注意：小数会被截断（3.7 变为 3）
npx oh-my-logo "HI" --filled --letter-spacing 3.7  # 使用 3 个空格
```

### 反转渐变效果

翻转任意调色板以获得独特视觉效果：

```bash
# 正常日落渐变（红 → 橙）
npx oh-my-logo "GRADIENT" sunset

# 反转日落渐变（橙 → 红）
npx oh-my-logo "GRADIENT" sunset --reverse-gradient

# 填充模式同样适用
npx oh-my-logo "GRADIENT" sunset --filled --reverse-gradient
```

### 渐变方向

```bash
# 垂直渐变（默认）
npx oh-my-logo "LOGO" ocean

# 水平渐变
npx oh-my-logo "LOGO" ocean -d horizontal

# 对角线渐变
npx oh-my-logo "LOGO" ocean -d diagonal
```

### 自定义字体

```bash
# 列出可用字体（取决于 figlet 安装）
figlet -f

# 使用不同字体
npx oh-my-logo "RETRO" purple -f "Big"
```

### 管道和脚本

```bash
# 从标准输入读取
echo "DYNAMIC LOGO" | npx oh-my-logo - gold --filled

# 在脚本中强制彩色输出
npx oh-my-logo "DEPLOY SUCCESS" forest --color

# 纯文本输出
npx oh-my-logo "LOG ENTRY" --no-color
```

### 画廊模式

```bash
# 使用所有可用调色板显示文本
npx oh-my-logo "PREVIEW" --gallery

# 使用填充字符的画廊
npx oh-my-logo "COLORS" --gallery --filled

# 在所有调色板中比较多行文本
npx oh-my-logo "MY\nLOGO" --gallery

# 使用自定义字体的画廊
npx oh-my-logo "STYLES" --gallery -f Big
```

## 🎭 使用场景

- **项目横幅**：为 README 文件添加醒目的标题
- **终端启动**：打开终端时显示公司 Logo
- **CI/CD 管道**：让部署日志更加美观
- **开发工具**：为 CLI 应用添加品牌标识
- **演示文稿**：创建炫酷的终端演示
- **个人品牌**：为 shell 提示符或脚本增添个性

## ⚙️ 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `OHMYLOGO_FONT` | 默认 Figlet 字体 | `export OHMYLOGO_FONT="Big"` |

## 📚 库 API

### 核心函数

#### `render(text, options?)`
使用渐变色渲染 ASCII 艺术。

```typescript
async function render(text: string, options?: RenderOptions): Promise<string>
```

- **text**（string）：要显示的文本
- **options.palette**（PaletteName | string[]）：调色板名称或自定义颜色
- **options.font**（string）：Figlet 字体名称（默认：'Standard'）
- **options.direction**（'vertical' | 'horizontal' | 'diagonal'）：渐变方向

返回：`Promise<string>` - 彩色 ASCII 艺术

#### `renderFilled(text, options?)`
使用渐变色渲染填充块字符。

```typescript
async function renderFilled(text: string, options?: RenderInkOptions): Promise<void>
```

- **text**（string）：要显示的文本
- **options.palette**（PaletteName | string[]）：调色板名称或自定义颜色
- **options.font**（BlockFont）：阴影样式（'block' | 'chrome' | 'shade' | 'simpleBlock' | '3d'）
- **options.letterSpacing**（number）：字符间的整数空格数（0 或更大，默认：1）

返回：`Promise<void>` - 直接渲染到标准输出

### 调色板函数

- **`PALETTES`**：包含所有内置调色板的对象
- **`resolvePalette(name)`**：通过名称获取调色板颜色
- **`getPaletteNames()`**：获取所有调色板名称数组
- **`getDefaultPalette()`**：获取默认调色板颜色
- **`getPalettePreview(name)`**：获取调色板颜色预览字符串

### 类型定义

```typescript
type PaletteName = 'grad-blue' | 'sunset' | 'dawn' | 'nebula' | 'ocean' | 
                   'fire' | 'forest' | 'gold' | 'purple' | 'mint' | 
                   'coral' | 'matrix' | 'mono';

interface RenderOptions {
  palette?: PaletteName | string[];
  font?: string;
  direction?: 'vertical' | 'horizontal' | 'diagonal';
}

type BlockFont = '3d' | 'block' | 'chrome' | 'console' | 'grid' | 
                 'huge' | 'pallet' | 'shade' | 'simple' | 'simple3d' | 
                 'simpleBlock' | 'slick' | 'tiny';

interface RenderInkOptions {
  palette?: PaletteName | string[];
  font?: BlockFont;
  letterSpacing?: number;
}
```

## 🛠️ 开发

想要贡献或自定义？

```bash
git clone https://github.com/yourusername/oh-my-logo.git
cd oh-my-logo
npm install

# 开发模式
npm run dev -- "TEST" sunset --filled

# 构建
npm run build

# 测试构建版本
node dist/index.js "HELLO" matrix --filled
```

### 🧪 测试

使用 Vitest 运行测试套件：

```bash
# 以监视模式运行所有测试
npm run test

# 运行一次测试（CI 模式）
npm run test:coverage
```

# 运行带 UI 的测试
npm run test:ui

# 运行特定测试文件
npm test -- src/__tests__/cli.test.ts
```

测试套件包括：
- 所有库函数的单元测试
- CLI 集成测试
- 调色板验证
- 错误处理场景
- TTY/颜色检测逻辑

测试位于 `src/__tests__/` 目录，结构如下：
- `cli.test.ts` - CLI 命令行行为
- `lib.test.ts` - 库 API 函数
- `palettes.test.ts` - 调色板系统
- `renderer.test.ts` - ASCII 艺术渲染
- `utils/` - 工具函数测试

### 测试终端稳定性

提供了一个测试脚本，用于验证 `--filled` 模式是否正确清理终端状态：

```bash
# 运行终端稳定性压力测试
./scripts/test-filled-mode.sh
```

此脚本：
- 运行 55 次连续渲染（5 次迭代 × 11 种字体）
- 使用随机调色板测试所有可用字体
- 验证大量使用后终端显示是否保持正常
- 帮助检测任何终端损坏问题

这对于以下情况特别有用：
- 修改 Ink 渲染器后进行测试
- 验证不同环境下的终端兼容性
- 对 `--filled` 模式实现进行压力测试

### 添加新调色板

编辑 `src/palettes.ts` 添加你自己的颜色组合：

```typescript
export const PALETTES = {
  // ... 现有调色板
  'my-palette': ['#ff0000', '#00ff00', '#0000ff'],
} as const;
```

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。无论是：

- 🎨 新调色板
- 🔧 Bug 修复
- ✨ 新功能
- 📖 文档改进

## 📄 许可证

MIT AND CC0-1.0

---

**为终端爱好者用心制作 ❤️**

*将你的无聊文本变成令人惊叹的视觉 Logo！*
