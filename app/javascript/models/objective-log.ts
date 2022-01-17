import { types, getRoot } from "mobx-state-tree";
import { UserModel } from "./user";

export const ObjectiveLogModel = types
  .model("ObjectiveLogModel")
  .props({
    id: types.maybeNull(types.identifierNumber),
    ownedById: types.maybeNull(types.number),
    score: types.maybeNull(types.number),
    objecteableType: types.maybeNull(types.string),
    note: types.maybeNull(types.string),
    objecteableId: types.maybeNull(types.number),
    week: types.maybeNull(types.number),
    fiscalQuarter: types.maybeNull(types.number),
    fiscalYear: types.maybeNull(types.number),
    createdAt: types.maybeNull(types.string),
    ownedBy: types.maybeNull(UserModel),
    childId: types.maybeNull(types.number),
    childType: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
  })
  .views(self => ({}))
  .actions(self => ({}));

type ObjectiveLogModelType = typeof ObjectiveLogModel.Type;
type ObjectiveLogModelDataType = typeof ObjectiveLogModel.CreationType;

export interface IObjectiveLog extends ObjectiveLogModelType {}
export interface IObjectiveLogData extends ObjectiveLogModelDataType {}
