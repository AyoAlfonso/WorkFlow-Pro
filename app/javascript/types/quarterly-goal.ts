import { UserType } from "./user";
import { MilestoneType } from "./milestone";

export type QuarterlyGoalType = {
  id: number;
  annualInitiativeId: number;
  createdById: number;
  createdAt: Date;
  importance: Array<string>;
  keyElements: Array<string>;
  ownedById: number;
  ownedBy: UserType;
  status: string;
  description: string;
  milestones: Array<MilestoneType>;
};
