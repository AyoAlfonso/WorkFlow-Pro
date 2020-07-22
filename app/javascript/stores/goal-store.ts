import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { GoalModel } from "../models/goal";
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
  }));

type GoalStoreType = typeof GoalStoreModel.Type;
export interface IGoalStore extends GoalStoreType {
  companyGoals: any;
  personalGoals: any;
}
