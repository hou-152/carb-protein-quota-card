# Phase 00 — Original Logic Recovery

**Status**: `completed`
**目标**: 找回原始增肌减脂工具的数据结构和逻辑关系，避免把它误做成普通查表卡。
**前置**: 用户指出当前方向偏离原设计。

## 验收判据

- 原始视频转写已进入项目作为证据。
- PRD 明确当前代码只是临时原型，不是最终 MVP。
- PRD 补上有氧补偿、训练时间点分餐、BMI 判断和原 Excel 表结构。
- 计划文件明确：已找到原始 Excel，但分餐比例仍不能凭空补。

## Tasks

- [x] 找到视频转写材料 (`content/source/original-video-transcript.txt`)
- [x] 建立原始逻辑审计文档 (`iterations/v1-launch/ORIGINAL_LOGIC_AUDIT.md`)
- [x] 更新 PRD，把 MVP 从“结果卡”修正为“饮食逻辑核心复原”
- [x] 更新 plan，把当前代码标记为临时原型
- [x] 找到原始 Excel / 完整表格数据

## Notes

已找到 `/Users/housibo/Downloads/【可任意分享】健身Excel超级套表（作者：B站好人松松）25年9月最新版.xlsx`。工作簿实际包含 30 张表，其中有氧热量消耗表可结构化复原；分餐区域主要是人工填表餐序，没有可直接提取的每餐比例公式，因此 v1 只复原餐序和原则，不自造比例。
