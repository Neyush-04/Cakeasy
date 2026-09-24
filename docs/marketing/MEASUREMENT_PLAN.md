# Cakeasy Measurement Plan

What is measured, where, and how to read it without fooling ourselves.

## 1. Sources of truth

| Question | Source of truth | Why |
| --- | --- | --- |
| How many enquiries, and from where? | **CMS › Enquiries** (+ CSV) | Every saved enquiry is recorded, cookies or not |
| How many became orders? | **CMS › Enquiries status** (confirmed / completed) | Updated by Neha |
| How do people find us on Google Search? | **Search Console** | Impressions, clicks and queries |
| How do people find us on Google Maps? | **Business Profile › Performance** | Calls, chats, website clicks, directions |
| What do visitors do on the site? | **GA4** | Consenting visitors only, so always an undercount |
| Did Instagram/Facebook ads produce leads? | **Meta Events Manager / Ads Manager** | `Lead` events from consenting visitors |

If GA4 or Meta show fewer leads than the CMS, that's normal: some visitors
decline cookies or use ad blockers. The CMS count is the real one.

## 2. Events the website sends

The website sends these on its own. Don't recreate them with other tools.

| Event (GA4) | Meta Pixel | When | Parameters |
| --- | --- | --- | --- |
| `page_view` | `PageView` | Every page opened (including in-app navigation) | `page_path`, `page_title` |
| `whatsapp_click` | `Contact` | Any WhatsApp button, and after each enquiry form | `placement`: `top-bar`, `floating-button`, `footer`, `footer-studio`, `home`, `category`, `about`, `form:<type>` |
| `generate_lead` | `Lead` | **Only** when an enquiry is saved in the CMS | `form_id`: `consultation`, `custom-cake`, `contact`, `cart` |

The same events go into `window.dataLayer` as `page_view`, `whatsapp_click`
and `lead_submission_success`, ready for Google Tag Manager if one is ever
added. **Don't add GTM while the CMS IDs are in use**; it would double-count.

A saved enquiry fires both `generate_lead` and `whatsapp_click (form:…)`. The
first is the conversion; the second only shows that WhatsApp opened.

Nothing fires inside `/admin`. Nothing loads until the visitor accepts cookies:
analytics consent enables GA4, advertising consent enables the Pixel.

## 3. GA4 setup (once, ~20 minutes)

1. <https://analytics.google.com> › Admin › **Create property** "Cakeasy",
   time zone India, currency INR.
2. **Data stream › Web** › `https://www.cakeasy.in`, stream name "Website".
3. In the stream › **Enhanced measurement** › ⚙ › **Page views** › Show advanced
   settings › **untick "Page changes based on browser history events"**. The
   website already sends a page_view on every page change; leaving this ticked
   would double-count.
4. Copy the **Measurement ID** (`G-…`) into CMS › Marketing & tracking › Save.
5. After 3 minutes, open the site in a private window, **Accept** cookies,
   browse two pages, then check GA4 › Reports › **Realtime**.
6. Admin › **Events** › when `generate_lead` appears (after the first real or
   test enquiry), switch on **Mark as key event**.
7. Admin › **Custom definitions** › create event-scoped dimensions `form_id`
   and `placement`.
8. Admin › **Data retention** › 14 months.
9. Optional: Admin › Product links › **Search Console** to see search data in GA4.

## 4. Meta Pixel setup (before any Instagram/Facebook ads)

1. Meta Business Suite › **Events Manager** › Connect data sources › Web ›
   create a Pixel "Cakeasy website". Choose **manual install**, but don't paste
   code anywhere; only copy the **Pixel ID**.
2. CMS › Marketing & tracking › **Meta Pixel ID** › Save.
3. Business Suite › Brand safety › **Domains** › add `cakeasy.in` › Meta-tag
   method › paste the tag into CMS › **Meta domain verification** › Save, wait
   3 minutes › **Verify**.
4. Events Manager › **Test events** › open the site, accept cookies, send a test
   consultation. You should see one `PageView` per page, one `Contact` and one `Lead`.
5. When creating ads, optimise for **Leads**, using the `Lead` event. Then mark
   the test enquiry as spam in the CMS.

## 5. Monthly report (30 minutes, first week of each month)

Copy this table into a Google Sheet, one tab per month.

| Metric | Where | This month | Last month |
| --- | --- | --- | --- |
| Enquiries (total) | CMS › Enquiries (filter by date in the CSV) | | |
| … by source (instagram, whatsapp, google organic_local, direct…) | CSV pivot by *Source* | | |
| Confirmed + completed orders | CSV pivot by *Status* | | |
| Enquiry → order rate | orders ÷ enquiries | | |
| Median reply time (optional) | WhatsApp | | |
| Google Search clicks / impressions | Search Console › Performance | | |
| Top 5 queries | Search Console › Queries | | |
| Maps: calls, chats, website clicks, direction requests | Business Profile › Performance | | |
| New Google reviews (count, average) | Business Profile | | |
| Site visitors (consented) | GA4 › Reports › Acquisition | | |
| Ad spend, leads, cost per enquiry | Meta Ads Manager (if ads ran) | | |

**Then write three lines:** what worked, what didn't, and one thing to try next
month (for example, "Wedding page has many impressions but few clicks → rewrite
its SEO title").

## 6. Reading the numbers honestly

- Judge a channel by **confirmed orders**, not likes, views or clicks.
- Small numbers swing a lot. Don't change strategy because of one quiet week.
- A new or edited page takes **2–8 weeks** to settle in Google. Record the
  change date (see the playbook log) before judging it.
- Many impressions but a low click rate → improve the title and description.
  Clicks but no enquiries → improve the page, the photos or the call to action.
  Enquiries but few orders → look at pricing, reply speed and follow-up, not the website.
- Never publish performance claims ("#1 cake shop", "1000+ cakes") from these numbers.

## 7. Data and privacy

- Enquiries hold personal data. Only **Owner** accounts can see them; keep it that way.
- Delete an enquiry when a customer asks (CMS › Enquiries › Delete). The action
  is recorded in the Activity log.
- CSV exports: keep them in a private folder and delete them after use.
- Campaign tags must never contain personal information.
