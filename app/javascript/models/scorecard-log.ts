import { types, getRoot } from "mobx-state-tree";
import { UserModel } from "./user"
// import { KeyPerformanceIndicatorModel } from "./user";

export const ScorecardLogModel = types
  .model("ScorecardLogModel")
  .props({
    id: types.number,
    score: types.number,
    note: types.maybeNull(types.string),
    keyPerformanceIndicatorId: types.number,
    week: types.identifierNumber,
    fiscalQuarter: types.number,
    fiscalYear: types.number,
    createdAt: types.string,
    user: types.maybeNull(UserModel),
  })
  .views(self => ({}))
  .actions(self => ({}));
