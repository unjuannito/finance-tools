export type PlanCategory = "liquidity" | "fixed-income" | "equities" | "mixed";
export type ContributionFrequency = "monthly" | "quarterly" | "yearly";
export type SimulationMode = "alternatives" | "combined";

export type Withdrawal = { id: string; date: string; amount: number; description: string };
export type FinancialStage = {
  id: string; startDate: string; endDate: string; contributionAmount: number;
  contributionFrequency: ContributionFrequency; annualReturn: number; withdrawals: Withdrawal[];
};
export type FinancialPlan = { id: string; name: string; category: PlanCategory; initialContribution: number; stages: FinancialStage[] };
export const emptyStage: Omit<FinancialStage, "id"> = {
  startDate: "2000-01-01", endDate: "2020-01-01", contributionAmount: 0,
  contributionFrequency: "monthly", annualReturn: 0, withdrawals: [],
};
export const emptyPlan: Omit<FinancialPlan, "id"> = { name: "", category: "liquidity", initialContribution: 0, stages: [] };

