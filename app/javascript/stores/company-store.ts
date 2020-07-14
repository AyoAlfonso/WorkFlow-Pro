import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { CompanyModel } from "../models/company";
//import { ApiResponse } from "apisauce";

export const CompanyStoreModel = types
  .model("CompanyStoreModel")
  .props({
    company: types.maybeNull(CompanyModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    load: flow(function* () {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getCompany("default");
        if (response.ok) {
          self.company = response.data;
        }
      } catch {
        // error messaging handled by API monitor
      }
    }),
  }));

type CompanyStoreType = typeof CompanyStoreModel.Type;
export interface ICompanyStore extends CompanyStoreType {}
