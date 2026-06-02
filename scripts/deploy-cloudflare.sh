#!/usr/bin/env bash
# 一键把最新版部署到 Cloudflare Pages（碳水蛋白质配额卡）
# 用法：bash scripts/deploy-cloudflare.sh
set -euo pipefail

cd "$(dirname "$0")/.."

CACHE_DIR="${CLOUDFLARE_WRANGLER_NPM_CACHE:-/tmp/codex-npm-cache-card}"
PROJECT_NAME="${CLOUDFLARE_PAGES_PROJECT:-housibo-carb-card}"
BRANCH_NAME="${CLOUDFLARE_PAGES_BRANCH:-main}"
WRANGLER="npx --cache \"$CACHE_DIR\" --yes wrangler@latest"

echo "▶ 1/4 校验数据与类型..."
npm run typecheck
npm run verify:data

echo "▶ 2/4 构建最新版产物 dist/ ..."
npm run build

echo "▶ 3/4 检查 Cloudflare 登录态..."
if ! eval "$WRANGLER whoami" >/dev/null 2>&1; then
  echo "  未登录 Cloudflare。请先运行："
  echo "  npx --cache \"$CACHE_DIR\" --yes wrangler@latest login"
  exit 1
fi

echo "▶ 4/4 部署到 Cloudflare Pages: $PROJECT_NAME / $BRANCH_NAME ..."
eval "$WRANGLER pages deploy dist --project-name \"$PROJECT_NAME\" --branch \"$BRANCH_NAME\""

echo ""
echo "✅ 部署完成。Cloudflare Pages 地址："
echo "   https://$PROJECT_NAME.pages.dev"
