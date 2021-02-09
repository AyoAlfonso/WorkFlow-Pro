import * as React from "react";
import { useEffect, useState } from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MeetingTypes from "~/constants/meeting-types";

import { HomeTitle } from "~/components/domains/home/shared-components";
import { Loading } from "~/components/shared/loading";

import { ParkingLot } from "~/components/domains/meetings-forum/components/parking-lot";

export const Section2 = observer(
  (): JSX.Element => {
    const { t } = useTranslation();
    const {
      companyStore: { company },
      teamStore: { teams },
      meetingStore,
      issueStore,
      forumStore,
    } = useMst();
    const { currentMeeting: upcomingForumMeeting } = meetingStore;

    const { team_id } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const teamId =
      (team_id && parseInt(team_id)) || forumStore.currentForumTeamId || R.path(["0", "id"], teams);

    useEffect(() => {
      if (loading && teamId && company) {
        meetingStore.fetchNextMeeting(teamId, MeetingTypes.FORUM_MONTHLY).then(() => {
          issueStore.fetchIssuesForTeam(teamId);
          issueStore.fetchTeamIssues(teamId).then(() => setLoading(false));
        });
      }
    }, [company, teams.map(t => t.id), team_id]);

    if (loading || R.isNil(upcomingForumMeeting) || upcomingForumMeeting.teamId != teamId) {
      return (
        <Container>
          <HeaderContainer>
            <HeaderText>{t("forum.section2")}</HeaderText>
          </HeaderContainer>
          <Loading />
        </Container>
      );
    }

    return (
      <Container>
        <HeaderContainer>
          <HeaderText>{t("forum.section2")}</HeaderText>
        </HeaderContainer>
        <ParkingLot upcomingForumMeeting={upcomingForumMeeting} />
      </Container>
    );
  },
);

const Container = styled.div``;

const HeaderContainer = styled.div`
  display: flex;
`;

export const HeaderText = styled(HomeTitle)`
  font-size: 20pt;
  font-weight: bold;
  margin-left: 5px;
`;
