# Cakeasy — repository rules

Live production site for the Cakeasy cake studio. Keep changes safe, and run `npm.cmd run lint` + `npm.cmd run build` before pushing to `main` (it auto-deploys). Never commit tokens. Never invent reviews, stats or policies.

Read `HANDOFF.md` first. It has the project context, decisions, commands and open items.

## Working with two AI developers (Codex + Claude)

This repo is worked on by both Codex and Claude, switching when one tool's quota runs out.

- **Before you start:** read `HANDOFF.md` and run `git status` and `git log -5` to see where the other developer stopped.
- **Before you stop, or when Piyush says he's switching tools:** update `HANDOFF.md` (what changed, what's half-done, next steps), then commit. Commit work in progress too, with a `wip:` prefix.
- Never put secret values (API keys, tokens, passwords) in any tracked file, including `HANDOFF.md`. Name them only (e.g. `OPENAI_API_KEY`). The values live in `.env.local` and Vercel.

## How Piyush likes to work

- Test everything yourself before saying it's done: click through each flow as a QA lead, on desktop and mobile. Don't ask him to test manually.
- UI bar: premium, compact, and clean. No oversized text or boxes, no big non-functional banners, no hazy blur, no cheap-looking palettes. Motion should be smooth and purposeful (Lenis, IntersectionObserver, sticky, easing, lerp).
- Judge features as a real end user or persona would, not just from a spec.
- He usually approves commit + push to the main branch and the Vercel deploy. Say clearly what was committed, pushed and deployed.
- Keep replies short and plain. He's a senior BA/PO, not a full-time developer, so give exact steps when he has to do something himself.
