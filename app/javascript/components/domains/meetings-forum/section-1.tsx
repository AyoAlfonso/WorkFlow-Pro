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

    const teamId =
      (team_id && parseInt(team_id)) ||
      forumStore.currentForumTeamId ||
      (teams && teams[0] && teams[0].id);

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

    return (
      <Container>
        <HeaderContainer>
          <NavHeader>{t("forum.section1")}</NavHeader>
        </HeaderContainer>
        <SubHeaderContainer>
          <MonthContainer>
            <StyledHomeTitle>{forumStore.currentForumYear}</StyledHomeTitle>
          </MonthContainer>
          <SectionContainer>
            <ColumnContainer>{t("forum.explorationTopic.whoTitle")}</ColumnContainer>
            <ColumnContainer>{t("forum.explorationTopic.topicTitle")}</ColumnContainer>
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

        {forumStore.forumYearMeetings.length < 12 ? (
          <StyledButton
            small
            variant={"grey"}
            onClick={() => {
              forumStore.createMeetingsForYear(
                forumStore.currentForumTeamId,
                forumStore.currentForumYear,
              );
            }}
          >
            <Icon icon={"Plus"} size={"20px"} />
            <ButtonText>Create forum meetings</ButtonText>
          </StyledButton>
        ) : (
          <></>
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

const StyledHomeTitle = styled(HomeTitle)`
  margin-top: 25px;
  margin-bottom: 10px;
`;

const SubHeaderContainer = styled.div`
  display: flex;
`;
