import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { QuarterlyGoalModel } from "../models/quarterly-goal";
import moment from "moment";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import il8n from "i18next";

export const QuarterlyGoalStoreModel = types
  .model("QuarterlyGoalModel")
  .props({
    quarterlyGoal: types.maybeNull(QuarterlyGoalModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    getQuarterlyGoal: flow(function*(id) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getQuarterlyGoal(id);
        self.quarterlyGoal = response.data;
      } catch {
        showToast(il8n.t("quarterlyGoal.retrievalError"), ToastMessageConstants.ERROR);
      }
    }),
    update: flow(function*() {
      const env = getEnv(self);
      // try {
      const response: any = yield env.api.updateQuarterlyGoal(self.quarterlyGoal);
      const responseQuarterlyGoal = response.data;
      self.quarterlyGoal = responseQuarterlyGoal;
      showToast(il8n.t("quarterlyGoal.updated"), ToastMessageConstants.SUCCESS);
      return responseQuarterlyGoal;
      // } catch {
      //   showToast(il8n.t("quarterlyGoal.retrievalError"), ToastMessageConstants.ERROR);
      // }
    }),
    closeGoal: flow(function*(id) {
      const env = getEnv(self);
      const response: any = yield env.api.closeQuarterlyGoal(id);
      const responseQuarterlyGoal = response.data;
      self.quarterlyGoal = responseQuarterlyGoal;
      showToast(il8n.t("quarterlyGoal.closed"), ToastMessageConstants.SUCCESS);
      return responseQuarterlyGoal;
    }),
    createKeyElement: flow(function*(keyElementParams) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createQuarterlyGoalKeyElement(
          self.quarterlyGoal.id,
          keyElementParams,
        );
        if (response.ok) {
          const updatedKeyElements = [...self.quarterlyGoal.keyElements, response.data.keyElement];
          self.quarterlyGoal.keyElements = updatedKeyElements as any;
          showToast("Key Result created", ToastMessageConstants.SUCCESS);
          return response.data.keyElement;
        }
        //api monitor to show error
      } catch {
        showToast(il8n.t("quarterlyGoal.keyElementCreationError"), ToastMessageConstants.ERROR);
      }
    }),
    deleteKeyElement: flow(function*(keyElementId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.deleteQuarterlyGoalKeyElement(keyElementId);
        if (response.ok) {
          self.quarterlyGoal = response.data;
          showToast("Key Result deleted", ToastMessageConstants.SUCCESS);
          return true;
        }
        //api monitor to show error
      } catch {
        showToast("There was an error deleting the key result", ToastMessageConstants.ERROR);
        return false;
      }
    }),
    create: flow(function*(quarterlyGoalObject, inAnnualInitiative) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createQuarterlyGoal(quarterlyGoalObject);
        const { goalStore, annualInitiativeStore } = getRoot(self);
        goalStore.mergeQuarterlyGoals(response.data);
        if (inAnnualInitiative) {
          annualInitiativeStore.updateAnnualInitiativeAfterAddingQuarterlyGoal(response.data);
        }
        showToast(il8n.t("quarterlyGoal.created"), ToastMessageConstants.SUCCESS);
        return response.data;
      } catch {
        showToast(il8n.t("quarterlyGoal.creationError"), ToastMessageConstants.ERROR);
      }
    }),
    delete: flow(function*(updateAnnualInitiative = true, quarterlyGoalId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.deleteQuarterlyGoal(quarterlyGoalId);
        const { goalStore, annualInitiativeStore } = getRoot(self);

        const annualInitiative = response.data;

        if (goalStore.companyGoals) {
          let companyGoalIndex = goalStore.companyGoals.goals.findIndex(
            ai => ai.id == annualInitiative.id,
          );
          if (companyGoalIndex > -1) {
            goalStore.updateGoalAnnualInitiative(
              "companyGoals",
              companyGoalIndex,
              annualInitiative,
            );
          }
        }

        if (goalStore.personalGoals) {
          let personalGoalIndex = goalStore.personalGoals.goals.findIndex(
            ai => ai.id == annualInitiative.id,
          );
          if (personalGoalIndex > -1) {
            goalStore.updateGoalAnnualInitiative(
              "personalGoals",
              personalGoalIndex,
              annualInitiative,
            );
          }
        }

        if (goalStore.teamGoals) {
          let teamGoalIndex = goalStore.teamGoals.findIndex(ai => ai.id == annualInitiative.id);

          if (teamGoalIndex > -1) {
            goalStore.updateGoalAnnualInitiative("teamGoals", teamGoalIndex, annualInitiative);
          }
        }

        if (updateAnnualInitiative) {
          annualInitiativeStore.updateRecordIfOpened(annualInitiative);
        }

        showToast(il8n.t("quarterlyGoal.deleted"), ToastMessageConstants.SUCCESS);
        return annualInitiative;
      } catch {
        showToast(il8n.t("quarterlyGoal.deletionError"), ToastMessageConstants.ERROR);
      }
    }),
    createMilestones: flow(function*(quarterlyGoalId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createMilestones(quarterlyGoalId);
        self.quarterlyGoal = response.data;
      } catch {
        showToast(il8n.t("quarterlyGoal.milestoneCreationError"), ToastMessageConstants.ERROR); // error messaging handled by API monitor
      }
    }),
  }))
  .actions(self => ({
    updateModelField(field, value) {
      self.quarterlyGoal[field] = value;
    },
    updateKeyElementValue(field: string, id: number, value: number) {
      let keyElements = self.quarterlyGoal.keyElements;
      let keyElementIndex = keyElements.findIndex(ke => ke.id == id);
      keyElements[keyElementIndex][field] = value;
      self.quarterlyGoal.keyElements = keyElements;
    },
    updateKeyElementStatus(id, value) {
      let keyElements = self.quarterlyGoal.keyElements;
      let keyElementIndex = keyElements.findIndex(ke => ke.id == id);
      value
        ? (keyElements[keyElementIndex].completedAt = moment().toString())
        : (keyElements[keyElementIndex].completedAt = "");
      self.quarterlyGoal.keyElements = keyElements;
      self.update();
    },
    updateOwnedBy(user) {
      self.quarterlyGoal.ownedById = user.id;
      self.update();
    },
    updateMilestoneDescription(id, value) {
      let milestones = self.quarterlyGoal.milestones;
      let milestoneIndex = milestones.findIndex(milestone => milestone.id == id);
      milestones[milestoneIndex].description = value;
      self.quarterlyGoal.milestones = milestones;
    },
    updateMilestoneStatus(id, status) {
      let milestones = self.quarterlyGoal.milestones;
      let milestoneIndex = milestones.findIndex(milestone => milestone.id == id);
      milestones[milestoneIndex].status = status;
      self.quarterlyGoal.milestones = milestones;
      self.update();
    },
  }));

type QuarterlyGoalStoreType = typeof QuarterlyGoalStoreModel.Type;
export interface IQuarterlyGoalStore extends QuarterlyGoalStoreType {
  QuarterlyGoal;
}
