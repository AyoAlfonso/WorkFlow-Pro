import { types } from "mobx-state-tree";

export const HabitModel = types
  .model("HabitModel")
  .props({
    id: types.maybeNull(types.number),
    color: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    frequency: types.maybeNull(types.number),
    userId: types.maybeNull(types.number),
  })
  .views(self => ({}))
  .actions(self => ({}));

type HabitModelType = typeof HabitModel.Type;
type HabitModelDataType = typeof HabitModel.CreationType;

export interface IHabit extends HabitModelType {}
export interface IHabitData extends HabitModelDataType {}
