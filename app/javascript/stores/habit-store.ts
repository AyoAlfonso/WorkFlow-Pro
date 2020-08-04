import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "~/lib/with-environment";
import { HabitModel } from "~/models";
import { ApiResponse } from "apisauce";
import { color } from "@storybook/addon-knobs";
import * as moment from "moment";

export const HabitStoreModel = types
  .model("HabitStoreModel")
  .props({
    habits: types.array(HabitModel),
  })
  .extend(withEnvironment())
  .views(self => ({
    get lastFourDays() {
      return [0, 1, 2, 3].map(dayInt => moment().subtract(dayInt, "days"));
    },
  }))
  .actions(self => ({
    createHabit: flow(function*(habitData) {
      const response = yield self.environment.api.createHabit(habitData);
      if (response.ok) {
        self.habits.push(response.data);
      }
    }),
    fetchHabits: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getHabits();
      if (response.ok) {
        self.habits = response.data;
      }
    }),
    updateHabitLog: flow(function*(habitId, logDate) {
      const response = yield self.environment.api.updateHabitLog(habitId, logDate);
      if (response.ok) {
        const habitIndex = self.habits.findIndex(habit => habit.id === response.data.habitId);
        let weekToUpdate = "currentWeekLogs";
        let habitLogIndex = self.habits[habitIndex].currentWeekLogs.findIndex(
          log => log.logDate === response.data.logDate,
        );
        // If log wasn't found in current week then use previous week
        if (habitLogIndex == -1) {
          weekToUpdate = "previousWeekLogs";
          habitLogIndex = self.habits[habitIndex].previousWeekLogs.findIndex(
            log => log.logDate === response.data.logDate,
          );
        }
        const newHabits: Array<any> = [...self.habits];
        newHabits[habitIndex][weekToUpdate][habitLogIndex] = response.data;
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
