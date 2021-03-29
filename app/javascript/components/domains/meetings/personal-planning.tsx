import * as React from "react";
import * as R from "ramda";
import { useEffect } from "react";
import styled from "styled-components";
import { Button } from "~/components/shared/button";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { useParams, useHistory } from "react-router-dom";
import { Loading } from "~/components/shared/loading";

import { StepProgressBar } from "~/components/shared/progress-bars/step-progress-bar";
import {
  progressBarStepsForMeeting,
  stepPositionsForMeeting,
} from "./shared/progress-transform-helper";
import { PersonalMeetingWizardLayout } from "./personal-meeting-wizard-layout";

export interface ITeamMeetingProps {}

export const PersonalPlanning = observer(
  (props: ITeamMeetingProps): JSX.Element => {
    const { meetingStore } = useMst();
    const { meeting_id } = useParams(); // team id from url params
    const history = useHistory();

    useEffect(() => {
      meetingStore.getPersonalMeeting(meeting_id);
      meetingStore.getPersonalPlanningSummary(); //currently loads this for weekly meeting
    }, []);

    const renderLoading = () => (
      <Container>
        <BodyContainer>
          <Loading />
        </BodyContainer>
      </Container>
    );

    const meeting = meetingStore.currentPersonalPlanning;
    const personalPlanningSummary = meetingStore.personalPlanningSummary;

    if (R.isNil(meeting) || R.isNil(personalPlanningSummary)) {
      return renderLoading();
    }

    const progressBarSteps = progressBarStepsForMeeting(meeting);
    const stepPositions = stepPositionsForMeeting(progressBarSteps);

    const onStepClick = stepIndex => {
      meetingStore.updatePersonalMeeting(R.merge(meeting, { currentStep: stepIndex }));
    };

    const StopMeetingButton = () => {
      return (
        <StopButton
          variant={"primary"}
          onClick={() => {
            history.push(`/`);
            //TODO: send personal plan ended to back end.  For now do not end it.
          }}
          small
          disabled={false}
        >
          Done
        </StopButton>
      );
    };

    return (
      <PersonalMeetingWizardLayout
        meeting={meeting}
        stopMeetingButton={<StopMeetingButton />}
        onNextButtonClick={onStepClick}
        numberOfSteps={meeting.steps.length}
        stepsComponent={
          <ProgressBarTimerContainer>
            <StepProgressBar
              progressBarProps={{
                stepPositions: stepPositions,
                percent: meeting.currentStep / meeting.steps.length,
              }}
              steps={progressBarSteps}
              onStepClick={onStepClick}
              currentStepIndex={meeting.currentStep}
            />
          </ProgressBarTimerContainer>
        }
      />
    );
  },
);

const Container = styled.div`
  height: 100%;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
`;

const ProgressBarTimerContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 16px;
`;

const StopButton = styled(Button)`
  width: 100%;
`;
