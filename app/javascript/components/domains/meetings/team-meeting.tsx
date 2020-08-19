import moment from "moment";
import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Heading } from "~/components/shared/heading";
import { IconButton } from "~/components/shared/icon-button";
import { StepProgressBar } from "~/components/shared/progress-bars/step-progress-bar";
import { Text } from "~/components/shared/text";

export interface ITeamMeetingProps {
  team: any;
}

export const TeamMeeting = (props: ITeamMeetingProps): JSX.Element => {
  const { team } = props;
  const [meetingStarted, setMeetingStarted] = useState<boolean>(false);

  return (
    <>
      <HeaderContainer>
        <Text fontSize={"36px"}>{`${team.name} Meeting`}</Text>
        <DateAndButtonContainer>
          <Heading type={"h3"} fontSize={"32px"} fontWeight={400}>
            {moment().format("dddd, MMMM Do")}
          </Heading>
          <IconButton
            height={"25px"}
            iconName={"Start"}
            iconSize={"20px"}
            iconColor={"white"}
            text={"Start Meeting"}
            textColor={"white"}
            bg={"primary100"}
            px={"15px"}
            py={"5px"}
            ml={"25px"}
            shadow
            onClick={async () => {
              setMeetingStarted(true);
            }}
          />
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
    </>
  );
};

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
