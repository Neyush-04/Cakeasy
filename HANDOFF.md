# HANDOFF — Cakeasy

_Last updated: 2026-09-23 by Claude, rebuilt from the Codex chat history (Jul 17 – Jul 22, 2026). Update this file whenever you stop working._

## What this is
The **live** website for Cakeasy, a bespoke wedding & celebration cake studio run by founder/main baker **Neha Chaudhary**. Its story runs Lucknow (2021) → Delhi NCR → Greater Noida. Instagram: `@cakeasy99`. Treat changes as production-priority: the site is live.

## Where things live
- Local: `C:\Users\pixif\Documents\Cakeasy`
- GitHub: `Neyush-04/Cakeasy`, branch `main`. Pushes auto-deploy to Vercel (`cakeasy.vercel.app`).
- Print collateral: `output/` (`Cakeasy_Print_Collateral_Pack.zip` + PDFs)
- Audit + plan: `AUDIT.md`, `ROADMAP.md`

## Stack
Vite 6 + React 19 + React Router 7, Tailwind 4, `motion`, Firebase (Firestore), Vercel serverless function `api/instagram`.

## Commands
```
npm run dev     # vite on :3000
npm run lint    # tsc --noEmit
npm run build
```
(PowerShell may block `npm.ps1`. Use `npm.cmd` if so.)

## Brand & content rules (from Piyush)
- **Homepage hero must feature Neha herself.** She is the face of the brand.
- The original watercolor/floral Cakeasy logo is the source of truth (`src/assets/brand/`). Never redraw it.
- Top bar: all social icons, with **WhatsApp bold and prominent**. Orders, contact and custom-cake enquiries go to **WhatsApp** (there's no checkout).
- Categories: **Wedding & Milestone Cakes** (multi-tier wedding/engagement/anniversary; page headline "Bespoke Cakes for Engagements, Weddings & Anniversaries"), **Designer** (themes, single or multi-tier), **Bento** (small).
- Gallery tells the story from 2021. Multi-photo posts open like an Amazon product catalogue (thumbnail "poses"). Photos are shown uncropped.
- No fabricated reviews, stats, delivery/refund/eggless claims.
- Judge design as the bride, a parent buying a kid's designer cake, a wife surprising her husband, etc. It must feel luxury.

## Done
Security hardening (removed client-side admin credential, admin-claim-only Firestore writes, no public order list, no browser seeding), removed duplicate `Cakeasy-main/` app, baker-story homepage, story gallery, Instagram live sync with local fallback, custom cake **simulator** (build-up animation + reference upload → WhatsApp), `/weddings` and `/consultation` pages, luxury print collateral pack.

## Open / next
- **A real admin CMS** with Firebase Auth + admin claim. `/admin` is currently only a status page. See ROADMAP Phase 4.
- Instagram access token: rotate it and store it only in Vercel as `INSTAGRAM_ACCESS_TOKEN` (plus `INSTAGRAM_MEDIA_LIMIT=50`). Never `VITE_`-prefixed.
- ROADMAP phases 2–5 (archive metadata, durable enquiries, SEO/performance) are mostly still open.
- Git status is unverified since Jul 22. Run `git status` first.
