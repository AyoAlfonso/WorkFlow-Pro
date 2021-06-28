import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { ScorecardModel } from "../models/scorecard";
import { KeyPerformanceIndicatorModel } from "../models/key-performance-indicator";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import * as R from "ramda";

export const ScorecardStoreModel = types
  .model("ScorecardStoreModel")
  .props({
    scorecard: types.maybeNull(ScorecardModel),
    kpi: types.maybeNull(KeyPerformanceIndicatorModel)
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    createScorecardLog:  flow(function*(ScorecardLogData) {
      const response = yield self.environment.api.createScorecardLog(self.kpi.id, ScorecardLogData); 
      if (response.ok) {
        return response.data
      }
    }),
  }))
