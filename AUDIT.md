# Cakeasy production audit

Audit date: 2026-07-17
Scope: repository `Neyush-04/Cakeasy` at `c1cacff` (`main`) and the public production site at `https://www.cakeasy.in`. No production data, Firebase rules, deployment, or application code was changed.

## Executive summary

Cakeasy is a Vite + React single-page application with Firebase Firestore used as both the public catalogue and an in-browser CMS. The production site serves the same application bundle produced by this commit (`assets/index-C52XMudf.js`), so source and production findings apply to the live site.

The project builds and type-checks successfully, its real logo and a useful archive of local cake photography are present, and the public routes render on desktop and at 390px wide without failed images or horizontal overflow. It is not safe to treat the site as a production ordering/CMS system yet: an admin passphrase is embedded in client code, Firebase Authentication is not used, and repository Firestore rules allow unauthenticated modification of administrative collections.

The first implementation phase should be security and truthfulness remediation, performed behind a feature branch and tested against a staging Firebase project before any public rollout.

## Current architecture

| Area | Finding |
| --- | --- |
| Framework/build | React 19, TypeScript, Vite 6, Tailwind 4, React Router 7, Motion, Lucide. |
| Package manager | npm; a committed `package-lock.json` is present. |
| Entry/routing | `src/main.tsx` mounts a `BrowserRouter`; `src/App.tsx` defines `/`, `/catalog`, `/custom`, `/gallery`, `/about`, `/contact`, and `/admin`. `vercel.json` rewrites all paths to `index.html`. |
| Hosting | Vercel SPA configuration is present. The site redirects from `cakeasy.in` to `www.cakeasy.in`; exact Vercel project ownership/settings cannot be verified from this repository. |
| Data | Firebase client SDK reads Firestore directly. Firebase config is in `firebase-applet-config.json`; there are no environment variables used by the browser app for Firebase. |
| Auth | Firebase Auth is initialized in `src/firebase.ts`, but there is no sign-in, sign-out, observer, or authorization/claims check in the app. |
| Static media | `public/gallery` contains 60 local photos across 30 numbered posts, `public/catalog` contains six product photos, and `src/assets/images` holds the newer logo and three images. |
| SEO | Static metadata, a `robots.txt`, sitemap, Bakery JSON-LD and a small client-side per-route title/description component exist. |

### Repository provenance and duplication

Git history indicates the initial Vite/AI Studio scaffold and Firebase-oriented implementation were created in early commits through `42f3e9d`. The commit `5dc0c95` is the likely start of the later real-content work; the gallery revisions, SEO/router additions, and actual logo are later commits. This is an inference from commit messages and file evolution, not authorship proof.

`Cakeasy-main/` is a complete, older duplicate application inside the repository. It lacks the newest top-level routing/SEO/logo changes and should not be deployed or edited as the source of truth. Retain it until its provenance is confirmed, then remove it in a separately reviewed cleanup change. `dist/` and `node_modules/` were generated only for local verification and are ignored by Git.

## What is working

- `npm.cmd run lint` passed (`tsc --noEmit`).
- `npm.cmd run build` passed. The only build warning is one 1.23 MB minified JavaScript chunk (332 KB gzip).
- Production currently serves that same built script hash, strongly confirming that `main` at `c1cacff` matches the public deployment.
- `/`, `/catalog`, `/gallery`, `/custom`, and `/contact` each render on production. At 390px wide, each audited route had no horizontal overflow and no failed image requests.
- The real Cakeasy logo is used in the live navbar/favicon; the local numbered gallery archive is available in the repository and should be preserved.
- Canonical URL, Open Graph/Twitter basics, Bakery JSON-LD, robots file, sitemap, descriptive product image alt text, lazy-loaded catalogue cards, and WhatsApp links are implemented.

## Critical security and data concerns

### S0 — public admin takeover and data alteration

`src/components/AdminLogin.tsx` implements a hard-coded, visibly hinted credential entirely in the browser; it only toggles React state. It is not authentication. Do not repeat or reuse that credential. Because the implementation ships to every visitor, it must be treated as compromised and removed/rotated before any real admin workflow is trusted.

The repository Firestore rules allow unauthenticated create/update/delete access for `products`, `settings`, `coupons`, and `instagram_posts`; `orders` are publicly readable and publicly creatable/updatable/deletable subject only to shallow field validation. A malicious visitor can alter catalogue content, contact details, pricing/configuration, gallery content and order status, or read all orders.

### S1 — client-side seeding and public order data

On ordinary page load, `src/App.tsx` seeds empty `products`, `orders`, `settings`, `coupons`, and `instagram_posts` collections. This means a visitor can populate what should be administrative data. It also writes three demo orders with customer names if `orders` is empty.

All order records are subscribed to by every visitor. This is a privacy issue even if production currently contains only sample data. Order IDs use a four-digit random suffix and the contact tracker is simulated, so neither is an authorization boundary.

### S1 — missing server trust boundary

Public order and custom-inquiry writes are direct Firestore writes, with no server-side validation, rate limit, CAPTCHA/turnstile, App Check enforcement, or anti-abuse controls. User-uploaded reference images are converted to browser state only; no Firebase Storage upload currently occurs. The contact form and order tracker are simulations rather than durable or secure workflows.

### Firestore operation map

| Collection | Public reads in current app | Writes in current app | Risk |
| --- | --- | --- | --- |
| `products` | `getDocs` | automatic seed; add; delete | catalogue can be altered or erased publicly |
| `orders` | real-time collection listener | automatic demo seed; cart/custom inquiry; status update | exposes all orders and permits tampering |
| `settings/atelier` | real-time document listener | automatic default seed; settings save | address, contact, pricing and CTA settings can be replaced |
| `coupons` | real-time collection listener | automatic demo seed; create; active toggle | public coupon manipulation |
| `instagram_posts` | real-time collection listener | automatic seed; like; comment; add; delete | content/engagement can be manipulated publicly |

### Secure target architecture (proposal; not implemented)

1. Use Firebase Authentication for a real named admin account and custom claim `admin: true`; use an auth-state listener and do not ship credentials in code.
2. Allow public read only for published catalogue/gallery documents with an explicit `published: true` field. Do not expose internal settings, coupons, unpublished records, or order lists.
3. Send public enquiries/orders to a callable Cloud Function or server route. Validate a minimal schema, create server-generated IDs/timestamps, enforce rate limiting/App Check, and store only the data required to contact the customer.
4. Restrict all catalogue, settings, coupons, Instagram and order-status writes to `request.auth.token.admin == true`; validate document shape and immutable fields in Firestore rules as defence in depth.
5. If reference uploads are retained, use Firebase Storage with authenticated/admin upload or a signed/server-mediated upload flow, strict file/type/size validation, malware review policy, and Storage rules. Do not rely on a data-URL in the client.
6. Enable Firebase App Check for Firestore/Functions/Storage, add server-side spam protection and observability, and use a separate staging Firebase project to test rule changes. Audit deployed rules with the Firebase console/CLI before changing them.

## Content and UX concerns

### Real assets to retain

- `src/assets/images/cakeasy_logo_full.png`, `cakeasy_logo_icon.png`, and `cakeasy_logo_mark.svg` are the current logo assets.
- `public/gallery/1` through `public/gallery/30` form a real image archive, including multiple angles for several posts.
- `public/catalog/product1.jpg` through `product6.jpg` are local catalogue assets.

### Placeholder, simulated, or unverified content

The following must be removed, replaced with business-approved wording, or clearly labelled as a future capability before launch:

- Animated homepage counts, star rating, category design/flavour counts, testimonials, named demo orders, sample coupon codes and invented engagement counts.
- Claims about same-day delivery, chilled/temperature-controlled transit, organic ingredients, allergen/cross-contamination safety, eggless/vegan capability, French/Paris training, premium branded ingredients, product quality processes, refunds, delivery coverage, and exact prices unless explicitly verified by the owner.
- Mumbai/Bandra wording in policy/footer conflicts with Greater Noida/Delhi NCR targeting.
- The Contact page order tracker returns the same simulated customer/order state for arbitrary IDs; the contact form only displays a temporary success state.
- Gallery says “Live Instagram” but uses Firestore/static entries; likes/comments are public Firestore mutations and a generated username.
- `src/utils.ts` deliberately maps some local images to Unsplash fallbacks, and the production homepage shows an Unsplash image. Replace this path with retained Cakeasy photography or a neutral local fallback.
- Mojibake text (for example malformed rupee/star/emoji characters) appears in source and production labels; normalise file encoding to UTF-8 in a dedicated content pass.

### UI/UX assessment

The visual foundations — warm pink, Playfair/Inter pairing, rounded cards, real logo and large photography — are appropriate for a premium but approachable bakery. The experience feels less authentic because it uses AI-template language, decorative movement, fabricated proof points and a complex simulated “SaaS dashboard” rather than clear imagery and ordering information.

- Hero: image-led but the hero image and “chef recommendation” content should be real/approved. Make one clear WhatsApp/custom-order CTA primary.
- Navigation: desktop/mobile render correctly, but mobile exposes only icon actions at the top; test the menu interaction manually after redesign and provide text/accessibility cues.
- Gallery: archive exists but is rendered as a social simulation, lacks chronological/category/year controls, and production showed only a subset of the archive from the current Firestore data.
- Ordering: cart/custom builder lead to WhatsApp, but screens imply a checkout/order-tracking system that does not exist. Set accurate expectations and collect essential enquiry information safely.
- Trust: use only owner-approved address, operating hours, policy, delivery terms and authentic testimonials/reviews. Avoid invented certifications, ratings and staff narratives.
- Accessibility: headings and many image alt texts are present; improve keyboard-visible states, semantic button/link choice, form error announcements, contrast testing, reduced-motion support and meaningful alt text for each real cake.

### Recommended gallery model

Preserve all existing images in a `galleryItems` data model with `id`, `date`, `year`, optional `category`, `caption`, `images`, `coverImage`, `published`, and optional `featured`. Initially import the 30 existing posts with their verified dates; do not infer cake category where it is unknown.

Render newest-first with a featured section, year/category filters, a “load more” control (12–18 cards per page), responsive `srcset`/WebP or AVIF derivatives, explicit width/height, `loading="lazy"` for below-fold media, and preloading only the hero/LCP image. This preserves the complete journey without forcing all archive images into the initial payload.

## SEO and performance concerns

### SEO

- The title/description, canonical, robots, sitemap and basic Bakery JSON-LD are a good baseline.
- The SPA updates only title/description after JavaScript runs. Canonical, Open Graph URL/image and structured data remain homepage-oriented on inner routes; server rendering/prerendering is the reliable next step for indexable route metadata.
- Verify business name, postal address, service area, phone, email, hours and social profile with the owner before retaining them in JSON-LD. Add `openingHoursSpecification` only when verified.
- The current sitemap has six routes and no individual cake/gallery detail URLs. Once real pages exist, generate it during build/deploy and include only indexable published content.
- Location targeting is inconsistent due to Mumbai/Bandra text; consolidate on verified Greater Noida/Noida/Delhi NCR wording.
- Remove the obsolete `keywords` meta tag reliance; put location and service language in real route content and helpful internal links.

### Performance

- The Vite build emits one 1.23 MB minified JavaScript bundle, triggering Vite’s 500 KB warning. Code-split route views/admin/dashboard and defer non-critical Motion code.
- Gallery images are generally modest files, but the three source images are 684–810 KB and the gallery has no responsive derivatives. Generate correctly sized WebP/AVIF variants before launch.
- Catalogue cards use lazy loading; gallery and homepage images generally do not. Add `loading`, `decoding`, intrinsic dimensions and responsive sources consistently.
- Google Fonts are CSS `@import`s, which delay fetching. Move to explicit `<link rel="preconnect">`/stylesheet links or self-host approved font subsets.
- Do not use Unsplash fallbacks for production Cakeasy content; they add external dependency and undermine authenticity.

## Exact implementation plan and likely files

Phase 0 should modify only the following areas, after the owner answers the questions below and deployed Firebase state is backed up/audited:

| Purpose | Likely files |
| --- | --- |
| Replace simulated auth/admin | `src/components/AdminLogin.tsx`, `src/App.tsx`, `src/firebase.ts`, new auth/admin guard module, Firebase console configuration |
| Secure data access | `firestore.rules`, new Cloud Functions/server route files, Firebase emulator tests, possibly `firebase.json` |
| Stop public seeding/simulated orders | `src/App.tsx`, `src/components/ContactView.tsx`, `src/components/CartSidebar.tsx`, `src/components/CustomBuilderView.tsx` |
| Remove unverified wording | `src/data.ts`, `src/components/HomeView.tsx`, `AboutView.tsx`, `Footer.tsx`, `ContactView.tsx`, `StatsStrip.tsx`, `src/utils.ts` |
| Correct metadata and local SEO | `index.html`, `src/components/PageMeta.tsx`, `public/sitemap.xml`, `public/robots.txt`, new route metadata/prerender configuration |
| Build gallery journey | `src/data.ts` or a new gallery repository, `GalleryView.tsx`, `HomeView.tsx`, image-derivative tooling/assets |
| Performance cleanup | `src/App.tsx`, routing imports, `src/index.css`, `vite.config.ts`, `package.json` |

## Questions requiring business input

1. Confirm the official business name, owner/founder name(s), verified phone/WhatsApp, email, full public address, service areas, hours, Instagram URL, and whether any Facebook page exists.
2. Which delivery, eggless, vegan, allergen, ingredient, lead-time, cancellation/refund and pricing claims are true and approved for public display? Please provide final wording rather than assumptions.
3. Do you want a real online payment/checkout system now, or should Phase 1 be a secure enquiry form that opens WhatsApp after successful submission?
4. Who should be able to administer the site, and can they use Google sign-in or email/password Firebase Authentication? Confirm the Firebase project/account that will own production and a separate staging project.
5. Which of the 30 gallery posts are real, which date/caption/category belongs to each, and may Cakeasy publish every image? Are testimonials/reviews available with permission, or should that section be removed?
6. Is the embedded Greater Noida address a customer-facing pickup location? Confirm whether it is safe to publish in structured data and the footer.
7. Is Vercel the current host, and who has access to its project, DNS and GoDaddy domain settings? Please provide access only through the approved deployment workflow; no deployment is required for this audit.

## Local verification commands

PowerShell execution policy blocks `npm.ps1` on this workstation, so use `npm.cmd`:

```powershell
git switch codex/site-audit
npm.cmd ci
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

Then open `http://localhost:3000`. To check the production build locally instead, run `npm.cmd run preview` after `npm.cmd run build` and open the URL Vite prints.

## Live-site risks

- Editing/deploying Firestore rules before replacing the current client-side access model can immediately break catalogue/gallery loads and public enquiry writes.
- Tightening rules without an authenticated admin migration locks the owner out of the current dashboard.
- Removing automatic seeds without a data migration can leave production collections blank.
- Changing `vercel.json` SPA rewrites can cause direct route 404s.
- Moving/deleting the numbered gallery assets can break existing gallery, Open Graph and SEO image URLs.
