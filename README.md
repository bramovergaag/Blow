# BLOW Beach House — Pizzabollen Voorspelling

Dashboard + data + voorspellingsmodel voor de wekelijkse pizzabollen-bestelling bij BLOW Beach House (Kijkduin, Den Haag).

**Repository:** https://github.com/bramovergaag/Blow
**Live dashboard:** https://bramovergaag.github.io/Blow/ *(na Pages activatie)*

---

## Architectuur

```
┌─ Make "BLOW-01 Weerdata"     dagelijks 07:00 NL
│    Open-Meteo → data/weer.json → git commit
│
├─ GitHub repo (this)
│    data/weer.json         ← weerverwachting (14 dagen)
│    data/verkoop.json      ← historische verkoop (723 dagen)
│    data/config.json       ← model multipliers + feestdagen
│    index.html             ← dashboard (GitHub Pages)
│    js/predict.js          ← ÉÉN gedeelde voorspellingslogica
│
├─ Cowork taken   maandag & vrijdag 08:00 NL
│    lees weer.json + config.json
│    bereken voorspelling → commit data/voorspelling.json
│    POST webhook → Make
│    Gmail draft (backup/audit)
│
└─ Make "BLOW-02 WhatsApp sender"   trigger: webhook
     payload → 2Chat → WhatsApp groep "Claude BLOW bestelling"
```

---

## Folder structuur

```
blow-dashboard/
├── index.html              Dashboard (GitHub Pages)
├── css/style.css           Huisstijl styling
├── js/predict.js           Voorspellingsfunctie (gedeeld)
├── data/
│   ├── weer.json           Forecast — wordt bijgewerkt door Make BLOW-01
│   ├── verkoop.json        Historische data (read-only)
│   ├── config.json         Model parameters
│   └── voorspelling.json   Laatste run output (Claude)
├── _archief/               Oude bestanden (reference)
└── README.md
```

---

## Voorspellingsmodel

Per dag:

    pred = base(temp) × season × dag × neerslag × zon × feest × school

Vermenigvuldigers uit `data/config.json`. Daarna +10% buffer voor verlies/uitval.

| Factor | Bron | Waarden |
|---|---|---|
| `base` | historische verkoop per °C | 11 bij 4°C → 158 bij 25°C |
| `season` | kalendermaand | 0.30 winter → 1.25 augustus |
| `dag` | weekdag | 0.55 di → 1.55 za |
| `neerslag` | mm regen | 1.0 geen → 0.40 zwaar |
| `zon` | zonuren | 0.80 bewolkt → 1.15 zonnig |
| `feest` | NL/NRW feestdag | 1.0 / 1.30 / 1.45 |
| `school` | NL/NRW schoolvakantie | 1.0 of 1.25 |

Basis: 723 dagen verkoop (2022-03-02 → 2025-10-26, Pizza_Data_Combined.xlsx).

---

## Bestelritme

| Taak | Draait op | Levering | Dekt |
|---|---|---|---|
| `blow-bestel-maandag` | maandag 08:00 | donderdag | do, vr, za, zo (4 dagen) |
| `blow-bestel-vrijdag` | vrijdag 08:00  | maandag   | ma, di, wo (3 dagen) |

---

## Locaal draaien

```bash
cd blow-dashboard
python -m http.server 8765
# open http://localhost:8765
```

Dashboard werkt ook gewoon vanaf een file-server zonder build-stap.

---

## Make scenarios — opnieuw opzetten

### BLOW-01 Weerdata update

| Module | Config |
|---|---|
| Schedule | Daily 07:00 NL (= 01:00 NY in Make) |
| HTTP → Make a request | GET `https://api.open-meteo.com/v1/forecast?latitude=52.065&longitude=4.247&daily=temperature_2m_mean,temperature_2m_max,precipitation_sum,sunshine_duration,windspeed_10m_mean&timezone=Europe%2FAmsterdam&forecast_days=14` |
| JSON parse | Convert daily array naar `{ ds, temp_mean, temp_max, sunshine_hrs, rainfall_mm, wind_mean_ms }` objecten |
| GitHub → Create or update file | `data/weer.json` met base64-encoded JSON payload |

### BLOW-02 WhatsApp sender

| Module | Config |
|---|---|
| Webhook (custom) | Trigger URL opslaan in Cowork-task omgeving |
| 2Chat → Send WhatsApp group message | Groep: "Claude BLOW bestelling", body uit webhook payload `{{body.message}}` |

---

## Oude bestanden

Zie `_archief/` — behoud als referentie, niet meer gebruikt:

- `fetch_weer.py` (onbetrouwbaar, 403/timeout)
- `run_weer.bat`
- `bestel_herinnering.py`
- `voorspelling_weer.html` (predecessor)
