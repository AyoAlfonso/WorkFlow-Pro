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
      } catch (error) {
        showToast("There was an error retrieving Key Results", ToastMessageConstants.ERROR);
      }
    })
  }))
  .actions(self => ({}));

type KeyElementStoreType = typeof KeyElementStoreModel.Type;
export interface IKeyElementStore extends KeyElementStoreType {}
