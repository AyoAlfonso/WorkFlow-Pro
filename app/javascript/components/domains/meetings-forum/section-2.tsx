import * as React from "react";
import { useEffect } from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { NavHeader } from "~/components/domains/nav/nav-header";
import { HomeTitle } from "~/components/domains/home/shared-components";
import { ParkingLot } from "~/components/domains/meetings-forum/components/parking-lot";

export const Section2 = observer((): JSX.Element => {
  const { t } = useTranslation();
  const {
    companyStore: { company },
    teamStore: { teams },
    forumStore,
  } = useMst();
  const teamId = forumStore.currentForumTeamId || (teams && teams[0] && teams[0].id);
  const upcomingForumMeeting = forumStore.upcomingForumMeeting;
  const companyId = R.path(["id"], company);

  useEffect(() => {
    if (teamId && companyId) {
      forumStore.load(teamId, company.currentFiscalYear);
    }
  }, [companyId, teams, teamId]);

  if (!teamId || R.isNil(companyId)) {
    return (
      <Container>
        <HeaderContainer>
          <NavHeader>{t("forum.section2")}</NavHeader>
        </HeaderContainer>
        Loading
      </Container>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        <NavHeader>{t("forum.section2")}</NavHeader>
      </HeaderContainer>
      <HomeTitle>{forumStore.currentForumYear}</HomeTitle>
      <ParkingLot teamId={teamId} upcomingForumMeeting={upcomingForumMeeting} />
    </Container>
  )
})

const Container = styled.div``;

const HeaderContainer = styled.div`
  display: flex;
`;
