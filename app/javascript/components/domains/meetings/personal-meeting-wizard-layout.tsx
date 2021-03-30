import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { MeetingStep } from "./meeting-step";
import { WizardLayout } from "~/components/layouts/wizard-layout";
import * as R from "ramda";
import { Button } from "~/components/shared/button";
import { useHistory } from "react-router-dom";
import { Icon } from "~/components/shared/icon";
import { Text } from "~/components/shared/text";

interface ITeamMeetingProps {
  meeting: any;
  stopMeetingButton: JSX.Element;
  onNextButtonClick: any;
  stepsComponent?: JSX.Element;
  numberOfSteps: number;
}

export const PersonalMeetingWizardLayout = observer(
  ({
    meeting,
    stopMeetingButton,
    onNextButtonClick,
    numberOfSteps,
    stepsComponent,
  }: ITeamMeetingProps): JSX.Element => {
    const history = useHistory();

    const meetingTitle = () => R.path(["currentStepDetails", "name"], meeting);

    const meetingDescription = () => R.path(["currentStepDetails", "instructions"], meeting);

    const childrenUnderDescription = () => (
      <StepText type={"small"}>{`Step ${meeting.currentStep + 1} / ${numberOfSteps}`}</StepText>
    );

    const meetingComponent = () => <MeetingStep meeting={meeting} />;

    const actionButtons = () => {
      return (
        <>
          {meeting.currentStep > 0 && (
            <BackButton
              small
              variant={"primaryOutline"}
              onClick={() => onNextButtonClick(meeting.currentStep - 1)}
            >
              <Icon icon={"Chevron-Left"} size={"16px"} iconColor={"primary80"} />
            </BackButton>
          )}
          {meeting.currentStep + 1 < numberOfSteps && (
            <NextButton
              small
              variant={"primary"}
              onClick={() => onNextButtonClick(meeting.currentStep + 1)}
            >
              Next
            </NextButton>
          )}
          {meeting.currentStep + 1 >= numberOfSteps && stopMeetingButton}
        </>
      );
    };

    const closeButtonClick = () => {
      if (confirm(`Are you sure you want to exit planning?`)) {
        history.push(`/`);
      }
    };

    return (
      <Container>
        <WizardLayout
          title={meetingTitle()}
          description={meetingDescription()}
          childrenUnderDescription={childrenUnderDescription()}
          customActionButton={actionButtons()}
          showSkipButton={false}
          singleComponent={meetingComponent()}
          showLynchpynLogo={false}
          showCloseButton={true}
          onCloseButtonClick={closeButtonClick}
        />
      </Container>
    );
  },
);

const Container = styled.div`
  height: 100%;
`;

const NextButton = styled(Button)`
  width: 100%;
`;

const BackButton = styled(Button)`
  width: 32px;
  margin-right: 14px;
  padding: 0px;
`;

const StepText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
  text-align: right;
`;
