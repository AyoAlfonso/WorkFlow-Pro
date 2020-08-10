import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { CompanyModel } from "../models/company";
//import { ApiResponse } from "apisauce";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

export const CompanyStoreModel = types
  .model("CompanyStoreModel")
  .props({
    company: types.maybeNull(CompanyModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    load: flow(function*() {
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
    updateCompany: flow(function*(fieldsAndValues) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.updateCompany(
          Object.assign(fieldsAndValues, { id: self.company.id }),
        );
        if (response.ok) {
          self.company = response.data;
          showToast("Company updated", ToastMessageConstants.SUCCESS);
        }
      } catch {
        // error messaging handled by API monitor
      }
    }),
    deleteCompanyLogo: flow(function*() {
      const env = getEnv(self);
      try {
        const response = yield env.api.deleteLogo(self.company.id);
        if (response.ok) {
          self.company.setLogoUrl(response.data.logoUrl);
        }
      } catch {
        // error messaging handled by API monitor
      }
    }),
  }))
  .actions(self => ({
    updateModelField(field, value) {
      self.company[field] = value;
    },
    updateCompanyFromModel() {
      self.updateCompany(self.company);
    },
  }));

type CompanyStoreType = typeof CompanyStoreModel.Type;
export interface ICompanyStore extends CompanyStoreType {}
