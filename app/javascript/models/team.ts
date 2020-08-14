import { types } from "mobx-state-tree";

export const TeamModel = types
  .model("TeamModel")
  .props({
    id: types.identifierNumber,
    name: types.maybeNull(types.string),
    companyId: types.number,
    active: types.boolean,
    teamUserEnablements: types.array(types.frozen()),
  })
  .views(self => ({
    get teamLeadIds() {
      return self.teamUserEnablements.filter(ue => ue.role == "team_lead").map(ue => ue.userId);
    },
    get nonLeadMemberIds() {
      return self.teamUserEnablements.filter(ue => ue.role != "team_lead").map(ue => ue.userId);
    },
  }))
  .actions(self => ({}));

type TeamModelType = typeof TeamModel.Type;
type TeamModelDataType = typeof TeamModel.CreationType;

export interface ITeam extends TeamModelType {}
export interface ITeamData extends TeamModelDataType {}
