import { types } from "mobx-state-tree";
import { LabelModel } from "./";

export const IssueModel = types
  .model("IssueModel")
  .props({
    id: types.optional(types.number, 0),
    description: types.maybeNull(types.string),
    priority: types.maybeNull(types.string),
    completedAt: types.maybeNull(types.string),
    teamId: types.maybeNull(types.number),
    user: types.maybeNull(types.frozen()),
    position: types.maybeNull(types.number),
    labels: types.maybeNull(types.array(LabelModel)),
  })
  .views(self => ({}))
  .actions(self => ({}));

type IssueModelType = typeof IssueModel.Type;
type IssueModelDataType = typeof IssueModel.CreationType;

export interface IIssue extends IssueModelType {}
export interface IIssueData extends IssueModelDataType {}
