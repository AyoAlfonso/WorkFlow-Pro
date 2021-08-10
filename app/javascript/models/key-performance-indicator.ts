import { types, getRoot } from "mobx-state-tree";
import { ScorecardLogModel } from "./scorecard-log";
import { UserModel } from "./user";

export const KeyPerformanceIndicatorModel = types
  .model("KeyPerformanceIndicatorModel")
  .props({
    id: types.identifierNumber,
    description: types.string,
    closedAt: types.maybeNull(types.string),
    createdById: types.number,
    userId: types.maybeNull(types.number),
    companyId: types.maybeNull(types.number),
    teamId: types.maybeNull(types.number),
    ownedById: types.maybeNull(types.number),
    createdAt: types.maybeNull(types.string),
    updatedAt: types.maybeNull(types.string),
    unitType: types.string,
    targetValue: types.number,
    isDeleted: types.boolean,
    ownerType: types.string,
    weeks: types.map(ScorecardLogModel),
    needsAttentionThreshold: types.number,
  })
  .views(self => ({}))
  .actions(self => ({}));
