import { types } from "mobx-state-tree";

export const QuarterlyGoalModel = types
  .model("QuarterlyGoalModel")
  .props({
    id: types.identifierNumber,
    annualInitiativeId: types.number,
    createdById: types.number,
    createdAt: types.string,
    importance: types.array(types.string),
    keyElements: types.array(types.string),
    ownedById: types.number,
    status: types.number,
    // milestones
  })
  .views(self => ({}))
  .actions(self => ({}));

type QuarterlyGoalModelType = typeof QuarterlyGoalModel.Type;
type QuarterlyGoalModelDataType = typeof QuarterlyGoalModel.CreationType;

export interface IQuarterlyGoal extends QuarterlyGoalModelType {}
export interface IQuarterlyGoalData extends QuarterlyGoalModelDataType {}
