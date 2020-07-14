import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { AnnualInitiativeModel } from "../models/annual-initiative";
//import { ApiResponse } from "apisauce";

export const AnnualInitiativeStoreModel = types
  .model("AnnualInitiativeModel")
  .props({
    annualInitiative: types.maybeNull(AnnualInitiativeModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    getAnnualInitiative: flow(function* (id) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getAnnualInitiative(id);
        self.annualInitiative = response.data;
      } catch {
        console.log("is there an error?????????");
        // error messaging handled by API monitor
      }
    }),
  }));

type AnnualInitiativeStoreType = typeof AnnualInitiativeStoreModel.Type;
export interface IAnnualInitiativeStore extends AnnualInitiativeStoreType {
  annualInitiative;
}
