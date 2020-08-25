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

export interface ITeamMeetingProps {}

export const Meeting = observer(
  (props: ITeamMeetingProps): JSX.Element => {
    const [meetingStarted, setMeetingStarted] = useState<boolean>(false);
    const [meetingEnded, setMeetingEnded] = useState<boolean>(false);
    const { teamStore, meetingStore } = useMst();
    const { team_id, meeting_id } = useParams(); // team id from url params

    useEffect(() => {
      meetingStore.fetchTeamMeetings(team_id);
    }, []);

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
    const meeting = toJS(meetingStore.teamMeetings).find(tm => tm.id === parseInt(meeting_id));

    if (R.isNil(meeting)) {
      return renderLoading();
    }

    if (!R.isNil(meeting.endTime)) {
      renderMeetingEnded();
    }

    const progressBarSteps = meeting.steps.map((currentStep, index, stepsArray) => {
      const accumulatedPosition = stepsArray
        .slice(0, index)
        .reduce((acc, curr) => acc + (curr.duration / meeting.duration) * 100, 0);
      return {
        accomplished: false,
        position: accumulatedPosition,
        index: currentStep.orderIndex,
        title: currentStep.name,
      };
    });
    const stepPositions = R.map(step => step.position, progressBarSteps).concat([100]);

    const updateMeeting = keysAndValues => {
      meetingStore.updateMeeting(keysAndValues);
    };

    const hasStartTime = () => !R.isNil(meeting.startTime);
    const hasEndTime = () => !R.isNil(meeting.endTime);

    const StartMeetingButton = () => {
      return (
        <Button
          variant={"primary"}
          onClick={() => {
            setMeetingStarted(true);
            updateMeeting(R.merge(meeting, { startTime: new Date().toUTCString() }));
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
            updateMeeting(R.merge(meeting, { endTime: new Date().toUTCString() }));
          }}
          small
          ml={"25px"}
          disabled={meetingEnded}
        >
          <Icon icon={"_Stop"} iconColor={"warningRed"} size={"13px"} />
          <TextNoMargin ml={"10px"}>Stop Meeting</TextNoMargin>
        </Button>
      );
    };

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
              {meetingStarted ? (
                <>
                  <StepProgressBar
                    progressBarProps={{
                      stepPositions: stepPositions,
                      percent: 55,
                    }}
                    steps={progressBarSteps}
                    timed={true}
                  />
                </>
              ) : (
                <>some meeting summary overview?</>
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

const BodyContainer = styled.div``;
