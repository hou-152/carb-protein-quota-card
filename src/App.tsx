import { useMemo, useState } from "react";
import { InputPanel } from "./components/InputPanel";
import { ResultCard } from "./components/ResultCard";
import { QuotaInput, calculateQuota } from "./lib/calculateQuota";

const initialInput: QuotaInput = {
  gender: "male",
  trainingStatus: "strength",
  goal: "fat-loss",
  age: 30,
  height: 175,
  weight: 75,
  targetBmi: 22.5,
  trainingLevel: "beginner",
  strengthDays: 4,
  trainingTiming: "breakfast-early",
  aerobicActivityId: "a11",
  aerobicWeeklyUnits: 0,
};

const validValues = {
  gender: ["male", "female"],
  trainingStatus: ["strength", "no-strength"],
  goal: ["fat-loss", "muscle-gain"],
  trainingLevel: ["beginner", "intermediate", "advanced"],
  trainingTiming: [
    "breakfast-early",
    "breakfast-late",
    "before-lunch",
    "after-lunch",
    "before-dinner",
    "after-dinner",
    "night",
  ],
};

function getInitialInput(): QuotaInput {
  if (typeof window === "undefined") return initialInput;

  const params = new URLSearchParams(window.location.search);

  return {
    gender: readChoice(params, "gender", validValues.gender, initialInput.gender),
    trainingStatus: readChoice(
      params,
      "training",
      validValues.trainingStatus,
      initialInput.trainingStatus,
    ),
    goal: readChoice(params, "goal", validValues.goal, initialInput.goal),
    age: readNumber(params, "age", initialInput.age),
    height: readNumber(params, "height", initialInput.height),
    weight: readNumber(params, "weight", initialInput.weight),
    targetBmi: readNumber(params, "targetBmi", initialInput.targetBmi),
    trainingLevel: readChoice(
      params,
      "level",
      validValues.trainingLevel,
      initialInput.trainingLevel,
    ),
    strengthDays: readNumber(params, "strengthDays", initialInput.strengthDays),
    trainingTiming: readChoice(
      params,
      "timing",
      validValues.trainingTiming,
      initialInput.trainingTiming,
    ),
    aerobicActivityId: params.get("aerobic") || initialInput.aerobicActivityId,
    aerobicWeeklyUnits: readNumber(params, "aerobicUnits", initialInput.aerobicWeeklyUnits),
  } as QuotaInput;
}

function readChoice<T extends string>(
  params: URLSearchParams,
  key: string,
  choices: readonly string[],
  fallback: T,
) {
  const value = params.get(key);
  return choices.includes(value ?? "") ? (value as T) : fallback;
}

function readNumber(params: URLSearchParams, key: string, fallback: number) {
  const raw = params.get(key);
  if (raw === null || raw.trim() === "") return fallback;

  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

export default function App() {
  const [input, setInput] = useState(getInitialInput);
  const result = useMemo(() => calculateQuota(input), [input]);

  return (
    <main className="app-shell">
      <header className="app-header" aria-labelledby="page-title">
        <div className="brand-block">
          <p className="eyebrow">生活化减脂增肌</p>
          <h1 id="page-title">饮食方案计算器</h1>
          <p>按身高体重、训练状态和目标，把今天要执行的碳水、蛋白和热量拆成可落地方案。</p>
        </div>
        <div className="header-actions">
          <a href="#cycle">周期判断</a>
          <a href="#docs">产品文档</a>
          <a href="#meals">碳蛋脂</a>
          <a href="#swap">食物代换</a>
          <a href="#qa">Q&A 问答</a>
        </div>
      </header>

      <div className="workbench">
        <InputPanel value={input} onChange={setInput} />
        <ResultCard input={input} result={result} />
      </div>

      <nav className="mobile-bottom-nav" aria-label="手机主导航">
        <a href="#summary">方案</a>
        <a href="#input-title">调整</a>
        <a href="#docs">文档</a>
        <a href="#qa">问答</a>
      </nav>
    </main>
  );
}
