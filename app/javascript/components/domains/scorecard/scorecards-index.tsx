import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useParams } from "react-router-dom";
import { Loading } from "../../shared/loading"
import { ScorecardTableView } from "./scorecard-table-view"
import { ScorecardSelector } from "./scorecard-selector"
import { ScorecardSummary } from "./scorecard-summary"
import { toJS } from "mobx"

export const ScorecardsIndex = observer(
  (): JSX.Element => {
    const { owner_type, owner_id } = useParams();
    const { companyStore, scorecardStore } = useMst();
    const [loading, setLoading] = useState<boolean>(true);
    const [kpis, setKpis] = useState([]);

    useEffect(() => {
      companyStore.load().then(() => setLoading(false));
    }, []);

    useEffect(() => {
      scorecardStore
        .getScorecard(owner_type, owner_id)
        .then(() => setKpis(toJS(scorecardStore.kpis)));
    }, [owner_type, owner_id]);

    if (loading || !companyStore.company) {
      return <Loading />;
    }

    return (
      <Container>
        <ScorecardSelector/>
        <ScorecardSummary
          kpis={kpis}
          currentWeek={companyStore.company.currentFiscalWeek}
          currentQuarter={companyStore.company.currentFiscalQuarter}
          fiscalYearStart={companyStore.company.fiscalYearStart}
          currentFiscalYear={companyStore.company.currentFiscalYear}
        />
        <ScorecardTableView kpis={kpis} />
      </Container>
    );
  },
);

const Container = styled.div``;
