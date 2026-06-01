# 完成碳水蛋白质配额卡 v1-launch

> 文件位置：`iterations/v1-launch/.plan/plan.md`
> 配套 skill：first-flight-phases

## 背景

用户之前已有一份逐格录入的碳水 / 蛋白质配额表，适合开发成一个网页工具。现在要把它变式为独立小工具，而不是并入个人主页。核心目标是让新手快速得到当天可执行的碳水和蛋白质克数。

## 范围

**做：**

- 初始化 Vite + React + TypeScript 静态网页工具。
- 把旧配额表转成结构化数据。
- 以原始视频转写和原 Excel 结构为准，复原饮食逻辑核心。
- 实现输入表单、查表逻辑、BMI 提示、有氧补偿、分餐模块和边界提示。
- 实现复制结果文本按钮。
- 完成移动端与桌面端视觉检查。
- 部署到 GitHub Pages，并在个人主页添加真实项目入口。

**不做：**

- 不做账号、历史记录、云同步。
- 不做食谱生成或食物库。
- 不做医疗建议、体脂诊断或专业备赛功能。
- 不接 Apple Health、后端或第三方分析。
- 不做图片导出；用户可用系统截图保存结果卡。
- 不在缺少原始 Excel 表格时凭空补有氧消耗表和分餐比例表。

## 阶段总览

| #  | 阶段 slug | 一句话目标 | 状态 |
|----|---|---|---|
| 00 | original-logic-recovery | 找回原工具结构，修正 MVP 定义 | completed |
| 01 | scaffold-and-data | 初始化项目并把完整表格数据转成可测试数据 | in progress |
| 02 | calculator-ui | 实现输入区、查表逻辑、有氧补偿和分餐模块 | in progress |
| 03 | polish-and-verify | 完成视觉打磨、移动端检查和构建验证 | not started |
| 04 | deploy-and-homepage | 部署到 GitHub Pages，并把真实链接加入个人主页 | not started |

## 关键决策

- **2026-06-01**：作为独立小工具处理，不并入个人主页，避免未验证想法污染个人展示站。
- **2026-06-01**：选择 Vite + React + TypeScript + 普通 CSS，因为首版是纯前端查表工具，不需要后端。
- **2026-06-01**：保留旧 markdown 为 `content/data/quota-table-source.md`，结构化数据另放 `src/data/quotaTable.ts`。
- **2026-06-01**：公开发布必须署名原作者 / 来源，尊重原始开源协议。
- **2026-06-01**：“复制结果”定义为复制纯文本摘要，不做图片导出。
- **2026-06-01**：项目必须部署到 GitHub Pages，并在个人主页添加项目卡；个人主页只能使用真实仓库和真实线上 URL。
- **2026-06-01**：用户纠偏：原设计不是简单查表卡，必须参考原本的表结构、数据关系、有氧补偿和分餐逻辑。当前代码降级为临时原型。
- **2026-06-01**：已找到 25 年 9 月版原始 Excel，共 30 张表；v1 改为复原 BMI、热量设计、有氧消耗 / 置换和训练时间点餐序。分餐比例没有在工作簿中以公式形式出现，不能自造。

## Open Questions

- [ ] 原始项目 / 视频 / 开源协议的准确链接 — 预期在 phase 03 前确认。
- [x] 原始 Excel 或完整表格数据 — 已找到 `/Users/housibo/Downloads/【可任意分享】健身Excel超级套表（作者：B站好人松松）25年9月最新版.xlsx`。
- [ ] GitHub 仓库名，默认 `carb-protein-quota-card` — 预期在 phase 04 前确认。
- [ ] 个人主页项目卡排序和文案 — 预期在 phase 04 解决。

## 关联

- 长期文档（项目根）：[BRIEF.md](../../../BRIEF.md) / [DESIGN.md](../../../DESIGN.md) / [ARCHITECTURE.md](../../../ARCHITECTURE.md) / [AGENTS.md](../../../AGENTS.md)
- 当前迭代 PRD：[PRD.md](../PRD.md)
- 首版 CONTENT：[CONTENT.md](../CONTENT.md)
