import { types } from "mobx-state-tree";
import { UserModel } from "./user";
import { MilestoneModel } from "./milestone";
import { KeyElementModel } from "./key-element";
import * as moment from "moment";

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
    status: types.string,
    description: types.string,
    milestones: types.array(MilestoneModel),
    contextDescription: types.string,
    quarter: types.number,
  })
  .views(self => ({
    get activeMilestones() {
      return self.milestones.filter(
        milestone =>
          moment(milestone.weekOf).isSame(moment(), "day") ||
          moment(milestone.weekOf).isAfter(moment(), "day"),
      );
    },
  }))
  .actions(self => ({}));

type QuarterlyGoalModelType = typeof QuarterlyGoalModel.Type;
type QuarterlyGoalModelDataType = typeof QuarterlyGoalModel.CreationType;

export interface IQuarterlyGoal extends QuarterlyGoalModelType {}
export interface IQuarterlyGoalData extends QuarterlyGoalModelDataType {}
