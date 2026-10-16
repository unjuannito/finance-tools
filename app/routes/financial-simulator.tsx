import { useEffect, useRef, useState } from "react";
import { PlanCard } from "../components/financial/plan-card";
import { PlanEditor } from "../components/financial/plan-editor";
import { emptyPlan, emptyStage, type FinancialPlan } from "../types/financial";
import { calculateSimulation } from "../utils/financial-calculations";

function createPlan(): FinancialPlan {
  return { ...emptyPlan, id: crypto.randomUUID(), stages: [{ ...emptyStage, id: crypto.randomUUID() }] };
}

const SIMULATOR_STORAGE_KEY = "finanzas-claras:simulador-financiero:v1";

function isSavedPlan(value: unknown): value is FinancialPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as Partial<FinancialPlan>;
  return typeof plan.id === "string"
    && typeof plan.name === "string"
    && ["liquidity", "fixed-income", "equities", "mixed"].includes(plan.category ?? "")
    && typeof plan.initialContribution === "number"
    && Array.isArray(plan.stages)
    && plan.stages.every((stage) => stage
      && typeof stage.id === "string"
      && typeof stage.startDate === "string"
      && typeof stage.endDate === "string"
      && typeof stage.contributionAmount === "number"
      && typeof stage.annualReturn === "number"
      && ["monthly", "quarterly", "yearly"].includes(stage.contributionFrequency)
      && Array.isArray(stage.withdrawals));
}

export function meta() {
  return [{ title: "Simulador financiero · Finanzas claras" }];
}

export default function FinancialSimulator() {
  const [plans, setPlans] = useState<FinancialPlan[]>([]);
  const [simulationEndDate, setSimulationEndDate] = useState("");
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [editingPlan, setEditingPlan] = useState<FinancialPlan | null>(null);
  const [chartInterval, setChartInterval] = useState<1 | 3 | 6 | 12>(12);
  const [isChartFullscreen, setIsChartFullscreen] = useState(false);
  const chartRef = useRef<HTMLElement>(null);
  const simulation = calculateSimulation(plans, simulationEndDate || undefined);
  const categoryLabels = { liquidity: "Liquidez", "fixed-income": "Renta fija", equities: "Bolsa", mixed: "Mixto" } as const;
  const sampledTimeline = simulation.timeline.filter((point, index) => index % chartInterval === 0 || index === simulation.timeline.length - 1);
  // Keep the scale anchored to useful currency amounts: roughly ten intervals
  // gives smaller balances readable steps while the "nice number" rounding
  // avoids awkward labels as the portfolio grows.
  const rawTickStep = Math.max(1, simulation.finalBalance / 10);
  const tickMagnitude = 10 ** Math.floor(Math.log10(rawTickStep));
  const normalizedTick = rawTickStep / tickMagnitude;
  const tickFactor = [1, 2, 2.5, 5, 10].find((factor) => factor >= normalizedTick) ?? 10;
  const chartTickStep = tickFactor * tickMagnitude;
  const chartMaximum = Math.max(chartTickStep, Math.ceil(simulation.finalBalance / chartTickStep) * chartTickStep);
  const chartTicks = Array.from({ length: Math.round(chartMaximum / chartTickStep) + 1 }, (_, index) => index * chartTickStep);
  const finalDateLabel = simulation.periodEnd
    ? new Intl.DateTimeFormat("es-ES", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${simulation.periodEnd}T00:00:00Z`))
    : "";

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SIMULATOR_STORAGE_KEY);
      if (saved) {
        const data: unknown = JSON.parse(saved);
        if (data && typeof data === "object") {
          const stored = data as { version?: unknown; plans?: unknown; simulationEndDate?: unknown };
          if (stored.version === 1 && Array.isArray(stored.plans) && stored.plans.every(isSavedPlan)) {
            setPlans(stored.plans);
            if (typeof stored.simulationEndDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(stored.simulationEndDate)) {
              setSimulationEndDate(stored.simulationEndDate);
            }
          }
        }
      }
    } catch {
      // If browser storage is unavailable or contains invalid JSON, start with an empty simulator.
    } finally {
      setStorageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;
    try {
      window.localStorage.setItem(SIMULATOR_STORAGE_KEY, JSON.stringify({ version: 1, plans, simulationEndDate }));
    } catch {
      // Storage can be disabled or full; the simulator remains usable for this session.
    }
  }, [plans, simulationEndDate, storageLoaded]);

  useEffect(() => {
    function syncFullscreen() {
      setIsChartFullscreen(document.fullscreenElement === chartRef.current);
    }
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  async function toggleChartFullscreen() {
    if (!chartRef.current) return;
    if (document.fullscreenElement === chartRef.current) await document.exitFullscreen();
    else await chartRef.current.requestFullscreen();
  }

  function savePlan() {
    if (!editingPlan?.name.trim() || editingPlan.stages.length === 0) return;
    const validStages = editingPlan.stages.every((stage, index) => stage.endDate >= stage.startDate && (index === 0 || stage.startDate >= editingPlan.stages[index - 1].endDate));
    if (!validStages) return;
    setPlans((current) => current.some((plan) => plan.id === editingPlan.id)
      ? current.map((plan) => plan.id === editingPlan.id ? editingPlan : plan)
      : [...current, editingPlan]);
    setEditingPlan(null);
  }

  function duplicatePlan(plan: FinancialPlan) {
    setPlans((current) => [...current, { ...plan, id: crypto.randomUUID(), name: `${plan.name} (copia)` }]);
  }

  function deletePlan(plan: FinancialPlan) {
    if (window.confirm(`¿Eliminar el plan “${plan.name}”? Esta acción no se puede deshacer.`)) {
      setPlans((current) => current.filter((item) => item.id !== plan.id));
    }
  }

  return (
    <main className="page-container simulator-page">
      <p className="example-notice">Datos de ejemplo · cálculo orientativo con las aportaciones y rentabilidades configuradas.</p>
      <div className="simulator-grid">
        <section className="simulator-panel" aria-labelledby="plans-title">
          <div className="panel-heading"><div><p className="section-kicker">Planes combinados</p><h2 id="plans-title">Tus planes <span>{plans.length}</span></h2></div><button className="text-button" onClick={() => setEditingPlan(createPlan())} type="button">+ Añadir</button></div>
          {plans.length === 0 ? <div className="plans-empty"><div className="empty-state__illustration" aria-hidden="true">＋</div><h3>Aún no hay planes</h3><p>Crea tu primer plan para definir el aporte inicial y sus etapas de aportación y mantenimiento.</p><button className="button button--primary" onClick={() => setEditingPlan(createPlan())} type="button">Crear primer plan <span aria-hidden="true">→</span></button></div> : <div className="plans-list">{plans.map((plan) => <PlanCard key={plan.id} plan={plan} onEdit={() => setEditingPlan(plan)} onDuplicate={() => duplicatePlan(plan)} onDelete={() => deletePlan(plan)} />)}</div>}
          {editingPlan && <PlanEditor plan={editingPlan} onChange={setEditingPlan} onCancel={() => setEditingPlan(null)} onSave={savePlan} />}
        </section>
        <aside className="results-panel" aria-labelledby="results-title"><div className="panel-heading"><div><p className="section-kicker">Resumen actualizado</p><h2 id="results-title">Resultados</h2></div><span className="ready-label">Calculado</span></div><div className="result-total"><span>Capital final estimado · {finalDateLabel}</span><strong>{simulation.finalBalance.toLocaleString("es-ES", { maximumFractionDigits: 0 })} €</strong></div><div className="pending-list"><div><span>Aporte inicial</span><strong>{simulation.totalInitial.toLocaleString("es-ES", { maximumFractionDigits: 0 })} €</strong></div><div><span>Total aportado</span><strong>{simulation.totalContributions.toLocaleString("es-ES", { maximumFractionDigits: 0 })} €</strong></div><div><span>Rendimientos</span><strong className="positive-value">{simulation.totalInterest.toLocaleString("es-ES", { maximumFractionDigits: 0 })} €</strong></div></div><div className="category-breakdown"><p className="section-kicker">Capital final por tipo · {finalDateLabel}</p>{Object.entries(categoryLabels).map(([category, label]) => <div className="category-breakdown__row" key={category}><span><i className={`category-dot category-dot--${category}`} />{label}</span><strong>{simulation.results.filter((result) => result.plan.category === category).reduce((sum, result) => sum + result.finalBalance, 0).toLocaleString("es-ES", { maximumFractionDigits: 0 })} €</strong></div>)}</div></aside>
      </div>
      <section className="results-section" ref={chartRef}>
        <div className="section-heading chart-heading">
          <div><p className="section-kicker">Visualización</p><h2>Evolución temporal</h2></div>
          <div className="chart-controls">
            <span className="section-count">{simulation.timeline.length - 1} meses · {simulation.periodStart?.slice(0, 4)}–{simulation.periodEnd?.slice(0, 4)}</span>
            <label className="chart-frequency">Simular hasta
              <input aria-label="Fecha final de la simulación" min={simulation.periodStart} type="date" value={simulationEndDate} onChange={(event) => setSimulationEndDate(event.target.value)} />
            </label>
            <label className="chart-frequency">Cada
              <select value={chartInterval} onChange={(event) => setChartInterval(Number(event.target.value) as 1 | 3 | 6 | 12)}>
                <option value={12}>año</option><option value={6}>6 meses</option><option value={3}>3 meses</option><option value={1}>mes</option>
              </select>
            </label>
            <button className="chart-fullscreen" onClick={() => void toggleChartFullscreen()} type="button">{isChartFullscreen ? "Salir de pantalla completa" : "⛶ Ampliar"}</button>
          </div>
        </div>
        <div className="timeline-chart" aria-label="Evolución estimada del capital">
          <div className="timeline-chart__plot">
            <div className="timeline-chart__y-axis" aria-hidden="true">{[...chartTicks].reverse().map((tick) => <span key={tick}>{new Intl.NumberFormat("es-ES", { notation: "compact", maximumFractionDigits: 1 }).format(tick)} €</span>)}</div>
            <div className="timeline-chart__plot-area">
              <div className="timeline-chart__grid-lines" aria-hidden="true">{chartTicks.map((tick) => <i key={tick} />)}</div>
              <div className="timeline-chart__bars">{sampledTimeline.map((point) => <div className="timeline-bar-wrap" key={point.date}><div className="timeline-bar" style={{ height: `${Math.max(1, (point.balance / chartMaximum) * 100)}%` }}><div className="timeline-tooltip"><strong>{new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${point.date}T00:00:00Z`))}</strong><span>Total: {point.balance.toLocaleString("es-ES", { maximumFractionDigits: 0 })} €</span>{Object.entries(point.breakdown).filter(([, value]) => value > 0).map(([category, value]) => <span key={category}>{categoryLabels[category as keyof typeof categoryLabels]}: {value.toLocaleString("es-ES", { maximumFractionDigits: 0 })} €</span>)}</div></div></div>)}</div>
              <div className="timeline-chart__axis"><span>{simulation.periodStart?.slice(0, 4)}</span><span>{sampledTimeline[Math.floor((sampledTimeline.length - 1) / 2)]?.date.slice(0, 4)}</span><span>{simulation.periodEnd?.slice(0, 4)}</span></div>
            </div>
          </div>
          <div className="timeline-chart__legend"><span><i className="legend-dot legend-dot--balance" />Capital acumulado estimado</span><small>Pasa el cursor por las barras para ver la fecha, el total y el desglose por tipo.</small></div>
        </div>
      </section>
      <section className="future-sections"><div><span>▤</span><h2>Etapas personalizadas</h2><p>Las aportaciones y la rentabilidad pueden cambiar en cada etapa del plan.</p></div><div><span>−</span><h2>Retiradas puntuales</h2><p>Próximamente podrás registrar retiradas sin perder la evolución del capital restante.</p></div></section>
    </main>
  );
}

