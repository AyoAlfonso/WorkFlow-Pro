import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useParams } from "react-router-dom";
<<<<<<< HEAD
import { Loading } from "../../shared/loading"
import { ScorecardTableView } from "./scorecard-table-view"
import { ScorecardSelector } from "./scorecard-selector"
import { ScorecardSummary } from "./scorecard-summary"
import { toJS } from "mobx"
=======
import { Loading } from "../../shared/loading";
import { ScorecardTableView } from "./scorecard-table-view";
import { ScorecardSelector } from "./scorecard-selector";
import { toJS } from "mobx";
>>>>>>> 266f8aa32719f14755e58cb520515d66eb6b9942

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
     if(ownerType && ownerId ) {
      scorecardStore
        .getScorecard({ ownerType, ownerId })
        .then(() => setKpis(toJS(scorecardStore.kpis)));
      }
    }, [ownerType, ownerId]);

    if (loading || !companyStore.company) {
      return <Loading />;
    }

    return (
      <Container> 
        <ScorecardSelector ownerType={ownerType} ownerId={ownerId}/>
        <ScorecardTableView kpis={scorecardStore.kpis} />
      </Container>
    );
  },
);

const Container = styled.div``;
