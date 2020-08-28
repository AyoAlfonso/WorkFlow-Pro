import { types } from "mobx-state-tree";
import { StepModel } from "./step";
import { KeyActivityModel } from "./key-activity";

export const MeetingModel = types
  .model("MeetingModel")
  .props({
    averageRating: types.maybeNull(types.number),
    averageTeamMood: types.maybeNull(types.number),
    createdAt: types.string,
    currentStep: types.maybeNull(types.number),
    totalDuration: types.number,
    endTime: types.maybeNull(types.string),
    goalProgress: types.maybeNull(types.number),
    hostName: types.maybeNull(types.string),
    id: types.identifierNumber,
    issuesDone: types.maybeNull(types.number),
    keyActivitiesDone: types.maybeNull(types.number),
    meetingType: types.string,
    name: types.string,
    scheduledStartTime: types.maybeNull(types.string),
    startTime: types.maybeNull(types.string),
    steps: types.array(StepModel),
    teamId: types.maybeNull(types.number),
    currentWeekAverageUserEmotions: types.maybeNull(types.array(types.frozen())),
    currentWeekAverageTeamEmotions: types.maybeNull(types.number),
    emotionScorePercentageDifference: types.maybeNull(types.string),
    teamKeyActivities: types.maybeNull(types.array(KeyActivityModel)),
  })
  .views(self => ({
    get currentStepDetails() {
      return self.steps.find(step => step.orderIndex == self.currentStep);
    },
    get formattedAverageWeeklyUserEmotions() {
      return self.currentWeekAverageUserEmotions.map(averages => {
        return { x: new Date(averages.date), y: averages.averageScore };
      });
    },
  }));

type MeetingModelType = typeof MeetingModel.Type;
type MeetingModelDataType = typeof MeetingModel.CreationType;

export interface IMeeting extends MeetingModelType {}
export interface IMeetingModelData extends MeetingModelDataType {}
