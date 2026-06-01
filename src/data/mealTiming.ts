export type TrainingTiming =
  | "breakfast-early"
  | "breakfast-late"
  | "before-lunch"
  | "after-lunch"
  | "before-dinner"
  | "after-dinner"
  | "night";

export interface MealTimingOption {
  value: TrainingTiming;
  label: string;
}

export interface MealStep {
  label: string;
  role: "pre" | "post" | "other" | "snack" | "normal";
}

export const trainingTimingOptions: MealTimingOption[] = [
  { value: "breakfast-early", label: "早饭后练（早起）" },
  { value: "breakfast-late", label: "早饭后练（晚起）" },
  { value: "before-lunch", label: "午饭前练" },
  { value: "after-lunch", label: "午饭后练" },
  { value: "before-dinner", label: "晚饭前练" },
  { value: "after-dinner", label: "晚饭后练" },
  { value: "night", label: "夜里练" },
];

export const strengthMealTemplates: Record<TrainingTiming, MealStep[]> = {
  "breakfast-early": [
    { label: "早饭 = 练前餐", role: "pre" },
    { label: "练后餐", role: "post" },
    { label: "午饭 = 其他餐", role: "other" },
    { label: "晚饭 = 其他餐", role: "other" },
    { label: "零食 / 夜宵", role: "snack" },
  ],
  "breakfast-late": [
    { label: "早饭 = 练前餐", role: "pre" },
    { label: "午饭 = 练后餐", role: "post" },
    { label: "晚饭 = 其他餐", role: "other" },
    { label: "零食 / 夜宵", role: "snack" },
  ],
  "before-lunch": [
    { label: "早饭", role: "normal" },
    { label: "练前餐", role: "pre" },
    { label: "午饭 = 练后餐", role: "post" },
    { label: "晚饭 = 其他餐", role: "other" },
    { label: "零食 / 夜宵", role: "snack" },
  ],
  "after-lunch": [
    { label: "早饭", role: "normal" },
    { label: "午饭 = 练前餐", role: "pre" },
    { label: "练后餐", role: "post" },
    { label: "晚饭 = 其他餐", role: "other" },
    { label: "零食 / 夜宵", role: "snack" },
  ],
  "before-dinner": [
    { label: "早饭", role: "normal" },
    { label: "午饭 = 其他餐", role: "other" },
    { label: "练前餐", role: "pre" },
    { label: "晚饭 = 练后餐", role: "post" },
    { label: "零食 / 夜宵", role: "snack" },
  ],
  "after-dinner": [
    { label: "早饭", role: "normal" },
    { label: "午饭 = 其他餐", role: "other" },
    { label: "晚饭 = 练前餐", role: "pre" },
    { label: "练后餐", role: "post" },
    { label: "零食 / 夜宵", role: "snack" },
  ],
  night: [
    { label: "早饭", role: "normal" },
    { label: "午饭 = 其他餐", role: "other" },
    { label: "晚饭 = 其他餐", role: "other" },
    { label: "练后餐", role: "post" },
    { label: "零食 / 夜宵", role: "snack" },
  ],
};

export const noStrengthMealTemplate: MealStep[] = [
  { label: "早饭", role: "normal" },
  { label: "午饭", role: "normal" },
  { label: "晚饭", role: "normal" },
  { label: "零食 / 夜宵", role: "snack" },
];

export function getRoleLabel(role: MealStep["role"]) {
  const labels: Record<MealStep["role"], string> = {
    normal: "普通餐",
    pre: "练前",
    post: "练后最大餐",
    other: "其他餐",
    snack: "少量补充",
  };

  return labels[role];
}
