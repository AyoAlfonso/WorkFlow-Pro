import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { TeamIssuesContainer } from "~/components/domains/meetings/shared/team-issues-container";
import { ScheduledIssuesContainer } from "~/components/domains/meetings-forum/components/scheduled-issues";
import { HomeContainerBorders } from "~/components/domains/home/shared-components"

interface IParkingLotProps {
  teamId: number;
  upcomingForumMeeting: number;
};

export const ParkingLot = observer(({
  teamId,
  upcomingForumMeeting,
}: IParkingLotProps): JSX.Element => {
  return (
    <Container>
      <LeftContainer>
        <ScheduledIssuesContainer upcomingForumMeeting={upcomingForumMeeting} />
      </LeftContainer>
      <RightContainer>
        <TeamIssuesContainer teamId={teamId} />
      </RightContainer>
    </Container>
  )
})

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftContainer = styled(HomeContainerBorders)`
  display: flex;
  flex-direction: column;
  width: 50%;
  box-shadow: none;
`;

const RightContainer = styled(HomeContainerBorders)`
  display: flex;
  flex-direction: column;
  width: 50%;
  box-shadow: none;
`;

