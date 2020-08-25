import { types } from "mobx-state-tree";
import { maybeNull } from "mobx-state-tree/dist/internal";

export const StepModel = types
  .model("StepModel")
  .props({
    id: types.identifierNumber,
    stepType: types.string,
    sectionName: types.maybeNull(types.string),
    name: types.string,
    instructions: types.maybeNull(types.string),
    duration: types.number,
    componentToRender: types.maybeNull(types.string),
    linkEmbed: types.maybeNull(types.string),
    orderIndex: types.number,
  })
  .views(self => ({}))
  .actions(self => ({}));

type StepModelType = typeof StepModel.Type;
type StepModelDataType = typeof StepModel.CreationType;

export interface IStep extends StepModelType {}
export interface IStepModelData extends StepModelDataType {}
