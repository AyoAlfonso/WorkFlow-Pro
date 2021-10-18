import { types } from "mobx-state-tree";
import { string } from "prop-types";
import { MilestoneModel } from "./milestone";

export const MilestonesForWeeklyCheckinModel = types
  .model("MilestonesForWeeklyCheckinModel")
  .props({
    quarterlyGoalMilestones: types.maybeNull(types.array(MilestoneModel)),
    status: types.string,
    subinitiativesMilestones: types.maybeNull(types.array(MilestoneModel)),
  })
  .views(self => ({}))
  .actions(self => ({}));

type MilestonesForWeeklyCheckinModelType = typeof MilestonesForWeeklyCheckinModel.Type;
type MilestonesForWeeklyCheckinModelDataType = typeof MilestonesForWeeklyCheckinModel.CreationType;

export interface IMilestonesForWeeklyCheckin extends MilestonesForWeeklyCheckinModelType {}
export interface IMilestonesForWeeklyCheckinData extends MilestonesForWeeklyCheckinModelDataType {}
