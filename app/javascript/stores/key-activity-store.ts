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
    fetchKeyActivities: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getKeyActivities();
      if (response.ok) {
        self.keyActivities = response.data;
      }
    }),
    updateKeyActivityStatus: flow(function*(id) {
      //THIS IS VERY STUPID -> JUST TESTING IF THE RERENDER WORKS. MAKE A BACK END CALL HERE
      const response = self.keyActivities.filter(keyActivity => keyActivity.id !== id);
      self.keyActivities = response as any;
    }),
  }))
  .actions(self => ({
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
