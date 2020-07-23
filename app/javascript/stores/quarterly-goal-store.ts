import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { QuarterlyGoalModel } from "../models/quarterly-goal";
import moment from "moment";
//import { ApiResponse } from "apisauce";

export const QuarterlyGoalStoreModel = types
  .model("QuarterlyGoalModel")
  .props({
    quarterlyGoal: types.maybeNull(QuarterlyGoalModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    getQuarterlyGoal: flow(function* (id) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getQuarterlyGoal(id);
        self.quarterlyGoal = response.data;
      } catch {
        console.log("is there an error?????????");
        // error messaging handled by API monitor
      }
    }),
    update: flow(function* () {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.updateQuarterlyGoal(self.quarterlyGoal);
        const responseQuarterlyGoal = response.data.quarterlyGoal;
        self.quarterlyGoal = responseQuarterlyGoal;
        return responseQuarterlyGoal;
      } catch {
        console.log("is there an error?????????");
        // error messaging handled by API monitor
      }
    }),
    createKeyElement: flow(function* () {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createQuarterlyGoalKeyElement(self.quarterlyGoal.id);
        const updatedKeyElements = [...self.quarterlyGoal.keyElements, response.data.keyElement];
        self.quarterlyGoal.keyElements = updatedKeyElements as any;
      } catch {
        console.log("is there an error?????????");
        // error messaging handled by API monitor
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
    updateOwnedBy(userId) {
      self.quarterlyGoal.ownedById = userId;
      self.update();
    },
  }));

type QuarterlyGoalStoreType = typeof QuarterlyGoalStoreModel.Type;
export interface IQuarterlyGoalStore extends QuarterlyGoalStoreType {
  QuarterlyGoal;
}
