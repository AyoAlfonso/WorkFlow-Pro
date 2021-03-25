import { types, flow } from "mobx-state-tree";
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
      const response: ApiResponse<any> = yield self.environment.api.getStaticData();
      if (response.ok) {
        self.timeZones = response.data.timeZones as any;
        console.log(self.timeZones);
        self.headingsAndDescriptions = response.data.headingsAndDescriptions as any;
        console.log(self.headingsAndDescriptions);
        self.fieldsAndLabels = response.data.fieldsAndLabels as any;
        console.log(self.fieldsAndLabels);
        return true;
      } else {
        return false;
      }
    }),
  }));

type TStaticDataStore = typeof StaticDataStoreModel.Type;

export interface IStaticDataStore extends TStaticDataStore {
  timeZones: any;
}
