import * as React from "react";
import { Text } from "~/components/shared/text";
import { CoreFourOnly } from "~/components/domains/goals/goals-core-four";
import { HomeGoals } from "~/components/domains/home/home-goals";
import { IMeeting } from "~/models/meeting";
import styled from "styled-components";

interface IPersonalGoalsProps {
  company?: any;
  meeting?: IMeeting;
  disabled?: boolean;
}

export const PersonalGoals = ({ company, meeting, disabled }: IPersonalGoalsProps): JSX.Element => {
  const isPersonalMeeting =
    meeting?.meetingType == "personal_daily" || meeting?.meetingType == "personal_weekly";
  const isForum = company?.displayFormat == "Forum";
  const show = isPersonalMeeting && isForum
  return (
    <Container disabled={disabled}>
      {show ? <></> : <CoreFourOnly />}
      <HomeGoals isForum={isForum} />
    </Container>
  );
};

type ContainerProps = {
  disabled?: boolean;
}

const Container = styled.div<ContainerProps>`
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
`;