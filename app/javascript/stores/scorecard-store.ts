import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { ApiResponse } from "apisauce";
// import { ScorecardLogModel } from "../models/scorecard";
import { KeyPerformanceIndicatorModel } from "../models/key-performance-indicator";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import * as R from "ramda";

export const ScorecardStoreModel = types
  .model("ScorecardStoreModel")
  .props({
    kpis: types.array(KeyPerformanceIndicatorModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  // .actions(self => ({
  //    get reset () {
  //     self.kpis = [] as any;
  //   })
  // }))
  .actions(self => ({
    getScorecard: flow(function*({ownerType, ownerId}) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getScorecard({
          ownerType,
          ownerId,
        });
        if (response.ok) {
          self.kpis = response.data;
        }
      } catch(e) {
        console.error(e)
        showToast(`Could not get ${ownerType} scorecard with id ${ownerId}.`, ToastMessageConstants.ERROR);
      }
    }),
  }));

type ScorecardStoreType = typeof ScorecardStoreModel.Type;
export interface IScorecardStore extends ScorecardStoreType {
  kpis: any;
}
