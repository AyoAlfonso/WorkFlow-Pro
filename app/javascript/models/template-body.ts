import { types } from "mobx-state-tree";

export const TemplateBodyModel = types
  .model("TemplateBodyModel")
  .props({
    body: types.maybeNull(types.string),
    id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    recordId: types.maybeNull(types.number),
    recordType: types.maybeNull(types.string),
    updatedAt: types.maybeNull(types.string),
    createdAt: types.maybeNull(types.string),
  })
  .views(self => ({}))
  .actions(self => ({}));

type TemplateBodyModelType = typeof TemplateBodyModel.Type;
type TemplateBodyModelDataType = typeof TemplateBodyModel.CreationType;

export interface ITemplateBody extends TemplateBodyModelType {}
export interface ITemplateBodyData extends TemplateBodyModelDataType {}
