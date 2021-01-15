import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { LabelType } from "../types/label";
import { ApiResponse } from "apisauce";

export const LabelStoreModel = types
  .model("LabelStoreModel")
  .props({
    labelsList: types.array(types.frozen<LabelType>())
  })
  .extend(withEnvironment())
  .views(self => ({
    get labels() {
      return self.labelsList;
    }
  }))
  .actions(self => ({
    fetchLabels: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getLabels();
      if (response.ok) {
        self.labelsList = response.data;
      }
    }),
  }));

type LabelStoreType = typeof LabelStoreModel.Type;
export interface ILabelStore extends LabelStoreType {
  labels: any;
}
