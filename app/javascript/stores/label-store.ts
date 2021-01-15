import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { LabelModel } from "../models";
import { ApiResponse } from "apisauce";

export const LabelStoreModel = types
  .model("LabelStoreModel")
  .props({
    labelsList: types.optional(types.array(LabelModel), []),
    selectedLabelObj: types.maybeNull(LabelModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    fetchLabels: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getLabels();
      if (response.ok) {
        self.labelsList = response.data;
      }
    }),
    setSelectedLabelObj(label) {
      self.selectedLabelObj = { ...label };
    },
  }));

type LabelStoreType = typeof LabelStoreModel.Type;
export interface ILabelStore extends LabelStoreType {
  labels: any;
}
