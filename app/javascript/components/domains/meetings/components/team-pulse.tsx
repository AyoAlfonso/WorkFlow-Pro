import * as React from "react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { TeamPulseBody } from "./team-pulse-body";

export const TeamPulse = (): JSX.Element => {
  const { meetingStore } = useMst();
  const meeting = meetingStore.currentMeeting;

  return (
    <Container>
      <TeamPulseBody meeting={meeting} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
