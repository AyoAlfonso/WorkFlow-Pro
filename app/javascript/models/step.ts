import { types } from "mobx-state-tree";

export const StepModel = types
  .model("StepModel")
  .props({
    componentToRender: types.maybeNull(types.string),
    duration: types.maybeNull(types.number),
    id: types.identifierNumber,
    imageUrl: types.maybeNull(types.string),
    instructions: types.maybeNull(types.string),
    linkEmbed: types.maybeNull(types.string),
    name: types.string,
    orderIndex: types.number,
    sectionName: types.maybeNull(types.string),
    stepType: types.string,
    descriptionTextContent: types.maybeNull(types.string),
    checkInTemplateId: types.maybeNull(types.number),
  })
  .views(self => ({}))
  .actions(self => ({}));

type StepModelType = typeof StepModel.Type;
type StepModelDataType = typeof StepModel.CreationType;

export interface IStep extends StepModelType {}
export interface IStepModelData extends StepModelDataType {}
