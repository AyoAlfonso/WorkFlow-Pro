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
import { MeetingSideOptions } from "./meeting-side-options";

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
      <ChildrenContainer>
        <StepText type={"small"}>{`Step ${meeting.currentStep + 1} / ${numberOfSteps}`}</StepText>
        {meeting.meetingType == "personal_weekly" && <MeetingSideOptions meeting={meeting} />}
      </ChildrenContainer>
    );

    const meetingComponent = () => <MeetingStep meeting={meeting} />;

    const actionButtons = () => {
      return (
        <>
          {meeting.currentStep > 0 && (
            <LeftButtonContainer>
              <BackButton
                small
                variant={"primaryOutline"}
                onClick={() => onNextButtonClick(meeting.currentStep - 1)}
              >
                <StyledBackIcon icon={"Move2"} size={"15px"} iconColor={"primary100"} />
              </BackButton>
            </LeftButtonContainer>
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
  padding-left: 0;
  padding: 0px;
`;

const LeftButtonContainer = styled.div`
  margin-right: 16px;
`;

const StepText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
  text-align: right;
`;

const StyledBackIcon = styled(Icon)`
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
`;

const ChildrenContainer = styled.div``;
