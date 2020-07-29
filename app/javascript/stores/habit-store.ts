import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "~/lib/with-environment";
import { HabitModel } from "~/models";
import { ApiResponse } from "apisauce";

export const HabitStoreModel = types
  .model("HabitStoreModel")
  .props({
    habits: types.array(HabitModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    fetchHabits: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getHabits();
      console.log(response);
      if (response.ok) {
        self.habits = response.data;
      }
    }),
    // updateIssueStatus: flow(function*(issue, value) {
    //   const response: ApiResponse<any> = yield self.environment.api.updateIssueStatus(issue, value);
    //   if (response.ok) {
    //     self.issues = response.data;
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }),
    // createIssue: flow(function*(issueObject) {
    //   const response: ApiResponse<any> = yield self.environment.api.createIssue(issueObject);
    //   if (response.ok) {
    //     self.issues = response.data;
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }),
  }))
  .actions(self => ({
    // reset() {
    //   self.issues = [] as any;
    // },
  }))
  .actions(self => ({
    // load: flow(function*() {
    //   self.reset();
    //   yield self.fetchIssues();
  }));

type HabitStoreType = typeof HabitStoreModel.Type;
export interface IHabitStore extends HabitStoreType {}
