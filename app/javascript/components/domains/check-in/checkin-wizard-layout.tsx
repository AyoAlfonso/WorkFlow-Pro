import * as React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { CheckInSideOptions } from "./checkin-side-options";
import { useTranslation } from "react-i18next";
import { WizardLayout } from "~/components/layouts/wizard-layout";
import * as R from "ramda";
import { MeetingStep } from "../meetings/meeting-step";
import { Button } from "~/components/shared/button";
import { useHistory } from "react-router-dom";
import { useMst } from "../../../setup/root";
import { Icon } from "~/components/shared";
import { Text } from "~/components/shared/text";

interface ITeamCheckInProps {
  checkIn: any;
  numberOfSteps: number;
  stopMeetingButton: JSX.Element;
  onNextButtonClick: any;
  stepsComponent?: JSX.Element;
}

export const CheckInWizardLayout = observer(
  ({
    checkIn,
    stopMeetingButton,
    onNextButtonClick,
    numberOfSteps,
    stepsComponent,
  }: ITeamCheckInProps): JSX.Element => {
    const { t } = useTranslation();
    const history = useHistory();

    const meetingTitle = () => R.path(["name"], checkIn);

    const meetingDescription = () => R.path(["currentStepDetails", "instructions"], checkIn);

    const meetingComponent = () => <MeetingStep meeting={checkIn} />;

    const closeButtonClick = () => {
      if (confirm(`Are you sure you want to exit this weekly check-in?`)) {
        history.push(`/`);
      }
    };

    const childrenUnderDescription = () => (
      <ChildrenContainer>
        <StepText type={"small"}>{t("Everyone in your company will see your response")}</StepText>
        <CheckInSideOptions checkIn={checkIn} />
      </ChildrenContainer>
    );

    const renderStepsForMobile = () => (
      <QuestionText>{`Question ${checkIn.currentStep + 1} / ${numberOfSteps}`}</QuestionText>
    );

    const actionButtons = () => {
      return (
        <>
          {checkIn?.currentStep > 0 && (
            <LeftButtonContainer>
              <BackButton
                small
                variant={"primaryOutline"}
                onClick={() => onNextButtonClick(checkIn.currentStep - 1)}
              >
                <StyledBackIcon icon={"Move2"} size={"15px"} iconColor={"primary100"} />
              </BackButton>
            </LeftButtonContainer>
          )}
          {checkIn.currentStep + 1 < numberOfSteps ? (
            <NextButton
              small
              variant={"primary"}
              onClick={() => onNextButtonClick(checkIn.currentStep + 1)}
              disabled={checkIn.currentStep >= numberOfSteps}
            >
              Next Question
            </NextButton>
          ) : (
            stopMeetingButton
          )}
        </>
      );
    };

    return (
      <Container>
        <WizardLayout
          title={meetingTitle()}
          description={meetingDescription()}
          customActionButton={actionButtons()}
          childrenUnderDescription={childrenUnderDescription()}
          showSkipButton={false}
          singleComponent={meetingComponent()}
          showLynchpynLogo={false}
          showCloseButton={true}
          onCloseButtonClick={closeButtonClick}
          stepsForMobile={renderStepsForMobile()}
        />
      </Container>
    );
  },
);

const Container = styled.div`
  height: 100%;
`;

type IButtonProps = {
  variant: string;
  onClick: () => void;
  small: boolean;
};

const NextButton = styled(Button)<IButtonProps>`
  width: 100%;
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
`;

const LeftButtonContainer = styled.div`
  margin-right: 16px;
`;

const BackButton = styled(Button)<IButtonProps>`
  width: 32px;
  padding-left: 0;
  padding-right: 0;
`;

const StyledBackIcon = styled(Icon)`
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
`;

const ChildrenContainer = styled.div``;

const StepText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
  display: flex;
  justify-content: center;
`;

const QuestionText = styled(Text)``;