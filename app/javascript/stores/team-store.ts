import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { ApiResponse } from "apisauce";
import { TeamModel } from "~/models/team";

export const TeamStoreModel = types
  .model("TeamStoreModel")
  .props({
    teams: types.array(TeamModel),
  })
  .extend(withEnvironment())
  .actions(self => ({
    fetchTeams: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getTeams();
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
