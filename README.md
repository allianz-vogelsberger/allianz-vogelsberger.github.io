# Allianz Agentur Vogelsberger – Review Landingpage

Mobile-first Feedback-Seite für die **Allianz Agentur Manfred Vogelsberger** in Matrei am Brenner.  
Kunden scannen einen QR-Code und können in 10 Sekunden eine Bewertung abgeben.

**Live:** [https://allianz-vogelsberger.github.io](https://allianz-vogelsberger.github.io)

---

## Funktionsweise

| Sterne | Aktion |
|--------|--------|
| 1 – 3  | Inline-Feedback-Formular → Daten werden per E-Mail zugestellt (FormSubmit.co) |
| 4 – 5  | Danke-Screen + Button → öffnet Google Bewertung in neuem Tab |

Kein Backend nötig. Die Seite läuft komplett als Static Site über GitHub Pages.

---

## Konfiguration

Alle Einstellungen befinden sich in **`script.js`**, ganz oben im Abschnitt `CONFIGURATION`.  
Es gibt nur **3 Variablen**, die gesetzt werden müssen:

### 1. `FEEDBACK_EMAIL`

E-Mail-Adresse, an die Feedback-Formulare gesendet werden (via FormSubmit.co).

```js
const FEEDBACK_EMAIL = "agentur.vogelsberger@allianz.at";
```

**Aktueller Stand (Test):** `lorenz@hygienemanagement.at`  
**Für Production:** Auf `agentur.vogelsberger@allianz.at` ändern.

> Beim **allerersten Submit** sendet FormSubmit.co eine Bestätigungs-E-Mail an die Adresse. Dort den Link klicken – danach kommen alle Feedbacks automatisch.
>
> Wenn `FEEDBACK_EMAIL` leer ist (`""`), wird der Submit-Button deaktiviert und ein Hinweis angezeigt.

### 2. `GOOGLE_PLACE_ID`

Google Place ID der Agentur. Wird automatisch zur Review-URL zusammengebaut.

```js
const GOOGLE_PLACE_ID = "ChIJ...deine_place_id...";
```

**So findest du die Place ID:**

1. Öffne den [Google Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)
2. Suche nach „Allianz Agentur Vogelsberger Matrei am Brenner"
3. Kopiere die angezeigte Place ID (beginnt mit `ChIJ...`)
4. Trage sie in `script.js` ein

Alternativ:
1. Öffne [Google Maps](https://maps.google.com)
2. Suche die Agentur → Klick auf „Rezension schreiben"
3. In der URL steht die Place ID nach `placeid=`

> Wenn `GOOGLE_PLACE_ID` leer ist (`""`), wird der Google-Review-Button deaktiviert und ein Hinweis angezeigt.

### 3. Custom Domain

Siehe Abschnitt [Custom Domain Setup](#custom-domain-setup) weiter unten.

---

## Projektstruktur

```
/
├── index.html          # Haupt-HTML (Single Page)
├── styles.css          # Alle Styles (mobile-first)
├── script.js           # Logik + Konfiguration (3 Variablen oben)
├── flyer.html          # Druckfertiger A4-Flyer mit QR-Code
├── CNAME               # Custom Domain für GitHub Pages
├── assets/
│   ├── favicon.svg     # Favicon
│   └── logo.svg        # Logo-Platzhalter (austauschbar)
├── qr/
│   ├── qr.svg          # QR-Code für Druck (Vektor)
│   └── qr.png          # QR-Code 1024×1024px
├── .gitignore
└── README.md
```

---

## QR-Code

Die QR-Codes liegen im Ordner `qr/`:

| Datei    | Format | Verwendung |
|----------|--------|------------|
| `qr.svg` | SVG   | Für Druck (skaliert verlustfrei) |
| `qr.png` | PNG   | Für digitale Verwendung (1024×1024px) |

### Drucktipps

- Verwende `qr.svg` für Drucksachen (Visitenkarten, Aufsteller, Flyer)
- Mindestgröße für den Druck: ca. 2×2 cm
- Die Quiet Zone (weißer Rand) ist bereits enthalten
- Farbe: Allianz-Blau (#003781) auf Weiß
- Error Correction Level: H (30 % – funktioniert auch bei leichter Beschädigung)

### Druckfertiger Flyer

`flyer.html` im Browser öffnen → Cmd+P (Mac) / Strg+P (Windows) → Drucken.  
A4 Hochformat, professionelles Design mit QR-Code, Allianz-Branding und Kontaktdaten.

### QR-Code neu generieren

Falls sich die URL ändert (z.B. nach Custom Domain), QR-Code mit Python neu erzeugen:

```bash
pip3 install 'qrcode[pil]'
python3 -c "
import qrcode, qrcode.image.svg
URL = 'https://allianz-vogelsberger.github.io'
factory = qrcode.image.svg.SvgPathImage
qrcode.make(URL, image_factory=factory, box_size=20, border=4, error_correction=qrcode.constants.ERROR_CORRECT_H).save('qr/qr.svg')
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=40, border=4)
qr.add_data(URL); qr.make(fit=True)
qr.make_image(fill_color='#003781', back_color='white').resize((1024,1024)).save('qr/qr.png')
"
```

---

## Deployment

Die Seite wird automatisch über **GitHub Pages** deployt.

- **Branch:** `main`
- **Pfad:** `/` (Root)

Änderungen einfach committen und pushen – GitHub Pages baut automatisch neu.

```bash
git add -A && git commit -m "Update" && git push
```

---

## Custom Domain Setup

### Schritt 1: Domain kaufen

Empfohlene Domains (`.at` für Österreich):

| Domain | Empfehlung |
|--------|-----------|
| `feedback-allianz-vogelsberger.at` | Top-Empfehlung |
| `vogelsberger-feedback.at` | Kurz & klar |
| `allianz-vogelsberger-feedback.at` | Alternativ |
| `agentur-vogelsberger-feedback.at` | Alternativ |

Kosten: ca. **5–15 €/Jahr**

Empfohlene Registrare:

| Anbieter | URL |
|----------|-----|
| **Porkbun** | [porkbun.com](https://porkbun.com) – günstig, einfach |
| **Namecheap** | [namecheap.com](https://namecheap.com) – etabliert |
| **Hetzner** | [hetzner.com](https://www.hetzner.com/domainregistration) – DE/AT Anbieter |
| **IONOS** | [ionos.at](https://www.ionos.at) – AT Anbieter |
| **World4You** | [world4you.com](https://www.world4you.com) – AT Anbieter |

### Schritt 2: DNS konfigurieren

Im DNS-Management des Registrars folgende Records anlegen:

**Option A – Root-Domain** (z.B. `feedback-allianz-vogelsberger.at`):

Erstelle **4 A-Records** und einen **AAAA-Record**:

```
Typ    Name    Wert                     TTL
A      @       185.199.108.153          3600
A      @       185.199.109.153          3600
A      @       185.199.110.153          3600
A      @       185.199.111.153          3600
```

**Option B – Subdomain** (z.B. `feedback.vogelsberger.at`):

Erstelle einen **CNAME-Record**:

```
Typ      Name       Wert                           TTL
CNAME    feedback   allianz-vogelsberger.github.io.       3600
```

### Schritt 3: GitHub Pages konfigurieren

1. Gehe zu **Repository Settings** → **Pages**
2. Unter „Custom domain": Domain eintragen (z.B. `feedback-allianz-vogelsberger.at`)
3. Warte bis DNS-Check grün wird (kann bis zu 24h dauern, meist Minuten)
4. Haken bei **„Enforce HTTPS"** setzen

### Schritt 4: CNAME-Datei aktualisieren

Die `CNAME`-Datei im Repo muss die Domain enthalten. Aktuell steht dort:

```
feedback-allianz-vogelsberger.at
```

Falls du eine andere Domain wählst, passe die Datei an.

### Schritt 5: QR-Code aktualisieren

Nach Domain-Wechsel den QR-Code mit der neuen URL neu generieren (siehe [QR-Code neu generieren](#qr-code-neu-generieren)).

### Schritt 6: Verifizierung

- Öffne `https://feedback-allianz-vogelsberger.at` im Browser
- Prüfe ob HTTPS-Schloss angezeigt wird
- Teste den QR-Code mit dem Handy

---

## Öffnungszeiten

| Tag | Zeiten |
|-----|--------|
| Montag – Donnerstag | 08:00 – 13:00 & 14:00 – 17:00 |
| Freitag | 08:00 – 13:00 |
| Nachmittags | nach telefonischer Vereinbarung |

---

## Kontakt

- **Telefon:** 05273 200 88
- **E-Mail:** agentur.vogelsberger@allianz.at
- **Adresse:** Bergstein 25A, 6143 Matrei am Brenner

---

## Tech-Stack

- Plain HTML / CSS / JS (kein Framework, kein Build-Step)
- Inter Font (Google Fonts)
- FormSubmit.co (Feedback-Empfang, kein Account nötig)
- GitHub Pages (Hosting, kostenlos)

---

## Lizenz

Privates Projekt für die Allianz Agentur Vogelsberger.
