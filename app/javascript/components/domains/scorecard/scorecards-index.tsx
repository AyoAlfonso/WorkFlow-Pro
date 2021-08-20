import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useParams } from "react-router-dom";
import { Loading } from "../../shared/loading";
import { ScorecardTableView } from "./scorecard-table-view";
import { ScorecardSelector } from "./scorecard-selector";
import { ScorecardSummary } from "./scorecard-summary";
import { toJS } from "mobx";

export const ScorecardsIndex = observer(
  (): JSX.Element => {
    const { owner_type, owner_id } = useParams();
    const {
      companyStore,
      scorecardStore,
      teamStore,
      userStore,
      keyPerformanceIndicatorStore,
    } = useMst();
    const [loading, setLoading] = useState<boolean>(true);
    const [kpis, setKpis] = useState([]);
    const [allKPIs, setallKPIs] = useState([]);

    useEffect(() => {
      userStore.load();
      teamStore.load();
      keyPerformanceIndicatorStore.load().then(()=> setallKPIs(keyPerformanceIndicatorStore.allKPIs));
      companyStore.load().then(() => setLoading(false));
    }, []);

    useEffect(() => {
      if (owner_type && owner_id) {
        scorecardStore
          .getScorecard({ ownerType: owner_type, ownerId: owner_id })
          .then(() => setKpis(toJS(scorecardStore.kpis)));
      }
    }, [owner_type, owner_id]);

    if (
      loading ||
      !companyStore.company ||
      !userStore.users ||
      !teamStore.teams ||
      !keyPerformanceIndicatorStore
    ) {
      return <Loading />;
    }
    // const { allKPIs } = keyPerformanceIndicatorStore;

    return (
      <Container>
        <ScorecardSelector ownerType={owner_type} ownerId={owner_id} />
        <ScorecardSummary
          kpis={kpis}
          currentWeek={companyStore.company.currentFiscalWeek}
          currentQuarter={companyStore.company.currentFiscalQuarter}
          fiscalYearStart={companyStore.company.fiscalYearStart}
          currentFiscalYear={companyStore.company.currentFiscalYear}
        />
        <ScorecardTableView kpis={kpis} allKPIs={allKPIs} />
      </Container>
    );
  },
);

const Container = styled.div``;
