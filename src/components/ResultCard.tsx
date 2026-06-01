import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getAerobicActivity, getAerobicUnitLabel } from "../data/aerobic";
import { disclaimerCopy, sourceCopy } from "../data/copy";
import { getRoleLabel } from "../data/mealTiming";
import { QuotaInput, QuotaResult, formatResultText } from "../lib/calculateQuota";

interface ResultCardProps {
  input: QuotaInput;
  result: QuotaResult;
}

const carbFoods = [
  { id: "rice", label: "米饭（一般）", rate: 0.3 },
  { id: "bread", label: "切片面包 / 馒头", rate: 0.5 },
  { id: "noodle", label: "细面（熟）", rate: 0.23 },
  { id: "sweet-potato", label: "红薯（蒸煮）", rate: 0.18 },
  { id: "banana", label: "香蕉", rate: 0.2 },
];

const proteinFoods = [
  { id: "lean-cooked", label: "瘦肉（一般熟肉）", rate: 0.25 },
  { id: "lean-raw", label: "家禽家畜生肉", rate: 0.2 },
  { id: "fish", label: "鱼虾生肉", rate: 0.18 },
  { id: "whey", label: "乳清蛋白粉", rate: 0.8 },
  { id: "milk", label: "纯牛奶", rate: 0.03 },
];

export function ResultCard({ input, result }: ResultCardProps) {
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");
  const [carbFoodId, setCarbFoodId] = useState("rice");
  const [proteinFoodId, setProteinFoodId] = useState("lean-cooked");
  const resultText = formatResultText(input, result);
  const aerobicActivity = getAerobicActivity(input.aerobicActivityId);
  const carbFood = carbFoods.find((food) => food.id === carbFoodId) ?? carbFoods[0];
  const proteinFood =
    proteinFoods.find((food) => food.id === proteinFoodId) ?? proteinFoods[0];
  const mealPlan = useMemo(() => createMealPlan(input, result), [input, result]);

  async function copyResult() {
    try {
      await copyText(resultText);
      setCopyState("success");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <section className="dashboard" aria-live="polite">
      <section className="plan-hero">
        <div>
          <p className="eyebrow">当前方案</p>
          <h2>{getTimingLabel(input)} · {input.goal === "fat-loss" ? "减脂" : "增肌"}</h2>
          <p>
            {input.goal === "fat-loss"
              ? "先把饮食缺口做出来，再用 7-14 天体重均值校准。"
              : "先保证稳定力训，再用小幅热量盈余推动体重和训练表现。"}
          </p>
        </div>
        <div className="plan-actions">
          <button type="button" onClick={copyResult}>⧉</button>
          <button type="button" onClick={() => window.print()}>⎙</button>
        </div>
      </section>

      {result.status === "available" && result.values ? (
        <section className="today-card">
          <p className="eyebrow">今天先执行</p>
          <h3>{getPrimaryMacroText(result)}</h3>
          <p>
            蛋白约 {result.values.protein}g/天，{getFatGuide(input.weight)}g 脂肪指导；
            训练日多出的碳水优先放在训练前后。
          </p>
          <div className="quick-grid">
            <QuickItem title="先称 1-2 周" body="主食、瘦肉和常用碗盘先建立手感，后面才容易生活化执行。" />
            <QuickItem title="看趋势" body="平台期先看水盐、排便、训练炎症和食物残留，别被单日体重带着改方案。" />
            <QuickItem title="再微调" body="执行 1-2 周仍不掉，再每天少 150 kcal 或每周多 1000 kcal 有氧。" />
            <QuickItem title="训练定位" body={`当前每周 ${input.strengthDays} 天力训；目标是保留肌肉信号，不是抵消乱吃。`} />
          </div>
        </section>
      ) : (
        <section className="today-card warning-card">
          <p className="eyebrow">当前组合</p>
          <h3>暂不支持</h3>
          <p>{result.message}</p>
        </section>
      )}

      <section className="card-section" id="cycle">
        <SectionTitle title="周期判断" aside="BMI 只是入口，腰围和健康状态也要看" />
        <div className="cycle-grid">
          <div className="cycle-main">
            <span>当前建议</span>
            <strong>{getCycleAdvice(input, result)}</strong>
            <p>
              当前 BMI {result.bmi.value}，目标 BMI {input.targetBmi}。继续看 7-14 天体重均值，不要被单日波动带着改方案。
            </p>
          </div>
          <MetricTile label="BMI" value={String(result.bmi.value)} sub={result.bmi.category} />
          <MetricTile label="基础代谢" value={formatNumber(result.energy.bmr)} sub="kcal/天" />
          <MetricTile
            label={input.trainingStatus === "strength" ? "力训日应吃" : "每日应吃"}
            value={formatNumber(result.energy.targetTraining ?? result.energy.targetDaily ?? 0)}
            sub={`平衡热量 × ${result.energy.multiplier}`}
          />
          {input.trainingStatus === "strength" && (
            <MetricTile
              label="休息日应吃"
              value={formatNumber(result.energy.targetRest ?? 0)}
              sub={`平衡热量 × ${result.energy.multiplier}`}
            />
          )}
        </div>
      </section>

      <section className="card-section">
        <SectionTitle title="热量结构" aside={`理论缺口约 ${getDailyGap(result)} kcal/天`} />
        <EnergyBars result={result} />
      </section>

      <section className="card-section" id="docs">
        <SectionTitle title="产品文档" aside="README" />
        <div className="doc-tabs">
          {["README", "周期判断", "热量逻辑", "碳蛋脂", "食物代换", "平台期", "力训保肌", "有氧补充", "Changelog"].map((tab) => (
            <button key={tab} type="button">{tab}</button>
          ))}
        </div>
        <div className="doc-grid">
          <article>
            <h3>先读懂设计逻辑，再开始照表执行</h3>
            <p>
              这个工具不是固定食谱，而是把 Excel 套表里的饮食系统变成网页：先判断周期，再估算热量，再查表分配碳水和蛋白，脂肪用生活化规则控制。
            </p>
          </article>
          <article><h3>适用人群</h3><p>想做生活化减脂或干净增肌的人。无力训可以减脂；增肌默认需要稳定力量训练。</p></article>
          <article><h3>使用顺序</h3><p>先填身体和目标，再确认力训、有氧和训练时段，最后看今日执行、餐次配额和食物代换。</p></article>
          <article><h3>内容出处</h3><p>{sourceCopy}</p></article>
          <article><h3>边界提醒</h3><p>{disclaimerCopy}</p></article>
        </div>
      </section>

      {result.status === "available" && result.values && (
        <>
          <section className="dual-grid" id="meals">
            <MealCard title="力训日" kcal={result.energy.targetTraining} rows={mealPlan.training} />
            <MealCard title="休息日" kcal={result.energy.targetRest ?? result.energy.targetDaily} rows={mealPlan.rest} />
          </section>

          <section className="dual-grid" id="swap">
            <section className="card-section">
              <SectionTitle title="可选食物代换" aside="按餐次逐餐换算" />
              <div className="swap-selects">
                <label>
                  <span>碳水食物</span>
                  <select value={carbFoodId} onChange={(event) => setCarbFoodId(event.target.value)}>
                    {carbFoods.map((food) => <option key={food.id} value={food.id}>{food.label}</option>)}
                  </select>
                </label>
                <label>
                  <span>蛋白食物</span>
                  <select value={proteinFoodId} onChange={(event) => setProteinFoodId(event.target.value)}>
                    {proteinFoods.map((food) => <option key={food.id} value={food.id}>{food.label}</option>)}
                  </select>
                </label>
              </div>
              <SwapTable title="力训日代换" rows={mealPlan.training} carbFood={carbFood} proteinFood={proteinFood} />
              <SwapTable title="休息日代换" rows={mealPlan.rest} carbFood={carbFood} proteinFood={proteinFood} />
              <p className="footnote">脂肪仍按文字指导吃；不要把高脂肉、糖油混合物、炸物当成普通主食或瘦肉来代换。</p>
            </section>

            <section className="card-section">
              <SectionTitle title="执行提示" aside="V3.0 · 当前方案校验" />
              <ol className="tips-list">
                {getTips(input, result).map((tip) => <li key={tip}>{tip}</li>)}
              </ol>
            </section>
          </section>
        </>
      )}

      <section className="card-section" id="qa">
        <SectionTitle title="Q&A 问答库" aside="先保留原表问答入口" />
        <div className="qa-toolbar">
          <button type="button">减脂问答</button>
          <button type="button">增肌问答</button>
          <input type="search" placeholder="例如：平台期、外卖、夜宵、蛋白粉" />
        </div>
        <div className="qa-list">
          {["执行 2 周体重不掉怎么办？", "BMI 正常但还能减脂吗？", "为什么新手初期体重变化很大？", "外卖饮食怎么处理？", "蛋白粉有必要喝吗？"].map((item) => (
            <button key={item} type="button"><span>{item}</span><em>减脂</em></button>
          ))}
        </div>
      </section>

      <p className="plain-result">{resultText}</p>
      <span className="copy-status">
        {copyState === "success" && "已复制到剪贴板"}
        {copyState === "error" && "复制失败，可以手动选中结果文本"}
      </span>
    </section>
  );
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back for local preview or embedded browsers where Clipboard API is blocked.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Copy command failed");
  }
}

function QuickItem({ title, body }: { title: string; body: string }) {
  return (
    <article>
      <strong>{title}</strong>
      <p>{body}</p>
    </article>
  );
}

function SectionTitle({ title, aside }: { title: string; aside?: string }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {aside && <span>{aside}</span>}
    </div>
  );
}

function MetricTile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="metric-tile">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{sub}</small>
    </div>
  );
}

function EnergyBars({ result }: { result: QuotaResult }) {
  const values = [
    ["无运动总消耗", result.energy.noExerciseTotal, "blue"],
    ["有氧日均加成", result.energy.dailyAerobic, "yellow"],
    ["力训单日加成", result.energy.strengthBurn, "green"],
    ["理论缺口", getDailyGap(result), "red"],
    ["力训日应吃", result.energy.targetTraining ?? result.energy.targetDaily ?? 0, "lime"],
    ["休息日应吃", result.energy.targetRest ?? result.energy.targetDaily ?? 0, "gray"],
  ];
  const max = Math.max(...values.map(([, value]) => Number(value)), 1);

  return (
    <div className="energy-bars">
      {values.map(([label, value, color]) => (
        <div className="bar-row" key={String(label)}>
          <span>{label}</span>
          <i><b className={`bar-${color}`} style={{ width: `${(Number(value) / max) * 100}%` }} /></i>
          <strong>{formatNumber(Number(value))}</strong>
        </div>
      ))}
    </div>
  );
}

interface MealRow {
  label: string;
  role: string;
  carb: number;
  protein: number;
}

function MealCard({ title, kcal, rows }: { title: string; kcal?: number; rows: MealRow[] }) {
  const carbTotal = rows.reduce((sum, row) => sum + row.carb, 0);
  const proteinTotal = rows.reduce((sum, row) => sum + row.protein, 0);

  return (
    <section className="card-section meal-card">
      <SectionTitle title={title} aside={`${formatNumber(kcal ?? 0)} kcal 估算`} />
      <div className="meal-totals">
        <MetricTile label="碳水 g" value={String(carbTotal)} sub="按表" />
        <MetricTile label="蛋白 g" value={String(proteinTotal)} sub="每日" />
        <MetricTile label="脂肪指导" value="60g" sub="生活化" />
      </div>
      <MealRows rows={rows} />
    </section>
  );
}

function MealRows({ rows }: { rows: MealRow[] }) {
  return (
    <div className="meal-rows">
      {rows.map((row) => (
        <div key={row.label}>
          <span>{row.label}</span>
          <strong>{row.carb} 碳水</strong>
          <em>{row.protein > 0 ? `${row.protein} 蛋白` : "可不配"}</em>
        </div>
      ))}
    </div>
  );
}

function SwapTable({
  title,
  rows,
  carbFood,
  proteinFood,
}: {
  title: string;
  rows: MealRow[];
  carbFood: { label: string; rate: number };
  proteinFood: { label: string; rate: number };
}) {
  return (
    <div className="swap-table">
      <h3>{title}</h3>
      {rows.map((row) => (
        <div key={`${title}-${row.label}`}>
          <span>{row.label}</span>
          <strong>{row.carb}g 碳水 ≈ {Math.round(row.carb / carbFood.rate)}g</strong>
          <em>{row.protein > 0 ? `${row.protein}g 蛋白 ≈ ${Math.round(row.protein / proteinFood.rate)}g` : "可不配"}</em>
        </div>
      ))}
    </div>
  );
}

function createMealPlan(input: QuotaInput, result: QuotaResult) {
  const values = result.values;
  if (!values) return { training: [], rest: [] };

  const trainingCarb = values.trainingCarb ?? values.carb ?? 0;
  const restCarb = values.restCarb ?? values.carb ?? 0;
  const protein = values.protein;
  const steps = result.mealSteps;

  const trainingRatios = steps.map((step) => {
    if (step.role === "post") return { carb: 0.35, protein: 0.3 };
    if (step.role === "pre") return { carb: 0.15, protein: 0 };
    if (step.role === "snack") return { carb: 0.1, protein: 0.2 };
    return { carb: 0.2, protein: 0.25 };
  });
  const training = distribute(steps, trainingRatios, trainingCarb, protein);
  const restSteps = input.trainingStatus === "strength"
    ? [
        { label: "早饭", role: "normal" },
        { label: "午饭", role: "normal" },
        { label: "晚饭", role: "normal" },
        { label: "零食 / 夜宵", role: "snack" },
      ]
    : steps;
  const rest = distribute(
    restSteps,
    [
      { carb: 0.25, protein: 0.2 },
      { carb: 0.3125, protein: 0.3 },
      { carb: 0.3125, protein: 0.3 },
      { carb: 0.125, protein: 0.2 },
    ],
    restCarb,
    protein,
  );

  return { training, rest };
}

function distribute(
  steps: { label: string; role: string }[],
  ratios: { carb: number; protein: number }[],
  carbTotal: number,
  proteinTotal: number,
) {
  let carbUsed = 0;
  let proteinUsed = 0;

  return steps.map((step, index) => {
    const last = index === steps.length - 1;
    const carb = last ? carbTotal - carbUsed : Math.round(carbTotal * (ratios[index]?.carb ?? 0));
    const protein = last
      ? proteinTotal - proteinUsed
      : Math.round(proteinTotal * (ratios[index]?.protein ?? 0));
    carbUsed += carb;
    proteinUsed += protein;

    return {
      label: step.label,
      role: getRoleLabel(step.role as never),
      carb,
      protein,
    };
  });
}

function getTimingLabel(input: QuotaInput) {
  if (input.trainingStatus === "no-strength") return "无力训";
  const match = resultTimingLabels[input.trainingTiming] ?? "力训日";
  return match;
}

const resultTimingLabels: Record<string, string> = {
  "breakfast-early": "早饭后练",
  "breakfast-late": "早饭后练",
  "before-lunch": "午饭前练",
  "after-lunch": "午饭后练",
  "before-dinner": "晚饭前练",
  "after-dinner": "晚饭后练",
  night: "夜里练",
};

function getPrimaryMacroText(result: QuotaResult) {
  if (!result.values) return "当前组合不可用";
  if (typeof result.values.trainingCarb === "number") {
    return `力训日碳水 ${result.values.trainingCarb}g，休息日 ${result.values.restCarb}g`;
  }
  return `每日碳水 ${result.values.carb}g`;
}

function getFatGuide(weight: number) {
  return weight >= 120 ? 70 : 60;
}

function getCycleAdvice(input: QuotaInput, result: QuotaResult) {
  if (input.goal === "muscle-gain") return "关注训练表现和体重缓慢上升";
  return result.bmi.value > input.targetBmi ? "仍可按减脂执行" : "接近目标，准备转入维持或增肌";
}

function getDailyGap(result: QuotaResult) {
  const target = result.energy.targetTraining ?? result.energy.targetDaily ?? 0;
  const balance = result.energy.balanceTraining ?? result.energy.balanceDaily ?? 0;
  return Math.max(0, Math.round(balance - target));
}

function getTips(input: QuotaInput, result: QuotaResult) {
  return [
    `查表状态：按 ${result.matchedHeight}cm / ${result.matchedWeight}kg 档查系数，再乘以你输入的 ${input.weight}kg 计算克数。`,
    `当前组合：${input.goal === "fat-loss" ? "减脂" : "增肌"} · ${input.trainingStatus === "strength" ? "有力量训练" : "无力量训练"} · ${result.energy.dailyAerobic > 0 ? "有氧已计入" : "无有氧"}`,
    result.energy.dailyAerobic > 0
      ? `有氧平均每天 ${result.energy.dailyAerobic} kcal，可优先加到碳水。`
      : "当前未填写有氧，所以不会额外加碳水。",
    "前 1-2 周尽量用厨房秤建立手感；后续目标是生活化执行，不是永远机械称重。",
    "减脂看 7-14 天均值，不看单日体重。",
    "外卖优先选清晰主食和瘦肉，避开糖油混合物、高脂肉和炸物。",
  ];
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value);
}
