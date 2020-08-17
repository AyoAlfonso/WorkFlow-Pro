import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { GoalModel } from "../models/goal";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import * as R from "ramda";

export const GoalStoreModel = types
  .model("GoalStoreModel")
  .props({
    companyGoals: types.maybeNull(GoalModel),
    personalGoals: types.maybeNull(GoalModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
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
  }))
  .actions(self => ({
    updateAnnualInitiative(annualInitiative) {
      const goalObject = annualInitiative.companyId ? self.companyGoals : self.personalGoals;
      const goalsAnnualInitiativeIndex = self.companyGoals.goals.findIndex(
        ai => ai.id == annualInitiative.id,
      );
      goalObject.goals[goalsAnnualInitiativeIndex] = annualInitiative;
    },
    mergeAnnualInitiatives(type, annualInitiative) {
      if (type == "company") {
        const updatedAnnualInitiatives = [...self.companyGoals.goals, annualInitiative];
        self.companyGoals.goals = updatedAnnualInitiatives as any;
      } else {
        const updatedAnnualInitiatives = [...self.personalGoals.goals, annualInitiative];
        self.personalGoals.goals = updatedAnnualInitiatives as any;
      }
    },
    mergeQuarterlyGoals(quarterlyGoal) {
      let companyGoalAI = self.companyGoals.goals.find(
        annualInitiative => annualInitiative.id == quarterlyGoal.annualInitiativeId,
      );
      let personalGoalAI = self.personalGoals.goals.find(
        annualInitiative => annualInitiative.id == quarterlyGoal.annualInitiativeId,
      );

      if (companyGoalAI) {
        companyGoalAI.quarterlyGoals = [...companyGoalAI.quarterlyGoals, quarterlyGoal] as any;
        let goals = self.companyGoals.goals;
        const goalIndex = goals.findIndex(goal => goal.id == companyGoalAI.id);
        goals[goalIndex] = companyGoalAI;
        self.companyGoals.goals = goals;
      } else if (personalGoalAI) {
        personalGoalAI.quarterlyGoals = [...personalGoalAI.quarterlyGoals, quarterlyGoal] as any;
        let goals = self.personalGoals.goals;
        const goalIndex = goals.findIndex(goal => goal.id == personalGoalAI.id);
        goals[goalIndex] = personalGoalAI;
        self.personalGoals.goals = goals;
      }
    },
    updateGoalAnnualInitiative(goal, index, annualInitiative) {
      let goals = self[goal]["goals"];
      goals[index] = annualInitiative;
      self[goal]["goals"] = goals;
    },
    removeDeletedAnnualInitiative(annualInitiativeId) {
      let companyGoalAI = self.companyGoals.goals.find(
        annualInitiative => annualInitiative.id == annualInitiativeId,
      );
      let personalGoalAI = self.personalGoals.goals.find(
        annualInitiative => annualInitiative.id == annualInitiativeId,
      );

      if (companyGoalAI) {
        const updatedAI = R.filter(
          annualInitiative => annualInitiative.id != annualInitiativeId,
          self.companyGoals.goals,
        );
        self.companyGoals.goals = updatedAI;
      } else if (personalGoalAI) {
        const updatedAI = R.filter(
          annualInitiative => annualInitiative.id != annualInitiativeId,
          self.personalGoals.goals,
        );
        self.personalGoals.goals = updatedAI;
      }
    },
  }));

type GoalStoreType = typeof GoalStoreModel.Type;
export interface IGoalStore extends GoalStoreType {
  companyGoals: any;
  personalGoals: any;
}
