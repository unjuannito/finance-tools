import type { FinancialPlan } from "../../types/financial";
import { useTranslation } from "react-i18next";
import { Icon, type IconName } from "../icon";

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

type PlanCardProps = { plan: FinancialPlan; onEdit: () => void; onDuplicate: () => void; onDelete: () => void };

export function PlanCard({ plan, onEdit, onDuplicate, onDelete }: PlanCardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-GB" : "es-ES";
  const categoryIcon: Record<FinancialPlan["category"], IconName> = {
    liquidity: "wallet",
    "fixed-income": "landmark",
    equities: "trend-up",
    mixed: "sliders",
  };

  return (
    <article className="plan-card">
      <div className={`plan-card__type plan-card__type--${plan.category}`}><Icon name={categoryIcon[plan.category]} size={20} /></div>
      <div className="plan-card__content"><div className="plan-card__title"><div><span className="plan-card__label">{t(plan.category === "liquidity" ? "liquidity" : plan.category === "fixed-income" ? "fixedIncome" : plan.category === "equities" ? "equities" : "mixed")}</span><h3>{plan.name || t("unnamedPlan")}</h3></div><span className="plan-card__return">{plan.stages.length} {t(plan.stages.length === 1 ? "stageSingular" : "stagePlural")}</span></div><p>{t("initialContribution")}: {plan.initialContribution.toLocaleString(locale)} €</p><div className="plan-card__timeline">{plan.stages.map((stage, index) => <span key={stage.id}>{formatDate(stage.startDate, locale)} · {stage.contributionAmount.toLocaleString(locale)} €/{t(stage.contributionFrequency === "monthly" ? "month" : stage.contributionFrequency === "quarterly" ? "quarter" : "year")}{index < plan.stages.length - 1 ? " →" : ""}</span>)}</div></div>
      <div className="plan-card__actions"><button onClick={onEdit} type="button">{t("edit")}</button><button onClick={onDuplicate} type="button">{t("duplicate")}</button><button className="danger-action" onClick={onDelete} type="button">{t("delete")}</button></div>
    </article>
  );
}
