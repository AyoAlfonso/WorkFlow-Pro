import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { ILabel } from "../types";
import { ApiResponse } from "apisauce";

export const LabelStoreModel = types
  .model("LabelStoreModel")
  .props({
    labels: types.array(types.frozen<ILabel>())
  })
  .extend(withEnvironment())
  .views(self => ({
    get labels() {
      return self.labels;
    }
  }))
  .actions(self => ({
    fetchLabels: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getlLabels();
      if (response.ok) {
        self.labels = response.data;
      }
    }),
  }));

type LabelStoreType = typeof LabelStoreModel.Type;
export interface ILabelStore extends LabelStoreType {
  labels: any;
}
