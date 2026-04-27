# BLOW Audit — Template + uitvoeringsgids

**Doel:** in ~1 uur een data-gedreven momentopname van blow.surf — niet om alles te fixen, maar om de 5 sterkste hefbomen voor de komende 6 maanden zichtbaar te maken.

**Tijd:** 60–75 minuten als je GSC-toegang hebt. 90 minuten zonder (dan alleen publieke data).

---

## Deel 1 — Google Search Console (30 min, mits toegang)

Vraag Toine om je toe te voegen als *Beperkte gebruiker* of *Volledige gebruiker* op de property `blow.surf`.

### 1.1 Top 20 underperformers (impressies hoog, positie slecht)

Ga naar **Prestaties → Zoekresultaten → Laatste 3 maanden**.

Filter-instellingen:
- Datum: laatste 3 maanden
- Positie: sorteer laag→hoog
- Minimum impressies: 50

Exporteer top 20 queries waar positie 11–25 is (= "bijna op pagina 1"). Dit zijn je **refresh-kandidaten** — bestaande pagina's die met 2u werk kunnen stijgen.

Vul in deze tabel:

| # | Query | Page | Impr. | Pos. | CTR | Refresh-kans (1–5) | Actie |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |
| 2 | | | | | | | |
| ... | | | | | | | |

### 1.2 Quick-win queries (positie 4–10, CTR laag)

Zelfde rapport, filter op positie 4–10. Queries met lage CTR ondanks positie = **slechte title/meta**. Fix = 15 minuten per pagina.

| # | Query | Page | Pos. | CTR nu | CTR-verwachting | Titel-suggestie |
|---|---|---|---|---|---|---|
| 1 | | | | | | |

*CTR-verwachting (benchmark):* pos 1: 28%, pos 2: 15%, pos 3: 10%, pos 5: 6%, pos 8: 3%.

### 1.3 Nieuwe onderwerpen (queries zonder eigen pagina)

Filter: queries met 10+ impressies die leiden naar een **algemene pagina** (homepage, categorie). Dat betekent: Google weet niet welke pagina relevant is → jij mist een dedicated pagina.

| # | Query | Huidige landing | Voorstel nieuwe pagina |
|---|---|---|---|
| 1 | | | |

---

## Deel 2 — Zonder GSC-toegang (alternatief 45 min)

Gebruik:
- **Ubersuggest** (gratis tier, 3 searches/dag)
- **Ahrefs Site Explorer** (gratis Webmaster Tools — alleen als domein is geverifieerd)
- **Google handmatig**: zoek op `site:blow.surf` → zie welke pagina's Google heeft geïndexeerd

Vul:

| Wat | Getal |
|---|---|
| Aantal geïndexeerde pagina's `site:blow.surf` | |
| Aantal geïndexeerde /blog/ pagina's | |
| Aantal backlinks (Ubersuggest) | |
| Domain Rating schatting | |

---

## Deel 3 — On-page check top-5 pagina's (15 min)

Open elk van deze pagina's en noteer:

| Pagina | Title-tag ok? | Meta-desc ok? | H1 ok? | Images alt? | Interne links ≥3? |
|---|---|---|---|---|---|
| / (home) | | | | | |
| /kitesurfles | | | | | |
| /beach-house | | | | | |
| /events | | | | | |
| /blog (als die bestaat) | | | | | |

Criteria:
- **Title**: 50–60 tekens, primary keyword vooraan
- **Meta-desc**: 140–160 tekens, CTA erin
- **H1**: bestaat, 1×, bevat keyword
- **Alt-tags**: elke image heeft beschrijvende alt (niet "image1.jpg")
- **Interne links**: uit elke content-pagina minimaal 3 links naar andere pagina's

---

## Deel 4 — Concurrent-check (10 min)

Drie concurrenten die geografisch + doelgroep overlappen:

| Concurrent | Domain | Publiceert blog? | Frequentie | Opvallend |
|---|---|---|---|---|
| Hart Beach (Scheveningen) | hartbeach.nl | | | |
| Aloha Surf (Scheveningen) | alohasurf.nl | | | |
| The Shore (Kijkduin) | theshore.nl of vergelijkbaar | | | |

Check voor elk: `site:hartbeach.nl blog` — hoeveel blog-pagina's hebben ze? Welke onderwerpen? Wat mist BLOW t.o.v. hen?

---

## Deel 5 — Samenvatting voor Toine (5 min)

Vul dit in — dit wordt één slide/sectie in de HTML-pilot:

### Top 3 bevindingen

1. **\[bv. "BLOW heeft 8 blogartikelen, concurrenten 40+"\]** — gevolg: \[wat dit betekent\]
2.
3.

### Top 5 quick wins (komende 8 weken)

| # | Actie | Verwachte impact | Uren |
|---|---|---|---|
| 1 | Refresh pagina X met keyword Y | +30% klikken op query Z | 2 |
| 2 | Schrijf nieuwe pagina voor keyword "beste wind Zandmotor" | 50+ klikken/mnd | 3 |
| 3 | | | |
| 4 | | | |
| 5 | | | |

### Top 3 langere-termijn kansen (3–6 maanden)

1.
2.
3.

---

## Deliverables na deze audit

- Dit ingevulde bestand
- CSV-export uit GSC (als beschikbaar) → `audit-data.csv`
- Screenshot van huidige GSC dashboard → `audit-screenshot.png`
- Eén samenvattende sectie in de HTML-pilot (top 3 bevindingen + top 5 quick wins)

---

**Tijd-log voor Bram:**
- Start: __:__
- Eind: __:__
- Werkelijke duur: __ min

Als dit langer duurt dan 90 minuten: stoppen. Je hebt genoeg om Toine te laten zien dat het systeem werkt. Perfectie = geen pilot.
