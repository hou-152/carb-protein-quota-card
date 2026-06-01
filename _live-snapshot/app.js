const $ = (id) => document.getElementById(id);

const goalMeta = {
  cut: {
    label: "减脂",
    coefficient: 0.64,
    theoryCoefficient: 0.8,
    deltaLabel: "缺口",
  },
  bulk: {
    label: "增肌",
    coefficient: 0.84,
    theoryCoefficient: 1.05,
    deltaLabel: "盈余",
  },
};

const defaults = {
  sex: "male",
  goal: "cut",
  age: 30,
  height: 175,
  weight: 78,
  trainingStatus: "strength",
  trainingSlot: "lunch_after",
  trainingLevel: "advanced",
  strengthDays: 4,
  targetBmi: 22.5,
  cardioActivity: "walk_flat_hour",
  cardioHours: 0,
  carbTraining: 2.5,
  carbRest: 2,
  proteinRate: 1.4,
  carbFood: "rice_normal",
  proteinFood: "lean_cooked",
};

const trainingSlots = [
  { id: "breakfast_early", label: "早饭后练（早起版）" },
  { id: "breakfast_late", label: "早饭后练（晚起版）" },
  { id: "lunch_before", label: "午饭前练" },
  { id: "lunch_after", label: "午饭后练" },
  { id: "dinner_before", label: "晚饭前练" },
  { id: "dinner_after", label: "晚饭后练" },
  { id: "night", label: "夜里练" },
];

const cardioActivities = [
  { id: "walk_flat_hour", label: "平地走 · 每小时", rate: 3.8 },
  { id: "walk_incline_5", label: "爬坡走 · 坡度 5°", rate: 5.5 },
  { id: "walk_incline_10", label: "爬坡走 · 坡度 10°", rate: 8 },
  { id: "run_7", label: "跑步 · 7 km/h", rate: 7.2 },
  { id: "run_9", label: "跑步 · 9 km/h", rate: 9.6 },
  { id: "bike_commute", label: "户外骑行 · 15 km/h", rate: 5.5 },
  { id: "spin_medium", label: "室内单车 · 100-160W", rate: 8.8 },
  { id: "swim_easy", label: "游泳 · 轻中强度", rate: 4.224 },
  { id: "basketball", label: "篮球", rate: 6.1 },
  { id: "badminton", label: "羽毛球", rate: 7.4 },
  { id: "dance", label: "舞蹈", rate: 5 },
  { id: "elliptical", label: "椭圆仪", rate: 5 },
  { id: "stairs_up", label: "爬楼 · 上楼", rate: 8 },
  { id: "rowing_150", label: "划船机 · 150W", rate: 8.5 },
  { id: "boxing_bag", label: "拳击 · 打沙袋", rate: 5.5 },
  { id: "jump_rope", label: "跳绳 · 100-120次/分钟", rate: 11.8 },
  { id: "yoga", label: "瑜伽", rate: 3.1 },
];

const carbFoods = [
  { id: "rice_normal", label: "米饭（一般）", rate: 0.3, note: "约 30% 碳水" },
  { id: "rice_soft", label: "米饭（很软）", rate: 0.25, note: "约 25% 碳水" },
  { id: "bread", label: "切片面包/馒头", rate: 0.5, note: "约 50% 碳水" },
  { id: "noodle_thin", label: "细面（熟）", rate: 0.23, note: "约 23% 碳水" },
  { id: "noodle_thick", label: "粗面/意面（熟）", rate: 0.3, note: "约 30% 碳水" },
  { id: "sweet_potato", label: "红薯（蒸煮）", rate: 0.18, note: "约 18% 碳水" },
  { id: "potato", label: "土豆（蒸煮）", rate: 0.18, note: "约 18% 碳水" },
  { id: "oats", label: "速食燕麦片（生）", rate: 0.6, note: "约 60% 碳水" },
  { id: "banana", label: "香蕉", rate: 0.22, note: "水果要置换主食" },
  { id: "apple", label: "苹果", rate: 0.13, note: "水果要置换主食" },
];

const proteinFoods = [
  { id: "lean_cooked", label: "瘦肉（一般熟肉）", rate: 0.25, note: "约 25% 蛋白" },
  { id: "lean_dry", label: "瘦肉（柴感熟肉）", rate: 0.3, note: "约 30% 蛋白" },
  { id: "lean_raw", label: "瘦肉（家禽家畜生肉）", rate: 0.2, note: "约 20% 蛋白" },
  { id: "fish_raw", label: "鱼虾生肉", rate: 0.15, note: "约 15% 蛋白" },
  { id: "protein_powder", label: "蛋白粉", rate: 0.75, note: "约 75% 蛋白" },
  { id: "egg", label: "鸡蛋", unitProtein: 6, unit: "个", note: "约 6g 蛋白/个" },
  { id: "milk", label: "纯牛奶", unitProtein: 10, unit: "盒", note: "约 10g 蛋白/250ml" },
];

const mealTemplates = {
  breakfast_early: {
    title: "早饭后练（早起版）",
    training: [
      ["早饭=练前餐", 0.1, 0.2, 0.15],
      ["练后餐", 0.35, 0.3, 0.15],
      ["午饭=其他餐", 0.225, 0.2, 0.25],
      ["晚饭=其他餐", 0.225, 0.2, 0.3],
      ["零食/夜宵", 0.1, 0.1, 0.15],
    ],
  },
  breakfast_late: {
    title: "早饭后练（晚起版）",
    training: [
      ["早饭=练前餐", 0.12, 0.2, 0.25],
      ["午饭=练后餐", 0.4, 0.35, 0.25],
      ["晚饭=其他餐", 0.32, 0.3, 0.35],
      ["零食/夜宵", 0.16, 0.15, 0.15],
    ],
  },
  lunch_before: {
    title: "午饭前练",
    training: [
      ["早饭=练前餐", 0.22, 0.25, 0.25],
      ["午饭=练后餐", 0.38, 0.35, 0.25],
      ["晚饭=其他餐", 0.3, 0.3, 0.35],
      ["零食/夜宵", 0.1, 0.1, 0.15],
    ],
  },
  lunch_after: {
    title: "午饭后练",
    training: [
      ["早饭", 0.2, 0.2, 0.25],
      ["午饭=练前餐", 0.15, 0, 0.15],
      ["练后餐", 0.35, 0.3, 0.15],
      ["晚饭=其他餐", 0.2, 0.3, 0.3],
      ["零食/夜宵", 0.1, 0.2, 0.15],
    ],
  },
  dinner_before: {
    title: "晚饭前练",
    training: [
      ["早饭", 0.25, 0.2, 0.25],
      ["午饭=练前餐", 0.25, 0.25, 0.3],
      ["晚饭=练后餐", 0.4, 0.4, 0.3],
      ["零食/夜宵", 0.1, 0.15, 0.15],
    ],
  },
  dinner_after: {
    title: "晚饭后练",
    training: [
      ["早饭", 0.25, 0.2, 0.25],
      ["午饭", 0.25, 0.3, 0.3],
      ["晚饭=练前餐", 0.15, 0, 0.15],
      ["练后餐", 0.25, 0.3, 0.15],
      ["零食/夜宵", 0.1, 0.2, 0.15],
    ],
  },
  night: {
    title: "夜里练",
    training: [
      ["早饭", 0.25, 0.2, 0.25],
      ["午饭", 0.25, 0.3, 0.3],
      ["晚饭=练前餐", 0.25, 0.25, 0.25],
      ["练后餐", 0.15, 0.15, 0.1],
      ["零食/夜宵", 0.1, 0.1, 0.1],
    ],
  },
  none: {
    title: "无力训者",
    training: [
      ["早饭", 0.28, 0.25, 0.28],
      ["午饭", 0.31, 0.3, 0.31],
      ["晚饭", 0.31, 0.3, 0.31],
      ["零食/夜宵", 0.1, 0.15, 0.1],
    ],
  },
};

const restTemplate = [
  ["早饭", 0.25, 0.2, 0.25],
  ["午饭", 0.3125, 0.3, 0.3],
  ["晚饭", 0.3125, 0.3, 0.3],
  ["零食/夜宵", 0.125, 0.2, 0.15],
];

const quotaTables = window.quotaTables || {};
const quotaDriverKeys = new Set(["sex", "goal", "height", "weight", "trainingStatus", "trainingSlot"]);
const stateStorageKey = "fatLossToolState";
const profileReadyStorageKey = "fatLossToolProfileReady";

let state = { ...defaults };
let toastTimer = null;
let activeGuideTab = "readme";
let activeQaTab = "cut";
let activeMobileStep = hasReadyProfile() ? 3 : 1;

const navActions = {
  scaleAnchor: { guide: "cycle" },
  guideAnchor: { guide: "readme" },
  stapleAnchor: { guide: "macro" },
  swapAnchor: { guide: "swap" },
  qaPage: {},
};

const mobileStepMeta = {
  1: {
    kicker: "Step 1 / 3",
    title: "身体与目标",
    hint: "先把基础数据填准，后面才知道该减脂还是该增肌。",
  },
  2: {
    kicker: "Step 2 / 3",
    title: "训练与有氧",
    hint: "力训决定训练日配额，有氧会折算进碳水；宏量配额默认按表即可。",
  },
  3: {
    kicker: "Step 3 / 3",
    title: "当前方案",
    hint: "先看今天怎么吃，再进入食物代换，把配额换成具体食物。",
  },
};

const qaData = {
  cut: [
    ["执行 2 周体重不掉怎么办？", "先排查执行：是否称量、是否低估外食、是否把高脂肉当瘦肉、是否水果没置换主食、是否有氧没做。确认没问题后，再每天少约 150-200 kcal 或每周多做约 1000 kcal 有氧。"],
    ["减脂到多少 BMI 该停？", "男性 BMI 22-23、女性 BMI 20-21 通常建议停止减脂并转增肌；无力训者则建议停止减脂。低体脂必须和肌肉量匹配，不要单纯追求腹肌、马甲线或肚子无赘肉。"],
    ["BMI 正常但还能减脂吗？", "男性低于 23、女性低于 21 通常不建议减脂，但脂肪肝、向心型肥胖趋势（男性腰围 >85cm，女性 >80cm）或强烈心理因素除外。低体重表格没有配额时，用最接近体重档。"],
    ["为什么新手初期要定量饮食？", "新手对食物重量和碳蛋脂没有概念，按感觉吃很容易总量错。前 1-2 周称主食和瘦肉，是为了建立手感，不是为了永远机械称重。"],
    ["食物生重还是熟重？", "页面里的主食和瘦肉代换默认按常见可食状态理解。你真正需要做的是把自己常吃食物称几次，固定碗盘、外卖和食堂份量。"],
    ["哪些食物容易被错估？", "面条、米线、卷饼容易低估碳水；菜肴里的瘦肉量容易高估；炒鸡蛋、炒茄子等吸油菜容易低估脂肪。"],
    ["什么才算瘦肉？", "瘦肉脂肪率一般不超过 5%，主要是没有白色/黄色脂肪层的猪牛羊肉、去皮鸡鸭肉、鱼虾。鸡鸭皮、排骨、肥牛肥羊、肉馅肉丸、肉肠、烤肉、牛排都不算瘦肉。"],
    ["外卖和食堂怎么吃？", "优先选主食 + 瘦肉的组合，比如米饭配酸菜鱼、黄焖鸡去皮鸡肉、跷脚牛肉等。避开高脂肉、糖油混合物和一堆食材混在一起无法估算的轻食。"],
    ["减脂期要不要放纵餐？", "如果日常饮食本来就是主食、瘦肉菜和蔬菜，就不需要靠放纵餐缓解痛苦。外食可以，但高脂肉和糖油混合物最好只浅尝。"],
    ["喝酒怎么办？", "酒精热量很高，1 两白酒或 1 瓶啤酒约等于 200 kcal。必须喝时，优先用额外有氧对冲，不建议大幅削主食。"],
    ["减了 10kg 要调配额吗？", "体重下降 10kg 后，基础代谢通常会下降约 100 多 kcal。若还要继续减，可以每天少约 100g 米饭 + 1 个全蛋，或每周多做约 800-1000 kcal 有氧。"],
    ["练前练后餐怎么理解？", "练前餐只是垫一点碳水，不是正式大餐；练后餐是训练日最大的一顿，优先补碳水和蛋白。换训练时间时，餐次顺序跟着换。"],
    ["减脂期间饿怎么办？", "先换高饱腹主食：米饭、燕麦、土豆、红薯、玉米；多吃蔬菜和瘦肉。还饿时，用少量有氧换可吃热量，而不是硬扛。"],
    ["为什么体重大反而不一定做有氧？", "体重大的人基础消耗高，饮食缺口往往已经够。大体重硬堆有氧会增加膝盖风险，也会让饮食热量变得太高。"],
    ["低热量节食后体重反涨？", "长期低热量后恢复正常碳水，肌糖原和水分会回升，第一周可能体重不降反升。这不等于脂肪增加，要给身体恢复时间。"],
    ["体脂称可信吗？", "家用体脂称的体脂、肌肉数据波动很大，体重有参考价值即可。减脂看体重均值、腰围和视觉变化。"],
    ["为什么两三天体重没意义？", "食物残留、排便、水盐、身体含水量都会盖过每天几十克脂肪变化。减脂要看 7-14 天平均趋势。"],
    ["还要做 16+8 轻断食吗？", "当你已经管理碳蛋脂后，16+8 的价值会下降。轻断食适合完全不懂碳蛋脂的人用来粗暴减少摄入。"],
    ["高尿酸/痛风怎么吃？", "鸡蛋、牛奶、乳清蛋白粉通常更友好；肉类优先猪牛羊瘦肉，少用海鲜和部分高嘌呤肉类。严重情况按医嘱处理。"],
    ["胰岛素抵抗/二糖怎么吃？", "可以在总热量内略降碳水、略升蛋白；主食优先燕麦、意面、蒸红薯、蒸土豆、甜玉米，并先吃蔬菜和肉再吃主食。"],
    ["能不能增肌减脂同时做？", "新手可能在减脂期有一点肌肉增长，但不要把它当主策略。该减脂就减脂，该增肌就增肌，循环后体型才会变好。"],
    ["零食夜宵要吃吗？", "吃不吃都行。零食/夜宵通常只有 20-30g 蛋白配额，不吃就各餐多吃两口瘦肉。少量碳水份额主要用于抵扣牛奶、蔬菜、调料里的未计入碳水。"],
    ["有什么低热量零食？", "优先优化正餐。额外想吃时，可选去皮熟鸡腿、低糖鸡肉干、真空瘦肉、魔芋类、无糖饮料和蔬菜，避开糖油混合物。"],
    ["练前练后便携碳水有哪些？", "练前可用吐司、馒头、八宝粥、香蕉等少量快碳；练后没正餐时可用便携碳水 + 乳清蛋白粉，但饱腹感较低。"],
  ],
  bulk: [
    ["增肌一个月体重不长怎么办？", "先确认每周 3-5 次稳定力训。一个月完全不长，再每天加 30-60g 碳水，或加 10-20g 脂肪，继续观察。"],
    ["增肌期体重涨多快？", "男性每月约 1-2 斤，女性每月约 0.5-1 斤。想少长脂肪，就更慢一点；涨太快多半是脂肪也在涨。"],
    ["增肌也要定量饮食吗？", "需要，但不用像减脂那么紧张。先称几天，知道自己是否真的吃够碳水和蛋白，避免体重不长或猛长。"],
    ["哪些固定重量食物可参考？", "外卖米饭、吐司、去皮鸡腿、苹果香蕉等可以粗略参考，但多数食物仍要自己称几次。"],
    ["增肌能吃面条面包吗？", "可以，尤其练后餐碳水吃不下时，面条、面包、馒头这类低饱腹主食反而有用；但仍要定量。"],
    ["哪些食物要特别提醒？", "糖油混合物和高脂肉仍不能当基础食物。增肌容错更高，但用它们吃饱会让脂肪涨太快。"],
    ["外卖怎么吃？", "选单独主食 + 足量瘦肉，固定几家更容易估算。瘦肉不够就加肉、带肉或用乳清蛋白粉补。"],
    ["瘦肉吃不够怎么办？", "可以准备即食鸡胸、酱牛肉、去皮鸡腿、肉干或乳清蛋白粉。若因此少吃带油炒菜，要注意脂肪别太低。"],
    ["在外就餐会影响增肌吗？", "不会。碳水参考平时饭量，瘦肉多吃，蔬菜随意；高脂肉和糖油混合物可以偶尔吃，但不要当基础。"],
    ["体重增加后要调配额吗？", "通常不用。增肌期一般不会一次涨 10kg 以上，基础代谢变化不大；完全停滞时再按体重不长的规则加热量。"],
    ["改力训时间怎么改餐序？", "早饭、练前餐、练后餐、其他餐的配额逻辑不变；训练时间变了，就把练前和练后餐移动到对应位置。"],
    ["体脂称能判断增肌吗？", "家用体脂称的肌肉数据不可靠。增肌看月度体重缓慢上行，以及训练大项力量有进步。"],
    ["增肌到多少 BMI 转减脂？", "介意发胖：男性 BMI 23-24、女性 21-22 可转减脂；不介意发胖：男性 24-25、女性 22-23 再转。通常不建议更高。"],
    ["高尿酸/痛风怎么处理？", "蛋白来源优先鸡蛋、牛奶、乳清蛋白粉和嘌呤较低的肉类；多喝水，控制果糖和酒精，严重情况遵医嘱。"],
    ["胰岛素抵抗/二糖怎么处理？", "在总热量里适当降低碳水、提高蛋白，主食优先中 GI 选择，并先吃蔬菜和肉再吃主食。"],
    ["要不要追求增肌减脂同时进行？", "不要。新手可能出现一点同时变化，但主线仍然是增肌期和减脂期循环。"],
    ["增肌期低热量零食怎么理解？", "低热量零食不是用来补热量的，而是在体重增速合适但嘴馋时临时填肚子。真不长体重应按规则加饮食。"],
    ["练前练后便携碳水有哪些？", "练前用少量便携碳水垫肚子；练后没正餐时可用便携碳水 + 乳清蛋白粉。增肌练后餐可以更灵活。"],
  ],
};

function init() {
  fillSelect($("trainingSlot"), trainingSlots);
  fillSelect($("cardioActivity"), cardioActivities);
  fillSelect($("carbFood"), carbFoods);
  fillSelect($("proteinFood"), proteinFoods);
  state = normalizeState(loadState());
  bindInputs();
  bindMobileFlow();
  setupMobileMacroDefault();
  writeStateToInputs();
  update();
  registerServiceWorker();
}

function fillSelect(select, items) {
  select.innerHTML = items.map((item) => `<option value="${item.id}">${item.label}</option>`).join("");
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(stateStorageKey) || "null");
    return saved ? { ...defaults, ...saved } : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

function hasReadyProfile() {
  try {
    const ready = localStorage.getItem(profileReadyStorageKey);
    if (ready === "1") return true;
    if (ready === "0") return false;
    return Boolean(localStorage.getItem(stateStorageKey));
  } catch {
    return false;
  }
}

function markProfileReady(isReady = true) {
  try {
    localStorage.setItem(profileReadyStorageKey, isReady ? "1" : "0");
  } catch {
    // Ignore storage failures; the calculator still works for the current session.
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!window.isSecureContext && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;
  const register = () => {
    navigator.serviceWorker.register("./sw.js?v=20260514-v30a").catch(() => {
      // Installation support is progressive; the web calculator should keep working without it.
    });
  };
  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register, { once: true });
  }
}

function normalizeState(next) {
  const merged = { ...defaults, ...next };
  if (!goalMeta[merged.goal]) merged.goal = defaults.goal;
  if (merged.trainingSlot === "none") {
    merged.trainingStatus = "none";
    merged.trainingSlot = defaults.trainingSlot;
  }
  if (merged.trainingStatus !== "none") merged.trainingStatus = "strength";
  if (merged.trainingStatus === "none") merged.strengthDays = 0;
  merged.cardioHours = clamp(Number(merged.cardioHours) || 0, 0, 4);
  return merged;
}

function bindInputs() {
  Object.keys(defaults).forEach((key) => {
    const el = $(key);
    if (!el) return;
    el.addEventListener("input", () => readInputs(true, key));
    el.addEventListener("change", () => readInputs(true, key));
  });
  $("resetBtn").addEventListener("click", () => {
    state = { ...defaults };
    markProfileReady(false);
    activeMobileStep = 1;
    applyQuotaPreset();
    writeStateToInputs();
    update(true);
    scrollToMobileFlow();
    showToast("已恢复默认参数");
  });
  $("macroPresetBtn").addEventListener("click", () => {
    const quota = applyQuotaPreset();
    writeStateToInputs();
    update(true);
    showToast(quota.available ? "已按当前表格更新配额" : quota.message);
  });
  $("copyBtn").addEventListener("click", copySummary);
  $("printBtn").addEventListener("click", () => window.print());
  document.querySelectorAll("[data-guide-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activeGuideTab = button.dataset.guideTab || "readme";
      update();
    });
  });
  document.querySelectorAll("[data-qa-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activeQaTab = button.dataset.qaTab || "cut";
      renderQa();
    });
  });
  $("qaSearch")?.addEventListener("input", renderQa);
  bindNavAnchors();
}

function bindMobileFlow() {
  document.querySelectorAll("[data-mobile-step-button]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextStep = Number(button.dataset.mobileStepButton) || 1;
      setMobileStep(nextStep, { markReady: nextStep === 3 });
    });
  });
  $("mobileBackBtn")?.addEventListener("click", () => {
    setMobileStep(Math.max(1, activeMobileStep - 1));
  });
  $("mobileNextBtn")?.addEventListener("click", () => {
    const nextStep = Math.min(3, activeMobileStep + 1);
    setMobileStep(nextStep, { markReady: nextStep === 3 });
  });
  $("mobileEditDataBtn")?.addEventListener("click", () => {
    setMobileStep(1);
  });
  $("mobileGoSwapBtn")?.addEventListener("click", () => {
    markProfileReady(true);
    activeMobileStep = 3;
    update(true);
    requestAnimationFrame(() => {
      history.replaceState(null, "", "#swapAnchor");
      setActiveNav("swapAnchor");
      scrollToAnchor("swapAnchor");
    });
  });
  window.addEventListener("resize", syncMobileFlow);
}

function setupMobileMacroDefault() {
  if (isMobileViewport()) {
    $("advancedMacro")?.removeAttribute("open");
  }
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function setMobileStep(step, options = {}) {
  activeMobileStep = clamp(Math.round(step), 1, 3);
  if (options.markReady) markProfileReady(true);
  update(true);
  scrollToMobileFlow();
}

function syncMobileFlow() {
  document.body.dataset.mobileStep = String(activeMobileStep);
  const meta = mobileStepMeta[activeMobileStep] || mobileStepMeta[1];
  if ($("mobileStepKicker")) $("mobileStepKicker").textContent = meta.kicker;
  if ($("mobileStepTitle")) $("mobileStepTitle").textContent = meta.title;
  if ($("mobileStepHint")) $("mobileStepHint").textContent = meta.hint;
  document.querySelectorAll("[data-mobile-step-button]").forEach((button) => {
    const isActive = Number(button.dataset.mobileStepButton) === activeMobileStep;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  if ($("mobileBackBtn")) $("mobileBackBtn").disabled = activeMobileStep === 1;
  if ($("mobileNextBtn")) {
    $("mobileNextBtn").textContent = activeMobileStep === 2 ? "生成方案" : "下一步";
    $("mobileNextBtn").disabled = activeMobileStep === 3;
  }
}

function scrollToMobileFlow() {
  if (!isMobileViewport()) return;
  const target = activeMobileStep === 3 ? document.querySelector(".result-panel") : $("mobileFlowPanel");
  if (!target) return;
  const top = window.scrollY + target.getBoundingClientRect().top - 10;
  window.scrollTo({ top, behavior: "smooth" });
}

function bindNavAnchors() {
  document.querySelectorAll('.prep-strip a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href")?.slice(1);
      const action = id ? navActions[id] : null;
      if (!action) return;
      event.preventDefault();
      if (action.guide) activeGuideTab = action.guide;
      update(true);
      requestAnimationFrame(() => {
        history.replaceState(null, "", `#${id}`);
        setActiveNav(id);
        scrollToAnchor(id);
      });
    });
  });
}

function setActiveNav(id) {
  document.querySelectorAll('.prep-strip a[href^="#"]').forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

function scrollToAnchor(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const styles = getComputedStyle(document.documentElement);
  const offset = parseFloat(styles.scrollPaddingTop) || 0;
  const top = window.scrollY + target.getBoundingClientRect().top - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

function readInputs(shouldUpdate, changedKey) {
  const previous = { ...state };
  Object.keys(defaults).forEach((key) => {
    const el = $(key);
    if (!el) return;
    state[key] = el.type === "number" ? readNumberValue(el.value, previous[key]) : el.value;
  });

  if (previous.trainingStatus !== state.trainingStatus) {
    state.strengthDays = state.trainingStatus === "none" ? 0 : defaults.strengthDays;
  }
  if (state.trainingStatus === "none") state.strengthDays = 0;
  state.cardioHours = clamp(Number(state.cardioHours) || 0, 0, 4);

  if (quotaDriverKeys.has(changedKey)) {
    applyQuotaPreset();
  }

  if (shouldUpdate) {
    update(true, { preserveInputId: shouldPreserveInput(changedKey) ? changedKey : null });
  }
}

function readNumberValue(value, fallback) {
  const raw = String(value).trim();
  if (!raw || raw === "." || raw === "-" || raw === "+") return fallback;
  const next = Number(raw);
  return Number.isFinite(next) ? next : fallback;
}

function shouldPreserveInput(id) {
  if (!id) return false;
  const el = $(id);
  if (!el || document.activeElement !== el) return false;
  if (id === "cardioHours" && Number(el.value) > 4) return false;
  return true;
}

function writeStateToInputs(preserveInputId) {
  Object.entries(state).forEach(([key, value]) => {
    const el = $(key);
    if (key === preserveInputId) return;
    if (el) el.value = value;
  });
  syncTrainingControls();
}

function syncTrainingControls() {
  const noStrength = state.trainingStatus === "none";
  ["trainingSlot", "trainingLevel", "strengthDays"].forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.disabled = noStrength;
    el.closest("label")?.classList.toggle("is-disabled", noStrength);
  });
  $("carbTraining")?.closest("label")?.querySelector("span")?.replaceChildren(
    document.createTextNode(noStrength ? "每日碳水 g/kg" : "力训日碳水 g/kg"),
  );
  $("carbRest")?.closest("label")?.querySelector("span")?.replaceChildren(
    document.createTextNode(noStrength ? "每日碳水 g/kg（同左）" : "休息日碳水 g/kg"),
  );
}

function update(save, options = {}) {
  const calc = calculate(state);
  render(calc);
  writeStateToInputs(options.preserveInputId);
  if (save) {
    localStorage.setItem(stateStorageKey, JSON.stringify(state));
    if (!isMobileViewport() || activeMobileStep === 3) markProfileReady(true);
  }
}

function calculate(s) {
  const goal = goalMeta[s.goal] || goalMeta.cut;
  const noStrength = s.trainingStatus === "none";
  const heightM = s.height / 100;
  const bmi = s.weight / (heightM * heightM);
  const targetWeight = s.targetBmi * heightM * heightM;
  const kgToLose = Math.max(0, s.weight - targetWeight);
  const bmr = s.sex === "male"
    ? s.weight * 9.99 + s.height * 6.25 - s.age * 4.92 + 5
    : s.weight * 9.99 + s.height * 6.25 - s.age * 4.92 - 161;
  const baseBurn = bmr / 0.7;
  const cardio = cardioActivities.find((item) => item.id === s.cardioActivity) || cardioActivities[0];
  const cardioHour = cardioKcalPerHour(cardio.rate, s.weight);
  const cardioDaily = (cardioHour * s.cardioHours) / 7;
  const cardioCarbs = cardioDaily / 4;
  const strengthKcal = noStrength ? 0 : strengthEstimate(s.sex, s.trainingLevel);
  const strengthDays = noStrength ? 0 : clamp(s.strengthDays, 0, 7);
  const restDays = 7 - strengthDays;
  const balanceTraining = baseBurn + cardioDaily + strengthKcal;
  const balanceRest = baseBurn + cardioDaily;
  const theoryEatTraining = balanceTraining * goal.theoryCoefficient;
  const theoryEatRest = balanceRest * goal.theoryCoefficient;
  const eatTraining = balanceTraining * goal.coefficient;
  const eatRest = balanceRest * goal.coefficient;
  const weeklyEat = (eatTraining * strengthDays + eatRest * restDays) / 7;
  const weeklyTheoryEat = (theoryEatTraining * strengthDays + theoryEatRest * restDays) / 7;
  const weeklyBalance = (balanceTraining * strengthDays + balanceRest * restDays) / 7;
  const theoryDelta = weeklyTheoryEat - weeklyBalance;
  const adjustedDelta = weeklyEat - weeklyBalance;
  const paceKgPerWeek = s.weight * 0.01;
  const estimatedWeeks = kgToLose > 0 ? kgToLose / paceKgPerWeek : 0;
  const fatGuide = defaultFatGrams(s.sex, s.weight, s.goal);
  const fatGrams = fatGuide;
  const quota = lookupQuota(s);
  const slot = noStrength ? mealTemplates.none : (mealTemplates[s.trainingSlot] || mealTemplates.lunch_after);

  const trainingMacros = quota.available
    ? makeMacros(s.weight, s.carbTraining, s.proteinRate, fatGrams, cardioCarbs)
    : null;
  const restMacros = quota.available
    ? makeMacros(s.weight, s.carbRest, s.proteinRate, fatGrams, cardioCarbs)
    : null;
  const trainingMeals = trainingMacros
    ? distributeMeals(slot.training, trainingMacros.carbs, trainingMacros.protein)
    : [];
  const restMeals = !noStrength && restMacros
    ? distributeMeals(restTemplate, restMacros.carbs, restMacros.protein)
    : [];

  return {
    goal,
    noStrength,
    bmi,
    targetWeight,
    kgToLose,
    bmr,
    baseBurn,
    cardio,
    cardioHour,
    cardioDaily,
    cardioCarbs,
    strengthKcal,
    strengthDays,
    restDays,
    balanceTraining,
    balanceRest,
    theoryEatTraining,
    theoryEatRest,
    eatTraining,
    eatRest,
    weeklyEat,
    weeklyTheoryEat,
    weeklyBalance,
    theoryDelta,
    adjustedDelta,
    paceKgPerWeek,
    estimatedWeeks,
    fatGuide,
    fatGrams,
    quota,
    trainingMacros,
    restMacros,
    trainingMeals,
    restMeals,
    slot,
  };
}

function applyQuotaPreset() {
  const quota = lookupQuota(state);
  if (quota.available) {
    state.carbTraining = quota.rates.carbTraining;
    state.carbRest = quota.rates.carbRest;
    state.proteinRate = quota.rates.proteinRate;
  }
  return quota;
}

function lookupQuota(s) {
  const trainingType = s.trainingStatus === "none" ? "none" : "strength";
  if (s.goal === "bulk" && trainingType === "none") {
    return {
      available: false,
      unsupported: true,
      trainingType,
      message: "无力量训练只有减脂表，增肌请先选择力量训练安排。",
    };
  }

  const key = `${s.sex}:${s.goal}:${trainingType}`;
  const table = quotaTables[key];
  if (!table) {
    return {
      available: false,
      trainingType,
      message: "当前目标与训练状态没有对应表格。",
    };
  }

  const matchedHeight = nearest(table.heights, s.height);
  const matchedWeight = nearest(table.weights, s.weight);
  const cell = table.rows?.[matchedWeight]?.[matchedHeight] || null;
  const base = {
    available: Boolean(cell),
    tableTitle: table.title,
    tableType: table.type,
    trainingType,
    matchedHeight,
    matchedWeight,
    requestedHeight: s.height,
    requestedWeight: s.weight,
  };

  if (!cell) {
    return {
      ...base,
      message: "该身高体重组合不在当前表格范围内。",
    };
  }

  const rates = table.type === "strength"
    ? {
        carbTraining: cell.trainCarb,
        carbRest: cell.restCarb,
        proteinRate: cell.protein,
      }
    : {
        carbTraining: cell.dailyCarb,
        carbRest: cell.dailyCarb,
        proteinRate: cell.protein,
      };

  return {
    ...base,
    rates,
    message: `已匹配 ${matchedHeight}cm / ${matchedWeight}kg 档。`,
  };
}

function cardioKcalPerHour(rate, weight) {
  const stepsAbove75 = Math.max(0, Math.ceil((weight - 75) / 5));
  const factor = Math.max(0.7, 1 - stepsAbove75 * 0.03);
  return roundTo(rate * weight * factor, 10);
}

function strengthEstimate(sex, level) {
  const table = {
    male: { newbie: 150, trained: 200, advanced: 250 },
    female: { newbie: 100, trained: 150, advanced: 200 },
  };
  return table[sex][level] || table[sex].newbie;
}

function defaultFatGrams(sex, weight, goal) {
  if (goal === "bulk") return sex === "male" ? 80 : 70;
  if (sex === "male") return weight >= 120 ? 70 : 60;
  return 50;
}

function fatGuideText(calc) {
  if (state.goal === "bulk") {
    return state.sex === "male"
      ? "增肌期男性脂肪指导：80g/天"
      : "增肌期女性脂肪指导：70g/天";
  }
  if (state.sex === "male") {
    return `减脂期男性脂肪指导：${format(calc.fatGuide, 0)}g/天${state.weight >= 120 ? "（120kg 以上）" : "（120kg 以上加到 70g）"}`;
  }
  return "减脂期女性脂肪指导：50g/天";
}

function fatGuidePoints(calc) {
  const commonWarn = "高脂肉、鸡鸭皮、肥牛肥羊、排骨、肉馅、油条、蛋糕、花式面包、膨化食品、宽油炒鸡蛋，最容易把脂肪预算吃穿。";
  if (state.goal === "bulk") {
    return [
      ["增肌推荐模式", "早饭蛋黄牛奶 + 正餐大众带油瘦肉菜 + 30g 坚果，通常就能接近增肌期脂肪量。"],
      ["如果不吃蛋黄牛奶", "增肌表建议每天吃 40g 坚果，因为别人已经吃了 30g 坚果，你还少了蛋黄牛奶这部分脂肪。"],
      ["如果长期低油无油", "增肌表建议每天吃 60g 坚果，因为低油无油会少掉约 20g 脂肪，而别人已经在吃 30g。"],
      ["仍然别吃爆", commonWarn],
    ];
  }
  return [
    ["减脂推荐模式", "早饭蛋黄牛奶 + 正餐大众带油瘦肉菜，通常就能接近合适脂肪量；不要一听油就害怕。"],
    ["如果不吃蛋黄牛奶", "会比推荐模式少吃约 10-20g 脂肪；减脂表建议全天补 20g 坚果或 3 个蛋黄。"],
    ["如果长期低油无油", "会比推荐模式少吃约 20g 脂肪；减脂表建议全天补 30g 坚果或 4 个蛋黄。"],
    ["容易爆的食物", commonWarn],
  ];
}

function makeMacros(weight, carbRate, proteinRate, fatGrams, cardioCarbs = 0) {
  const baseCarbs = carbRate * weight;
  const carbs = baseCarbs + cardioCarbs;
  const protein = proteinRate * weight;
  const fat = fatGrams;
  const kcal = carbs * 4 + protein * 4 + fat * 9;
  return {
    baseCarbs,
    carbs,
    cardioCarbs,
    protein,
    fat,
    kcal,
    fatKcal: fat * 9,
    carbRate,
    proteinRate,
  };
}

function distributeMeals(template, carbs, protein) {
  return template.map(([name, carbShare, proteinShare]) => ({
    name,
    carbs: carbs * carbShare,
    protein: protein * proteinShare,
  }));
}

function render(calc) {
  const goalLabel = calc.goal.label;
  const statusLabel = calc.noStrength ? "无力训每日方案" : calc.slot.title;
  $("planTitle").textContent = `${statusLabel} · ${goalLabel}`;
  if ($("mobileResultTitle")) $("mobileResultTitle").textContent = `${statusLabel} · ${goalLabel}`;
  $("bmiValue").textContent = format(calc.bmi, 1);
  $("bmiLabel").textContent = bmiLabel(calc.bmi);
  $("bmrValue").textContent = format(calc.bmr, 0);
  $("trainEatValue").textContent = calc.noStrength ? "—" : format(calc.eatTraining, 0);
  $("restEatValue").textContent = format(calc.eatRest, 0);
  $("trainEatValue").closest(".kpi").querySelector("span").textContent = calc.noStrength ? "力训日应吃" : "力训日应吃";
  $("restEatValue").closest(".kpi").querySelector("span").textContent = calc.noStrength ? "每日应吃" : "休息日应吃";
  $("trainEatNote").textContent = calc.noStrength ? "无力训不划分训练日" : `平衡热量 × ${calc.goal.coefficient}`;
  $("restEatNote").textContent = `平衡热量 × ${calc.goal.coefficient}`;
  $("cardioPerHour").textContent = `${format(calc.cardioHour, 0)} kcal/h`;
  $("weeklySummary").textContent = `预留后平均 ${format(calc.weeklyEat, 0)} kcal/天，理论${calc.goal.deltaLabel} ${format(Math.abs(calc.theoryDelta), 0)} kcal/天`;
  $("trainingDayTitle").textContent = calc.noStrength ? "每日饮食" : "力训日";
  $("restDayTitle").textContent = calc.noStrength ? "无训练日划分" : "休息日";

  renderActionPanel(calc);
  renderCycleAdvice(calc);
  renderMacroSummary(calc);
  renderBars(calc);
  renderGuide(calc);
  renderMeals($("trainingMeals"), calc.trainingMeals, calc.quota.available ? "" : calc.quota.message);
  renderMeals(
    $("restMeals"),
    calc.noStrength ? [] : calc.restMeals,
    calc.noStrength ? "无力量训练模式只输出每日饮食，不再拆训练日/休息日。" : (calc.quota.available ? "" : calc.quota.message),
  );
  renderFood(calc);
  renderNotices(calc);
  renderQa();
  syncMobileFlow();
}

function renderCycleAdvice(calc) {
  const male = state.sex === "male";
  const bmi = calc.bmi;
  const stopCutLow = male ? 22 : 20;
  const stopCutHigh = male ? 23 : 21;
  const bulkEarlyLow = male ? 23 : 21;
  const bulkEarlyHigh = male ? 24 : 22;
  const bulkLateLow = male ? 24 : 22;
  const bulkLateHigh = male ? 25 : 23;
  const sexLabel = male ? "男性" : "女性";

  let title = "继续观察趋势";
  let detail = "BMI 只是普通人的低成本入口，真正执行时还要看腰围、健康状态、体重趋势和个人审美。";
  if (state.goal === "cut") {
    if (bmi < stopCutHigh) {
      title = calc.noStrength ? "通常建议停止减脂" : "通常建议转增肌";
      detail = `${sexLabel} BMI 低于 ${stopCutHigh} 通常不建议继续减脂。除非有脂肪肝、向心型肥胖趋势，或个人心理上强烈不能接受当前体型。`;
    } else if (bmi <= stopCutHigh) {
      title = calc.noStrength ? "进入停止减脂区间" : "进入转增肌区间";
      detail = `${sexLabel}减脂参考线是 BMI ${stopCutLow}-${stopCutHigh}。肌肉量一般的普通人，不建议为了低体脂继续压体重。`;
    } else {
      title = "仍可按减脂执行";
      detail = `当前 BMI ${format(bmi, 1)} 高于 ${sexLabel}转增肌参考线。继续看 7-14 天体重均值，不要被单日波动带着改方案。`;
    }
  } else if (bmi >= bulkLateHigh) {
    title = "建议认真考虑转减脂";
    detail = `${sexLabel}一般不建议增到 BMI ${bulkLateHigh} 以上，除非有强烈个人意愿。增肌不是猛涨体重，涨太快多半是脂肪也在涨。`;
  } else if (bmi >= bulkLateLow) {
    title = "不介意发胖者的转减脂区间";
    detail = `${sexLabel}如果不介意发胖，可在 BMI ${bulkLateLow}-${bulkLateHigh} 再转减脂；但一般不建议继续更高。`;
  } else if (bmi >= bulkEarlyLow) {
    title = "介意发胖者可转减脂";
    detail = `${sexLabel}如果介意发胖，BMI ${bulkEarlyLow}-${bulkEarlyHigh} 就可以考虑转减脂；如果能接受脂肪增加，可继续一小段。`;
  } else {
    title = "可继续干净增肌";
    detail = `${sexLabel}当前 BMI ${format(bmi, 1)} 尚未进入常规转减脂区间。重点看每月慢速增重和力量进步。`;
  }

  $("cycleTitle").textContent = title;
  $("cycleDetail").textContent = detail;
  $("cycleBadges").innerHTML = [
    ["减脂转增肌", male ? "男 22-23 / 女 20-21" : "女 20-21 / 男 22-23"],
    ["介意发胖转减脂", male ? "男 23-24 / 女 21-22" : "女 21-22 / 男 23-24"],
    ["不介意发胖转减脂", male ? "男 24-25 / 女 22-23" : "女 22-23 / 男 24-25"],
    ["正常但可减脂例外", "脂肪肝 / 腰围超线 / 强心理因素"],
  ].map(([label, value]) => `
    <div>
      <span>${label}</span>
      <b>${value}</b>
    </div>
  `).join("");
}

function renderActionPanel(calc) {
  const hasQuota = calc.quota.available && calc.trainingMacros;
  const goalIntro = calc.goal === goalMeta.cut
    ? "先把饮食缺口做出来，再用 7-14 天体重均值校准。"
    : "用小盈余慢慢长，不追求体重猛涨。";
  $("planPromise").textContent = `${goalIntro} ${calc.noStrength ? "无力训也能先减脂；想保肌再逐步加入训练。" : "力训日和休息日分开吃，训练前后更好执行。"}`;

  if (!hasQuota) {
    $("primaryInstruction").textContent = "当前组合暂时不能查表";
    $("primaryDetail").textContent = calc.quota.message;
    $("answerList").innerHTML = [
      ["先修正条件", "增肌需要选择有力量训练；身高体重超出表格时，先回到表格范围附近。"],
      ["保留输入", "页面会保存当前设备上的输入，调整后会自动重新计算。"],
    ].map(renderAnswerStep).join("");
    return;
  }

  const fatText = `${format(calc.fatGuide, 0)}g 脂肪指导`;
  const cardioText = calc.cardioDaily > 0
    ? `；已把有氧日均 ${format(calc.cardioDaily, 0)} kcal 折算为 +${format(calc.cardioCarbs, 0)}g 碳水`
    : "";
  const primary = calc.noStrength
    ? `每天：碳水 ${format(calc.trainingMacros.carbs, 0)}g，蛋白 ${format(calc.trainingMacros.protein, 0)}g`
    : `力训日碳水 ${format(calc.trainingMacros.carbs, 0)}g，休息日 ${format(calc.restMacros.carbs, 0)}g`;
  $("primaryInstruction").textContent = primary;
  $("primaryDetail").textContent = calc.noStrength
    ? `蛋白和碳水按每日方案执行，${fatText}，不用把脂肪拆到每一餐精算${cardioText}。`
    : `蛋白约 ${format(calc.trainingMacros.protein, 0)}g/天，${fatText}；训练日多出的碳水优先放在训练前后${cardioText}。`;

  const trendText = calc.goal === goalMeta.cut
    ? "平台期先看食物残留、水盐、排便和训练炎症，别被单日体重带着改方案。"
    : "增肌至少看 1 个月趋势；涨太快通常不是更好，而是脂肪也在一起涨。";
  const adjustText = calc.goal === goalMeta.cut
    ? "执行 1-2 周仍不掉，再每天少 150 kcal 或每周多 1000 kcal 有氧。"
    : "一个月完全不长，再小幅增加 100-200 kcal。";
  const strengthText = calc.noStrength
    ? "力训不是减脂必要条件；想减少肌肉损失，再逐步做到每周 3-5 次。"
    : `当前每周 ${format(calc.strengthDays, 0)} 天力训；目标是给肌肉保留信号，不是靠力训抵消乱吃。`;

  const steps = [
    ["先称 1-2 周", "主食、瘦肉和常用碗盘先建立手感，后面才容易生活化执行。"],
    ["看趋势", trendText],
    ["再微调", adjustText],
    ["训练定位", strengthText],
  ];
  if (calc.cardioDaily > 0) {
    steps.splice(2, 0, [
      "有氧补碳水",
      `当前有氧按日均 ${format(calc.cardioDaily, 0)} kcal 处理，已加到碳水里；每周有氧建议低于 4h，别用有氧硬扛过大缺口。`,
    ]);
  }
  $("answerList").innerHTML = steps.map(renderAnswerStep).join("");
}

function renderAnswerStep([title, text]) {
  return `
    <div class="answer-step">
      <b>${title}</b>
      <span>${text}</span>
    </div>
  `;
}

function renderMacroSummary(calc) {
  $("paceLabel").textContent = "V3.0 · 当前方案校验";

  if (!calc.quota.available || !calc.trainingMacros || !calc.restMacros) {
    $("trainingMacroTotal").textContent = "查表不可用";
    $("restMacroTotal").textContent = calc.noStrength ? "无训练日划分" : "查表不可用";
    setMacroValues("training", null);
    setMacroValues("rest", null);
    return;
  }

  $("trainingMacroTotal").textContent = macroTotalText(calc.trainingMacros);
  $("trainingCarbs").textContent = format(calc.trainingMacros.carbs, 0);
  $("trainingProtein").textContent = format(calc.trainingMacros.protein, 0);
  $("trainingFat").textContent = `${format(calc.trainingMacros.fat, 0)}g`;

  if (calc.noStrength) {
    $("restMacroTotal").textContent = "无训练/休息日划分";
    setMacroValues("rest", null);
  } else {
    $("restMacroTotal").textContent = macroTotalText(calc.restMacros);
    $("restCarbs").textContent = format(calc.restMacros.carbs, 0);
    $("restProtein").textContent = format(calc.restMacros.protein, 0);
    $("restFat").textContent = `${format(calc.restMacros.fat, 0)}g`;
  }

}

function macroTotalText(macros) {
  const cardioPart = macros.cardioCarbs > 0 ? ` · 有氧 +${format(macros.cardioCarbs, 0)}g 碳水` : "";
  return `${format(macros.kcal, 0)} kcal 估算${cardioPart}`;
}

function setMacroValues(prefix, macros) {
  $(`${prefix}Carbs`).textContent = macros ? format(macros.carbs, 0) : "—";
  $(`${prefix}Protein`).textContent = macros ? format(macros.protein, 0) : "—";
  $(`${prefix}Fat`).textContent = macros ? `${format(macros.fat, 0)}g` : "—";
}

function renderBars(calc) {
  const items = [
    ["无运动总消耗", calc.baseBurn, "#4f8ed1"],
    ["有氧日均加成", calc.cardioDaily, "#ffb238"],
    ["力训单日加成", calc.strengthKcal, "#b8ff2c"],
    [`理论${calc.goal.deltaLabel}`, Math.abs(calc.theoryDelta), calc.goal === goalMeta.cut ? "#ff6b57" : "#b8ff2c"],
    [calc.noStrength ? "每日应吃" : "力训日应吃", calc.noStrength ? calc.eatRest : calc.eatTraining, "#8eea5f"],
    [calc.noStrength ? "预留后平均" : "休息日应吃", calc.noStrength ? calc.weeklyEat : calc.eatRest, "#5f6b70"],
  ];
  const max = Math.max(...items.map((item) => item[1]), 1);
  $("calorieBars").innerHTML = items.map(([label, value, color]) => `
    <div class="bar-line">
      <div class="bar-label">${label}</div>
      <div class="bar-track"><div class="bar-fill" style="--w:${Math.max(3, (value / max) * 100)}%;--c:${color}"></div></div>
      <div class="bar-value">${format(value, 0)}</div>
    </div>
  `).join("");
}

function renderGuide(calc) {
  const tabs = {
    readme: {
      subtitle: "README",
      leadTitle: "先读懂设计逻辑，再开始照表执行",
      leadText: "这个工具不是一张固定食谱，而是把 Excel 套表里的饮食系统变成网页：先判断周期，再估算热量，再查表分配碳水和蛋白，脂肪用生活化规则控制。前 1-2 周请尽量定量，目的不是一辈子称饭，而是建立自己的饮食坐标系。",
      points: [
        ["适用人群", "想做生活化减脂或干净增肌的人。无力训可以减脂；增肌默认需要稳定力量训练。"],
        ["使用顺序", "先填性别、目标、身高体重，再确认是否力训、有氧和训练时段，最后看今日执行、餐次配额和食物代换。若做有氧，建议每周低于 4h。"],
        ["准备材料", "体重秤、厨房电子秤、常用碗盘或饭盒、记录工具。喝水通常 1.5-2L/天；蛋白粉默认乳清蛋白粉，除非乳糖不耐受。"],
        ["内容出处", "依据 B 站 UP 主“好人松松”的生活化减脂增肌视频和配套 Excel。本网页是自用产品化整理，不替代原表原视频。"],
        ["反馈周期", calc.goal === goalMeta.cut ? "减脂看 7-14 天均值，不看单日体重。两周稳定不掉时，先排查执行，再调热量。" : "增肌至少看 1 个月趋势。男性每月一般不超过 1kg，女性每月一般不超过 0.5kg。"],
      ],
    },
    cycle: {
      subtitle: "周期判断",
      leadTitle: "什么时候转增肌，什么时候转减脂",
      leadText: "BMI 不是完美指标，但对普通人足够有用。它只负责给你一个周期入口；如果腰围、脂肪肝、二型糖尿病/胰岛素抵抗或强烈心理因素存在，判断可以向减脂倾斜。",
      points: [
        ["减脂转增肌", "男性 BMI 22-23、女性 BMI 20-21，通常建议停止减脂并转增肌；无力训者则停止减脂。"],
        ["正常但可减脂的例外", "男性低于 23、女性低于 21 通常不建议减脂，但脂肪肝、向心型肥胖趋势（肚脐线空腹腰围男 >85cm、女 >80cm）或强烈心理因素除外；低体重没配额时用最接近档。"],
        ["增肌转减脂", "介意发胖：男 23-24、女 21-22；不介意发胖：男 24-25、女 22-23。一般不建议增到更高。"],
        ["不要追求低体脂", "肌肉量一般的普通人，不要为了腹肌、马甲线、肚子无赘肉一直减。低体脂必须和足够肌肉量适配。"],
      ],
    },
    diet: {
      subtitle: "饮食缺口",
      leadTitle: calc.goal === goalMeta.cut ? "减脂先看热量缺口，不先看练没练" : "增肌先看热量盈余，但要保守",
      leadText: calc.goal === goalMeta.cut
        ? `体脂下降来自长期热量缺口。你当前的理论缺口约 ${format(Math.abs(calc.theoryDelta), 0)} kcal/天，预留后平均应吃 ${format(calc.weeklyEat, 0)} kcal/天；这个缺口可以主要由饮食提供，不需要靠力训来“换”。`
        : `干净增肌用小盈余，不追求快速涨体重。你当前理论盈余约 ${format(Math.abs(calc.theoryDelta), 0)} kcal/天，预留后平均应吃 ${format(calc.weeklyEat, 0)} kcal/天。`,
      points: [
        ["饮食是主旋钮", "工具先算无运动总消耗，再叠加力训和有氧；有氧消耗会折算成碳水加入配额，最后用减脂 0.64 或增肌 0.84 得到可执行饮食量。"],
        ["体重看周期", calc.goal === goalMeta.cut ? "减脂看 1-2 周趋势，不用被两三天的水分、盐分、食物残留带着走。" : "增肌看 1 个月趋势，体重涨太快通常不是好事，先追求慢慢长。"],
        ["执行先定量", "新手前 1-2 周用厨房秤建立手感，之后可以逐渐从精确称量过渡到稳定估计。"],
      ],
    },
    macro: {
      subtitle: "碳蛋脂怎么吃",
      leadTitle: "碳水看饱腹，蛋白看瘦肉，脂肪看边界",
      leadText: `${fatGuideText(calc)}。碳水和蛋白按表执行；如果填写有氧，工具会把有氧日均消耗折算成 +${format(calc.cardioCarbs, 0)}g 碳水加入配额。脂肪不要逐餐精算，但要知道哪些食物会把脂肪吃爆。`,
      points: [
        ["碳水", "吃不下配额时，可用面条、面包、馒头等低饱腹主食；吃不够或容易饿时，优先米饭、玉米、红薯、土豆、燕麦。水果要定量并置换主食。"],
        ["有氧碳水", calc.cardioDaily > 0 ? `当前有氧日均 ${format(calc.cardioDaily, 0)} kcal，已折算为 +${format(calc.cardioCarbs, 0)}g 碳水并加入力训日/休息日。` : "当前没有填写有氧，所以碳水只按配额表计算。"],
        ["蛋白", "瘦肉基本是无明显脂肪层的猪牛羊肉、去皮鸡鸭肉、鱼虾；鸡鸭皮、肥牛肥羊、排骨、肉馅肉丸、肉肠、牛排都不算瘦肉。"],
        ["早餐模板", "全蛋约 6g 蛋白/3g 脂肪，蛋白约 3g 蛋白，蛋黄约 3g 蛋白/3g 脂肪，全脂牛奶约 12g 碳水/9g 蛋白/9g 脂肪。可用鸡蛋牛奶，也可用燕麦 + 乳清蛋白粉。"],
        ["脂肪", "正常带油炒菜每个菜大约吃油 5-10g。高脂肉、糖油混合物、油条、手抓饼、花式面包、炒鸡蛋、炒茄子最容易让脂肪超标。"],
        ["夜宵份额", "夜宵那 10% 少量碳水主要抵扣牛奶、蔬菜、调料等未计入碳水，不是鼓励专门吃碳水食物。不吃夜宵也没问题。"],
      ],
    },
    swap: {
      subtitle: "食物代换",
      leadTitle: "代换不是只换练后餐，而是每一餐都要能落地",
      leadText: "V0.3 把食物代换从“最大一顿”改成按餐次输出。力训日会看到练前餐、练后餐和正常餐；休息日会看到早餐、午饭、晚饭、零食/夜宵；无力训者则输出每日所有餐次。",
      points: [
        ["碳水怎么换", "用本餐碳水克数 ÷ 食物碳水率，得到熟米饭、面、红薯、燕麦等大约重量。水果也算碳水，要置换主食。"],
        ["蛋白怎么换", "用本餐蛋白克数 ÷ 食物蛋白率，得到瘦肉、鱼虾、蛋白粉等大约重量；鸡蛋、牛奶按单位蛋白反推数量。"],
        ["别把复杂食物当基础项", "包子、油条、手抓饼、花式面包、肉馅、肉丸、肥牛肥羊这类会同时带来大量脂肪，不能简单当主食或瘦肉。"],
      ],
    },
    trend: {
      subtitle: "平台期",
      leadTitle: calc.goal === goalMeta.cut ? "平台期先别慌，短期体重不等于脂肪" : "增肌更不能天天用体重判断肌肉",
      leadText: calc.goal === goalMeta.cut
        ? "减脂期每天真实脂肪变化通常只有几十克，很容易被食物残留、排便、盐分、水分滞留盖过去。单日上涨不是失败，真正有意义的是 1-2 周趋势。"
        : "肌肉增长比脂肪下降更慢，日体重几乎不可能反映真实肌肉增长。增肌期至少按月观察，不要每天盯着秤给自己加戏。",
      points: calc.goal === goalMeta.cut
        ? [
            ["为什么会假平台", "体内食糜、排便情况、盐分摄入、身体含水量、训练炎症都会让体重短期波动，和脂肪变化不一定有关。"],
            ["先排查执行", "有没有偷吃、低估外食、把高脂肉当瘦肉、把糖油混合物当主食、忽略炒菜油调料零食、称量错误。"],
            ["再调热量", "确认执行没问题后，每天少吃约 150 kcal，或每周多做约 1000 kcal 有氧但不加饮食。"],
          ]
        : [
            ["该怎么看", "增肌目标是慢慢涨：男性每月一般不超过 1kg，女性每月一般不超过 0.5kg。"],
            ["先排查训练", "长期低于每周 3 次力训，增肌进步会很有限；增肌必须有稳定训练。"],
            ["再加饮食", "一个月完全不长时，小幅增加 100-200 kcal，再继续观察。"],
          ],
    },
    strength: {
      subtitle: "力训保肌",
      leadTitle: "力训和减脂没有直接关系，但和保肌很有关系",
      leadText: "减脂需要的热量缺口可以由饮食提供；力训不是减脂的必要条件。它的价值是给肌肉一个“还需要你”的信号，减少减脂期肌肉损失，让体重下降时身材更像变紧实，而不是单纯变小。",
      points: [
        ["无力训也能减脂", "如果你当前不会练，先用无力量训练减脂表把饮食跑起来是可以的，不必因为没练就觉得减脂无效。"],
        ["想保肌就练 3-5 次/周", "如果目标是尽量保持肌肉，建议每周 3-5 次力量训练。几分化不是每周必须练几次，像排班一样往后排即可。"],
        ["你当前的设置", calc.noStrength ? "你选择了无力量训练，所以工具使用无力训减脂表，并且不拆训练日/休息日。" : "你选择了有力量训练，所以工具按训练日和休息日拆碳水；训练日多出的碳水主要服务训练前后。"],
      ],
    },
    cardio: {
      subtitle: "有氧补充",
      leadTitle: "要不要做有氧，取决于它解决什么问题",
      leadText: `有氧和饮食是互相置换的：做了有氧，就多了一笔日均消耗。你当前有氧折算为 ${format(calc.cardioDaily, 0)} kcal/天，并已加到碳水里，约 +${format(calc.cardioCarbs, 0)}g/天。`,
      points: [
        ["减脂怎么判断", cardioAdvice(calc)],
        ["碳水怎么加", "有氧热量优先加到碳水，不加到脂肪。这样力训日和休息日的碳水会同步增加，避免缺口被拉得过大。"],
        ["增肌怎么判断", "增肌期通常不需要靠有氧制造消耗；可以为了心肺、爱好、工作需要保留，但别影响力量训练恢复。"],
        ["时长上限", "如果要做有氧，强烈建议每周低于 4h。力训前不要做有氧；力训后如果做，一般不超过 30 分钟。"],
      ],
    },
    changelog: {
      subtitle: "V3.0",
      leadTitle: "V3.0 PWA 安装版",
      leadText: "V3.0 把网页升级成可安装 PWA：加入 manifest、Apple 主屏幕信息、应用图标和基础离线缓存。电脑端可从 Chrome 安装，手机端可添加到主屏幕。",
      groups: [
        {
          title: "V3.x",
          count: 1,
          note: "从网页工具到可安装 App",
          open: true,
          items: [
            ["V3.0 · 2026-05-14", "新增 PWA 安装能力：manifest、service worker、应用图标、Apple 主屏幕 meta 和离线静态资源缓存。"],
          ],
        },
        {
          title: "V2.x",
          count: 4,
          note: "有氧碳水、文档 UI、视觉换肤与手机版导览",
          items: [
            ["V2.3 · 2026-05-13", "手机版新增 3 步轻导览：身体目标、训练有氧、当前方案；已有数据用户默认进入当前方案，并提供修改数据和去食物代换的主行动。"],
            ["V2.2 · 2026-05-13", "冷黑器械感 UI 换肤：近黑背景、枪灰卡片、钢灰边框、荧光绿/琥珀强调，并统一 KPI、表格、Q&A、食物代换和 Changelog 的暗色视觉。"],
            ["V2.1 · 2026-05-09", "Changelog 改为可折叠版本树；修复身高、体重、目标 BMI 输入小数点时被实时刷新吞掉的问题。"],
            ["V2.0 · 2026-05-09", "有氧升级为大版本：有氧日均消耗按 4 kcal/g 折算为额外碳水，并同步加入力训日和休息日碳水；删除无计算意义的餐盘装饰；下方 README 改为执行提示。"],
          ],
        },
        {
          title: "V1.x",
          count: 5,
          note: "产品文档、导航与问答命名",
          items: [
            ["V1.4 · 2026-05-09", "将 QA 问答库统一命名为 Q&A 问答库，同步更新左侧入口、页面标题、分类 aria 标签和版本标识。"],
            ["V1.3 · 规划", "原计划修复 BMI 小数输入；该修复已合并到 V2.1 实现。"],
            ["V1.2 · 2026-05-09", "精简左侧功能栏：移除“体重秤”和“厨房秤”，把“7 天均值”改为“周期判断”，把“常吃主食”改为“碳蛋脂”。"],
            ["V1.1 · 2026-05-08", "左侧胶囊导航改为锚点跳转，并会同步切换产品文档 tab 到对应主题；初步按页面从上到下排列。"],
            ["V1.0 · 2026-05-08", "新增周期判断、碳蛋脂吃法、夜宵设计原理、早餐蛋白模板、Q&A 问答库和来源标注。"],
          ],
        },
        {
          title: "V0.x",
          count: 3,
          note: "从 Excel 到可用网页",
          items: [
            ["V0.3 · 2026-05-08", "可选食物代换改为训练日/休息日/无力训每日的全餐次输出；新增 README 和 Changelog tab。"],
            ["V0.2 · 2026-05-07", "重做 UI，新增“今天先执行”卡片，把平台期、脂肪、力训和有氧解释放进产品结构。"],
            ["V0.1 · 2026-05-02", "把自用 Excel 的减脂/增肌查表逻辑搬到网页，支持目标、性别、身高、体重和训练状态输入。"],
          ],
        },
      ],
    },
  };
  const current = tabs[activeGuideTab] || tabs.readme;

  document.querySelectorAll("[data-guide-tab]").forEach((button) => {
    const isActive = button.dataset.guideTab === activeGuideTab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  $("guideSubtitle").textContent = current.subtitle;
  const contentAnchor = activeGuideTab === "macro" ? ' id="stapleAnchor"' : "";
  $("guideContent").innerHTML = `
    <div class="guide-lead"${contentAnchor}>
      <b>${current.leadTitle}</b>
      <p>${current.leadText}</p>
    </div>
    ${current.groups ? renderChangelogTree(current.groups) : renderGuidePoints(current.points)}
  `;
}

function renderGuidePoints(points = []) {
  return `
    <div class="guide-points">
      ${points.map(([title, text]) => `
        <div class="guide-point">
          <b>${title}</b>
          <span>${text}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderChangelogTree(groups = []) {
  return `
    <div class="changelog-tree">
      ${groups.map((group) => `
        <details class="changelog-group" ${group.open ? "open" : ""}>
          <summary>
            <span class="log-arrow" aria-hidden="true">▸</span>
            <b>${group.title}</b>
            <em>${group.count} 个小版本</em>
            <small>${group.note}</small>
          </summary>
          <div class="changelog-items">
            ${group.items.map(([title, text]) => `
              <div class="changelog-item">
                <b>${title}</b>
                <span>${text}</span>
              </div>
            `).join("")}
          </div>
        </details>
      `).join("")}
    </div>
  `;
}

function renderQa() {
  document.querySelectorAll("[data-qa-tab]").forEach((button) => {
    const isActive = button.dataset.qaTab === activeQaTab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  const query = ($("qaSearch")?.value || "").trim().toLowerCase();
  const items = (qaData[activeQaTab] || []).filter(([question, answer]) => {
    if (!query) return true;
    return `${question} ${answer}`.toLowerCase().includes(query);
  });

  $("qaList").innerHTML = items.length
    ? items.map(([question, answer], index) => `
        <details class="qa-item" ${index === 0 ? "open" : ""}>
          <summary>
            <span>${question}</span>
            <b>${activeQaTab === "cut" ? "减脂" : "增肌"}</b>
          </summary>
          <p>${answer}</p>
        </details>
      `).join("")
    : `
        <div class="qa-empty">
          <b>没有找到相关问题</b>
          <span>换个关键词试试，比如“外卖”“夜宵”“BMI”“蛋白粉”。</span>
        </div>
      `;
}

function renderMeals(target, meals, emptyMessage) {
  if (!meals.length) {
    target.innerHTML = `
      <div class="meal-row meal-empty">
        <b>${emptyMessage || "暂无用餐拆分"}</b>
      </div>
    `;
    return;
  }
  target.innerHTML = meals.map((meal) => `
    <div class="meal-row">
      <b>${meal.name}</b>
      <div class="num">${format(meal.carbs, 0)}<small> 碳水</small></div>
      <div class="num">${format(meal.protein, 0)}<small> 蛋白</small></div>
    </div>
  `).join("");
}

function renderFood(calc) {
  if (!calc.quota.available || !calc.trainingMeals.length) {
    $("foodOutput").innerHTML = `
      <div class="food-card">
        <b>查表后再换算</b>
        <small>${calc.quota.message}</small>
      </div>
    `;
    return;
  }

  const carbFood = carbFoods.find((item) => item.id === state.carbFood) || carbFoods[0];
  const proteinFood = proteinFoods.find((item) => item.id === state.proteinFood) || proteinFoods[0];

  const sections = calc.noStrength
    ? [{
        title: "每日代换",
        note: "无力量训练模式输出每天所有餐次，不再只显示最大的一顿。",
        meals: calc.trainingMeals,
      }]
    : [
        {
          title: "力训日代换",
          note: "包含练前餐、练后餐和正常餐；练前餐可能只需要少量碳水。",
          meals: calc.trainingMeals,
        },
        {
          title: "休息日代换",
          note: "不力训就叫休息日，与当天是否有氧无关。",
          meals: calc.restMeals,
        },
      ];

  $("foodOutput").innerHTML = `
    <div class="swap-intro">
      <b>当前代换食物</b>
      <span>碳水用「${carbFood.label}」，蛋白用「${proteinFood.label}」。下面逐餐反推大约重量。</span>
    </div>
    <div class="swap-output">
      ${sections.map((section) => renderSwapSection(section, carbFood, proteinFood)).join("")}
    </div>
    <div class="swap-note">
      <b>脂肪仍按文字指导吃</b>
      <span>${fatGuideText(calc)}。不要把高脂肉、糖油混合物、油条、花式面包、肉馅肉丸当成普通主食或瘦肉来代换。</span>
    </div>
  `;
}

function renderSwapSection(section, carbFood, proteinFood) {
  return `
    <section class="swap-section">
      <div class="swap-section-head">
        <b>${section.title}</b>
        <span>${section.note}</span>
      </div>
      <div class="swap-table">
        <div class="swap-row swap-row-head">
          <span>餐次</span>
          <span>碳水代换</span>
          <span>蛋白代换</span>
        </div>
        ${section.meals.map((meal) => `
          <div class="swap-row">
            <span class="swap-meal">${meal.name}</span>
            <span class="swap-food">${meal.carbs < 1 ? "不需要" : `${format(meal.carbs, 0)}g 碳水 ≈ ${foodAmountText(meal.carbs, carbFood)}`}</span>
            <span class="swap-food">${meal.protein < 1 ? "可不配" : `${format(meal.protein, 0)}g 蛋白 ≈ ${foodAmountText(meal.protein, proteinFood)}`}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function foodAmountText(nutrientGrams, food) {
  if (food.unitProtein) {
    return `${format(nutrientGrams / food.unitProtein, 1)}${food.unit}`;
  }
  return `${format(nutrientGrams / food.rate, 0)}g`;
}

function renderNotices(calc) {
  const notices = [];
  notices.push({
    level: calc.quota.available ? "ok" : "danger",
    title: "1. 查表状态",
    text: calc.quota.available
      ? `${calc.quota.tableTitle}：${calc.quota.message} 当前按 ${calc.quota.matchedWeight}kg 档查系数，再乘以你输入的 ${format(state.weight, 1)}kg 计算克数。`
      : calc.quota.message,
  });
  notices.push({
    level: "ok",
    title: "2. 当前组合",
    text: `${calc.goal.label} · ${calc.noStrength ? "无力量训练" : "有力量训练"} · ${Number(state.cardioHours) > 0 ? "有有氧" : "无有氧"}。${calc.noStrength ? "无力训模式只输出每日碳水、蛋白和脂肪指导，不拆训练日/休息日。" : "有力训时再选择训练时段，并分别输出训练日和休息日。"}`
  });
  notices.push({
    level: "ok",
    title: "3. 有氧碳水",
    text: calc.cardioDaily > 0
      ? `每周有氧 ${format(state.cardioHours, state.cardioHours % 1 ? 2 : 0)}h，日均约 ${format(calc.cardioDaily, 0)} kcal，已折算为 +${format(calc.cardioCarbs, 0)}g 碳水加入每日配额。建议每周有氧低于 4h。`
      : "当前未填写有氧，所以不会额外加碳水。若要做有氧，建议每周低于 4h，有氧热量优先加到碳水。"
  });
  notices.push({
    level: "ok",
    title: "4. 先按表执行",
    text: "前 1-2 周尽量用厨房秤建立手感。表格不是让你永远机械称重，而是让你知道普通一碗饭、一份瘦肉、一顿外食大概意味着什么。",
  });
  notices.push({
    level: "ok",
    title: calc.goal === goalMeta.cut ? "5. 减脂热量公式" : "5. 增肌热量公式",
    text: calc.goal === goalMeta.cut
      ? "减脂合适热量缺口约 20%，本该吃平衡热量 ×0.8；考虑定量饮食里也可能不自觉多吃约 10-20%，以及主食蛋白质、脂肪等部分热量没有计入，所以工具采用 1×0.8×0.8=0.64。数字看似低，实际吃到的热量通常会高于此数。"
      : "干净增肌合适热量盈余约 5%，本该吃平衡热量 ×1.05；考虑定量饮食里也可能不自觉多吃约 10-20%，以及部分食物热量没有计入，所以工具采用 1×1.05×0.8=0.84。数字看似偏低，实际吃到的热量通常会高于此数。",
  });
  notices.push({
    level: "warn",
    title: "6. 脂肪建议",
    text: `${fatGuideText(calc)}。${state.goal === "bulk" ? "增肌期推荐在减脂推荐模式上额外加 30g 坚果；如果不吃蛋黄牛奶或长期低油无油，按“碳蛋脂”页签补足。" : "脂肪不用像碳水和蛋白那样细算，按食物选择指导吃就行：不要长期低于这个量，也不要靠高脂肉和糖油混合物把热量吃爆。"}`,
  });
  notices.push({
    level: "warn",
    title: "7. 食物选择底线",
    text: "主食看碳水率，瘦肉看蛋白率。红薯、土豆、玉米、山药、芋头算主食；鸡鸭皮、肥牛肥羊、排骨、肉馅肉丸、炸物和糖油混合物不能当普通瘦肉或主食。",
  });
  notices.push({
    level: "ok",
    title: "8. 观察反馈",
    text: calc.goal === goalMeta.cut
      ? "减脂看 7-14 天平均体重。短期卡住先考虑食物残留、排便、水盐和训练炎症，再决定是否调整。"
      : "增肌看月度趋势。体重一个月完全不长，再小幅增加热量；涨太快也要调，避免脂肪增加过多。",
  });
  notices.push({
    level: "ok",
    title: "9. 数据隐私",
    text: "页面在浏览器本地计算，输入的身高、体重、年龄等数据只保存在当前设备的浏览器里，不会上传到服务器。",
  });
  notices.push({
    level: "ok",
    title: "10. 内容出处",
    text: "饮食逻辑来自 B 站 UP 主“好人松松”的生活化减脂增肌视频和配套 Excel；本网页是二次产品化整理，方便自用和分享。",
  });

  if (calc.bmi < 18.5) {
    notices.push({ level: "danger", title: "BMI 提醒", text: "BMI 已低于 18.5，不建议继续压热量。" });
  } else if (calc.bmi >= 28) {
    notices.push({ level: "warn", title: "BMI 提醒", text: "BMI 已进入肥胖区间，减重时更建议稳、慢、可持续；如有慢病或不适，先咨询医生。" });
  }

  if (calc.quota.available && calc.goal === goalMeta.cut && calc.restMacros && calc.restMacros.kcal > calc.eatRest + 120) {
    notices.push({
      level: "warn",
      title: "配额提醒",
      text: "宏量配额估算热量高于预留后应吃热量。先按表执行碳水和蛋白，脂肪按指导文字吃，观察 1-2 周体重趋势后再微调。",
    });
  }

  $("notices").innerHTML = notices.map((item) => `
    <div class="notice ${item.level === "ok" ? "" : item.level}">
      <b>${item.title}</b>
      <span>${item.text}</span>
    </div>
  `).join("");
}

function cardioAdvice(calc) {
  if (calc.goal === goalMeta.bulk) {
    return "增肌期有氧不是用来制造消耗的主工具；可以保留少量低强度有氧维持心肺和食欲，但建议每周低于 4h，别多到影响力量训练恢复。";
  }
  if (state.trainingStatus === "none") {
    return "不会力训也可以先只做饮食方案。有氧可作为补充，但建议每周低于 4h，别用有氧抵消长期吃超；能稳定执行饮食更重要。";
  }
  if (state.weight > 80) {
    return "当前体重大于 80kg，通常先不需要有氧；饮食执行到位一般够用。若要做，优先选游泳、单车、椭圆仪这类更友好的方式，并控制在每周 4h 内。";
  }
  if (state.weight >= 70) {
    return "当前体重在 70-80kg，通常先不做有氧；如果按方案吃明显饿，再加少量有氧换取更多可吃碳水。";
  }
  return "当前体重低于 70kg，基础消耗较低，可默认每周约 2 小时有氧，让饮食热量和碳水稍微宽裕一点。";
}

function copySummary() {
  const calc = calculate(state);
  const lines = [
    `${calc.goal.label}方案：${calc.noStrength ? "无力训每日方案" : calc.slot.title}`,
    `查表：${calc.quota.available ? `${calc.quota.tableTitle}，${calc.quota.matchedHeight}cm/${calc.quota.matchedWeight}kg档` : calc.quota.message}`,
    `BMI：${format(calc.bmi, 1)}（${bmiLabel(calc.bmi)}）`,
    `基础代谢：${format(calc.bmr, 0)} kcal/天`,
    `无运动总消耗：${format(calc.baseBurn, 0)} kcal/天`,
    `有氧日均：${format(calc.cardioDaily, 0)} kcal/天（碳水 +${format(calc.cardioCarbs, 0)}g/天）`,
    `理论${calc.goal.deltaLabel}：${format(Math.abs(calc.theoryDelta), 0)} kcal/天`,
    `预留后平均应吃：${format(calc.weeklyEat, 0)} kcal/天`,
  ];

  if (calc.quota.available) {
    lines.push(`脂肪指导：${fatGuideText(calc)}，不需要逐餐精算`);
    if (calc.noStrength) {
      lines.push(`每日宏量：碳水 ${format(calc.trainingMacros.carbs, 0)}g，蛋白 ${format(calc.trainingMacros.protein, 0)}g`);
    } else {
      lines.push(`力训日宏量：碳水 ${format(calc.trainingMacros.carbs, 0)}g，蛋白 ${format(calc.trainingMacros.protein, 0)}g`);
      lines.push(`休息日宏量：碳水 ${format(calc.restMacros.carbs, 0)}g，蛋白 ${format(calc.restMacros.protein, 0)}g`);
    }
  }

  navigator.clipboard?.writeText(lines.join("\n"))
    .then(() => showToast("摘要已复制"))
    .catch(() => showToast("浏览器未允许复制"));
}

function bmiLabel(bmi) {
  if (bmi < 18.5) return "偏低";
  if (bmi < 24) return "正常";
  if (bmi < 28) return "超重";
  return "肥胖";
}

function roundTo(value, step) {
  return Math.round(value / step) * step;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function nearest(values, target) {
  return values.reduce((best, value) => (
    Math.abs(value - target) < Math.abs(best - target) ? value : best
  ), values[0]);
}

function sanitizePositive(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function format(value, digits = 0) {
  if (!Number.isFinite(value)) return "--";
  return new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

init();
