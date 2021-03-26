import * as R from "ramda";
import { toJS } from "mobx";
import { types, getEnv, flow, getRoot } from "mobx-state-tree";
import { withEnvironment } from "~/lib/with-environment";
import { withRootStore } from "~/lib/with-root-store";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { UserModel } from "~/models/user";
import { StaticModel } from "~/models/static";
import { registerIdentity } from "~/components/shared/analytics";
import { ScheduledGroupModel } from "~/models/scheduled-group";
import { UserPulseModel } from "~/models/user-pulse";

export const SessionStoreModel = types
  .model("SessionStoreModel")
  .props({
    loading: types.boolean,
    loggedIn: types.boolean,
    //profile details added as a profile model
    profile: types.maybeNull(UserModel),
    staticData: types.maybeNull(StaticModel),
    scheduledGroups: types.maybeNull(types.array(ScheduledGroupModel)),
    selectedUserPulse: types.maybeNull(UserPulseModel),
  })
  .extend(withRootStore())
  .extend(withEnvironment())
  .views(self => ({
    getScheduledGroupIdByName(selectedFilterGroupName) {
      return R.path(
        ["id"],
        self.scheduledGroups.find(group => group.name == selectedFilterGroupName),
      );
    },
  }))
  .actions(self => ({
    setProfileData(updatedData) {
      self.profile = { ...toJS(self.profile), ...updatedData }; //fields to be updated should be filtered
    },
    loadProfile: flow(function*() {
      self.loading = true;
      try {
        const response: any = yield self.environment.api.profile();
        if (response.ok) {
          //add details to user model
          self.profile = response.data;
          self.staticData = response.data.staticData;
          self.scheduledGroups = response.data.scheduledGroups;
          self.loggedIn = true;

          //data and company name are not stored on user model
          registerIdentity(
            response.data.id,
            response.data.email,
            `${response.data.firstName} ${response.data.lastName}`,
            response.data.companyId,
            response.data.companyName,
          );
        }
      } catch {
        // error messaging handled by API monitor
      }
      self.loading = false;
    }),
    updateUser: flow(function*(fieldsAndValues, successMessageOverride = null) {
      self.loading = true;
      const { userStore } = getRoot(self);
      try {
        const response = yield self.environment.api.updateUser(
          Object.assign({ user: fieldsAndValues }, { id: self.profile.id }),
        );

        if (response.ok) {
          if (fieldsAndValues["dailyLogsAttributes"]) {
            if (!R.isNil(successMessageOverride)) {
              showToast(successMessageOverride, ToastMessageConstants.SUCCESS);
            }
          } else {
            showToast("User updated", ToastMessageConstants.SUCCESS);
          }

          self.profile = response.data;
          userStore.setUserInUsers(response.data);
        }
      } catch {
        // error messaging handled by API monitor
      }
    }),
    updateUserPulse: flow(function*(userPulseObject){
      const response = yield self.environment.api.updateUserPulse(userPulseObject);
      if(response.ok){
        self.profile = response.data;
        showToast("Daily pulse updated.", ToastMessageConstants.SUCCESS);
      } else {
        showToast("There was an error updating the daily pulse", ToastMessageConstants.ERROR);
      }
    }),
    getUserPulseByDate: flow(function*(date){
      const response = yield self.environment.api.getUserPulseByDate(date);
      console.log('response data', response.data)
      self.profile.userPulseForDisplay = response.data.userPulse
    }),
    updateAvatar: flow(function*(formData) {
      self.loading = true;
      try {
        const response = yield self.environment.api.updateAvatar(formData);
        if (response.ok) {
          self.profile.setAvatarUrl(response.data.avatarUrl);
          const { userStore } = getRoot(self);
          userStore.fetchUsers();
        }
      } catch {
        // error messaging handled by API monitor
      }
      self.loading = false;
    }),
    deleteAvatar: flow(function*() {
      self.loading = true;
      try {
        const response = yield self.environment.api.deleteAvatar();
        if (response.ok) {
          self.profile.setAvatarUrl(response.data.avatarUrl);
          const { userStore } = getRoot(self);
          userStore.fetchUsers();
        }
      } catch {
        // error messaging handled by API monitor
      }
      self.loading = false;
    }),
    updatePassword: flow(function*(fieldsAndValues) {
      self.loading = true;
      try {
        const response = yield self.environment.api.updateUser(
          Object.assign({ user: fieldsAndValues }, { id: self.profile.id }),
        );

        if (response.ok) {
          self.loggedIn = false;
          showToast(
            "Password has been changed.  Please enter it again.",
            ToastMessageConstants.SUCCESS,
          );
        }
      } catch {
        // error messaging handled by API monitor
      }
      self.loading = false;
    }),
    updateUserCompanyFirstTimeAccess: flow(function*(params) {
      const response: any = yield self.environment.api.updateUserCompanyFirstTimeAccess(params);
      self.profile = response.data;
    }),
  }))
  .actions(self => ({
    login: flow(function*(email, password) {
      self.loading = true;
      //may want to show a loading modal here
      const env = getEnv(self);
      const { companyStore, teamStore, userStore, meetingStore, notificationStore } = getRoot(self);
      try {
        const response: any = yield env.api.login(email, password);
        if (response.ok) {
          //save credentials
          const newJWT = R.path(["headers", "authorization"], response);

          if (newJWT && newJWT.startsWith("Bearer")) {
            //default cookie set for rails.  Alternative cookies could be done:
            //https://github.com/js-cookie/js-cookie#cookie-attributes
            // by default cookie removed when browser closed
            // Cookies.set("Authorization", newJWT, {
            //   sameSite: true,
            //   httpOnly: true,
            //   expires: 365,
            // });

            //TODO SET TOKEN INTO COOKIE
            //env.api.setJWT(newJWT);
            self.loadProfile();
            companyStore.load();
            userStore.load();
            teamStore.load();
            meetingStore.load();
            notificationStore.load();
          }
        }
      } catch {
        // error messaging handled by API monitor
      }
      self.loading = false;
    }),
    // logoutRequest: flow(function* () {
    // yield self.environment.api.logout();
    // self.loggedIn = false;
    // }),
    logoutRequest: flow(function*() {
      const response: any = yield self.environment.api.signOut();
      if (response.ok) {
      }
      self.loggedIn = false;
    }),
    resetPassword: flow(function*(email) {
      const response: any = yield self.environment.api.resetPassword(email);
      if (response.ok) {
        showToast(
          "Please check your email for password reset instructions.",
          ToastMessageConstants.SUCCESS,
        );
      }
    }),
  }))
  .actions(self => ({
    updateProfileModelField(field, value) {
      self.profile[field] = value;
    },
    updateProfileFromModel() {
      self.updateUser(self.profile);
    },
  }));

type SessionStoreType = typeof SessionStoreModel.Type;
export interface ISessionStore extends SessionStoreType {}
