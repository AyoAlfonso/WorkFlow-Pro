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
    executive: types.maybeNull(types.number),
    averageWeeklyUserEmotions: types.maybeNull(types.frozen()),
    averageTeamEmotionScore: types.maybeNull(types.number),
    customScorecard: types.maybeNull(types.boolean),
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
    get teamManager() {
      return self.teamUserEnablements.filter(ue => ue.teamManager === true);
    },
    get formattedAverageWeeklyUserEmotions() {
      if (!R.isNil(self.averageWeeklyUserEmotions)) {
        return self.averageWeeklyUserEmotions["emotionScores"].map((averages, index) => {
          return {
            x: self.averageWeeklyUserEmotions["recordDates"][index],
            y: averages.averageScore,
          };
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
    isAMember(user) {
      return R.contains(user.id, self.allTeamUserIds);
    },
  }))
  .actions(self => ({}));

type TeamModelType = typeof TeamModel.Type;
type TeamModelDataType = typeof TeamModel.CreationType;

export interface ITeam extends TeamModelType {}
export interface ITeamData extends TeamModelDataType {}
