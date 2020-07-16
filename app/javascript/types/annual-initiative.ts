import { QuarterlyGoalType } from "./quarterly-goal";
import { KeyElementType } from "./key-element";

export type AnnualInitiativeType = {
  id: number;
  companyId: number;
  createdById: number;
  importance: Array<string>;
  description: string;
  keyElements: Array<KeyElementType>;
  ownedById: number;
  quarterlyGoals: Array<QuarterlyGoalType>;
  contextDescription: string;
};
