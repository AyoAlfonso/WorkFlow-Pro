import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { ApiResponse } from "apisauce";
import { KeyPerformanceIndicatorModel } from "../models/key-performance-indicator";
import { showToast } from "~/utils/toast-message";
import { toJS } from "mobx";
import { ToastMessageConstants } from "~/constants/toast-types";
import { setDeep } from "~/utils";
import * as R from "ramda";
import * as _ from "lodash"
import { observable, autorun } from "mobx";

function rollupMemoizer(kpiPeriodYearWeekScore, datumPeriodYearWeekScore) {
  return kpiPeriodYearWeekScore
    ? kpiPeriodYearWeekScore + datumPeriodYearWeekScore
    : datumPeriodYearWeekScore;
}

export const setRelatedParents = KPIs => {
  return KPIs.map(kpi => {
    if (kpi.parentType) {
      kpi.relatedParentKpis.map((datum, index) => {
        if (datum.period) {
          for (const year in datum.period) {
            for (const week in datum.period[year]) {
              setDeep(kpi.period, [`${year}`, `${week}`], datum.period[year][week], true);
              const parents = kpi.period[year][week].parents ? kpi.period[year][week].parents : []
              if (kpi.parentType == "rollup") {
                kpi.period[year][week] = {
                  parents: [...parents, datum.id],
                  score: rollupMemoizer(
                    kpi.period[year][week].score,
                    datum.period[year][week].score,
                  ),
                  fiscalQuarter: datum.period[year][week].fiscalQuarter,
                  fiscalYear: parseInt(year),
                  week: parseInt(week),
                };
              } else if (kpi.parentType == "avr") {
                const old_averge = kpi.period[year][week].score
                  ? kpi.period[year][week].score
                  : datum.period[year][week].score;
                const new_value = datum.period[year][week].score;
                const new_size = index + 1;
                kpi.period[year][week] = {
                  parents: [...parents, datum.id],
                  score: old_averge + (new_value - old_averge) / new_size,
                  fiscalQuarter: datum.period[year][week].fiscalQuarter,
                  fiscalYear: parseInt(year),
                  week: parseInt(week),
                };
              } else if (kpi.parentType == "existing") {
                kpi.period[year][week] = {
                  parents: [...parents, datum.id] ,
                  score: datum.period[year][week].score,
                  fiscalQuarter: datum.period[year][week].fiscalQuarter,
                  fiscalYear: parseInt(year),
                  week: parseInt(week),
                };
              }
            }
          }
        }
      });
    }

    return kpi;
  });
};

export const ScorecardStoreModel = types
  .model("ScorecardStoreModel")
  .props({
    kpis: types.array(KeyPerformanceIndicatorModel),
  })
  .extend(withEnvironment())
  .views(self => ({ }))
  .actions(self => ({
    getScorecard: flow(function*({ ownerType, ownerId }) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getScorecard({
          ownerType,
          ownerId,
        });

        if (response.ok) {
          if(ownerType == 0 && ownerId == 0) {
            return
          }
          self.kpis = setRelatedParents(response.data);
        }
      } catch (e) {
        showToast(
          `Could not get ${ownerType} scorecard with id ${ownerId}.`,
          ToastMessageConstants.ERROR,
        );
      }
    }),
  }))
  .actions(self => ({
    updateKPIs(kpi) {
      if (kpi) {
        const kpis = [...self.kpis, kpi] as any
        self.kpis = kpis
      }
    },
    mergeKPIS(kpi) {
      const kpiIndex = self.kpis.findIndex(KPI => KPI.id == kpi.id);
      const kpis = self.kpis;
      kpis[kpiIndex] = kpi;
      self.kpis = kpis
    },
    deleteKPI(kpi) {
      const updatedKPIs = R.filter(KPI => KPI.id != kpi.id, self.kpis);
      self.kpis = updatedKPIs;
    },
    deleteScorecard(scorecardLog) {
      const kpiIndex = self.kpis.findIndex(KPI => KPI.id == scorecardLog.keyPerformanceIndicatorId);
      self.kpis[kpiIndex].scorecardLogs = self.kpis[kpiIndex].scorecardLogs.filter(
        log => log.id != scorecardLog.id,
      ) as any;
    },
  }));

type ScorecardStoreType = typeof ScorecardStoreModel.Type;
export interface IScorecardStore extends ScorecardStoreType {
  kpis: any;
}
