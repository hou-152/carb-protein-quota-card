#!/usr/bin/env bash
# 一键把最新版部署到线上 CloudBase（碳水蛋白质配额卡）
# 用法：bash scripts/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."
CLI="npx --yes @cloudbase/cli@latest"
ENV_ID="fat-loss-tool-prod-0504-da3dc1df"

echo "▶ 1/4 校验数据与类型..."
npm run typecheck
npm run verify:data

echo "▶ 2/4 构建最新版产物 dist/ ..."
npm run build

echo "▶ 3/4 检查登录态..."
if ! $CLI env:list >/dev/null 2>&1; then
  echo "  未登录，启动浏览器扫码登录腾讯云（用减脂工具所在账号扫）..."
  $CLI login
fi

echo "▶ 4/4 部署到线上 $ENV_ID ..."
$CLI hosting deploy ./dist / -e "$ENV_ID"

echo ""
echo "✅ 部署完成。线上地址："
echo "   https://fat-loss-tool-prod-0504-da3dc1df-1428481707.tcloudbaseapp.com"
