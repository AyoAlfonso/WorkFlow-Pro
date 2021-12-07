import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { AnnualInitiativeModel } from "../models/annual-initiative";
import moment from "moment";
import { ToastMessageConstants } from "~/constants/toast-types";
import { showToast } from "~/utils/toast-message";
import il8n from "i18next";
import { ObjectiveLogModel } from "~/models/objective-log";

export const AnnualInitiativeStoreModel = types
  .model("AnnualInitiativeModel")
  .props({
    annualInitiative: types.maybeNull(AnnualInitiativeModel),
    objectiveLogs: types.maybeNull(types.array(ObjectiveLogModel)),
  })
  .extend(withEnvironment())
  .views(self => ({
    get title() {
      const { sessionStore } = getRoot(self);
      return sessionStore.annualInitiativeTitle;
    },
  }))
  .actions(self => ({
    getAnnualInitiative: flow(function*(id) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getAnnualInitiative(id);
        self.annualInitiative = response.data;
        return response.data;
      } catch {
        showToast(`There was an error fetching the ${self.title}`, ToastMessageConstants.ERROR);
      }
    }),
    update: flow(function*() {
      const env = getEnv(self);
      const { goalStore } = getRoot(self);

      try {
        const response: any = yield env.api.updateAnnualInitiative(self.annualInitiative);
        const responseAnnualInitiative = response.data.annualInitiative;
        self.annualInitiative = responseAnnualInitiative;
        goalStore.updateAnnualInitiative(responseAnnualInitiative);
        showToast(`${self.title} updated`, ToastMessageConstants.SUCCESS);
        return responseAnnualInitiative;
      } catch {
        showToast(`There was an error updating the ${self.title}`, ToastMessageConstants.ERROR);
      }
    }),
    closeInitiative: flow(function*(id) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.closeAnnualInitiative(id);
        const responseAnnualInitiative = response.data.annualInitiative;
        self.annualInitiative = responseAnnualInitiative;
        const { goalStore } = getRoot(self);
        goalStore.updateAnnualInitiative(responseAnnualInitiative);
        showToast(`${self.title} updated`, ToastMessageConstants.SUCCESS);
        return responseAnnualInitiative;
      } catch {
        showToast(`There was an error updating the ${self.title}`, ToastMessageConstants.ERROR);
      }
    }),
    createKeyElement: flow(function*(keyElementParams) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createAnnualInitiativeKeyElement(
          self.annualInitiative.id,
          keyElementParams,
        );
        if (response.ok) {
          const updatedKeyElements = [
            ...self.annualInitiative.keyElements,
            response.data.keyElement,
          ];
          self.annualInitiative.keyElements = updatedKeyElements as any;
          showToast("Key Result created", ToastMessageConstants.SUCCESS);
          return response.data.keyElement;
        }
        //api to show error
      } catch {
        showToast("There was an error creating the key element", ToastMessageConstants.ERROR);
      }
    }),
    updateKeyElement: flow(function*(id, keyElementId, keyElementParams) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.updateAnnualInitiativeKeyElement(
          id,
          keyElementId,
          keyElementParams,
        );

        const keyElements = self.annualInitiative.keyElements;
        const keyElementIndex = keyElements.findIndex(ke => ke.id == keyElementId);
        keyElements[keyElementIndex] = response.data.keyElement;
        self.annualInitiative.keyElements = keyElements;
        showToast("Key Result updated", ToastMessageConstants.SUCCESS);
        return response.data.keyElement;
      } catch (error) {
        showToast(il8n.t("annualInitiative.keyElementUpdateError"), ToastMessageConstants.ERROR);
      }
    }),
    deleteKeyElement: flow(function*(keyElementId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.deleteAnnualInitiativeKeyElement(keyElementId);
        if (response.ok) {
          self.annualInitiative = response.data;
          showToast("Key Result deleted", ToastMessageConstants.SUCCESS);
          return true;
        }
        //api to show error
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
          const updatedLogs = self.objectiveLogs.filter(
            log => log.id != response.data.objectiveLog.id,
          );
          self.objectiveLogs = updatedLogs as any;
          showToast("Log Deleted", ToastMessageConstants.SUCCESS);
          return response.data.objectiveLog;
        }
      } catch {
        return false;
      }
    }),
    create: flow(function*(annualInitiativeObject) {
      const env = getEnv(self);

      try {
        const response: any = yield env.api.createAnnualInitiative(annualInitiativeObject);
        const newAnnualInitiative: any = yield env.api.getAnnualInitiative(
          response.data.annualInitiative.id,
        );
        const { goalStore } = getRoot(self);
        goalStore.mergeAnnualInitiatives(annualInitiativeObject.type, newAnnualInitiative.data);
        showToast(`${self.title} created`, ToastMessageConstants.SUCCESS);
        return newAnnualInitiative;
      } catch {
        showToast(`There was an error creating the ${self.title}`, ToastMessageConstants.ERROR);
      }
    }),
    delete: flow(function*(annualInitiativeId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.deleteAnnualInitiative(annualInitiativeId);
        const { goalStore } = getRoot(self);
        goalStore.removeDeletedAnnualInitiative(annualInitiativeId);
        showToast(`${self.title} deleted`, ToastMessageConstants.SUCCESS);
        return response.data.annualInitiativeId;
      } catch {
        showToast(`There was an error deleting the ${self.title}`, ToastMessageConstants.ERROR);
      }
    }),
  }))
  .actions(self => ({
    updateModelField(field, value) {
      self.annualInitiative[field] = value;
    },
    findKeyElement(id) {
      const keyElement = self.annualInitiative.keyElements.find(ke => ke.id == id);
      return keyElement;
    },
    updateKeyElementValue(field: string, id: number, value: number | string) {
      let keyElements = self.annualInitiative.keyElements;
      let keyElementIndex = keyElements.findIndex(ke => ke.id == id);
      keyElements[keyElementIndex][field] = value;
      self.annualInitiative.keyElements = keyElements;
    },
    updateKeyElementStatus(id, value) {
      let keyElements = self.annualInitiative.keyElements;
      let keyElementIndex = keyElements.findIndex(ke => ke.id == id);
      value
        ? (keyElements[keyElementIndex].completedAt = moment().toString())
        : (keyElements[keyElementIndex].completedAt = "");
      self.annualInitiative.keyElements = keyElements;
      self.update();
    },

    updateOwnedBy(user) {
      self.annualInitiative = { ...self.annualInitiative, ownedById: user.id };
      self.update();
    },
    updateAnnualInitiativeAfterAddingQuarterlyGoal(quarterlyGoal) {
      if (self.annualInitiative.id) {
        self.annualInitiative.quarterlyGoals = [
          ...self.annualInitiative.quarterlyGoals,
          quarterlyGoal,
        ] as any;
      }
    },
    updateRecordIfOpened(annualInitiative) {
      if (self.annualInitiative.id == annualInitiative.id) {
        self.annualInitiative = annualInitiative;
      }
    },
  }));

type AnnualInitiativeStoreType = typeof AnnualInitiativeStoreModel.Type;
export interface IAnnualInitiativeStore extends AnnualInitiativeStoreType {
  annualInitiative;
}
