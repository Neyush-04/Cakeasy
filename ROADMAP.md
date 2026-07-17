# Cakeasy roadmap

This roadmap is intentionally staged. Do not redesign, change deployed Firestore rules, migrate data, or deploy until Phase 0 has been reviewed and tested in an isolated staging environment.

## Phase 0: Critical fixes

Goal: make the current product safe and truthful without losing real Cakeasy content.

1. Back up and inventory the deployed Firestore collections, Firebase Authentication users/claims, Storage objects, Vercel settings and current domain/DNS ownership.
2. Remove the browser-embedded admin credential and simulated client-side admin gate. Implement Firebase Authentication plus an `admin` custom claim and server-side/admin-only authorization.
3. Replace public Firestore writes and automatic client seeding with a validated server/callable-function enquiry path. Keep only published public reads.
4. Stop exposing all orders publicly; replace public tracking with a privacy-preserving, authenticated or signed-token workflow, or remove it until it is real.
5. Remove/demo-disable fabricated orders, coupons, ratings, testimonials, counts, policies and operational claims. Preserve the real logo and all real image assets.
6. Audit deployed Firestore and Storage rules against the actual schema before proposing any rule change. Add emulator tests, App Check, anti-spam/rate limiting and audit logging.

Exit criteria: no credentials in client code; no public administrative write; no public order-list read; no unverified public claim; staging rule tests and a full regression suite pass.

## Phase 1: Visual and UX foundation

Goal: establish an image-led, premium and authentic bakery experience.

1. Define approved brand voice, palette, type scale, spacing and component states from the logo and real Cakeasy photography.
2. Simplify the hero around a verified value proposition, real lead image and clear WhatsApp/custom-enquiry CTA.
3. Rework navigation, footer and mobile interaction with accessible labels, focus states and reduced-motion support.
4. Replace AI-template cards/ornamentation with a calm editorial layout where cake images carry the story.
5. Create truthful trust blocks: business location/service area, ordering process and verified policies only.

Exit criteria: owner-approved copy/assets; usable mobile flow; keyboard and contrast review complete; no fabricated proof points.

## Phase 2: Complete Cakeasy journey/gallery

Goal: make the full history discoverable without removing older work.

1. Create a normalized archive record for every existing gallery post and image, preserving original files and dates.
2. Add optional owner-supplied year/category/caption/featured/published metadata; do not infer unknown details.
3. Build featured, chronological, year/category filter and load-more browsing with accessible photo detail views.
4. Generate image derivatives, sizes and lazy-loading behavior; reserve intrinsic layout space to prevent shifts.
5. Feature selected cakes in homepage/category pages while linking to the full chronological archive.

Exit criteria: all approved existing images are visible or intentionally unpublished, filters work, page remains fast on mobile, and no image URLs were broken.

## Phase 3: Ordering and enquiry experience

Goal: turn interest into secure, low-friction qualified leads.

1. Decide on WhatsApp-first enquiry versus real checkout/payment; implement only the approved model.
2. Replace simulated cart/tracker/contact states with a secure enquiry form, clear consent notice, server validation and an owner notification workflow.
3. Capture only necessary details: name, contact method, celebration date, service area, cake type, servings/budget, reference upload if approved, and notes.
4. Provide honest lead-time/delivery/pickup messaging and WhatsApp handoff with a generated enquiry reference.
5. Add validation, rate limits, error states, retry guidance and accessible confirmation states.

Exit criteria: every submitted enquiry is durable, privately visible to the owner, resilient to spam, and accurately reflected in the UI.

## Phase 4: Admin/CMS and security

Goal: give authorized staff a maintainable back office without exposing data.

1. Implement admin-only catalogue, gallery, settings and enquiry/status management using authenticated routes and server-enforced authorization.
2. Define a stable data schema, migration/backup process, audit trail and role model.
3. Apply Firestore/Storage rules only after emulator tests cover every allowed and denied operation.
4. Add staging/production separation, App Check, monitoring, error reporting and recovery documentation.
5. Remove obsolete duplicate project files/dependencies only after verifying deployment uses the top-level app.

Exit criteria: least-privilege access, tests for authorization rules, backup/restore procedure and documented owner hand-off.

## Phase 5: SEO, performance and launch readiness

Goal: make the truthful, secure site fast and locally discoverable.

1. Use server-rendering or prerendering for public routes and correct per-page title, description, canonical, Open Graph and structured data.
2. Generate sitemap from approved public pages/gallery items; validate robots, canonical redirects and Search Console indexing.
3. Optimize LCP image, responsive image delivery, font loading, route-level code splitting and third-party requests.
4. Validate Core Web Vitals on mobile networks, accessibility, form/WhatsApp flows, structured data and analytics/consent requirements.
5. Run a launch checklist and a rollback rehearsal before production deployment.

Exit criteria: accepted Lighthouse/Core Web Vitals targets, validated structured data and sitemap, full mobile/desktop regression, security sign-off and a tested rollback plan.
