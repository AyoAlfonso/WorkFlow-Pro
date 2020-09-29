import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { IssueModel } from "../models/issue";
import { TeamIssueModel } from "../models/team-issue";
import { ApiResponse } from "apisauce";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

export const IssueStoreModel = types
  .model("IssueStoreModel")
  .props({
    issues: types.array(IssueModel),
    teamIssues: types.array(TeamIssueModel),
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
    updateIssueStatus: flow(function*(issue, value, fromTeamMeeting = false) {
      const response: ApiResponse<any> = yield self.environment.api.updateIssueStatus(
        issue,
        value,
        fromTeamMeeting,
      );
      if (response.ok) {
        self.issues = response.data.issues;
        self.teamIssues = response.data.teamIssues;
        return true;
      } else {
        return false;
      }
    }),
    createIssue: flow(function*(issueObject) {
      const response: ApiResponse<any> = yield self.environment.api.createIssue(issueObject);
      if (response.ok) {
        self.issues = response.data.issues;
        self.teamIssues = response.data.teamIssues;
        showToast("Issue created.", ToastMessageConstants.SUCCESS);
        return true;
      } else {
        showToast("There was a problem creating the issue", ToastMessageConstants.ERROR);
        return false;
      }
    }),
    updateIssue: flow(function*(id, fromTeamMeeting = false) {
      let issueObject = self.issues.find(issue => issue.id == id);
      const response: ApiResponse<any> = yield self.environment.api.updateIssue({
        ...issueObject,
        fromTeamMeeting,
      });
      if (response.ok) {
        self.issues = response.data.issues;
        self.teamIssues = response.data.teamIssues;
        return true;
      } else {
        return false;
      }
    }),
    updateIssuePosition: flow(function*(id, newPosition, fromTeamMeeting = false) {
      let issueObject = self.issues.find(issue => issue.id == id);
      const newIssueObject = {
        ...issueObject,
        position: newPosition,
      };
      const response: ApiResponse<any> = yield self.environment.api.updateIssue({
        ...newIssueObject,
        fromTeamMeeting,
      });
      if (response.ok) {
        self.issues = response.data.issues;
        self.teamIssues = response.data.teamIssues;
        return true;
      } else {
        return false;
      }
    }),
    destroyIssue: flow(function*(id, fromTeamMeeting = false) {
      const response: ApiResponse<any> = yield self.environment.api.destroyIssue({
        id,
        fromTeamMeeting,
      });
      if (response.ok) {
        self.issues = response.data.issues;
        self.teamIssues = response.data.teamIssues;
        return true;
      } else {
        return false;
      }
    }),
    fetchIssuesForMeeting: flow(function*(meetingId) {
      const response: ApiResponse<any> = yield self.environment.api.getIssuesForMeeting(meetingId);
      if (response.ok) {
        self.issues = response.data;
        return true;
      } else {
        return false;
      }
    }),
    fetchIssuesForTeam: flow(function*(teamId) {
      const response: ApiResponse<any> = yield self.environment.api.getIssuesForTeam(teamId);
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
    fetchTeamIssues: flow(function*(teamId) {
      const response: ApiResponse<any> = yield self.environment.api.getTeamIssues(teamId);
      if (response.ok) {
        self.teamIssues = response.data;
        return true;
      } else {
        return false;
      }
    }),
    updateTeamIssuePosition: flow(function*(teamIssueId, position) {
      const response: ApiResponse<any> = yield self.environment.api.updateTeamIssuePosition(
        teamIssueId,
        position,
      );
      if (response.ok) {
        self.teamIssues = response.data;
        return true;
      } else {
        return false;
      }
    }),
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
