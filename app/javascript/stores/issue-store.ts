import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { IssueModel } from "../models/issue";
import { ApiResponse } from "apisauce";

export const IssueStoreModel = types
  .model("IssueStoreModel")
  .props({
    issues: types.array(IssueModel),
  })
  .extend(withEnvironment())
  .views(self => ({
    get openIssues() {
      return self.issues.filter(issue => issue.completedAt == null);
    },
    get closedIssues() {
      return self.issues.filter(issue => issue.completedAt != null);
    },
  }))
  .actions(self => ({
    fetchIssues: flow(function* () {
      const response: ApiResponse<any> = yield self.environment.api.getIssues();
      if (response.ok) {
        self.issues = response.data;
      }
    }),
    updateIssueStatus: flow(function* (issue, value) {
      const response: ApiResponse<any> = yield self.environment.api.updateIssueStatus(issue, value);
      if (response.ok) {
        self.issues = response.data;
        return true;
      } else {
        return false;
      }
    }),
    createIssue: flow(function* (issueObject) {
      const response: ApiResponse<any> = yield self.environment.api.createIssue(issueObject);
      if (response.ok) {
        self.issues = response.data;
        return true;
      } else {
        return false;
      }
    }),
  }))
  .actions(self => ({
    reset() {
      self.issues = [] as any;
    },
  }))
  .actions(self => ({
    load: flow(function* () {
      self.reset();
      yield self.fetchIssues();
    }),
  }));

type IssueStoreType = typeof IssueStoreModel.Type;
export interface IIssueStore extends IssueStoreType {
  issues: any;
}
