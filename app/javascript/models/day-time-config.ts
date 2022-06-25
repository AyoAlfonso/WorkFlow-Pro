import { types } from "mobx-state-tree";

export const DayTimeConfigModel = types.model("DayTimeConfigModel").props({
  day: types.string,
  time: types.string,
  date: types.string,
  cadence: types.string,
});
