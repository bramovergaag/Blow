# BLOW SEO · QA-rapport · 2026-05-02

## Samenvatting
- **34 posts** gescand in `pilot/posts/`
- **37 pipeline-rijen** (34 published + 3 archived) uit ContentQueue
- **44 pagina's** gecrawld in `pilot/`
- **0 broken links** (3 false-positives binnen `<script>` template-literals; alle externe links retourneerden 403 tegen QA-bot user-agent en zijn niet als broken geclassificeerd)
- **0 footer-links broken** (J)
- **2 auto-fixes** doorgevoerd: `pipeline-state.json` en `posts/index.json` opnieuw gegenereerd; geen `rel=noopener` of `/Blow/`-paths te fixen

## P0 — Broken (external + internal)
Geen daadwerkelijke broken links gevonden.

False-positives (genegeerd):
- `pilot/planning.html` — `${gcalUrl(m)}` (JS template literal in `<script>`)
- `pilot/posts-archive.html` — `${p.url}`, `${next.url}` (JS template literals)

Externe links (10 unieke) konden niet via WebFetch/curl geverifieerd worden (alle 403 op deze sandbox). Manuele steekproef aanbevolen voor:
- `blow.surf/over-blow`, `blow.surf/restaurant`, `blow.surf/kitesurfles`, `blow.surf/kitesurfles-zandmotor/`
- `bramovergaag.github.io/balistoel.nl/`
- `kiteboardschool.nl`, `kitesurfles.nl`, `downunderbeach.nl`, `kitesurfschoolscheveningen.nl`

### KRITIEK — Duplicate slugs (9 paren)
Voor elke kitesurfschool-post bestaan **twee** HTML-bestanden in `pilot/posts/`:

| Sheet rij | Canoniek (matcht sheet) | Legacy (verouderd) |
|---|---|---|
| 1 — kitesurfen zandmotor | `1-kitesurfen-zandmotor.html` | `01-zandmotor-veiligheid.html` |
| 2 — kitesurfen kijkduin vs scheveningen | `2-kitesurfen-kijkduin-vs-scheveningen.html` | `02-kijkduin-vs-scheveningen.html` |
| 3 — kitesurfen leren als volwassene | `3-kitesurfen-leren-als-volwassene.html` | `03-kitesurfen-leren-als-volwassene.html` |
| 4 — beste maand kitesurfen nl | `4-beste-maand-kitesurfen-nederland.html` | `04-beste-maand-kitesurfen-nederland.html` |
| 5 — wind zandmotor voorspelling | `5-wind-zandmotor-voorspelling.html` | `05-wind-zandmotor-voorspelling.html` |
| 6 — wat aantrekken kitesurfen winter | `6-wat-aantrekken-kitesurfen-winter.html` | `06-wat-aantrekken-kitesurfen-winter.html` |
| 7 — kitesurfen veiligheid beginners | `7-kitesurfen-veiligheid-beginners.html` | `07-kitesurfen-veiligheid-beginners.html` |
| 8 — beste kite beginner | `8-beste-kite-beginner.html` | `08-beste-kite-beginner.html` |
| 9 — kitesurfen vanaf welke leeftijd | `9-kitesurfen-vanaf-welke-leeftijd.html` | `09-kitesurfen-vanaf-welke-leeftijd.html` |

**Effect:** dubbele content op de site → SEO-cannibalisatie; Google indexeert al de legacy URL voor row 1 (zie GSC-data hieronder). Geen auto-fix uitgevoerd — beslissing vergt review.

### P0 SEO
- `posts/01-zandmotor-veiligheid.html`: **placeholder title** (`"Post A · Zandmotor — strategie + post"`) + **meta description ontbreekt**. Dit is precies de pagina waarop Google verkeer landt (zie GSC).

## P1 — Polish

### Title te lang (>60 chars) — 14 posts
| Post | Lengte |
|---|---|
| `2-kitesurfen-kijkduin-vs-scheveningen.html` | 92 |
| `9-kitesurfen-vanaf-welke-leeftijd.html` | 94 |
| `5-wind-zandmotor-voorspelling.html` | 89 |
| `7-kitesurfen-veiligheid-beginners.html` | 84 |
| `02-kijkduin-vs-scheveningen.html` | 83 |
| `6-wat-aantrekken-kitesurfen-winter.html` | 83 |
| `3-kitesurfen-leren-als-volwassene.html` | 83 |
| `8-beste-kite-beginner.html` | 77 |
| `1-kitesurfen-zandmotor.html` | 75 |
| `4-beste-maand-kitesurfen-nederland.html` | 68 |
| `09-kitesurfen-vanaf-welke-leeftijd.html` | 66 |
| `16-borrelen-aan-zee.html` | 63 |

Patroon: `" | BLOW Beach House Kijkduin"` suffix kost ~28 chars → korter naar `" | BLOW"` of laten vallen.

### Meta description te lang (>155 chars) — 11 posts
`08-beste-kite-beginner.html` (159), `2-kitesurfen-kijkduin-vs-scheveningen.html` (160), `5-wind-zandmotor-voorspelling.html` (159), `8-beste-kite-beginner.html` (159), `10-zandmotor-bezienswaardigheden.html` (157), `14-trouwen-op-het-strand-kijkduin.html` (163), `16-borrelen-aan-zee.html` (161), `19-teambuilding-kitesurfen.html` (159), `20-verjaardag-vieren-strand.html` (156), `21-kinderfeestje-strand-kijkduin.html` (162), `35-yoga-retreat-strand-den-haag.html` (156).

### Footer als `<div class="footer-section">` i.p.v. `<footer>` — 24 posts
Inconsistente template tussen oudere posts (`01`, `02`, `1-`, `2-`, `4-…9-`, `35-`) die `<footer>` gebruiken vs. nieuwere posts (`03`–`22`, `32`) die alleen `div.footer-section` hebben. Geen functioneel probleem maar slecht voor screen-readers en semantische HTML.

### `rel=noopener` auto
Geen aanpassingen nodig — alle `target="_blank"` anchors hebben al `rel="noopener"`.

### Dunne content
Geen (alle posts >960 woorden, mediaan ~1.4k).

### Ontbrekende internal links
Niet diepgaand gescand op semantische coverage; oppervlakkige scan toont gezonde related-blocks. Niet kritiek.

## P2 — Strategisch (uit GSC tabs)

**Beperking:** GSC_raw bevat slechts 2 rijen, GSC_daily 1 rij — onvoldoende voor brede analyse. Alle data betreft één query (`kitesurfen zandmotor`). Mock-generator output is sparse.

### Top-10 underperforming queries
| Query | Page | Clicks | Impressions | CTR | Pos |
|---|---|---:|---:|---:|---:|
| kitesurfen zandmotor | `01-zandmotor-veiligheid.html` (legacy!) | 336 (28d) | 9520 | 3.5% | 8.7 |

### Quick-wins (positie 11-20)
Geen queries in deze range in huidige GSC-export.

**Echter:** "kitesurfen zandmotor" zit op positie **8.7** met 9.5k impressies/28d. Push richting top-5 = grote click-uplift. Probleem: GSC indexeert de legacy file met placeholder title. Fix bij 01-bestand levert direct CTR-boost.

### Missing topics
Onvoldoende GSC-data voor strikte missing-topics analyse. Op basis van ContentQueue (37 rijen, alle gepubliceerd):
- **Kite-cluster** dekt: zandmotor, kijkduin vs scheveningen, leren-volwassene, beste-maand, wind-voorspelling, kleding, veiligheid, beste-kite, leeftijd. Goed gedekt.
- **Beach-house cluster**: strandrestaurant, ontbijt, dagje strand, winter-aan-zee, beach-house interieur, power-lunch. Mogelijke gaps: lunch/diner-menukaart pagina, hond-vriendelijk strand, parkeren-Kijkduin.
- **Events**: trouwen, kinderfeestje, bedrijfsuitje, teambuilding, verjaardag, bruiloft, zomerfeest. Mogelijke gap: bedrijfsborrel/netwerk-event, vrijgezellenfeest.
- **Wellness**: yoga-retreat. Sterk onderbelicht (1 post). Gap: SUP-yoga, meditatie aan zee, wellness-arrangementen.

### Cluster-coverage gap
| Cluster | Posts | Aandeel |
|---|---:|---:|
| kitesurfschool (kite) | 18 | 53% |
| beach-house (rest) | 7 | 21% |
| events | 7 | 21% |
| wellness (rest) | 2 | 6% |

Wellness sterk onderbelicht; beach-house en events redelijk in balans.

## Auto-doorgevoerd
- `pilot/pipeline-state.json` — 37 rijen, gegenereerd uit ContentQueue (incl. `publish_date` uit kolom 18, slot-mapping kitesurfschool→kite, beach-house→rest, events→events, wellness→rest)
- `pilot/posts/index.json` — 34 entries, gesorteerd op `publish_date desc`, datum genomen uit sheet (niet vandaag UTC)

## Top 3 actie voor Bram
1. **Beslis duplicate slugs (1- vs 01-).** Pak voor row 1 t/m 9 één canonieke URL en redirect/verwijder de andere. Hoogste prioriteit: row 1 — Google indexeert de legacy `01-zandmotor-veiligheid.html` met placeholder title; verkeer (336 clicks/28d, positie 8.7) wordt verspild.
2. **Fix `01-zandmotor-veiligheid.html`** of redirect naar `1-kitesurfen-zandmotor.html`. Title staat op `"Post A · Zandmotor — strategie + post"` en meta description ontbreekt → directe CTR-blocker op de page met de meeste impressies.
3. **Trim 14 lange titles**: drop `" Beach House Kijkduin"` uit het suffix-patroon (kort naar `" | BLOW"`). Goed voor 14 posts in één PR; verbetert SERP-display en vermijdt truncatie. Tegelijk de 11 te-lange meta descriptions trimmen onder de 155 chars.
