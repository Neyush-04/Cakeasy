# Campaign Links (UTM) Guide

A tagged link tells the CMS and GA4 where an enquiry came from. Without tags,
most Instagram and WhatsApp traffic shows up as "Direct" and you can't tell what
worked.

```
https://www.cakeasy.in/weddings?utm_source=instagram&utm_medium=social&utm_campaign=wedding_season_2026&utm_content=story
                        └ page   └ where           └ type of channel   └ which push               └ which placement
```

**Build them in CMS › Marketing & tracking › Campaign link builder.** Don't type
them by hand. The builder keeps the names consistent.

## Standard names (use exactly these)

| Where it's shared | utm_source | utm_medium | utm_content |
| --- | --- | --- | --- |
| Instagram bio | instagram | social | bio |
| Instagram story / reel sticker | instagram | social | story |
| Instagram paid ad | instagram | paid_social | *ad name* |
| Facebook paid ad | facebook | paid_social | *ad name* |
| WhatsApp status / broadcast | whatsapp | social | status |
| Google Business Profile (website button, posts, products) | google | organic_local | gbp, gbp_post, gbp_product |
| Google Ads | google | cpc | *(set automatically by auto-tagging / gclid)* |
| Printed card, box sticker, QR code | print | qr | card, box, banner |
| Wedding planner / venue / partner | partner | referral | *partner name, e.g. `planner_riya`* |
| Email (if used) | email | email | *email name* |

**utm_campaign** is the push itself. Use lowercase with underscores, and a season
or year: `wedding_season_2026`, `diwali_2026`, `valentines_2027`,
`bento_launch`. The builder converts "Wedding season 2026" to
`wedding_season_2026` for you.

## Rules
- Lowercase only. `Instagram` and `instagram` count as two different sources.
- Never put a customer's name, phone number or email in a link.
- Tag links you share **outside** the website only. Never tag links between the
  website's own pages; that would overwrite the real source.
- Don't tag the link in Google Search results; SEO is measured in Search Console.

## Short links and QR codes
For anything printed or spoken, create a **short link** in the builder:

| Short link | Points to (example) | Use |
| --- | --- | --- |
| `cakeasy.in/insta` | `/consultation?utm_source=instagram&utm_medium=social&utm_content=bio` | Instagram bio |
| `cakeasy.in/card` | `/consultation?utm_source=print&utm_medium=qr&utm_content=card` | Visiting card / box sticker QR |
| `cakeasy.in/wedding` | `/weddings?utm_source=print&utm_medium=qr&utm_content=wedding_brochure` | Wedding brochure |

Short links are **temporary redirects**: change the destination anytime in
**Redirects**, without reprinting. Generate the QR image for the short link
(not the long link) with any QR tool, and test-scan it before printing.

*These are examples. None of them exist on the live site yet; create them in the CMS.*

## Checking it worked
1. Open the tagged link on your phone and send a test consultation.
2. CMS › **Enquiries** › open it › **How they found Cakeasy** should show the
   source, campaign and first page seen.
3. Mark the test as **spam** (or delete it).

## Monthly source review
In **Enquiries**, **Export CSV** and pivot by *Source* and *Campaign* in
Google Sheets. Count enquiries and confirmed orders per source. That, not likes,
decides where Neha's time goes next month.
