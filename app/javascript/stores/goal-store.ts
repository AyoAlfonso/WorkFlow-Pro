import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { GoalModel } from "../models/goal";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import * as R from "ramda";
import { AnnualInitiativeModel } from "~/models/annual-initiative";

export const GoalStoreModel = types
  .model("GoalStoreModel")
  .props({
    companyGoals: types.maybeNull(GoalModel),
    personalGoals: types.maybeNull(GoalModel),
    teamGoals: types.maybeNull(types.array(AnnualInitiativeModel)),
  })
  .extend(withEnvironment())
  .views(self => ({
    get activeTeamGoals() {
      const annualInitiatives = [];
      self.teamGoals.forEach(goal => {
        if (!goal.closedAt && goal.quarterlyGoals.length == 0) {
          if (!R.contains(goal.id, R.pluck("id", annualInitiatives))) {
            annualInitiatives.push(goal);
          }
        } else {
          if (goal.openQuarterlyGoals.length > 0) {
            const clonedGoal = R.clone(goal);
            clonedGoal.quarterlyGoals = goal.openQuarterlyGoals as any;
            annualInitiatives.push(clonedGoal);
          }
        }
      });
      return annualInitiatives;
    },
  }))
  .actions(self => ({
    load: flow(function*() {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getAllGoals();
        if (response.ok) {
          self.companyGoals = response.data.company;
          self.personalGoals = response.data.user;
        }
      } catch {
        showToast("There was an error loading goals", ToastMessageConstants.ERROR);
      }
    }),
    getTeamGoals: flow(function*(teamId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getTeamGoals(teamId);
        if (response.ok) {
          self.teamGoals = response.data;
        }
      } catch {
        showToast("There was an error loading goals", ToastMessageConstants.ERROR);
      }
    }),
  }))
  .actions(self => ({
    updateAnnualInitiative(annualInitiative) {
      if (self.companyGoals && annualInitiative) {
        const companyGoalAIIndex = self.companyGoals.goals.findIndex(
          ai => ai.id == annualInitiative.id,
        );
        if (companyGoalAIIndex > -1) {
          self.companyGoals.goals[companyGoalAIIndex] = annualInitiative;
        }
      }

      if (self.personalGoals && annualInitiative) {
        const personalGoalAIIndex = self.personalGoals.goals.findIndex(
          ai => ai.id == annualInitiative.id,
        );
        if (personalGoalAIIndex > -1) {
          self.personalGoals.goals[personalGoalAIIndex] = annualInitiative;
        }
      }
      if (self.teamGoals && annualInitiative) {
        const teamGoalAIIndex = self.teamGoals.findIndex(ai => ai.id == annualInitiative.id);
        if (teamGoalAIIndex > -1) {
          self.teamGoals[teamGoalAIIndex] = annualInitiative;
        }
      }
    },
    mergeAnnualInitiatives(type, annualInitiative) {
      if (type == "company") {
        const updatedAnnualInitiatives = [...self.companyGoals.goals, annualInitiative];
        self.companyGoals.goals = updatedAnnualInitiatives as any;
      } else if (type == "personal") {
        const updatedAnnualInitiatives = [...self.personalGoals.goals, annualInitiative];
        self.personalGoals.goals = updatedAnnualInitiatives as any;
      }
    },
    mergeQuarterlyGoals(quarterlyGoal) {
      if (self.companyGoals) {
        const companyGoalAI = self.companyGoals.goals.find(
          annualInitiative => annualInitiative.id == quarterlyGoal.annualInitiativeId,
        );
        if (companyGoalAI) {
          companyGoalAI.quarterlyGoals = [...companyGoalAI.quarterlyGoals, quarterlyGoal] as any;
          const goals = self.companyGoals.goals;
          const goalIndex = goals.findIndex(goal => goal.id == companyGoalAI.id);
          goals[goalIndex] = companyGoalAI;
          self.companyGoals.goals = goals;
        }
      }

      if (self.personalGoals) {
        const personalGoalAI = self.personalGoals.goals.find(
          annualInitiative => annualInitiative.id == quarterlyGoal.annualInitiativeId,
        );
        if (personalGoalAI) {
          personalGoalAI.quarterlyGoals = [...personalGoalAI.quarterlyGoals, quarterlyGoal] as any;
          const goals = self.personalGoals.goals;
          const goalIndex = goals.findIndex(goal => goal.id == personalGoalAI.id);
          goals[goalIndex] = personalGoalAI;
          self.personalGoals.goals = goals;
        }
      }

      if (self.teamGoals) {
        const teamGoalAI = self.teamGoals.find(
          annualInitiative => annualInitiative.id == quarterlyGoal.annualInitiativeId,
        );

        if (teamGoalAI) {
          teamGoalAI.quarterlyGoals = [...teamGoalAI.quarterlyGoals, quarterlyGoal] as any;
          const goals = self.teamGoals;
          const goalIndex = goals.findIndex(goal => goal.id == teamGoalAI.id);
          goals[goalIndex] = teamGoalAI;
          self.teamGoals = goals;
        }
      }
    },
    updateGoalAnnualInitiative(goal, index, annualInitiative) {
      if (goal == "teamGoals") {
        const goals = self.teamGoals;
        goals[index] = annualInitiative;
        self.teamGoals = goals;
      } else {
        const goals = self[goal]["goals"];
        goals[index] = annualInitiative;
        self[goal]["goals"] = goals;
      }
    },
    removeDeletedAnnualInitiative(annualInitiativeId) {
      if (self.companyGoals) {
        const companyGoalAI = self.companyGoals.goals.find(
          annualInitiative => annualInitiative.id == annualInitiativeId,
        );
        if (companyGoalAI) {
          const updatedAI = R.filter(
            annualInitiative => annualInitiative.id != annualInitiativeId,
            self.companyGoals.goals,
          );
          self.companyGoals.goals = updatedAI;
        }
      }

      if (self.personalGoals) {
        const personalGoalAI = self.personalGoals.goals.find(
          annualInitiative => annualInitiative.id == annualInitiativeId,
        );

        if (personalGoalAI) {
          const updatedAI = R.filter(
            annualInitiative => annualInitiative.id != annualInitiativeId,
            self.personalGoals.goals,
          );
          self.personalGoals.goals = updatedAI;
        }
      }

      if (self.teamGoals) {
        const teamGoalAI = self.teamGoals.find(
          annualInitiative => annualInitiative.id == annualInitiativeId,
        );

        if (teamGoalAI) {
          const updatedAI = R.filter(
            annualInitiative => annualInitiative.id != annualInitiativeId,
            self.teamGoals,
          );
          self.teamGoals = updatedAI;
        }
      }
    },
  }));

type GoalStoreType = typeof GoalStoreModel.Type;
export interface IGoalStore extends GoalStoreType {
  companyGoals: any;
  personalGoals: any;
}
