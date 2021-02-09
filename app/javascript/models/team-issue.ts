import { types } from "mobx-state-tree";
import { IssueModel } from "./issue";

export const TeamIssueModel = types
  .model("TeamIssueModel")
  .props({
    id: types.identifierNumber,
    teamId: types.maybeNull(types.number),
    issueId: types.maybeNull(types.number),
    position: types.maybeNull(types.number),
    completedAt: types.maybeNull(types.string),
    issue: IssueModel,
  })
  .views(self => ({}))
  .actions(self => ({}));

type TeamIssueModelType = typeof TeamIssueModel.Type;
type TeamIssueModelDataType = typeof TeamIssueModel.CreationType;

export interface ITeamIssue extends TeamIssueModelType {}
export interface ITeamIssueData extends TeamIssueModelDataType {}
