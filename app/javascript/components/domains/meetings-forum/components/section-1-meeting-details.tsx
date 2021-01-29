import * as React from "react";
import styled from "styled-components";
import moment from "moment";
import { IMeeting } from "~/models/meeting";
import {
  MonthContainer,
  Container as SectionContainer,
  Divider,
} from "./row-style";
import { observer } from "mobx-react";
import { IUser } from "~/models/user";
import { Heading } from "~/components/shared";
import { ForumTopic } from "./forum-topic";

export interface ISection1MeetingDetailsProps {
  meeting: IMeeting;
  teamMembers: Array<IUser>;
}

export const Section1MeetingDetails = observer(
  ({ meeting, teamMembers }: ISection1MeetingDetailsProps): JSX.Element => {

    return (
      <Container>
        <SectionContainer>
          <MonthContainer>
            <Heading type={"h3"}>{moment(meeting.scheduledStartTime).format("MMMM")}</Heading>
          </MonthContainer>
          <ForumTopic disabled={false} teamMembers={teamMembers} meeting={meeting} />
        </SectionContainer>
        <Divider />
      </Container>
    );
  },
);

const Container = styled.div``;
