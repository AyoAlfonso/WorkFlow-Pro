import { types } from "mobx-state-tree";

export const LabelModel = types
  .model("LabelModel")
  .props({
    id: types.optional(types.number, 0),
    name: types.maybeNull(types.string),
    color: types.maybeNull(types.string),
    createdAt: types.maybeNull(types.string),
    teamId: types.maybeNull(types.number),
  })
  .views(self => ({}))
  .actions(self => ({}));

type LabelModelType = typeof LabelModel.Type;
type LabelModelDataType = typeof LabelModel.CreationType;

export interface ILabel extends LabelModelType {}
export interface ILabelData extends LabelModelDataType {}
