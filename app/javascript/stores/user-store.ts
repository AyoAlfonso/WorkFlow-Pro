import { types, flow, getEnv, getRoot } from "mobx-state-tree";
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
    user: types.maybeNull(UserModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    getUser: flow(function*(userId) {
      const response: ApiResponse<any> = yield self.environment.api.getUser(userId);
      if (response.ok) {
        self.user = response.data;
      }
    }),
    fetchUsers: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getUsers();
      if (response.ok) {
        self.users = response.data;
      }
    }),
    reset() {
      self.users = [] as any;
    },
    setUsersManually(users) {
      // DON'T USE IN MAIN APPLICATION, ONLY FOR TEST PURPOSES
      self.users = users as any;
    },
    inviteUser: flow(function*(formData) {
      try {
        const response: any = yield self.environment.api.inviteUser({ user: formData });
        if (response.ok) {
          self.users = R.concat(self.users, [response.data]);
          //may need to refetch teams when that is set up
          showToast("User invited", ToastMessageConstants.SUCCESS);
          return true;
        }
      } catch {}
      return false;
    }),
    resendInvitation: flow(function*(userId, metadata) {
      try {
        const response: any = yield self.environment.api.resendInvitation(userId, metadata);
        if (response.ok) {
          showToast("Invitation resent", ToastMessageConstants.SUCCESS);
        }
      } catch {}
    }),
    setUserInUsers(updatedData) {
      if (self.users) {
        self.users[self.users.findIndex(user => user.id == updatedData.id)] = updatedData;
      }
    },
  }))
  .actions(self => ({
    load: flow(function*() {
      self.reset();
      yield self.fetchUsers();
    }),
    updateUser: flow(function*(formData, metadata = {}) {
      try {
        const response: any = yield self.environment.api.updateUser(
          {
            user: formData,
            id: formData.id,
          },
          metadata,
        );
        if (response.ok) {
          const { sessionStore } = getRoot(self);
          //if user updated is self, update profile as well
          if (sessionStore.profile.id == response.data.id) {
            sessionStore.setProfileData(response.data);
          }

          self.setUserInUsers(response.data);

          //may need to refetch teams when that is set up
          showToast("User updated", ToastMessageConstants.SUCCESS);
        }
      } catch {}
    }),
    deactivateUser: flow(function*(userId, metadata = {}) {
      try {
        const response: any = yield self.environment.api.deactivateUser(userId, metadata);
        //update the user in the array
        self.setUserInUsers(response.data);
        if (response.ok) {
          showToast("User deactivated", ToastMessageConstants.SUCCESS);
          return true;
        }
      } catch {}
      return false;
    }),
    updateUserTeamLeadRole: flow(function*(userId, teamId, role, metadata) {
      const response: any = yield self.environment.api.updateUserTeamLeadRole(
        userId,
        teamId,
        role,
        metadata,
      );
      if (response.ok) {
        const userIndex = self.users.findIndex(user => user.id == userId);
        self.users[userIndex] = response.data;
        showToast("User updated", ToastMessageConstants.SUCCESS);
        return true;
      }
    }),
    updateUserTeamManagerStatus: flow(function*(userId, teamId, status, metadata) {
      const response: any = yield self.environment.api.updateUserTeamManager(
        userId,
        teamId,
        status,
        metadata,
      );
      if (response.ok) {
        const userIndex = self.users.findIndex(user => user.id == userId);
        self.users[userIndex] = response.data;
        showToast("User updated", ToastMessageConstants.SUCCESS);
        return true;
      }
    }),

    // create your own function
    updateUserCompany: flow(function*(companyId) {
      self.environment.api.switchCompanies(companyId).then(() => {
        return true;
      });
    }),
  }));

type UserStoreType = typeof UserStoreModel.Type;
export interface IUserStore extends UserStoreType {
  users: any;
}
