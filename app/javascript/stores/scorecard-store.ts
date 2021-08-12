import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { ApiResponse } from "apisauce";
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
  .actions(self => ({
    getScorecard: flow(function*({ ownerType, ownerId }) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getScorecard({
          ownerType,
          ownerId,
        });
        if (response.ok && response.data?.kpi.length) {
          self.kpis = response.data.kpi;
        }
      } catch (e) {
        console.error(e);
        showToast(
          `Could not get ${ownerType} scorecard with id ${ownerId}.`,
          ToastMessageConstants.ERROR,
        );
      }
    }),
  }));

type ScorecardStoreType = typeof ScorecardStoreModel.Type;
export interface IScorecardStore extends ScorecardStoreType {
  kpis: any;
}
