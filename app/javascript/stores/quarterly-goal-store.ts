import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { QuarterlyGoalModel } from "../models/quarterly-goal";
import moment from "moment";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import * as R from "ramda";
import il8n from "i18next";
import { ObjectiveLogModel } from "~/models/objective-log";

export const QuarterlyGoalStoreModel = types
  .model("QuarterlyGoalModel")
  .props({
    quarterlyGoal: types.maybeNull(QuarterlyGoalModel),
    objectiveLogs: types.maybeNull(types.array(ObjectiveLogModel)),
  })
  .extend(withEnvironment())
  .views(self => ({
    get title() {
      const { sessionStore } = getRoot(self);
      return sessionStore.quarterlyGoalTitle;
    },
  }))
  .actions(self => ({
    getQuarterlyGoal: flow(function*(id) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getQuarterlyGoal(id);
        self.quarterlyGoal = response.data;
        return response.data;
      } catch {
        showToast(
          il8n.t("quarterlyGoal.retrievalError", { title: self.title }),
          ToastMessageConstants.ERROR,
        );
      }
    }),
    update: flow(function*() {
      const env = getEnv(self);
      const { goalStore, annualInitiativeStore } = getRoot(self);
      const response: any = yield env.api.updateQuarterlyGoal(self.quarterlyGoal);
      const responseQuarterlyGoal = response.data;
      self.quarterlyGoal = responseQuarterlyGoal;
      const responseAnnualInitiative = yield annualInitiativeStore.getAnnualInitiative(
        self.quarterlyGoal.annualInitiativeId,
      );
      goalStore.updateAnnualInitiative(responseAnnualInitiative);
      showToast(
        il8n.t("quarterlyGoal.updated", { title: self.title }),
        ToastMessageConstants.SUCCESS,
      );
    }),
    updateParents: flow(function*(quarterlyGoal) {
      const { goalStore, quarterlyGoalStore, annualInitiativeStore } = getRoot(self);
      const responseAnnualInitiative = yield annualInitiativeStore.getAnnualInitiative(
        quarterlyGoal.annualInitiativeId,
      );
      yield quarterlyGoalStore.getQuarterlyGoal(quarterlyGoal.id);
      goalStore.updateAnnualInitiative(responseAnnualInitiative);
    }),
    closeGoal: flow(function*(id) {
      const env = getEnv(self);
      const { goalStore, annualInitiativeStore } = getRoot(self);
      const response: any = yield env.api.closeQuarterlyGoal(id);
      const responseQuarterlyGoal = response.data;
      self.quarterlyGoal = responseQuarterlyGoal;
      const responseAnnualInitiative = yield annualInitiativeStore.getAnnualInitiative(
        responseQuarterlyGoal.annualInitiativeId,
      );

      goalStore.updateAnnualInitiative(responseAnnualInitiative);
      showToast(
        il8n.t("quarterlyGoal.closed", { title: self.title }),
        ToastMessageConstants.SUCCESS,
      );
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
        showToast("Key Result updated", ToastMessageConstants.SUCCESS);
        // showToast(il8n.t("quarterlyGoal.keyElementCreationError"), ToastMessageConstants.ERROR);
      }
    }),
    updateKeyElement: flow(function*(id, keyElementId, keyElementParams) {
      const env = getEnv(self);

      try {
        const response: any = yield env.api.updateQuarterlyGoalKeyElement(
          id,
          keyElementId,
          keyElementParams,
        );
        const keyElements = self.quarterlyGoal.keyElements;
        const keyElementIndex = keyElements.findIndex(ke => ke.id == keyElementId);
        keyElements[keyElementIndex] = response.data;
        self.quarterlyGoal.keyElements = keyElements;
        showToast("Key Result updated", ToastMessageConstants.SUCCESS);
        return response.data;
      } catch (error) {
        showToast(il8n.t("quarterlyGoal.keyElementUpdateError"), ToastMessageConstants.ERROR);
        return false;
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
    getActivityLogs: flow(function*(page, type, id) {
      const env = getEnv(self);
      try {
        self.objectiveLogs = null;
        const response: any = yield env.api.getObjectiveLogs(page, type, id);
        if (response.ok) {
          self.objectiveLogs = response.data.objectiveLog;
          return response.data.meta;
        }
      } catch {
        return false;
      }
    }),
    createActivityLog: flow(function*(objectiveLog) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createInitiativeLog(objectiveLog);
        if (response.ok) {
          const updatedLogs = [...self.objectiveLogs, response.data.objectiveLog];
          self.objectiveLogs = updatedLogs as any;
          return response.data.objectiveLog;
        }
      } catch {
        return false;
      }
    }),
    deleteActivityLog: flow(function*(id) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.deleteInitiativeLog(id);
        if (response.ok) {
          const updatedLogs = self.objectiveLogs.filter(log => log.id != response.data.objectiveLog.id);
          self.objectiveLogs = updatedLogs as any;
          showToast("Log Deleted", ToastMessageConstants.SUCCESS);
          return response.data.objectiveLog;
        }
      } catch {
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
        showToast(
          il8n.t("quarterlyGoal.created", { title: self.title }),
          ToastMessageConstants.SUCCESS,
        );
        return response.data;
      } catch {
        showToast(
          il8n.t("quarterlyGoal.creationError", { title: self.title }),
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
          const companyGoalIndex = goalStore.companyGoals.goals.findIndex(
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
          const personalGoalIndex = goalStore.personalGoals.goals.findIndex(
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

        showToast(
          il8n.t("quarterlyGoal.deleted", { title: self.title }),
          ToastMessageConstants.SUCCESS,
        );
        return annualInitiative;
      } catch {
        showToast(
          il8n.t("quarterlyGoal.deletionError", { title: self.title }),
          ToastMessageConstants.ERROR,
        );
      }
    }),
    createMilestones: flow(function*(quarterlyGoalId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createQuarterlyGoalMilestones(quarterlyGoalId);
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
    findKeyElement(id) {
      const keyElement = self.quarterlyGoal.keyElements.find(ke => ke.id == id);
      return keyElement;
    },
    updateKeyElementValue(field: string, id: number, value: number | string) {
      const keyElements = self.quarterlyGoal.keyElements;
      const keyElementIndex = keyElements.findIndex(ke => ke.id == id);
      keyElements[keyElementIndex][field] = value;
      self.quarterlyGoal.keyElements = keyElements;
    },
    updateKeyElementStatus(id, value) {
      const keyElements = self.quarterlyGoal.keyElements;
      const keyElementIndex = keyElements.findIndex(ke => ke.id == id);
      value
        ? (keyElements[keyElementIndex].completedAt = moment().toString())
        : (keyElements[keyElementIndex].completedAt = "");
      self.quarterlyGoal.keyElements = keyElements;
      self.update();
    },
    updateOwnedBy(user) {
      self.quarterlyGoal = { ...self.quarterlyGoal, ownedById: user.id };
      self.update();
      self.updateParents(self.quarterlyGoal);
    },
    updateMilestoneDescription(id, value) {
      const milestones = self.quarterlyGoal.milestones;
      const milestoneIndex = milestones.findIndex(milestone => milestone.id == id);
      milestones[milestoneIndex].description = value;
      self.quarterlyGoal.milestones = milestones;
      self.update();
    },
    updateMilestoneStatus(id, status) {
      const milestones = self.quarterlyGoal.milestones;
      const milestoneIndex = milestones.findIndex(milestone => milestone.id == id);
      milestones[milestoneIndex].status = status;
      self.quarterlyGoal.milestones = milestones;
      self.update();
    },
    updateQuarterlyGoalAfterAddingSubInitiative(subInitiative) {
      if (self.quarterlyGoal.id) {
        self.quarterlyGoal.subInitiatives = [
          ...self.quarterlyGoal.subInitiatives,
          subInitiative,
        ] as any;
      }
    },
    updateQuarterlyGoalAfterRemovingSubInitiatives(subInitiativeId) {
      if (self.quarterlyGoal) {
        const subInitiativesIndex = self.quarterlyGoal.subInitiatives.findIndex(
          subInitiative => subInitiative.id == subInitiativeId,
        );
        if (subInitiativesIndex > -1) {
          self.quarterlyGoal.subInitiatives.splice(subInitiativesIndex, 1);
          self.update();
        }
      }
    },
    updateQuarterlyGoal(quarterlyGoal) {
      self.quarterlyGoal = quarterlyGoal as any;
    },
  }));

type QuarterlyGoalStoreType = typeof QuarterlyGoalStoreModel.Type;
export interface IQuarterlyGoalStore extends QuarterlyGoalStoreType {
  QuarterlyGoal;
}
