import { types } from "mobx-state-tree";
import { ObjectiveLogModel } from "./objective-log";
import { UserModel } from "./user";

export const KeyElementModel = types
  .model("KeyElementModel")
  .props({
    id: types.identifierNumber,
    value: types.maybeNull(types.string),
    completedAt: types.maybeNull(types.string),
    elementableId: types.number,
    completionType: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    ownedById: types.maybeNull(types.number),
    ownedBy: types.maybeNull(UserModel),
    completionStartingValue: types.maybeNull(types.number),
    completionCurrentValue: types.optional(types.union(types.number, types.string), ""), //add case for no entry value ''
    completionTargetValue: types.maybeNull(types.number),
    greaterThan: types.maybeNull(types.number),
    createdAt: types.maybeNull(types.string),
    elementableType: types.maybeNull(types.string),
    elementableContextDescription: types.maybeNull(types.string),
    elementableOwnedBy: types.maybeNull(types.number),
    objectiveLogs: types.maybeNull(types.array(ObjectiveLogModel)),
  })
  .views(self => ({}))
  .actions(self => ({}));

type KeyElementModelType = typeof KeyElementModel.Type;
type KeyElementModelDataType = typeof KeyElementModel.CreationType;

export interface IKeyElement extends KeyElementModelType {}
export interface IKeyElementData extends KeyElementModelDataType {}
