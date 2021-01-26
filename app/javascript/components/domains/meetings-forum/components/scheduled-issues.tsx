import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";

interface IScheduledIssuesContainerProps {
  upcomingForumMeeting: any;
};

export const ScheduledIssues = observer(({upcomingForumMeeting}: IScheduledIssuesContainerProps):JSX.Element => {
  return (
    <Container>
      Scheduled Issues
    </Container>
  )
})

const Container = styled.div`
  display: flex;
`;
