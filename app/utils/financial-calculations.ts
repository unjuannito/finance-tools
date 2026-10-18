import type { FinancialPlan, FinancialStage } from "../types/financial";

export type MonthlyPoint = { date: string; contributed: number; interest: number; balance: number };
export type PlanResult = { plan: FinancialPlan; points: MonthlyPoint[]; initial: number; contributions: number; interest: number; finalBalance: number };
export type TimelinePoint = { date: string; balance: number; breakdown: Record<FinancialPlan["category"], number> };

function monthsBetween(start: string, end: string) {
  const from = new Date(`${start}T00:00:00`);
  const to = new Date(`${end}T00:00:00`);
  return Math.max(0, (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth());
}

function stageForDate(stages: FinancialStage[], date: string) {
  return stages.find((stage) => date >= stage.startDate && date < stage.endDate) ?? stages.at(-1);
}

export function calculatePlan(plan: FinancialPlan, simulationEnd?: string): PlanResult {
  const firstStage = plan.stages[0];
  const lastStage = plan.stages.at(-1);
  if (!firstStage || !lastStage) return { plan, points: [], initial: plan.initialContribution, contributions: 0, interest: 0, finalBalance: plan.initialContribution };

  let balance = plan.initialContribution;
  let contributions = 0;
  const points: MonthlyPoint[] = [];
  const endDate = simulationEnd ?? lastStage.endDate;
  const totalMonths = monthsBetween(firstStage.startDate, endDate);
  const [startYear, startMonth] = firstStage.startDate.split("-").map(Number);
  const start = new Date(Date.UTC(startYear, startMonth - 1, 1));

  for (let month = 0; month <= totalMonths; month += 1) {
    const date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + month, 1));
    const dateString = date.toISOString().slice(0, 10);
    const stage = stageForDate(plan.stages, dateString);
    if (!stage || dateString >= endDate) break;

    const frequencyMonths = stage.contributionFrequency === "monthly" ? 1 : stage.contributionFrequency === "quarterly" ? 3 : 12;
    const isWithinStages = dateString < lastStage.endDate;
    const monthsIntoStage = monthsBetween(stage.startDate, dateString);
    const periodicContribution = isWithinStages && monthsIntoStage % frequencyMonths === 0 ? stage.contributionAmount : 0;
    balance += periodicContribution;
    contributions += periodicContribution;
    const interest = balance * (Math.pow(1 + stage.annualReturn / 100, 1 / 12) - 1);
    balance += interest;
    points.push({ date: dateString, contributed: periodicContribution, interest, balance });
  }

  return { plan, points, initial: plan.initialContribution, contributions, interest: balance - plan.initialContribution - contributions, finalBalance: balance };
}

export function calculateSimulation(plans: FinancialPlan[], requestedEndDate?: string) {
  const plannedEnds = plans.flatMap((plan) => plan.stages.map((stage) => stage.endDate));
  const plannedEnd = plannedEnds.sort().at(-1);
  const periodEnd = requestedEndDate ?? plannedEnd;
  const results = plans.map((plan) => calculatePlan(plan, periodEnd));
  const pointsByDate = new Map<string, TimelinePoint>();
  results.forEach((result) => result.points.forEach((point) => {
    const current = pointsByDate.get(point.date) ?? { date: point.date, balance: 0, breakdown: { liquidity: 0, "fixed-income": 0, equities: 0, mixed: 0 } };
    current.balance += point.balance;
    current.breakdown[result.plan.category] += point.balance;
    pointsByDate.set(point.date, current);
  }));
  const starts = plans.flatMap((plan) => plan.stages.map((stage) => stage.startDate));
  const timeline = [...pointsByDate.values()];
  const periodStart = starts.sort()[0];
  if (periodEnd && timeline.length > 0 && timeline.at(-1)?.date !== periodEnd) {
    const finalBreakdown = { liquidity: 0, "fixed-income": 0, equities: 0, mixed: 0 } as TimelinePoint["breakdown"];
    results.forEach((result) => { finalBreakdown[result.plan.category] += result.finalBalance; });
    timeline.push({ date: periodEnd, balance: results.reduce((sum, result) => sum + result.finalBalance, 0), breakdown: finalBreakdown });
  }
  return { results, totalInitial: results.reduce((sum, result) => sum + result.initial, 0), totalContributions: results.reduce((sum, result) => sum + result.contributions, 0), totalInterest: results.reduce((sum, result) => sum + result.interest, 0), finalBalance: results.reduce((sum, result) => sum + result.finalBalance, 0), periodStart, periodEnd, timeline };
}
