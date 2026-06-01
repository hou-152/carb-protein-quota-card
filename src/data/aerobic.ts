export type AerobicUnit = "hour" | "ten-thousand-steps";

export interface AerobicActivity {
  id: string;
  label: string;
  variant: string;
  perKgCalories: number;
  unit: AerobicUnit;
}

export const aerobicActivities: AerobicActivity[] = [
  { id: "a10", label: "平地走", variant: "每走一万步", perKgCalories: 3.8, unit: "ten-thousand-steps" },
  { id: "a11", label: "平地走", variant: "每走一小时", perKgCalories: 3.8, unit: "hour" },
  { id: "a12", label: "爬坡走", variant: "坡度5°（一般选择）", perKgCalories: 5.5, unit: "hour" },
  { id: "a13", label: "爬坡走", variant: "坡度10°（很累）", perKgCalories: 8, unit: "hour" },
  { id: "a14", label: "跑步", variant: "6", perKgCalories: 5.5, unit: "hour" },
  { id: "a15", label: "跑步", variant: "7", perKgCalories: 7.2, unit: "hour" },
  { id: "a16", label: "跑步", variant: "8", perKgCalories: 9.5, unit: "hour" },
  { id: "a17", label: "跑步", variant: "9", perKgCalories: 9.6, unit: "hour" },
  { id: "a18", label: "跑步", variant: "9.66", perKgCalories: 9.768, unit: "hour" },
  { id: "a19", label: "跑步", variant: "12", perKgCalories: 10.1, unit: "hour" },
  { id: "a20", label: "跑步", variant: "13", perKgCalories: 10.1, unit: "hour" },
  { id: "a21", label: "跑步", variant: "14", perKgCalories: 10.4, unit: "hour" },
  { id: "a22", label: "跑步", variant: "15", perKgCalories: 10.9, unit: "hour" },
  { id: "a23", label: "跑步", variant: "16", perKgCalories: 12.7, unit: "hour" },
  { id: "a24", label: "户外骑行", variant: "10", perKgCalories: 3.6, unit: "hour" },
  { id: "a25", label: "户外骑行", variant: "12", perKgCalories: 3.9, unit: "hour" },
  { id: "a26", label: "户外骑行", variant: "13", perKgCalories: 4.4, unit: "hour" },
  { id: "a27", label: "户外骑行", variant: "15", perKgCalories: 5.5, unit: "hour" },
  { id: "a28", label: "户外骑行", variant: "18", perKgCalories: 6.5, unit: "hour" },
  { id: "a29", label: "户外骑行", variant: "27", perKgCalories: 7.5, unit: "hour" },
  { id: "a30", label: "户外骑行", variant: "31", perKgCalories: 10, unit: "hour" },
  { id: "a31", label: "户外骑行", variant: "34", perKgCalories: 12, unit: "hour" },
  { id: "a32", label: "室内单车", variant: "功率50-90W", perKgCalories: 4.8, unit: "hour" },
  { id: "a33", label: "室内单车", variant: "功率90-100W", perKgCalories: 6.8, unit: "hour" },
  { id: "a34", label: "室内单车", variant: "功率100-160W", perKgCalories: 8.8, unit: "hour" },
  { id: "a35", label: "室内单车", variant: "功率160-200W", perKgCalories: 11, unit: "hour" },
  { id: "a36", label: "室内单车", variant: "功率200-270W", perKgCalories: 14, unit: "hour" },
  { id: "a37", label: "游泳", variant: "1.09728", perKgCalories: 4.224, unit: "hour" },
  { id: "a38", label: "游泳", variant: "2.46888", perKgCalories: 7.656, unit: "hour" },
  { id: "a39", label: "游泳", variant: "2.7432", perKgCalories: 9.24, unit: "hour" },
  { id: "a40", label: "球类", variant: "篮球", perKgCalories: 6.1, unit: "hour" },
  { id: "a41", label: "球类", variant: "足球", perKgCalories: 7, unit: "hour" },
  { id: "a42", label: "球类", variant: "排球", perKgCalories: 4.1, unit: "hour" },
  { id: "a43", label: "球类", variant: "网球", perKgCalories: 8.9, unit: "hour" },
  { id: "a44", label: "球类", variant: "乒乓球", perKgCalories: 6.6, unit: "hour" },
  { id: "a45", label: "球类", variant: "羽毛球", perKgCalories: 7.4, unit: "hour" },
  { id: "a46", label: "跳操跟练", variant: "轻松强度", perKgCalories: 2.3, unit: "hour" },
  { id: "a47", label: "跳操跟练", variant: "中等强度", perKgCalories: 4, unit: "hour" },
  { id: "a48", label: "跳操跟练", variant: "剧烈强度", perKgCalories: 6, unit: "hour" },
  { id: "a49", label: "室内其他项目", variant: "瑜伽", perKgCalories: 3.1, unit: "hour" },
  { id: "a50", label: "室内其他项目", variant: "舞蹈", perKgCalories: 5, unit: "hour" },
  { id: "a51", label: "室内其他项目", variant: "椭圆仪", perKgCalories: 5, unit: "hour" },
  { id: "a52", label: "室内其他项目", variant: "普拉提", perKgCalories: 3, unit: "hour" },
  { id: "a53", label: "室内其他项目", variant: "健身环", perKgCalories: 5, unit: "hour" },
  { id: "a54", label: "爬楼", variant: "上楼", perKgCalories: 8, unit: "hour" },
  { id: "a55", label: "爬楼", variant: "下楼", perKgCalories: 3.1, unit: "hour" },
  { id: "a56", label: "划船机", variant: "功率100W", perKgCalories: 7, unit: "hour" },
  { id: "a57", label: "划船机", variant: "功率150W", perKgCalories: 8.5, unit: "hour" },
  { id: "a58", label: "划船机", variant: "功率200W", perKgCalories: 12, unit: "hour" },
  { id: "a59", label: "拳击", variant: "打沙袋", perKgCalories: 5.5, unit: "hour" },
  { id: "a60", label: "拳击", variant: "真人格斗", perKgCalories: 7.8, unit: "hour" },
  { id: "a61", label: "跳绳", variant: "<100次/分钟", perKgCalories: 8.8, unit: "hour" },
  { id: "a62", label: "跳绳", variant: "100-120次/分钟", perKgCalories: 11.8, unit: "hour" },
  { id: "a63", label: "跳绳", variant: "120-160次/分钟", perKgCalories: 12.3, unit: "hour" },
];

export function getAerobicActivity(id: string) {
  return aerobicActivities.find((activity) => activity.id === id) ?? aerobicActivities[0];
}

export function getAerobicUnitLabel(unit: AerobicUnit) {
  return unit === "ten-thousand-steps" ? "万步 / 周" : "小时 / 周";
}

export function getWeightAdjustmentFactor(weight: number) {
  if (weight <= 75) return 1;
  const steps = Math.ceil((weight - 75) / 5);
  return Math.max(0.73, 1 - steps * 0.03);
}

export function calculateAerobicCaloriesPerUnit(activity: AerobicActivity, weight: number) {
  const factor = getWeightAdjustmentFactor(weight);
  return Math.round((activity.perKgCalories * weight * factor) / 10) * 10;
}
