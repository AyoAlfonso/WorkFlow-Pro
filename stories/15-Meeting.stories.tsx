import * as React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { CodeBlockDiv, ContainerDiv, Divider, PropsList, RowDiv } from "./shared";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import { useTranslation } from "react-i18next";
import { WizardLayout } from "~/components/layouts/wizard-layout";
import { CheckinStep } from "~/components/domains/check-in/components/checkin-step";
import { Icon, Text, Button } from "~/components/shared";
import { CheckInSideOptions } from "~/components/domains/check-in/checkin-side-options";

export default { title: "Meeting" };

const meeting = {
  id: 1,
  name: "Weekly Check In",
  checkInType: "weekly_check_in",
  description: "",
  checkInTemplatesSteps: [
    {
      id: 25,
      stepType: "component",
      orderIndex: 0,
      name: "Milestones",
      instructions: "Provide updates on your Milestones and KPIs to complete this weekly check-in.",
      componentToRender: "WeeklyMilestones",
      checkInTemplateId: 1,
    },
    {
      id: 26,
      stepType: "component",
      orderIndex: 1,
      name: "KPI",
      instructions: "Provide updates on your Milestones and KPIs to complete this weekly check-in.",
      componentToRender: "KPI",
      checkInTemplateId: 1,
    },
  ],
  currentStep: 0,
};

export const Meeting = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const meetingTitle = () => R.path(["name"], meeting);

  const meetingDescription = () => meeting.checkInTemplatesSteps[currentStep].instructions;

  const nextStep = stepIndex => {
    meeting.currentStep = stepIndex;
    setCurrentStep(stepIndex);
  };

  const renderVisibilityText = () => {
    const { t } = useTranslation();
    return (
      <StepText type={"small"}>
        <Icon icon={"Visibility"} size={"15px"} iconColor={"grey80"} />
        {t("Everyone in your company will see your response")}
      </StepText>
    );
  };

  const childrenUnderDescription = () => (
    <ChildrenContainer>
      {renderVisibilityText()}
      {/* <CheckInSideOptions checkIn={meeting} /> */}
    </ChildrenContainer>
  );

  const closeButtonClick = () => {
    if (confirm(`Are you sure you want to exit this weekly check-in?`)) {
      console.log("pushed to home");
    }
  };

  const StopMeetingButton = () => {
    return (
      <StopButton
        variant={"primary"}
        onClick={() => {
          console.log(`push to /check-in/success`);
        }}
        small
        disabled={false}
      >
        Publish Check-in
      </StopButton>
    );
  };

  const numberOfSteps = meeting.checkInTemplatesSteps.length;
  const meetingComponent = () => <CheckinStep checkin={meeting} />;

  const actionButtons = () => {
    return (
      <>
        {currentStep > 0 && (
          <LeftButtonContainer>
            <BackButton small variant={"primaryOutline"} onClick={() => nextStep(currentStep - 1)}>
              <StyledBackIcon icon={"Move2"} size={"15px"} iconColor={"primary100"} />
            </BackButton>
          </LeftButtonContainer>
        )}
        {currentStep + 1 < numberOfSteps ? (
          <NextButton
            small
            variant={"primary"}
            onClick={() => {
              nextStep(currentStep + 1);
              console.log("clicked");
              console.log(currentStep);
            }}
            disabled={currentStep >= numberOfSteps}
          >
            Next Question
          </NextButton>
        ) : (
          StopMeetingButton()
        )}
      </>
    );
  };

  const renderStepsForMobile = () => (
    <QuestionText type={"small"}>{`Question ${currentStep + 1} / ${numberOfSteps}`}</QuestionText>
  );
  return (
    <>
      <ContainerDiv>
        <h1>Wizard Layout</h1>
        <CodeBlockDiv mb={"20px"}>
          <CopyBlock
            text={`
              import * as React from "react";
              import { WizardLayout } from "~/components/layouts/wizard-layout";
              
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
              />
              )
            `}
            language={"tsx"}
            theme={atomOneLight}
          />
        </CodeBlockDiv>
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
          />
        </Container>
      </ContainerDiv>
    </>
  );
};

const Container = styled.div`
  padding: 0 10px;
`;

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

const ChildrenContainer = styled.div``;

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

const QuestionText = styled(Text)`
  display: none;
  margin-left: auto;
  margin-right: auto;
  color: ${props => props.theme.colors.grey100};
  @media only screen and (max-width: 992px) {
    display: inline-block;
  }
`;
