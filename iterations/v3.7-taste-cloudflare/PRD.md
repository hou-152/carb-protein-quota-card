# v3.7 Taste Pass And Cloudflare PRD

## 背景

v3.6 已恢复冷黑工具基线，但界面仍偏荧光和游戏化，输入栏在桌面端也缺少稳定的工作台位置。用户要求使用 `Leonxlnx/taste-skill` 做审美优化，并把最新版本部署到 Cloudflare 和 GitHub。

## 设计读取

这是一个专业工具型单页应用，不是营销页。目标用户会反复填表、查结果、翻产品文档和问答库，所以视觉语言应保持低噪、可信、密度高，而不是做成作品集或落地页。

## 目标

- 保留冷黑工具基线，但降低过强荧光感。
- 提高表单、按钮、卡片和图表的层级一致性。
- 桌面端让输入面板保持 sticky，减少从上到下填表时的上下跳动。
- 移动端明确折叠多列布局，确认无横向溢出。
- 新增 Cloudflare Pages 部署脚本，并继续通过 GitHub Pages 发布。Cloudflare 项目名为 `housibo-carb-card`。

## 范围

- 修改 `src/styles/global.css` 的视觉 token、控件样式、卡片层级和响应式规则。
- 新增 `scripts/deploy-cloudflare.sh` 与 `npm run deploy:cloudflare`。
- 同步 `ARCHITECTURE.md` 的部署平台说明。

## 不做

- 不改查表、BMI、热量、有氧、代换、Q&A、Changelog 数据逻辑。
- 不引入新的 UI 框架或动画库。
- 不把该工具改成营销页、作品页或重型 dashboard。

## 验收

- `npm run typecheck` 通过。
- `npm run verify:data` 通过。
- `npm run build` 通过。
- 桌面首屏左侧输入栏 sticky，右侧结果区宽度更稳定。
- 390px 移动端 `scrollWidth` 等于 `clientWidth`。
- GitHub Pages 发布到最新构建。
- Cloudflare Pages 在完成 Wrangler 登录后可直接部署。
