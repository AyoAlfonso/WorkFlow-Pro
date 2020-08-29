import { types } from "mobx-state-tree";
import { HabitLogModel } from "./habit-log";
import * as R from "ramda";

export const HabitModel = types
  .model("HabitModel")
  .props({
    color: types.maybeNull(types.string),
    frequency: types.maybeNull(types.number),
    id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    userId: types.maybeNull(types.number),
    currentWeekLogs: types.array(HabitLogModel),
    previousWeekLogs: types.array(HabitLogModel),
    weeklyLogsCompletionDifference: types.maybeNull(types.number),
  })
  .views(self => ({
    get completedCurrentWeekLogs() {
      return self.currentWeekLogs.filter(log => !!log.id);
    },
    get recentLogs() {
      return [...R.reverse(self.currentWeekLogs), ...R.reverse(self.previousWeekLogs)].slice(0, 4);
    },
    get recentLogsFiveDays() {
      return [...R.reverse(self.currentWeekLogs), ...R.reverse(self.previousWeekLogs)].slice(0, 5);
    },
  }))
  .views(self => ({
    get percentageWeeklyLogsCompleted() {
      if (self.frequency == 0) {
        return 0;
      }
      return (self.completedCurrentWeekLogs.length / self.frequency) * 100;
    },
    get completedCount() {
      return self.completedCurrentWeekLogs.length;
    },
  }))
  .actions(self => ({}));

type HabitModelType = typeof HabitModel.Type;
type HabitModelDataType = typeof HabitModel.CreationType;

export interface IHabit extends HabitModelType {}
export interface IHabitData extends HabitModelDataType {}
