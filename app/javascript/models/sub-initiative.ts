import { types } from "mobx-state-tree";
import { UserModel } from "./user";
import { MilestoneModel } from "./milestone";
import { KeyElementModel } from "./key-element";
import * as moment from "moment";

export const SubInitiativeModel = types
  .model("SubInitiativeModel")
  .props({
    id: types.identifierNumber,
    quarterlyGoalId: types.number,
    createdById: types.number,
    importance: types.array(types.string),
    keyElements: types.array(KeyElementModel),
    ownedById: types.number,
    ownedBy: types.maybeNull(UserModel),
    description: types.string,
    milestones: types.array(MilestoneModel),
    contextDescription: types.maybeNull(types.string),
    quarter: types.number,
    closedAt: types.maybeNull(types.string)
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

type SubInitiativeModelType = typeof SubInitiativeModel.Type;
type SubInitiativeModelDataType = typeof SubInitiativeModel.CreationType;

export interface ISubInitiative extends SubInitiativeModelType {}
export interface ISubInitiativeData extends SubInitiativeModelDataType {}
