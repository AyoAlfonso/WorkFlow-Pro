import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useParams } from "react-router-dom";
import { Loading } from "../../shared/loading";
import { DummyScorecardTableView } from "./dummy-scorecard-tableview";
import { ScorecardSelector } from "./scorecard-selector";
import { DummyScorecardSummary } from "./dummy-scorecard-summary";
import { AddKPIDropdown } from "./shared/add-kpi-dropdown";
import { toJS, autorun } from "mobx";

interface IScorecardsIndexProps {
  ownerType?: string;
  ownerId?: number;
  isMiniEmbed?: boolean;
}

export const DummyScorecardsIndex = observer(
  ({ ownerType, ownerId, isMiniEmbed }: IScorecardsIndexProps): JSX.Element => {
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
    const [tableKPIs, setTableKPIs] = useState([]);
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
            setTableKPIs(scorecardStore.kpis);
          })
          .then(() => setLoading(false));
      }
    }, [owner_type, owner_id]);

    if (
      loading ||
      !companyStore.company ||
      !userStore.users ||
      !teamStore.teams ||
      !keyPerformanceIndicatorStore ||
      !owner_type ||
      !owner_id
    ) {
      return <Loading />;
    }

    return kpis.length != 0 ? (
      <Container>
        <ScorecardSelector
          ownerType={owner_type}
          ownerId={owner_id}
          setScorecardOwner={setScorecardOwner}
          isMiniEmbed={isMiniEmbed}
        />
        {/* <DummyScorecardSummary
          kpis={kpis}
          currentWeek={companyStore.company.currentFiscalWeek}
          currentQuarter={companyStore.company.currentFiscalQuarter}
          fiscalYearStart={companyStore.company.fiscalYearStart}
          currentFiscalYear={companyStore.company.yearForCreatingAnnualInitiatives}
        /> */}
        <DummyScorecardTableView
          tableKPIs={tableKPIs}
          allKPIs={allKPIs}
          setKpis={setKPIs}
          viewEditKPIModalOpen={viewEditKPIModalOpen}
          setViewEditKPIModalOpen={setViewEditKPIModalOpen}
          isMiniEmbed={isMiniEmbed}
        />
      </Container>
    ) : (
      <Container>
        <ScorecardSelector
          ownerType={owner_type}
          ownerId={owner_id}
          setScorecardOwner={setScorecardOwner}
          isMiniEmbed={isMiniEmbed}
        />
        <EmptyContainer>
          <EmptyTitle>Empty Scorecard</EmptyTitle>
          <EmptySubtitle>
            {`${scorecardOwner?.name}${
              scorecardOwner?.lastName ? " " + scorecardOwner.lastName : ""
            }`}{" "}
            has no KPIs yet. Add your first one here.
          </EmptySubtitle>
          {!isMiniEmbed && (
            <AddKPIsContainer>
              <AddKPIDropdown kpis={allKPIs} />
            </AddKPIsContainer>
          )}
        </EmptyContainer>
      </Container>
    );
  },
);

const Container = styled.div`
    border: 1px solid black;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-block: 25vh;
  border: 1px solid black;
`;

const EmptyTitle = styled.div`
  font-family: Exo;
  font-weight: bold;
  font-size: 48px;
  text-align: center;
  border: 1px solid black;
`;

const EmptySubtitle = styled.div`
  font-family: Exo;
  font-size: 20px;
  text-align: center;
  border: 1px solid black;
`;

const AddKPIsContainer = styled.div`
  border: 1px solid black;
`;
