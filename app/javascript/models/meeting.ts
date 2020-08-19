import { types } from "mobx-state-tree";

export const MeetingModel = types
  .model("MeetingModel")
  .props({
    id: types.optional(types.number, 0),
    averageRating: types.maybeNull(types.number),
    issuesDone: types.maybeNull(types.number),
    keyActivitiesDone: types.maybeNull(types.number),
    averageTeamMood: types.maybeNull(types.number),
    goalProgress: types.maybeNull(types.number),
    meetingTemplateId: types.maybeNull(types.number),
    teamId: types.maybeNull(types.number),
  })
  .views(self => ({}))
  .actions(self => ({}));

type MeetingModelType = typeof MeetingModel.Type;
type MeetingModelDataType = typeof MeetingModel.CreationType;

export interface IMeeting extends MeetingModelType {}
export interface IMeetingModelData extends MeetingModelDataType {}
