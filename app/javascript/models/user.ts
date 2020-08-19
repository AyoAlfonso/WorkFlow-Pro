import { types } from "mobx-state-tree";
import { DailyLogModel } from "~/models";
import * as R from "ramda";

export const UserModel = types
  .model("UserModel")
  .props({
    id: types.identifierNumber,
    email: types.maybeNull(types.string),
    firstName: types.maybeNull(types.string),
    lastName: types.maybeNull(types.string),
    personalVision: types.maybeNull(types.string),
    avatarUrl: types.maybeNull(types.string),
    defaultAvatarColor: types.maybeNull(types.string),
    role: types.maybeNull(types.string),
    currentDailyLog: types.maybeNull(DailyLogModel),
    confirmedAt: types.maybeNull(types.string),
    invitationSentAt: types.maybeNull(types.string),
    timezone: types.maybeNull(types.string),
    phoneNumber: types.maybeNull(types.string),
    title: types.maybeNull(types.string),
    status: types.string,
    //add avatarurl2x
  })
  .views(self => ({
    get confirmedAtTz() {
      //use rails timezone to convert to confirmed at
      return self.confirmedAt;
    },
  }))
  .actions(self => ({
    setAvatarUrl: avatarUrl => {
      self.avatarUrl = avatarUrl;
    },
  }));

type UserModelType = typeof UserModel.Type;
type UserModelDataType = typeof UserModel.CreationType;

export interface IUser extends UserModelType {}
export interface IUserData extends UserModelDataType {}
