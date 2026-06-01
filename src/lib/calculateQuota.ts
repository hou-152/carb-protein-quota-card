import {
  Gender,
  Goal,
  TrainingStatus,
  getHeightOptions,
  getQuotaTable,
  getWeightOptions,
} from "../data/quotaTable";
import {
  calculateAerobicCaloriesPerUnit,
  getAerobicActivity,
} from "../data/aerobic";
import {
  MealStep,
  TrainingTiming,
  noStrengthMealTemplate,
  strengthMealTemplates,
} from "../data/mealTiming";
import { nearestNumber } from "./nearest";

export type TrainingLevel = "beginner" | "intermediate" | "advanced";

export interface QuotaInput {
  gender: Gender;
  trainingStatus: TrainingStatus;
  goal: Goal;
  height: number;
  weight: number;
  age: number;
  targetBmi: number;
  trainingLevel: TrainingLevel;
  strengthDays: number;
  trainingTiming: TrainingTiming;
  aerobicActivityId: string;
  aerobicWeeklyUnits: number;
}

export interface QuotaResult {
  status: "available" | "out-of-range" | "unsupported";
  matchedHeight: number;
  matchedWeight: number;
  message?: string;
  bmi: {
    value: number;
    category: string;
    targetNote: string;
  };
  energy: {
    bmr: number;
    noExerciseTotal: number;
    strengthBurn: number;
    aerobicPerUnit: number;
    dailyAerobic: number;
    balanceTraining?: number;
    balanceRest?: number;
    targetTraining?: number;
    targetRest?: number;
    balanceDaily?: number;
    targetDaily?: number;
    multiplier: number;
  };
  aerobicFoodSwap: {
    carbEquivalent: number;
    cookedRice: number;
    leanMeat: number;
    fruit: number;
    eggs: number;
    nuts: number;
  };
  mealSteps: MealStep[];
  values?: {
    trainingCarb?: number;
    restCarb?: number;
    carb?: number;
    protein: number;
  };
}

export function calculateQuota(input: QuotaInput): QuotaResult {
  const table = getQuotaTable(input.gender, input.trainingStatus, input.goal);
  const matchedHeight = nearestNumber(input.height, getHeightOptions(input.gender));
  const matchedWeight = nearestNumber(input.weight, getWeightOptions(input.gender));
  const bmi = calculateBmi(input);
  const energy = calculateEnergy(input);
  const aerobicFoodSwap = calculateAerobicFoodSwap(energy.dailyAerobic);
  const mealSteps =
    input.trainingStatus === "strength"
      ? strengthMealTemplates[input.trainingTiming]
      : noStrengthMealTemplate;

  if (!table) {
    return {
      status: "unsupported",
      matchedHeight,
      matchedWeight,
      bmi,
      energy,
      aerobicFoodSwap,
      mealSteps,
      message: "原表暂时没有“无力量训练 + 增肌”的配额，建议切换训练状态或目标。",
    };
  }

  const cell = table.cells[matchedWeight]?.[matchedHeight] ?? null;

  if (!cell) {
    return {
      status: "out-of-range",
      matchedHeight,
      matchedWeight,
      bmi,
      energy,
      aerobicFoodSwap,
      mealSteps,
      message: "这个身高体重组合不在当前截图表格范围内，先不要猜数值。",
    };
  }

  if (cell.kind === "strength") {
    return {
      status: "available",
      matchedHeight,
      matchedWeight,
      bmi,
      energy,
      aerobicFoodSwap,
      mealSteps,
      values: {
        trainingCarb: Math.round(cell.trainingCarb * input.weight),
        restCarb: Math.round(cell.restCarb * input.weight),
        protein: Math.round(cell.protein * input.weight),
      },
    };
  }

  return {
    status: "available",
    matchedHeight,
    matchedWeight,
    bmi,
    energy,
    aerobicFoodSwap,
    mealSteps,
    values: {
      carb: Math.round(cell.carb * input.weight),
      protein: Math.round(cell.protein * input.weight),
    },
  };
}

function calculateBmi(input: QuotaInput): QuotaResult["bmi"] {
  const heightMeters = input.height / 100;
  const value = round1(input.weight / heightMeters / heightMeters);
  const category =
    value < 18.5 ? "偏低" : value < 24 ? "正常" : value < 28 ? "超重" : "肥胖";
  const targetNote =
    input.gender === "male"
      ? "原表提示：普通男性减脂到 BMI 22-23 可考虑转增肌。"
      : "原表提示：普通女性减脂到 BMI 20-21 可考虑转增肌。";

  return { value, category, targetNote };
}

function calculateEnergy(input: QuotaInput): QuotaResult["energy"] {
  const activity = getAerobicActivity(input.aerobicActivityId);
  const bmr = Math.round(
    input.gender === "male"
      ? input.weight * 9.99 + input.height * 6.25 - input.age * 4.92 + 5
      : input.weight * 9.99 + input.height * 6.25 - input.age * 4.92 - 161,
  );
  const noExerciseTotal = Math.round(bmr / 0.7);
  const strengthBurn =
    input.trainingStatus === "strength"
      ? getStrengthBurn(input.gender, input.trainingLevel)
      : 0;
  const aerobicPerUnit = calculateAerobicCaloriesPerUnit(activity, input.weight);
  const dailyAerobic = Math.round((aerobicPerUnit * input.aerobicWeeklyUnits) / 7);
  const multiplier = input.goal === "fat-loss" ? 0.64 : 0.84;

  if (input.trainingStatus === "strength") {
    const balanceTraining = noExerciseTotal + strengthBurn + dailyAerobic;
    const balanceRest = noExerciseTotal + dailyAerobic;

    return {
      bmr,
      noExerciseTotal,
      strengthBurn,
      aerobicPerUnit,
      dailyAerobic,
      balanceTraining,
      balanceRest,
      targetTraining: Math.round(balanceTraining * multiplier),
      targetRest: Math.round(balanceRest * multiplier),
      multiplier,
    };
  }

  const balanceDaily = noExerciseTotal + dailyAerobic;

  return {
    bmr,
    noExerciseTotal,
    strengthBurn,
    aerobicPerUnit,
    dailyAerobic,
    balanceDaily,
    targetDaily: Math.round(balanceDaily * multiplier),
    multiplier,
  };
}

function getStrengthBurn(gender: Gender, level: TrainingLevel) {
  const male = { beginner: 150, intermediate: 200, advanced: 250 };
  const female = { beginner: 100, intermediate: 150, advanced: 200 };
  return gender === "male" ? male[level] : female[level];
}

function calculateAerobicFoodSwap(dailyAerobic: number) {
  const ratio = dailyAerobic / 100;

  return {
    carbEquivalent: Math.round(dailyAerobic / 4),
    cookedRice: Math.round(ratio * 80),
    leanMeat: Math.round(ratio * 80),
    fruit: round1(ratio),
    eggs: round1(ratio * 1.5),
    nuts: Math.round(ratio * 20),
  };
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

export function formatResultText(input: QuotaInput, result: QuotaResult) {
  const gender = input.gender === "male" ? "男" : "女";
  const trainingStatus =
    input.trainingStatus === "strength" ? "有力量训练" : "无力量训练";
  const goal = input.goal === "fat-loss" ? "减脂" : "增肌";

  if (result.status !== "available" || !result.values) {
    const message = (result.message ?? "当前组合不可用").replace(/[。.!！]+$/u, "");
    return `我用「碳水蛋白质配额卡」查询：${gender} / ${trainingStatus} / ${goal}，BMI ${result.bmi.value}（${result.bmi.category}），按 ${result.matchedHeight}cm / ${result.matchedWeight}kg 档位，${message}。仅作生活化饮食参考，不是医疗建议。`;
  }

  const carbText =
    result.values.trainingCarb && result.values.restCarb
      ? `训练日碳水 ${result.values.trainingCarb}g，休息日碳水 ${result.values.restCarb}g`
      : `每日碳水 ${result.values.carb}g`;
  const aerobicText =
    result.energy.dailyAerobic > 0
      ? `；有氧平均每天约 ${result.energy.dailyAerobic} 大卡，若全部换成碳水食物约 +${result.aerobicFoodSwap.carbEquivalent}g 碳水`
      : "";

  return `我用「碳水蛋白质配额卡」查到：${gender} / ${trainingStatus} / ${goal}，BMI ${result.bmi.value}（${result.bmi.category}），按 ${result.matchedHeight}cm / ${result.matchedWeight}kg 档位，${carbText}，每日蛋白质 ${result.values.protein}g${aerobicText}。仅作生活化饮食参考，不是医疗建议。`;
}
