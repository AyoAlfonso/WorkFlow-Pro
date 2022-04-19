import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useParams } from "react-router-dom";
import { Loading } from "../../shared/loading";
import { DummyScorecardTableView } from "./dummy-scorecard-tableview";
import { DummyScorecardSummary } from "./dummy-scorecard-summary";
import { AddKPIDropdown } from "./shared/add-kpi-dropdown";
import { toJS, autorun } from "mobx";
import { Icon } from "~/components/shared/icon";
import { IconContainerWithPadding } from "~/components/shared/icon";
import { Heading } from "~/components/shared";
import { baseTheme } from "~/themes";

interface IScorecardsIndexProps {
  ownerType?: string;
  ownerId?: number;
  isMiniEmbed?: boolean;
}

export const DummyScorecardsIndex = observer(
  ({}: IScorecardsIndexProps): JSX.Element => {
    const { primary100 } = baseTheme.colors;
    // let { owner_type, owner_id } = useParams();
    // owner_type = ownerType ? ownerType : owner_type;
    // owner_id = ownerId ? ownerId : owner_id;

    // const {
    //   companyStore,
    //   scorecardStore,
    //   teamStore,
    //   userStore,
    //   keyPerformanceIndicatorStore,
    // } = useMst();
    // const [loading, setLoading] = useState<boolean>(true);
    // const [kpis, setKpis] = useState([]);
    // const [tableKPIs, setTableKPIs] = useState([]);
    // const [scorecardOwner, setScorecardOwner] = useState<any>({});
    // const { allKPIs } = keyPerformanceIndicatorStore;
    // const [viewEditKPIModalOpen, setViewEditKPIModalOpen] = useState(true);
    // const setKPIs = value => {
    //   setKpis([]);
    //   setKpis(value);
    //   setViewEditKPIModalOpen(true);
    // };
    // useEffect(() => {
    //   setLoading(true);
    //   userStore.load();
    //   teamStore.load();
    //   keyPerformanceIndicatorStore.load();
    //   companyStore.load();
    // }, []);

    // useEffect(() => {
    //   if (owner_type && owner_id) {
    //     scorecardStore
    //       .getScorecard({ ownerType: owner_type, ownerId: owner_id })
    //       .then(() => {
    //         setKpis(scorecardStore.kpis);
    //         setTableKPIs(scorecardStore.kpis);
    //       })
    //       .then(() => setLoading(false));
    //   }
    // }, [owner_type, owner_id]);

    // if (
    //   loading ||
    //   !companyStore.company ||
    //   !userStore.users ||
    //   !teamStore.teams ||
    //   !keyPerformanceIndicatorStore ||
    //   !owner_type ||
    //   !owner_id
    // ) {
    //   return <Loading />;
    // }

    return (
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
                <Talktous
                // type="button"
                onClick={(e) => {
                e.preventDefault();
                window.location.href='http://go.lynchpyn.com/upgrade';
                }}>
                Talk to us
                </Talktous>
            </Upgradetextcontainer>
        </Wrapper>
      <Container>
        <ScorecardOwnerContainer>
            <OwnerHeading type={"h3"} fontSize={"20px"} fontWeight={600} mt={0}>
                {"selector"}
            </OwnerHeading>
            <StyledChevronIconContainer>
                <StyledChevronIcon
                    icon={"Chevron-Down"}
                    size={"12px"}
                    iconColor={primary100}
                    />
            </StyledChevronIconContainer>
        </ScorecardOwnerContainer>
        <DummyScorecardSummary/>
        <DummyScorecardTableView/>
      </Container>
      </Overlay>
    )
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

const StyledChevronIconContainer = styled.div`
  display: inline-block;
`;

const ScorecardOwnerContainer = styled.div`
  align-items: baseline;
`;

const StyledChevronIcon = styled(Icon)`
  display: inline-block;
  padding: 0px 15px;
`;

const OwnerHeading = styled(Heading)`
  display: inline-block;
`;
