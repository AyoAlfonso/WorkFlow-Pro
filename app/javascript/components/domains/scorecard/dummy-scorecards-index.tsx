import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useParams } from "react-router-dom";
import { Loading } from "../../shared/loading";
import { DummyScorecardTableView } from "./dummy-scorecard-tableview";
import { DummyScorecardSelector } from "./dummy-scorecard-selector";
import { DummyScorecardSummary } from "./dummy-scorecard-summary";
import { AddKPIDropdown } from "./shared/add-kpi-dropdown";
import { toJS, autorun } from "mobx";
import { Icon } from "~/components/shared/icon";
import { IconContainerWithPadding } from "~/components/shared/icon";

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
      <Overlay>
      <Wrapper>
      <Upgradetextcontainer>
        <IconWrapper>
        <Icon icon={"Scorecard_New"} size={160} iconColor={"#005FFE"} />
        </IconWrapper>
        <Boldtext>
          Get the information you need to drive success in your business
        </Boldtext>
        <Subtext>
          Upgrade to a higher tier to get access to Scorecard
        </Subtext>
        {/* <Link to="http://go.lynchpyn.com/upgrade"> */}
        <Talktous
        // type="button"
        onClick={(e) => {
          e.preventDefault();
          window.location.href='http://go.lynchpyn.com/upgrade';
        }}>
          Talk to us
        </Talktous>
        {/* </Link> */}
      </Upgradetextcontainer>
      </Wrapper>
      <Container>
        <DummyScorecardSelector
          ownerType={owner_type}
          ownerId={owner_id}
          setScorecardOwner={setScorecardOwner}
          isMiniEmbed={isMiniEmbed}
        />
        <DummyScorecardSummary
          kpis={kpis}
          currentWeek={companyStore.company.currentFiscalWeek}
          currentQuarter={companyStore.company.currentFiscalQuarter}
          fiscalYearStart={companyStore.company.fiscalYearStart}
          currentFiscalYear={companyStore.company.yearForCreatingAnnualInitiatives}
        />
        <DummyScorecardTableView
          tableKPIs={tableKPIs}
          allKPIs={allKPIs}
          setKpis={setKPIs}
          viewEditKPIModalOpen={viewEditKPIModalOpen}
          setViewEditKPIModalOpen={setViewEditKPIModalOpen}
          isMiniEmbed={isMiniEmbed}
        />
      </Container>
      </Overlay>
    ) : (
      <Overlay>
      <Upgradetextcontainer>
        <IconContainerWithPadding>
        <Icon icon={"Plan"} size={16} iconColor={"blue"} />
        </IconContainerWithPadding>
        <Boldtext>
          Get the information you need to drive success in your business
        </Boldtext>
        <Subtext>
          Upgrade to a higher tier to get access to Scorecard
        </Subtext>
        <Talktous>
          Talk to us
        </Talktous>
      </Upgradetextcontainer>
      <Container>
        <DummyScorecardSelector
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
      </Overlay>
    );
  },
);

const Overlay = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  height: 0;
  width: 100%;
  postion: absolute;
`;

const Upgradetextcontainer = styled.div`
  width:100%;
  text-align: center;
  border-top: 1px solid white;
`;

const IconWrapper = styled.div`
  margin-top: 120px;
`;

const Boldtext = styled.div`
  font-family: exo;
  font-weight: bold;
  font-size: 36px;
  line-spacing: 48;
  text-align: center;
  margin-top: 48px;
  margin-bottom: 32px;
  max-width: 720px;
  display: inline-block;
`;

const Subtext = styled.div`
  font-family: exo;
  font-weight: regular;
  font-size: 20px;
  line-spacing: 27;
  margin-bottom: 24px;
`;

const Talktous = styled.div`
  width: 120px;
  height: 28px;
  background: #005FFE 0% 0% no-repeat padding-box;
  border: 1px solid #005FFE;
  border-radius: 4px;
  opacity: 1;
  font-family: lato;
  font-weight: bold;
  font-size: 12px;
  color: #FFFFFF;
  display: inline-block;
  padding-top: 11px;
  line-spacing: 24;
 `;
  
const Container = styled.div`
  filter: blur(10px);
  position: absolute;
  opacity: 0.35;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-block: 25vh;
  //border: 1px solid black;
`;

const EmptyTitle = styled.div`
  font-family: Exo;
  font-weight: bold;
  font-size: 48px;
  text-align: center;
  //border: 1px solid black;
`;

const EmptySubtitle = styled.div`
  font-family: Exo;
  font-size: 20px;
  text-align: center;
  //border: 1px solid black;
`;

const AddKPIsContainer = styled.div`
  //border: 1px solid black;
`;
