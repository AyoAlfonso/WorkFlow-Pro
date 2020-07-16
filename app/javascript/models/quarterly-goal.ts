import { types } from "mobx-state-tree";
import { UserModel } from "./user";
import { MilestoneModel } from "./milestone";
import { KeyElementModel } from "./key-element";

export const QuarterlyGoalModel = types
  .model("QuarterlyGoalModel")
  .props({
    id: types.identifierNumber,
    annualInitiativeId: types.number,
    createdById: types.number,
    createdAt: types.string,
    importance: types.array(types.string),
    keyElements: types.array(KeyElementModel),
    ownedById: types.number,
    ownedBy: types.maybeNull(UserModel),
    status: types.string,
    description: types.string,
    milestones: types.array(MilestoneModel),
  })
  .views(self => ({}))
  .actions(self => ({}));

type QuarterlyGoalModelType = typeof QuarterlyGoalModel.Type;
type QuarterlyGoalModelDataType = typeof QuarterlyGoalModel.CreationType;

export interface IQuarterlyGoal extends QuarterlyGoalModelType {}
export interface IQuarterlyGoalData extends QuarterlyGoalModelDataType {}
