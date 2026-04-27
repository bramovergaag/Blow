# BLOW Pilot

Voorstel en pilot-bewijs voor samenwerking tussen Bram Overgaag en BLOW (Kijkduin / Den Haag). Alles in deze map is **jouw eigendom** — de pilot is ongeacht de beslissing bruikbaar.

## Structuur

```
BLOW-pilot/
├── index.html                           ← Hoofdpagina, toon dit aan Toine
├── README.md                            ← Dit bestand
├── audit-template.md                    ← Audit-stappenplan + tabellen
├── content-queue-seed.csv               ← 30 keyword-ideeën voor komende 6 mnd
├── posts/
│   ├── 01-zandmotor-veiligheid.md       ← Publicatie-klaar
│   └── 02-kijkduin-vs-scheveningen.md   ← Brief + outline, body dit weekend
└── distributie/
    └── templates.md                     ← 6-kanalen distributie templates
```

## Deliverables-status

| # | Deliverable | Status | Bram-tijd weekend |
|---|---|---|---|
| 1 | HTML-pilotomgeving (`index.html`) | ✅ Klaar | 0u |
| 2 | Blogpost A — Zandmotor | ✅ Publicatie-klaar | 0u (optioneel: cijfers valideren bij Toine) |
| 3 | Blogpost B — Kijkduin vs Scheveningen | 📝 Skeleton klaar, body leeg | ~1,5u schrijven |
| 4 | Audit-template | ✅ Klaar — wacht op uitvoeren | 60–90 min (met GSC-toegang) |
| 5 | Distributie-templates | ✅ Klaar, voor post A ingevuld | 15 min voor post B als die af is |
| 6 | Content-queue seed (30 keywords) | ✅ Klaar | 0u |

**Totaal Bram-werk dit weekend: 2,5–3u** (audit + post B).

## Hoe gebruik je dit voor het Toine-gesprek (woensdag 18:00)

### Optie 1 — Lokaal laten zien
Open `index.html` in je browser. Werkt offline, zelf-bevattend. Geef Toine je laptop of laat het zien op groot scherm.

### Optie 2 — Hosten op GitHub Pages (aanrader)

Zo krijg je een URL die je Toine kunt appen en die hij later kan herlezen:

```bash
# 1. Init repo in deze map
cd BLOW-pilot
git init
git add .
git commit -m "BLOW pilot v1.0"

# 2. Nieuwe repo op github.com
#    Voor private pages (aanrader als dit bedrijfs-IP is):
#    github.com/new → private → naam: blow-pilot

# 3. Push
git remote add origin git@github.com:<jouwnaam>/blow-pilot.git
git branch -M main
git push -u origin main

# 4. GitHub → Settings → Pages
#    Source: Deploy from branch
#    Branch: main / (root)
#    Save

# URL: https://<jouwnaam>.github.io/blow-pilot/
```

**Commercieel gebruik van GitHub Pages:**
- GitHub Free tier: ToS staat GEEN commerciële Pages-hosting toe
- GitHub Pro / Team / Enterprise: WEL toegestaan
- Dit document = advies-intern, geen commerciële site → praktisch geen risico
- Alternatief zonder ToS-zorg: **Cloudflare Pages** (gratis, commercieel toegestaan)

### Optie 3 — Cloudflare Pages (commercieel 100% safe)

```bash
# 1. cloudflare.com → Pages → Create a project
# 2. Connect GitHub repo OF upload zip
# 3. Build settings: geen build, static
# 4. Deploy → krijgt auto URL: blow-pilot-xyz.pages.dev
# 5. Optioneel: custom domain pilot.blow.surf
```

## Wat te doen na de pilot-acceptatie

Als Toine instemt (welk model dan ook):

1. **Maand 1, week 1:** MAKE-account inrichten + OAuth-connecties (Google, WP, 2chat)
2. **Week 2:** Scenario 1, 2, 3 live + eerste 2 posts uit pilot naar WP
3. **Week 3–4:** Scenario 4, 5 live + volgende 4 posts
4. **Maand 2:** Distributie-automation (scenario 6) + GA4-attributie
5. **Maand 3:** Review + go/no-go

## Contactpunten

- **Repo-owner:** Bram Overgaag — bramovergaag@gmail.com
- **Klant:** Toine (BLOW) — [telefoon/mail invullen]
- **Beach House:** Westmadeweg 66, 2553 EM Den Haag

---

*v1.0 — april 2026. Ga-naar-pagina: `index.html`.*
