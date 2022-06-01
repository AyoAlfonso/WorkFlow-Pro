import * as React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { WizardLayout } from "~/components/layouts/wizard-layout";
import * as R from "ramda";
import { Button } from "~/components/shared/button";
import { Icon } from "~/components/shared";
import { CheckinBuilderSteps } from "./checkin-builder-steps";
import { CheckinBuilderAgenda } from "./components/check-in-builder-agenda";

interface ICheckInBuilderLayoutProps {}

export const CheckInBuilderLayout = observer(
  (props: ICheckInBuilderLayoutProps): JSX.Element => {
    const [currentStep, setCurrentStep] = useState(0);
    const [checkinName, setCheckinName] = useState<string>("New Check-in")

    const history = useHistory();

    const steps = [
      {
        name: "Basic",
        description: "Set up the basic information of this check-in.",
        componentToRender: "basic",
        orderIndex: 0,
      },
      {
        name: "Steps",
        description:
          "Choose from a variety of step types that will encourage the kind of responses you are looking for.",
        componentToRender: "steps",
        orderIndex: 1,
      },
      {
        name: "Setup",
        description:
          "Configure who will be asked to response, the cadence of the Check-in, and who will see the responses.",
        componentToRender: "setup",
        orderIndex: 2,
      },
    ];
    
    const title = () => R.path([currentStep, "name"], steps);

    const description = () => R.path([currentStep, "description"], steps);

    const component = () => (
      <CheckinBuilderSteps
        checkinName={checkinName}
        setCheckinName={setCheckinName}
        step={steps[currentStep]}
      />
    );

    const closeButtonClick = () => {
      if (confirm(`Are you sure you want to exit?`)) {
        history.push(`/check-in`);
      }
    };

    const finishCheckIn = () => {
      return (
        <StopButton
          variant={"primary"}
          onClick={() => {
            history.push(`/check-in`);
          }}
          small
          disabled={false}
        >
          Publish
        </StopButton>
      );
    };

    const actionButtons = () => {
      return (
        <>
          {currentStep > 0 && (
            <LeftButtonContainer>
              <BackButton
                small
                variant={"primaryOutline"}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <StyledBackIcon icon={"Move2"} size={"15px"} iconColor={"primary100"} />
              </BackButton>
            </LeftButtonContainer>
          )}
          {currentStep + 1 < 3 ? (
            <NextButton
              small
              variant={"primary"}
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep >= 3}
            >
              Next
            </NextButton>
          ) : (
            finishCheckIn()
          )}
        </>
      );
    };

    return (
      <Container>
        <WizardLayout
          title={title()}
          description={description()}
          customActionButton={actionButtons()}
          childrenUnderDescription={
            <CheckinBuilderAgenda steps={steps} currentStep={currentStep} />
          }
          singleComponent={component()}
          showSkipButton={false}
          showCloseButton={true}
          onCloseButtonClick={closeButtonClick}
          showBackButton={false}
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

type IStopMeetingButton = {
  variant: string;
  onClick: () => void;
  small: boolean;
  disabled: boolean;
};

const StopButton = styled(Button)<IStopMeetingButton>`
  width: 100%;
  margin: 0;
  font-size: 16px;
`;