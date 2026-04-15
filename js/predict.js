// =============================================================================
// BLOW pizzabollen voorspelling
// =============================================================================
// Gebruikt door dashboard én door Claude Cowork taken (browser + server-side).
// Verwacht config.json en weer.json uit ../data/
// -----------------------------------------------------------------------------

export const DAGNAMEN_NL = ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"];
export const MAANDEN_NL  = ["januari","februari","maart","april","mei","juni",
                            "juli","augustus","september","oktober","november","december"];

// -----------------------------------------------------------------------------
// tempToBase — opzoeken in config.temp_base met lineaire interpolatie
// -----------------------------------------------------------------------------
export function tempToBase(temp, config) {
  const t = Math.round(temp);
  const keys = Object.keys(config.temp_base).map(Number).sort((a,b)=>a-b);
  const lo = keys[0], hi = keys[keys.length-1];
  if (t <= lo) return config.temp_base[lo];
  if (t >= hi) return config.temp_base[hi];
  if (config.temp_base[t] !== undefined) return config.temp_base[t];
  const below = keys.filter(k => k < t).at(-1);
  const above = keys.filter(k => k > t)[0];
  const frac  = (t - below) / (above - below);
  return config.temp_base[below] + frac * (config.temp_base[above] - config.temp_base[below]);
}

// -----------------------------------------------------------------------------
// classifyZon — zonuren → label
// -----------------------------------------------------------------------------
export function classifyZon(sunshine_hrs, config) {
  const c = config.classifiers.zon;
  if (sunshine_hrs >= c.zonnig.min_sunshine_hrs)      return "zonnig";
  if (sunshine_hrs >= c.halfbewolkt.min_sunshine_hrs) return "halfbewolkt";
  return "bewolkt";
}

// -----------------------------------------------------------------------------
// classifyNeerslag — mm → label
// -----------------------------------------------------------------------------
export function classifyNeerslag(mm, config) {
  const c = config.classifiers.neerslag;
  if (mm >= c.zwaar.min_mm) return "zwaar";
  if (mm >= c.matig.min_mm) return "matig";
  if (mm >= c.licht.min_mm) return "licht";
  return "geen";
}

// -----------------------------------------------------------------------------
// isInRange — check of ds in een [{from,to}] array valt
// -----------------------------------------------------------------------------
export function isInRange(ds, ranges) {
  return ranges.some(r => ds >= r.from && ds <= r.to);
}

// -----------------------------------------------------------------------------
// predict — kern voorspellingsformule
// -----------------------------------------------------------------------------
// Input:
//   day     = { ds: "YYYY-MM-DD", temp, zon, neerslag }
//             (of: { ds, temp_mean, sunshine_hrs, rainfall_mm } → wordt gemapped)
//   config  = object uit config.json
//
// Output:
//   { pred, pred_buffer, dow, month, isNLh, isNRWh, isNLs, isNRWs,
//     multipliers: { base, sm, dm, nm, zm, hm, schm } }
// -----------------------------------------------------------------------------
export function predict(day, config) {
  // Normalize input — accepteer ruwe weerwaarden of pre-classified
  let zon = day.zon;
  let neerslag = day.neerslag;
  if (zon === undefined && day.sunshine_hrs !== undefined)  zon = classifyZon(day.sunshine_hrs, config);
  if (neerslag === undefined && day.rainfall_mm !== undefined) neerslag = classifyNeerslag(day.rainfall_mm, config);
  const temp = day.temp ?? day.temp_mean ?? 16;

  const d       = new Date(day.ds + "T12:00:00");
  const dow     = d.getDay();         // 0=zo, 1=ma, ..., 6=za
  const month   = d.getMonth() + 1;
  const isNLh   = day.ds in (config.nl_holidays_2026  || {});
  const isNRWh  = day.ds in (config.nrw_holidays_2026 || {});
  const isNLs   = isInRange(day.ds,  config.nl_school_holidays_2026  || []);
  const isNRWs  = isInRange(day.ds,  config.nrw_school_holidays_2026 || []);

  const base = tempToBase(temp, config);
  const sm   = config.season_mult[String(month)] ?? 0.5;
  const dm   = config.dow_mult[String(dow)] ?? 1.0;
  const nm   = config.neerslag_mult[neerslag] ?? 1.0;
  const zm   = config.zon_mult[zon] ?? 1.0;
  const hm   = isNLh ? config.holiday_mult.nl
             : isNRWh ? config.holiday_mult.nrw
             : config.holiday_mult.none;
  const schm = (isNLs || isNRWs) ? config.school_mult.active : config.school_mult.inactive;

  const raw         = base * sm * dm * nm * zm * hm * schm;
  const pred        = Math.max(0, Math.round(raw));
  const pred_buffer = Math.round(pred * (1 + config.buffer_pct.value));

  return {
    pred, pred_buffer,
    dow, month, zon, neerslag, temp,
    isNLh, isNRWh, isNLs, isNRWs,
    multipliers: { base: +base.toFixed(1), sm, dm, nm, zm, hm, schm }
  };
}

// -----------------------------------------------------------------------------
// predictPeriode — voorspel meerdere dagen en aggregeer
// -----------------------------------------------------------------------------
export function predictPeriode(days, config) {
  const results = days.map(d => ({ ...d, result: predict(d, config) }));
  const totaal         = results.reduce((s, r) => s + r.result.pred, 0);
  const totaal_buffer  = Math.round(totaal * (1 + config.buffer_pct.value));
  return {
    days: results,
    totaal,
    totaal_buffer,
    buffer_pct: config.buffer_pct.value
  };
}

// -----------------------------------------------------------------------------
// formatDatumNL — "24 april" style
// -----------------------------------------------------------------------------
export function formatDatumNL(ds) {
  const d = new Date(ds + "T12:00:00");
  return `${d.getDate()} ${MAANDEN_NL[d.getMonth()]}`;
}

export function getDagnaamNL(ds) {
  const d = new Date(ds + "T12:00:00");
  return DAGNAMEN_NL[d.getDay()];
}
