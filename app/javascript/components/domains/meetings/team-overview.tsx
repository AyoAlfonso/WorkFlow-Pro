import * as React from "react";
import { ModalWithHeader } from "../../shared/modal-with-header";
import { useState } from "react";
import { TextInput } from "../../shared/text-input";
import styled from "styled-components";
import { Icon } from "../../shared/icon";
import { Button } from "~/components/shared/button";
import { baseTheme } from "../../../themes";
import { useMst } from "../../../setup/root";
import * as R from "ramda";
import { Avatar } from "~/components/shared/avatar";
import { Text } from "~/components/shared/text";
import { HomeContainerBorders } from "../home/shared-components";

interface ITeamOverviewProps {}

export const TeamOverview = (props: ITeamOverviewProps): JSX.Element => {
  return (
    <Container>
      <HeaderContainer>
        <Title>Leadership Team Overview</Title>
        <TeamMeetingButton small variant={"grey"} onClick={() => {}}>
          <Icon icon={"team"} size={"20px"} style={{ marginTop: "3px" }} />
          <TeamMeetingText>Team Meeting</TeamMeetingText>
        </TeamMeetingButton>
      </HeaderContainer>
      <BodyContainer>
        <LeftContainer>
          <TeamSnapshotContainer>Team Snapshot</TeamSnapshotContainer>
        </LeftContainer>
        <RightContainer>
          <TeamPulseContainer>Team's Pulse</TeamPulseContainer>
          <TeamIssuesContainer>Team's Issues</TeamIssuesContainer>
        </RightContainer>
      </BodyContainer>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  padding-bottom: 0;
`;

const HeaderContainer = styled.div`
  display: flex;
`;

const Title = styled(Text)`
  font-size: 36px;
`;

const TeamMeetingButton = styled(Button)`
  width: 100px;
  display: flex;
`;

const TeamMeetingText = styled(Text)``;

const BodyContainer = styled.div`
  display: flex;
`;

const LeftContainer = styled.div`
  width: 60%;
`;

const RightContainer = styled.div`
  width: 40%;
`;

const TeamSnapshotContainer = styled(HomeContainerBorders)``;

const TeamPulseContainer = styled(HomeContainerBorders)``;

const TeamIssuesContainer = styled(HomeContainerBorders)``;
