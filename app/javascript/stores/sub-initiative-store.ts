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
    get title(){
      const { sessionStore } = getRoot(self);
      return sessionStore.subInitiativeTitle
    }
  }))
  .actions(self => ({
    getSubInitiative: flow(function*(id) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getSubInitiative(id);
        self.subInitiative = response.data;
      } catch {
        showToast(il8n.t("subInitiative.retrievalError", { title: self.title }), ToastMessageConstants.ERROR);
      }
    }),
    update: flow(function*() {
      const env = getEnv(self);
      const response: any = yield env.api.updateSubInitiative(self.subInitiative);
      self.subInitiative = response.data;
      showToast(il8n.t("subInitiative.updated", { title: self.title }), ToastMessageConstants.SUCCESS);
      return response.data;
    }),
    closeGoal: flow(function*(id) {
      const env = getEnv(self);
      const response: any = yield env.api.closeSubInitiative(id);
      self.subInitiative = response.data;
      showToast(il8n.t("subInitiative.closed", { title: self.title }), ToastMessageConstants.SUCCESS);
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
        showToast("Key Result deleted", ToastMessageConstants.SUCCESS);
        return response.data.keyElement;
      } catch {
        showToast(il8n.t("subInitiative.keyElementCreationError"), ToastMessageConstants.ERROR);
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
    create: flow(function*(subInitiativeObject ) {
      //TODO: CHANGE THIS FUNCTION
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createSubInitiative(subInitiativeObject);
        const { goalStore, quarterlyGoalStore } = getRoot(self);
        goalStore.mergeQuarterlyGoals(response.data);
        quarterlyGoalStore.updateQuarterlyGoalAfterAddingSubInitiative(response.data);
        showToast(il8n.t("subInitiative.created", { title: self.title }), ToastMessageConstants.SUCCESS);
        return response.data;
      } catch {
        showToast(il8n.t("subInitiative.creationError", { title: self.title }), ToastMessageConstants.ERROR);
      }
    }),
    delete: flow(function*(subInitiativeId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.deleteSubInitiative(subInitiativeId);
        const { quarterlyGoalStore } = getRoot(self);
        console.log('response.data', response.data)
        quarterlyGoalStore.updateQuarterlyGoal(response.data);
        showToast(il8n.t("subInitiative.deleted", { title: self.title }), ToastMessageConstants.SUCCESS);
        return response.data;
      } catch {
        showToast(il8n.t("subInitiative.deletionError", { title: self.title }), ToastMessageConstants.ERROR);
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
    },
    updateMilestoneStatus(id, status) {
      let milestones = self.subInitiative.milestones;
      let milestoneIndex = milestones.findIndex(milestone => milestone.id == id);
      milestones[milestoneIndex].status = status;
      self.subInitiative.milestones = milestones;
      self.update();
    },
  }));

type SubInitiativeStoreType = typeof SubInitiativeStoreModel.Type;
export interface ISubInitiativeStore extends SubInitiativeStoreType {
  SubInitiative;
}
