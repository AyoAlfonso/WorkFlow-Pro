import { types } from "mobx-state-tree";

export const IssueModel = types
  .model("IssueModel")
  .props({
    id: types.optional(types.number, 0),
    text: types.maybeNull(types.string),
    completed: types.maybeNull(types.boolean)
  })
  .views(self => ({}))
  .actions(self => ({}));

type IssueModelType = typeof IssueModel.Type;
type IssueModelDataType = typeof IssueModel.CreationType;

export interface IIssue extends IssueModelType {}
export interface IIssueData extends IssueModelDataType {}
