# 碳水蛋白质配额卡 · ARCHITECTURE

> 文件位置：项目根 `ARCHITECTURE.md`（长期文档，跨迭代共用）
> 配合 BRIEF.md + DESIGN.md + `iterations/v1-launch/PRD.md` 阅读。

## 1. 技术栈一句话

**碳水蛋白质配额卡用 Vite + React + TypeScript + 普通 CSS 搭建，作为纯前端 SSG / SPA 小工具，部署到 GitHub Pages、CloudBase 和 Cloudflare Pages。**

## 2. 决策原因

- BRIEF 要求稳定、轻量、可反复打开 → 纯前端静态站点足够。
- PRD 的核心逻辑是本地查表和结果卡 → 不需要后端、账号或数据库。
- DESIGN 要求工具感强、控件简单 → 普通 CSS 比引入大型 UI 库更可控。
- 原始数据必须逐格查询 → 数据应转成结构化 TypeScript object，而不是散落在组件里的 if else。

## 3. 核心技术栈

### Framework
- **名称**：Vite + React
- **渲染模式**：静态构建后的客户端应用
- **路由**：首版单页，无路由库

### Language
- **TypeScript**：开启 strict mode。
- **Node version**：Node 22 LTS 或当前机器稳定 LTS。
- **Package manager**：npm。

### UI 与图标
- **普通 React 组件**：Form、SegmentedControl、ResultCard、Notice。
- **lucide-react**：可选，用于少量语义图标。

### Styling
- 普通 CSS。
- 全局样式建议放在 `src/styles/global.css`。
- 设计 token 可手写为 CSS variables，不依赖 Tailwind。

## 4. 内容与数据

### 内容存储
- 原始数据证据：`content/data/quota-table-source.md`
- 结构化运行时数据：`src/data/quotaTable.ts`
- 文案常量：`src/data/copy.ts`

### 数据获取策略
全部本地 import，无网络请求。

### Schema

```ts
type Gender = "male" | "female";
type TrainingStatus = "strength" | "no-strength";
type Goal = "fat-loss" | "muscle-gain";

interface StrengthQuotaCell {
  trainingCarb: number;
  restCarb: number;
  protein: number;
}

interface NoStrengthQuotaCell {
  carb: number;
  protein: number;
}

type QuotaCell = StrengthQuotaCell | NoStrengthQuotaCell | null;

interface QuotaTable {
  gender: Gender;
  trainingStatus: TrainingStatus;
  goal: Goal;
  heights: number[];
  weights: number[];
  cells: Record<number, Record<number, QuotaCell>>;
}

interface QuotaResult {
  matchedHeight: number;
  matchedWeight: number;
  status: "available" | "out-of-range" | "unsupported";
  grams?: {
    trainingCarb?: number;
    restCarb?: number;
    carb?: number;
    protein: number;
  };
}
```

### 浏览器能力
- **Clipboard API**：用于“复制结果文本”。只复制纯文本，不生成图片。

## 5. 第三方服务

首版不接第三方服务。

| 类别 | 选择 | 用途 | 环境变量 |
|---|---|---|---|
| 分析 | 无 | 首版不追踪用户 | - |
| 后端 | 无 | 本地查表 | - |
| 图片 CDN | 无 | 不依赖远程图片 | - |

## 6. 部署

- **平台**：GitHub Pages、CloudBase、Cloudflare Pages。
- **GitHub 仓库名**：默认建议 `hou-152/carb-protein-quota-card`，最终以用户创建的仓库为准。
- **线上地址**：默认建议 `https://hou-152.github.io/carb-protein-quota-card/`，最终以 GitHub Pages 实际地址为准。
- **CI/CD**：GitHub Actions + Pages。
- **CloudBase**：`scripts/deploy.sh` 构建后上传 `dist/` 到腾讯云 CloudBase Hosting。
- **Cloudflare Pages**：`scripts/deploy-cloudflare.sh` 构建后用 `wrangler pages deploy dist --project-name housibo-carb-card --branch main` 直传到 Pages。
- **环境变量**：无。
- **个人主页接入**：部署成功并获得真实 URL 后，把项目加入 `/Users/housibo/Documents/个人主页/src/data/projects.ts`，不得提前填写虚构 GitHub 或 demo 链接。

## 7. 代码组织

```text
project/
├── BRIEF.md
├── DESIGN.md
├── ARCHITECTURE.md
├── AGENTS.md
├── CLAUDE.md
├── content/
│   └── data/
│       └── quota-table-source.md
├── iterations/
│   └── v1-launch/
│       ├── PRD.md
│       ├── CONTENT.md
│       └── .plan/
│           ├── plan.md
│           └── phases/
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── InputPanel.tsx
│   │   ├── ResultCard.tsx
│   │   ├── SegmentedControl.tsx
│   │   └── Notice.tsx
│   ├── data/
│   │   ├── quotaTable.ts
│   │   └── copy.ts
│   ├── lib/
│   │   ├── calculateQuota.ts
│   │   └── nearest.ts
│   └── styles/
│       └── global.css
└── package.json
```

**命名约定：**
- 组件：PascalCase。
- 工具函数：camelCase。
- 数据文件：camelCase。
- CSS class：kebab-case。

## 8. 性能预算

| 指标 | 目标 |
|---|---|
| LCP | < 1.8s |
| CLS | < 0.05 |
| JS initial bundle | < 120KB gzip |
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |

## 9. 安全与隐私

- 不收集个人身份信息。
- 身高体重只在浏览器内计算，不上传。
- 不设置 cookie。
- 复制功能只把结果摘要写入用户剪贴板，不读取剪贴板内容。
- 公开页面必须署名原作者 / 来源，并尊重原始开源协议；不得暗示配额表数据归本项目原创。
- 如果未来加入分享或保存功能，必须先更新本文件。

## 10. 可观测性

首版不接错误监控。构建期用 TypeScript、基础测试和浏览器预览验证。

## 11. 风险与替代方案

- **数据录入错误**：先从原始 markdown 机械转成 `quotaTable.ts`，再做抽样校验。
- **公共来源争议**：公开发布必须署名原作者 / 来源；若暂时没有准确协议链接，先保留明确来源说明和待补链接，不隐藏来源。
- **用户误解为医疗建议**：在顶部和结果卡附近保留生活化参考说明。

## 12. 开始写代码前的 checklist

- [ ] 初始化 Vite React TypeScript 项目。
- [ ] 把 `content/data/quota-table-source.md` 转为 `src/data/quotaTable.ts`。
- [ ] 写 `calculateQuota` 和最近档位匹配逻辑。
- [ ] 写复制结果文本函数，使用 Clipboard API，并提供失败降级提示。
- [ ] 完成桌面和移动端预览。
- [ ] 跑 `npm run build`。
- [ ] 部署到 GitHub Pages。
- [ ] 获得真实线上 URL 后，回到个人主页添加项目卡。
