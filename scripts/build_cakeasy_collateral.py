from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A3, A4, A6, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.utils import ImageReader
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics import renderPDF


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
PREVIEW = ROOT / "tmp" / "pdfs"
OUT.mkdir(parents=True, exist_ok=True)
PREVIEW.mkdir(parents=True, exist_ok=True)

INK = HexColor("#251B21")
PLUM = HexColor("#43242F")
ROSE = HexColor("#D63384")
BLUSH = HexColor("#FFF5F8")
GOLD = HexColor("#C4903D")
CHAMPAGNE = HexColor("#F5C178")
MIST = HexColor("#F7F2EF")
MUTED = HexColor("#6D6265")
WHITE = colors.white

LOGO = ROOT / "src" / "assets" / "brand" / "cakeasy-logo-web.webp"
BAKER = ROOT / "public" / "gallery" / "1" / "img1.jpg"
CAKES = [
    ROOT / "public" / "catalog" / "product2.jpg",
    ROOT / "public" / "catalog" / "product3.jpg",
    ROOT / "public" / "catalog" / "product4.jpg",
    ROOT / "public" / "catalog" / "product1.jpg",
    ROOT / "public" / "catalog" / "product5.jpg",
    ROOT / "public" / "catalog" / "product6.jpg",
]

styles = getSampleStyleSheet()
BODY = ParagraphStyle("body", parent=styles["BodyText"], fontName="Helvetica", fontSize=9, leading=14, textColor=MUTED)
SMALL = ParagraphStyle("small", parent=BODY, fontSize=7.5, leading=11)
LABEL = ParagraphStyle("label", parent=BODY, fontName="Helvetica-Bold", fontSize=7, leading=9, textColor=ROSE, uppercase=True, tracking=1.2)
H2 = ParagraphStyle("h2", parent=styles["Heading2"], fontName="Times-Bold", fontSize=23, leading=26, textColor=INK)
H3 = ParagraphStyle("h3", parent=styles["Heading3"], fontName="Times-Bold", fontSize=14, leading=17, textColor=INK)
WHITE_BODY = ParagraphStyle("whitebody", parent=BODY, textColor=colors.Color(1, 1, 1, .74))
WHITE_H2 = ParagraphStyle("whiteh2", parent=H2, textColor=WHITE)


def para(c, text, style, x, y_top, w, h=None):
    p = Paragraph(text, style)
    _, ph = p.wrap(w, h or 300)
    p.drawOn(c, x, y_top - ph)
    return ph


def cover_image(c, path, x, y, w, h):
    if not Path(path).exists():
        c.setFillColor(MIST)
        c.rect(x, y, w, h, fill=1, stroke=0)
        return
    img = ImageReader(str(path))
    iw, ih = img.getSize()
    scale = max(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    c.saveState()
    p = c.beginPath()
    p.rect(x, y, w, h)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh, mask="auto")
    c.restoreState()


def contain_image(c, path, x, y, w, h, pad=0):
    if not Path(path).exists():
        return
    img = ImageReader(str(path))
    iw, ih = img.getSize()
    scale = min((w - pad * 2) / iw, (h - pad * 2) / ih)
    dw, dh = iw * scale, ih * scale
    c.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh, mask="auto")


def logo(c, x, y, w=54 * mm):
    contain_image(c, LOGO, x, y, w, 24 * mm)


def rule(c, x1, y, x2, color=GOLD, width=0.8):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y, x2, y)


def footer(c, width, page=None, dark=False):
    c.setFillColor(WHITE if dark else MUTED)
    c.setFont("Helvetica", 7.5)
    c.drawString(18 * mm, 10 * mm, "cakeasy.in  |  @cakeasy99  |  +91 88107 95004")
    if page is not None:
        c.drawRightString(width - 18 * mm, 10 * mm, str(page).zfill(2))


def title_block(c, kicker, title, body, x, y, w, dark=False):
    para(c, kicker.upper(), LABEL if not dark else ParagraphStyle("labeldark", parent=LABEL, textColor=CHAMPAGNE), x, y, w)
    title_height = para(c, title, WHITE_H2 if dark else H2, x, y - 17, w)
    para(c, body, WHITE_BODY if dark else BODY, x, y - 17 - title_height - 9, w)


def pill(c, text, x, y, w, fill=BLUSH, text_color=ROSE):
    c.setFillColor(fill)
    c.roundRect(x, y, w, 7 * mm, 3.5 * mm, fill=1, stroke=0)
    c.setFillColor(text_color)
    c.setFont("Helvetica-Bold", 7.2)
    c.drawCentredString(x + w / 2, y + 2.4 * mm, text.upper())


def draw_qr(c, x, y, size, url="https://cakeasy.in/consultation"):
    qr = QrCodeWidget(url)
    bounds = qr.getBounds()
    d = Drawing(size, size, transform=[size / (bounds[2] - bounds[0]), 0, 0, size / (bounds[3] - bounds[1]), -bounds[0], -bounds[1]])
    d.add(qr)
    renderPDF.draw(d, c, x, y)


def info_card(c, x, y, w, h, number, heading, body):
    c.setFillColor(WHITE)
    c.setStrokeColor(HexColor("#EDE3E2"))
    c.roundRect(x, y, w, h, 5 * mm, fill=1, stroke=1)
    c.setFillColor(ROSE)
    c.circle(x + 10 * mm, y + h - 12 * mm, 5 * mm, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(x + 10 * mm, y + h - 14.5 * mm, number)
    para(c, heading, H3, x + 19 * mm, y + h - 8 * mm, w - 24 * mm)
    para(c, body, SMALL, x + 8 * mm, y + h - 26 * mm, w - 16 * mm)


def make_lookbook():
    path = OUT / "Cakeasy_Wedding_Custom_Cake_Lookbook_A4.pdf"
    c = canvas.Canvas(str(path), pagesize=A4)
    W, H = A4
    # Cover: baker is present, but the cake remains the visual anchor.
    c.setFillColor(INK); c.rect(0, 0, W, H, fill=1, stroke=0)
    cover_image(c, BAKER, W * .58, 0, W * .42, H)
    c.setFillColor(INK); c.rect(0, 0, W * .62, H, fill=1, stroke=0)
    logo(c, 18 * mm, H - 38 * mm, 58 * mm)
    c.setFillColor(CHAMPAGNE); c.setFont("Helvetica-Bold", 8); c.drawString(18 * mm, H - 55 * mm, "CAKEASY WEDDING & CUSTOM CAKE LOOKBOOK")
    para(c, "Your wedding.<br/><font color='#F5C178'>Your story.</font><br/>Your cake.", ParagraphStyle("cover", parent=H2, fontSize=36, leading=38, textColor=WHITE), 18 * mm, H - 76 * mm, W * .45)
    para(c, "Bespoke cakes designed around your colours, decor, outfits and story.", ParagraphStyle("coverbody", parent=WHITE_BODY, fontSize=11, leading=17), 18 * mm, H - 157 * mm, W * .43)
    rule(c, 18 * mm, 54 * mm, 58 * mm, CHAMPAGNE, 1.2)
    para(c, "Neha Chaudhary / Founder & Baker<br/>Greater Noida - Delhi NCR | Lucknow roots", ParagraphStyle("coverfoot", parent=WHITE_BODY, fontSize=8.5, leading=13), 18 * mm, 47 * mm, W * .4)
    footer(c, W, 1, dark=True); c.showPage()

    # Story and process
    c.setFillColor(BLUSH); c.rect(0, 0, W, H, fill=1, stroke=0); logo(c, 18 * mm, H - 36 * mm)
    title_block(c, "The Cakeasy point of view", "Not just customised with a name - designed from the ground up.", "Cakeasy began with Neha Chaudhary in Lucknow in 2021 and grew into a design-led cake studio serving Delhi NCR. The work is personal, considered and built around the celebration rather than a fixed catalogue.", 18 * mm, H - 52 * mm, W - 36 * mm)
    cover_image(c, BAKER, 18 * mm, 48 * mm, 54 * mm, 84 * mm)
    c.setFillColor(WHITE); c.roundRect(78 * mm, 42 * mm, W - 96 * mm, 100 * mm, 6 * mm, fill=1, stroke=0)
    para(c, "THE CUSTOM CAKE JOURNEY", LABEL, 87 * mm, 132 * mm, 90 * mm)
    steps = [("01", "Share your event details", "Date, venue and guest count."), ("02", "Send your inspiration", "Outfits, invitation, decor or flowers."), ("03", "Discuss the design", "Tiers, flavour, finish and logistics."), ("04", "Receive a proposal", "A clear quotation before confirmation."), ("05", "Create the moment", "Baked, delivered and set up with care.")]
    yy = 126 * mm
    for number, heading, body in steps:
        c.setFillColor(ROSE); c.circle(90 * mm, yy, 4 * mm, fill=1, stroke=0); c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 6.5); c.drawCentredString(90 * mm, yy - 2 * mm, number)
        para(c, heading, ParagraphStyle("stephead", parent=BODY, fontName="Helvetica-Bold", textColor=PLUM, fontSize=8.5), 99 * mm, yy + 3 * mm, 80 * mm)
        para(c, body, ParagraphStyle("stepbodycompact", parent=SMALL, fontSize=6.8, leading=9), 99 * mm, yy - 6 * mm, 75 * mm); yy -= 18 * mm
    footer(c, W, 2); c.showPage()

    sections = [
        ("Wedding & engagement", "Design-led centrepieces for the moments that deserve a room of their own.", [0, 1, 2], ["Multi-tier | 40-120 servings | Floral buttercream", "2-4 tiers | Quote by design | Metallic details", "Minimal luxury | 30-80 servings | Custom palette"]),
        ("Celebration stories", "Birthday, anniversary, baby shower and proposal cakes made personal.", [3, 4, 5], ["Theme cake | 12-40 servings | Message or topper", "Bento & cupcakes | 1-12 servings | Gift-ready", "Photo / personalised | Quote by brief | Custom finish"]),
        ("Flavours & finishes", "Choose a signature direction, then let the design conversation refine it.", [1, 3, 4], ["Belgian chocolate ganache | Rich and balanced", "Vanilla berry | Light, bright and celebratory", "Rasmalai / pistachio | Indian-inspired and fragrant"]),
    ]
    for page_no, (heading, body, ids, metas) in enumerate(sections, start=3):
        c.setFillColor(WHITE); c.rect(0, 0, W, H, fill=1, stroke=0); logo(c, 18 * mm, H - 36 * mm)
        title_block(c, "Cakeasy lookbook", heading, body, 18 * mm, H - 52 * mm, W - 36 * mm)
        card_w = (W - 42 * mm) / 3; x0 = 18 * mm; y0 = 76 * mm
        for idx, image_id in enumerate(ids):
            x = x0 + idx * (card_w + 3 * mm)
            c.setFillColor(MIST); c.roundRect(x, y0, card_w, 83 * mm, 5 * mm, fill=1, stroke=0)
            cover_image(c, CAKES[image_id], x, y0 + 34 * mm, card_w, 49 * mm)
            para(c, metas[idx], ParagraphStyle("meta", parent=SMALL, fontName="Helvetica-Bold", textColor=PLUM, fontSize=7.5, leading=10), x + 5 * mm, y0 + 27 * mm, card_w - 10 * mm)
            para(c, "Custom quotation based on design, servings, flavour and delivery requirements.", SMALL, x + 5 * mm, y0 + 16 * mm, card_w - 10 * mm)
            pill(c, "Explore this style", x + 5 * mm, y0 + 4 * mm, card_w - 10 * mm)
        c.setFillColor(BLUSH); c.roundRect(18 * mm, 30 * mm, W - 36 * mm, 28 * mm, 6 * mm, fill=1, stroke=0)
        para(c, "Every design can be adapted to your colour palette, outfit, invitation, flowers, cultural details and venue story.", ParagraphStyle("callout", parent=H3, fontSize=14, leading=17, textColor=PLUM), 26 * mm, 49 * mm, W - 52 * mm)
        footer(c, W, page_no); c.showPage()

    # Consultation / tasting close
    c.setFillColor(INK); c.rect(0, 0, W, H, fill=1, stroke=0); logo(c, 18 * mm, H - 38 * mm, 56 * mm)
    title_block(c, "Start the conversation", "The first professional step is a thoughtful brief.", "Book a design discussion for your wedding, engagement or celebration. We will talk through the cake, then send a quotation that protects the details that matter.", 18 * mm, H - 56 * mm, W * .56, dark=True)
    c.setFillColor(WHITE); c.roundRect(18 * mm, 52 * mm, W * .57, 75 * mm, 7 * mm, fill=1, stroke=0)
    para(c, "WEDDING TASTING BOX", LABEL, 26 * mm, 116 * mm, 70 * mm)
    para(c, "A paid 4-6 flavour tasting box can be adjusted against a confirmed wedding cake order above the agreed value.", H3, 26 * mm, 106 * mm, W * .5)
    para(c, "Chocolate truffle  |  Belgian chocolate  |  Red velvet  |  Vanilla berry  |  Butterscotch  |  Rasmalai or another Indian-inspired flavour", SMALL, 26 * mm, 78 * mm, W * .5)
    c.setFillColor(CHAMPAGNE); c.roundRect(W * .7, 70 * mm, 48 * mm, 48 * mm, 5 * mm, fill=1, stroke=0); draw_qr(c, W * .7 + 8 * mm, 78 * mm, 32 * mm); c.setFillColor(INK); c.setFont("Helvetica-Bold", 7); c.drawCentredString(W * .7 + 24 * mm, 73 * mm, "SCAN TO CONSULT")
    footer(c, W, 6, dark=True); c.showPage(); c.save()
    return path


def make_brochure():
    path = OUT / "Cakeasy_Premium_Wedding_Brochure_A4.pdf"
    c = canvas.Canvas(str(path), pagesize=A4); W, H = A4
    # Front
    c.setFillColor(BLUSH); c.rect(0, 0, W, H, fill=1, stroke=0); cover_image(c, CAKES[0], W * .46, 0, W * .54, H); c.setFillColor(BLUSH); c.rect(0, 0, W * .5, H, fill=1, stroke=0); logo(c, 18 * mm, H - 38 * mm, 56 * mm); para(c, "Your wedding.<br/><font color='#D63384'>Your story.</font><br/>Your cake.", ParagraphStyle("brochurecover", parent=H2, fontSize=33, leading=35), 18 * mm, H - 78 * mm, W * .35); para(c, "Bespoke wedding cakes by Cakeasy", ParagraphStyle("brochuretag", parent=H3, textColor=PLUM, fontSize=13), 18 * mm, H - 167 * mm, W * .35); para(c, "A design-led studio for multi-tier cakes, floral detail and celebrations that feel entirely yours.", BODY, 18 * mm, H - 188 * mm, W * .35); footer(c, W, 1); c.showPage()
    # Process
    c.setFillColor(WHITE); c.rect(0, 0, W, H, fill=1, stroke=0); logo(c, 18 * mm, H - 36 * mm); title_block(c, "Inside the studio", "A cake design process made for real celebrations.", "The more context we have, the more personal the final cake can become.", 18 * mm, H - 52 * mm, W - 36 * mm)
    for i, (num, h, b) in enumerate([("01", "Brief", "Date, venue, guests, palette and inspiration."), ("02", "Design", "Tiers, structure, finish, flavour and handmade elements."), ("03", "Quotation", "A clear proposal with delivery, setup and payment terms."), ("04", "Creation", "Baked, finished, delivered and set up with care.")]): info_card(c, 18 * mm + (i % 2) * 87 * mm, H - 154 * mm - (i // 2) * 48 * mm, 79 * mm, 39 * mm, num, h, b)
    cover_image(c, BAKER, 18 * mm, 32 * mm, 49 * mm, 49 * mm); c.setFillColor(BLUSH); c.roundRect(74 * mm, 32 * mm, W - 92 * mm, 49 * mm, 5 * mm, fill=1, stroke=0); para(c, "From Lucknow in 2021 to Delhi NCR", H3, 83 * mm, 70 * mm, W - 110 * mm); para(c, "Neha Chaudhary brings the warmth of a home baker and the rigour of a design studio to every Cakeasy commission.", BODY, 83 * mm, 58 * mm, W - 110 * mm); footer(c, W, 2); c.showPage()
    # Portfolio / support range
    c.setFillColor(MIST); c.rect(0, 0, W, H, fill=1, stroke=0); logo(c, 18 * mm, H - 36 * mm); title_block(c, "The collection", "Lead with the centrepiece. Keep the supporting range close.", "Wedding, engagement and anniversary cakes are the flagship. Bento cakes, cupcakes, pastries and dessert boxes make it easy to begin with Cakeasy.", 18 * mm, H - 52 * mm, W - 36 * mm)
    for i, image_id in enumerate([0, 2, 3, 4]):
        x = 18 * mm + (i % 2) * 87 * mm; y = H - 192 * mm - (i // 2) * 65 * mm; cover_image(c, CAKES[image_id], x, y, 79 * mm, 48 * mm); c.setFillColor(WHITE); c.roundRect(x, y - 14 * mm, 79 * mm, 14 * mm, 3 * mm, fill=1, stroke=0); c.setFillColor(PLUM); c.setFont("Helvetica-Bold", 8); c.drawString(x + 5 * mm, y - 7 * mm, ["Wedding centrepieces", "Floral & minimal luxury", "Celebration stories", "Bento & cupcake collections"][i])
    footer(c, W, 3); c.showPage()
    # Back / CTA
    c.setFillColor(INK); c.rect(0, 0, W, H, fill=1, stroke=0); logo(c, 18 * mm, H - 38 * mm, 56 * mm); para(c, "Ready to design yours?", ParagraphStyle("backh", parent=H2, fontSize=30, textColor=WHITE), 18 * mm, H - 78 * mm, W * .55); para(c, "Book a cake consultation and share the details that make your celebration yours.", ParagraphStyle("backp", parent=WHITE_BODY, fontSize=11, leading=17), 18 * mm, H - 120 * mm, W * .5); c.setFillColor(WHITE); c.roundRect(18 * mm, 73 * mm, W - 36 * mm, 47 * mm, 6 * mm, fill=1, stroke=0); para(c, "Cakeasy Studio", H3, 28 * mm, 107 * mm, 72 * mm); para(c, "4C-601, AWHO, Greater Noida, Delhi NCR\n+91 88107 95004  |  @cakeasy99  |  cakeasy.in", BODY, 28 * mm, 96 * mm, 92 * mm); draw_qr(c, W - 58 * mm, 80 * mm, 31 * mm); footer(c, W, 4, dark=True); c.showPage(); c.save(); return path


def make_consultation_card():
    path = OUT / "Cakeasy_Wedding_Consultation_Card_A4.pdf"; c = canvas.Canvas(str(path), pagesize=A4); W, H = A4
    c.setFillColor(BLUSH); c.rect(0, 0, W, H, fill=1, stroke=0); logo(c, 18 * mm, H - 35 * mm); title_block(c, "Cakeasy wedding & celebration cake studio", "Consultation card", "Use this brief to collect the details that turn a cake order into a design conversation.", 18 * mm, H - 52 * mm, W - 36 * mm)
    fields = ["Client / couple name", "Wedding or event date", "Venue / city", "Number of guests / servings", "Preferred number of tiers", "Colour palette / decor", "Bride and groom outfits", "Preferred flowers", "Cake flavour", "Egg / eggless", "Budget range", "Delivery and setup requirements"]
    x1, x2 = 18 * mm, 108 * mm; y = H - 112 * mm
    for i, field in enumerate(fields):
        x = x1 if i % 2 == 0 else x2; yy = y - (i // 2) * 25 * mm; para(c, field.upper(), LABEL, x, yy, 78 * mm); rule(c, x, yy - 7 * mm, x + 80 * mm, HexColor("#DCCFD0"), .6)
    c.setFillColor(WHITE); c.roundRect(18 * mm, 42 * mm, W - 36 * mm, 48 * mm, 6 * mm, fill=1, stroke=0); para(c, "UPLOAD / ATTACH REFERENCES", LABEL, 26 * mm, 80 * mm, 100 * mm); para(c, "Outfit photos  |  Invitation card  |  Stage decor  |  Pinterest references  |  Colour palette", H3, 26 * mm, 69 * mm, W - 52 * mm); para(c, "Next step: send this completed card to Cakeasy on WhatsApp for a direct consultation.", SMALL, 26 * mm, 54 * mm, W - 52 * mm); footer(c, W, 1); c.showPage(); c.save(); return path


def make_quotation():
    path = OUT / "Cakeasy_Custom_Cake_Quotation_Template_A4.pdf"; c = canvas.Canvas(str(path), pagesize=A4); W, H = A4
    for page in range(2):
        c.setFillColor(WHITE); c.rect(0, 0, W, H, fill=1, stroke=0); logo(c, 18 * mm, H - 35 * mm); c.setFillColor(INK); c.setFont("Helvetica-Bold", 8); c.drawRightString(W - 18 * mm, H - 28 * mm, "QUOTATION / PRIVATE COMMISSION")
        if page == 0:
            title_block(c, "Cakeasy bespoke cake studio", "Custom cake quotation", "A clear working document for a considered design commission.", 18 * mm, H - 52 * mm, W - 36 * mm)
            rows = [["CLIENT / EVENT", "", "DATE / VALID UNTIL", ""], ["DESIGN CONCEPT", "", "SERVINGS / TIERS", ""], ["FLAVOUR / FILLING", "", "ICING / FINISH", ""], ["HANDMADE ELEMENTS", "", "FLOWERS / TOPPER", ""]]
            t = Table(rows, colWidths=[38 * mm, 56 * mm, 42 * mm, 42 * mm], rowHeights=[16 * mm] * 4); t.setStyle(TableStyle([("GRID", (0,0), (-1,-1), .5, HexColor("#E7DCDD")), ("BACKGROUND", (0,0), (-1,-1), BLUSH), ("FONTNAME", (0,0), (-1,-1), "Helvetica"), ("TEXTCOLOR", (0,0), (-1,-1), PLUM), ("FONTSIZE", (0,0), (-1,-1), 7), ("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 6)])); t.wrapOn(c, W, H); t.drawOn(c, 18 * mm, H - 188 * mm)
            para(c, "COSTING", LABEL, 18 * mm, H - 211 * mm, 80 * mm); cost = [["Cake design / tiers", "Rs. __________"], ["Delivery", "Rs. __________"], ["Venue setup", "Rs. __________"], ["Total", "Rs. __________"]]; tt = Table(cost, colWidths=[110 * mm, 68 * mm], rowHeights=[11 * mm] * 4); tt.setStyle(TableStyle([("GRID", (0,0), (-1,-1), .5, HexColor("#E7DCDD")), ("BACKGROUND", (0,3), (-1,3), BLUSH), ("FONTNAME", (0,3), (-1,3), "Helvetica-Bold"), ("FONTNAME", (0,0), (-1,-1), "Helvetica"), ("FONTSIZE", (0,0), (-1,-1), 8), ("TEXTCOLOR", (0,0), (-1,-1), PLUM), ("ALIGN", (1,0), (1,-1), "RIGHT")])); tt.wrapOn(c, W, H); tt.drawOn(c, 18 * mm, H - 267 * mm)
            para(c, "ADVANCE REQUIRED: Rs. __________    BALANCE DUE: __________", H3, 18 * mm, H - 274 * mm, W - 36 * mm)
        else:
            title_block(c, "Quotation notes", "Terms that protect the celebration.", "Confirm the final version of these terms with the client before accepting the commission.", 18 * mm, H - 52 * mm, W - 36 * mm)
            terms = ["Advance payment and balance-payment deadline", "Design-change deadline and approval point", "Delivery charges, venue setup and access requirements", "Fresh or artificial flower responsibility", "Damage, transport and storage conditions", "Cancellation and refund terms", "Allergen and eggless suitability confirmation"]
            yy = H - 112 * mm
            for i, term in enumerate(terms):
                c.setFillColor(ROSE); c.circle(24 * mm, yy - i * 18 * mm, 2.5 * mm, fill=1, stroke=0); para(c, term, H3, 32 * mm, yy + 4 * mm - i * 18 * mm, W - 54 * mm); rule(c, 32 * mm, yy - 8 * mm - i * 18 * mm, W - 18 * mm, HexColor("#E7DCDD"), .5)
            c.setFillColor(BLUSH); c.roundRect(18 * mm, 46 * mm, W - 36 * mm, 48 * mm, 6 * mm, fill=1, stroke=0); para(c, "CLIENT APPROVAL", LABEL, 26 * mm, 83 * mm, 80 * mm); para(c, "Client signature: ____________________    Date: ____________________", BODY, 26 * mm, 70 * mm, W - 52 * mm); para(c, "Cakeasy approval: ____________________", BODY, 26 * mm, 55 * mm, W - 52 * mm)
        footer(c, W, page + 1); c.showPage()
    c.save(); return path


def make_small_cards():
    results = []
    cards = [
        ("Cakeasy_Thank_You_Referral_Card_A6.pdf", "Thank you for trusting Cakeasy", "Your celebration helped us create another little story in cake.", "If someone you love is planning a celebration, send them our way. Referrals are how a small studio grows with the right people.", "Share Cakeasy  |  @cakeasy99"),
        ("Cakeasy_Wedding_Tasting_Box_Insert_A6.pdf", "Tasting box guide", "Taste the direction before you choose the centrepiece.", "Keep chilled. Let each slice rest for 15 minutes before tasting. Note the sponge, filling and finish, then bring your favourites to the consultation.", "Chocolate truffle  |  Belgian chocolate  |  Red velvet  |  Vanilla berry  |  Butterscotch  |  Rasmalai"),
        ("Cakeasy_Packaging_Care_Card_A6.pdf", "Cake care instructions", "A little care keeps the finish beautiful.", "Keep level and chilled. Avoid sunlight, heat and parked cars. Bring to room temperature only as advised. Use a sharp warm knife.", "WhatsApp +91 88107 95004"),
    ]
    for filename, title, kicker, body, end in cards:
        path = OUT / filename; c = canvas.Canvas(str(path), pagesize=A6); W, H = A6
        c.setFillColor(INK); c.rect(0, 0, W, H, fill=1, stroke=0); cover_image(c, BAKER, W * .55, 0, W * .45, H); c.setFillColor(INK); c.rect(0, 0, W * .64, H, fill=1, stroke=0); logo(c, 12 * mm, H - 27 * mm, 39 * mm); para(c, kicker.upper(), ParagraphStyle("cardk", parent=LABEL, textColor=CHAMPAGNE), 12 * mm, H - 43 * mm, W * .48); para(c, title, ParagraphStyle("cardh", parent=H2, fontSize=22, leading=24, textColor=WHITE), 12 * mm, H - 58 * mm, W * .46); para(c, body, ParagraphStyle("cardbody", parent=WHITE_BODY, fontSize=8.5, leading=13), 12 * mm, H - 105 * mm, W * .44); rule(c, 12 * mm, 25 * mm, W * .46, CHAMPAGNE); para(c, end, ParagraphStyle("cardend", parent=WHITE_BODY, fontSize=6.5, leading=8), 12 * mm, 19 * mm, W * .44); c.showPage(); c.save(); results.append(path)
    return results


def make_posters():
    results = []
    # A3 design journey poster
    path = OUT / "Cakeasy_Custom_Cake_Journey_Poster_A3.pdf"; c = canvas.Canvas(str(path), pagesize=A3); W, H = A3; c.setFillColor(INK); c.rect(0, 0, W, H, fill=1, stroke=0); cover_image(c, BAKER, W * .62, 0, W * .38, H); c.setFillColor(INK); c.rect(0, 0, W * .68, H, fill=1, stroke=0); logo(c, 24 * mm, H - 50 * mm, 80 * mm); para(c, "CAKEASY CUSTOM CAKE JOURNEY", ParagraphStyle("a3label", parent=LABEL, textColor=CHAMPAGNE, fontSize=11), 24 * mm, H - 74 * mm, W * .56); para(c, "You imagine it.<br/><font color='#F5C178'>We design it in cake.</font>", ParagraphStyle("a3h", parent=H2, fontSize=47, leading=50, textColor=WHITE), 24 * mm, H - 95 * mm, W * .54); para(c, "From your colours and decor to your outfits and story, every Cakeasy creation can be designed around your celebration.", ParagraphStyle("a3body", parent=WHITE_BODY, fontSize=13, leading=20), 24 * mm, H - 205 * mm, W * .5); steps = [("01", "Share your event details"), ("02", "Send your theme and inspiration"), ("03", "Discuss servings, flavour and budget"), ("04", "Receive a customised design proposal"), ("05", "Confirm with advance payment"), ("06", "Cakeasy creates, delivers and sets up")]; yy = H - 290 * mm
    for num, text in steps:
        c.setFillColor(ROSE); c.roundRect(24 * mm, yy, 18 * mm, 12 * mm, 6 * mm, fill=1, stroke=0); c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 9); c.drawCentredString(33 * mm, yy + 4 * mm, num); c.setFont("Helvetica-Bold", 13); c.drawString(50 * mm, yy + 3 * mm, text); yy -= 19 * mm
    c.setFillColor(WHITE); c.roundRect(24 * mm, 25 * mm, 142 * mm, 26 * mm, 6 * mm, fill=1, stroke=0); para(c, "BOOK A CONSULTATION  |  +91 88107 95004  |  cakeasy.in", ParagraphStyle("a3cta", parent=H3, fontSize=13, textColor=PLUM), 32 * mm, 42 * mm, 126 * mm); footer(c, W, dark=True); c.showPage(); c.save(); results.append(path)
    # A3 QR tabletop / partner stand
    path = OUT / "Cakeasy_QR_Consultation_Tabletop_Stand_A3.pdf"; c = canvas.Canvas(str(path), pagesize=A3); W, H = A3; c.setFillColor(BLUSH); c.rect(0, 0, W, H, fill=1, stroke=0); logo(c, 30 * mm, H - 55 * mm, 90 * mm); para(c, "BESPOKE WEDDING & CELEBRATION CAKE STUDIO", LABEL, 30 * mm, H - 77 * mm, W - 60 * mm); para(c, "Your story deserves a centrepiece.", ParagraphStyle("qrh", parent=H2, fontSize=38, leading=42), 30 * mm, H - 100 * mm, W - 60 * mm); para(c, "Scan to book a Cakeasy cake consultation. Share your date, venue, palette, outfits and inspiration with Neha.", ParagraphStyle("qrbody", parent=BODY, fontSize=14, leading=22), 30 * mm, H - 160 * mm, W * .52); c.setFillColor(WHITE); c.roundRect(W * .62, H * .25, W * .25, W * .25, 8 * mm, fill=1, stroke=0); draw_qr(c, W * .66, H * .25 + 16 * mm, W * .17); c.setFillColor(PLUM); c.setFont("Helvetica-Bold", 10); c.drawCentredString(W * .745, H * .25 + 11 * mm, "SCAN TO CONSULT"); cover_image(c, BAKER, 30 * mm, 28 * mm, 74 * mm, 74 * mm); c.setFillColor(PLUM); c.setFont("Helvetica-Bold", 13); c.drawString(112 * mm, 74 * mm, "Neha Chaudhary / Founder & Baker"); c.setFont("Helvetica", 10); c.drawString(112 * mm, 64 * mm, "Greater Noida - Delhi NCR | @cakeasy99 | +91 88107 95004"); footer(c, W); c.showPage(); c.save(); results.append(path); return results


def make_partner_kit():
    path = OUT / "Cakeasy_Planner_Venue_Partner_Kit_A4.pdf"; c = canvas.Canvas(str(path), pagesize=A4); W, H = A4
    pages = [("Partner with Cakeasy", "A design-led cake studio for celebrations with a point of view.", "For wedding planners, banquet halls, hotels, decorators, bridal boutiques, photographers, florists and invitation designers.", 0), ("A strong partner experience", "Give couples a cake conversation that starts before the price question.", "Cakeasy can create cakes that match a stage decoration, wedding invitation, bride's lehenga, floral arrangement or full colour theme.", 1), ("The partnership kit", "A simple referral path for a better client experience.", "Share a consultation QR, request a tasting box or introduce Cakeasy when your couple needs a centrepiece designed around the day.", 2)]
    for i, (kicker, heading, body, image_id) in enumerate(pages, start=1):
        c.setFillColor(INK if i == 1 else WHITE); c.rect(0, 0, W, H, fill=1, stroke=0); logo(c, 18 * mm, H - 36 * mm); title_block(c, kicker, heading, body, 18 * mm, H - 55 * mm, W * .56, dark=i == 1)
        if i == 1: cover_image(c, BAKER, W * .62, 0, W * .38, H)
        elif i == 2:
            for j, img in enumerate([0, 1, 2]): cover_image(c, CAKES[img], 18 * mm + j * 58 * mm, H - 182 * mm, 52 * mm, 60 * mm)
            para(c, "Design references welcome", H3, 18 * mm, H - 197 * mm, W - 36 * mm); para(c, "Outfits  |  Invitations  |  Stage decor  |  Flowers  |  Venue palette", BODY, 18 * mm, H - 211 * mm, W - 36 * mm)
        else:
            info_card(c, 18 * mm, H - 160 * mm, 78 * mm, 54 * mm, "01", "Lookbook", "Share the Cakeasy wedding and custom cake portfolio with couples."); info_card(c, 105 * mm, H - 160 * mm, 78 * mm, 54 * mm, "02", "Tasting box", "Offer a guided 4-6 flavour tasting conversation."); info_card(c, 18 * mm, H - 225 * mm, 78 * mm, 54 * mm, "03", "Consultation QR", "Let couples book a direct design discussion."); info_card(c, 105 * mm, H - 225 * mm, 78 * mm, 54 * mm, "04", "Referral", "Ask us about a simple referral arrangement.")
        c.setFillColor(BLUSH); c.roundRect(18 * mm, 35 * mm, W - 36 * mm, 34 * mm, 6 * mm, fill=1, stroke=0); para(c, "Partner contact", LABEL, 26 * mm, 58 * mm, 70 * mm); para(c, "cakeasy94@gmail.com  |  +91 88107 95004  |  cakeasy.in  |  @cakeasy99", H3, 26 * mm, 48 * mm, W - 52 * mm); draw_qr(c, W - 56 * mm, 39 * mm, 25 * mm); footer(c, W, i, dark=i == 1); c.showPage()
    c.save(); return path


if __name__ == "__main__":
    files = [make_lookbook(), make_brochure(), make_consultation_card(), make_quotation(), *make_small_cards(), *make_posters(), make_partner_kit()]
    print("Generated:")
    for file in files: print(file)
