import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { KeyActivityModel } from "../models/key-activity";
import { ApiResponse } from "apisauce";
import { localeData } from "moment";

export const KeyActivityStoreModel = types
  .model("KeyActivityStoreModel")
  .props({
    keyActivities: types.array(KeyActivityModel),
  })
  .extend(withEnvironment())
  .views(self => ({
    get weeklyKeyActivities() {
      return self.keyActivities.filter(issue => issue.weeklyList && !issue.completedAt);
    },
    get masterKeyActivities() {
      return self.keyActivities.filter(issue => !issue.weeklyList || issue.completedAt);
    },
  }))
  .actions(self => ({
    fetchKeyActivities: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getKeyActivities();
      if (response.ok) {
        self.keyActivities = response.data;
      }
    }),
    updateKeyActivityStatus: flow(function*(keyActivity, value) {
      const response: ApiResponse<any> = yield self.environment.api.updateKeyActivityStatus(
        keyActivity,
        value,
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
        return true;
      } else {
        return false;
      }
    }),
    updateKeyActivity: flow(function*(id) {
      let keyActivityObject = self.keyActivities.find(ka => ka.id == id);
      const response: ApiResponse<any> = yield self.environment.api.updateKeyActivity(
        keyActivityObject,
      );
      if (response.ok) {
        self.keyActivities = response.data;
        return true;
      } else {
        return false;
      }
    }),
    destroyKeyActivity: flow(function*(id) {
      const response: ApiResponse<any> = yield self.environment.api.destroyKeyActivity(id);
      if (response.ok) {
        self.keyActivities = response.data;
        return true;
      } else {
        return false;
      }
    }),
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
