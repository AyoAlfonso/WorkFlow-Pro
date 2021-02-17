import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import { Button } from "~/components/shared/button";
import { Text } from "~/components/shared/text";
import { useTranslation } from "react-i18next";

interface ITeamMeetingButtonProps {
  handleMeetingClick: any;
  buttonText?: string;
  disabled?: boolean;
}

export const TeamMeetingButton = ({
  handleMeetingClick,
  buttonText = "Team Meeting",
  disabled = false,
}: ITeamMeetingButtonProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Container
      small
      variant={"primary"}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          handleMeetingClick();
        }
      }}
    >
      <ButtonTextContainer>
        <Icon icon={"Team"} size={"20px"} />
        <TeamMeetingText>{buttonText}</TeamMeetingText>
      </ButtonTextContainer>
    </Container>
  );
};

const Container = styled(Button)`
  display: flex;
  width: 190px;
  margin-left: auto;
  margin-bottom: 30px;
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
