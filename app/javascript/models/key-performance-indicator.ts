import { types, getRoot, flow } from "mobx-state-tree";
// // import { QuarterlyGoalModel } from "./quarterly-goal";
// // import { KeyElementModel } from "./key-element";
import { ScorecardLogModel } from "./scorecard-log"
import { UserModel } from "./user";


export const KeyPerformanceIndicatorModel = types
  .model("KeyPerformanceIndicatorModel")
  .props({
    id: types.identifierNumber,
    description: types.string,
    closedAt: types.maybeNull(types.string),
    createdById: types.number,
    ownedBy: UserModel,
    ownedById: types.maybeNull(types.number),
    createdAt: types.maybeNull(types.string),
    updatedAt: types.maybeNull(types.string),
    unitType: types.string,
    targetValue: types.number,
    isDeleted: types.boolean,
    greaterThan: types.boolean,
    viewers: types.array(types.model({ type: types.string, id: types.string })),
    period: types.maybeNull(types.map(types.map(ScorecardLogModel))),
    scorecardLogs: types.maybeNull(types.array(ScorecardLogModel)),
  })
  .views(self => ({
  }))
  .actions(self => ({
  }));
