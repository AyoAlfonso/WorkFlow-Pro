import { types } from "mobx-state-tree";
import { UserModel } from "~/models/user";

export const KeyActivityModel = types
  .model("KeyActivityModel")
  .props({
    id: types.optional(types.number, 0),
    description: types.maybeNull(types.string),
    completedAt: types.maybeNull(types.string),
    priority: types.maybeNull(types.string),
    weeklyList: types.maybeNull(types.boolean),
    meetingId: types.maybeNull(types.number),
    position: types.maybeNull(types.number),
    user: types.maybeNull(types.frozen()),
    todaysPriority: types.maybeNull(types.boolean),
  })
  .views(self => ({}))
  .actions(self => ({}));

type KeyActivityModelType = typeof KeyActivityModel.Type;
type KeyActivityModelDataType = typeof KeyActivityModel.CreationType;

export interface IKeyActivity extends KeyActivityModelType {}
export interface IKeyActivityData extends KeyActivityModelDataType {}
