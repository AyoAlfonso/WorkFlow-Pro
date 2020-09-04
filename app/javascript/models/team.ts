import * as R from "ramda";
import { types } from "mobx-state-tree";
import { UserModel } from "./user";

export const TeamModel = types
  .model("TeamModel")
  .props({
    id: types.identifierNumber,
    name: types.maybeNull(types.string),
    companyId: types.number,
    active: types.boolean,
    teamUserEnablements: types.array(types.frozen()),
    defaultAvatarColor: types.maybeNull(types.string),
    users: types.maybeNull(types.array(UserModel)),
    settings: types.maybeNull(types.frozen()),
    averageWeeklyUserEmotions: types.maybeNull(types.array(types.frozen())),
    averageTeamEmotionScore: types.maybeNull(types.number),
  })
  .views(self => ({
    get teamLeadIds() {
      return self.teamUserEnablements.filter(ue => ue.role == "team_lead").map(ue => ue.userId);
    },
    get nonLeadMemberIds() {
      return self.teamUserEnablements.filter(ue => ue.role != "team_lead").map(ue => ue.userId);
    },
    get allTeamUserIds() {
      return self.teamUserEnablements.map(ue => ue.userId);
    },
    get formattedAverageWeeklyUserEmotions() {
      if (!R.isNil(self.averageWeeklyUserEmotions)) {
        return self.averageWeeklyUserEmotions.map(averages => {
          return { x: new Date(averages.date), y: averages.averageScore };
        });
      } else {
        [];
      }
    },
  }))
  .views(self => ({
    isALead(user) {
      return R.contains(user.id, self.teamLeadIds);
    },
    isANonLead(user) {
      return R.contains(user.id, self.nonLeadMemberIds);
    },
  }))
  .actions(self => ({}));

type TeamModelType = typeof TeamModel.Type;
type TeamModelDataType = typeof TeamModel.CreationType;

export interface ITeam extends TeamModelType {}
export interface ITeamData extends TeamModelDataType {}
