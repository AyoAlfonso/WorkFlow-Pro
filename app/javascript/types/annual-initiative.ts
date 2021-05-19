import { QuarterlyGoalType } from "./quarterly-goal";
import { KeyElementType } from "./key-element";
import { UserType } from "./user";

export type AnnualInitiativeType = {
  id: number;
  companyId: number;
  createdById: number;
  importance: Array<string>;
  description: string;
  keyElements: Array<KeyElementType>;
  ownedById: number;
  ownedBy?:  UserType;
  quarterlyGoals: Array<QuarterlyGoalType>;
  contextDescription: string;
  fiscalYear?: number;
  closedInitiative?: true;
};
