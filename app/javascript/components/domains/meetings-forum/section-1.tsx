import * as React from "react";
import { useEffect, useState } from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toJS } from "mobx";

import { NavHeader } from "~/components/domains/nav/nav-header";
import { Loading } from "~/components/shared/loading";

import { HomeTitle } from "~/components/domains/home/shared-components";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/shared/button";
import { Section1MeetingDetails } from "./components/section-1-meeting-details";
import { Text } from "~/components/shared/text";

import {
  MonthContainer,
  ColumnContainer,
  Container as SectionContainer,
} from "./components/row-style";
import Popup from "reactjs-popup";

export const Section1 = observer(
  (): JSX.Element => {
    const { t } = useTranslation();
    const {
      companyStore: { company },
      teamStore: { teams },
      forumStore,
    } = useMst();

    // if there is a no team id, get the first team
    const { team_id } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const teamId =
      (team_id && parseInt(team_id)) || forumStore.currentForumTeamId || R.path(["0", "id"], teams);

    useEffect(() => {
      if (loading && teamId && company) {
        forumStore.load(teamId, company.currentFiscalYear).then(() => setLoading(false));
      }
    }, [company, teams.map(t => t.id), team_id]); //neeed to deal with swtiching year later
    
    const currentTeam = teams.find(team => team.id == teamId);
    
    if (loading || !currentTeam) {
      return (
        <Container>
          <HeaderContainer>
            <NavHeader>{t("forum.section1")}</NavHeader>
          </HeaderContainer>
          <Loading />
        </Container>
      );
    } else if (forumStore.error) {
      return <></>;
    }
    //TODO: will remove nave header when we do the header section
    //TODO: need to sort by scheduled start time from view?

    const fiscalYearRanges = company.fiscalYearRange;
    const renderYearOptions = fiscalYearRanges.map((fiscalYear, key) => (
      <StyledHomeTitle
        style={{
          backgroundColor: "grey"
        }}
      >
        {fiscalYear["year"]}
      </StyledHomeTitle>
    ));
      
    return (
      <Container>
        <HeaderContainer>
          <NavHeader>{t("forum.section1")}</NavHeader>
        </HeaderContainer>

        {forumStore.forumYearMeetings.length < 12 ? (
          <StyledButton
            small
            variant={"grey"}
            onClick={() => {
              forumStore.createMeetingsForYear(forumStore.currentForumTeamId);
            }}
          >
            <Icon icon={"Plus"} size={"20px"} />
            <ButtonText>Create forum meetings</ButtonText>
          </StyledButton>
        ) : (
          <>
            <SubHeaderContainer>
              <YearPlanContainer>
                <Popup
                  arrow={false}
                  closeOnDocumentClick
                  contentStyle={{
                    border: "none",
                    borderRadius: "6px",
                    overflow: "hidden",
                    padding: 0,
                    width: "175px",
                  }}
                  on="click"
                  onClose={() =>
                    setDropdownOpen(false)
                  }
                  onOpen={() =>
                    setDropdownOpen(true)
                  }
                  open={dropdownOpen}
                  position="bottom center"
                  trigger={
                    <StyledHomeTitle>{forumStore.currentForumYear}</StyledHomeTitle>
                  }
                >
                  <div>
                    {renderYearOptions}
                  </div>
                </Popup>
              </YearPlanContainer>
              <SectionContainer>
                <ColumnContainer>
                  <SubHeaderText>{t("forum.explorationTopic.whoTitle")}</SubHeaderText>
                </ColumnContainer>
                <ColumnContainer>
                  <SubHeaderText>{t("forum.explorationTopic.topicTitle")}</SubHeaderText>
                </ColumnContainer>
              </SectionContainer>
            </SubHeaderContainer>

            {forumStore.forumYearMeetings.map(meeting => {
              return (
                <Section1MeetingDetails
                  key={`meeting-${meeting.id}`}
                  meeting={meeting}
                  teamMembers={toJS(currentTeam.users)}
                />
              );
            })}
          </>
        )}
      </Container>
    );
  },
);

const Container = styled.div``;

const HeaderContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const StyledButton = styled(Button)`
  display: flex;
  margin-top: 15px;
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
`;

const ButtonText = styled(Text)`
  margin-left: 15px;
`;

const StyledHomeTitle = styled.div`
  margin-top: 25px;
  margin-bottom: 10px;
  font-size: 20pt;
  font-weight: 600;
  font-family: Exo;
  margin-top: auto;
  margin-bottom: auto;
`;

const SubHeaderContainer = styled.div`
  display: flex;
  height: 50px;
  margin-bottom: 20px;
`;

const SubHeaderText = styled(Text)`
  font-weight: bold;
`;

const YearPlanContainer = styled.div`
  width: 216px;
  margin-top: auto;
`;
