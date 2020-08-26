import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import { Button } from "~/components/shared/button";
import { Text } from "~/components/shared/text";

interface IFutureTeamMeetingsContainerProps {
  handleMeetingClick: any;
}

export const FutureTeamMeetingsContainer = ({
  handleMeetingClick,
}: IFutureTeamMeetingsContainerProps): JSX.Element => {
  return (
    <Container>
      <HeaderContainer>
        <HeaderText> Team Meetings </HeaderText>
      </HeaderContainer>
      <BodyContainer>
        <ButtonContainer>
          <TeamMeetingButton
            small
            variant={"primary"}
            onClick={() => {
              handleMeetingClick();
            }}
          >
            <ButtonTextContainer>
              <Icon icon={"Team"} size={"20px"} />
              <TeamMeetingText>Team Meeting</TeamMeetingText>
            </ButtonTextContainer>
          </TeamMeetingButton>
        </ButtonContainer>
      </BodyContainer>
    </Container>
  );
};

const Container = styled.div``;

const HeaderContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e3e3e3;
  padding-left: 20px;
  padding-right: 20px;
`;

const HeaderText = styled.h4`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 20px;
  font-size: 13pt;
  font-weight: 600;
`;

const BodyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TeamMeetingButton = styled(Button)`
  display: flex;
  width: 220px;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
`;

const TeamMeetingText = styled(Text)`
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 15px;
  justify-content: center;
  display: flex;
  align-items: center;
`;

const ButtonTextContainer = styled.div`
  margin: auto;
  display: flex;
`;

const ButtonContainer = styled.div`
  margin-top: 15px;
`;
