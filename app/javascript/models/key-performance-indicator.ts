import { types } from "mobx-state-tree";
import { ScorecardLogModel } from "./scorecard-log";
import { UserModel } from "./user";
"./";
// import {KeyPerformanceIndicatorModel} from
export const KeyPerformanceIndicatorModel = types
  .model("KeyPerformanceIndicatorModel")
  .props({
    id: types.identifierNumber,
    title: types.maybeNull(types.string),
    description: types.maybeNull(types.string),
    closedAt: types.maybeNull(types.string),
    createdById: types.number,
    ownedBy: types.maybeNull(UserModel),
    ownedById: types.maybeNull(types.number),
    createdAt: types.maybeNull(types.string),
    updatedAt: types.maybeNull(types.string),
    unitType: types.string,
    targetValue: types.number,
    isDeleted: types.boolean,
    greaterThan: types.boolean,
    parentKpi: types.maybeNull(types.array(types.frozen<object>())),
    parentType: types.maybeNull(types.string),
    relatedParentKpis: types.maybeNull(types.array(types.frozen<object>())),
    viewers: types.maybeNull(types.array(types.model(types.frozen<object>()))),
    period: types.maybeNull(types.map(types.map(ScorecardLogModel))),
    scorecardLogs: types.maybeNull(types.array(ScorecardLogModel)),
    weeks: types.maybeNull(types.map(ScorecardLogModel)),
    needsAttentionThreshold: types.maybeNull(types.number),
  })
  .views(self => ({}))
  .actions(self => ({}));
