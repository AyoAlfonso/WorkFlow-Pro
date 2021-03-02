import { types, flow, getRoot } from "mobx-state-tree";
import * as R from "ramda";
import { ApiResponse } from "apisauce";

import { withEnvironment } from "../lib/with-environment";

export const StaticDataStoreModel = types
  .model("StaticDataStoreModel")
  .props({
    timeZones: types.maybeNull(types.array(types.frozen())),
    headingsAndDescriptions: types.maybeNull(types.frozen()),
    fieldsAndLabels: types.maybeNull(types.frozen()),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    load: flow(function*() {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getStaticData();
        if (response.ok) {
          self.timeZones = response.data.timeZones as any;
          self.headingsAndDescriptions = response.data.headingsAndDescriptions as any;
          self.fieldsAndLabels = response.data.fieldsAndLabels as any;
        } else {
        }
      } catch {
        // caught by Api Monitor
      }
    }),
  }));

type TStaticDataStore = typeof StaticDataStoreModel.Type;

export interface IStaticDataStore extends TStaticDataStore {
  timeZones: any;
}
