import { types, flow, getEnv } from "mobx-state-tree";
import { CoreFourModel } from "./core-four";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

export const CompanyModel = types
  .model("CompanyModel")
  .props({
    id: types.identifierNumber,
    name: types.string,
    rallyingCry: types.maybeNull(types.string),
    coreFour: CoreFourModel,
    accountabilityChartContent: types.string,
    strategicPlanContent: types.string,
    logoUrl: types.maybeNull(types.string),
    fiscalYearStart: types.maybeNull(types.string),
    timezone: types.maybeNull(types.string),
  })
  .views(self => ({}))
  .actions(self => ({
    update: flow(function* (fieldsAndValues) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.updateCompany(
          Object.assign(fieldsAndValues, { id: self.id }),
        );
        if (response.ok) {
          self = response.data;
          yield showToast("Company updated", ToastMessageConstants.SUCCESS);
        }
      } catch {
        // error messaging handled by API monitor
      }
    }),
  }));

type CompanyModelType = typeof CompanyModel.Type;
type CompanyModelDataType = typeof CompanyModel.CreationType;

export interface ICompany extends CompanyModelType {}
export interface ICompanyData extends CompanyModelDataType {}
