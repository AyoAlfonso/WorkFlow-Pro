import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useParams } from "react-router-dom";
import { Loading } from "../../shared/loading";
import { ScorecardTableView } from "./scorecard-table-view";
import { ScorecardSelector } from "./scorecard-selector";
import { ScorecardSummary } from "./scorecard-summary";
import { AddKPIDropdown } from "./shared/add-kpi-dropdown";
import { toJS, autorun } from "mobx";

interface IScorecardsIndexProps {
  ownerType?: string;
  ownerId?: number;
  miniEmbed?: boolean;
}

export const ScorecardsIndex = observer(
  ({ ownerType, ownerId, miniEmbed }: IScorecardsIndexProps): JSX.Element => {
    let { owner_type, owner_id } = useParams();
    owner_type = ownerType ? ownerType : owner_type;
    owner_id = ownerId ? ownerId : owner_id;

    const {
      companyStore,
      scorecardStore,
      teamStore,
      userStore,
      keyPerformanceIndicatorStore,
    } = useMst();
    const [loading, setLoading] = useState<boolean>(true);
    const [kpis, setKpis] = useState([]);
    const [kpisForTableView, setKpisForTableView] = useState([]);
    const [scorecardOwner, setScorecardOwner] = useState<any>({});
    const { allKPIs } = keyPerformanceIndicatorStore;
    const [viewEditKPIModalOpen, setViewEditKPIModalOpen] = useState(true);
    const setKPIs = value => {
      setKpis([]);
      setKpis(value);
      setViewEditKPIModalOpen(true);
    };
    useEffect(() => {
      setLoading(true);
      userStore.load();
      teamStore.load();
      keyPerformanceIndicatorStore.load();
      companyStore.load();
    }, []);

    useEffect(() => {
      if (owner_type && owner_id) {
        scorecardStore
          .getScorecard({ ownerType: owner_type, ownerId: owner_id })
          .then(() => {
            setKpis(scorecardStore.kpis);
            setKpisForTableView(scorecardStore.kpis);
          })
          .then(() => setLoading(false));
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

    return kpis.length != 0 ? (
      <Container>
        <ScorecardSelector
          ownerType={owner_type}
          ownerId={owner_id}
          setScorecardOwner={setScorecardOwner}
          miniEmbed={miniEmbed}
        />
        <ScorecardSummary
          kpis={kpis}
          currentWeek={companyStore.company.currentFiscalWeek}
          currentQuarter={companyStore.company.currentFiscalQuarter}
          fiscalYearStart={companyStore.company.fiscalYearStart}
          currentFiscalYear={companyStore.company.currentFiscalYear}
        />
        <ScorecardTableView
          kpis={kpisForTableView}
          allKPIs={allKPIs}
          setKpis={setKPIs}
          viewEditKPIModalOpen={viewEditKPIModalOpen}
          setViewEditKPIModalOpen={setViewEditKPIModalOpen}
          miniEmbed={miniEmbed}
        />
      </Container>
    ) : (
      <Container>
        <ScorecardSelector
          ownerType={owner_type}
          ownerId={owner_id}
          setScorecardOwner={setScorecardOwner}
          miniEmbed={miniEmbed}
        />
        <EmptyContainer>
          <EmptyTitle>Empty Scorecard</EmptyTitle>
          <EmptySubtitle>
            {`${scorecardOwner?.name}${
              scorecardOwner?.lastName ? " " + scorecardOwner.lastName : ""
            }`}{" "}
            has no KPIs yet. Add your first one here.
          </EmptySubtitle>
          {!miniEmbed && (
            <AddKPIsContainer>
              <AddKPIDropdown kpis={allKPIs} />
            </AddKPIsContainer>
          )}
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
`;

const EmptySubtitle = styled.div`
  font-family: Exo;
  font-size: 20px;
  text-align: center;
`;

const AddKPIsContainer = styled.div``;
