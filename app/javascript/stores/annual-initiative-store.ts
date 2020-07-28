import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { AnnualInitiativeModel } from "../models/annual-initiative";
import moment from "moment";
//import { ApiResponse } from "apisauce";

export const AnnualInitiativeStoreModel = types
  .model("AnnualInitiativeModel")
  .props({
    annualInitiative: types.maybeNull(AnnualInitiativeModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))

  .actions(self => ({
    getAnnualInitiative: flow(function* (id) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getAnnualInitiative(id);
        self.annualInitiative = response.data;
        return response.data;
      } catch {
        console.log("is there an error?????????");
        // error messaging handled by API monitor
      }
    }),
    update: flow(function* () {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.updateAnnualInitiative(self.annualInitiative);
        const responseAnnualInitiative = response.data.annualInitiative;
        self.annualInitiative = responseAnnualInitiative;
        const { goalStore } = getRoot(self);
        goalStore.updateAnnualInitiative(responseAnnualInitiative);
        return responseAnnualInitiative;
      } catch {
        console.log("is there an error?????????");
        // error messaging handled by API monitor
      }
    }),
    createKeyElement: flow(function* () {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createAnnualInitiativeKeyElement(
          self.annualInitiative.id,
        );
        const updatedKeyElements = [...self.annualInitiative.keyElements, response.data.keyElement];
        self.annualInitiative.keyElements = updatedKeyElements as any;
      } catch {
        console.log("is there an error?????????");
        // error messaging handled by API monitor
      }
    }),
    create: flow(function* (annualInitiativeObject) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createAnnualInitiative(annualInitiativeObject);
        const { goalStore } = getRoot(self);
        goalStore.mergeAnnualInitiatives(
          annualInitiativeObject.type,
          response.data.annualInitiative,
        );
        return response.data.annualInitiative;
      } catch {
        console.log("is there an error?????????");
        // error messaging handled by API monitor
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
  }));

type AnnualInitiativeStoreType = typeof AnnualInitiativeStoreModel.Type;
export interface IAnnualInitiativeStore extends AnnualInitiativeStoreType {
  annualInitiative;
}
