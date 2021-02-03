import * as React from "react";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { ContainerHeaderWithText } from "~/components/shared/styles/container-header";
import { TeamMeetingButton } from "~/components/shared/team-meeting-button";
interface IFutureTeamMeetingsContainerProps {
  handleMeetingClick: any;
  titleText?: string;
  buttonText?: string;
}

export const FutureTeamMeetingsContainer = ({
  handleMeetingClick,
  titleText,
  buttonText = "Team Meeting",
}: IFutureTeamMeetingsContainerProps): JSX.Element => {
  return (
    <Container>
      <ContainerHeaderWithText text={titleText} />
      <BodyContainer>
        <ButtonContainer>
          <TeamMeetingButton handleMeetingClick={handleMeetingClick} buttonText={buttonText} />
        </ButtonContainer>
      </BodyContainer>
    </Container>
  );
};

const Container = styled.div``;

const BodyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  margin-top: 15px;
`;
