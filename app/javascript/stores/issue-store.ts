import * as R from "ramda";
import { types, flow, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { IssueModel } from "../models/issue";
import { TeamIssueModel } from "../models/team-issue";
import { ApiResponse } from "apisauce";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { CommentLogModel } from "~/models/comment-logs";

export const IssueStoreModel = types
  .model("IssueStoreModel")
  .props({
    issues: types.array(IssueModel),
    teamIssues: types.array(TeamIssueModel),
    meetingTeamIssues: types.array(IssueModel),
    teamOverviewIssues: types.array(IssueModel),
    loading: types.maybeNull(types.boolean),
    commentLogs: types.maybeNull(types.array(CommentLogModel)),
  })
  .extend(withEnvironment())
  .views(self => ({
    get openIssues() {
      return self.issues.filter(issue => issue.completedAt === null);
    },
    get closedIssues() {
      return self.issues.filter(issue => issue.completedAt !== null);
    },
    get openTeamIssues() {
      return self.teamIssues.filter(teamIssue => teamIssue.completedAt === null);
    },
    get closedTeamIssues() {
      return self.teamIssues.filter(teamIssue => teamIssue.completedAt !== null);
    },
    get meetingTeamIssueIds() {
      return self.meetingTeamIssues.map(issue => issue.id);
    },
    get personalIssues() {
      return self.issues.filter(issue => issue.personal);
    },
  }))
  .views(self => ({
    get openMeetingParkingLotTeamIssues() {
      return self.teamIssues.filter(
        teamIssue =>
          !R.includes(teamIssue.issueId, self.meetingTeamIssueIds) && teamIssue.completedAt == null,
      );
    },
    get closedMeetingParkingLotTeamIssues() {
      return self.teamIssues.filter(
        teamIssue =>
          !R.includes(teamIssue.issueId, self.meetingTeamIssueIds) &&
          teamIssue.completedAt !== null,
      );
    },
    get openMeetingScheduledTeamIssues() {
      return self.teamIssues.filter(
        teamIssue =>
          R.includes(teamIssue.issueId, self.meetingTeamIssueIds) && teamIssue.completedAt == null,
      );
    },
    get closedMeetingScheduledTeamIssues() {
      return self.teamIssues.filter(
        teamIssue =>
          R.includes(teamIssue.issueId, self.meetingTeamIssueIds) && teamIssue.completedAt !== null,
      );
    },
  }))
  .actions(self => ({
    fetchIssues: flow(function*() {
      self.loading = true;
      const response: ApiResponse<any> = yield self.environment.api.getIssues();
      if (response.ok) {
        self.issues = response.data;
        self.loading = false;
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
      const { companyStore } = getRoot(self);
      const itemName = companyStore.company.displayFormat == "Forum" ? "Topic" : "Issue";
      const response: ApiResponse<any> = yield self.environment.api.createIssue(issueObject);
      if (response.ok) {
        self.issues = response.data.issues;
        self.teamIssues = response.data.teamIssues;
        self.meetingTeamIssues = response.data.meetingTeamIssues;
        showToast(`${itemName} created.`, ToastMessageConstants.SUCCESS);
        return true;
      } else {
        showToast(`There was a problem creating the ${itemName}`, ToastMessageConstants.ERROR);
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
        if (self.teamIssues.length && !response.data.teamIssues.length) {
          return;
        } else {
          self.teamIssues = response.data.teamIssues;
        }
        return true;
      } else {
        return false;
      }
    }),
    upvoteIssue: flow(function*(id) {
      const response: ApiResponse<any> = yield self.environment.api.upvoteIssue(id);
      if (response.ok) {
        const updatedIssue = self.issues.findIndex(issue => issue.id == id);
        self.issues[updatedIssue] = response.data;
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
    duplicateIssue: flow(function*(id) {
      const response: ApiResponse<any> = yield self.environment.api.duplicateIssue(id);
      if (response.ok) {
        self.issues = [...self.issues, response.data] as any;
        showToast(`Issue Duplicated Successfully`, ToastMessageConstants.SUCCESS);
        return true;
      } else {
        showToast(`Something Went Wrong`, ToastMessageConstants.ERROR);
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
    createCommentLog: flow(function*(log) {
      try {
        const response: any = yield self.environment.api.createCommentLog(log);
        if (response.ok) {
          self.commentLogs = [...self.commentLogs, response.data.commentLog] as any;
          return true;
        }
      } catch (error) {
        showToast(`Something Went Wrong, Please try again`, ToastMessageConstants.ERROR);
        return false;
      }
    }),
    getCommentLogs: flow(function*(page, type, id) {
      try {
        self.commentLogs = null;
        const response: ApiResponse<any> = yield self.environment.api.getCommentLogs(
          page,
          type,
          id,
        );
        if (response.ok) {
          self.commentLogs = response.data.commentLog;
          return response.data.meta;
        }
      } catch (error) {
        showToast(`Something went wrong while fetching Comment Logs`, ToastMessageConstants.ERROR);
        return false;
      }
    }),
    deleteCommentLog: flow(function*(id) {
      try {
        const response: any = yield self.environment.api.deleteCommentLog(id);
        if (response.ok) {
          const updatedLogs = self.commentLogs.filter(
            log => log.id !== response.data.commentLog.id,
          );
          self.commentLogs = updatedLogs as any;
          showToast("Comment Deleted", ToastMessageConstants.SUCCESS);
          return true;
        }
      } catch (error) {
        showToast(
          `Something went wrong while deleting comment, please try again`,
          ToastMessageConstants.ERROR,
        );
        return false;
      }
    }),
    fetchIssuesForMeeting: flow(function*(meetingId) {
      self.loading = true;
      const response: ApiResponse<any> = yield self.environment.api.getIssuesForMeeting(meetingId);
      if (response.ok) {
        self.issues = response.data.issues;
        self.teamIssues = response.data.teamIssues;
        self.loading = false;
        return true;
      } else {
        return false;
      }
    }),
    fetchIssuesForTeam: flow(function*(teamId) {
      self.loading = true;
      const response: ApiResponse<any> = yield self.environment.api.getIssuesForTeam(teamId);
      if (response.ok) {
        self.issues = response.data.issues;
        self.loading = false;
        return true;
      } else {
        return false;
      }
    }),
    fetchIssuesForTeamOverview: flow(function*(teamId) {
      self.loading = true;
      const response: ApiResponse<any> = yield self.environment.api.getIssuesForTeam(teamId);
      if (response.ok) {
        self.teamOverviewIssues = response.data.issues;
        self.loading = false;
        return true;
      } else {
        return false;
      }
    }),
    fetchTeamIssueMeetingEnablements: flow(function*(meetingId) {
      const response: ApiResponse<any> = yield self.environment.api.getTeamIssueMeetingEnablements(
        meetingId,
      );
      if (response.ok) {
        self.meetingTeamIssues = response.data;
        return true;
      } else {
        return false;
      }
    }),
  }))
  .actions(self => ({
    updateIssueState(id, field, value) {
      const issues = self.issues;
      const issueIndex = issues.findIndex(issue => issue.id == id);
      issues[issueIndex][field] = value;
      self.issues = issues;
    },
    reset() {
      self.issues = [] as any;
    },
  }))
  .actions(self => ({
    fetchTeamIssues: flow(function*(teamId) {
      self.loading = true;
      const response: ApiResponse<any> = yield self.environment.api.getTeamIssues(teamId);
      if (response.ok) {
        self.teamIssues = response.data;
        self.loading = false;
        return true;
      } else {
        return false;
      }
    }),
    updateTeamIssuePosition: flow(function*(teamIssueId, position, options = {}) {
      //TODO: refactor out fromTeamMeeting completely from all flows
      const response: ApiResponse<any> = yield self.environment.api.updateTeamIssuePosition(
        teamIssueId,
        Object.assign({ position }, options),
      );
      if (response.ok) {
        self.teamIssues = response.data.teamIssues;
        self.meetingTeamIssues = response.data.meetingTeamIssues;
        return true;
      } else {
        return false;
      }
    }),
    updateLabel: flow(function*(issueId, labelId, fromTeamMeeting = false) {
      const response: ApiResponse<any> = yield self.environment.api.updateIssue({
        id: issueId,
        labelList: labelId,
        fromTeamMeeting: fromTeamMeeting,
      });

      if (response.ok) {
        self.issues = response.data.issues;
        self.teamIssues = response.data.teamIssues;
        return true;
      } else {
        return false;
      }
    }),
  }))
  .actions(self => ({
    sortIssues: flow(function*(sortParams) {
      const response: ApiResponse<any> = yield self.environment.api.resortIssues(sortParams);
      if (response.ok) {
        self.issues = response.data.issues as any;
        self.teamIssues = response.data.teamIssues as any;
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
