import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { CompanyModel } from "../models/company";
import { GoalModel } from "../models/goal";
//import { ApiResponse } from "apisauce";

export const GoalStoreModel = types
  .model("GoalStoreModel")
  .props({
    companyGoals: types.array(GoalModel),
    personalGoals: types.array(GoalModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    load: flow(function* () {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getAllGoals();
        if (response.ok) {
          self.companyGoals = response.data.companyGoals;
          self.personalGoals = response.data.userGoals;
        }
      } catch {
        // error messaging handled by API monitor
      }
    }),
  }));

type GoalStoreType = typeof GoalStoreModel.Type;
export interface IGoalStore extends GoalStoreType {
  companyGoals: any;
  personalGoals: any;
}
