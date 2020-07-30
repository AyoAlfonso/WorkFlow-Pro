import { types } from "mobx-state-tree";

export const HabitLogModel = types
  .model("HabitLogModel")
  .props({
    id: types.maybeNull(types.number),
    habitId: types.number,
    logDate: types.string,
  })
  .views(self => ({}))
  .actions(self => ({}));

type HabitLogModelType = typeof HabitLogModel.Type;
type HabitLogModelDataType = typeof HabitLogModel.CreationType;

export interface IHabitLog extends HabitLogModelType {}
export interface IHabitLogData extends HabitLogModelDataType {}
