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
        showToast("There was an error fetching the annual objective", ToastMessageConstants.ERROR);
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
        showToast("Annual objective updated", ToastMessageConstants.SUCCESS);
        return responseAnnualInitiative;
      } catch {
        showToast("There was an error updating the annual objective", ToastMessageConstants.ERROR);
      }
    }),
    createKeyElement: flow(function*(keyElementParams) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createAnnualInitiativeKeyElement(
          self.annualInitiative.id,
          keyElementParams,
        );
        const updatedKeyElements = [...self.annualInitiative.keyElements, response.data.keyElement];
        self.annualInitiative.keyElements = updatedKeyElements as any;
        showToast("Key Result created", ToastMessageConstants.SUCCESS);
        return response.data.keyElement;
      } catch {
        showToast("There was an error creating the key element", ToastMessageConstants.ERROR);
      }
    }),
    deleteKeyElement: flow(function*(keyElementId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.deleteAnnualInitiativeKeyElement(keyElementId);
        self.annualInitiative = response.data;
        showToast("Key Result deleted", ToastMessageConstants.SUCCESS);
        return true;
      } catch {
        showToast("There was an error deleting the key result", ToastMessageConstants.ERROR);
        return false;
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
        showToast("Annual objective created", ToastMessageConstants.SUCCESS);
        return response.data.annualInitiative;
      } catch {
        showToast("There was an error creating the annual objective", ToastMessageConstants.ERROR);
      }
    }),
    delete: flow(function*(annualInitiativeId) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.deleteAnnualInitiative(annualInitiativeId);
        const { goalStore } = getRoot(self);
        goalStore.removeDeletedAnnualInitiative(annualInitiativeId);
        showToast("Annual objective deleted", ToastMessageConstants.SUCCESS);
        return response.data.annualInitiativeId;
      } catch {
        showToast("There was an error deleting the annual objective", ToastMessageConstants.ERROR);
      }
    }),
  }))
  .actions(self => ({
    updateModelField(field, value) {
      self.annualInitiative[field] = value;
    },
    updateKeyElementValue(field: string, id: number, value: number) {
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
      self.annualInitiative.ownedById = user.id;
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
