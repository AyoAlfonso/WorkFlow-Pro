import * as React from "react";
import { useEffect } from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";

import { NavHeader } from "~/components/domains/nav/nav-header";

import { HomeTitle } from "~/components/domains/home/shared-components";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/shared/button";
import { Section1MeetingDetails } from "./components/section-1-meeting-details";

export const Section1 = observer(
  (): JSX.Element => {
    const { t } = useTranslation();
    const {
      companyStore: { company },
      teamStore: { teams },
      forumStore,
    } = useMst();
    const teamId = forumStore.currentForumTeamId || (teams && teams[0] && teams[0].id);
    const companyId = R.path(["id"], company);
    useEffect(() => {
      if (teamId && companyId) {
        forumStore.load(teamId, company.currentFiscalYear);
      }
    }, [companyId, teams, teamId]); //neeed to deal with swtiching year later

    // console.log(teamId, companyId, teams);
    if (!teamId || R.isNil(companyId)) {
      return (
        <Container>
          <HeaderContainer>
            <NavHeader>{t("forum.section1")}</NavHeader>
          </HeaderContainer>
          Loading
        </Container>
      );
    }
    //TODO: will remove nave header when we do the header section
    //TODO: need to sort by scheduled start time from view?
    return (
      <Container>
        <HeaderContainer>
          <NavHeader>{t("forum.section1")}</NavHeader>
        </HeaderContainer>
        <HomeTitle>{forumStore.currentForumYear}</HomeTitle>

        {forumStore.forumYearMeetings.map(meeting => {
          return <Section1MeetingDetails key={`meeting-${meeting.id}`} meeting={meeting} />;
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
            <Icon icon={"Plus"} size={"20px"} style={{ marginTop: "3px" }} />
            Create forum meetings
          </StyledButton>
        ) : (
          <></>
        )}

        <hr />

        <div>
          TODO: Add dropdown to specifty which year - every fiscal year start to the next 2 fiscal
          years, start with current
        </div>
      </Container>
    );
  },
);

const Container = styled.div``;

const HeaderContainer = styled.div`
  display: flex;
`;

const StyledButton = styled(Button)`
  display: flex;
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
`;
