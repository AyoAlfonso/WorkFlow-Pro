import { types } from "mobx-state-tree";
import { AnnualInitiativeModel } from "../models/annual-initiative";

export const GoalModel = types
  .model("GoalModel")
  .props({
    rallyingCry: types.maybeNull(types.string),
    personalVision: types.maybeNull(types.string),
    goals: types.array(AnnualInitiativeModel),
  })
  .views(self => ({}))
  .actions(self => ({}));

type GoalModelType = typeof GoalModel.Type;
type GoalModelDataType = typeof GoalModel.CreationType;

export interface IGoal extends GoalModelType {}
export interface IGoalData extends GoalModelDataType {}
