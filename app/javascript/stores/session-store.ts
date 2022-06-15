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
import { DailyLogModel } from "~/models/daily-log";
import Cookies from "js-cookie";

export const SessionStoreModel = types
  .model("SessionStoreModel")
  .props({
    loading: types.boolean,
    loggedIn: types.boolean,
    logginError: types.maybeNull(types.string),
    logginErrorType: types.maybeNull(types.string),
    //profile details added as a profile model
    profile: types.maybeNull(UserModel),
    staticData: types.maybeNull(StaticModel),
    scheduledGroups: types.maybeNull(types.array(ScheduledGroupModel)),
    selectedUserPulse: types.maybeNull(UserPulseModel),
    companyStaticData: types.maybeNull(types.array(types.frozen())),
    selectedDailyLog: types.maybeNull(DailyLogModel),
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
    get annualInitiativeTitle() {
      const titleObject = self.companyStaticData.find(item => item.field == "annual_objective");
      return titleObject ? titleObject.value : "Annual Objective";
    },
    get quarterlyGoalTitle() {
      const titleObject = self.companyStaticData.find(item => item.field == "quarterly_initiative");
      return titleObject ? titleObject.value : "Quarterly Initiative";
    },
    get subInitiativeTitle() {
      const titleObject = self.companyStaticData.find(item => item.field == "sub_initiative");
      return titleObject ? titleObject.value : "Supporting Initiative";
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
          self.companyStaticData = response.data.companyStaticData;
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
      } catch (e) {
        // error messaging handled by API monitor
      }
      self.loading = false;
    }),
    updateUser: flow(function*(fieldsAndValues, metadata) {
      self.loading = true;
      const { userStore } = getRoot(self);
      try {
        const response = yield self.environment.api.updateUser(
          Object.assign({ user: fieldsAndValues }, { id: self.profile.id }),
          metadata,
        );

        if (response.ok) {
          if (!fieldsAndValues["dailyLogsAttributes"]) {
            showToast("User updated", ToastMessageConstants.SUCCESS);
          }

          self.profile = response.data;
          userStore.setUserInUsers(response.data);
          self.loading = false;
        }
      } catch {
        // error messaging handled by API monitor
      }
      self.loading = false;
    }),
    updateUserPulse: flow(function*(userPulseObject) {
      const response = yield self.environment.api.updateUserPulse(userPulseObject);
      if (response.ok) {
        self.profile = response.data;
        showToast("Daily pulse updated.", ToastMessageConstants.SUCCESS);
      } else {
        showToast("There was an error updating the daily pulse", ToastMessageConstants.ERROR);
      }
    }),
    getUserPulseByDate: flow(function*(date) {
      const response = yield self.environment.api.getUserPulseByDate(date);
      if (response.data) {
        self.profile.userPulseForDisplay = response.data.userPulse;
      } else {
        self.profile.userPulseForDisplay = null;
      }
    }),
    updateSelectedDailyLog: function(dailyLogObject) {
      self.selectedDailyLog = dailyLogObject;
    },
    getSelectedDailyLog: flow(function*(date) {
      if (date == null) {
        self.selectedDailyLog = null;
      } else {
        self.loading = true;
        const response = yield self.environment.api.getSelectedDailyLogByDate(date);
        if (response.data) {
          self.selectedDailyLog = response.data.dailyLog;
        } else {
          self.selectedDailyLog = null;
        }
        self.loading = false;
      }
    }),
    updateAvatar: flow(function*(formData, metadata) {
      self.loading = true;
      try {
        const response = yield self.environment.api.updateAvatar(formData, metadata);
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
    deleteAvatar: flow(function*(metadata) {
      self.loading = true;
      try {
        const response = yield self.environment.api.deleteAvatar(metadata);
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
    updatePassword: flow(function*(fieldsAndValues, metadata = {}) {
      self.loading = true;
      try {
        const response = yield self.environment.api.updateUser(
          Object.assign({ user: fieldsAndValues }, { id: self.profile.id }),
          metadata,
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
      const {
        companyStore,
        teamStore,
        userStore,
        meetingStore,
        notificationStore,
        keyActivityStore,
        labelStore,
        staticDataStore,
      } = getRoot(self);
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
            staticDataStore.load();
            companyStore.load();
            userStore.load();
            teamStore.load();
            keyActivityStore.load();
            meetingStore.load();
            labelStore.fetchLabels();
            notificationStore.load();
            companyStore.getOnboardingCompany();
          }
        } else {
          if (response.data.errorType == "microsoft_oauth") {
            self.logginError = response.data.error;
            self.logginErrorType = response.data.errorType;
          }

          if (response.data.errorType == "google_auth") {
            self.logginError = response.data.error;
            self.logginErrorType = response.data.errorType;
          }
        }
      } catch (error) {}
      self.loading = false;
    }),
    logInWithProvider: flow(function*(provider, responsebody) {
      self.logginError = null;
      self.loading = true;
      //may want to show a loading modal here
      const env = getEnv(self);
      const {
        companyStore,
        teamStore,
        userStore,
        meetingStore,
        notificationStore,
        keyActivityStore,
        labelStore,
        staticDataStore,
      } = getRoot(self);
      try {
        const response: any = yield self.environment.api.logInWithProvider(provider, responsebody);
        if (response.ok) {
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
            localStorage.setItem("Authorization", newJWT);

            self.loadProfile();
            staticDataStore.load();
            companyStore.load();
            userStore.load();
            teamStore.load();
            keyActivityStore.load();
            meetingStore.load();
            labelStore.fetchLabels();
            notificationStore.load();
            companyStore.getOnboardingCompany();
          } else {
            showToast(
              "User email couldn't be authenticated.  Please try another email.",
              ToastMessageConstants.ERROR,
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
      self.loading = false;
    }),
    logoutRequest: flow(function*() {
      localStorage.removeItem("Authorization");
      const response: any = yield self.environment.api.signOut();
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
      self.updateUser(self.profile, {});
    },
  }));

type SessionStoreType = typeof SessionStoreModel.Type;
export interface ISessionStore extends SessionStoreType {}
