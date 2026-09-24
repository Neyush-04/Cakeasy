# Google Search Console & Google Business Profile Playbook

For a local cake studio, **Google Maps + the Business Profile** usually brings
more enquiries than the website's ranking in regular search. Do both, in this
order. Time needed: about 1 hour, then 15 minutes a week.

---

## Part A. Google Search Console (one-time setup, ~15 minutes)

Search Console shows what people searched when Cakeasy appeared on Google, which
pages are indexed, and any problems.

### A1. Add and verify the site
1. Go to <https://search.google.com/search-console> signed in with the Cakeasy
   Google account (the owner's, not a freelancer's).
2. **Add property**. Two options:
   - **Domain** `cakeasy.in` (best: it covers www and non-www). Needs a DNS TXT
     record added where the domain is managed (ask the developer).
   - **URL prefix** `https://www.cakeasy.in/` (easiest). Choose **HTML tag** as
     the verification method and copy the tag.
3. For URL prefix: open **CMS › Marketing & tracking › Google Search Console**,
   paste the tag, **Save changes**, wait **3 minutes**, then click **Verify** in
   Search Console.
4. Keep the code in the CMS permanently. Removing it un-verifies the site.

### A2. Submit the sitemap
Search Console › **Sitemaps** › enter `sitemap.xml` › **Submit**. The status
should become *Success*. The sitemap updates itself; submit it only once.

### A3. Ask Google to look at the key pages
Search Console › **URL Inspection** › paste each address › **Request indexing**:

1. `https://www.cakeasy.in/`
2. `https://www.cakeasy.in/weddings`
3. `https://www.cakeasy.in/cakes/designer`
4. `https://www.cakeasy.in/consultation`
5. `https://www.cakeasy.in/gallery`

Request once per page. Repeating does not speed it up. Do the same after
publishing a big SEO change on a page.

### A4. Also add Bing (5 minutes)
<https://www.bing.com/webmasters> › **Import from Google Search Console**. Bing
also feeds several AI assistants. If asked for a tag, paste it in CMS › Marketing
& tracking › Bing Webmaster Tools.

### A5. What to check, and when

| When | Where | Look for |
| --- | --- | --- |
| Weekly (first month) | Pages › Indexing | Key pages *Indexed*. Anything under "Not indexed" with a reason other than *Page with redirect* or *Not found (404)* |
| Monthly | Performance › Search results › Queries | Searches that bring impressions. Do they match the page? Use them in titles, descriptions and captions |
| Monthly | Performance › Pages | Pages with many impressions but a low click rate: improve the SEO title and description in the CMS |
| When alerted | Email from Search Console | Any "issue detected": forward it to the developer |

"Not found (404)" for old or mistyped addresses is normal. If an old address
still gets clicks, add a **Redirect** in the CMS.

---

## Part B. Google Business Profile (the Maps listing)

### B1. Claim or create
1. <https://business.google.com> › search for "Cakeasy". If a listing exists,
   **claim** it; otherwise **add your business**.
2. **Business name**: exactly `Cakeasy`. Don't add keywords like "Cakeasy Best
   Wedding Cakes Noida". Google suspends listings for that.
3. **Category**: primary **Cake shop**. Add related secondary categories
   Google offers (for example *Wedding bakery*, *Bakery*, *Dessert shop*), only
   ones that are true.
4. **Location**:
   - If customers pick up cakes at the studio, show the address, exactly as in
     CMS › Studio settings.
   - If it's a home studio customers don't visit, **hide the address** and set a
     **service area** instead (for example Greater Noida, Greater Noida West,
     Noida). List only areas Neha actually delivers to or serves.
5. **Phone** `+91 88107 95004`, **website** `https://www.cakeasy.in/?utm_source=google&utm_medium=organic_local&utm_content=gbp`
   (build it in the CMS link builder so Maps visits are counted).
6. **Verify** by the method Google offers (video, phone, postcard).

### B2. Complete the profile (this directly affects ranking on Maps)
- **Description** (750 characters): who Neha is, bespoke wedding, designer and
  celebration cakes, the consultation process, the areas served. Facts only; no
  prices or promises Neha hasn't confirmed.
- **Hours**: real hours for replying and pickups. Use "Open with no main hours"
  only if that's the truth.
- **Photos**: logo, a cover photo, Neha at work (she's the face of the brand),
  and 20+ real cakes grouped by type. Add new cakes every week.
- **Products**: one entry per category (Wedding & Milestone Cakes, Designer
  Cakes, Bento Cakes, Cupcakes, Dessert Boxes) with a photo, a description and
  a link to the matching page, tagged with `utm_content=gbp_product`.
- **Booking/Chat**: turn on WhatsApp chat if available, and link
  **Appointments/Booking** to `/consultation` with a tag.
- **Q&A**: add 3–5 real questions customers ask (lead time, tasting, how to share
  inspiration) with Neha's actual answers.
- **Link it back**: paste the profile's share link into CMS › Studio settings ›
  Google Business Profile link. The site then tells Google they are the same business.

### B3. Weekly routine (15 minutes)
- 1 **Post** (a new cake, a wedding feature, a seasonal note) with a photo and a
  tagged link.
- 3–5 new **photos**.
- **Reply** to every review within 2 days.
- Answer any new Q&A.

### B4. Reviews: the honest way
Reviews are the strongest local signal, and the most policed.

**Do**
- After every delivered order, send the review link from Business Profile ›
  **Ask for reviews**, in the thank-you WhatsApp: "It was lovely making your
  cake! If you have a minute, a Google review helps a small studio like ours
  a lot: <link>".
- Ask everyone the same way, happy or not.
- Reply personally to each review. Handle complaints calmly and take details to
  WhatsApp.

**Never**
- Offer discounts, gifts or anything in exchange for reviews.
- Write reviews yourself or ask family and friends who weren't customers.
- Buy reviews, or "review swap" with other businesses.
- Copy reviews onto the website as star ratings or add rating schema. Google
  ignores self-published ratings for local businesses and may treat them as
  spam. With a customer's permission, a quoted testimonial on a page is fine.

### B5. Keep "NAP" identical everywhere
Name, address and phone must match, character for character, on: Google
Business Profile, CMS › Studio settings (the website footer, contact page and
schema), Instagram bio, WhatsApp Business, Facebook, Justdial or other
directories. Update the CMS first, then the others the same day.

---

## Part C. Publication log (copy into a Google Sheet)

| Date | Page / action | SEO title published | Request indexing done | Indexed? (date) | Notes |
| --- | --- | --- | --- | --- | --- |
| | `/` | | | | |
| | `/weddings` | | | | |
| | `/cakes/designer` | | | | |
| | `/consultation` | | | | |
| | `/gallery` | | | | |

Record the date of every significant SEO change. When results move, you'll know why.
