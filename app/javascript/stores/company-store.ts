import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { CompanyModel } from "../models/company";
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
        showToast("There was an error loading the company", ToastMessageConstants.ERROR);
      }
    }),
    updateCompany: flow(function*(fieldsAndValues) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.updateCompany(
          Object.assign({ company: fieldsAndValues }, { id: self.company.id }),
        );
        if (response.ok) {
          self.company = response.data;
          showToast("Company updated", ToastMessageConstants.SUCCESS);
        }
      } catch {
        showToast("There was an error updating the company", ToastMessageConstants.ERROR);
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
        showToast("There was an error removing the company logo", ToastMessageConstants.ERROR);
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
