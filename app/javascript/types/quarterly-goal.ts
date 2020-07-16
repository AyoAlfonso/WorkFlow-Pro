import { UserType } from "./user";
import { MilestoneType } from "./milestone";
import { KeyElementType } from "./key-element";

export type QuarterlyGoalType = {
  id: number;
  annualInitiativeId: number;
  createdById: number;
  createdAt: Date;
  importance: Array<string>;
  keyElements: Array<KeyElementType>;
  ownedById: number;
  ownedBy: UserType;
  status: string;
  description: string;
  milestones: Array<MilestoneType>;
  contextDescription: string;
};
