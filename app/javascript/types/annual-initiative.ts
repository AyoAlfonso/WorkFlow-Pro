import { QuarterlyGoalType } from "./quarterly-goal";

export type AnnualInitiativeType = {
  id: number;
  companyId: number;
  createdById: number;
  importance: Array<string>;
  description: string;
  keyElements: Array<string>;
  ownedById: number;
  quarterlyGoals: Array<QuarterlyGoalType>;
};
