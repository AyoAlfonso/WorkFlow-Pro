import { types } from "mobx-state-tree";
import { CoreFourModel } from "./core-four";

export const CompanyModel = types
  .model("CompanyModel")
  .props({
    id: types.identifierNumber,
    name: types.string,
    rallyingCry: types.string,
    lastName: types.string,
    coreFour: CoreFourModel,
  })
  .views(self => ({}))
  .actions(self => ({}));

type CompanyModelType = typeof CompanyModel.Type;
type CompanyModelDataType = typeof CompanyModel.CreationType;

export interface ICompany extends CompanyModelType {}
export interface ICompanyData extends CompanyModelDataType {}
