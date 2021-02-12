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

interface ITeamMeetingProps {
  meeting: any;
  meetingStarted: boolean;
  startMeetingButton: JSX.Element;
  stopMeetingButton: JSX.Element;
  onNextButtonClick: any;
  stepsComponent: JSX.Element;
}

export const MeetingWizardLayout = observer(
  ({
    meeting,
    meetingStarted,
    startMeetingButton,
    stopMeetingButton,
    onNextButtonClick,
    stepsComponent,
  }: ITeamMeetingProps): JSX.Element => {
    const { t } = useTranslation();
    const { meetingStore } = useMst();

    const meetingTitle = () => {
      return meetingStarted
        ? R.path(["currentStepDetails", "name"], meeting)
        : t("meeting.coreFourTitle");
    };

    const meetingDescription = () => {
      return meetingStarted
        ? R.path(["currentStepDetails", "instructions"], meeting)
        : t("meeting.reviewCoreFour");
    };

    const meetingComponent = () => {
      return meetingStarted ? (
        <MeetingStep meeting={meetingStore.currentMeeting} />
      ) : (
        <CoreFourWrapper>
          <CoreFourOnly />
        </CoreFourWrapper>
      );
    };

    const renderMeetingStartedButtons = () => {
      return (
        <>
          <NextButton
            small
            variant={"primary"}
            onClick={() => onNextButtonClick(meetingStore.currentMeeting.currentStep + 1)}
          >
            Next
          </NextButton>
          {stopMeetingButton}
        </>
      );
    };

    const actionButtons = () => {
      return meetingStarted ? renderMeetingStartedButtons() : startMeetingButton;
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
