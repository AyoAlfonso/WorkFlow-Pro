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
      return self.goals.filter(annualInitiative => !annualInitiative.closedAt)
    },
    get closedAnnualInitiatives(){
      return self.goals.filter(annualInitiative => annualInitiative.closedAt)
    },
    get myAnnualInitiatives(){
      const { sessionStore } = getRoot(self);
      const userId = sessionStore.profile.id;
      return self.goals.filter(annualInitiative => annualInitiative.ownedById == userId)
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
