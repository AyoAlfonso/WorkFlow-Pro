import { ApiResponse } from "apisauce";
import { flow, types, getRoot } from "mobx-state-tree";
import { ToastMessageConstants } from "~/constants/toast-types";
import { showToast } from "~/utils/toast-message";
import { withEnvironment } from "../lib/with-environment";
import { KeyActivityModel } from "../models/key-activity";
import * as R from "ramda";
import { CommentLogModel } from "~/models/comment-logs";
import { toJS } from "mobx";

export const KeyActivityStoreModel = types
  .model("KeyActivityStoreModel")
  .props({
    incompleteKeyActivities: types.array(KeyActivityModel),
    completedKeyActivities: types.array(KeyActivityModel),
    keyActivitiesFromMeeting: types.array(KeyActivityModel),
    keyActivitiesForOnboarding: types.array(KeyActivityModel),
    commentLogs: types.maybeNull(types.array(CommentLogModel)),
    loading: types.maybeNull(types.boolean),
    loadingList: types.maybeNull(types.string),
  })
  .extend(withEnvironment())
  .views(self => ({
    filterKeyActivitiesByScheduledGroupName(scheduledGroupName, completed) {
      let keyActivitiesForFiltering = completed
        ? self.completedKeyActivities
        : self.incompleteKeyActivities;
      const {
        sessionStore: { scheduledGroups },
      } = getRoot(self);
      const scheduledGroup = scheduledGroups.find(group => group.name == scheduledGroupName);

      const filteredKeyActivities =
        scheduledGroupName == "Backlog"
          ? keyActivitiesForFiltering.filter(
              keyActivity =>
                keyActivity.scheduledGroupId == scheduledGroup.id && !keyActivity.completedAt,
            )
          : keyActivitiesForFiltering.filter(
              keyActivity => keyActivity.scheduledGroupId == scheduledGroup.id,
            );
      return filteredKeyActivities;
    },
  }))
  .views(self => ({
    incompleteKeyActivitiesByScheduledGroupName(scheduledGroupName) {
      return self.filterKeyActivitiesByScheduledGroupName(scheduledGroupName, false);
    },
    completedKeyActivitiesByScheduledGroupName(scheduledGroupName) {
      return self.filterKeyActivitiesByScheduledGroupName(scheduledGroupName, true);
    },
    incompleteKeyActivitiesByTeamId(teamId) {
      const filteredKeyActivities = self.incompleteKeyActivities.filter(
        keyActivity => keyActivity.teamId == teamId,
      );
      return filteredKeyActivities;
    },
  }))
  .views(self => ({
    get completedActivities() {
      const sortByCompletedAt = (a, b) => {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      };
      return R.sort(sortByCompletedAt, self.completedKeyActivities);
    },
    get completedToday() {
      const today = new Date().getDate();
      return self.completedKeyActivities.filter(
        keyActivity => new Date(keyActivity.completedAt).getDate() === today,
      );
    },
    get completedYesterday() {
      const today = new Date().getDate();
      const yesterday = today - 1;
      return self.completedKeyActivities.filter(
        keyActivity =>
          new Date(keyActivity.completedAt).getDate() === yesterday ||
          (!R.isNil(keyActivity.completedAt) &&
            new Date(keyActivity.movedToTodayOn).getDate() < today),
      );
    },
  }))
  .views(self => ({
    get nextActivities() {
      return self
        .incompleteKeyActivitiesByScheduledGroupName("Tomorrow")
        .concat(self.incompleteKeyActivitiesByScheduledGroupName("Weekly List"));
    },
    get tomorrowKeyActivities() {
      return self.incompleteKeyActivitiesByScheduledGroupName("Tomorrow");
    },
    get weeklyKeyActivities() {
      return self.incompleteKeyActivitiesByScheduledGroupName("Weekly List");
    },
    get incompleteMasterKeyActivities() {
      return self.incompleteKeyActivitiesByScheduledGroupName("Backlog");
    },
    get completedMasterKeyActivities() {
      return self.completedKeyActivitiesByScheduledGroupName("Backlog");
    },
    get todaysPriorities() {
      return self.incompleteKeyActivitiesByScheduledGroupName("Today");
    },
  }))
  .views(self => ({
    get todaysPrioritiesFromPreviousDays() {
      const today = new Date().getDate();
      return self.todaysPriorities.filter(
        keyActivity => new Date(keyActivity.movedToTodayOn).getDate() < today,
      );
    },
  }))
  .actions(self => ({
    reset() {
      self.incompleteKeyActivities = [] as any;
      self.completedKeyActivities = [] as any;
    },
    startLoading(loadingList = null) {
      self.loading = true;
      self.loadingList = loadingList;
    },
    finishLoading() {
      self.loading = false;
      self.loadingList = null;
    },
  }))
  .actions(self => ({
    fetchIncompleteKeyActivities: flow(function*() {
      self.loading = true;
      const response: ApiResponse<any> = yield self.environment.api.getKeyActivities(false);
      self.finishLoading();
      if (response.ok) {
        self.incompleteKeyActivities = response.data;
        self.loading = false;
      }
    }),
    duplicateKeyActivity: flow(function*(id) {
      const response: ApiResponse<any> = yield self.environment.api.duplicateKeyActivity(id);

      if (response.ok) {
        self.incompleteKeyActivities = [...self.incompleteKeyActivities, response.data] as any;

        showToast(`ToDo Duplicated Successfully`, ToastMessageConstants.SUCCESS);

        return true;
      } else {
        showToast(`Something Went Wrong`, ToastMessageConstants.ERROR);

        return false;
      }
    }),
    fetchCompleteKeyActivities: flow(function*() {
      self.loading = true;
      const response: ApiResponse<any> = yield self.environment.api.getKeyActivities(true);
      self.finishLoading();
      if (response.ok) {
        self.completedKeyActivities = response.data;
        self.loading = false;
      }
    }),
    updateKeyActivityStatus: flow(function*(keyActivity, value, fromTeamMeeting = false) {
      const response: ApiResponse<any> = yield self.environment.api.updateKeyActivityStatus(
        keyActivity,
        value,
        fromTeamMeeting,
      );
      self.loading = true;
      if (response.ok) {
        const { createdFor, keyActivities, completedList } = response.data;
        if (createdFor == "meeting") {
          self.keyActivitiesFromMeeting = keyActivities;
        } else {
          if (completedList) {
            self.completedKeyActivities = keyActivities;
          } else {
            self.incompleteKeyActivities = keyActivities;
          }
        }
        self.finishLoading();
        return true;
      } else {
        self.finishLoading();
        return false;
      }
    }),
    createKeyActivity: flow(function*(keyActivityObject) {
      const response: ApiResponse<any> = yield self.environment.api.createKeyActivity(
        keyActivityObject,
      );
      if (response.ok) {
        const { createdFor, keyActivities } = response.data;

        if (createdFor == "onboarding") {
          self.keyActivitiesForOnboarding = keyActivities;
        } else if (createdFor == "meeting") {
          self.keyActivitiesFromMeeting = keyActivities;
        } else {
          self.incompleteKeyActivities = keyActivities;
        }

        showToast("ToDo created.", ToastMessageConstants.SUCCESS);
        return true;
      } else {
        showToast("There was a problem creating the ToDo.", ToastMessageConstants.ERROR);
        return false;
      }
    }),
    updateKeyActivity: flow(function*(id, fromTeamMeeting = false) {
      let keyActivityObject = self.incompleteKeyActivities.find(ka => ka.id === id);
      if (!keyActivityObject) {
        keyActivityObject = self.completedKeyActivities.find(ka => ka.id === id);
      }

      const response: ApiResponse<any> = yield self.environment.api.updateKeyActivity({
        ...keyActivityObject,
        fromTeamMeeting,
      });
      self.loading = true;

      if (response.ok) {
        const { createdFor, keyActivities, completedList } = response.data;
        if (createdFor == "meeting") {
          self.keyActivitiesFromMeeting = keyActivities;
        } else {
          if (completedList) {
            self.completedKeyActivities = keyActivities;
          } else {
            self.incompleteKeyActivities = keyActivities;
          }
        }
        self.finishLoading();
        return true;
      } else {
        self.finishLoading();
        return false;
      }
    }),
    destroyKeyActivity: flow(function*(id, fromTeamMeeting = false) {
      const response: ApiResponse<any> = yield self.environment.api.destroyKeyActivity({
        id,
        fromTeamMeeting,
      });
      if (response.ok) {
        const { completedList, keyActivities } = response.data;
        if (fromTeamMeeting) {
          self.keyActivitiesFromMeeting = keyActivities;
        } else {
          if (completedList) {
            self.completedKeyActivities = keyActivities;
          } else {
            self.incompleteKeyActivities = keyActivities;
          }
        }
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
    resortKeyActivities: flow(function*(sortParams) {
      const response: ApiResponse<any> = yield self.environment.api.resortKeyActivities(sortParams);
      if (response.ok) {
        self.incompleteKeyActivities = response.data as any;
        return true;
      } else {
        return false;
      }
    }),
    markAllYesterdayDone: flow(function*() {
      const kaIdsToUpdate = self.todaysPrioritiesFromPreviousDays.map(ka => ka.id).join(",");

      const response: ApiResponse<any> = yield self.environment.api.updateKeyActivitiesToComplete(
        kaIdsToUpdate,
      );
      if (response.ok) {
        self.incompleteKeyActivities = response.data as any;
        return true;
      } else {
        return false;
      }
    }),
  }))
  .actions(self => ({
    fetchAllKeyActivities() {
      self.fetchCompleteKeyActivities();
      self.fetchIncompleteKeyActivities();
    },
    fetchKeyActivitiesFromMeeting: flow(function*(meeting_id) {
      const response: ApiResponse<any> = yield self.environment.api.getKeyActivitiesFromMeeting(
        meeting_id,
      );
      if (response.ok) {
        self.keyActivitiesFromMeeting = response.data;
        return true;
      } else {
        return false;
      }
    }),
    updateLabel: flow(function*(keyActivityId, labelId) {
      const response: ApiResponse<any> = yield self.environment.api.updateKeyActivity({
        id: keyActivityId,
        labelList: labelId,
      });

      self.finishLoading();
      if (response.ok) {
        self.incompleteKeyActivities = response.data.keyActivities;
        return true;
      } else {
        return false;
      }
    }),
    updateKeyActivityState(id, field, value) {
      let keyActivities = self.incompleteKeyActivities;
      // we're trying to find where the key activity is in the store.
      // there are 3 different key activity lists, and the key activity can be in any of them
      // since we're updating the local state, we'll need to find where the key activity is stored in the store
      let keyActivityIndex = keyActivities.findIndex(ka => ka.id == id);
      if (keyActivityIndex == -1) {
        keyActivities = self.completedKeyActivities;
        keyActivityIndex = keyActivities.findIndex(ka => ka.id == id);
        if (keyActivityIndex == -1) {
          keyActivities = self.keyActivitiesFromMeeting;
          keyActivityIndex = keyActivities.findIndex(ka => ka.id == id);
          keyActivities[keyActivityIndex][field] = value;
          self.keyActivitiesFromMeeting = keyActivities;
        } else {
          keyActivities[keyActivityIndex][field] = value;
          self.completedKeyActivities = keyActivities;
        }
      } else {
        keyActivities[keyActivityIndex][field] = value;
        self.incompleteKeyActivities = keyActivities;
      }
    },
  }))
  .actions(self => ({
    load: flow(function*() {
      self.reset();
      yield self.fetchIncompleteKeyActivities();
    }),
  }));

type KeyActivityStoreType = typeof KeyActivityStoreModel.Type;
export interface IKeyActivityStore extends KeyActivityStoreType {
  keyActivities: any;
}
