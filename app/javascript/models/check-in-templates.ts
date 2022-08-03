import { types } from "mobx-state-tree";
import { DayTimeConfigModel } from "./day-time-config";
import { EntityModel } from "./entity";
import { StepModel } from "./step";

const ReminderModel = types.model("ReminderModel").props({
  unit: types.string,
  value: types.string,
});

export const CheckInTemplateModel = types
  .model("CheckInTemplateModel")
  .props({
    id: types.identifierNumber,
    name: types.string,
    checkInType: types.string,
    description: types.maybeNull(types.string),
    checkInTemplatesSteps: types.array(StepModel),
    currentStep: types.maybeNull(types.number),
    participants: types.maybeNull(types.array(EntityModel)),
    viewers: types.maybeNull(types.array(EntityModel)),
    anonymous: types.maybeNull(types.boolean),
    runOnce: types.maybeNull(types.string),
    tag: types.maybeNull(types.array(types.string)),
    dateTimeConfig: types.maybeNull(DayTimeConfigModel),
    timeZone: types.maybeNull(types.number),
    reminder: types.maybeNull(ReminderModel),
    ownerType: types.maybeNull(types.string),
    createdById: types.maybeNull(types.number),
    status: types.maybeNull(types.string),
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
