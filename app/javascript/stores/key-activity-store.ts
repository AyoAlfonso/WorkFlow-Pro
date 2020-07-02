import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { KeyActivityModel } from "../models/key-activity";
import { ApiResponse } from "apisauce";

export const KeyActivityStoreModel = types
  .model("KeyActivityStoreModel")
  .props({
    keyActivities: types.array(KeyActivityModel),
  })
  .extend(withEnvironment())
  .views(self => ({
    get weeklyKeyActivities() {
      return self.keyActivities.filter(issue => issue.weeklyList == true);
    },
    get masterKeyActivities() {
      return self.keyActivities;
    },
  }))
  .actions(self => ({
    fetchKeyActivities: flow(function* () {
      const response: ApiResponse<any> = yield self.environment.api.getKeyActivities();
      if (response.ok) {
        self.keyActivities = response.data;
      }
    }),
    updateKeyActivityStatus: flow(function* (keyActivity, value) {
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
    createKeyActivity: flow(function* (keyActivityObject) {
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
  }))
  .actions(self => ({
    reset() {
      self.keyActivities = [] as any;
    },
  }))
  .actions(self => ({
    load: flow(function* () {
      self.reset();
      yield self.fetchKeyActivities();
    }),
  }));

type KeyActivityStoreType = typeof KeyActivityStoreModel.Type;
export interface IKeyActivityStore extends KeyActivityStoreType {
  keyActivities: any;
}
