import { UserType } from "./user";
import { MilestoneType } from "./milestone";
import { KeyElementType } from "./key-element";
import { SubInitiativesType } from "./sub-initiatives";

export type QuarterlyGoalType = {
  id: number;
  annualInitiativeId: number;
  createdById: number;
  createdAt: Date | string;
  closedAt: Date | string;
  importance: Array<string>;
  keyElements: Array<KeyElementType>;
  ownedById: number;
  ownedBy: UserType;
  description: string;
  milestones: Array<MilestoneType>;
  contextDescription: string;
  subInitiatives?: Array<SubInitiativesType>;
  quarter: number;
  fiscalYear: number;
};
