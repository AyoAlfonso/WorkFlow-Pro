import { types } from "mobx-state-tree";
import { CoreFourModel } from "./core-four";

export const CompanyModel = types
  .model("CompanyModel")
  .props({
    id: types.identifierNumber,
    name: types.string,
    rallyingCry: types.maybeNull(types.string),
    coreFour: CoreFourModel,
    accountabilityChartContent: types.string,
    strategicPlanContent: types.string,
  })
  .views(self => ({}))
  .actions(self => ({}));

type CompanyModelType = typeof CompanyModel.Type;
type CompanyModelDataType = typeof CompanyModel.CreationType;

export interface ICompany extends CompanyModelType {}
export interface ICompanyData extends CompanyModelDataType {}
