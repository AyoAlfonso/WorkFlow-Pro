import { types } from "mobx-state-tree";
import { UserModel } from "./user";

export const KeyElementModel = types
  .model("KeyElementModel")
  .props({
    id: types.identifierNumber,
    value: types.maybeNull(types.string),
    completedAt: types.maybeNull(types.string),
    elementableId: types.number,
    completionType: types.maybeNull(types.string),
    status: types.string,
    ownedById: types.number,
    ownedBy: types.maybeNull(UserModel),
    completionStartingValue: types.maybeNull(types.number),
    completionCurrentValue: types.optional(types.union(types.number, types.string), ""), //add case for no entry value ''
    completionTargetValue: types.maybeNull(types.number),
  })
  .views(self => ({}))
  .actions(self => ({}));

type KeyElementModelType = typeof KeyElementModel.Type;
type KeyElementModelDataType = typeof KeyElementModel.CreationType;

export interface IKeyElement extends KeyElementModelType {}
export interface IKeyElementData extends KeyElementModelDataType {}
