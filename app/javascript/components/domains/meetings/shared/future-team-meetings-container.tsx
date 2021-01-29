import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import { Button } from "~/components/shared/button";
import { Text } from "~/components/shared/text";
import { ContainerHeaderWithText } from "~/components/shared/styles/container-header";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <Container>
      <ContainerHeaderWithText text={titleText} />
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
              <TeamMeetingText>{buttonText}</TeamMeetingText>
            </ButtonTextContainer>
          </TeamMeetingButton>
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

const TeamMeetingButton = styled(Button)`
  display: flex;
  width: 190px;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  padding-left: 10px;
  padding-right: 10px;
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
