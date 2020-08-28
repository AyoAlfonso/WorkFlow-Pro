import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useMst } from "~/setup/root";
import { HomeContainerBorders } from "../../home/shared-components";
import { TeamPulseContainer } from "../shared/team-pulse-container";

export const TeamPulse = (): JSX.Element => {
  const { meetingStore } = useMst();
  const meeting = meetingStore.currentMeeting;

  return (
    <Container>
      <TeamPulseContainer meeting={meeting} />
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  width: 650px;
  margin-left: auto;
  margin-right: auto;
`;
