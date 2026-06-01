# 碳水蛋白质配额卡 · AGENTS

> 这份文档是 Codex / Claude 进入本项目的入口。拿到项目目录后，请先读完这份文档再开始工作。

## 项目一句话

这是一个给健身新手使用的网页小工具，按性别、训练状态、目标、身高和体重，快速查出今天大概该吃多少碳水和蛋白质。

## 文档地图

### 长期文档

| 文档 | 内容 |
|---|---|
| [BRIEF.md](./BRIEF.md) | 项目长期纲领：用户、价值、本质边界 |
| [DESIGN.md](./DESIGN.md) | 视觉与 UX：清爽、可信、生活化工具 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 技术选型、目录结构、数据管理、部署原则 |
| [AGENTS.md](./AGENTS.md) | 本文件：AI 入口、阅读顺序、协作规则 |
| [CLAUDE.md](./CLAUDE.md) | 指向本文件的一行入口 |

### v1 迭代产物

| 文件 | 内容 |
|---|---|
| [iterations/v1-launch/PRD.md](./iterations/v1-launch/PRD.md) | v1 功能、页面结构、输入输出逻辑 |
| [iterations/v1-launch/CONTENT.md](./iterations/v1-launch/CONTENT.md) | v1 内容槽、文案和数据源索引 |
| [iterations/v1-launch/.plan/](./iterations/v1-launch/.plan/) | v1 phase 记录和实施管理入口 |

## 代码地图

| 问题 | 去哪里查 |
|---|---|
| 页面由哪些区块组成 | `src/App.tsx` |
| 输入控件 | `src/components/InputPanel.tsx` |
| 结果卡 | `src/components/ResultCard.tsx` |
| 配额表数据 | `src/data/quotaTable.ts` |
| 文案常量 | `src/data/copy.ts` |
| 查表和最近档位逻辑 | `src/lib/calculateQuota.ts` / `src/lib/nearest.ts` |
| 全局样式 | `src/styles/global.css` |
| 原始数据证据 | `content/data/quota-table-source.md` |

## 项目边界

### 永远会做

- 做生活化减脂 / 增肌配额查询。
- 用原始配额表逐格查值。
- 输出用户能理解、能截图、能当天执行的碳水和蛋白质克数。
- 明确展示不可用组合和非医疗建议边界。

### 永远不做

- 不做医疗诊断或个体化处方。
- 不做专业健美备赛系统。
- 不用公式拟合替代逐格查表。
- 不承诺减脂、增肌或健康结果。

## 技术栈

- 前端：Vite + React
- 语言：TypeScript
- 样式：普通 CSS
- 图标：lucide-react（可选）
- 数据：本地结构化 `src/data/quotaTable.ts`
- 部署：GitHub Pages

命令以 `package.json` 为准：

```bash
npm run dev
npm run build
```

## 协作规则

1. 先读本文件，再读 BRIEF、当前迭代 PRD、DESIGN、ARCHITECTURE 和 CONTENT。
2. 首版必须忠实查表，不允许用公式拟合补空值。
3. 公开发布必须署名原作者 / 来源，尊重原始开源协议；不得把配额表数据暗示为本项目原创。
4. 新功能走新迭代：创建 `iterations/vN-{slug}/PRD.md` 和对应 `.plan/`，不要改写 `iterations/v1-launch/PRD.md`。
5. 影响长期定位的改动同步 BRIEF；影响视觉系统的改动同步 DESIGN；影响技术栈或依赖的改动同步 ARCHITECTURE。
6. 复杂任务必须用 phase 管理，每个 phase 完成后停下来让用户验收。
7. 不要替用户 commit，除非用户明确要求。
8. “复制结果”是复制纯文本摘要，不是导出图片；图片保存依靠用户系统截图，除非另开迭代。
9. 部署到 GitHub Pages 后，才能把真实项目链接加入个人主页；不要提前填写虚构 GitHub 或 demo URL。
10. 当前代码是临时原型。继续开发前必须先读 `iterations/v1-launch/ORIGINAL_LOGIC_AUDIT.md`，恢复原工具的数据结构：有氧补偿、训练时间点分餐、BMI 判断、问答和训练表关系。
11. 如果缺少原始 Excel 或完整表格数据，不允许自造有氧热量消耗表和分餐比例。

## Spec Sync

判断是否需要同步 spec 时，问一句：下次 AI 看到这个项目时是否必须知道这件事？

- 是长期定位变化：更新 `BRIEF.md`
- 是视觉和体验变化：更新 `DESIGN.md`
- 是技术栈、依赖、目录变化：更新 `ARCHITECTURE.md`
- 是当前迭代范围变化：更新当前迭代的 `PRD.md`
- 是 v1 内容数据变化：更新 `iterations/v1-launch/CONTENT.md` 或 `src/data/*.ts`
- 是新功能：新建下一轮 `iterations/vN-{slug}/`

## 验证建议

每次代码改动后至少检查：

```bash
npm run build
```

涉及视觉时还要检查：

- 桌面端输入区和结果卡是否清楚。
- 手机端文字是否溢出或遮挡。
- 不可用组合是否显示明确提示。
- 结果卡是否适合截图保存。
- 页面是否仍符合 BRIEF 的生活化参考边界。
