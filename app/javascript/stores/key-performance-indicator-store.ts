import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { ApiResponse } from "apisauce";
import { withEnvironment } from "../lib/with-environment";
import { KeyPerformanceIndicatorModel } from "../models/key-performance-indicator";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

export const KeyPerformanceIndicatorStoreModel = types
  .model("KeyPerformanceIndicatorStoreModel")
  .props({
    kpi: types.maybeNull(KeyPerformanceIndicatorModel),
    allKPIs: types.array(KeyPerformanceIndicatorModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    load: flow(function*() {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getKPIs();
        if (response.ok) {
          self.allKPIs = response.data;
        }
      } catch (e) {
        showToast("There was an error loading the kpis", ToastMessageConstants.ERROR);
      }
    }),
    createKPI: flow(function*(KPIData) {
      const { scorecardStore, keyPerformanceIndicatorStore } = getRoot(self);
      const response: ApiResponse<any> = yield self.environment.api.createKPI(KPIData);
      if (response.ok) {
        showToast("KPI created", ToastMessageConstants.SUCCESS);
        keyPerformanceIndicatorStore.load();
        scorecardStore.updateKPIs(response.data.kpi);
        return response.data.kpi;
      }
    }),
    getKPI: flow(function*(id) {
      const response: ApiResponse<any> = yield self.environment.api.getKPI(id);
      if (response.ok) {
        self.kpi = response.data.kpi;
        return response.data.kpi;
      }
    }),
    update: flow(function*() {
      const { scorecardStore } = getRoot(self);
      const response: ApiResponse<any> = yield self.environment.api.updateKPI(self.kpi);
      if (response.ok) {
        showToast("KPI updated", ToastMessageConstants.SUCCESS);
        scorecardStore.mergeKPIS(response.data.kpi);
        self.kpi = response.data.kpi;
        return response.data.kpi;
      }
    }),
    updateKPI: flow(function*(KPIData) {
      const { scorecardStore } = getRoot(self);
      const response: ApiResponse<any> = yield self.environment.api.updateKPI(KPIData);
      if (response.ok) {
        showToast("KPI updated", ToastMessageConstants.SUCCESS);
        scorecardStore.mergeKPIS(response.data.kpi);
        self.kpi = response.data.kpi;
        return response.data.kpi;
      }
    }),
    deleteKPI: flow(function*() {
      const { scorecardStore } = getRoot(self);
      const response: ApiResponse<any> = yield self.environment.api.deleteKPI(self.kpi.id);
      scorecardStore.deleteKPI(response.data.kpi);
      if (response.ok) {
        showToast("KPI deleted", ToastMessageConstants.SUCCESS);
      }
    }),
    createScorecardLog: flow(function*(scorecardlog) {
      const { scorecardStore,  } = getRoot(self);
      const response: ApiResponse<any> = yield self.environment.api.createScorecardLog(
        scorecardlog,
      );

      if (response.ok) {
        showToast("Log created", ToastMessageConstants.SUCCESS);
        scorecardStore.mergeKPIS(response.data.kpi);
        self.kpi = response.data.kpi
        return { scorecardLog: response.data.scorecardlog, kpis: scorecardStore.kpis };
      }
    }),
    deleteScorecardLog: flow(function*(id) {
      const { scorecardStore } = getRoot(self);
      const response: ApiResponse<any> = yield self.environment.api.deleteScorecardLog(id);
      if (response.ok) {
        showToast("Log deleted", ToastMessageConstants.SUCCESS);
        scorecardStore.deleteScorecard(response.data.scorecardLog);
        self.kpi = response.data.kpi;
      }
    }),
  }))
  .actions(self => ({
    updateOwnedBy(user) {
      self.kpi = { ...self.kpi, ownedById: user.id };
      self.updateKPI(self.kpi);
    },
      updateKPITitle(field, value) {
      self.kpi = {...self.kpi, title: value};
    }
  }));

type KeyPerformanceIndicatorType = typeof KeyPerformanceIndicatorModel.Type;
export interface IKeyPerformanceIndicatorStore extends KeyPerformanceIndicatorType {
  kpi: any;
}
