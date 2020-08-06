import { types } from "mobx-state-tree";

export const TeamModel = types
  .model("TeamModel")
  .props({
    id: types.identifierNumber,
    name: types.maybeNull(types.string),
    companyId: types.number,
  })
  .views(self => ({}))
  .actions(self => ({}));

type TeamModelType = typeof TeamModel.Type;
type TeamModelDataType = typeof TeamModel.CreationType;

export interface ITeam extends TeamModelType {}
export interface ITeamData extends TeamModelDataType {}
