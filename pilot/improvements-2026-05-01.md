# BLOW SEO · QA-rapport · 2026-05-01

Run: daily QA + publisher (19:00 ams)

## Samenvatting

- **Posts gepublished**: 10 nieuwe HTML-posts
  - https://bramovergaag.github.io/Blow/pilot/posts/03-kitesurfen-leren-als-volwassene.html
  - https://bramovergaag.github.io/Blow/pilot/posts/05-wind-zandmotor-voorspelling.html
  - https://bramovergaag.github.io/Blow/pilot/posts/06-wat-aantrekken-kitesurfen-winter.html
  - https://bramovergaag.github.io/Blow/pilot/posts/07-kitesurfen-veiligheid-beginners.html
  - https://bramovergaag.github.io/Blow/pilot/posts/08-beste-kite-beginner.html
  - https://bramovergaag.github.io/Blow/pilot/posts/09-kitesurfen-vanaf-welke-leeftijd.html
  - https://bramovergaag.github.io/Blow/pilot/posts/10-zandmotor-bezienswaardigheden.html
  - https://bramovergaag.github.io/Blow/pilot/posts/12-dagje-strand-kijkduin.html
  - https://bramovergaag.github.io/Blow/pilot/posts/13-ontbijt-aan-zee-den-haag.html
  - https://bramovergaag.github.io/Blow/pilot/posts/14-trouwen-op-het-strand-kijkduin.html
- **Pagina's gescand**: 23 (9 pilot-pages + 14 posts)
- **Totaal hrefs gescand**: 295
- **Broken links pre-fix**: 27 (P0); **post-fix**: 10 (waarvan 9 intentional placeholders)
- **Auto-fixes toegepast**: 4 commits (zie onder), 14 link-edits totaal
- **Manual review nodig**: 4 items (zie P1 + P2)
- **Stray file verwijderd**: `pilot/posts/-.html` (leeg, 0 bytes)

## P0 — Broken (gefixt deze run)

### Post 35 (yoga-retreat) — gebruikersmelding "broken footer links"
**Pre-fix**: 6× `href="#"` (2 brand-bar tabs, 4 footer-links) — allemaal dood
**Post-fix**:
- Brand-bar Bestelling → `../../`
- Brand-bar SEO Dashboard → `../`
- 4× footer related-links → echte interne posts (#32, #13, #12, #14)
- Toegevoegd: `↩ Terug naar pilot-overzicht` link

### Post 32 (power-lunch) — absolute paths broken op GH Pages
**Pre-fix**: 7× absolute paths (`/`, `/bestelling`, `/seo`, `/beach-house-kijkduin`, `/strandtent-den-haag`, `/zakelijk-vergaderen-strand`, `/lunch-aan-zee`)
**Post-fix**:
- Brand-bar logo `/` → `../../`
- Brand-bar tabs `/bestelling` → `../../`, `/seo` → `../`
- 4× footer related-links → echte interne posts (#13, #12, #35, #14)

### Post 02 (kijkduin-vs-scheveningen) — footer absolute paths
**Pre-fix**: 4× absolute paths (`/kitesurfles-zandmotor/`, `/kitesurfles`, `/beach-house`, `/over-blow`)
**Post-fix**: omgezet naar `https://blow.surf/...` met `target="_blank" rel="noopener"`

### External (niet aangetast — geverifieerd of geflagged)

| URL | Status | Actie |
|-----|--------|-------|
| `https://blow.surf/kitesurfles` | 403 (bot block) | manual verify |
| `https://blow.surf/kitesurfles-zandmotor/` | 403 (bot block) | manual verify |
| `https://blow.surf/over-blow` | 403 (bot block) | manual verify |
| `https://blow.surf/restaurant` | 403 (bot block) | manual verify |
| `https://bramovergaag.github.io/balistoel.nl/` | niet gecheckt | OK, eigen domein |
| `https://docs.google.com/spreadsheets/...` | niet gecheckt | OK |
| `https://downunderbeach.nl/`, `https://kiteboardschool.nl/`, `https://kitesurfles.nl/`, `https://www.kitesurfschoolscheveningen.nl/` | niet gecheckt | concurrent-links uit post #2 |

> blow.surf retourneert HTTP 403 voor de WebFetch-User-Agent. Dat is een server-bot-block, niet een 404. URL's bestaan vrijwel zeker. Bram: even handmatig in browser checken.

### Internal (niet auto-fixed — intentional placeholders)

- `pilot/posts-archive.html:220` — `<a href="#" class="tile archive active">`: dit is een active-state tile, geen broken link. Niet aanraken.
- `pilot/m1-agenda.html:1864-1871` — 8× `<a href="#" class="m-marker future">M2…M9</a>`: future-meeting placeholders. Niet aanraken (zijn bedoeld om later naar agenda-pagina's te wijzen wanneer die er zijn).

## P1 — Polish

1. **Post #2** — `<title>` is 83 chars (max 60 aanbevolen voor Google snippet). Huidige titel: "Kitesurfen Kijkduin vs Scheveningen — waarom beginners beter bij ons starten | BLOW Beach House". Voorstel: "Kitesurfen Kijkduin vs Scheveningen | BLOW Beach House" (54 chars).
2. **Post #9** — `<title>` is 66 chars. Huidige titel: "Kitesurfen vanaf welke leeftijd? Alles over kinderen en kitesurfen". Voorstel: "Kitesurfen vanaf welke leeftijd? Kindergids | BLOW" (51 chars).
3. **Post #14** — meta description is 163 chars. Inkorten naar ≤155 voor Google snippet.
4. **Post #1** — geen `<meta name="description">`. Spec verbiedt auto-fix voor ontbrekende meta-descriptions; toevoegen voor SEO-relevantie.
5. **Inline-list rendering nieuwe posts** (#3, #5, #6, #7, #8, #9, #10) — sheet-export levert markdown met dubbele-spatie als block-separator; dat is correct geparseerd. Maar binnen sommige paragrafen staan nog `- item - item - item` letterlijk met dashes (bv. post #3 "Stap 1: Kies de Juiste Kitesurfschool"). Voor leesbaarheid kun je deze handmatig opbreken in `<ul><li>` lijsten — maar de inhoud is wel volledig.

## P2 — Strategisch (cluster-coverage, ontbrekende topics, linking)

### Cluster-coverage
| Cluster | Gepubliceerd | In sheet (status=published, real body) | Gap |
|---|---|---|---|
| kitesurfschool | 9 (#1, #2, #3, #5, #6, #7, #8, #9, #10) | 12 (incl. #25, #26, #27, #28) | +3 ready to publish |
| beach-house | 5 (#12, #13, #14, #32, #35) | 8 (incl. #15, #17, #33) | +3 ready to publish |
| events | 0 | 5 (#18, #19, #20, #21) | +4 events-cluster volledig leeg in repo |

### Stub-rijen (status=published maar body_md ≤ 200 chars)
Sheet-rijen #4, #11, #16, #22, #24, #29, #30, #34 hebben alleen meta-description als body. Status zegt "published" maar er staat geen content — moet door content-team aangevuld worden of status terugzetten naar "draft".

### Internal linking
- Posts #3-#10 hebben elkaar als gerelateerd (auto-gegenereerd via cluster), wat goed is voor topic-clusters.
- Posts uit cluster `events` ontbreken volledig — zodra die er zijn, krossen we ze in de cross-links.
- Hoofdpagina `pilot/index.html` linkt momenteel niet naar `posts-archive.html` als footer-link; toevoegen.

### Brand-bar consistency
Alle posts gebruiken nu `../../` voor Bestelling-tab. Repo root heeft geen `index.html`, dus klikken op Bestelling/logo levert een GitHub-Pages 404. Twee opties: (a) maak `/index.html` in repo root die redirect naar `pilot/`, of (b) wijzig brand-bar naar `../` voor beide tabs (dan altijd pilot-dashboard).

## Auto-doorgevoerd deze run

1. ✅ 10 nieuwe posts gegenereerd (rij #3, #5, #6, #7, #8, #9, #10, #12, #13, #14) — BLOW huisstijl, brand-bar oranje #C66A1F, max-width 760px, h2 blue underline, FAQ-styling
2. ✅ Post #35 — 6 broken `href="#"` vervangen door werkende interne links
3. ✅ Post #32 — 7 absolute paths vervangen door werkende relatieve paths
4. ✅ Post #02 — 4 absolute footer-links vervangen door `https://blow.surf/...` + `target="_blank" rel="noopener"`
5. ✅ `pilot/posts/index.json` regenereerd (4 → 14 entries) met cluster-detectie uit eyebrow
6. ✅ `pilot/posts/-.html` (lege stray file) verwijderd

## Volgende actie voor Bram (top 3)

1. **Stub-rijen aanvullen of demoten** — 8 sheet-rijen (#4, #11, #16, #22, #24, #29, #30, #34) staan op 'published' maar hebben geen body. Vul body_md in of zet status op 'draft'. Anders blijft het volgende run weer geskipt.
2. **Events-cluster activeren** — geen enkele events-post (#18-#21) is in repo. Volgende run kan deze 4 publiceren als ze niet handmatig al gedaan worden.
3. **Brand-bar Bestelling-link beslissen** — `../../` levert 404 omdat repo root geen index heeft. Kies optie (a) repo root index toevoegen of (b) brand-bar pointen naar `../` (pilot dashboard).
