import { types } from "mobx-state-tree";

export const MeetingTemplateModel = types
  .model("MeetingTemplateModel")
  .props({
    id: types.identifierNumber,
    name: types.string,
    meetingType: types.string,
    totalDuration: types.number,
    description: types.maybeNull(types.string),
  })
  .views(self => ({}))
  .actions(self => ({}));

type MeetingTemplateModelType = typeof MeetingTemplateModel.Type;
type MeetingTemplateModelDataType = typeof MeetingTemplateModel.CreationType;

export interface IMeeting extends MeetingTemplateModelType {}
export interface IMeetingTemplateModelData extends MeetingTemplateModelDataType {}