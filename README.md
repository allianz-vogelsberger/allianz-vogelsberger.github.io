# Allianz Agentur Vogelsberger – Review Landingpage

Mobile-first Feedback-Seite für die **Allianz Agentur Manfred Vogelsberger** in Matrei am Brenner.  
Kunden scannen einen QR-Code und können in 10 Sekunden eine Bewertung abgeben.

**Live:** [https://blitzerbotapp.github.io/allianz-matrei-review-qr/](https://blitzerbotapp.github.io/allianz-matrei-review-qr/)

---

## Funktionsweise

| Sterne  | Aktion                                                   |
|---------|----------------------------------------------------------|
| 1 – 3   | Inline-Feedback-Formular → Daten gehen an Formspree     |
| 4 – 5   | Danke-Screen + Button → öffnet Google Bewertung          |

Kein Backend nötig. Die Seite läuft komplett als Static Site über GitHub Pages.

---

## Konfiguration

Öffne `script.js` und setze die beiden Variablen ganz oben:

```js
const FORMSPREE_ENDPOINT = "https://formspree.io/f/DEINE_ID";
const GOOGLE_REVIEW_URL  = "https://search.google.com/local/writereview?placeid=DEINE_PLACE_ID";
```

### Formspree einrichten

1. Gehe zu [formspree.io](https://formspree.io) und erstelle ein kostenloses Konto
2. Erstelle ein neues Formular
3. Kopiere die Endpoint-URL (z.B. `https://formspree.io/f/xwkgabcd`)
4. Setze sie als `FORMSPREE_ENDPOINT` in `script.js`

### Google Review Link finden

1. Suche deine Agentur auf [Google Maps](https://maps.google.com)
2. Öffne den Eintrag → Klick auf "Rezension schreiben"
3. Kopiere die URL aus der Browser-Adresszeile
4. Alternativ: Nutze die [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) und baue die URL:  
   `https://search.google.com/local/writereview?placeid=DEINE_PLACE_ID`
5. Setze sie als `GOOGLE_REVIEW_URL` in `script.js`

> Solange die Variablen auf `"HIER_PLATZHALTER"` stehen, werden die jeweiligen Buttons automatisch deaktiviert und ein Hinweis angezeigt.

---

## Projektstruktur

```
/
├── index.html          # Haupt-HTML
├── styles.css          # Alle Styles (mobile-first)
├── script.js           # Logik + Konfiguration
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

| Datei       | Format | Verwendung                              |
|-------------|--------|-----------------------------------------|
| `qr.svg`    | SVG    | Für Druck (skaliert verlustfrei)        |
| `qr.png`    | PNG    | Für digitale Verwendung (1024×1024px)   |

### Drucktipps

- Verwende `qr.svg` für Drucksachen (Visitenkarten, Aufsteller, Flyer)
- Mindestgröße für den Druck: ca. 2×2 cm
- Die Quiet Zone (weißer Rand) ist bereits enthalten
- Farbe: Allianz-Blau (#003781) auf Weiß
- Error Correction Level: H (30 % – funktioniert auch bei leichter Beschädigung)

### QR-Code neu generieren

Falls sich die URL ändert, kann der QR-Code mit Python neu erzeugt werden:

```bash
pip3 install 'qrcode[pil]'
python3 -c "
import qrcode, qrcode.image.svg
URL = 'DEINE_NEUE_URL'
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
- **URL:** [https://blitzerbotapp.github.io/allianz-matrei-review-qr/](https://blitzerbotapp.github.io/allianz-matrei-review-qr/)

Änderungen einfach committen und pushen – GitHub Pages baut automatisch neu.

```bash
git add -A && git commit -m "Update" && git push
```

---

## Custom Domain (optional)

Falls du eine eigene Domain verwenden möchtest (z.B. `feedback.vogelsberger-allianz.at`):

1. Erstelle eine `CNAME`-Datei im Root mit dem Domain-Namen:
   ```
   feedback.vogelsberger-allianz.at
   ```

2. Setze bei deinem DNS-Provider einen **CNAME-Record**:
   ```
   feedback  →  blitzerbotapp.github.io
   ```

3. Warte auf DNS-Propagation (bis zu 24h)

4. In den GitHub Repo-Settings unter *Pages* die Custom Domain eintragen und HTTPS aktivieren

5. QR-Code mit neuer URL neu generieren (siehe oben)

---

## Tech-Stack

- Plain HTML / CSS / JS (kein Framework)
- Inter Font (Google Fonts)
- Formspree (Feedback-Empfang, kostenlos)
- GitHub Pages (Hosting)

---

## Lizenz

Privates Projekt für die Allianz Agentur Vogelsberger.
