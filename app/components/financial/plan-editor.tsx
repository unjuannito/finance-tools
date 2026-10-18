import { emptyStage, type FinancialPlan, type FinancialStage } from "../../types/financial";
import { Icon } from "../icon";
import { useTranslation } from "react-i18next";

type Props = { plan: FinancialPlan; onChange: (plan: FinancialPlan) => void; onCancel: () => void; onSave: () => void };

export function PlanEditor({ plan, onChange, onCancel, onSave }: Props) {
  const { t } = useTranslation();
  function updatePlan<Key extends keyof FinancialPlan>(key: Key, value: FinancialPlan[Key]) {
    onChange({ ...plan, [key]: value });
  }
  function updateStage(index: number, stage: FinancialStage) {
    onChange({ ...plan, stages: plan.stages.map((item, itemIndex) => itemIndex === index ? stage : item) });
  }
  function addStage() {
    const previous = plan.stages.at(-1);
    onChange({ ...plan, stages: [...plan.stages, { ...emptyStage, id: crypto.randomUUID(), startDate: previous?.endDate ?? emptyStage.startDate }] });
  }

  function removeStage(index: number) {
    if (plan.stages.length <= 1) return;
    onChange({ ...plan, stages: plan.stages.filter((_, itemIndex) => itemIndex !== index) });
  }

  return (
    <div className="plan-editor" aria-label={t("planSettings")}>
      <div className="plan-editor__header"><div><p className="section-kicker">{t("planSettings")}</p><h3>{plan.name || t("newPlan")}</h3></div><button className="icon-button" onClick={onCancel} type="button" aria-label={t("close")}><Icon name="close" size={18} /></button></div>
      <div className="plan-editor__grid">
        <label>{t("planName")}<input value={plan.name} onChange={(event) => updatePlan("name", event.target.value)} placeholder={t("exampleAccount")} /></label>
        <label>{t("planType")}<select value={plan.category} onChange={(event) => updatePlan("category", event.target.value as FinancialPlan["category"])}><option value="liquidity">{t("liquidity")}</option><option value="fixed-income">{t("fixedIncome")}</option><option value="equities">{t("equities")}</option><option value="mixed">{t("mixed")}</option></select></label>
        <label>{t("initialContribution")} (€)<input min="0" type="number" value={plan.initialContribution} onChange={(event) => updatePlan("initialContribution", Number(event.target.value))} placeholder="0" /></label>
      </div>
      <div className="stages-heading"><div><p className="section-kicker">{t("evolution")}</p><h4>{t("stages")} ({plan.stages.length})</h4></div><button className="text-button" onClick={addStage} type="button"><Icon name="plus" size={15} /> {t("addStage")}</button></div>
      {plan.stages.length === 0 && <p className="editor-hint">{t("addStageHint")}</p>}
      {plan.stages.map((stage, index) => <div className="stage-editor" key={stage.id}><div className="stage-editor__title"><div><strong>{t("stage")} {index + 1}</strong><span>{index === 0 ? t("stageStart") : t("stageContinue")}</span></div>{plan.stages.length > 1 && <button className="stage-remove" onClick={() => removeStage(index)} type="button">{t("deleteStage")}</button>}</div><div className="plan-editor__grid"><label>{t("from")}<input min={index > 0 ? plan.stages[index - 1].endDate : undefined} type="date" value={stage.startDate} onChange={(event) => updateStage(index, { ...stage, startDate: event.target.value < (index > 0 ? plan.stages[index - 1].endDate : "") ? plan.stages[index - 1].endDate : event.target.value })} /></label><label>{t("until")}<input min={stage.startDate} type="date" value={stage.endDate} onChange={(event) => updateStage(index, { ...stage, endDate: event.target.value < stage.startDate ? stage.startDate : event.target.value })} /></label><label>{t("periodicContribution")}<input min="0" type="number" value={stage.contributionAmount} onChange={(event) => updateStage(index, { ...stage, contributionAmount: Number(event.target.value) })} /></label><label>{t("frequency")}<select value={stage.contributionFrequency} onChange={(event) => updateStage(index, { ...stage, contributionFrequency: event.target.value as FinancialStage["contributionFrequency"] })}><option value="monthly">{t("monthly")}</option><option value="quarterly">{t("quarterly")}</option><option value="yearly">{t("yearly")}</option></select></label><label>{t("expectedAnnualReturn")}<input min="0" step="0.1" type="number" value={stage.annualReturn} onChange={(event) => updateStage(index, { ...stage, annualReturn: Number(event.target.value) })} /></label></div><div className="withdrawal-placeholder">{t("withdrawalsPlaceholder")}</div></div>)}
      <div className="plan-editor__actions"><button className="button button--quiet" onClick={onCancel} type="button">{t("cancel")}</button><button className="button button--primary" onClick={onSave} type="button">{t("savePlan")}</button></div>
    </div>
  );
}

