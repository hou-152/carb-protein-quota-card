# v3.8 Mobile Redesign Plan

## Phase 01 - Mobile Structure

Status: completed

- Add mobile-first input grouping.
- Add mobile bottom navigation.
- Add mobile result summary and document select.

## Phase 02 - Visual QA

Status: completed

- Run typecheck, data verification, and production build.
- Capture 390px, 430px, and 768px screenshots.
- Verify no horizontal overflow.

Verification:

- `npm run verify` passed.
- Captured `/tmp/carb-v38-final3-390.png`, `/tmp/carb-v38-final3-430.png`, and `/tmp/carb-v38-final3-768.png`.
- Verified `scrollWidth` equals viewport width at 390px, 430px, and 768px.
- Verified the mobile training group opens without console errors.

## Phase 03 - Ship

Status: in_progress

- Commit and push to GitHub.
- Verify GitHub Pages.
- Deploy and verify Cloudflare Pages.
