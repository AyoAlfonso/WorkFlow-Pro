import { types } from "mobx-state-tree";
import { QuarterlyGoalModel } from "./quarterly-goal";
import { KeyElementModel } from "./key-element";
import { UserModel } from "./user";

export const AnnualInitiativeModel = types
  .model("AnnualInitiativeModel")
  .props({
    id: types.identifierNumber,
    companyId: types.maybeNull(types.number),
    createdById: types.number,
    importance: types.array(types.string),
    description: types.string,
    keyElements: types.array(KeyElementModel),
    ownedById: types.number,
    quarterlyGoals: types.array(QuarterlyGoalModel),
    contextDescription: types.string,
    ownedBy: types.maybeNull(UserModel),
  })
  .views(self => ({}))
  .actions(self => ({}));

type AnnualInitiativeModelType = typeof AnnualInitiativeModel.Type;
type AnnualInitiativeModelDataType = typeof AnnualInitiativeModel.CreationType;

export interface IAnnualInitiative extends AnnualInitiativeModelType {}
export interface IAnnualInitiativeData extends AnnualInitiativeModelDataType {}
