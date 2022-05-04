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
    weeklyCompletionPercentage: types.maybeNull(types.number),
    weeklyDifference: types.maybeNull(types.number),
    weeklyCompletionFraction: types.maybeNull(types.string),
    score: types.maybeNull(types.number),
    monthlyScoreDifference: types.maybeNull(types.number),
    weeklyScoreDifference: types.maybeNull(types.number),
    scoreDataForLineGraph: types.maybeNull(types.frozen()),
    frequencyDataForBarGraph: types.maybeNull(types.frozen()),
  })
  .views(self => ({
    get completedCurrentWeekLogs() {
      return self.currentWeekLogs.filter(log => !!log.id);
    },
    get recentLogsFourDays() {
      return self.currentWeekLogs.slice(0, 4);
    },
    get recentLogsFewDays() {
      return self.currentWeekLogs;
    },
  }))
  .views(self => ({
    get completedCount() {
      return self.completedCurrentWeekLogs.length;
    },
  }))
  .actions(self => ({}));

type HabitModelType = typeof HabitModel.Type;
type HabitModelDataType = typeof HabitModel.CreationType;

export interface IHabit extends HabitModelType {}
export interface IHabitData extends HabitModelDataType {}
