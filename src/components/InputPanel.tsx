import { useEffect, useState } from "react";
import type { FocusEvent, SyntheticEvent } from "react";
import { Gender, Goal, TrainingStatus } from "../data/quotaTable";
import {
  aerobicActivities,
  getAerobicActivity,
  getAerobicUnitLabel,
} from "../data/aerobic";
import { trainingTimingOptions } from "../data/mealTiming";
import { QuotaInput, TrainingLevel } from "../lib/calculateQuota";
import { SegmentedControl } from "./SegmentedControl";

interface InputPanelProps {
  value: QuotaInput;
  onChange: (next: QuotaInput) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  const aerobicActivity = getAerobicActivity(value.aerobicActivityId);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 760px)").matches
      : false,
  );
  const [mobileOpenGroups, setMobileOpenGroups] = useState({
    body: true,
    training: false,
    cardio: false,
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  function update(patch: Partial<QuotaInput>) {
    onChange({ ...value, ...patch });
  }

  function updateGender(gender: Gender) {
    const fallbackHeight = gender === "male" ? 175 : 160;
    const fallbackWeight = gender === "male" ? 75 : 55;
    onChange({
      ...value,
      gender,
      height: fallbackHeight,
      weight: fallbackWeight,
    });
  }

  function updateTrainingStatus(trainingStatus: TrainingStatus) {
    onChange({
      ...value,
      trainingStatus,
      goal: trainingStatus === "no-strength" ? "fat-loss" : value.goal,
    });
  }

  function selectZero(event: FocusEvent<HTMLInputElement>) {
    if (event.currentTarget.value === "0") {
      event.currentTarget.select();
    }
  }

  function isGroupOpen(group: keyof typeof mobileOpenGroups) {
    return !isMobile || mobileOpenGroups[group];
  }

  function updateGroup(
    group: keyof typeof mobileOpenGroups,
    event: SyntheticEvent<HTMLDetailsElement>,
  ) {
    if (!isMobile) return;
    const isOpen = event.currentTarget.open;
    setMobileOpenGroups((current) => ({
      ...current,
      [group]: isOpen,
    }));
  }

  return (
    <section className="panel input-panel" aria-labelledby="input-title">
      <div className="section-heading">
        <p className="eyebrow">Step 01</p>
        <h2 id="input-title">生成你的配额</h2>
        <p>手机端按身体、训练、有氧分组调整，先改关键项再看结果。</p>
      </div>

      <details
        className="input-group"
        open={isGroupOpen("body")}
        onToggle={(event) => updateGroup("body", event)}
      >
        <summary>
          <span>身体数据</span>
          <b>{value.height}cm · {value.weight}kg</b>
        </summary>
        <div className="input-group-body">
          <SegmentedControl<Gender>
            label="性别"
            value={value.gender}
            onChange={updateGender}
            options={[
              { value: "male", label: "男" },
              { value: "female", label: "女" },
            ]}
          />

          <div className="input-row">
            <label className="field">
              <span>年龄</span>
              <input
                inputMode="numeric"
                min={12}
                max={90}
                type="number"
                value={value.age}
                onFocus={selectZero}
                onChange={(event) => update({ age: Number(event.target.value) })}
              />
            </label>

            <label className="field">
              <span>身高</span>
              <input
                inputMode="decimal"
                min={120}
                max={230}
                step={0.1}
                type="number"
                value={value.height}
                onFocus={selectZero}
                onChange={(event) => update({ height: Number(event.target.value) })}
              />
            </label>

            <label className="field">
              <span>体重</span>
              <input
                inputMode="decimal"
                min={30}
                max={160}
                step={0.1}
                type="number"
                value={value.weight}
                onFocus={selectZero}
                onChange={(event) => update({ weight: Number(event.target.value) })}
              />
            </label>

            <label className="field">
              <span>目标 BMI（减脂）</span>
              <input
                inputMode="decimal"
                min={18}
                max={28}
                step={0.1}
                type="number"
                value={value.targetBmi}
                onFocus={selectZero}
                onChange={(event) => update({ targetBmi: Number(event.target.value) })}
              />
            </label>
          </div>
        </div>
      </details>

      <details
        className="input-group"
        open={isGroupOpen("training")}
        onToggle={(event) => updateGroup("training", event)}
      >
        <summary>
          <span>训练目标</span>
          <b>{value.trainingStatus === "strength" ? `${value.strengthDays} 天力训` : "无力训"} · {value.goal === "fat-loss" ? "减脂" : "增肌"}</b>
        </summary>
        <div className="input-group-body">
          <SegmentedControl<TrainingStatus>
            label="训练状态"
            value={value.trainingStatus}
            onChange={updateTrainingStatus}
            options={[
              { value: "strength", label: "有力量训练" },
              { value: "no-strength", label: "无力量训练" },
            ]}
          />

          <SegmentedControl<Goal>
            label="当前目标"
            value={value.goal}
            onChange={(goal) => update({ goal })}
            options={[
              { value: "fat-loss", label: "减脂" },
              {
                value: "muscle-gain",
                label: value.trainingStatus === "no-strength" ? "增肌（需力训）" : "增肌",
              },
            ]}
          />

          {value.trainingStatus === "strength" && (
            <>
              <SegmentedControl<TrainingLevel>
                label="力训水平"
                value={value.trainingLevel}
                onChange={(trainingLevel) => update({ trainingLevel })}
                options={[
                  { value: "beginner", label: "新手" },
                  { value: "intermediate", label: "有基础" },
                  { value: "advanced", label: "老手" },
                ]}
              />

              <label className="field stacked-field">
                <span>每周力训天数</span>
                <input
                  inputMode="numeric"
                  min={0}
                  max={7}
                  type="number"
                  value={value.strengthDays}
                  onFocus={selectZero}
                  onChange={(event) => update({ strengthDays: Number(event.target.value) })}
                />
              </label>

              <label className="field stacked-field">
                <span>力训时间点</span>
                <select
                  value={value.trainingTiming}
                  onChange={(event) =>
                    update({ trainingTiming: event.target.value as QuotaInput["trainingTiming"] })
                  }
                >
                  {trainingTimingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
        </div>
      </details>

      <details
        className="input-group"
        open={isGroupOpen("cardio")}
        onToggle={(event) => updateGroup("cardio", event)}
      >
        <summary>
          <span>有氧补充</span>
          <b>{value.aerobicWeeklyUnits || 0} {getAerobicUnitLabel(aerobicActivity.unit)}</b>
        </summary>
        <div className="input-group-body">
          <div className="input-row">
            <label className="field">
              <span>有氧项目</span>
              <select
                value={value.aerobicActivityId}
                onChange={(event) => update({ aerobicActivityId: event.target.value })}
              >
                {aerobicActivities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.label} · {activity.variant}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>{getAerobicUnitLabel(aerobicActivity.unit)}</span>
              <input
                inputMode="decimal"
                min={0}
                max={40}
                step={0.5}
                type="number"
                value={value.aerobicWeeklyUnits}
                onFocus={selectZero}
                onChange={(event) =>
                  update({ aerobicWeeklyUnits: Number(event.target.value) })
                }
              />
            </label>
          </div>
        </div>
      </details>
    </section>
  );
}
