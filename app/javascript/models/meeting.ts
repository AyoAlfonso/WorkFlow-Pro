import { types } from "mobx-state-tree";
import { maybeNull } from "mobx-state-tree/dist/internal";

export const MeetingModel = types
  .model("MeetingModel")
  .props({
    id: types.identifierNumber,
    averageRating: types.maybeNull(types.number),
    issuesDone: types.maybeNull(types.number),
    keyActivitiesDone: types.maybeNull(types.number),
    averageTeamMood: types.maybeNull(types.number),
    goalProgress: types.maybeNull(types.number),
    teamId: types.maybeNull(types.number),
    scheduledStartTime: types.maybeNull(types.string),
    startTime: types.maybeNull(types.string),
    endTime: types.maybeNull(types.string),
    hostName: types.maybeNull(types.string),
    currentStep: types.maybeNull(types.number),
    steps: types.array(types.frozen()),
    name: types.string,
    duration: types.number,
    meetingType: types.string,
    createdAt: types.string,
  })
  .views(self => ({}))
  .actions(self => ({}));

type MeetingModelType = typeof MeetingModel.Type;
type MeetingModelDataType = typeof MeetingModel.CreationType;

export interface IMeeting extends MeetingModelType {}
export interface IMeetingModelData extends MeetingModelDataType {}
