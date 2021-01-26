import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { ScheduledIssues } from "~/components/domains/meetings-forum/components/scheduled-issues";
import { ParkingLotIssues } from "~/components/domains/meetings-forum/components/parking-lot-issues";

interface IParkingLotProps {
  teamId: number;
  upcomingForumMeeting: any;
};

export const ParkingLot = observer(({
  teamId,
  upcomingForumMeeting,
}: IParkingLotProps): JSX.Element => {
  return (
    <Container>
      <LeftContainer>
        <ScheduledIssues upcomingForumMeeting={upcomingForumMeeting} />
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
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-top: 5px;
  margin-bottom: 5px;
`;

