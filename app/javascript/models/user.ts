import { types } from "mobx-state-tree";

export const UserModel = types
  .model("UserModel")
  .props({
    id: types.identifierNumber,
    email: types.maybeNull(types.string),
    firstName: types.maybeNull(types.string),
    lastName: types.maybeNull(types.string),
    personalVision: types.maybeNull(types.string),
    avatarUrl: types.maybeNull(types.string),
    //add avatarurl2x
  })
  .views(self => ({}))
  .actions(self => ({}));

type UserModelType = typeof UserModel.Type;
type UserModelDataType = typeof UserModel.CreationType;

export interface IUser extends UserModelType {}
export interface IUserData extends UserModelDataType {}
