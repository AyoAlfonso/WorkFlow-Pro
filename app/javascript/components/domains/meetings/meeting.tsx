import moment from "moment";
import * as React from "react";
import * as R from "ramda";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Heading } from "~/components/shared/heading";
import { Button } from "~/components/shared/button";
import { IconButton } from "~/components/shared/icon-button";
import { StepProgressBar } from "~/components/shared/progress-bars/step-progress-bar";
import { Text } from "~/components/shared/text";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { useParams, useLocation } from "react-router-dom";
import queryString from "query-string";
import MeetingTypes from "../../../constants/meeting-types";
import { Icon } from "~/components/shared/icon";
import { TextNoMargin } from "~/components/shared/text";
import { Loading } from "~/components/shared/loading";

export interface ITeamMeetingProps {}

export const Meeting = observer(
  (props: ITeamMeetingProps): JSX.Element => {
    const [meetingStarted, setMeetingStarted] = useState<boolean>(false);
    const { teamStore, meetingStore } = useMst();
    const { id } = useParams();
    const useQuery = () => queryString.parse(useLocation().search);
    const query = useQuery();

    useEffect(() => {
      meetingStore.fetchMeetings();
    }, []);

    if (R.isEmpty(meetingStore.meetings)) {
      <Container>
        <BodyContainer>
          <Loading />
        </BodyContainer>
      </Container>;
    }

    const team = teamStore.teams.find(team => team.id === parseInt(id));
    const meetings = meetingStore.meetings;
    console.log(meetings);

    const StopMeetingButton = () => {
      return (
        <Button
          variant={"redOutline"}
          onClick={() => {
            setMeetingStarted(false);
          }}
          small
          ml={"25px"}
        >
          <Icon icon={"_Stop"} iconColor={"warningRed"} size={"13px"} />
          <TextNoMargin ml={"10px"}>Stop Meeting</TextNoMargin>
        </Button>
      );
    };

    const StartMeetingButton = () => {
      return (
        <Button
          variant={"primary"}
          onClick={() => {
            setMeetingStarted(true);
          }}
          small
          ml={"25px"}
        >
          <Icon icon={"Start"} iconColor={"white"} size={"13px"} />
          <TextNoMargin ml={"10px"}>Start Meeting</TextNoMargin>
        </Button>
      );
    };

    return (
      <Container>
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
                  stepPositions: [25, 30, 45, 60, 100],
                  percent: 55,
                }}
                steps={[
                  { accomplished: true, title: "Step #1" },
                  { accomplished: true, title: "Step #2" },
                  { accomplished: false, title: "Step #3" },
                  { accomplished: false, title: "Step #4" },
                ]}
                timed={true}
              />
            </>
          ) : (
            <>some meeting summary overview?</>
          )}
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

const BodyContainer = styled.div``;
