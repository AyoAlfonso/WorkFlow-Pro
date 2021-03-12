import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { CompanyModel } from "../models/company";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import * as R from "ramda";

export const CompanyStoreModel = types
  .model("CompanyStoreModel")
  .props({
    company: types.maybeNull(CompanyModel),
    onboardingCompany: types.maybeNull(CompanyModel),
    onboardingDisplayFormat: types.maybeNull(types.string),
    onboardingCompanyGoals: types.maybeNull(types.frozen()),
    onboardingKeyActivities: types.maybeNull(types.frozen()),
    onboardingTeam: types.maybeNull(types.frozen()),
    onboardingModalOpen: types.boolean,
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    load: flow(function*() {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getCompany("default");
        if (response.ok) {
          self.company = response.data;
        }
      } catch {
        showToast("There was an error loading the company", ToastMessageConstants.ERROR);
      }
    }),
    createCompany: flow(function*(formData) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createCompany(formData);
        if (response.ok) {
          self.onboardingCompany = response.data;
          return true;
        }
      } catch {
        showToast("There was an error creating the company", ToastMessageConstants.ERROR);
        return false;
      }
    }),
    updateCompany: flow(function*(fieldsAndValues: any, onboarding: boolean) {
      const env = getEnv(self);
      const companyId = onboarding ? self.onboardingCompany.id : self.company.id;
      try {
        const response: any = yield env.api.updateCompany(
          Object.assign({ company: fieldsAndValues }, { id: companyId }),
        );
        if (response.ok) {
          if (onboarding) {
            self.onboardingCompany = response.data;
          } else {
            self.company = response.data;
            showToast("Company updated", ToastMessageConstants.SUCCESS);
          }
          return true;
        }
      } catch {
        if (!onboarding) {
          showToast("There was an error updating the company", ToastMessageConstants.ERROR);
        }
        return false;
      }
    }),
    updateCompanyLogo: flow(function*(formData) {
      const env = getEnv(self);
      try {
        const response = yield env.api.updateCompanyLogo(self.company.id, formData);
        if (response.ok) {
          self.company.setLogoUrl(response.data.logoUrl);
        }
      } catch {
        showToast("There was an error adding the company logo", ToastMessageConstants.ERROR);
      }
    }),
    deleteCompanyLogo: flow(function*() {
      const env = getEnv(self);
      try {
        const response = yield env.api.deleteLogo(self.company.id);
        if (response.ok) {
          self.company.setLogoUrl(response.data.logoUrl);
        }
      } catch {
        showToast("There was an error removing the company logo", ToastMessageConstants.ERROR);
      }
    }),
    inviteUsersToCompany: flow(function*(emailAddresses, teamId) {
      const env = getEnv(self);
      const response = yield env.api.inviteUsersToCompany(emailAddresses, teamId);
    }),
  }))
  .actions(self => ({
    getOnboardingCompany: flow(function*() {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getOnboardingCompany();
        if (response.ok) {
          self.onboardingCompany = response.data as any;
          return true;
        } else {
          return false;
        }
      } catch {
        return false;
      }
    }),
    getOnboardingCompanyGoals: flow(function*(companyId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getOnboardingCompanyGoals(companyId);
        if (response.ok) {
          self.onboardingCompanyGoals = response.data as any;
          return true;
        }
      } catch {
        return false;
      }
    }),
    updateOnboardingCompanyGoals: flow(function*(companyId, goalData) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.updateOnboardingCompanyGoals(companyId, goalData);
        if (response.ok) {
          self.onboardingCompanyGoals = response.data as any;
          return true;
        }
      } catch {
        return false;
      }
    }),
    getOnboardingKeyActivities: flow(function*(companyId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getOnboardingKeyActivities(companyId);
        if (response.ok) {
          self.onboardingKeyActivities = response.data;
          return true;
        }
      } catch {
        return false;
      }
    }),
    updateOnboardingKeyActivities: flow(function*(companyId, keyActivitiesData) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.updateOnboardingKeyActivities(
          companyId,
          R.pipe(R.values, R.assoc("key_activities", R.__, {}))(keyActivitiesData),
        );
        if (response.ok) {
          self.onboardingKeyActivities = response.data as any;
          return true;
        }
      } catch {
        return false;
      }
    }),
    createOnboardingTeamAndInviteUsers: flow(function*(companyId, teamData) {
      const env = getEnv(self);
      const { sessionStore } = getRoot(self);
      try {
        const response: any = yield env.api.createOnboardingTeamAndInviteUsers(companyId, teamData);
        if (response.ok) {
          self.onboardingTeam = response.data;
          self.onboardingCompany = null;
          yield sessionStore.loadProfile();
          return true;
        }
      } catch {
        return false;
      }
    }),
  }))
  .actions(self => ({
    updateModelField(field, value) {
      self.company[field] = value;
    },
    updateCompanyFromModel() {
      self.updateCompany(self.company, false);
    },
  }))
  .actions(self => ({
    openOnboardingModal(displayFormat: string) {
      self.onboardingDisplayFormat = displayFormat;
      self.onboardingModalOpen = true;
    },
    closeOnboardingModal() {
      self.onboardingModalOpen = false;
    },
  }))
  .actions(self => ({
    loadOnboarding: flow(function*() {
      yield self.getOnboardingCompany();
      if (!R.isNil(self.onboardingCompany)) {
        yield self.getOnboardingCompanyGoals(self.onboardingCompany.id);
        yield self.getOnboardingKeyActivities(self.onboardingCompany.id);
      }
    }),
  }));

type CompanyStoreType = typeof CompanyStoreModel.Type;
export interface ICompanyStore extends CompanyStoreType {}
