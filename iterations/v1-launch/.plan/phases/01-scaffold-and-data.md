# Phase 01 — Scaffold And Data

**Status**: `in progress`
**目标**: 初始化前端项目，并把原始配额表整理成可查询、可测试的结构化数据。
**前置**: spec 初稿已完成。

## 验收判据

- Vite + React + TypeScript 项目可启动。
- `content/data/quota-table-source.md` 已保留为原始数据证据。
- `src/data/quotaTable.ts` 覆盖 PRD 中列出的 6 张表。
- 至少抽样校验 6 个单元格，和原始 markdown 一致。
- `npm run build` 通过。

## Tasks

- [~] 初始化 Vite React TypeScript 项目。
- [ ] 创建基础目录：`src/components`、`src/data`、`src/lib`、`src/styles`。
- [ ] 把原始 markdown 数据转成 `quotaTable.ts`。
- [ ] 编写最小查表函数和抽样校验。
- [ ] 跑构建验证。

## Notes

不要手写大量 if else。数据结构应能按 `gender + trainingStatus + goal + height + weight` 查询。
