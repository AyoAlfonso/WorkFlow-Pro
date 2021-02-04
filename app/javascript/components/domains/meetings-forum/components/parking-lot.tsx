import * as React from "react";
import { useEffect } from "react";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import * as R from "ramda";
import { observer } from "mobx-react";
import { ScheduledIssues } from "~/components/domains/meetings-forum/components/scheduled-issues";
import { ParkingLotIssues } from "~/components/domains/meetings-forum/components/parking-lot-issues";
import { NoUpcomingMeeting } from "~/components/domains/meetings-forum/components/no-upcoming-meeting";
import { IMeeting } from "~/models/meeting";

interface IParkingLotProps {
  upcomingForumMeeting: IMeeting;
}

export const ParkingLot = observer(
  ({ upcomingForumMeeting }: IParkingLotProps): JSX.Element => {
    const { teamId } = upcomingForumMeeting;
    const { issueStore } = useMst(); //use meetingStore to infer upcomingmeeting instead?
    //use effect called when this component is loaded to fetch all issues
    useEffect(() => {
      issueStore.fetchTeamIssues(teamId); //ASSUMPTIONS: must have team id for parking lot

      //TODO: should we just include the meeting_ids with the team_issues themselves?
      if (upcomingForumMeeting) {
        issueStore.fetchTeamIssueMeetingEnablements(upcomingForumMeeting.id);
      }
    }, [teamId]);

    if (R.isNil(upcomingForumMeeting)) {
      return <NoUpcomingMeeting />;
    }

    return (
      <Container>
        <LeftContainer>
          <ScheduledIssues teamId={teamId} upcomingForumMeeting={upcomingForumMeeting} />
        </LeftContainer>
        <RightContainer>
          <ParkingLotIssues teamId={teamId} upcomingForumMeeting={upcomingForumMeeting} />
        </RightContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const LeftContainer = styled(SubContainer)`
  margin-right: 4px;
`;

const RightContainer = styled(SubContainer)`
  margin-left: 4px;
`;
