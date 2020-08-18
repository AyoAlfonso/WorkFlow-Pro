import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { IssueModel } from "../models/issue";
import { ApiResponse } from "apisauce";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

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
    fetchIssues: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getIssues();
      if (response.ok) {
        self.issues = response.data;
      }
    }),
    updateIssueStatus: flow(function*(issue, value) {
      const response: ApiResponse<any> = yield self.environment.api.updateIssueStatus(issue, value);
      if (response.ok) {
        self.issues = response.data;
        return true;
      } else {
        return false;
      }
    }),
    createIssue: flow(function*(issueObject) {
      const response: ApiResponse<any> = yield self.environment.api.createIssue(issueObject);
      if (response.ok) {
        self.issues = response.data;
        showToast("Issue created.", ToastMessageConstants.SUCCESS);
        return true;
      } else {
        showToast("There was a problem creating the issue", ToastMessageConstants.ERROR);
        return false;
      }
    }),
    updateIssue: flow(function*(id) {
      let issueObject = self.issues.find(issue => issue.id == id);
      const response: ApiResponse<any> = yield self.environment.api.updateIssue(issueObject);
      if (response.ok) {
        self.issues = response.data;
        return true;
      } else {
        return false;
      }
    }),
    destroyIssue: flow(function*(id) {
      const response: ApiResponse<any> = yield self.environment.api.destroyIssue(id);
      if (response.ok) {
        self.issues = response.data;
        return true;
      } else {
        return false;
      }
    }),
  }))
  .actions(self => ({
    updateIssueState(id, field, value) {
      let issues = self.issues;
      let issueIndex = issues.findIndex(issue => issue.id == id);
      issues[issueIndex][field] = value;
      self.issues = issues;
    },
    reset() {
      self.issues = [] as any;
    },
  }))
  .actions(self => ({
    load: flow(function*() {
      self.reset();
      yield self.fetchIssues();
    }),
  }));

type IssueStoreType = typeof IssueStoreModel.Type;
export interface IIssueStore extends IssueStoreType {
  issues: any;
}
