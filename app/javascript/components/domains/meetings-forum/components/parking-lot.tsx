import * as React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { observer } from "mobx-react";
import { ScheduledIssues } from "~/components/domains/meetings-forum/components/scheduled-issues";
import { ParkingLotIssues } from "~/components/domains/meetings-forum/components/parking-lot-issues";
import { NoUpcomingMeeting } from "~/components/domains/meetings-forum/components/no-upcoming-meeting";

interface IParkingLotProps {
  teamId: number;
  upcomingForumMeeting: any;
};

export const ParkingLot = observer(({
  teamId,
  upcomingForumMeeting,
}: IParkingLotProps): JSX.Element => {

  if (R.isNil(upcomingForumMeeting)) {
    return <NoUpcomingMeeting />
  }

  return (
    <Container>
      <LeftContainer>
        <ScheduledIssues teamId={teamId} upcomingForumMeeting={upcomingForumMeeting} />
      </LeftContainer>
      <RightContainer>
        <ParkingLotIssues teamId={teamId}  upcomingForumMeeting={upcomingForumMeeting} />
      </RightContainer>
    </Container>
  )
})

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 4px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 4px;
`;

