import moment from "moment";
import * as React from "react";
import * as R from "ramda";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Heading } from "~/components/shared/heading";
import { Button } from "~/components/shared/button";
import { StepProgressBar } from "~/components/shared/progress-bars/step-progress-bar";
import { Text } from "~/components/shared/text";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { useParams, useHistory } from "react-router-dom";
import { Icon } from "~/components/shared/icon";
import { TextNoMargin } from "~/components/shared/text";
import { Loading } from "~/components/shared/loading";
import { toJS } from "mobx";
import { MeetingStep } from "./meeting-step";
import { MeetingAgenda } from "./meeting-agenda";
import { HomeCoreFour } from "~/components/domains/home/home-core-four";
import {
  progressBarStepsForMeeting,
  stepPositionsForMeeting,
} from "./shared/progress-transform-helper";

export interface ITeamMeetingProps {}

export const PersonalPlanning = observer(
  (props: ITeamMeetingProps): JSX.Element => {
    const { meetingStore } = useMst();
    const { meeting_id } = useParams(); // team id from url params
    const history = useHistory();

    useEffect(() => {
      meetingStore.getPersonalMeeting(meeting_id);
    }, []);

    const renderLoading = () => (
      <Container>
        <BodyContainer>
          <Loading />
        </BodyContainer>
      </Container>
    );

    const meeting = meetingStore.currentPersonalPlanning;

    if (R.isNil(meeting)) {
      return renderLoading();
    }

    const progressBarSteps = progressBarStepsForMeeting(meeting);
    const stepPositions = stepPositionsForMeeting(meeting, progressBarSteps);

    const onStepClick = stepIndex => {
      meetingStore.updatePersonalMeeting(R.merge(meeting, { currentStep: stepIndex }));
    };

    const StopMeetingButton = () => {
      return (
        <Button
          variant={"redOutline"}
          onClick={() => {
            history.push(`/`);
            //TODO: send personal plan ended to back end.  For now do not end it.
          }}
          small
          ml={"25px"}
          disabled={false}
        >
          <Icon icon={"_Stop"} iconColor={"warningRed"} size={"13px"} />
          <TextNoMargin ml={"10px"}>End Planning</TextNoMargin>
        </Button>
      );
    };

    return (
      <Container>
        <HeaderContainer>
          <Text fontSize={"36px"}>{`Personal Planning Meeting`}</Text>
          <DateAndButtonContainer>
            <Heading type={"h3"} fontSize={"32px"} fontWeight={400}>
              {moment().format("dddd, MMMM Do")}
            </Heading>
            <StopMeetingButton />
          </DateAndButtonContainer>
        </HeaderContainer>
        <BodyContainer>
          <ProgressBarTimerContainer>
            <StepProgressBar
              progressBarProps={{
                stepPositions: stepPositions,
                percent: 0,
              }}
              steps={progressBarSteps}
              onStepClick={onStepClick}
              currentStepIndex={meeting.currentStep}
            />
          </ProgressBarTimerContainer>
          <MeetingStep meeting={meetingStore.currentPersonalPlanning}></MeetingStep>
        </BodyContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  padding: 20px 20px 0 20px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DateAndButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressBarTimerContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const BodyContainer = styled.div``;
