import { types } from "mobx-state-tree";
import { maybeNull } from "mobx-state-tree/dist/internal";

export const StepModel = types
  .model("StepModel")
  .props({
    componentToRender: types.maybeNull(types.string),
    duration: types.number,
    id: types.identifierNumber,
    imageUrl: types.maybeNull(types.string),
    instructions: types.maybeNull(types.string),
    linkEmbed: types.maybeNull(types.string),
    name: types.string,
    orderIndex: types.number,
    sectionName: types.maybeNull(types.string),
    stepType: types.string,
  })
  .views(self => ({}))
  .actions(self => ({}));

type StepModelType = typeof StepModel.Type;
type StepModelDataType = typeof StepModel.CreationType;

export interface IStep extends StepModelType {}
export interface IStepModelData extends StepModelDataType {}
