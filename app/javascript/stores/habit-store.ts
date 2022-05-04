import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "~/lib/with-environment";
import { HabitModel } from "~/models";
import { ApiResponse } from "apisauce";
import * as R from "ramda";
import moment from "moment";
import { ToastMessageConstants } from "~/constants/toast-types";
import { showToast } from "~/utils/toast-message";

export const HabitStoreModel = types
  .model("HabitStoreModel")
  .props({
    habits: types.array(HabitModel),
    habit: types.maybeNull(HabitModel),
    lastFewDays: types.array(types.frozen()),
  })
  .extend(withEnvironment())
  .views(self => ({
    get lastFourDays() {
      return self.lastFewDays.slice(0, 4);
    },
    get lastFiveDays() {
      return self.lastFewDays.slice(0, 5);
    },
    get totalFrequency() {
      return self.habits.reduce((sum, habit) => sum + (habit.frequency || 0), 0);
    },
    get totalCompleted() {
      return self.habits.reduce((sum, habit) => sum + (habit.completedCount || 0), 0);
    },
    get weeklyDifferenceForPersonalMeeting() {
      let differencesPercentage = 0;
      self.habits.forEach(habit => {
        differencesPercentage += habit.weeklyScoreDifference;
      });
      if (self.habits.length == 0) {
        return 0;
      } else {
        return differencesPercentage / self.habits.length;
      }
    },
    get monthlyDifferenceForPersonalMeeting() {
      let differencesPercentage = 0;
      self.habits.forEach(habit => {
        differencesPercentage += habit.monthlyScoreDifference;
      });
      if (self.habits.length == 0) {
        return 0;
      } else {
        return differencesPercentage / self.habits.length;
      }
    },
  }))
  .views(self => ({
    get totalPercentageCompleted() {
      return (self.totalCompleted / self.totalFrequency) * 100;
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
        self.habits = response.data.habits;
        self.lastFewDays = response.data.lastFewDays;
      }
    }),
    fetchHabitsForPersonalPlanning: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getHabitsForPersonalPlanning();
      if (response.ok) {
        self.habits = response.data;
      }
    }),
    updateHabitLog: flow(function*(habitId, logDate) {
      const response = yield self.environment.api.updateHabitLog(habitId, logDate);
      if (response.ok) {
        const habitIndex = self.habits.findIndex(
          habit => habit.id === response.data.habitLog.habitId,
        );
        self.habits[habitIndex] = response.data.habit;
        let habitLogIndex = self.habits[habitIndex].currentWeekLogs.findIndex(
          log => log.logDate === response.data.habitLog.logDate,
        );
        const newHabits: Array<any> = [...self.habits];
        newHabits[habitIndex]["currentWeekLogs"][habitLogIndex] = response.data.habitLog;
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
