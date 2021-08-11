import * as R from "ramda";
import { types } from "mobx-state-tree";
import { TemplateBodyModel } from "./template-body";

export const DescriptionTemplateModel = types.model("DescriptionTemplateModel").props({
  id: types.identifierNumber,
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  templateType: types.string,
  companyId: types.maybeNull(types.number),
  title: types.maybeNull(types.string),
  body: types.maybeNull(TemplateBodyModel),
});

type DescriptionTemplateModelType = typeof DescriptionTemplateModel.Type;
type DescriptionTemplateModelDataType = typeof DescriptionTemplateModel.CreationType;

export interface IDescriptionTemplate extends DescriptionTemplateModelType {}
export interface IDescriptionTemplateData extends DescriptionTemplateModelDataType {}
