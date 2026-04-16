// BLOW: fetch Open-Meteo 14-daagse forecast en schrijf data/weer.json.
// Cloud-equivalent van skill blow-weer-update.

import { writeFile } from "node:fs/promises";
import { isoNowNL } from "./lib.mjs";

const URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=52.060&longitude=4.196" +
  "&daily=temperature_2m_mean,temperature_2m_max,precipitation_sum,sunshine_duration,windspeed_10m_mean" +
  "&timezone=Europe%2FAmsterdam&forecast_days=14";

const round1 = (x) => Math.round(x * 10) / 10;

async function main() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  const data = await res.json();
  const d = data.daily;
  if (!d || !Array.isArray(d.time)) throw new Error("Unexpected Open-Meteo response (no daily.time)");

  const forecast = d.time.map((ds, i) => ({
    ds,
    temp_mean: round1(d.temperature_2m_mean[i]),
    temp_max: round1(d.temperature_2m_max[i]),
    sunshine_hrs: round1(d.sunshine_duration[i] / 3600),
    rainfall_mm: round1(d.precipitation_sum[i]),
    wind_mean_ms: round1(d.windspeed_10m_mean[i] / 3.6),
  }));

  const out = {
    schema_version: "1.0",
    generated_at: isoNowNL(),
    source: "open-meteo.com (Kijkduin strand)",
    location: { lat: 52.060, lon: 4.196, naam: "Kijkduin strand (Zandmotorpad)" },
    forecast,
  };

  // Pretty format: matches existing weer.json layout (one forecast entry per line).
  const body = formatWeerJson(out);
  await writeFile("data/weer.json", body, "utf8");

  const temps = forecast.map((f) => f.temp_mean);
  console.log(`✓ ${forecast.length} dagen opgehaald: ${forecast[0].ds} t/m ${forecast.at(-1).ds}`);
  console.log(`  temp_mean range: ${Math.min(...temps)}°C..${Math.max(...temps)}°C`);
}

function formatWeerJson(obj) {
  // Preserve the compact-per-day format used by the existing file.
  const { schema_version, generated_at, source, location, forecast } = obj;
  const lines = [
    "{",
    `  "schema_version": ${JSON.stringify(schema_version)},`,
    `  "generated_at": ${JSON.stringify(generated_at)},`,
    `  "source": ${JSON.stringify(source)},`,
    `  "location": ${JSON.stringify(location)},`,
    `  "forecast": [`,
  ];
  forecast.forEach((f, i) => {
    const comma = i < forecast.length - 1 ? "," : "";
    lines.push(`    ${JSON.stringify(f)}${comma}`);
  });
  lines.push("  ]");
  lines.push("}");
  return lines.join("\n") + "\n";
}

main().catch((err) => {
  console.error("weer-update failed:", err.message);
  process.exit(1);
});
