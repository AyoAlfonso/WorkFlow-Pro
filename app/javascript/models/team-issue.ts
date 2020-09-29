import { types } from "mobx-state-tree";

export const TeamIssueModel = types
  .model("TeamIssueModel")
  .props({
    id: types.identifierNumber,
    teamId: types.maybeNull(types.number),
    issueId: types.maybeNull(types.number),
    position: types.maybeNull(types.number),
    completedAt: types.maybeNull(types.string),
  })
  .views(self => ({}))
  .actions(self => ({}));

type TeamIssueModelType = typeof TeamIssueModel.Type;
type TeamIssueModelDataType = typeof TeamIssueModel.CreationType;

export interface IIssue extends TeamIssueModelType {}
export interface IIssueData extends TeamIssueModelDataType {}
