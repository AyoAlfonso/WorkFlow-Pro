import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { KeyElementModel } from "~/models/key-element";

export const KeyElementStoreModel = types
  .model("KeyElementModel")
  .props({
    keyElementsForWeeklyCheckin: types.maybeNull(types.array(KeyElementModel)),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    getKeyElementsForWeeklyCheckIn: flow(function*() {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getWeeklyCheckinKeyElements();
        self.keyElementsForWeeklyCheckin = response.data;
        return response.data;
      } catch (error) {
        showToast("There was an error retrieving Key Results", ToastMessageConstants.ERROR);
      }
    }),
    updateKeyElement: flow(function*(id, value) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.updateWeeklyCheckInKeyElements(id, value);

        const keyElements = self.keyElementsForWeeklyCheckin;
        const keyElementIndex = keyElements.findIndex(ke => ke.id == id);
        keyElements[keyElementIndex] = response.data;
        showToast("Key Result updated", ToastMessageConstants.SUCCESS);
        return true;
      } catch {
        showToast("Something went wrong", ToastMessageConstants.ERROR);
        return false;
      }
    }),
    createActivityLog: flow(function*(objectiveLog) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.createInitiativeLog(objectiveLog);
        return response.data.objectiveLog
      } catch {
        return false;
      }
    }),
  }))
  .actions(self => ({
    updateKeyElementValue(field: string, id: number, value: number | string) {
      let keyElements = self.keyElementsForWeeklyCheckin;
      let keyElementIndex = keyElements.findIndex(ke => ke.id == id);
      keyElements[keyElementIndex][field] = value;
      self.keyElementsForWeeklyCheckin = keyElements;
    },
  }));

type KeyElementStoreType = typeof KeyElementStoreModel.Type;
export interface IKeyElementStore extends KeyElementStoreType {}
