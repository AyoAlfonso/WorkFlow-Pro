import * as React from "react";
import styled from "styled-components";
import { TeamMeetingButton } from "~/components/shared/team-meeting-button";
import { CardLayout } from "~/components/layouts/card-layout";
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
    <CardLayout titleText={titleText} height={"100%"}>
      <BodyContainer>
        <ButtonContainer>
          <TeamMeetingButton handleMeetingClick={handleMeetingClick} buttonText={buttonText} />
        </ButtonContainer>
      </BodyContainer>
    </CardLayout>
  );
};

const BodyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  margin-top: 15px;
`;
