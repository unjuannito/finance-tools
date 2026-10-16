import { emptyStage, type FinancialPlan, type FinancialStage } from "../../types/financial";

type Props = { plan: FinancialPlan; onChange: (plan: FinancialPlan) => void; onCancel: () => void; onSave: () => void };

export function PlanEditor({ plan, onChange, onCancel, onSave }: Props) {
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
    <div className="plan-editor" aria-label="Editor de plan">
      <div className="plan-editor__header"><div><p className="section-kicker">Configuración del plan</p><h3>{plan.name || "Nuevo plan"}</h3></div><button className="icon-button" onClick={onCancel} type="button" aria-label="Cerrar">×</button></div>
      <div className="plan-editor__grid">
        <label>Nombre del plan<input value={plan.name} onChange={(event) => updatePlan("name", event.target.value)} placeholder="Ej. Cuenta remunerada" /></label>
        <label>Tipo de plan<select value={plan.category} onChange={(event) => updatePlan("category", event.target.value as FinancialPlan["category"])}><option value="liquidity">Liquidez</option><option value="fixed-income">Renta fija</option><option value="equities">Bolsa</option><option value="mixed">Mixto</option></select></label>
        <label>Aporte inicial (€)<input min="0" type="number" value={plan.initialContribution} onChange={(event) => updatePlan("initialContribution", Number(event.target.value))} placeholder="0" /></label>
      </div>
      <div className="stages-heading"><div><p className="section-kicker">Evolución del plan</p><h4>Etapas ({plan.stages.length})</h4></div><button className="text-button" onClick={addStage} type="button">+ Añadir etapa</button></div>
      {plan.stages.length === 0 && <p className="editor-hint">Añade una etapa para definir aportaciones, rentabilidad y retiradas. El capital se conservará entre etapas.</p>}
      {plan.stages.map((stage, index) => <div className="stage-editor" key={stage.id}><div className="stage-editor__title"><div><strong>Etapa {index + 1}</strong><span>{index === 0 ? "Inicio del plan" : "Continúa el capital acumulado"}</span></div>{plan.stages.length > 1 && <button className="stage-remove" onClick={() => removeStage(index)} type="button">Eliminar etapa</button>}</div><div className="plan-editor__grid"><label>Desde<input min={index > 0 ? plan.stages[index - 1].endDate : undefined} type="date" value={stage.startDate} onChange={(event) => updateStage(index, { ...stage, startDate: event.target.value < (index > 0 ? plan.stages[index - 1].endDate : "") ? plan.stages[index - 1].endDate : event.target.value })} /></label><label>Hasta<input min={stage.startDate} type="date" value={stage.endDate} onChange={(event) => updateStage(index, { ...stage, endDate: event.target.value < stage.startDate ? stage.startDate : event.target.value })} /></label><label>Aportación periódica (€)<input min="0" type="number" value={stage.contributionAmount} onChange={(event) => updateStage(index, { ...stage, contributionAmount: Number(event.target.value) })} /></label><label>Frecuencia<select value={stage.contributionFrequency} onChange={(event) => updateStage(index, { ...stage, contributionFrequency: event.target.value as FinancialStage["contributionFrequency"] })}><option value="monthly">Mensual</option><option value="quarterly">Trimestral</option><option value="yearly">Anual</option></select></label><label>Rentabilidad anual esperada (%)<input min="0" step="0.1" type="number" value={stage.annualReturn} onChange={(event) => updateStage(index, { ...stage, annualReturn: Number(event.target.value) })} /></label></div><div className="withdrawal-placeholder">Retiradas puntuales: próximamente · el capital solo disminuirá cuando añadas una retirada.</div></div>)}
      <div className="plan-editor__actions"><button className="button button--quiet" onClick={onCancel} type="button">Cancelar</button><button className="button button--primary" onClick={onSave} type="button">Guardar plan</button></div>
    </div>
  );
}

