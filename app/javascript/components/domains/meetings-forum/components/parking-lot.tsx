import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { TeamIssues } from "~/components/domains/meetings/components/team-issues";


export const ParkingLot = observer((props: {}): JSX.Element => {
  return (
    <Container>
      <ScheduledIssues>Scheduled</ScheduledIssues>
      <TeamIssuesContainer>Parking Lot</TeamIssuesContainer>
    </Container>
  )
})

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const ScheduledIssues = styled.div`
  diplay: flex;
  flex-direction: column;
  width: 50%;
`;

const TeamIssuesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;