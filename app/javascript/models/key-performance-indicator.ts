import { types } from "mobx-state-tree";
import { ScorecardLogModel } from "./scorecard-log";
import { UserModel } from "./user";

export const KeyPerformanceIndicatorModel = types
  .model("KeyPerformanceIndicatorModel")
  .props({
    id: types.identifierNumber,
    title: types.maybeNull(types.string),
    description: types.string,
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
    viewers: types.maybeNull(types.array(types.model({ type: types.string, id: types.string }))),
    period: types.maybeNull(types.map(types.map(ScorecardLogModel))),
    scorecardLogs: types.maybeNull(types.array(ScorecardLogModel)),
    weeks: types.maybeNull(types.map(ScorecardLogModel)),
    needsAttentionThreshold: types.maybeNull(types.number),
  })
  .views(self => ({}))
  .actions(self => ({}));
