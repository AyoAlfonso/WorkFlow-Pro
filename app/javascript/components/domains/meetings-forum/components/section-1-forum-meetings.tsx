import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Loading } from "~/components/shared/loading";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/shared/button";
import { Text } from "~/components/shared/text";
import { Section1MeetingDetails } from "./section-1-meeting-details";
import { baseTheme } from "~/themes/base";
import { toJS } from "mobx";
import { ColumnContainer, ForumSectionContainer } from "~/components/shared/styles/row-style";
import Popup from "reactjs-popup";
import MeetingTypes from "~/constants/meeting-types";

interface ISection1ForumMeetingsProps {
  company: any;
  teamId: number;
}

export const Section1ForumMeetings = observer(
  ({ company, teamId }: ISection1ForumMeetingsProps): JSX.Element => {
    const { t } = useTranslation();
    const {
      teamStore: { teams },
      forumStore,
    } = useMst();
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentYear, setCurrentYear] = useState<number>(
      company.yearForCreatingAnnualInitiatives,
    );
    const history = useHistory();
    useEffect(() => {
      if (loading && teamId && company) {
        const forumType =
          company?.forumType == "Organisation"
            ? MeetingTypes.ORGANISATION_FORUM_MONTHLY
            : MeetingTypes.FORUM_MONTHLY;
        forumStore.load(teamId, currentYear, forumType).then(() => setLoading(false));
      }
    }, [company, teams.map(t => t.id), teamId]); //neeed to deal with swtiching year later

    const currentTeam = teams.find(team => team.id == teamId);
    if (loading || !currentTeam) {
      return (
        <Container>
          <Loading />
        </Container>
      );
    } else if (forumStore.error) {
      return <></>;
    }

    const fiscalYearRanges = company.forumMeetingsYearRange;
    const renderYearOptions = fiscalYearRanges.map((fiscalYear, key) => (
      <YearOptions
        key={key}
        style={{
          backgroundColor: baseTheme.colors.grey20,
          color: baseTheme.colors.grey60,
        }}
        onClick={() => {
          setLoading(true);
          setCurrentYear(fiscalYear["year"]);
          setDropdownOpen(false);
        }}
      >
        {fiscalYear["year"]}
      </YearOptions>
    ));

    const renderCreateMeetingsButton = () => {
      if (forumStore.forumYearMeetings.length < 12) {
        return (
          <StyledButton
            small
            variant={"grey"}
            onClick={() => {
              forumStore.createMeetingsForYear(
                forumStore.currentForumTeamId,
                currentYear,
                company.forumType,
              );
            }}
          >
            <Icon icon={"Plus"} size={"20px"} />
            <ButtonText>Create forum meetings</ButtonText>
          </StyledButton>
        );
      } else {
        return forumStore.forumYearMeetings.map(meeting => {
          return (
            <Section1MeetingDetails
              key={`meeting-${meeting.id}`}
              meeting={meeting}
              teamMembers={toJS(currentTeam.users)}
            />
          );
        });
      }
    };

    return (
      <Container>
        <SubHeaderContainer>
          <BackHeaderText onClick={() => history.push(`/team/${teamId}`)}>
            {company?.name}
          </BackHeaderText>
          <ChevronRight icon={"Chevron-Left"} size={"10px"} iconColor={"grey100"} />
          <HeaderText> Meeting Management </HeaderText>
          
        </SubHeaderContainer>
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
              onClose={() => setDropdownOpen(false)}
              onOpen={() => setDropdownOpen(true)}
              open={dropdownOpen}
              position="bottom center"
              trigger={
                <DropdownContainer>
                  <StyledHomeTitle>{currentYear}</StyledHomeTitle>
                  <Icon
                    icon={dropdownOpen ? "Chevron-Up" : "Chevron-Down"}
                    size={15}
                    style={{ paddingLeft: "15px" }}
                  />
                </DropdownContainer>
              }
            >
              <>{renderYearOptions}</>
            </Popup>
          </YearPlanContainer>
          <ForumSectionContainer>
            <ColumnContainer>
              <SubHeaderText>{t("forum.explorationTopic.whoTitle")}</SubHeaderText>
            </ColumnContainer>
            <ColumnContainer>
              <SubHeaderText>{t("forum.explorationTopic.topicTitle")}</SubHeaderText>
            </ColumnContainer>
          </ForumSectionContainer>
        </SubHeaderContainer>
        {renderCreateMeetingsButton()}
      </Container>
    );
  },
);

const Container = styled.div``;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: row;
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
  margin-top: 0;
`;

const YearPlanContainer = styled.div`
  width: 335px;
  margin-top: 0;
  margin-bottom: -4px;
`;

const YearOptions = styled(StyledHomeTitle)`
  padding: 10px;
  &:hover {
    cursor: pointer;
  }
`;
const HeaderText = styled.span`
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 25px;
`;

const BackHeaderText = styled(HeaderText)`
  color: ${props => props.theme.colors.grey100};
  margin-right: 0.5em;
  cursor: pointer;
`;

const ChevronRight = styled(Icon)`
  transform: rotate(180deg);
  margin-right: 0.5em;
  margin-top: 0.25em;
`;
