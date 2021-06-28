import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { ApiResponse } from "apisauce";
import { withEnvironment } from "../lib/with-environment";
import { KeyPerformanceIndicatorModel } from "../models/key-performance-indicator"
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

export const KeyPerformanceIndicatorStoreModel = types
  .model("KeyPerformanceIndicatorStoreModel")
  .props({
    kpi: types.maybeNull(KeyPerformanceIndicatorModel)
  })
  .extend(withEnvironment())
  .views(self => ({

  }))
  .actions(self => ({
    createKPI: flow(function*(KPIData) {
      const response: ApiResponse<any> = yield self.environment.api.createKPI(KPIData);
      if (response.ok) {
        return response.data;
      }
    }),
    getKPI: flow(function*(id) {
      const response: ApiResponse<any> = yield self.environment.api.getKPI(id);
      if (response.ok) {
        self.kpi = response.data;
        return response.data;
      }
    }),
    updateKPI: flow(function*(KPIData) {
      const response: ApiResponse<any> = yield self.environment.api.updateKPI(KPIData);
      if (response.ok) {
        return response.data;
      }
    }),
    deleteKPI: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.updateKPI(self.kpi.id);
      if (response.ok) {
        showToast("KPI deleted", ToastMessageConstants.SUCCESS);
      }
    }) 
  }))
