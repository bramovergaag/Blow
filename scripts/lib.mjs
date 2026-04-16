// BLOW shared helpers — pure functions, no I/O.
// Alle formules gelijk aan de skill-definities in ~/.claude/scheduled-tasks/blow-*.

export const NL_MONTHS = [
  "januari","februari","maart","april","mei","juni",
  "juli","augustus","september","oktober","november","december",
];

export const NL_DAGEN = [
  "Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag",
];

/** Parse 'YYYY-MM-DD' and return {y,m,d} with numeric fields. */
export function parseDs(ds) {
  const [y, m, d] = ds.split("-").map(Number);
  return { y, m, d };
}

/** Day of week for 'YYYY-MM-DD' — timezone-agnostic. 0=Sun..6=Sat (JS getDay()). */
export function dowFromDs(ds) {
  const { y, m, d } = parseDs(ds);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function datumNL(ds) {
  const { m, d } = parseDs(ds);
  return `${d} ${NL_MONTHS[m - 1]}`;
}

export function dagNaam(ds) {
  return NL_DAGEN[dowFromDs(ds)];
}

/** Add `days` days to a 'YYYY-MM-DD' string, return same format. */
export function addDays(ds, days) {
  const { y, m, d } = parseDs(ds);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/** Current 'YYYY-MM-DD' in Europe/Amsterdam. */
export function todayNL() {
  // 'sv' locale gives ISO-like 'YYYY-MM-DD HH:MM:SS'
  return new Date().toLocaleString("sv", { timeZone: "Europe/Amsterdam" }).slice(0, 10);
}

/** ISO 8601 timestamp with Europe/Amsterdam offset — matches existing format. */
export function isoNowNL() {
  const now = new Date();
  const tz = "Europe/Amsterdam";
  const localStr = now.toLocaleString("sv", { timeZone: tz }).replace(" ", "T");
  const localDate = new Date(now.toLocaleString("sv", { timeZone: tz }) + "Z");
  const utcDate = new Date(now.toLocaleString("sv", { timeZone: "UTC" }) + "Z");
  const offsetMin = Math.round((localDate - utcDate) / 60000);
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const oh = String(Math.floor(abs / 60)).padStart(2, "0");
  const om = String(abs % 60).padStart(2, "0");
  return `${localStr}${sign}${oh}:${om}`;
}

/** Linear interpolation temp_base lookup. */
export function tempToBase(tempBase, tempMean) {
  const t = Math.round(tempMean);
  if (tempBase[String(t)] !== undefined) return tempBase[String(t)];
  // Find bracketing integer keys, skip "_comment".
  const keys = Object.keys(tempBase)
    .filter((k) => /^-?\d+$/.test(k))
    .map(Number)
    .sort((a, b) => a - b);
  if (t <= keys[0]) return tempBase[String(keys[0])];
  if (t >= keys[keys.length - 1]) return tempBase[String(keys[keys.length - 1])];
  let lo = keys[0], hi = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (keys[i] <= t && t <= keys[i + 1]) { lo = keys[i]; hi = keys[i + 1]; break; }
  }
  const frac = (t - lo) / (hi - lo);
  return tempBase[String(lo)] + frac * (tempBase[String(hi)] - tempBase[String(lo)]);
}

/** Sunshine hours → "zonnig" | "halfbewolkt" | "bewolkt". */
export function classifyZon(classifiers, sunshineHrs) {
  if (sunshineHrs >= classifiers.zon.zonnig.min_sunshine_hrs) return "zonnig";
  if (sunshineHrs >= classifiers.zon.halfbewolkt.min_sunshine_hrs) return "halfbewolkt";
  return "bewolkt";
}

/** Rainfall mm → "zwaar" | "matig" | "licht" | "geen". */
export function classifyNeerslag(classifiers, rainfallMm) {
  if (rainfallMm >= classifiers.neerslag.zwaar.min_mm) return "zwaar";
  if (rainfallMm >= classifiers.neerslag.matig.min_mm) return "matig";
  if (rainfallMm >= classifiers.neerslag.licht.min_mm) return "licht";
  return "geen";
}

/** Holiday multiplier: NL 1.45 > NRW 1.30 > 1.00. */
export function holidayMult(config, ds) {
  if (config.nl_holidays_2026 && config.nl_holidays_2026[ds]) return 1.45;
  if (config.nrw_holidays_2026 && config.nrw_holidays_2026[ds]) return 1.30;
  return 1.00;
}

/** School-holiday multiplier: 1.25 if ds within any NL or NRW school range, else 1.00. */
export function schoolMult(config, ds) {
  const ranges = [
    ...(config.nl_school_holidays_2026 || []),
    ...(config.nrw_school_holidays_2026 || []),
  ];
  for (const r of ranges) {
    if (r.from <= ds && ds <= r.to) return 1.25;
  }
  return 1.00;
}

/** Flags (for output JSON) — used in voorspelling.json. */
export function calcFlags(config, ds) {
  return {
    nl_holiday: !!(config.nl_holidays_2026 && config.nl_holidays_2026[ds]),
    nrw_holiday: !!(config.nrw_holidays_2026 && config.nrw_holidays_2026[ds]),
    nl_school: (config.nl_school_holidays_2026 || []).some((r) => r.from <= ds && ds <= r.to),
    nrw_school: (config.nrw_school_holidays_2026 || []).some((r) => r.from <= ds && ds <= r.to),
  };
}
