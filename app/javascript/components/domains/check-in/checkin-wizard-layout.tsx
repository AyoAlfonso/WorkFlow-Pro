import * as React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { CheckInSideOptions } from "./checkin-side-options";
import { useTranslation } from "react-i18next";
import { WizardLayout } from "~/components/layouts/wizard-layout";
import * as R from "ramda";
import { Button } from "~/components/shared/button";
import { useHistory } from "react-router-dom";
import { useMst } from "../../../setup/root";
import { Icon } from "~/components/shared";
import { Text } from "~/components/shared/text";
import { CheckinStep } from "./components/checkin-step";

interface ITeamCheckInProps {
  checkIn: any;
  numberOfSteps: number;
  stopMeetingButton: JSX.Element;
  onNextButtonClick: any;
}

export const CheckInWizardLayout = observer(
  ({
    checkIn,
    stopMeetingButton,
    onNextButtonClick,
    numberOfSteps,
  }: ITeamCheckInProps): JSX.Element => {
    const { t } = useTranslation();
    const history = useHistory();

    const stepName = checkIn?.currentStepDetails.name;

    const meetingTitle = () => R.path(["name"], checkIn);

    const meetingDescription = () => R.path(["currentStepDetails", "instructions"], checkIn);

    const meetingComponent = () => <CheckinStep checkin={checkIn} />;

    const closeButtonClick = () => {
      if (confirm(`Are you sure you want to exit this weekly check-in?`)) {
        history.push(`/check-in`);
      }
    };

    const renderVisibilityText = () => (
      <StepText type={"small"}>
        <Icon icon={"Visibility"} size={"15px"} iconColor={"grey80"} />
        {t<string>("Everyone in your company will see your response")}
      </StepText>
    );

    const childrenUnderDescription = () => (
      <ChildrenContainer>
        <CheckInSideOptions checkIn={checkIn} />
      </ChildrenContainer>
    );

    const renderStepsForMobile = () => (
      <QuestionText type={"small"}>
        {`Step ${checkIn.currentStep + 1} / ${numberOfSteps}`}
      </QuestionText>
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
              Next Step
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
          textUnderMobileButton={renderVisibilityText()}
          stepTitle={stepName}
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
  font-size: 16px;
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
  align-items: center;
  margin-top: -15px;
  margin-bottom: 30px;
  > * {
    &:first-child {
      margin-right: 8px;
    }
  }
  @media only screen and (max-width: 768px) {
    margin-top: -8px;
    margin-bottom: 0;
    justify-content: flex-start;
  }
`;

const QuestionText = styled(Text)`
  display: none;
  margin-left: auto;
  margin-right: auto;
  color: ${props => props.theme.colors.grey100};
  @media only screen and (max-width: 992px) {
    display: inline-block;
  }
`;
