import { types } from "mobx-state-tree";
import { QuarterlyGoalModel } from "./quarterly-goal";

export const AnnualInitiativeModel = types
  .model("AnnualInitiativeModel")
  .props({
    id: types.identifierNumber,
    companyId: types.number,
    createdById: types.number,
    importance: types.array(types.string),
    description: types.string,
    keyElements: types.array(types.string),
    ownedById: types.number,
    quarterlyGoals: types.array(QuarterlyGoalModel),
  })
  .views(self => ({}))
  .actions(self => ({}));

type AnnualInitiativeModelType = typeof AnnualInitiativeModel.Type;
type AnnualInitiativeModelDataType = typeof AnnualInitiativeModel.CreationType;

export interface IAnnualInitiative extends AnnualInitiativeModelType {}
export interface IAnnualInitiativeData extends AnnualInitiativeModelDataType {}
