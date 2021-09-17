export const setRelatedParents = (KPIs, setDeep) => {
  // return KPIs.map(kpi => {
  //   if (kpi.parent_type) {
  //     kpi.related_parent_kpis.map((datum, index) => {
  //       if (datum.period) {
  //         for (year in datum.period) {
  //           for (week in datum.period[year]) {
  //             setDeep(kpi.period, [`${year}`, `${week}`], datum.period[year][week], true);
  //             if (kpi.parent_type == "rollup") {
  //               kpi.period[year][week] = {
  //                 score: kpi.period[year][week].score
  //                   ? kpi.period[year][week].score + datum.period[year][week].score
  //                   : datum.period[year][week].score,
  //                 fiscal_quarter: datum.period[year][week].fiscal_quarter,
  //                 fiscal_year: year,
  //                 week: week,
  //               };
  //             } else if (kpi.parent_type == "avr") {
  //               const old_averge = kpi.period[year][week].score
  //                 ? kpi.period[year][week].score
  //                 : datum.period[year][week].score;
  //               const new_value = datum.period[year][week].score;
  //               const new_size = index + 1;
  //               kpi.period[year][week] = {
  //                 score: old_averge + (new_value - old_averge) / new_size,
  //                 fiscal_quarter: datum.period[year][week].fiscal_quarter,
  //                 fiscal_year: year,
  //                 week: week,
  //               };
  //             } else if (kpi.parent_type == "existing") {
  //               kpi.period[year][week] = {
  //                 score: datum.period[year][week].score,
  //                 fiscal_quarter: datum.period[year][week].fiscal_quarter,
  //                 fiscal_year: year,
  //                 week: week,
  //               };
  //             }
  //           }
  //         }
  //       }
  //     });
  //   }
  //   return kpi;
  // });
};
