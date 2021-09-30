import { types, getEnv, getRoot } from "mobx-state-tree";
import { AnnualInitiativeModel } from "../models/annual-initiative";
import { AnnualInitiativeType } from "../types/annual-initiative";
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
      const annualInitiatives = [];
      self.goals.forEach((goal) => {
        if (!goal.closedAt && goal.quarterlyGoals.length == 0) {
          if (!R.contains(goal.id, R.pluck("id", annualInitiatives))) {
            annualInitiatives.push(goal);
          }
        } else if (!goal.closedAt && goal.quarterlyGoals.length > 0) {
          annualInitiatives.push({ ...goal, quarterlyGoals: goal.openQuarterlyGoals });
        }
      });
      return annualInitiatives;
    },
    get closedAnnualInitiatives() {
      const annualInitiatives = [];
      self.goals.forEach(goal => {
        if (goal.closedAt) {
          if (!R.contains(goal.id, R.pluck("id", annualInitiatives))) {
            annualInitiatives.push(goal);
          }
        } else {
          if (goal.closedQuarterlyGoals.length > 0) {
            // const clonedGoal = R.clone(goal);
            // clonedGoal.quarterlyGoals = goal.closedQuarterlyGoals as any;
            annualInitiatives.push({ ...goal, quarterlyGoals: goal.closedQuarterlyGoals });
          }
        }
      });
      return annualInitiatives;
    },
    get myAnnualInitiatives() {
      const { sessionStore } = getRoot(self);
      const userId = sessionStore.profile.id;
      const annualInitiatives = [];
      self.goals.forEach(goal => {
        if (!goal.closedAt) {
          if (!R.contains(goal.id, R.pluck("id", annualInitiatives)) && goal.ownedById == userId) {
            const clonedGoal = R.clone(goal);
            clonedGoal.quarterlyGoals = goal.openPersonalQuarterlyGoals as any;
            annualInitiatives.push(clonedGoal);
          }
        }
      });
      return annualInitiatives;
    },
    get onlyShowMyQuarterlyGoals() {
      const goals = self.goals;
      const filteredQuarterlyGoals = goals.map((ai, index) => {
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
