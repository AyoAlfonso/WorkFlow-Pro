import { types } from "mobx-state-tree";

export const MilestoneModel = types
  .model("MilestoneModel")
  .props({
    id: types.identifierNumber,
    createdById: types.number,
    createdAt: types.string,
    quarterlyGoalId: types.number,
    status: types.string,
    description: types.string,
    week: types.number,
    weekOf: types.string,
  })
  .views(self => ({}))
  .actions(self => ({}));

type MilestoneModelType = typeof MilestoneModel.Type;
type MilestoneModelDataType = typeof MilestoneModel.CreationType;

export interface IMilestone extends MilestoneModelType {}
export interface IMilestoneData extends MilestoneModelDataType {}
