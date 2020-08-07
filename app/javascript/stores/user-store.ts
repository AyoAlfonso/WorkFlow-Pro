import { types, flow, getEnv } from "mobx-state-tree";
import * as R from "ramda";
import { withEnvironment } from "../lib/with-environment";
import { UserModel } from "../models/user";
import { ApiResponse } from "apisauce";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

export const UserStoreModel = types
  .model("UserStoreModel")
  .props({
    users: types.array(UserModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    fetchUsers: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getUsers();
      if (response.ok) {
        self.users = response.data;
      }
    }),
    reset() {
      self.users = [] as any;
    },
    inviteUser: flow(function*(formData) {
      try {
        const response: any = yield self.environment.api.inviteUser({ user: formData });
        if (response.ok) {
          self.users = R.concat(self.users, [response.data]);
          //may need to refetch teams when that is set up
          showToast("User invited", ToastMessageConstants.SUCCESS);
        }
      } catch {}
    }),
    resendInvitation: flow(function*(userId) {
      try {
        const response: any = yield self.environment.api.resendInvitation(userId);
        if (response.ok) {
          showToast("Invitation resent", ToastMessageConstants.SUCCESS);
        }
      } catch {}
    }),
  }))
  .actions(self => ({
    load: flow(function*() {
      self.reset();
      yield self.fetchUsers();
    }),
  }));

type UserStoreType = typeof UserStoreModel.Type;
export interface IUserStore extends UserStoreType {
  users: any;
}
