import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";

interface IScheduledIssuesContainerProps {
  upcomingForumMeeting: number;
};

export const ScheduledIssuesContainer = observer(({upcomingForumMeeting}: IScheduledIssuesContainerProps):JSX.Element => {
  return (
    <Container>
      {upcomingForumMeeting}
    </Container>
  )
})

const Container = styled.div`
  display: flex;
`;
