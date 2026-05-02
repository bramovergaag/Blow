# BLOW SEO · QA-rapport · 2026-05-02

## Samenvatting
- Posts gescand: **24** (`pilot/posts/*.html`)
- Pipeline rijen tracked: **35** (35 met `publish_date`)
- Pagina's gecrawld: **33** (9 dashboard-pagina's + 24 posts)
- `<a>` tags totaal: **371** — relatief 305 · absoluut 26 · anchors 40
- Broken interne links: **0** (footer: 0)
- External links: **10 unieke URL's — niet automatisch verifieerbaar** (sandbox blokkeert outbound, `host_not_allowed`)
- `target=_blank` zonder `rel=noopener`: **0**
- Auto-fixes toegepast: **2** (regen `pipeline-state.json` + regen `posts/index.json`)
- GSC-data: **leeg** in `GSC_raw` en `GSC_daily` (alleen headers) → strategische sectie kan nu nog niet gevuld worden

## P0 — Broken
### Internal links
Geen. Alle 305 relatieve `<a href>`'s resolven naar bestaande bestanden.

### External links
Geen verifieerbare 4xx/5xx. **Maar**: outbound HTTP vanuit deze sandbox levert overal `403 host_not_allowed` op (zowel via WebFetch als curl), dus de QA-bot kan externe status niet bepalen. Lijst hieronder vereist handmatige (of CI-side) check:

| URL | Voorkomens | Notitie |
|-----|------------|---------|
| `https://blow.surf/kitesurfles` | post 01 (body), 02 (footer) | hoofd-CTA — kritisch |
| `https://blow.surf/kitesurfles-zandmotor/` | post 01 (2×), 02 (footer) | hoofd-CTA — kritisch |
| `https://blow.surf/over-blow` | post 01 (2×), 02 (footer) | |
| `https://blow.surf/restaurant` | post 01 (2×), 02 (footer) | |
| `https://bramovergaag.github.io/balistoel.nl/` | alle 9 dashboard-pagina's + post 01 | dashboard footer |
| `https://docs.google.com/spreadsheets/d/1wBDk9O…/edit` | posts-archive.html | sheet — auth required |
| `https://downunderbeach.nl/` | post 02 | concurrent (sched ref) |
| `https://kiteboardschool.nl/` | post 02 | concurrent |
| `https://kitesurfles.nl/` | post 02 | concurrent |
| `https://www.kitesurfschoolscheveningen.nl/` | post 02 | concurrent |

→ **Aanbeveling**: laat een GitHub Action `linkinator` of `lychee` 1×/dag door `pilot/**/*.html` lopen — die heeft wel outbound netwerk. Zonder dat blijft externe link-rot onzichtbaar.

## P1 — Polish

### Title te lang (>60 chars)
| Post | Lengte | Title |
|------|--------|-------|
| `02-kijkduin-vs-scheveningen.html` | **83** | Kitesurfen Kijkduin vs Scheveningen — waarom beginners beter bij ons starten \| BLOW |
| `09-kitesurfen-vanaf-welke-leeftijd.html` | **66** | Kitesurfen vanaf welke leeftijd? Alles over kinderen en kitesurfen |

### Meta description te lang (>155 chars)
8 posts: `08` (159), `10` (157), `14` (163), `16` (161), `19` (159), `20` (156), `21` (162), `35` (156). Ze worden afgekapt in SERP — handmatig inkorten of in HTML Publisher routine een hard truncate naar 155 inbouwen.

### Ontbrekend
- `pilot/posts/01-zandmotor-veiligheid.html`: **geen `<meta name="description">`**. Andere posts hebben hem allemaal. Toevoegen (huidige eyebrow-tekst suggereert dat dit een strategiepost was — overwegen om er een echte product-meta van te maken óf de post te depubliceren).

### Inconsistente eyebrow-tekst
Standaard is `BLOW · {Cluster}`. Afwijkende waardes:
| Post | Eyebrow |
|------|---------|
| `01-zandmotor-veiligheid.html` | `Strategische case · op basis van audit 27 apr` |
| `02-kijkduin-vs-scheveningen.html` | `BLOW · Vergelijking` |
| `03-kitesurfen-leren-als-volwassene.html` | `Beach House Kijkduin` (mist `BLOW · ` prefix én is verkeerde cluster — moet `BLOW · Kitesurfschool` zijn) |
| `34-yoga-zonsopgang-kijkduin.html` | `Wellness & Mindfulness` (geen `BLOW · ` prefix) — file bestaat nog niet |

→ alleen post #03 is een echt cosmetisch én cluster-classificatie issue. Niet auto-fixed (regel: geen content-fixes).

### Sheet ↔ filesystem mismatch (data-issue, geen broken-link issue)
- **22 posts** zijn live op disk + status=`published` in sheet, maar `archive_url` in sheet is leeg. Alleen rij 32 en 35 hebben `archive_url` ingevuld. Effect: `pipeline-state.json` toont `pub: pending` voor 22 posts die in werkelijkheid live staan.
- **10 posts** hebben status=`published` in sheet maar **geen HTML-bestand**: rij 24 (`zomerfeest organiseren`), 25 (`kitesurfen den haag`), 26, 27, 28, 29, 30, 31, 33, 34. → hetzij premature status, hetzij verloren publish-runs.

### Eyebrow-clusterverdeling
8× kitesurfschool · 7× beach-house · 5× events · 4× afwijkend (zie boven). Klopt grotendeels met sheet-departments.

## P2 — Strategisch (uit GSC tabs)

**`GSC_raw` en `GSC_daily` zijn leeg** (alleen header-rijen, geen data). Zonder GSC-export geen onderbouwde aanbevelingen voor:
- Top-10 underperforming queries
- Quick-wins positie 11-20
- Missing topics zonder page

→ **Bram, dit is dé hefboom voor het rapport**: zorg dat de GSC-pull (Make scenario? Looker Studio export?) wekelijks landt in deze tabs. Zonder data is de `P2`-sectie permanent leeg.

### Cluster-coverage gap (zonder GSC, op basis van sheet)
| Cluster | Sheet rijen | Live HTML | Gap |
|---------|-------------|-----------|-----|
| kitesurfschool | 14 | 10 | rij 25-28 |
| beach-house | 11 | 9 | rij 29, 32 (✓), 34 ontbreekt, 35 (✓) |
| events | 10 (1 archived) | 5 | rij 24, 30, 31, 33 ontbreekt |
| **Totaal** | **35** | **24** | **11 gaps** |

## Auto-doorgevoerd
- `pilot/pipeline-state.json` — geregenereerd uit ContentQueue (35 rijen, generated_at=2026-05-02T07:52Z). Inhoud identiek aan vorige run; alleen timestamp gewijzigd.
- `pilot/posts/index.json` — geregenereerd uit `pilot/posts/*.html` (24 entries, date=2026-05-02). Inhoud identiek aan vorige run; alleen `date`-veld gewijzigd.
- Geen `rel="noopener"` toegevoegd — alle 9 `target="_blank"` links hadden hem al.
- Geen `/Blow/...` → `../` paden gerepareerd — geen voorkomens gevonden.

## Top 3 actie voor Bram
1. **GSC-pijplijn fixen** — zonder `GSC_raw` / `GSC_daily` data blijft P2 leeg; dat is exact het deel waar Opus reasoning waarde toevoegt. Check Make scenario / API quota / sheet-write permission.
2. **Sheet `archive_url` backfillen** voor rijen 1-22 (22 posts). De HTML Publisher zet hem voor nieuwe runs wel (32, 35), maar de oudere batch is overgeslagen. Quick: script dat per rij waar status=`published` checkt of `https://bramovergaag.github.io/Blow/pilot/posts/{rowid}-{slug}.html` 200 retourneert, en zo ja schrijft.
3. **Post #01 cleanup** — `Post A · Zandmotor — strategie + post` is duidelijk een strategie-document dat per ongeluk in de live posts-folder staat (geen meta description, exotische eyebrow). Of opwaarderen naar echte spotgids óf verplaatsen naar `pilot/audit-*` map zodat hij niet in `index.json` belandt.
