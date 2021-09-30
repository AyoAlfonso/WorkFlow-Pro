import { types, getRoot } from "mobx-state-tree";
import { UserModel } from "./user";
// import { KeyPerformanceIndicatorModel } from "./user";

export const ScorecardLogModel = types
  .model("ScorecardLogModel")
  .props({
    id: types.maybeNull(types.number),
    score: types.maybeNull(types.number),
    note: types.maybeNull(types.string),
    keyPerformanceIndicatorId: types.maybeNull(types.number),
    week: types.maybeNull(types.identifierNumber),
    fiscalQuarter: types.maybeNull(types.number),
    fiscalYear: types.maybeNull(types.number),
    createdAt: types.maybeNull(types.string),
    user: types.maybeNull(UserModel),
    parents: types.maybeNull(types.array(types.number)),
  })
  .views(self => ({}))
  .actions(self => ({}));
