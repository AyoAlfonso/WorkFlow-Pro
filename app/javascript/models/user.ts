import { types, flow, getEnv } from "mobx-state-tree";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

export const UserModel = types
  .model("UserModel")
  .props({
    id: types.identifierNumber,
    email: types.maybeNull(types.string),
    firstName: types.maybeNull(types.string),
    lastName: types.maybeNull(types.string),
    personalVision: types.maybeNull(types.string),
    avatarUrl: types.maybeNull(types.string),
    role: types.maybeNull(types.string),
    //add avatarurl2x
  })
  .views(self => ({}))
  .actions(self => ({
    setAvatarUrl: avatarUrl => {
      self.avatarUrl = avatarUrl;
    },
    update: flow(function* (fieldsAndValues) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.updateProfile(
          Object.assign(fieldsAndValues, { id: self.id }),
        );
        if (response.ok) {
          self = response.data;
          yield showToast("User updated", ToastMessageConstants.SUCCESS);
        }
      } catch {
        // error messaging handled by API monitor
      }
    }),
  }));

type UserModelType = typeof UserModel.Type;
type UserModelDataType = typeof UserModel.CreationType;

export interface IUser extends UserModelType {}
export interface IUserData extends UserModelDataType {}
