import { types, flow, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { MeetingModel } from "../models/meeting";
import { MeetingTemplateModel } from "../models/meeting-template";
import { ApiResponse } from "apisauce";
import MeetingTypes from "~/constants/meeting-types";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import * as R from "ramda";

export const MeetingStoreModel = types
  .model("MeetingStoreModel")
  .props({
    meetingTemplates: types.array(MeetingTemplateModel),
    currentPersonalPlanning: types.maybeNull(MeetingModel),
    currentMeeting: types.maybeNull(MeetingModel),
    meetings: types.array(MeetingModel),
    teamMeetings: types.array(MeetingModel),
    meetingRecap: types.maybeNull(types.frozen()),
    personalPlanningSummary: types.maybeNull(types.frozen()),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    fetchMeetingTemplates: flow(function*() {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getMeetingTemplates();
        self.meetingTemplates = response.data;
      } catch {
        // caught by Api Monitor
      }
    }),
  }))
  .actions(self => ({
    fetchMeetings: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getMeetings();
      self.meetings = response.data;
    }),
    fetchTeamMeetings: flow(function*(teamId) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getTeamMeetings(teamId);
        if (response.ok) {
          self.teamMeetings = response.data;
        }
      } catch {
        // caught bv Api Monitor
      }
    }),
    updateMeeting: flow(function*(meetingObj) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.updateMeeting(meetingObj);
        if (response.ok) {
          let teamMeetings = self.teamMeetings;
          let meetingToUpdateIndex = teamMeetings.findIndex(
            meeting => meeting.id == response.data.id,
          );
          teamMeetings[meetingToUpdateIndex] = response.data;
          self.teamMeetings = teamMeetings;
          self.currentMeeting = response.data;
          return self.currentMeeting;
        }
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
    getMeeting: flow(function*(meetingId) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getMeeting(meetingId);
        self.currentMeeting = response.data;
        return response.data;
      } catch {
        // caught by Api Monitor
      }
    }),
    getMeetingRecap: flow(function*(teamId, meetingId) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getMeetingRecap(
          teamId,
          meetingId,
        );
        self.meetingRecap = response.data as any;
        return response.data;
      } catch {
        // caught by Api Monitor
      }
    }),
    getPersonalPlanningSummary: flow(function*() {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getSummaryForPersonalMeeting();
        self.personalPlanningSummary = response.data as any;
        return response.data;
      } catch {
        // caught by Api Monitor
      }
    }),
  }))
  .actions(self => ({
    setCurrentMeeting(meeting) {
      self.currentMeeting = meeting;
    },
  }))
  .actions(self => ({
    updatePersonalMeeting: flow(function*(meetingObj) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.updateMeeting(meetingObj);
        if (response.ok) {
          let meetings = self.meetings;
          let meetingToUpdateIndex = meetings.findIndex(meeting => meeting.id == response.data.id);
          meetings[meetingToUpdateIndex] = response.data;
          self.meetings = meetings;
          self.currentPersonalPlanning = response.data;
        }
      } catch {
        // caught bv Api Monitor
      }
    }),
    getPersonalMeeting: flow(function*(meetingId) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getMeeting(meetingId);
        self.currentPersonalPlanning = response.data;
        return response.data;
      } catch {
        //caught by Api Monitor
      }
    }),
    setCurrentPersonalPlanning(meeting) {
      self.currentPersonalPlanning = meeting;
    },
  }))
  .actions(self => ({
    reset() {
      self.meetings = [] as any;
      self.teamMeetings = [] as any;
    },
  }))
  .actions(self => ({
    load: flow(function*() {
      self.reset();
      self.fetchMeetingTemplates();
      self.fetchMeetings();
    }),
  }))
  .actions(self => ({
    createMeeting: flow(function*(teamId) {
      try {
        let meetingTemplate = self.meetingTemplates.find(
          mt => mt.meetingType === MeetingTypes.TEAM_WEEKLY,
        );

        if (R.isNil(meetingTemplate)) {
          const responseTemplate: ApiResponse<any> = yield self.environment.api.getMeetingTemplates();
          if (responseTemplate.ok) {
            self.meetingTemplates = responseTemplate.data;
            meetingTemplate = self.meetingTemplates.find(
              mt => mt.meetingType === MeetingTypes.TEAM_WEEKLY,
            );
          }
        }

        if (R.isNil(meetingTemplate)) {
          showToast("Meeting templates not set up properly.", ToastMessageConstants.ERROR);
          self.load();
          return { meeting: null };
        }

        const { sessionStore } = getRoot(self);

        const response: ApiResponse<any> = yield self.environment.api.createMeeting({
          teamId: teamId,
          hostName: `${sessionStore.profile.firstName} ${sessionStore.profile.lastName}`,
          currentStep: 0,
          meetingTemplateId: meetingTemplate.id,
        });

        if (response.ok) {
          self.currentMeeting = response.data;
          return { meeting: self.currentMeeting };
        } else {
          return { meeting: null };
        }
      } catch {
        // caught bv Api Monitor
      }
      return { meeting: null };
    }),
    createPersonalMeeting: flow(function*() {
      try {
        let meetingTemplate = self.meetingTemplates.find(
          mt => mt.meetingType === MeetingTypes.PERSONAL_WEEKLY,
        );

        if (R.isNil(meetingTemplate)) {
          const responseTemplate: ApiResponse<any> = yield self.environment.api.getMeetingTemplates();
          if (responseTemplate.ok) {
            self.meetingTemplates = responseTemplate.data;
            meetingTemplate = self.meetingTemplates.find(
              mt => mt.meetingType === MeetingTypes.TEAM_WEEKLY,
            );
          }
        }

        if (R.isNil(meetingTemplate)) {
          showToast("Meeting templates not set up properly.", ToastMessageConstants.ERROR);
          self.load();
          return { meeting: null };
        }

        const { sessionStore } = getRoot(self);

        const response: ApiResponse<any> = yield self.environment.api.createMeeting({
          hostName: `${sessionStore.profile.firstName} ${sessionStore.profile.lastName}`,
          currentStep: 0,
          meetingTemplateId: meetingTemplate.id,
        });
        if (response.ok) {
          self.currentPersonalPlanning = response.data;
          return { meeting: self.currentPersonalPlanning };
        } else {
          return { meeting: null };
        }
      } catch {
        // caught bv Api Monitor
      }
    }),
  }));

type MeetingStoreType = typeof MeetingStoreModel.Type;

export interface IMeetingStore extends MeetingStoreType {
  currentPersonalMeeting: any;
  currentMeeting: any;
  meetings: any;
  teamMeetings: any;
}
