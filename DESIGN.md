---
name: "碳水蛋白质配额卡"
description: "清爽、可信、生活化的饮食配额工具，不像医疗系统，也不像健身营销页。"

colors:
  primary: "#126A5A"
  secondary: "#E35D35"
  tertiary: "#F2B84B"
  neutral: "#F7F3EA"
  surface: "#FFFFFF"
  on-primary: "#FFFFFF"
  on-neutral: "#20231F"
  muted: "#6C7169"
  success: "#2F8F5B"
  warning: "#B7791F"
  error: "#B42318"

typography:
  h1:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "2.75rem"
    fontWeight: 750
    lineHeight: "1.08"
  h2:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.65rem"
    fontWeight: 720
    lineHeight: "1.2"
  h3:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: "1.25"
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.6"
  caption:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.45"

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px

rounded:
  none: 0
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px

elevation:
  none: "none"
  sm: "0 1px 2px rgba(32,35,31,0.06)"
  md: "0 16px 40px rgba(32,35,31,0.10)"
---

## Overview

整体气质是“厨房台面上的精确小工具”：清楚、直接、可信，但不冰冷。页面应该让用户感觉这是一个能马上用的配额计算器，而不是营销落地页、健身课程转化页或医疗诊断面板。

**预设：** Light Utility + Result Card

**气质关键词：** 清爽、可执行、可信、生活化、有一点训练感

## Colors

- **Primary `#126A5A`** —— 核心按钮、结果卡标题、关键数字的稳定主色。
- **Secondary `#E35D35`** —— 少量用于强调行动、目标和提示，不大面积铺满。
- **Tertiary `#F2B84B`** —— 用于营养、能量、训练日的辅助提醒。
- **Neutral `#F7F3EA`** —— 页面背景，带一点生活感，避免纯医疗白。
- **Surface `#FFFFFF`** —— 表单区、结果卡、解释模块表面。
- **On-neutral `#20231F`** —— 主文本。
- **Muted `#6C7169`** —— 说明、来源、边界提示。
- **Success / Warning / Error** —— 分别用于可用结果、空值 / 不可用组合、错误状态。

## Typography

使用系统字体，保证中文、数字和单位都清晰。数字结果要比说明文案更醒目，但不做夸张大字报。H1 可有冲击力，表单和结果卡内部字号要克制，优先可读和不换行溢出。

## Layout

**Spacing scale:** 4px 基础，主要使用 8 / 16 / 24 / 32。

**Common layouts:**
- 首页：顶部简短说明 + 双列工作台；左侧输入，右侧结果。移动端改为上下排列。
- 结果卡：固定信息层级，先显示总克数，再显示匹配档位和解释。
- 解释区：用紧凑列表，不写长篇科普。

**Breakpoints:** mobile-first；桌面在 960px 以上启用双列。

## Elevation & Depth

**Level:** soft。只给主工作台和结果卡轻微阴影，其他解释区用边框或背景区分。不要做多层嵌套卡片。

## Shapes

**Overall sharpness:** 8px 为主，结果卡可用 12px。输入控件、按钮、卡片都要稳定，不因内容变化导致布局跳动。

**Border philosophy:** 1px hairline，颜色接近 `rgba(32,35,31,0.12)`。不要粗边框，不要装饰性波浪线。

**Visual density:** 标准偏紧凑。用户打开页面是为了得到数字，不是阅读长文。

## Components

### Input Group
每个输入组要有明确 label，控件使用 segmented control、select 或 number input。性别、训练状态、目标适合 segmented control；身高和体重适合 select + number input。

### Result Card
结果卡是页面主角。必须显示：
- 当前匹配档位
- 碳水结果
- 蛋白质结果
- 训练日 / 休息日差异或每日说明
- 不可用状态的清楚提示

### Notice
用于非医疗建议、数据来源、不可用组合。语气要平实，不吓人，不免责声明堆砌。

### Button
首版可以用“生成配额”按钮，也可以在输入变化时自动刷新。按钮文字不超过 6 个中文字符。

## Do's and Don'ts

### Do's
- 使用真实数字、单位和档位，让用户能立刻截图。
- 明确写出“按表格逐格查询”。
- 对不可用组合给出温和但明确的解释。
- 移动端优先，所有结果文字不得溢出。
- 让来源和边界说明可见，但不要压过工具本身。

### Don'ts
- 不要使用医学蓝、医院式表格或恐吓式健康文案。
- 不要做健身房海报式肌肉视觉。
- 不要让页面变成课程售卖页。
- 不要把 `-` 单元格猜成附近可用值。
- 不要用大面积单一绿色或橙色铺满页面。

## Motion & Animation

**Level:** 微动效。

**Typical scenes:**
- Button hover：150ms 背景色或边框过渡。
- Result update：数字可以轻微 fade，但不能跳动。
- Page transition：单页无路由切换。

**Constraints:** 支持 `prefers-reduced-motion`，开启时关闭 transform 和渐变动画。

## Responsiveness

**Approach:** mobile-first。

**Mobile simplifications:**
- 双列工作台改为单列。
- 结果卡紧跟输入区。
- 顶部说明压缩为标题 + 一句话 + 小提示。
- 解释区折叠或放在结果卡后方，避免首屏过长。

## Accessibility

**WCAG target:** AA。

**Keyboard navigation:** 所有输入控件和按钮可键盘操作。

**Screen reader:** 表单 label 与控件绑定，结果更新区域使用 `aria-live="polite"`。

**Other:** 不仅用颜色表达错误或不可用状态，必须有文字。

## UI Framework Considerations

首版不需要重量级组件库。使用 React + TypeScript + 普通 CSS 即可。图标可使用 `lucide-react`，但不能为了装饰堆图标。

## References & Inspiration

**User-provided source:** `content/data/quota-table-source.md`，来自用户提供的旧配额表录入文件。

