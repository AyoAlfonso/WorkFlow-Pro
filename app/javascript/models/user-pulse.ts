import { types } from "mobx-state-tree";

export const UserPulseModel = types
  .model("UserPulseModel")
  .props({
    id: types.identifierNumber,
    userId: types.number,
    score: types.maybeNull(types.number),
    feeling: types.maybeNull(types.string)
  })
  .views(self => ({}))
  .actions(self => ({}));

type UserPulseModelType = typeof UserPulseModel.Type;
type UserPulseModelDataType = typeof UserPulseModel.CreationType;

export interface IUserPulse extends UserPulseModelType {}
export interface IUserPulseData extends UserPulseModelDataType {}
