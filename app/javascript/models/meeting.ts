import * as R from "ramda";
import { types } from "mobx-state-tree";
import { StepModel } from "./step";
import { KeyActivityModel } from "./key-activity";
import { MilestoneModel } from "./milestone";

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
    currentWeekAverageUserEmotions: types.maybeNull(types.frozen()),
    currentWeekAverageTeamEmotions: types.maybeNull(types.number),
    emotionScorePercentageDifference: types.maybeNull(types.number),
    teamKeyActivities: types.maybeNull(types.array(KeyActivityModel)),
    statsForWeek: types.maybeNull(types.array(types.frozen())),
    myCurrentMilestones: types.maybeNull(types.array(MilestoneModel)),
    habitsPercentageIncreaseFromPreviousWeek: types.maybeNull(types.number),
    title: types.maybeNull(types.string),
    notes: types.maybeNull(types.string),
    meetingTemplateId: types.maybeNull(types.number),
  })
  .views(self => ({
    get currentStepDetails() {
      return self.steps.find(step => step.orderIndex == self.currentStep);
    },
    get formattedAverageWeeklyUserEmotions() {
      if (!R.isNil(self.currentWeekAverageUserEmotions)) {
        return self.currentWeekAverageUserEmotions["emotionScores"].map((averages, index) => {
          return { x: self.currentWeekAverageUserEmotions["recordDates"][index], y: averages.averageScore };
        });
      } else {
        [];
      }
    },
  }));

type MeetingModelType = typeof MeetingModel.Type;
type MeetingModelDataType = typeof MeetingModel.CreationType;

export interface IMeeting extends MeetingModelType {}
export interface IMeetingModelData extends MeetingModelDataType {}
