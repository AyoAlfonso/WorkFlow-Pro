import { types, getRoot } from "mobx-state-tree";
import { KeyPerformanceIndicatorModel } from "./user";

export const ScorecardModel = types.model("ScorecardModel").props({
  id: types.identifierNumber,
  score: types.array(types.string),
  note: types.string,
  kpi: types.array(KeyPerformanceIndicatorModel),
});
