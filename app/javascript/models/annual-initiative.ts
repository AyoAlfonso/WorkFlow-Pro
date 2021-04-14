import { types, getRoot } from "mobx-state-tree";
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
    fiscalYear: types.maybeNull(types.number),
    closedAt: types.maybeNull(types.string)
  })
  .views(self => ({
    get closedInitiative() {
      const { companyStore } = getRoot(self);
      return companyStore.company.currentFiscalYear > self.fiscalYear;
    },
    get myQuarterlyGoals() {
      const { sessionStore } = getRoot(self);
      return self.quarterlyGoals.filter(qg => qg.ownedById == sessionStore.profile.id);
    },
    get activeQuarterlyGoals() {
      const { companyStore } = getRoot(self);
      return self.quarterlyGoals.filter(
        qg => companyStore.company.currentFiscalQuarter == qg.quarter,
      );
    },
  }))
  .actions(self => ({}));

type AnnualInitiativeModelType = typeof AnnualInitiativeModel.Type;
type AnnualInitiativeModelDataType = typeof AnnualInitiativeModel.CreationType;

export interface IAnnualInitiative extends AnnualInitiativeModelType {}
export interface IAnnualInitiativeData extends AnnualInitiativeModelDataType {}
