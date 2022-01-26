import * as React from "react";
import { useEffect, useState } from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MeetingTypes from "~/constants/meeting-types";
import { LynchPynBadge } from "./components/lynchpyn-badge";
import { HomeTitle } from "~/components/domains/home/shared-components";
import { Loading } from "~/components/shared/loading";

import { Exploration } from "~/components/domains/meetings-forum/components/exploration";

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
    const instanceType = company && company.accessForum ? "forum" : "teams";

    const forumType =
      company?.forumType == "Organisation"
        ? MeetingTypes.ORGANISATION_FORUM_MONTHLY
        : MeetingTypes.FORUM_MONTHLY;

    useEffect(() => {
      if (loading && teamId && company) {
        meetingStore.startNextMeeting(teamId, forumType).then(({ meeting }) => {
          issueStore.fetchIssuesForTeam(teamId);
          issueStore.fetchTeamIssues(teamId).then(() => setLoading(false));
        });
      }
    }, [company, teams.map(t => t.id), team_id]);

    if (loading || R.isNil(upcomingForumMeeting) || upcomingForumMeeting.teamId != teamId) {
      return (
        <Container>
          <Loading />
        </Container>
      );
    }

    return (
      <Container>
        <Exploration includeExplorationTopic={false} />
        {instanceType === "forum" && <LynchPynBadge />}
      </Container>
    );
  },
);

const Container = styled.div``;

const HeaderContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

export const HeaderText = styled(HomeTitle)`
  font-size: 20pt;
  font-weight: bold;
  margin-left: 5px;
`;
