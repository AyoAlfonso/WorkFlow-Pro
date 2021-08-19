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
import { Timer } from "~/components/shared/timer";
import { dateStringToSeconds, nowAsUTCString, nowInSeconds } from "~/utils/date-time";
import {
  progressBarStepsForMeeting,
  stepPositionsForMeeting,
} from "./shared/progress-transform-helper";
import { useTranslation } from "react-i18next";
import { MeetingWizardLayout } from "./meeting-wizard-layout";

export interface ITeamMeetingProps {}

export const Meeting = observer(
  (props: ITeamMeetingProps): JSX.Element => {
    const [meetingStarted, setMeetingStarted] = useState<boolean>(false);
    const [meetingEnded, setMeetingEnded] = useState<boolean>(false);
    const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

    const { t } = useTranslation();
    const { teamStore, meetingStore } = useMst();
    const { team_id, meeting_id } = useParams();
    const history = useHistory();

    const currentTimeInSeconds = nowInSeconds();

    useEffect(() => {
      meetingStore.getMeeting(meeting_id).then(meeting => {
        if (!R.isNil(meeting.startTime)) {
          const startTime = dateStringToSeconds(meeting.startTime);
          setSecondsElapsed(currentTimeInSeconds - startTime);
        }
      });
    }, []);

    useEffect(() => {
      let interval = null;
      if (meetingStarted) {
        interval = setInterval(() => {
          setSecondsElapsed(sec => {
            const seconds = sec < 0 ? 0 : sec;
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

    const renderNoPermissions = () => (
      <Container>
        <BodyContainer>
          <Text fontSize={2}>{t("meeting.noPermissions")}</Text>
        </BodyContainer>
      </Container>
    );

    const meeting = meetingStore.currentMeeting;
    const team = teamStore.teams.find(team => team.id === parseInt(team_id));

    if (R.isNil(meeting)) {
      return renderLoading();
    } else if (meeting.teamId != team_id) {
      return renderNoPermissions();
    }

    const renderMeetingEnded = () => (
      <Container>
        <HeaderContainer>
          <Text fontSize={"36px"}>{`${R.path(["name"], team)} Meeting`}</Text>
          <DateAndButtonContainer>
            <Heading type={"h3"} fontSize={"32px"} fontWeight={400}>
              {moment(meeting.endTime).format("dddd, MMMM Do")}
            </Heading>
          </DateAndButtonContainer>
        </HeaderContainer>
        <BodyContainer>
          <Text fontSize={2}>{t("meeting.meetingComplete")}</Text>
        </BodyContainer>
      </Container>
    );

    if (!R.isNil(meeting.endTime)) {
      return renderMeetingEnded();
    }

    const progressBarSteps = progressBarStepsForMeeting(meeting);
    const stepPositions = stepPositionsForMeeting(progressBarSteps);

    const updateMeeting = keysAndValues =>
      meetingStore.updateMeeting(R.merge(meeting, keysAndValues));

    const onStepClick = stepIndex => {
      updateMeeting({ currentStep: stepIndex });
    };

    const hasStartTime = () => !R.isNil(meeting.startTime);

    const StartMeetingButton = () => {
      return (
        <MeetingControlButton
          variant={"primary"}
          onClick={async () => {
            setMeetingStarted(true);
            if (hasStartTime()) {
              setSecondsElapsed(currentTimeInSeconds - dateStringToSeconds(meeting.startTime));
            } else {
              const newMeetingStartTime = nowAsUTCString();
              const updatedMeeting = await updateMeeting({ startTime: newMeetingStartTime });
              const updatedMeetingStartTimeInSeconds = dateStringToSeconds(
                updatedMeeting.startTime,
              );
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
        </MeetingControlButton>
      );
    };

    const StopMeetingButton = () => {
      return (
        <MeetingControlButton
          variant={"redOutline"}
          onClick={() => {
            setMeetingEnded(true);
            updateMeeting({ endTime: nowAsUTCString() });
            history.push(`/`);
          }}
          small
          ml={"25px"}
          disabled={meetingEnded}
        >
          <Icon icon={"Stop"} iconColor={"warningRed"} size={"13px"} />
          <TextNoMargin ml={"10px"}>End Meeting</TextNoMargin>
        </MeetingControlButton>
      );
    };

    const calculatedPercentage = (secondsElapsed / (meeting.totalDuration * 60)) * 100;

    return (
      <MeetingWizardLayout
        meeting={meeting}
        meetingStarted={meetingStarted}
        startMeetingButton={<StartMeetingButton />}
        stopMeetingButton={<StopMeetingButton />}
        onNextButtonClick={onStepClick}
        numberOfSteps={progressBarSteps.length}
        stepsComponent={
          <ProgressBarTimerContainer>
            <StepProgressBar
              progressBarProps={{
                stepPositions: stepPositions,
                percent: calculatedPercentage > 100 ? 100 : calculatedPercentage,
              }}
              steps={progressBarSteps}
              onStepClick={onStepClick}
              currentStepIndex={meeting.currentStep}
              meetingStarted={meetingStarted}
            />
            <Timer secondsElapsed={secondsElapsed} ml={"30px"} />
          </ProgressBarTimerContainer>
        }
      />
    );
  },
);

const Container = styled.div`
  height: 100%;
`;

const MeetingControlButton = styled(Button)`
  width: 100%;
  font-size: 14px;
  margin-left: 0;
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
  margin-left: 32px;
  margin-right: 16px;
  margin-bottom: 24px;
  margin-top: 24px;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
`;
