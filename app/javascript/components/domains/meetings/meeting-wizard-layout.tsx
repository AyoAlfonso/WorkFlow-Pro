import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { MeetingStep } from "./meeting-step";
import { MeetingSideOptions } from "./meeting-side-options";
import { useTranslation } from "react-i18next";
import { WizardLayout } from "~/components/layouts/wizard-layout";
import * as R from "ramda";
import { CoreFourOnly } from "../goals/goals-core-four";
import { Button } from "~/components/shared/button";
import { useHistory } from "react-router-dom";
import { Icon } from "~/components/shared";

interface ITeamMeetingProps {
  meeting: any;
  meetingStarted: boolean;
  startMeetingButton: JSX.Element;
  stopMeetingButton: JSX.Element;
  onNextButtonClick: any;
  stepsComponent: JSX.Element;
  numberOfSteps: number;
}

export const MeetingWizardLayout = observer(
  ({
    meeting,
    meetingStarted,
    startMeetingButton,
    stopMeetingButton,
    onNextButtonClick,
    stepsComponent,
    numberOfSteps,
  }: ITeamMeetingProps): JSX.Element => {
    const { t } = useTranslation();
    const {
      companyStore: { company },
    } = useMst();
    const history = useHistory();
    const forumMode = company && company.accessForum;
    const meetingTitle = () => {
      return meetingStarted || forumMode
        ? R.path(["currentStepDetails", "name"], meeting)
        : t("meeting.coreFourTitle");
    };

    const meetingDescription = () => {
      return meetingStarted || forumMode
        ? R.path(["currentStepDetails", "instructions"], meeting)
        : t("meeting.reviewCoreFour");
    };

    const meetingComponent = () => {
      return meetingStarted || (company && company.accessForum) ? (
        <MeetingStep meeting={meeting} />
      ) : (
        <CoreFourWrapper>
          <CoreFourOnly />
        </CoreFourWrapper>
      );
    };

    const renderMeetingStartedButtons = () => {
      const nextButton = (
        <NextButton
          small
          variant={"primary"}
          onClick={() => onNextButtonClick(meeting.currentStep + 1)}
        >
          Next
        </NextButton>
      );

      if (meeting.currentStep == 0) {
        return nextButton;
      } else if (meeting.currentStep + 1 == numberOfSteps) {
        return (
          <ButtonsContainer>
            <LeftButtonContainer>
              {
                <BackButton
                  small
                  variant={"primaryOutline"}
                  onClick={() => onNextButtonClick(meeting.currentStep - 1)}
                >
                  <StyledBackIcon icon={"Move2"} size={"15px"} iconColor={"primary100"} />
                </BackButton>
              }
            </LeftButtonContainer>
            {stopMeetingButton}
          </ButtonsContainer>
        );
      } else {
        return (
          <ButtonsContainer>
            <LeftButtonContainer>
              {
                <BackButton
                  small
                  variant={"primaryOutline"}
                  onClick={() => onNextButtonClick(meeting.currentStep - 1)}
                >
                  <StyledBackIcon icon={"Move2"} size={"15px"} iconColor={"primary100"} />
                </BackButton>
              }
            </LeftButtonContainer>
            {nextButton}
          </ButtonsContainer>
        );
      }
    };

    const actionButtons = () => {
      return meetingStarted ? renderMeetingStartedButtons() : startMeetingButton;
    };

    const closeButtonClick = () => {
      if (confirm(`Are you sure you want to exit this meeting?`)) {
        if (forumMode) {
          history.push(`/`);
        } else {
          history.push(`/team/${meeting.teamId}`);
        }
      }
    };

    return (
      <Container>
        <WizardLayout
          title={meetingTitle()}
          description={meetingDescription()}
          customActionButton={actionButtons()}
          childrenUnderDescription={
            <MeetingSideOptions teamId={meeting.teamId} meeting={meeting} />
          }
          showSkipButton={false}
          singleComponent={meetingComponent()}
          customStepsComponent={stepsComponent}
          showLynchpynLogo={true}
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

const CoreFourWrapper = styled.div`
  width: 100%;
  margin-left: 20px;
  margin-top: 30px;
`;

const NextButton = styled(Button)`
  width: 100%;
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
`;

const LeftButtonContainer = styled.div`
  margin-right: 16px;
`;

const BackButton = styled(Button)`
  width: 32px;
  padding-left: 0;
  padding-right: 0;
`;

const StyledBackIcon = styled(Icon)`
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
`;
