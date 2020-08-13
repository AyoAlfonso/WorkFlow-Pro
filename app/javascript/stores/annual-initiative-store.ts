import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { AnnualInitiativeModel } from "../models/annual-initiative";
import moment from "moment";
import { ToastMessageConstants } from "~/constants/toast-types";
import { showToast } from "~/utils/toast-message";

export const AnnualInitiativeStoreModel = types
  .model("AnnualInitiativeModel")
  .props({
    annualInitiative: types.maybeNull(AnnualInitiativeModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    getAnnualInitiative: flow(function*(id) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getAnnualInitiative(id);
        self.annualInitiative = response.data;
        return response.data;
      } catch {
        showToast("There was an error fetching the annual initiative", ToastMessageConstants.ERROR);
      }
    }),
    update: flow(function*() {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.updateAnnualInitiative(self.annualInitiative);
        const responseAnnualInitiative = response.data.annualInitiative;
        self.annualInitiative = responseAnnualInitiative;
        const { goalStore } = getRoot(self);
        goalStore.updateAnnualInitiative(responseAnnualInitiative);
        showToast("Annual initiative updated", ToastMessageConstants.SUCCESS);
        return responseAnnualInitiative;
      } catch {
        showToast("There was an error updating the annual initiative", ToastMessageConstants.ERROR);
      }
    }),
    createKeyElement: flow(function*() {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createAnnualInitiativeKeyElement(
          self.annualInitiative.id,
        );
        const updatedKeyElements = [...self.annualInitiative.keyElements, response.data.keyElement];
        self.annualInitiative.keyElements = updatedKeyElements as any;
      } catch {
        showToast("There was an error creating the key element", ToastMessageConstants.ERROR);
      }
    }),
    create: flow(function*(annualInitiativeObject) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createAnnualInitiative(annualInitiativeObject);
        const { goalStore } = getRoot(self);
        goalStore.mergeAnnualInitiatives(
          annualInitiativeObject.type,
          response.data.annualInitiative,
        );
        showToast("An initiative created", ToastMessageConstants.SUCCESS);
        return response.data.annualInitiative;
      } catch {
        showToast("There was an error creating the annual initiative", ToastMessageConstants.ERROR);
      }
    }),
  }))
  .actions(self => ({
    updateModelField(field, value) {
      self.annualInitiative[field] = value;
    },
    updateKeyElementValue(id, value) {
      let keyElements = self.annualInitiative.keyElements;
      let keyElementIndex = keyElements.findIndex(ke => ke.id == id);
      keyElements[keyElementIndex].value = value;
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
    updateOwnedBy(userId) {
      self.annualInitiative.ownedById = userId;
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
