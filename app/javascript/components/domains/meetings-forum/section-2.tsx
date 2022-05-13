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
import { useHistory } from "react-router-dom";
import { Icon } from "~/components/shared";
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
    const { currentMeeting, currentMeeting: upcomingForumMeeting } = meetingStore;

    const { team_id } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(true);
    const [noMeetingRecords, setNoMeetingRecords] = useState(false);
    const teamId =
      (team_id && parseInt(team_id)) || forumStore.currentForumTeamId || R.path(["0", "id"], teams);
    const instanceType = company && company?.accessForum ? "forum" : "teams";
    const [currentYear, setCurrentYear] = useState<number>(
      company?.yearForCreatingAnnualInitiatives,
    );
    const currentTeam = teams.find(team => team.id == teamId);
    const forumType =
      company?.forumType == "Organisation"
        ? MeetingTypes.ORGANISATION_FORUM_MONTHLY
        : MeetingTypes.FORUM_MONTHLY;

    useEffect(() => {
      if (loading && teamId && company) {
        meetingStore.startNextMeeting(teamId, forumType, currentYear).then(({ meeting }) => {
          if (!meeting) {
            setNoMeetingRecords(true);
          }
          issueStore.fetchIssuesForTeam(teamId);
          issueStore.fetchTeamIssues(teamId);
          // .then(() => setLoading(false));
          setLoading(false);
        });
      }
    }, [company, teams?.map(t => t.id), team_id]);

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
        {/* {instanceType === "forum" && <LynchPynBadge />} */}
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

export const NoMeetingRecords = styled.div`
  display: inline-block;
  font-size: 1em;
  font-weight: bold;
`;

const SubHeaderContainer = styled.div`
  display: flex;
  height: 50px;
  margin-bottom: 20px;
`;
const BreadcrumbHeaderText = styled.span`
  display: inline-block;
  font-size: 24px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 25px;
`;

const BackHeaderText = styled(BreadcrumbHeaderText)`
  color: ${props => props.theme.colors.grey100};
  margin-right: 0.5em;
  cursor: pointer;
`;

const ChevronRight = styled(Icon)`
  transform: rotate(180deg);
  margin-right: 0.5em;
  margin-top: 0.25em;
`;
