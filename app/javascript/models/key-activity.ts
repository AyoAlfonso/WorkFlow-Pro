import { types } from "mobx-state-tree";

export const KeyActivityModel = types
  .model("KeyActivityModel")
  .props({
    id: types.optional(types.number, 0),
    description: types.maybeNull(types.string),
    completedAt: types.maybeNull(types.string),
    priority: types.maybeNull(types.string),
    weeklyList: types.maybeNull(types.boolean),
    meetingId: types.maybeNull(types.number),
  })
  .views(self => ({}))
  .actions(self => ({}));

type KeyActivityModelType = typeof KeyActivityModel.Type;
type KeyActivityModelDataType = typeof KeyActivityModel.CreationType;

export interface IKeyActivity extends KeyActivityModelType {}
export interface IKeyActivityData extends KeyActivityModelDataType {}
