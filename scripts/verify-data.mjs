import fs from "node:fs";

const markdown = fs.readFileSync("content/data/quota-table-source.md", "utf8");

const titleMap = {
  "健身男性｜减脂": "male-strength-fat-loss",
  "健身男性｜增肌": "male-strength-muscle-gain",
  "健身女性｜减脂": "female-strength-fat-loss",
  "健身女性｜增肌": "female-strength-muscle-gain",
  "无力训男性｜减脂": "male-no-strength-fat-loss",
  "无力训女性｜减脂": "female-no-strength-fat-loss",
};

const tables = {};
const sectionPattern = /^# \d+\. ([^\n]+)[\s\S]*?```csv\n([\s\S]*?)```/gm;

for (const match of markdown.matchAll(sectionPattern)) {
  const [, title, csv] = match;
  const key = titleMap[title.trim()];
  if (!key) continue;

  const [header, ...rows] = csv.trim().split("\n");
  const heights = header
    .split(",")
    .slice(1)
    .map((height) => Number(height.replace("cm", "")));

  tables[key] = {};
  for (const row of rows) {
    const [weightValue, ...values] = row.split(",");
    const weight = Number(weightValue);
    tables[key][weight] = {};
    values.forEach((value, index) => {
      tables[key][weight][heights[index]] = value;
    });
  }
}

const checks = [
  ["male-strength-fat-loss", 75, 175, "2.6/2.1/1.4"],
  ["male-strength-muscle-gain", 70, 180, "3.8/3.1/1.6"],
  ["female-strength-fat-loss", 60, 170, "2.5/2.1/1.3"],
  ["female-strength-muscle-gain", 55, 165, "3.3/2.8/1.4"],
  ["male-no-strength-fat-loss", 90, 185, "2.4/1.0"],
  ["female-no-strength-fat-loss", 75, 160, "1.9/1.0"],
];

for (const [table, weight, height, expected] of checks) {
  const actual = tables[table]?.[weight]?.[height];
  if (actual !== expected) {
    throw new Error(`${table} ${weight}kg ${height}cm expected ${expected}, got ${actual}`);
  }
}

console.log(`Verified ${Object.keys(tables).length} tables and ${checks.length} sample cells.`);

