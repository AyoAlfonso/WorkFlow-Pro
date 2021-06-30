import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { ApiResponse } from "apisauce";
import { TeamModel } from "~/models/team";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { toJS } from "mobx";
import * as R from "ramda";

export const TeamStoreModel = types
  .model("TeamStoreModel")
  .props({
    teams: types.array(TeamModel),
    currentTeam: types.maybeNull(TeamModel),
  })
  .extend(withEnvironment())
  .views(self => ({
    // get yourTeams() {
    //   // const { sessionStore: { profile } } = getRoot(self);
    //   // const teamIds = R.pluck('id', profile.)
    //   // collection.filter(item => array.includes(item.type))
    //   return []
    // }
  }))
  .actions(self => ({
    fetchTeams: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getTeams();
      if (response.ok) {
        self.teams = response.data as any;
      }
    }),
    getTeam: flow(function*(id) {
      const response: ApiResponse<any> = yield self.environment.api.getTeam(id);
      if (response.ok) {
        self.currentTeam = response.data;
      }
    }),
    updateTeam: flow(function*(teamId, teamName, users) {
      const response: ApiResponse<any> = yield self.environment.api.updateTeam(
        teamId,
        teamName,
        users,
      );
      if (response.ok) {
        self.currentTeam = response.data.team;
        self.teams = response.data.teams;
        showToast("Updated team", ToastMessageConstants.SUCCESS);
      }
    }),
    updateTeamSettings: flow(function*(formData) {
      const response: ApiResponse<any> = yield self.environment.api.updateTeamSettings(formData);
      if (response.ok) {
        self.currentTeam = response.data.team;
        showToast("Updated team settings", ToastMessageConstants.SUCCESS);
      }
    }),
    createTeamAndInviteUsers: flow(function*(teamName, users) {
      const { teamStore } = getRoot(self);
      const response: ApiResponse<any> = yield self.environment.api.createTeamAndInviteUsers(
        teamName,
        users,
      );
      if (response.ok) {
        self.teams = response.data as any;
        showToast("Invites sent", ToastMessageConstants.SUCCESS);
        yield teamStore.fetchTeams();
      }
    }),
    deleteTeam: flow(function*(teamId) {
      const response: ApiResponse<any> = yield self.environment.api.deleteTeam(teamId);
      if (response.ok) {
        self.teams = response.data as any;
      }
    }),
  }))
  .actions(self => ({
    reset() {
      self.teams = [] as any;
    },
  }))
  .actions(self => ({
    load: flow(function*() {
      self.reset();
      yield self.fetchTeams();
    }),
  }));

type TeamStoreType = typeof TeamStoreModel.Type;
export interface ITeamStore extends TeamStoreType {
  teams: any;
}
