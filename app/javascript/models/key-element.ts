import { types } from "mobx-state-tree";

export const KeyElementModel = types
  .model("KeyElementModel")
  .props({
    id: types.identifierNumber,
    value: types.maybeNull(types.string),
    completedAt: types.maybeNull(types.string),
    elementableId: types.number,
  })
  .views(self => ({}))
  .actions(self => ({}));

type KeyElementModelType = typeof KeyElementModel.Type;
type KeyElementModelDataType = typeof KeyElementModel.CreationType;

export interface IKeyElement extends KeyElementModelType {}
export interface IKeyElementData extends KeyElementModelDataType {}
