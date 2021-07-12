import { types, getRoot } from "mobx-state-tree";
// import { KeyPerformanceIndicatorModel } from "./user";

export const ScorecardLogModel = types
  .model("ScorecardLogModel")
  .props({
    id: types.number,
    score: types.number,
    note: types.string,
    keyPerformanceIndicatorId: types.number,
    week: types.identifierNumber,
    fiscalQuarter: types.number,
    fiscalYear: types.number,
    createdAt: types.string,
  })
  .views(self => ({}))
  .actions(self => ({}));
