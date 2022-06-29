import { types } from "mobx-state-tree";
import { CheckInTemplateModel } from "./check-in-templates";

export const CheckInArtifactsModel = types.model("CheckInArtifactsModel").props({
  id: types.identifierNumber,
  ownedById: types.number,
  skip: types.boolean,
  checkInTemplateId: types.number,
  endTime: types.maybeNull(types.string),
  startTime: types.maybeNull(types.string),
  checkInTemplate: CheckInTemplateModel,
  deletedAt: types.maybeNull(types.string),
  questions: types.frozen(),
  boolean: types.maybeNull(types.boolean),
})

type CheckInArtifactsModelType = typeof CheckInArtifactsModel.Type;

export interface ICheckInArtifact extends CheckInArtifactsModelType {}