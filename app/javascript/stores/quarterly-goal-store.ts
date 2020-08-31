import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { QuarterlyGoalModel } from "../models/quarterly-goal";
import moment from "moment";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

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
        showToast(
          "There was an error retrieving the quarterly objective",
          ToastMessageConstants.ERROR,
        );
      }
    }),
    update: flow(function*() {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.updateQuarterlyGoal(self.quarterlyGoal);
        const responseQuarterlyGoal = response.data.quarterlyGoal;
        self.quarterlyGoal = responseQuarterlyGoal;
        showToast("Quarterly objective updated", ToastMessageConstants.SUCCESS);
        return responseQuarterlyGoal;
      } catch {
        showToast(
          "There was an error updating the quarterly objective",
          ToastMessageConstants.ERROR,
        );
      }
    }),
    createKeyElement: flow(function*() {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createQuarterlyGoalKeyElement(self.quarterlyGoal.id);
        const updatedKeyElements = [...self.quarterlyGoal.keyElements, response.data.keyElement];
        self.quarterlyGoal.keyElements = updatedKeyElements as any;
      } catch {
        showToast("There was an error creating the key element", ToastMessageConstants.ERROR);
      }
    }),
    create: flow(function*(quarterlyGoalObject, inAnnualInitiative) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createQuarterlyGoal(quarterlyGoalObject);
        const { goalStore, annualInitiativeStore } = getRoot(self);
        goalStore.mergeQuarterlyGoals(response.data.quarterlyGoal);
        if (inAnnualInitiative) {
          annualInitiativeStore.updateAnnualInitiativeAfterAddingQuarterlyGoal(
            response.data.quarterlyGoal,
          );
        }
        showToast("Quarterly objective created", ToastMessageConstants.SUCCESS);
        return response.data.quarterlyGoal;
      } catch {
        showToast(
          "There was an error creating the quarterly objective",
          ToastMessageConstants.ERROR,
        );
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

        showToast("Quarterly objective deleted", ToastMessageConstants.SUCCESS);
        return annualInitiative;
      } catch {
        showToast(
          "There was an error deleting the quarterly objective",
          ToastMessageConstants.ERROR,
        );
      }
    }),
    createMilestones: flow(function*(quarterlyGoalId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createMilestones(quarterlyGoalId);
        self.quarterlyGoal = response.data.quarterlyGoal;
      } catch {
        showToast("There was an error creating milestones", ToastMessageConstants.ERROR); // error messaging handled by API monitor
      }
    }),
  }))
  .actions(self => ({
    updateModelField(field, value) {
      self.quarterlyGoal[field] = value;
    },
    updateKeyElementValue(id, value) {
      let keyElements = self.quarterlyGoal.keyElements;
      let keyElementIndex = keyElements.findIndex(ke => ke.id == id);
      keyElements[keyElementIndex].value = value;
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
