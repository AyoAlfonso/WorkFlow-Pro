import { types, flow, getEnv } from "mobx-state-tree";
import { CoreFourModel } from "./core-four";

export const CompanyModel = types
  .model("CompanyModel")
  .props({
    id: types.identifierNumber,
    name: types.string,
    rallyingCry: types.maybeNull(types.string),
    coreFour: CoreFourModel,
    accountabilityChartContent: types.maybeNull(types.string),
    strategicPlanContent: types.maybeNull(types.string),
    logoUrl: types.maybeNull(types.string),
    fiscalYearStart: types.maybeNull(types.string),
    timezone: types.maybeNull(types.string),
    currentFiscalQuarter: types.maybeNull(types.number),
  })
  .views(self => ({}))
  .actions(self => ({
    setLogoUrl: logoUrl => {
      self.logoUrl = logoUrl;
    },
  }));

type CompanyModelType = typeof CompanyModel.Type;
type CompanyModelDataType = typeof CompanyModel.CreationType;

export interface ICompany extends CompanyModelType {}
export interface ICompanyData extends CompanyModelDataType {}
