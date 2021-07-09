import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { SubInitiativeModel } from "../models/sub-initiative";
import moment from "moment";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import il8n from "i18next";

export const SubInitiativeStoreModel = types
  .model("SubInitiativeModel")
  .props({
    subInitiative: types.maybeNull(SubInitiativeModel),
  })
  .extend(withEnvironment())
  .views(self => ({
    get title() {
      const { sessionStore } = getRoot(self);
      return sessionStore.subInitiativeTitle;
    },
  }))
  .actions(self => ({
    getSubInitiative: flow(function*(id) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getSubInitiative(id);
        self.subInitiative = response.data;
      } catch {
        showToast(
          il8n.t("subInitiative.retrievalError", { title: self.title }),
          ToastMessageConstants.ERROR,
        );
      }
    }),
    update: flow(function*() {
      const env = getEnv(self);
      const response: any = yield env.api.updateSubInitiative(self.subInitiative);
      self.subInitiative = response.data;
      showToast(
        il8n.t("subInitiative.updated", { title: self.title }),
        ToastMessageConstants.SUCCESS,
      );
      return response.data;
    }),
    updateParents: flow(function*() {
      const { goalStore, quarterlyGoalStore, annualInitiativeStore } = getRoot(self);
      const responseAnnualInitiative = yield annualInitiativeStore.getAnnualInitiative(
        self.subInitiative.annualInitiativeId,
      );
      yield quarterlyGoalStore.getQuarterlyGoal(self.subInitiative.quarterlyGoalId);
      goalStore.updateAnnualInitiative(responseAnnualInitiative);
    }),
    closeGoal: flow(function*(id) {
      const env = getEnv(self);
      const { goalStore, annualInitiativeStore, quarterlyGoalStore } = getRoot(self);
      const response: any = yield env.api.closeSubInitiative(id);
      self.subInitiative = response.data;
      const responseAnnualInitiative = yield annualInitiativeStore.getAnnualInitiative(
        response.data.annualInitiativeId,
      );
      quarterlyGoalStore.updateQuarterlyGoalAfterRemovingSubInitiatives(response.data.id);
      goalStore.updateAnnualInitiative(responseAnnualInitiative);
      showToast(
        il8n.t("subInitiative.closed", { title: self.title }),
        ToastMessageConstants.SUCCESS,
      );
      return response.data;
    }),
    createKeyElement: flow(function*(keyElementParams) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createSubInitiativeKeyElement(
          self.subInitiative.id,
          keyElementParams,
        );
        const updatedKeyElements = [...self.subInitiative.keyElements, response.data.keyElement];
        self.subInitiative.keyElements = updatedKeyElements as any;
        showToast("Key Result created", ToastMessageConstants.SUCCESS);
        return response.data.keyElement;
      } catch {
        showToast(il8n.t("subInitiative.keyElementCreationError"), ToastMessageConstants.ERROR);
      }
    }),
    updateKeyElement: flow(function*(id, keyElementId, keyElementParams) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.updateSubInitiativeKeyElement(
          id,
          keyElementId,
          keyElementParams,
        );
        const keyElements = self.subInitiative.keyElements;
        const keyElementIndex = keyElements.findIndex(ke => ke.id == keyElementId);
        keyElements[keyElementIndex] = response.data.keyElement;
        self.subInitiative.keyElements = keyElements;
        showToast("Key Result updated", ToastMessageConstants.SUCCESS);
        return response.data.keyElement;
      } catch {
        showToast(il8n.t("subInitiative.keyElementUpdateError"), ToastMessageConstants.ERROR);
      }
    }),
    deleteKeyElement: flow(function*(keyElementId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.deleteSubInitiativeKeyElement(keyElementId);
        self.subInitiative = response.data.subInitiative;
        showToast("Key Result deleted", ToastMessageConstants.SUCCESS);
        return true;
      } catch {
        showToast("There was an error deleting the key result", ToastMessageConstants.ERROR);
        return false;
      }
    }),
    create: flow(function*(subInitiativeObject, type) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createSubInitiative(subInitiativeObject);
        const { quarterlyGoalStore, goalStore, annualInitiativeStore } = getRoot(self);
        quarterlyGoalStore.updateQuarterlyGoalAfterAddingSubInitiative(response.data);
        const responseAnnualInitiative = yield annualInitiativeStore.getAnnualInitiative(
          response.data.annualInitiativeId,
        );
        goalStore.updateAnnualInitiative(responseAnnualInitiative);
        showToast(
          il8n.t("subInitiative.created", { title: self.title }),
          ToastMessageConstants.SUCCESS,
        );
        return response.data;
      } catch {
        showToast(
          il8n.t("subInitiative.creationError", { title: self.title }),
          ToastMessageConstants.ERROR,
        );
      }
    }),
    delete: flow(function*(subInitiativeId) {
      const env = getEnv(self);
      try {
        //TO DO : Pass annualInitiative from params instead api call
        const response: any = yield env.api.deleteSubInitiative(subInitiativeId);
        const { quarterlyGoalStore, goalStore, annualInitiativeStore } = getRoot(self);

        const responseAnnualInitiative = yield annualInitiativeStore.getAnnualInitiative(
          response.data.annualInitiativeId,
        );
        quarterlyGoalStore.updateQuarterlyGoalAfterRemovingSubInitiatives(response.data.id);
        goalStore.updateAnnualInitiative(responseAnnualInitiative);
        showToast(
          il8n.t("subInitiative.deleted", { title: self.title }),
          ToastMessageConstants.SUCCESS,
        );
        return response.data;
      } catch {
        showToast(
          il8n.t("subInitiative.deletionError", { title: self.title }),
          ToastMessageConstants.ERROR,
        );
      }
    }),
    createMilestones: flow(function*(subInitiativeId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createSubInitiativeMilestones(subInitiativeId);
        self.subInitiative = response.data;
      } catch {
        showToast(il8n.t("subInitiative.milestoneCreationError"), ToastMessageConstants.ERROR); // error messaging handled by API monitor
      }
    }),
  }))
  .actions(self => ({
    updateModelField(field, value) {
      self.subInitiative[field] = value;
    },
    updateKeyElementValue(field: string, id: number, value: number) {
      let keyElements = self.subInitiative.keyElements;
      let keyElementIndex = keyElements.findIndex(ke => ke.id == id);
      keyElements[keyElementIndex][field] = value;
      self.subInitiative.keyElements = keyElements;
    },
    updateKeyElementStatus(id, value) {
      let keyElements = self.subInitiative.keyElements;
      let keyElementIndex = keyElements.findIndex(ke => ke.id == id);
      value
        ? (keyElements[keyElementIndex].completedAt = moment().toString())
        : (keyElements[keyElementIndex].completedAt = "");
      self.subInitiative.keyElements = keyElements;
      self.update();
    },
    updateOwnedBy(user) {
      self.subInitiative.ownedById = user.id;
      self.update();
    },
    updateMilestoneDescription(id, value) {
      let milestones = self.subInitiative.milestones;
      let milestoneIndex = milestones.findIndex(milestone => milestone.id == id);
      milestones[milestoneIndex].description = value;
      self.subInitiative.milestones = milestones;
      self.update();
    },
    updateMilestoneStatus(id, status) {
      const milestones = self.subInitiative.milestones;
      const milestoneIndex = milestones.findIndex(milestone => milestone.id == id);
      milestones[milestoneIndex].status = status;
      self.subInitiative.milestones = milestones;
      self.update();
      self.updateParents();
    },
  }));

type SubInitiativeStoreType = typeof SubInitiativeStoreModel.Type;
export interface ISubInitiativeStore extends SubInitiativeStoreType {
  SubInitiative;
}
