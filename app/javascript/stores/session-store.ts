import * as R from "ramda";
import { types, getEnv, flow, getRoot } from "mobx-state-tree";
import { withEnvironment } from "~/lib/with-environment";
import { withRootStore } from "~/lib/with-root-store";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { UserModel } from "~/models/user";
import { StaticModel } from "~/models/static";

export const SessionStoreModel = types
  .model("SessionStoreModel")
  .props({
    loading: types.boolean,
    loggedIn: types.boolean,
    //profile details added as a profile model
    profile: types.maybeNull(UserModel),
    staticData: types.maybeNull(StaticModel),
  })
  .extend(withRootStore())
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    loadProfile: flow(function*() {
      self.loading = true;
      const env = getEnv(self);
      try {
        const response: any = yield env.api.profile();
        if (response.ok) {
          //add details to user model
          self.profile = response.data;
          self.staticData = response.data.staticData;
          self.loggedIn = true;
        }
      } catch {
        // error messaging handled by API monitor
      }
      self.loading = false;
    }),
    updateUser: flow(function*(fieldsAndValues) {
      self.loading = true;
      const env = getEnv(self);
      try {
        const response = yield env.api.updateProfile(
          Object.assign({ user: fieldsAndValues }, { id: self.profile.id }),
        );
        if (response.ok) {
          self.profile = response.data;
          showToast("User updated", ToastMessageConstants.SUCCESS);
        }
      } catch {
        // error messaging handled by API monitor
      }
    }),
    updateAvatar: flow(function*(formData) {
      self.loading = true;
      const env = getEnv(self);
      try {
        const response = yield env.api.updateAvatar(formData);
        if (response.ok) {
          self.profile.setAvatarUrl(response.data.avatarUrl);
        }
      } catch {
        // error messaging handled by API monitor
      }
      self.loading = false;
    }),
    deleteAvatar: flow(function*() {
      self.loading = true;
      const env = getEnv(self);
      try {
        const response = yield env.api.deleteAvatar();
        if (response.ok) {
          self.profile.setAvatarUrl(response.data.avatarUrl);
        }
      } catch {
        // error messaging handled by API monitor
      }
      self.loading = false;
    }),
  }))
  .actions(self => ({
    login: flow(function*(email, password) {
      self.loading = true;
      //may want to show a loading modal here
      const env = getEnv(self);
      const { companyStore, teamStore, userStore } = getRoot(self);
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
      const env = getEnv(self);
      const response: any = yield env.api.signOut();
      if (response.ok) {
      }
      self.loggedIn = false;
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
