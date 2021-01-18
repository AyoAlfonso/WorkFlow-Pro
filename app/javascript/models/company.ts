import { types, flow, getEnv } from "mobx-state-tree";
import { CoreFourModel } from "./core-four";

//core four, accountability, strategic only for display_format companies

export const CompanyModel = types
  .model("CompanyModel")
  .props({
    id: types.identifierNumber,
    name: types.string,
    rallyingCry: types.maybeNull(types.string),
    displayFormat: types.string,
    logoUrl: types.maybeNull(types.string),
    timezone: types.maybeNull(types.string),
    fiscalYearStart: types.maybeNull(types.string),
    currentFiscalQuarter: types.maybeNull(types.number),
    quarterForCreatingQuarterlyGoals: types.maybeNull(types.number),
    currentFiscalYear: types.maybeNull(types.number),
    yearForCreatingAnnualInitiatives: types.maybeNull(types.number),
    coreFour: CoreFourModel,
    accountabilityChartContent: types.maybeNull(types.string),
    strategicPlanContent: types.maybeNull(types.string),
  })
  .views(self => ({
    get accessCompany() {
      return self.displayFormat == "Company";
    },
    get accessForum() {
      return self.displayFormat == "Forum";
    },
  }))
  .actions(self => ({
    setLogoUrl: logoUrl => {
      self.logoUrl = logoUrl;
    },
  }));

type CompanyModelType = typeof CompanyModel.Type;
type CompanyModelDataType = typeof CompanyModel.CreationType;

export interface ICompany extends CompanyModelType {}
export interface ICompanyData extends CompanyModelDataType {}
