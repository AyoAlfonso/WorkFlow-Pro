import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";

import { MeetingModel } from "../models/meeting";
import { TeamModel } from "../models/team";

import { ApiResponse } from "apisauce";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
// import moment from "moment";

// we can piggy back off the teamStore's currentMeeting instead of upcoming meeting
export const ForumStoreModel = types
  .model("ForumStoreModel")
  .props({
    error: types.boolean,
    currentForumTeamId: types.maybeNull(types.integer),
    currentForumYear: types.maybeNull(types.integer),
    forumYearMeetings: types.maybeNull(types.array(MeetingModel)),
    searchedForumMeetings: types.maybeNull(types.array(MeetingModel)),
    currentSelectedForumMeeting: types.maybeNull(MeetingModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    load: flow(function*(teamId, year, forumType) {
      if (teamId) {
        self.error = false;
        try {
          self.currentForumTeamId = teamId;
          // const responseT: ApiResponse<any> = yield self.environment.api.getTeam(teamId);
          // if (responseT.ok) {
          //   self.currentForumTeam = responseT.data as any;
          // }
          const responseM: ApiResponse<any> = yield self.environment.api.searchSection1Meetings({
            team_id: teamId,
            meeting_type: forumType,
            fiscal_year: year,
          });
          if (responseM.ok) {
            self.currentForumYear = year;
            self.forumYearMeetings = responseM.data.reverse().slice(0, 12) as any;
          } else {
            self.error = true;
          }
        } catch (e) {
          //show error
          self.error = true;
          showToast(`Error fetching forum data: ${e.message}`, ToastMessageConstants.ERROR);
        }

        //assumes you know what the initial year is when you load
      }
    }),
    createMeetingsForYear: flow(function*(teamId, currentYear, forumType) {
      //should actually go to backend and create initial meetings
      try {
        const response: ApiResponse<any> = yield self.environment.api.createForumMeetingsForYear(
          teamId,
          currentYear,
          forumType,
        );
        if (response.ok) {
          self.forumYearMeetings = response.data as any;
        }
      } catch {
        //show error
        showToast("Error creating forum meetings", ToastMessageConstants.ERROR);
      }
    }),
    updateMeeting: flow(function*(meetingObj, fromMeeting = false) {
      const response: ApiResponse<any> = yield self.environment.api.updateMeeting(meetingObj);
      if (response.ok) {
        let forumYearMeetings = self.forumYearMeetings;
        let meetingToUpdateIndex = forumYearMeetings.findIndex(
          meeting => meeting.id == response.data.id,
        );
        forumYearMeetings[meetingToUpdateIndex] = response.data;
        self.forumYearMeetings = forumYearMeetings;

        if (fromMeeting) {
          const { meetingStore } = getRoot(self);
          meetingStore.updateCurrentMeeting(response.data);
        }

        if (self.searchedForumMeetings) {
          let searchedForumMeetings = self.searchedForumMeetings;
          let searchedForumMeetingIndex = searchedForumMeetings.findIndex(
            meeting => meeting.id == response.data.id,
          );
          searchedForumMeetings[searchedForumMeetingIndex] = response.data;
          self.searchedForumMeetings = searchedForumMeetings;
        }

        return response.data;
      }
    }),
    searchForMeetingsByDateRange: flow(function*(startDate, endDate, teamId, meetingType) {
      const response: ApiResponse<any> = yield self.environment.api.searchForumMeetingsByDateRange(
        startDate,
        endDate,
        teamId,
        meetingType,
      );
      if (response.ok) {
        self.searchedForumMeetings = response.data;
      } else {
        self.error = true;
      }
    }),
    searchForForumMeeting: flow(function*(meetingId) {
      const response: ApiResponse<any> = yield self.environment.api.getMeeting(meetingId);
      if (response.ok) {
        self.currentSelectedForumMeeting = response.data;
      } else {
        self.error = true;
      }
    }),
  }));

type ForumStoreType = typeof ForumStoreModel.Type;
export interface IForumStore extends ForumStoreType {}
