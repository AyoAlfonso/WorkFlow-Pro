import * as React from "react";
import styled from "styled-components";
import { TeamPulseBody } from "./team-pulse-body";
import { IMeeting } from "~/models/meeting";

export interface ITeamPulse {
  meeting: IMeeting;
}

export const TeamPulse = ({ meeting }: ITeamPulse): JSX.Element => {
  return (
    <Container>
      <TeamPulseBody meeting={meeting} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
