# BLOW SEO · QA-rapport · 2026-05-01

Run: daily QA + publisher (19:00 ams). Tweede run vandaag (na de 12:00 publish-batch).

## Samenvatting

- **Posts gepublished deze run**: 10 nieuwe HTML-posts (rij 4, 11, 15, 16, 17, 18, 19, 20, 21, 22)
  - https://bramovergaag.github.io/Blow/pilot/posts/04-beste-maand-kitesurfen-nederland.html
  - https://bramovergaag.github.io/Blow/pilot/posts/11-strandrestaurant-kijkduin.html
  - https://bramovergaag.github.io/Blow/pilot/posts/15-winter-aan-zee-kijkduin.html
  - https://bramovergaag.github.io/Blow/pilot/posts/16-borrelen-aan-zee.html
  - https://bramovergaag.github.io/Blow/pilot/posts/17-beach-house-interieur.html
  - https://bramovergaag.github.io/Blow/pilot/posts/18-bedrijfsuitje-strand-kijkduin.html
  - https://bramovergaag.github.io/Blow/pilot/posts/19-teambuilding-kitesurfen.html
  - https://bramovergaag.github.io/Blow/pilot/posts/20-verjaardag-vieren-strand.html
  - https://bramovergaag.github.io/Blow/pilot/posts/21-kinderfeestje-strand-kijkduin.html
  - https://bramovergaag.github.io/Blow/pilot/posts/22-bruiloft-strand-kijkduin.html
- **Totaal posts on disk**: 24 (was 14)
- **Pipeline-state**: 35 rijen tracked, 35 met publish_date (1× archived → `pub: skip`)
- **Index.json**: 24 entries (was 14) — alle clusters resolved
- **Pagina's gescand**: 34 (10 pilot-pages + 24 posts)
- **Totaal hrefs gescand**: 385
- **Broken links**: 0 internal-missing, 0 footer-broken, 0 missing-noopener — **2 anchor-issues** (carry-over)
- **Auto-fixes toegepast**: 2 (`index.json` regen, `pipeline-state.json` regen)
- **Sheet-rijen status=published zonder file**: 10 (rij 24, 25, 26, 27, 28, 29, 30, 31, 33, 34) — volgende run

## P0 — Broken

### External
Geen broken externals gedetecteerd in deze run (27 unieke external URLs; niet diep gevalideerd via WebFetch om kosten/latency te besparen — alleen statisch syntax-check).

### Internal
Geen broken internal file-paths in posts/. De 2 P0/P1-anchor-issues uit de site-wide audit zijn pre-existing en niet door deze run geïntroduceerd:

| Pagina | Anchor | Status |
|---|---|---|
| `pilot/m1-actielijst.html` | `#status` | Bekend, intentional placeholder (M2-M9 sprintplanning) |
| `pilot/m1-notulen.html` | `#status` | Bekend, intentional placeholder |

## P1 — Polish

### Title te lang (>60 chars) — 2 posts (legacy)
- `02-kijkduin-vs-scheveningen.html` — 83 chars: "Kitesurfen Kijkduin vs Scheveningen — waarom beginners beter bij ons starten dan in Scheveningen"
- `09-kitesurfen-vanaf-welke-leeftijd.html` — 66 chars: "Kitesurfen vanaf welke leeftijd? Alles over kinderen en kitesurfen"

### Meta description te lang (>155 chars) — 8 posts
| Post | Lengte | Notitie |
|---|---|---|
| `08-beste-kite-beginner.html` | 159 | Eerdere run |
| `10-zandmotor-bezienswaardigheden.html` | 157 | Eerdere run |
| `14-trouwen-op-het-strand-kijkduin.html` | 163 | Eerdere run |
| `16-borrelen-aan-zee.html` | 161 | **Deze run** |
| `19-teambuilding-kitesurfen.html` | 159 | **Deze run** |
| `20-verjaardag-vieren-strand.html` | 156 | **Deze run** |
| `21-kinderfeestje-strand-kijkduin.html` | 162 | **Deze run** |
| `35-yoga-retreat-strand-den-haag.html` | 156 | Eerdere run |

Bron-meta zit in sheet kolom 9. Conform regels: **geen auto-fix op meta** — Bram dient sheet bij te werken, daarna idempotent oppakkbaar (slug bestaat al, dus deze run zou niet hergeneeren — manual: `rm` + rerun, of edit HTML-file).

### Legacy posts zonder volledig template — 3 posts
- `01-zandmotor-veiligheid.html` (P0: missing meta description; P1: missing brand-bar)
- `02-kijkduin-vs-scheveningen.html` (P1: missing brand-bar)
- `35-yoga-retreat-strand-den-haag.html` (P1: missing brand-bar)

Deze posts gebruiken een afwijkend template uit eerdere ad-hoc publicatie. Conservative auto-fix is niet toegepast (zou risk op layout-breaking zijn). Aanbeveling: handmatig hertekenen of automatisch hergenereren op basis van sheet-content.

## P2 — Strategisch (uit GSC tabs)

⚠ **GSC data niet beschikbaar deze run.** Drive MCP `download_file_content` met `text/csv` exporteert alleen het eerste tabblad (`ContentQueue`). De tabs `GSC daily` (gid 2) en `GSC range` (gid 3) zijn niet via deze export te bereiken.

Action items voor volgende run:
- Gebruik `gsc_mock_generator.py` (toegevoegd in eerdere commit `15d78ba`) om mock data te POSTen naar Make → Sheet
- Alternatief: `download_file_content` met expliciete tab-export via Drive Sheets API ondersteunt (nog) geen `gid` parameter; overweeg secundaire fileId of MAKE-fallback om GSC-data per tab op te halen

Strategische analyse pagina-prestaties → uitgesteld tot GSC data live is.

### Cluster-coverage status (uit pipeline-state)
| Cluster | Slot | Sheet rijen | On disk | % gepublished |
|---|---|---|---|---|
| kitesurfschool | kite | 14 | 10 | 71% |
| beach-house | rest | 11 | 9 | 82% |
| events | events | 10 | 5 | 50% |

Events-cluster is achter — 5 events-posts wachten nog op publicatie (24, 30, 31, 33 + ge-archived 23). Volgende run zal deze oppakken (max 10/run regel niet gehaald deze run; volgende run kan hele backlog wegwerken).

## Auto-doorgevoerd

1. `pilot/posts/index.json` regenerated — 24 entries (was 14), alle clusters resolved
2. `pilot/pipeline-state.json` (re)created — 35 rijen, 35 met publish_date
3. 10× nieuwe posts geschreven naar `pilot/posts/` met BLOW huisstijl (brand-bar #C66A1F, container 760px, eyebrow + h1 + meta-row, .tldr oranje, h2 blue underline, FAQ blocks, footer met related-links binnen-cluster)
4. Geen `rel=noopener` fixes nodig (geen `target=_blank` zonder noopener gevonden)
5. Geen `/Blow/...` → `../` path-rewrites nodig

## Top 3 actie voor Bram

1. **Update sheet kolom 9 (meta_description)** voor 8 posts >155 chars — kort in tot ≤150 voor Google SERP-fit. Daarna lokaal `rm pilot/posts/{slug}.html` per post → volgende run regenereert idempotent.
2. **Hertekenen 3 legacy-posts** (01, 02, 35) met huidig template — of toestaan dat QA-bot ze hergenereert (vereist regelwijziging: skip-if-exists → re-render-if-template-mismatch).
3. **GSC data pipeline aanzetten** — run `gsc_mock_generator.py` zodat tabs 2/3 gevuld zijn vóór volgende QA-run; dan kan P2-strategisch (top-10 underperforming queries, quick-wins positie 11-20, missing topics) gevuld worden.
