import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { GoalModel } from "../models/goal";
import { letterSpacing } from "styled-system";
//import { ApiResponse } from "apisauce";

export const GoalStoreModel = types
  .model("GoalStoreModel")
  .props({
    companyGoals: types.maybeNull(GoalModel),
    personalGoals: types.maybeNull(GoalModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    load: flow(function* () {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getAllGoals();
        if (response.ok) {
          self.companyGoals = response.data.company;
          self.personalGoals = response.data.user;
        }
      } catch {
        // error messaging handled by API monitor
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
        self.personalGoals.goals = personalGoalAI as any;
      }
    },
  }));

type GoalStoreType = typeof GoalStoreModel.Type;
export interface IGoalStore extends GoalStoreType {
  companyGoals: any;
  personalGoals: any;
}
