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
import { useParams } from "react-router-dom";
import { Icon } from "~/components/shared/icon";
import { TextNoMargin } from "~/components/shared/text";
import { Loading } from "~/components/shared/loading";
import { toJS } from "mobx";
import { MeetingStep } from "./meeting-step";
import { MeetingAgenda } from "./meeting-agenda";
import { HomeCoreFour } from "~/components/domains/home/home-core-four";
import { Timer } from "~/components/shared/timer";

export interface ITeamMeetingProps {}

export const Meeting = observer(
  (props: ITeamMeetingProps): JSX.Element => {
    const [meetingStarted, setMeetingStarted] = useState<boolean>(false);
    const [meetingEnded, setMeetingEnded] = useState<boolean>(false);
    const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

    const { teamStore, meetingStore } = useMst();
    const { team_id, meeting_id } = useParams();

    const currentTimeInSeconds = Math.round(Date.now() / 1000);

    useEffect(() => {
      const load = async () => {
        await meetingStore.fetchTeamMeetings(team_id);
        const currentMeeting = toJS(meetingStore.teamMeetings).find(
          tm => tm.id === parseInt(meeting_id),
        );
        await meetingStore.setCurrentMeeting(currentMeeting);
        if (!R.isNil(currentMeeting.startTime)) {
          const startTime = new Date(currentMeeting.startTime).getTime() / 1000;
          setSecondsElapsed(currentTimeInSeconds - startTime);
        }
      };
      load();
    }, []);

    useEffect(() => {
      let interval = null;
      if (meetingStarted) {
        interval = setInterval(() => {
          setSecondsElapsed(sec => {
            let seconds = sec < 0 ? 0 : sec;
            return seconds + 1;
          });
        }, 1000);
      } else if (meetingEnded && secondsElapsed !== 0) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [meetingStarted, secondsElapsed]);

    const renderLoading = () => (
      <Container>
        <BodyContainer>
          <Loading />
        </BodyContainer>
      </Container>
    );

    const renderMeetingEnded = () => (
      <Container>
        <BodyContainer>This meeting has ended // meeting summary?</BodyContainer>
      </Container>
    );

    if (R.isEmpty(toJS(meetingStore.teamMeetings))) {
      return renderLoading();
    }

    const team = teamStore.teams.find(team => team.id === parseInt(team_id));
    const meeting = meetingStore.currentMeeting;

    if (R.isNil(meeting)) {
      return renderLoading();
    }

    if (!R.isNil(meeting.endTime)) {
      return renderMeetingEnded();
    }

    const progressBarSteps = meeting.steps.map((currentStep, index, stepsArray) => {
      const accumulatedPosition = stepsArray
        .slice(0, index)
        .reduce((acc, curr) => acc + (curr.duration / meeting.duration) * 100, 0);
      return {
        accomplished: currentStep.orderIndex < meeting.currentStep,
        position: accumulatedPosition,
        index: currentStep.orderIndex,
        title: currentStep.name,
      };
    });
    const stepPositions = R.map(step => step.position, progressBarSteps).concat([100]);

    const updateMeeting = keysAndValues =>
      meetingStore.updateMeeting(R.merge(meeting, keysAndValues));

    const onStepClick = stepIndex => {
      updateMeeting({ currentStep: stepIndex });
    };

    const hasStartTime = () => !R.isNil(meeting.startTime);
    const hasEndTime = () => !R.isNil(meeting.endTime);

    const StartMeetingButton = () => {
      return (
        <Button
          variant={"primary"}
          onClick={async () => {
            setMeetingStarted(true);
            if (hasStartTime()) {
              setSecondsElapsed(
                currentTimeInSeconds - new Date(meeting.startTime).getTime() / 1000,
              );
            } else {
              const newMeetingStartTime = new Date().toUTCString();
              const updatedMeeting = await updateMeeting({ startTime: newMeetingStartTime });
              const updatedMeetingStartTimeInSeconds =
                new Date(updatedMeeting.startTime).getTime() / 1000;
              const timeDifference = updatedMeetingStartTimeInSeconds - currentTimeInSeconds;
              const startTime = timeDifference < 0 ? 0 : timeDifference;
              setSecondsElapsed(startTime);
            }
          }}
          small
          ml={"25px"}
        >
          <Icon icon={"Start"} iconColor={"white"} size={"13px"} />
          <TextNoMargin ml={"10px"}>
            {meetingStarted || hasStartTime() ? "Continue Meeting" : "Start Meeting"}
          </TextNoMargin>
        </Button>
      );
    };

    const StopMeetingButton = () => {
      return (
        <Button
          variant={"redOutline"}
          onClick={() => {
            setMeetingEnded(true);
            updateMeeting({ endTime: new Date().toUTCString() });
          }}
          small
          ml={"25px"}
          disabled={meetingEnded}
        >
          <Icon icon={"Stop"} iconColor={"warningRed"} size={"13px"} />
          <TextNoMargin ml={"10px"}>Stop Meeting</TextNoMargin>
        </Button>
      );
    };

    const calculatedPercentage = (secondsElapsed / (meeting.duration * 60)) * 100;

    return (
      <Container>
        {meetingEnded || hasEndTime() ? (
          renderMeetingEnded()
        ) : (
          <>
            <HeaderContainer>
              <Text fontSize={"36px"}>{`${team.name} Meeting`}</Text>
              <DateAndButtonContainer>
                <Heading type={"h3"} fontSize={"32px"} fontWeight={400}>
                  {moment().format("dddd, MMMM Do")}
                </Heading>
                {meetingStarted ? <StopMeetingButton /> : <StartMeetingButton />}
              </DateAndButtonContainer>
            </HeaderContainer>
            <BodyContainer>
              {meetingStarted ? ( //#TODO: IF YOU ARE NOT THE HOST RENDER JUST THE AGENDA
                <>
                  <ProgressBarTimerContainer>
                    <StepProgressBar
                      progressBarProps={{
                        stepPositions: stepPositions,
                        percent: calculatedPercentage > 100 ? 100 : calculatedPercentage,
                      }}
                      steps={progressBarSteps}
                      timed={true}
                      onStepClick={onStepClick}
                    />
                    <Timer secondsElapsed={secondsElapsed} ml={"30px"} />
                  </ProgressBarTimerContainer>

                  <MeetingStep meeting={meetingStore.currentMeeting}></MeetingStep>
                </>
              ) : (
                <>
                  <MeetingAgenda />
                  <HomeCoreFour />
                </>
              )}
            </BodyContainer>
          </>
        )}
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
