import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useParams } from "react-router-dom";
import { space, color } from "styled-system";
import { Loading } from "../../shared/loading";
import { ScorecardTableView } from "./scorecard-table-view";
import { ScorecardSelector } from "./scorecard-selector";
import { ScorecardSummary } from "./scorecard-summary";
import { AddKPIDropdown } from "./shared/add-kpi-dropdown";
import { toJS, autorun } from "mobx";

interface IScorecardsIndexProps {
  ownerType?: string;
  ownerId?: number;
  isMiniEmbed?: boolean;
}

export const ScorecardsIndex = observer(
  ({ ownerType, ownerId, isMiniEmbed }: IScorecardsIndexProps): JSX.Element => {
    let { owner_type, owner_id } = useParams();
    owner_type = ownerType || owner_type;
    owner_id = ownerId || owner_id;

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
    const [kpiFilter, setkpiFilter] = useState<string>("open");
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
    }, [owner_type, owner_id, kpis]);
    const renderFilterOptions = () => {
      return (
        <FilterContainer>
          <FilterOptionContainer underline={kpiFilter == "open"}>
            <FilterOptions
              onClick={() => setkpiFilter("open")}
              color={kpiFilter == "open" ? "primary100" : "grey40"}
            >
              Open
            </FilterOptions>
          </FilterOptionContainer>
          <FilterOptionContainer underline={kpiFilter == "closed"}>
            <FilterOptions
              onClick={() => setkpiFilter("closed")}
              color={kpiFilter == "closed" ? "primary100" : "grey40"}
            >
              Closed
            </FilterOptions>
          </FilterOptionContainer>
        </FilterContainer>
      );
    };

    /* Table KPIs are separated from allKPIs to optimize the rendering of the table */
    const tableKPIsToShow = () => {
      switch (kpiFilter) {
        case "open":
          return scorecardStore.allOpenTableKPIs;
        case "closed":
          return scorecardStore.allCloseTableKPIs;
        default:
          return tableKPIs;
      }
    };

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
        <ScorecardSummary
          kpis={tableKPIsToShow()}
          currentWeek={companyStore.company.weekNumber}
          currentQuarter={companyStore.company.currentFiscalQuarter}
          fiscalYearStart={companyStore.company.fiscalYearStart}
          currentFiscalYear={companyStore.company.yearForCreatingAnnualInitiatives}
        />
        {renderFilterOptions()}
        <ScorecardTableView
          tableKPIs={tableKPIsToShow()}
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

const FilterContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3px;
  width: 8%;
  float: left;
`;
type FilterOptionContainerType = {
  underline: boolean;
};
const FilterOptionContainer = styled.div<FilterOptionContainerType>`
  border-bottom: ${props => props.underline && `4px solid ${props.theme.colors.primary100}`};
  padding-left: 4px;
  padding-right: 4px;
  padding-bottom: 4px;
  margin-left: 4px;
  margin-right: 4px;
`;

type FilterOptionsType = {
  mr?: string;
};

const FilterOptions = styled.p<FilterOptionsType>`
  ${space}
  ${color}
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  margin-top: 4px;
  margin-bottom: 0;
`;
