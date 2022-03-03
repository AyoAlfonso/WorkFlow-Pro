import { types } from "mobx-state-tree";
import { UserModel } from "./user";
import { MilestoneModel } from "./milestone";
import { KeyElementModel } from "./key-element";
import moment from "moment";
import { SubInitiativeModel } from "./sub-initiative";

export const QuarterlyGoalModel = types
  .model("QuarterlyGoalModel")
  .props({
    id: types.identifierNumber,
    annualInitiativeId: types.number,
    createdById: types.number,
    createdAt: types.string,
    importance: types.array(types.string),
    keyElements: types.array(KeyElementModel),
    ownedById: types.number,
    ownedBy: types.maybeNull(UserModel),
    description: types.string,
    milestones: types.array(MilestoneModel),
    contextDescription: types.string,
    quarter: types.number,
    closedAt: types.maybeNull(types.string),
    fiscalYear: types.maybeNull(types.number),
    subInitiatives: types.array(SubInitiativeModel),
  })
  .views(self => ({
    get activeMilestones() {
      return self.milestones.filter(
        milestone =>
          moment(milestone.weekOf).isSame(moment(), "week") ||
          moment(milestone.weekOf).isAfter(moment(), "week"),
      );
    },
    get lastStartedMilestoneStatus() {
      const startedMilestones = self.milestones.filter(
        milestone => milestone.status != "unstarted",
      );
      return startedMilestones[startedMilestones.length - 1];
    },
  }))
  .actions(self => ({}));

type QuarterlyGoalModelType = typeof QuarterlyGoalModel.Type;
type QuarterlyGoalModelDataType = typeof QuarterlyGoalModel.CreationType;

export interface IQuarterlyGoal extends QuarterlyGoalModelType {}
export interface IQuarterlyGoalData extends QuarterlyGoalModelDataType {}
