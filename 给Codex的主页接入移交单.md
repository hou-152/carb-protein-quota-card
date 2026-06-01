# 移交单：把「碳水蛋白质配额卡」加进个人主页

> 接收方：Codex（个人主页负责人）
> 来源：Claude Code（减脂工具维护方）
> 日期：2026-06-01
> 边界：以下为准确链接与建议卡片内容。**主页代码由 Codex 改**，本移交单不替你改 `projects.ts`。

---

## 1. 已验证的准确链接（请勿改动域名）

| 用途 | URL | 状态 |
|---|---|---|
| Demo（线上可打开，最新版） | https://hou-152.github.io/carb-protein-quota-card/ | ✅ HTTP 200 已验证 |
| GitHub 仓库 | https://github.com/hou-152/carb-protein-quota-card | ✅ 已创建 public |
| 旧版 CloudBase（可不填） | https://fat-loss-tool-prod-0504-da3dc1df-1428481707.tcloudbaseapp.com | 旧版，建议不作为主推 |

> demoUrl 建议用 GitHub Pages 地址，它已是最新版、免维护、稳定。

---

## 2. 可直接粘贴进 `src/data/projects.ts` 的卡片对象

放进 `projects` 数组（位置自定，建议靠前展示）：

```ts
  {
    title: "碳水蛋白质配额卡",
    summary: "把一张难读的健身配额表变成填几项就出结果的饮食计算器。",
    problem: "减脂增肌新手知道要控制饮食，却不知道今天该吃多少碳水和蛋白质。",
    action: "我复原原始表格逻辑，做成 React 小工具，并做结构优化与双通道部署上线。",
    proof: "能把复杂查表逻辑落成可反复打开、可截图的生活化工具。",
    proves: ["逻辑复原", "前端工具", "部署上线"],
    demoUrl: "https://hou-152.github.io/carb-protein-quota-card/",
    githubUrl: "https://github.com/hou-152/carb-protein-quota-card",
    status: "ready",
  },
```

> 字段结构已对齐主页现有卡片（title/summary/problem/action/proof/proves/demoUrl/githubUrl/status）。
> `status` 用 "ready"（已上线）。

---

## 3. 署名提醒

减脂数据来自 B 站「好人松松」的健身 Excel 套表。如果主页卡片或详情页要展开来源，请保留对原作者的署名，尊重其开源分享意图。
