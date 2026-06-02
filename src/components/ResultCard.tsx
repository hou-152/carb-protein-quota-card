import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getAerobicActivity, getAerobicUnitLabel } from "../data/aerobic";
import { disclaimerCopy, sourceCopy } from "../data/copy";
import { getRoleLabel } from "../data/mealTiming";
import { qaData } from "../data/qa";
import type { QaCategory } from "../data/qa";
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
  const [activeGuideTab, setActiveGuideTab] = useState<GuideTabId>("readme");
  const [qaCategory, setQaCategory] = useState<QaCategory>(input.goal);
  const [qaKeyword, setQaKeyword] = useState("");
  const [openQaIndex, setOpenQaIndex] = useState(-1);
  const resultText = formatResultText(input, result);
  const aerobicActivity = getAerobicActivity(input.aerobicActivityId);
  const carbFood = carbFoods.find((food) => food.id === carbFoodId) ?? carbFoods[0];
  const proteinFood =
    proteinFoods.find((food) => food.id === proteinFoodId) ?? proteinFoods[0];
  const mealPlan = useMemo(() => createMealPlan(input, result), [input, result]);
  const guideTabs = useMemo(() => createGuideTabs(input, result), [input, result]);
  const activeGuide = guideTabs[activeGuideTab] ?? guideTabs.readme;
  const qaItems = useMemo(() => {
    const keyword = qaKeyword.trim().toLowerCase();
    if (!keyword) return qaData[qaCategory];

    return qaData[qaCategory].filter((item) =>
      `${item.q}\n${item.a}`.toLowerCase().includes(keyword),
    );
  }, [qaCategory, qaKeyword]);

  useEffect(() => {
    setQaCategory(input.goal);
  }, [input.goal]);

  useEffect(() => {
    setOpenQaIndex(-1);
  }, [qaCategory, qaKeyword]);

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
        <div className="plan-copy">
          <p className="eyebrow">当前方案</p>
          <h2>{getTimingLabel(input)} · {input.goal === "fat-loss" ? "减脂" : "增肌"}</h2>
          <p>
            {input.goal === "fat-loss"
              ? "先把饮食缺口做出来，再用 7-14 天体重均值校准。"
              : "先保证稳定力训，再用小幅热量盈余推动体重和训练表现。"}
          </p>
        </div>
        <div className="plan-actions">
          <div className="plan-stat-stack" aria-label="当前方案关键读数">
            <span>
              <b>BMI</b>
              <strong>{result.bmi.value}</strong>
            </span>
            <span>
              <b>目标热量</b>
              <strong>{formatNumber(result.energy.targetTraining ?? result.energy.targetDaily ?? 0)}</strong>
            </span>
            <span>
              <b>蛋白</b>
              <strong>{result.values?.protein ?? 0}g</strong>
            </span>
          </div>
          <div className="plan-buttons">
            <button type="button" aria-label="复制方案" onClick={copyResult}>⧉</button>
            <button type="button" aria-label="打印方案" onClick={() => window.print()}>⎙</button>
          </div>
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
          {result.aerobicCarb > 0 && (
            <p className="aerobic-note">
              已把有氧日均加成折算为约 +{result.aerobicCarb}g 碳水，并入上面的碳水总量。
              {getBasalCarbText(result)}
            </p>
          )}
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
        <SectionTitle title="产品文档" aside={activeGuide.subtitle} />
        <div className="doc-tabs" role="tablist" aria-label="方案说明">
          {guideOrder.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={activeGuideTab === id ? "active" : ""}
              aria-selected={activeGuideTab === id}
              role="tab"
              onClick={() => setActiveGuideTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <GuideContent tab={activeGuide} />
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
        <SectionTitle title="Q&A 问答库" aside={`来自原表问答汇总 · 当前 ${qaItems.length} 条`} />
        <div className="qa-toolbar">
          <div className="qa-tabs" role="tablist" aria-label="问答分类">
            <button
              type="button"
              className={qaCategory === "fat-loss" ? "active" : ""}
              onClick={() => setQaCategory("fat-loss")}
            >
              减脂问答
            </button>
            <button
              type="button"
              className={qaCategory === "muscle-gain" ? "active" : ""}
              onClick={() => setQaCategory("muscle-gain")}
            >
              增肌问答
            </button>
          </div>
          <input
            type="search"
            value={qaKeyword}
            onChange={(event) => setQaKeyword(event.target.value)}
            placeholder="例如：平台期、外卖、夜宵、蛋白粉"
          />
        </div>
        <div className="qa-list">
          {qaItems.length === 0 ? (
            <p className="qa-empty">没有匹配「{qaKeyword}」的问答，换个关键词试试。</p>
          ) : (
            qaItems.map((item, index) => {
              const isOpen = index === openQaIndex;

              return (
                <article className={`qa-item ${isOpen ? "open" : ""}`} key={item.q}>
                  <button type="button" onClick={() => setOpenQaIndex(isOpen ? -1 : index)}>
                    <span>{item.q}</span>
                    <em>{qaCategory === "fat-loss" ? "减脂" : "增肌"}</em>
                  </button>
                  {isOpen && <p>{item.a}</p>}
                </article>
              );
            })
          )}
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

type GuideTabId =
  | "readme"
  | "cycle"
  | "diet"
  | "macro"
  | "swap"
  | "trend"
  | "strength"
  | "cardio"
  | "changelog";

interface GuideTab {
  subtitle: string;
  leadTitle: string;
  leadText: string;
  points?: Array<[string, string]>;
  groups?: Array<{
    title: string;
    count: number;
    note: string;
    open?: boolean;
    items: Array<[string, string]>;
  }>;
}

const guideOrder: Array<[GuideTabId, string]> = [
  ["readme", "README"],
  ["cycle", "周期判断"],
  ["diet", "热量逻辑"],
  ["macro", "碳蛋脂"],
  ["swap", "食物代换"],
  ["trend", "平台期"],
  ["strength", "力训保肌"],
  ["cardio", "有氧补充"],
  ["changelog", "Changelog"],
];

function GuideContent({ tab }: { tab: GuideTab }) {
  return (
    <div className="guide-content">
      <article className="guide-lead">
        <h3>{tab.leadTitle}</h3>
        <p>{tab.leadText}</p>
      </article>
      {tab.groups ? (
        <div className="changelog-tree">
          {tab.groups.map((group) => (
            <details className="changelog-group" key={group.title} open={group.open}>
              <summary>
                <strong>{group.title}</strong>
                <span>{group.count} 条 · {group.note}</span>
              </summary>
              <div className="changelog-items">
                {group.items.map(([title, text]) => (
                  <article key={title}>
                    <b>{title}</b>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="guide-points">
          {(tab.points ?? []).map(([title, text]) => (
            <article className="guide-point" key={title}>
              <b>{title}</b>
              <span>{text}</span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function createGuideTabs(input: QuotaInput, result: QuotaResult): Record<GuideTabId, GuideTab> {
  const isFatLoss = input.goal === "fat-loss";
  const noStrength = input.trainingStatus === "no-strength";
  const dailyGap = getDailyGap(result);
  const carbAdd = result.aerobicCarb;
  const dailyAerobic = result.energy.dailyAerobic;
  const targetEat = result.energy.targetTraining ?? result.energy.targetDaily ?? 0;
  const goalLabel = isFatLoss ? "减脂" : "增肌";
  const strengthLabel = noStrength ? "无力量训练" : "有力量训练";

  return {
    readme: {
      subtitle: "README",
      leadTitle: "先读懂设计逻辑，再开始照表执行",
      leadText:
        "这个工具不是一张固定食谱，而是把 Excel 套表里的饮食系统变成网页：先判断周期，再估算热量，再查表分配碳水和蛋白，脂肪用生活化规则控制。前 1-2 周尽量定量，是为了建立自己的饮食坐标系。",
      points: [
        ["适用人群", "想做生活化减脂或干净增肌的人。无力训可以减脂；增肌默认需要稳定力量训练。"],
        ["使用顺序", "先填性别、目标、身高体重，再确认力训、有氧和训练时段，最后看今日执行、餐次配额和食物代换。"],
        ["准备材料", "体重秤、厨房电子秤、常用碗盘或饭盒、记录工具。"],
        ["内容出处", sourceCopy],
        ["边界提醒", disclaimerCopy],
      ],
    },
    cycle: {
      subtitle: "周期判断",
      leadTitle: "什么时候转增肌，什么时候转减脂",
      leadText: `当前 BMI ${result.bmi.value}（${result.bmi.category}），目标 BMI ${input.targetBmi}。BMI 不是完美指标，但对普通人足够作为周期入口；腰围、健康状态和心理压力也要一起看。`,
      points: [
        ["当前建议", getCycleAdvice(input, result)],
        ["减脂转增肌", "男性 BMI 22-23、女性 BMI 20-21，通常建议停止减脂并转入维持或增肌。"],
        ["增肌转减脂", "介意发胖时可以更早转减脂；不介意发胖也不建议长期增到过高 BMI。"],
        ["不要追求低体脂", "肌肉量一般的普通人，不要为了腹肌、马甲线一直减。低体脂必须和足够肌肉量适配。"],
      ],
    },
    diet: {
      subtitle: "热量逻辑",
      leadTitle: isFatLoss ? "减脂先看热量缺口，不先看练没练" : "增肌先看热量盈余，但要保守",
      leadText: isFatLoss
        ? `体脂下降来自长期热量缺口。当前理论缺口约 ${formatNumber(dailyGap)} kcal/天，当前应吃约 ${formatNumber(targetEat)} kcal/天。`
        : `干净增肌用小盈余，不追求快速涨体重。当前应吃约 ${formatNumber(targetEat)} kcal/天，重点看 1 个月趋势。`,
      points: [
        ["饮食是主旋钮", "工具先算无运动总消耗，再叠加力训和有氧；有氧消耗会折算成碳水加入配额。"],
        ["体重看周期", isFatLoss ? "减脂看 7-14 天趋势，不用被两三天的水盐和食物残留带着走。" : "增肌看 1 个月趋势，体重涨太快通常不是好事。"],
        ["执行先定量", "新手前 1-2 周用厨房秤建立手感，之后可以逐渐从精确称量过渡到稳定估计。"],
      ],
    },
    macro: {
      subtitle: "碳蛋脂",
      leadTitle: "碳水看饱腹，蛋白看瘦肉，脂肪看边界",
      leadText: `${getFatGuide(input.weight)}g 脂肪指导。碳水和蛋白按表执行；如果填写有氧，工具会把有氧日均消耗折算成 +${formatNumber(carbAdd)}g 碳水加入配额。`,
      points: [
        ["碳水", "吃不下配额时，可用面条、面包、馒头等低饱腹主食；容易饿时，优先米饭、玉米、红薯、土豆、燕麦。"],
        ["有氧碳水", dailyAerobic > 0 ? `当前有氧日均 ${formatNumber(dailyAerobic)} kcal，已折算为 +${formatNumber(carbAdd)}g 碳水并入总量。` : "当前没有填写有氧，所以碳水只按配额表计算。"],
        ["蛋白", "瘦肉基本是无明显脂肪层的猪牛羊肉、去皮鸡鸭肉、鱼虾；高脂肉不能当瘦肉。"],
        ["脂肪", "正常带油炒菜每个菜大约吃油 5-10g。高脂肉、糖油混合物最容易让脂肪超标。"],
      ],
    },
    swap: {
      subtitle: "食物代换",
      leadTitle: "代换不是只换练后餐，而是每一餐都要能落地",
      leadText: "食物代换按餐次输出：力训日看练前餐、练后餐和正常餐；休息日看早餐、午饭、晚饭、零食/夜宵；无力训者输出每日所有餐次。",
      points: [
        ["碳水怎么换", "用本餐碳水克数除以食物碳水率，得到熟米饭、面、红薯、燕麦等大约重量。"],
        ["蛋白怎么换", "用本餐蛋白克数除以食物蛋白率，得到瘦肉、鱼虾、蛋白粉等大约重量。"],
        ["复杂食物", "包子、油条、花式面包、肉馅、肥牛肥羊会同时带来大量脂肪，不能简单当主食或瘦肉。"],
      ],
    },
    trend: {
      subtitle: "平台期",
      leadTitle: isFatLoss ? "平台期先别慌，短期体重不等于脂肪" : "增肌更不能天天用体重判断肌肉",
      leadText: isFatLoss
        ? "减脂期每天真实脂肪变化通常只有几十克，很容易被食物残留、排便、盐分、水分滞留盖过去。"
        : "肌肉增长比脂肪下降更慢，日体重几乎不可能反映真实肌肉增长。增肌期至少按月观察。",
      points: isFatLoss
        ? [
            ["为什么会假平台", "食糜、排便、盐分、含水量、训练炎症都会让体重短期波动。"],
            ["先排查执行", "有没有偷吃、低估外食、把高脂肉当瘦肉、忽略炒菜油调料零食、称量错误。"],
            ["再调热量", "确认执行没问题后，每天少吃约 150 kcal，或每周多做约 1000 kcal 有氧但不加饮食。"],
          ]
        : [
            ["该怎么看", "增肌目标是慢慢涨：男性每月一般不超过 1kg，女性每月一般不超过 0.5kg。"],
            ["先排查训练", "长期低于每周 3 次力训，增肌进步会很有限。"],
            ["再加饮食", "一个月完全不长时，小幅增加 100-200 kcal，再继续观察。"],
          ],
    },
    strength: {
      subtitle: "力训保肌",
      leadTitle: "力训和减脂没有直接关系，但和保肌很有关系",
      leadText: "减脂需要的热量缺口可以由饮食提供；力训不是减脂的必要条件。它的价值是给肌肉一个“还需要你”的信号。",
      points: [
        ["无力训也能减脂", "如果当前不会练，先用无力量训练减脂表把饮食跑起来是可以的。"],
        ["想保肌就练", "如果目标是尽量保持肌肉，建议每周 3-5 次力量训练。"],
        ["当前设置", `${goalLabel} · ${strengthLabel}。${noStrength ? "无力训模式只输出每日碳水、蛋白和脂肪指导。" : "有力训时分别输出训练日和休息日，训练日多出的碳水主要服务训练前后。"}`],
      ],
    },
    cardio: {
      subtitle: "有氧补充",
      leadTitle: "要不要做有氧，取决于它解决什么问题",
      leadText: `有氧和饮食是互相置换的：做了有氧，就多了一笔日均消耗。当前有氧折算为 ${formatNumber(dailyAerobic)} kcal/天，已按约 +${formatNumber(carbAdd)}g 碳水并入总量。`,
      points: [
        ["减脂怎么判断", getCardioAdvice(input)],
        ["碳水怎么加", "有氧热量优先加到碳水，不加到脂肪。这样力训日和休息日的碳水会同步增加，避免缺口被拉得过大。"],
        ["增肌怎么判断", "增肌期通常不需要靠有氧制造消耗；可以为了心肺、爱好、工作需要保留，但别影响力量训练恢复。"],
        ["时长上限", "如果要做有氧，建议每周低于 4h。力训前不要做有氧；力训后如果做，一般不超过 30 分钟。"],
      ],
    },
    changelog: {
      subtitle: "V3.5",
      leadTitle: "V3.5 动态说明恢复版",
      leadText: "V3.5 恢复 React 迁移时丢失的动态产品文档和 Changelog，并修复输入区填写流摩擦。",
      groups: [
        {
          title: "V3.x",
          count: 6,
          note: "React 迁移、真实 Q&A、有氧并入和动态文档恢复",
          items: [
            ["V3.5 · 2026-06-01", "恢复动态产品文档、恢复 Changelog，并修正桌面输入区滚动摩擦。"],
            ["V3.4 · 2026-06-01", "接入真实 Excel Q&A，支持减脂 / 增肌切换、搜索和展开。"],
            ["V3.3 · 2026-06-01", "有氧热量按碳水自动并入总碳水，并保留基础查表值说明。"],
            ["V3.2 · 2026-06-01", "React 版复原原工具的数据关系：有氧、分餐、BMI、查表、问答。"],
            ["V3.1 · 2026-06-01", "React / Vite 重写并部署到 GitHub Pages，作为可维护版本接入个人主页。"],
            ["V3.0 · 2026-05-14", "新增 PWA 安装能力：manifest、service worker、应用图标、Apple 主屏幕 meta 和离线静态资源缓存。"],
          ],
        },
        {
          title: "V2.x",
          count: 4,
          note: "有氧碳水、文档 UI、视觉换肤与手机版导览",
          items: [
            ["V2.3 · 2026-05-13", "手机版新增 3 步轻导览：身体目标、训练有氧、当前方案。"],
            ["V2.2 · 2026-05-13", "冷黑器械感 UI 换肤，并统一 KPI、表格、Q&A、食物代换和 Changelog 的暗色视觉。"],
            ["V2.1 · 2026-05-09", "Changelog 改为可折叠版本树；修复身高、体重、目标 BMI 输入小数点时被实时刷新吞掉的问题。"],
            ["V2.0 · 2026-05-09", "有氧升级为大版本：有氧日均消耗按 4 kcal/g 折算为额外碳水，并同步加入力训日和休息日碳水。"],
          ],
        },
        {
          title: "V1.x",
          count: 5,
          note: "产品文档、导航与问答命名",
          items: [
            ["V1.4 · 2026-05-09", "将 QA 问答库统一命名为 Q&A 问答库。"],
            ["V1.3 · 规划", "原计划修复 BMI 小数输入；该修复已合并到 V2.1 实现。"],
            ["V1.2 · 2026-05-09", "精简左侧功能栏：移除体重秤和厨房秤，把 7 天均值改为周期判断，把常吃主食改为碳蛋脂。"],
            ["V1.1 · 2026-05-08", "左侧胶囊导航改为锚点跳转，并会同步切换产品文档 tab 到对应主题。"],
            ["V1.0 · 2026-05-08", "新增周期判断、碳蛋脂吃法、夜宵设计原理、早餐蛋白模板、Q&A 问答库和来源标注。"],
          ],
        },
        {
          title: "V0.x",
          count: 3,
          note: "从 Excel 到可用网页",
          items: [
            ["V0.3 · 2026-05-08", "可选食物代换改为训练日 / 休息日 / 无力训每日的全餐次输出；新增 README 和 Changelog tab。"],
            ["V0.2 · 2026-05-07", "重做 UI，新增今天先执行卡片，把平台期、脂肪、力训和有氧解释放进产品结构。"],
            ["V0.1 · 2026-05-02", "把自用 Excel 的减脂 / 增肌查表逻辑搬到网页，支持目标、性别、身高、体重和训练状态输入。"],
          ],
        },
      ],
    },
  };
}

function getCardioAdvice(input: QuotaInput) {
  if (input.goal === "muscle-gain") {
    return "增肌期有氧不是用来制造消耗的主工具；可以保留少量低强度有氧维持心肺和食欲，但别影响力量训练恢复。";
  }
  if (input.trainingStatus === "no-strength") {
    return "不会力训也可以先只做饮食方案。有氧可作为补充，但能稳定执行饮食更重要。";
  }
  if (input.weight > 80) {
    return "当前体重大于 80kg，通常先不需要有氧；若要做，优先选游泳、单车、椭圆仪这类更友好的方式。";
  }
  if (input.weight >= 70) {
    return "当前体重在 70-80kg，通常先不做有氧；如果按方案吃明显饿，再加少量有氧换取更多可吃碳水。";
  }
  return "当前体重低于 70kg，基础消耗较低，可默认每周约 2 小时有氧，让饮食热量和碳水稍微宽裕一点。";
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

function getBasalCarbText(result: QuotaResult) {
  if (!result.basal) return "";

  if (typeof result.basal.trainingCarb === "number") {
    return ` 基础查表：力训日 ${result.basal.trainingCarb}g，休息日 ${result.basal.restCarb}g。`;
  }

  if (typeof result.basal.carb === "number") {
    return ` 基础查表：每日 ${result.basal.carb}g。`;
  }

  return "";
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
      ? `有氧平均每天 ${result.energy.dailyAerobic} kcal，已按约 +${result.aerobicCarb}g 碳水并入总量。`
      : "当前未填写有氧，所以不会额外加碳水。",
    "前 1-2 周尽量用厨房秤建立手感；后续目标是生活化执行，不是永远机械称重。",
    "减脂看 7-14 天均值，不看单日体重。",
    "外卖优先选清晰主食和瘦肉，避开糖油混合物、高脂肉和炸物。",
  ];
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value);
}
