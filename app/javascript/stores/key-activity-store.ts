import { ApiResponse } from "apisauce";
import { flow, types, getRoot } from "mobx-state-tree";
import { ToastMessageConstants } from "~/constants/toast-types";
import { showToast } from "~/utils/toast-message";
import { withEnvironment } from "../lib/with-environment";
import { KeyActivityModel } from "../models/key-activity";

export const KeyActivityStoreModel = types
  .model("KeyActivityStoreModel")
  .props({
    keyActivities: types.array(KeyActivityModel),
    keyActivitiesFromMeeting: types.array(KeyActivityModel),
    loading: types.maybeNull(types.boolean),
    loadingList: types.maybeNull(types.string),
  })
  .extend(withEnvironment())
  .views(self => ({
    keyActivitiesByScheduledGroupName(scheduledGroupName) {
      const { sessionStore: {scheduledGroups} } = getRoot(self);
      const scheduledGroup = scheduledGroups.find(group => group.name == scheduledGroupName);
      const filteredKeyActivities = self.keyActivities.filter(
        keyActivity => keyActivity.scheduledGroupId == scheduledGroup.id,
      );
      return filteredKeyActivities;
    },
    keyActivitiesByTeamId(teamId){
      const filteredKeyActivities = self.keyActivities.filter(
        keyActivity => keyActivity.teamId == teamId,
      );
      return filteredKeyActivities;
    },
    get weeklyKeyActivities() {
      return self.keyActivities.filter(
        keyActivity =>
          keyActivity.weeklyList && !keyActivity.completedAt && !keyActivity.todaysPriority,
      );
    },
    get masterKeyActivities() {
      return self.keyActivities.filter(
        keyActivity =>
          (!keyActivity.weeklyList && !keyActivity.todaysPriority) || keyActivity.completedAt,
      );
    },
    get todaysPriorities() {
      return self.keyActivities.filter(
        keyActivity => keyActivity.todaysPriority && !keyActivity.completedAt,
      );
    },
    get completedToday() {
      const today = new Date();
      return self.keyActivities.filter(
        keyActivity => new Date(keyActivity.completedAt).getDate() === today.getDate(),
      );
    },
  }))
  .actions(self => ({
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
    fetchKeyActivities: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getKeyActivities();
      self.finishLoading();
      if (response.ok) {
        self.keyActivities = response.data;
      }
    }),
    updateKeyActivityStatus: flow(function*(keyActivity, value, fromTeamMeeting = false) {
      const response: ApiResponse<any> = yield self.environment.api.updateKeyActivityStatus(
        keyActivity,
        value,
        fromTeamMeeting,
      );
      if (response.ok) {
        self.keyActivities = response.data;
        return true;
      } else {
        return false;
      }
    }),
    createKeyActivity: flow(function*(keyActivityObject) {
      const response: ApiResponse<any> = yield self.environment.api.createKeyActivity(
        keyActivityObject,
      );
      if (response.ok) {
        self.keyActivities = response.data;
        showToast("Pyn created.", ToastMessageConstants.SUCCESS);
        return true;
      } else {
        showToast("There was a problem creating the pyn.", ToastMessageConstants.ERROR);
        return false;
      }
    }),
    updateKeyActivity: flow(function*(id, fromTeamMeeting = false) {
      let keyActivityObject = self.keyActivities.find(ka => ka.id == id);
      const response: ApiResponse<any> = yield self.environment.api.updateKeyActivity({
        ...keyActivityObject,
        fromTeamMeeting,
      });
      self.finishLoading();
      if (response.ok) {
        self.keyActivities = response.data;
        return true;
      } else {
        return false;
      }
    }),
    destroyKeyActivity: flow(function*(id, fromTeamMeeting = false) {
      const response: ApiResponse<any> = yield self.environment.api.destroyKeyActivity({
        id,
        fromTeamMeeting,
      });
      if (response.ok) {
        self.keyActivities = response.data;
        return true;
      } else {
        return false;
      }
    }),
    resortKeyActivities: flow(function*(sortParams) {
      const response: ApiResponse<any> = yield self.environment.api.resortKeyActivities(sortParams);
      if (response.ok) {
        self.keyActivities = response.data as any;
        return true;
      } else {
        return false;
      }
    }),
  }))
  .actions(self => ({
    fetchKeyActivitiesFromMeeting: flow(function*(meeting_id) {
      const response: ApiResponse<any> = yield self.environment.api.getKeyActivitiesFromMeeting(
        meeting_id,
      );
      if (response.ok) {
        self.keyActivities = response.data;
        return true;
      } else {
        return false;
      }
    }),
    updateLabel: flow(function*(keyActivityId, labelName){
      const response: ApiResponse<any> = yield self.environment.api.updateKeyActivity({
        id: keyActivityId,
        labelList: labelName
      });

      self.finishLoading();
      if (response.ok) {
        self.keyActivities = response.data;
        return true;
      } else {
        return false;
      }
    })
  }))
  .actions(self => ({
    updateKeyActivityState(id, field, value) {
      let keyActivities = self.keyActivities;
      let keyActivityIndex = keyActivities.findIndex(ka => ka.id == id);
      keyActivities[keyActivityIndex][field] = value;
      self.keyActivities = keyActivities;
    },
    reset() {
      self.keyActivities = [] as any;
    },
  }))
  .actions(self => ({
    load: flow(function*() {
      self.reset();
      yield self.fetchKeyActivities();
    }),
  }));

type KeyActivityStoreType = typeof KeyActivityStoreModel.Type;
export interface IKeyActivityStore extends KeyActivityStoreType {
  keyActivities: any;
}
