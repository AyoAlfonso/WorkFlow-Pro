import { types, getEnv, getRoot } from "mobx-state-tree";
import { AnnualInitiativeModel } from "../models/annual-initiative";
import { withRootStore } from "../lib/with-root-store";

export const GoalModel = types
  .model("GoalModel")
  .props({
    rallyingCry: types.maybeNull(types.string),
    personalVision: types.maybeNull(types.string),
    goals: types.array(AnnualInitiativeModel),
  })
  .extend(withRootStore())
  .views(self => ({
    get activeAnnualInitiatives() {
      const { companyStore } = getRoot(self);
      const currentFiscalYear = companyStore.company.currentFiscalYear;
      return self.goals.filter(annualInitiative => annualInitiative.fiscalYear >= currentFiscalYear)
    },
    get closedAnnualInitiatives(){
      const { companyStore } = getRoot(self);
      const currentFiscalYear = companyStore.company.currentFiscalYear;
      return self.goals.filter(annualInitiative => annualInitiative.fiscalYear < currentFiscalYear)
    },
    get myAnnualInitiatives(){
      const { sessionStore, companyStore } = getRoot(self);
      const userId = sessionStore.profile.id;
      const currentFiscalYear = companyStore.company.currentFiscalYear;
      return self.goals.filter(annualInitiative => annualInitiative.ownedById == userId && annualInitiative.fiscalYear >= currentFiscalYear)
    },
    get onlyShowMyQuarterlyGoals() {
      let goals = self.goals;
      let filteredQuarterlyGoals = goals.map((ai, index) => {
        return { ...ai, quarterlyGoals: ai.myQuarterlyGoals };
      });
      return filteredQuarterlyGoals;
    },
  }))
  .actions(self => ({}));

type GoalModelType = typeof GoalModel.Type;
type GoalModelDataType = typeof GoalModel.CreationType;

export interface IGoal extends GoalModelType {}
export interface IGoalData extends GoalModelDataType {}
