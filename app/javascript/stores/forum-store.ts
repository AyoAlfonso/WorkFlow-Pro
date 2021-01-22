import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";

import { MeetingModel } from "../models/meeting";
import { TeamModel } from "../models/team";
import MeetingTypes from "~/constants/meeting-types";

import { ApiResponse } from "apisauce";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
// import * as moment from "moment";

export const ForumStoreModel = types
  .model("ForumStoreModel")
  .props({
    currentForumTeamId: types.maybeNull(types.integer),
    currentForumYear: types.maybeNull(types.integer),
    forumYearMeetings: types.maybeNull(types.array(MeetingModel)),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    load: flow(function*(teamId, year) {
      if (teamId) {
        console.log(teamId);
        try {
          self.currentForumTeamId = teamId;
          // const responseT: ApiResponse<any> = yield self.environment.api.getTeam(teamId);
          // if (responseT.ok) {
          //   self.currentForumTeam = responseT.data as any;
          // }
          const responseM: ApiResponse<any> = yield self.environment.api.searchMeetings({
            team_id: teamId,
            meeting_type: MeetingTypes.FORUM_MONTHLY,
            fiscal_year: year,
          });
          if (responseM.ok) {
            self.currentForumYear = year;
            self.forumYearMeetings = responseM.data as any;
          }
        } catch {
          //show error
          showToast("Error fetching forum data", ToastMessageConstants.ERROR);
        }

        //assumes you know what the initial year is when you load
      }
    }),
    createMeetingsForYear: flow(function*(teamId, year) {
      //should actually go to backend and create initial meetings
      try {
        const response: ApiResponse<any> = yield self.environment.api.createForumMeetingsForYear(
          teamId,
          year,
        );
        if (response.ok) {
          self.forumYearMeetings = response.data as any;
        }
      } catch {
        //show error
        showToast("Error creating forum meetings", ToastMessageConstants.ERROR);
      }
    }),
  }));

type ForumStoreType = typeof ForumStoreModel.Type;
export interface IForumStore extends ForumStoreType {}
