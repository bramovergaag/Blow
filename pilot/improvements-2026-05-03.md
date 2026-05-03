# BLOW SEO · QA-rapport · 2026-05-03

## Samenvatting
- **43 posts** gescand in `pilot/posts/`
- **42 pipeline-rijen** uit ContentQueue (38 published + 4 archived; 35 numbered + 7 GSC-driven)
- **53 pagina's** gecrawld in `pilot/` (10 top-level + 43 posts)
- **426 interne links** geverifieerd; **0 broken** (relatieve paths kloppen, geen `/Blow/`-hardcodes in href)
- **246 footer-links** in alle pagina's, **36 unieke** hrefs, **0 broken**
- **10 unieke externe links** (geen WebFetch-verificatie nu — sandbox blokkeerde gisteren al alle 403; manuele steekproef nog steeds aan te raden)
- **0 `rel=noopener` ontbrekend** (alle `target="_blank"` reeds correct)
- **2 auto-fixes**: `pipeline-state.json` + `posts/index.json` opnieuw gegenereerd (datums uit sheet kolom 18)

## P0 — Broken (external + internal)
Geen daadwerkelijke broken links in de gepubliceerde site.

### Kritieke content-issues (BLIJFT openstaan vanuit 2026-05-02)
1. **`posts/01-zandmotor-veiligheid.html` heeft nog steeds placeholder-title + lege meta-description** — terwijl GSC laat zien dat dit dé landing-page is voor het kern-keyword `kitesurfen zandmotor` (zie P2). Dit blijft de single largest SEO-opportunity en is in 24u nog niet gefixt.
   - Title nu: `"Post A · Zandmotor — strategie + post"` (placeholder)
   - Meta nu: leeg
   - Suggested title (≤60): `Kitesurfen Zandmotor: Veilig Leren bij Kijkduin | BLOW` (54)
   - Suggested meta (≤155): `Kitesurfen op de Zandmotor: dé veilige spot voor beginners en gevorderden bij Kijkduin. Tips, voorzorgsmaatregelen en kitesurfles van BLOW.` (148)

2. **9 duplicate slug-paren** (kitesurfschool legacy `01..09` + canonical `1..9`) bestaan nog steeds → SEO-cannibalisatie. Geen auto-fix; vergt content-decisie van Bram.

### Sheet-data integriteit
- **Duplicate `row_id` `gsc-20260503-0014`** in ContentQueue (2× rij): één voor `kitesurfen zandmotor`, één voor `beach club kijkduin`. Sheet-uniqueness contract gebroken.
- **5 GSC-driven rijen `published` zonder publish_date en zonder bijbehorend `pilot/posts/{slug}.html` bestand.** De HTML Publisher heeft deze status=published gezet maar geen pagina aangemaakt. Effect: sheet zegt "live", maar er is geen URL die Google kan crawlen.
  - `gsc-2026-05-02-2304` — "BLOW Beach House Kijkduin - Kitesurfen, Dining & Events"
  - `gsc-20260502-2357` — "Kitesurfen Zandmotor: Jouw Gids voor Veilig Sporten"
  - `gsc-20260503-0014` — "Kitesurfen Zandmotor: Jouw Ultieme Spotguide (2024)"
  - `gsc-20260503-0014` — "Beach Club Kijkduin: Jouw Ultieme Strandbestemming"

## P1 — Polish

### Title-tag bug — 3 posts: literal `\ |` in `<title>` (HTML Publisher escaping-bug)
| Post | Huidige `<title>` |
|---|---|
| `29-vegan-restaurant-den-haag-strand.html` | `Vegan Restaurant Den Haag Strand \| BLOW` |
| `30-pensioenfeest-strand.html` | `Pensioenfeest aan Strand \| BLOW` |
| `34-yoga-zonsopgang-kijkduin.html` | `Yoga bij Zonsopgang Kijkduin \| BLOW` |

Zichtbaar in browsertab als `Vegan Restaurant Den Haag Strand \ | BLOW`. Oorzaak: sheet `\|` (markdown-pipe-escape) wordt 1-op-1 in HTML gerenderd in plaats van geünescaped. **Geen auto-fix** — content-aanpassing.

### Meta-description placeholder/te kort — 3 posts (≤26 chars)
| Post | Lengte | Huidige meta |
|---|---|---|
| `29-vegan-restaurant-den-haag-strand.html` | 16 | `BLOW Beach House` |
| `30-pensioenfeest-strand.html` | 25 | `BLOW Beach House Kijkduin` |
| `34-yoga-zonsopgang-kijkduin.html` | 26 | `Sunrise Yoga op het Strand` |

Dezelfde 3 posts als de `\|`-bug → vermoedelijk dezelfde publishing-run met defecte meta-extractie.

### Title te lang (>60 chars) — 15 posts (+1 sinds gisteren)
Nieuw: `26-kitesurfen-nederland-vs-buitenland.html` (62, was 0 gisteren — zit nu in lijst). Patroon onveranderd: `" | BLOW Beach House Kijkduin"`-suffix kost ~28 chars. Zie 2026-05-02 rapport voor de volledige lijst (allemaal nog onveranderd).

### Meta description te lang (>155 chars) — 14 posts (+3 sinds gisteren)
Nieuw t.o.v. 2026-05-02:
- `26-kitesurfen-nederland-vs-buitenland.html` (169)
- `31-vergaderlocatie-strand-kijkduin.html` (160)
- `33-klantborrel-locatie-kijkduin.html` (159)

### Footer-semantiek — 24 posts gebruiken `<div class="footer-section">` i.p.v. `<footer>`
Onveranderd t.o.v. gisteren. Slecht voor screen-readers en semantische HTML, geen functionele impact.

### Dunne content
Geen (alle 43 posts >960 woorden).

### Ontbrekende internal links
Niet diepgaand gescand. Steekproef: related-blocks zien er gezond uit. Aanbeveling P2: cross-link de `kitesurfen zandmotor`-cluster (rij 1, 5, 10, 28) explicieter naar elkaar — dit is de hoogst-scorende cluster in GSC.

## P2 — Strategisch (uit GSC tabs)

GSC_raw bevat 7 rijen (3 dagen-oud, 1 fetch_date), GSC_daily 6 rijen (last-28-days). Beperkte scope, maar voldoende voor concrete acties.

### Top-10 underperforming queries (last-28-days)

| # | Query | Clicks | Impressions | CTR | Positie | Landing page (gemeld) | Bestaat? |
|---|---|---:|---:|---:|---:|---|---|
| 1 | beach club kijkduin | 199 | 7100 | 2,8% | **14,7** | `04-beachclub.html` | ❌ 404 |
| 2 | kitesurfles beginners zandmotor | 176 | 4200 | 4,2% | **12,3** | `02-beginners.html` | ❌ 404 |
| 3 | paddleboard hoek van holland | 171 | 2800 | 6,1% | **6,1** | `03-sup.html` | ❌ 404 |
| 4 | kitespot zandmotor windrichting | 134 | 1500 | 8,9% | **4,2** | `05-windspots.html` | ❌ 404 |
| 5 | zandmotor strandwandeling | 102 | 3300 | 3,1% | **11,8** | `06-wandelen.html` | ❌ 404 |
| 6 | kitesurfen zandmotor | 336 | 9520 | 3,5% | 8,7 | `01-zandmotor-veiligheid.html` | ✅ (placeholder) |

**KRITIEK:** 5 van de 6 landing-pages die Google nu serveert bestaan niet als bestand in `pilot/posts/`. Google crawlt de site, vindt deze URLs niet (404), en zal positie laten dalen. De HTML Publisher heeft hiervoor wel ContentQueue-rijen aangemaakt (de `gsc-*` rijen) en op `published` gezet, maar **geen daadwerkelijk HTML-bestand** geschreven onder de juiste filename. Bram moet beslissen: óf publisher fixen, óf manueel posts onder deze exacte filenames neerzetten.

### Quick-wins (positie 11-20)
- **`beach club kijkduin`** (pos 14,7 · 7100 impr) — 1 ranking-page omhoog = ~50 extra clicks/maand. Rank 8 zou ~250 clicks geven. Toppotentieel.
- **`kitesurfles beginners zandmotor`** (pos 12,3 · 4200 impr) — vergelijkbaar effect; sluit naadloos aan op kitesurf-cluster.
- **`zandmotor strandwandeling`** (pos 11,8 · 3300 impr) — past bij beach-house cluster.

### Top-3 (positie ≤10) waar de pagina al ranked maar onbestaand is
- `kitespot zandmotor windrichting` (pos 4,2 · 1500 impr) — 8,9% CTR is goed; pagina **gewoon publiceren** zou direct hoge CTR/clicks geven.
- `paddleboard hoek van holland` (pos 6,1 · 2800 impr) — buiten core-cluster maar staat in top-10. Strategische beslissing of dit binnen BLOW-scope past.
- `kitesurfen zandmotor` (pos 8,7 · 9520 impr) — landed nu op placeholder; fix #1 in dit rapport.

### Missing topics (queries zonder dedicated page)
Op basis van GSC-queries die geen dedicated post hebben:
- `kitesurfles beginners zandmotor` — momenteel mapt naar (niet-bestaande) `02-beginners.html`. Canonical post `7-kitesurfen-veiligheid-beginners.html` dekt dit deels. Aanbeveling: `redirect` of `consolidate` strategie.
- `paddleboard hoek van holland` — geen post in cluster (BLOW scope?).
- `zandmotor strandwandeling` — `28-hoe-werkt-de-zandmotor.html` raakt het maar geen dedicated wandel-post.
- `kitespot zandmotor windrichting` — `5-wind-zandmotor-voorspelling.html` is de canonical, maar GSC mapt naar `05-windspots.html`. Update site-map / 301.

### Cluster-coverage gap
| Cluster | Posts (sheet) | Top GSC-positie | Impressies (28d) |
|---|---:|---:|---:|
| kitesurfschool | 14 | 4,2 | 18.520 |
| beach-house | 11 | 14,7 | 7.100 |
| events | 11 | — | 0 |
| (nieuwe) blow | 5 | — | — |

`events`-cluster (11 posts, ~maanden inhoud) genereert **0 impressies** in GSC_daily. Of: de queries scoren gewoon te laag voor de gerapporteerde steekproef, of: pagina's worden niet geïndexeerd. Snelle check vereist: `site:bramovergaag.github.io/Blow/pilot/posts/2*` in Google.

## Auto-doorgevoerd
- `pilot/pipeline-state.json` — gegenereerd uit ContentQueue (42 rijen).
- `pilot/posts/index.json` — gegenereerd uit 43 HTML-posts, datums uit sheet kolom 18 (geen fallback nodig — alle posts gemapped via numerieke prefix-normalisatie, dus `01-…` matcht ook sheet rij `1`).

Niet doorgevoerd:
- `rel=noopener` — niets te fixen (0 missend).
- `/Blow/`-paths — geen `href="/Blow/..."` aanwezig (alleen JS-strings naar `raw.githubusercontent.com`, correct).
- Content/title/meta-fixes — buiten auto-fix-scope per regels.

## Top 3 actie voor Bram
1. **Fix `01-zandmotor-veiligheid.html`** (title + meta). Dit is dé landing-page voor je sterkste keyword (336 clicks/maand · 9520 impr) en draait nu een placeholder-title. Zelfs een matige fix verdubbelt CTR makkelijk.
2. **Onderzoek waarom 5 GSC-driven `gsc-*` rijen `published` staan zonder bijbehorend HTML-bestand.** De HTML Publisher (Sonnet 18:30) lijkt de status te updaten zonder posts te schrijven onder de filenames die GSC verwacht (`02-beginners.html`, `03-sup.html`, `04-beachclub.html`, `05-windspots.html`, `06-wandelen.html`). Hierdoor lopen we 781 clicks/maand mis aan 404's.
3. **Beslis over de 9 duplicate kitesurfschool-posts** (`01..09` legacy vs `1..9` canonical). Of canonicalize via `<link rel=canonical>`, of verwijder de legacy versies, of voeg een 301 redirect toe via een Pages-CNAME-config. Cannibalisatie kost rank op de gehele kite-cluster.
