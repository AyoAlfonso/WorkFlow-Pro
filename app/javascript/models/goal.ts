import { types, getEnv, getRoot } from "mobx-state-tree";
import { AnnualInitiativeModel } from "../models/annual-initiative";
import { withRootStore } from "../lib/with-root-store";
import * as R from "ramda";

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
      let annualInitiatives = [];
      self.goals.forEach(goal => {
        if (!goal.closedAt && goal.quarterlyGoals.length == 0) {
          if (!R.contains(goal.id, R.pluck("id", annualInitiatives))) {
            annualInitiatives.push(goal);
          }
        } else {
          if (goal.openQuarterlyGoals.length > 0) {
            let clonedGoal = R.clone(goal);
            clonedGoal.quarterlyGoals = goal.openQuarterlyGoals as any;
            annualInitiatives.push(clonedGoal);
          }
        }
      });
      return annualInitiatives;
    },
    get closedAnnualInitiatives() {
      let annualInitiatives = [];
      self.goals.forEach(goal => {
        if (goal.closedAt) {
          if (!R.contains(goal.id, R.pluck("id", annualInitiatives))) {
            annualInitiatives.push(goal);
          }
        } else {
          if (goal.closedQuarterlyGoals.length > 0) {
            let clonedGoal = R.clone(goal);
            clonedGoal.quarterlyGoals = goal.closedQuarterlyGoals as any;
            annualInitiatives.push(clonedGoal);
          }
          // else if (goal.closedSubInitiatives.length > 0) {
          //   let clonedGoal = R.clone(goal);
          //   clonedGoal.quarterlyGoals.subInitiatives = goal.closedSubInitiatives as any;
          //   annualInitiatives.push(clonedGoal);
          // }
        }
      });
      return annualInitiatives;
    },
    get myAnnualInitiatives() {
      const { sessionStore } = getRoot(self);
      const userId = sessionStore.profile.id;
      return self.goals.filter(
        annualInitiative =>
          annualInitiative.ownedById == userId ||
          annualInitiative.quarterlyGoals.find(qg => qg.ownedById == userId),
      );
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
