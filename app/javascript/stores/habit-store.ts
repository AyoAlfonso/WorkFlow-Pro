import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "~/lib/with-environment";
import { HabitModel } from "~/models";
import { ApiResponse } from "apisauce";
import * as R from "ramda";
import * as moment from "moment";
import { ToastMessageConstants } from "~/constants/toast-types";
import { showToast } from "~/utils/toast-message";

export const HabitStoreModel = types
  .model("HabitStoreModel")
  .props({
    habits: types.array(HabitModel),
    habit: types.maybeNull(HabitModel),
  })
  .extend(withEnvironment())
  .views(self => ({
    get lastFourDays() {
      return [0, 1, 2, 3].map(dayInt => moment().subtract(dayInt, "days"));
    },
    get lastFiveDays() {
      return [0, 1, 2, 3, 4].map(dayInt => moment().subtract(dayInt, "days"));
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
    getHabit: flow(function*(id) {
      const response = yield self.environment.api.getHabit(id);
      if (response.ok) {
        self.habit = response.data;
        return response.data;
      }
    }),
    updateCurrentHabit: flow(function*() {
      const response = yield self.environment.api.updateHabit(self.habit);
      if (response.ok) {
        const modifiedHabitIndex = self.habits.findIndex(habit => habit.id == self.habit.id);
        self.habits[modifiedHabitIndex] = response.data;
      }
    }),
    deleteHabit: flow(function*() {
      const response = yield self.environment.api.deleteHabit(self.habit.id);
      if (response.ok) {
        const updatedHabits = R.filter(habit => habit.id != self.habit.id, self.habits);
        self.habits = updatedHabits;
        showToast("Habit deleted", ToastMessageConstants.SUCCESS);
      }
    }),
  }))
  .actions(self => ({
    updateHabitField(field, value) {
      self.habit[field] = value;
    },
  }));

type HabitStoreType = typeof HabitStoreModel.Type;
export interface IHabitStore extends HabitStoreType {}
