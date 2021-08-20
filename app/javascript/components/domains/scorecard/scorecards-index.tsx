import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useParams } from "react-router-dom";
import { Loading } from "../../shared/loading";
import { ScorecardTableView } from "./scorecard-table-view";
import { ScorecardSelector } from "./scorecard-selector";
import { ScorecardSummary } from "./scorecard-summary";
import { AddKPIDropdown } from "./shared/add-kpi-dropdown"
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
    const [scorecardOwner, setScorecardOwner] = useState<any>({});

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

    return kpis.length != 0 ? (
      <Container>
        <ScorecardSelector ownerType={owner_type} ownerId={owner_id} setScorecardOwner={setScorecardOwner}/>
        <ScorecardSummary
          kpis={kpis}
          currentWeek={companyStore.company.currentFiscalWeek}
          currentQuarter={companyStore.company.currentFiscalQuarter}
          fiscalYearStart={companyStore.company.fiscalYearStart}
          currentFiscalYear={companyStore.company.currentFiscalYear}
        />
        <ScorecardTableView kpis={kpis} allKPIs={allKPIs} />
      </Container>
    ) : (
        <Container>
          <ScorecardSelector ownerType={owner_type} ownerId={owner_id} setScorecardOwner={setScorecardOwner}/>
          <EmptyContainer>
            <EmptyTitle>Empty Scorecard</EmptyTitle>
            <EmptySubtitle>{`${scorecardOwner?.name}${scorecardOwner?.lastName ? " " + scorecardOwner.lastName:""}`} has no KPIs yet. Add your first one here.</EmptySubtitle>
            <AddKPIsContainer>
              <AddKPIDropdown />
            </AddKPIsContainer>
          </EmptyContainer>
        </Container>
      );
  },
);

const Container = styled.div``;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-block: 25vh;
`;

const EmptyTitle = styled.div`
  font-family: Exo;
  font-weight: bold;
  font-size: 48px;
  text-align: center;
`

const EmptySubtitle = styled.div`
  font-family: Exo;
  font-size: 20px;
  text-align: center;
`

const AddKPIsContainer = styled.div``
