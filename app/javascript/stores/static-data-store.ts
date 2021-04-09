import { types, flow } from "mobx-state-tree";

import { ApiResponse } from "apisauce";

import { withEnvironment } from "../lib/with-environment";

export const StaticDataStoreModel = types
  .model("StaticDataStoreModel")
  .props({
    timeZones: types.array(types.string),
    headingsAndDescriptions: types.maybeNull(types.frozen()),
    fieldsAndLabels: types.maybeNull(types.frozen()),
    emotionAdjectives: types.maybeNull(types.frozen()),
  })
  .extend(withEnvironment())
  .views(self => ({
    filteredEmotionAdjectives(selectedEmotion) {
      return self.emotionAdjectives[`emotionScore${selectedEmotion}`];
    },
  }))
  .actions(self => ({
    load: flow(function*() {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getStaticData();
        if (response.ok) {
          self.timeZones = response.data.timeZones as any;
          self.headingsAndDescriptions = response.data.headingsAndDescriptions as any;
          self.fieldsAndLabels = response.data.fieldsAndLabels as any;
          self.emotionAdjectives = response.data.emotionAdjectives as any;
          return true;
        } else {
          return false;
        }
      } catch {
        // caught by Api Monitor
        return false;
      }
    }),
  }));

type TStaticDataStore = typeof StaticDataStoreModel.Type;

export interface IStaticDataStore extends TStaticDataStore {
  timeZones: any;
}
