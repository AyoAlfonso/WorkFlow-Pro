import { types } from "mobx-state-tree";

export const MilestoneModel = types
  .model("MilestoneModel")
  .props({
    id: types.identifierNumber,
    createdById: types.number,
    createdAt: types.string,
    milestoneableId: types.number,
    milestoneableType: types.string,
    status: types.string,
    description: types.string,
    week: types.number,
    weekOf: types.string,
    quarterlyGoalDescription: types.maybeNull(types.string), //only for my current milestones
  })
  .views(self => ({}))
  .actions(self => ({}));

type MilestoneModelType = typeof MilestoneModel.Type;
type MilestoneModelDataType = typeof MilestoneModel.CreationType;

export interface IMilestone extends MilestoneModelType {}
export interface IMilestoneData extends MilestoneModelDataType {}
