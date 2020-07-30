import { types } from "mobx-state-tree";
import { HabitLogModel } from "./habit-log";

export const HabitModel = types
  .model("HabitModel")
  .props({
    color: types.maybeNull(types.string),
    frequency: types.maybeNull(types.number),
    id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    userId: types.maybeNull(types.number),
    weeklyLogs: types.array(HabitLogModel),
  })
  .views(self => ({}))
  .actions(self => ({}));

type HabitModelType = typeof HabitModel.Type;
type HabitModelDataType = typeof HabitModel.CreationType;

export interface IHabit extends HabitModelType {}
export interface IHabitData extends HabitModelDataType {}
