// BLOW: bereken voorspelling en post naar Make webhook.
// Aan te roepen met één argument: "maandag" of "vrijdag".
// Cloud-equivalent van skills blow-bestel-maandag / blow-bestel-vrijdag.

import { readFile, writeFile } from "node:fs/promises";
import {
  addDays, calcFlags, classifyNeerslag, classifyZon, dagNaam, datumNL,
  dowFromDs, holidayMult, isoNowNL, parseDs, schoolMult, tempToBase, todayNL,
} from "./lib.mjs";

const TASKS = {
  maandag: { offset: 3, days: 4 },   // Ma -> levering Do t/m Zo (4 dagen)
  vrijdag: { offset: 3, days: 3 },   // Vr -> levering Ma t/m Wo (3 dagen)
};

async function main() {
  const task = process.argv[2];
  if (!TASKS[task]) {
    console.error("Usage: node scripts/bestel.mjs <maandag|vrijdag>");
    process.exit(2);
  }
  const def = TASKS[task];

  // Idempotentie: bij scheduled trigger skip als voorspelling voor deze taak
  // al vandaag gemaakt is. Voorkomt dubbele WhatsApp van de 2 DST-crons.
  const isSchedule = process.env.GITHUB_EVENT_NAME === "schedule";
  if (isSchedule) {
    try {
      const existing = JSON.parse(await readFile("data/voorspelling.json", "utf8"));
      if (
        existing.task === `blow-bestel-${task}` &&
        existing.generated_at &&
        existing.generated_at.slice(0, 10) === todayNL()
      ) {
        console.log(`⏭  Voorspelling '${task}' is al vandaag (${todayNL()}) gegenereerd — skip.`);
        return;
      }
    } catch { /* geen bestaand bestand / andere taak → door */ }
  }

  const [weer, config] = await Promise.all([
    readFile("data/weer.json", "utf8").then(JSON.parse),
    readFile("data/config.json", "utf8").then(JSON.parse),
  ]);

  const waarschuwingen = [];

  // Staleness check — >36 uur oud.
  const ageHrs = (Date.now() - new Date(weer.generated_at).getTime()) / 36e5;
  if (ageHrs > 36) {
    waarschuwingen.push(`[WAARSCHUWING: weerdata is ${ageHrs.toFixed(1)} uur oud]`);
  }

  const today = todayNL();
  const startDs = addDays(today, def.offset);

  // Sanity-check: vandaag moet Ma (1) resp. Vr (5) zijn in NL tijd.
  const expectedDow = task === "maandag" ? 1 : 5;
  const actualDow = dowFromDs(today);
  if (actualDow !== expectedDow) {
    waarschuwingen.push(
      `[DAGFOUT: taak '${task}' verwacht ${expectedDow === 1 ? "Maandag" : "Vrijdag"}, ` +
      `maar vandaag is ${dagNaam(today)}]`,
    );
  }

  // Bouw dagen-array.
  const dagen = [];
  for (let i = 0; i < def.days; i++) {
    const ds = addDays(startDs, i);
    let fc = (weer.forecast || []).find((f) => f.ds === ds);
    if (!fc) {
      waarschuwingen.push(`[ONTBREKEND: ${ds}]`);
      fc = { ds, temp_mean: 16, sunshine_hrs: 3, rainfall_mm: 0 };
    }

    const zonLabel = classifyZon(config.classifiers, fc.sunshine_hrs);
    const neerslagLabel = classifyNeerslag(config.classifiers, fc.rainfall_mm);
    const { m } = parseDs(ds);
    const dow = dowFromDs(ds);

    const baseRaw = tempToBase(config.temp_base, fc.temp_mean);
    const base = Math.round(baseRaw);
    const sm = config.season_mult[String(m)];
    const dm = config.dow_mult[String(dow)];
    const nm = config.neerslag_mult[neerslagLabel];
    const zm = config.zon_mult[zonLabel];
    const hm = holidayMult(config, ds);
    const schm = schoolMult(config, ds);

    const pred = Math.round(baseRaw * sm * dm * nm * zm * hm * schm);
    const pred_buffer = Math.round(pred * (1 + config.buffer_pct.value));

    dagen.push({
      ds,
      dag: dagNaam(ds),
      datum_nl: datumNL(ds),
      weer: { temp: fc.temp_mean, zon: zonLabel, neerslag: neerslagLabel },
      flags: calcFlags(config, ds),
      multipliers: { base, sm, dm, nm, zm, hm, schm },
      pred,
      pred_buffer,
    });
  }

  const totaal = dagen.reduce((s, d) => s + d.pred, 0);
  const totaal_buffer = Math.round(totaal * 1.10);

  const eindDs = dagen[dagen.length - 1].ds;
  const voorspelling = {
    schema_version: "1.0",
    generated_at: isoNowNL(),
    task: `blow-bestel-${task}`,
    levering_vanaf: startDs,
    bestelperiode: { from: startDs, to: eindDs, days: def.days },
    dagen,
    totaal,
    totaal_buffer,
    waarschuwingen,
  };

  await writeFile("data/voorspelling.json", JSON.stringify(voorspelling, null, 2) + "\n", "utf8");

  // Bouw WhatsApp-bericht. Dag-namen zijn afgeleid van de werkelijke
  // datum, niet van de taak — zo klopt het bericht ook bij handmatige
  // runs (workflow_dispatch) op een afwijkende weekdag.
  const leveringFrom = `${dagNaam(startDs)} ${datumNL(startDs)}`;
  const leveringTo = `${dagNaam(eindDs)} ${datumNL(eindDs)}`;
  const perDag = dagen
    .map((d) => `• ${d.dag} ${d.datum_nl}: ${d.weer.zon}, ${d.weer.temp}°C → ca. ${d.pred_buffer}`)
    .join("\n");
  const message =
    `Hoi! Herinnering pizzabollen bestelling voor levering ${leveringFrom} t/m ${leveringTo}.\n\n` +
    `Totaal aanbevolen: ca. ${totaal_buffer} stuks (incl. 10% buffer)\n\n` +
    `Per dag:\n${perDag}\n\n` +
    `Graag voor vanavond bevestigen. 🍕`;

  // POST naar Make webhook.
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  let webhookStatus = "skipped (geen MAKE_WEBHOOK_URL)";
  if (webhookUrl) {
    // Per-dag regels zonder bullet, geschikt als losse template-variabele
    // in WhatsApp Business Cloud (Meta accepteert line breaks in runtime
    // values, alleen niet in de sample waarden).
    const perDagPlain = dagen
      .map((d) => `${d.dag} ${d.datum_nl}: ${d.weer.zon}, ${d.weer.temp}°C ca. ${d.pred_buffer}`)
      .join("\n");

    const payload = {
      task: `blow-bestel-${task}`,
      // Losse velden voor WA-template mapping ({{1}}..{{4}}):
      levering_van: leveringFrom,            // "Maandag 20 april"
      levering_tot: leveringTo,              // "Woensdag 22 april"
      totaal: totaal_buffer,                 // 61
      per_dag: perDagPlain,                  // meerdere regels, geen bullets
      // Backwards-compat velden:
      levering_vanaf: leveringFrom.toLowerCase(),
      message,
    };
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      webhookStatus = `HTTP ${res.status}`;
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error(`webhook faalde: ${webhookStatus} — ${body.slice(0, 200)}`);
      }
    } catch (e) {
      webhookStatus = `error: ${e.message}`;
      console.error("webhook error:", e.message);
    }
  }

  // Rapport naar stdout.
  console.log(`✓ Voorspelling ${task}: ${startDs} t/m ${eindDs}`);
  for (const d of dagen) {
    console.log(
      `  ${d.ds} ${d.dag.padEnd(9)} ${String(d.weer.temp).padStart(4)}°C ` +
      `${d.weer.zon.padEnd(11)} ${d.weer.neerslag.padEnd(5)} ` +
      `hm=${d.multipliers.hm} schm=${d.multipliers.schm} → ${d.pred} (buf ${d.pred_buffer})`,
    );
  }
  console.log(`  totaal=${totaal}  totaal_buffer=${totaal_buffer}`);
  console.log(`  webhook: ${webhookStatus}`);
  if (waarschuwingen.length) console.log(`  waarschuwingen: ${waarschuwingen.join(" | ")}`);
}

main().catch((err) => {
  console.error("bestel failed:", err.message);
  process.exit(1);
});
