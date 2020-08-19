import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { MeetingModel, IMeeting } from "../models/meeting";
import { ApiResponse } from "apisauce";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

export const MeetingStoreModel = types
  .model("MeetingStoreModel")
  .props({
    currentMeeting: types.maybeNull(MeetingModel),
    meetings: types.array(MeetingModel),
    teamMeetings: types.array(MeetingModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    fetchMeetings: flow(function*() {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getMeetings();
        self.meetings = response.data;
      } catch {
        // caught bv Api Monitor
      }
    }),
    fetchTeamMeetings: flow(function*(teamId) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getTeamMeetings(teamId);
        self.teamMeetings = response.data;
      } catch {
        // caught bv Api Monitor
      }
    }),
    createMeeting: flow(function*(meetingObj) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.createMeeting(meetingObj);
        self.currentMeeting = response.data;
      } catch {
        // caught bv Api Monitor
      }
    }),
    updateCurrentMeeting: flow(function*(meetingObj) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.updateMeeting(meetingObj);
        self.currentMeeting = response.data;
      } catch {
        // caught bv Api Monitor
      }
    }),
    deleteMeeting: flow(function*(meetingId) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.deleteMeeting(meetingId);
        return response.data;
      } catch {
        // caught bv Api Monitor
      }
    }),
  }));

type MeetingStoreType = typeof MeetingStoreModel.Type;

export interface IMeetingStore extends MeetingStoreType {
  currentMeeting: any;
  meetings: any;
  teamMeetings: any;
}
