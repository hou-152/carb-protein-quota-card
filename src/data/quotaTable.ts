import sourceMarkdown from "../../content/data/quota-table-source.md?raw";

export type Gender = "male" | "female";
export type TrainingStatus = "strength" | "no-strength";
export type Goal = "fat-loss" | "muscle-gain";

export interface StrengthQuotaCell {
  kind: "strength";
  trainingCarb: number;
  restCarb: number;
  protein: number;
}

export interface NoStrengthQuotaCell {
  kind: "no-strength";
  carb: number;
  protein: number;
}

export type QuotaCell = StrengthQuotaCell | NoStrengthQuotaCell | null;

export interface QuotaTable {
  gender: Gender;
  trainingStatus: TrainingStatus;
  goal: Goal;
  label: string;
  heights: number[];
  weights: number[];
  cells: Record<number, Record<number, QuotaCell>>;
}

const titleMap: Record<
  string,
  Pick<QuotaTable, "gender" | "trainingStatus" | "goal">
> = {
  "健身男性｜减脂": {
    gender: "male",
    trainingStatus: "strength",
    goal: "fat-loss",
  },
  "健身男性｜增肌": {
    gender: "male",
    trainingStatus: "strength",
    goal: "muscle-gain",
  },
  "健身女性｜减脂": {
    gender: "female",
    trainingStatus: "strength",
    goal: "fat-loss",
  },
  "健身女性｜增肌": {
    gender: "female",
    trainingStatus: "strength",
    goal: "muscle-gain",
  },
  "无力训男性｜减脂": {
    gender: "male",
    trainingStatus: "no-strength",
    goal: "fat-loss",
  },
  "无力训女性｜减脂": {
    gender: "female",
    trainingStatus: "no-strength",
    goal: "fat-loss",
  },
};

function parseCell(value: string, trainingStatus: TrainingStatus): QuotaCell {
  if (value === "-") return null;

  const parts = value.split("/").map(Number);

  if (trainingStatus === "strength") {
    const [trainingCarb, restCarb, protein] = parts;
    return { kind: "strength", trainingCarb, restCarb, protein };
  }

  const [carb, protein] = parts;
  return { kind: "no-strength", carb, protein };
}

function parseQuotaTables(markdown: string): QuotaTable[] {
  const sectionPattern = /^# \d+\. ([^\n]+)[\s\S]*?```csv\n([\s\S]*?)```/gm;
  const tables: QuotaTable[] = [];

  for (const match of markdown.matchAll(sectionPattern)) {
    const [, title, csv] = match;
    const meta = titleMap[title.trim()];
    if (!meta) continue;

    const lines = csv
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const [header, ...rows] = lines;
    const heights = header
      .split(",")
      .slice(1)
      .map((height) => Number(height.replace("cm", "")));
    const cells: QuotaTable["cells"] = {};
    const weights: number[] = [];

    for (const row of rows) {
      const [weightValue, ...values] = row.split(",");
      const weight = Number(weightValue);
      weights.push(weight);
      cells[weight] = {};

      values.forEach((value, index) => {
        cells[weight][heights[index]] = parseCell(value, meta.trainingStatus);
      });
    }

    tables.push({
      ...meta,
      label: title.trim(),
      heights,
      weights,
      cells,
    });
  }

  return tables;
}

export const quotaTables = parseQuotaTables(sourceMarkdown);

export function getQuotaTable(
  gender: Gender,
  trainingStatus: TrainingStatus,
  goal: Goal,
) {
  return quotaTables.find(
    (table) =>
      table.gender === gender &&
      table.trainingStatus === trainingStatus &&
      table.goal === goal,
  );
}

export function getHeightOptions(gender: Gender) {
  return gender === "male"
    ? [160, 165, 170, 175, 180, 185, 190]
    : [150, 155, 160, 165, 170, 175, 180];
}

export function getWeightOptions(gender: Gender) {
  return gender === "male"
    ? [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130]
    : [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120];
}

