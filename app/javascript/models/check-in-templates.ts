import { types } from "mobx-state-tree";
import { StepModel } from "./step";

export const CheckInTemplateModel = types
  .model("CheckInTemplateModel")
  .props({
    id: types.identifierNumber,
    name: types.string,
    checkInType: types.string,
    description: types.maybeNull(types.string),
    checkInTemplatesSteps: types.array(StepModel),
    currentStep: types.maybeNull(types.number),
  })
  .views(self => ({
    get currentStepDetails() {
      return self.checkInTemplatesSteps.find(step => step.orderIndex == self.currentStep);
    },
  }))
  .actions(self => ({}));

type CheckInTemplateModelType = typeof CheckInTemplateModel.Type;
type CheckInTemplateModelDataType = typeof CheckInTemplateModel.CreationType;

export interface ICheckIn extends CheckInTemplateModelType {}
export interface ICheckInTemplateModelData extends CheckInTemplateModelDataType {}
