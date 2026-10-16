import type { FinancialPlan } from "../../types/financial";

function formatDate(value?: string) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", { month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

type PlanCardProps = { plan: FinancialPlan; onEdit: () => void; onDuplicate: () => void; onDelete: () => void };

export function PlanCard({ plan, onEdit, onDuplicate, onDelete }: PlanCardProps) {
  return (
    <article className="plan-card">
      <div className="plan-card__type" aria-hidden="true">{plan.category === "liquidity" ? "◒" : plan.category === "fixed-income" ? "▤" : plan.category === "equities" ? "↗" : "◌"}</div>
      <div className="plan-card__content"><div className="plan-card__title"><div><span className="plan-card__label">{plan.category === "liquidity" ? "Liquidez" : plan.category === "fixed-income" ? "Renta fija" : plan.category === "equities" ? "Bolsa" : "Mixto"}</span><h3>{plan.name || "Plan sin nombre"}</h3></div><span className="plan-card__return">{plan.stages.length} {plan.stages.length === 1 ? "etapa" : "etapas"}</span></div><p>Aporte inicial: {plan.initialContribution.toLocaleString("es-ES")} €</p><div className="plan-card__timeline">{plan.stages.map((stage, index) => <span key={stage.id}>{formatDate(stage.startDate)} · {stage.contributionAmount.toLocaleString("es-ES")} €/{stage.contributionFrequency === "monthly" ? "mes" : stage.contributionFrequency === "quarterly" ? "trim." : "año"}{index < plan.stages.length - 1 ? " →" : ""}</span>)}</div></div>
      <div className="plan-card__actions"><button onClick={onEdit} type="button">Editar</button><button onClick={onDuplicate} type="button">Duplicar</button><button className="danger-action" onClick={onDelete} type="button">Eliminar</button></div>
    </article>
  );
}
