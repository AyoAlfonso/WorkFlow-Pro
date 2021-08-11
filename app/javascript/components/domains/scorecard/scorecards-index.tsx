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
    const { ownerType, ownerId } = useParams();
    const { companyStore, scorecardStore } = useMst();
    const [loading, setLoading] = useState<boolean>(true);
    const [kpis, setKpis] = useState([]);

    useEffect(() => {
      companyStore.load().then(() => setLoading(false));
    }, []);

    useEffect(() => {
      if (ownerType && ownerId) {
        scorecardStore
          .getScorecard({ ownerType, ownerId })
          .then(() => setKpis(toJS(scorecardStore.kpis)));
      }
    }, [ownerType, ownerId]);

    if (loading || !companyStore.company) {
      return <Loading />;
    }

    return (
<<<<<<< HEAD
      // <<<<<<< HEAD
      <Container>
        <h2>Scorecards</h2>
        <ScorecardSelector ownerType={ownerType} ownerId={ownerId} />
        <ScorecardSummary
          kpis={kpis}
          currentWeek={companyStore.company.currentFiscalWeek}
          currentQuarter={companyStore.company.currentFiscalQuarter}
          fiscalYearStart={companyStore.company.fiscalYearStart}
        />
        <ScorecardTableView kpis={kpis} />
        {/* =======
      <Container> 
        <ScorecardSelector ownerType={ownerType} ownerId={ownerId}/>
        <ScorecardTableView kpis={scorecardStore.kpis} />
>>>>>>> 639efa0504c866d7be6512405f3e876847663866
      </Container> */}
=======
      <Container> 
        <ScorecardSelector ownerType={ownerType} ownerId={ownerId}/>
        <ScorecardTableView kpis={scorecardStore.kpis} />
>>>>>>> d86ac101444340e245d973bc754a48c6158b243e
      </Container>
    );
  },
);

const Container = styled.div``;
