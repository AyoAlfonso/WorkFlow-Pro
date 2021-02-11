import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { IMeeting } from "~/models/meeting";
import { MonthContainer, Container as SectionContainer, Divider } from "./row-style";
import { observer } from "mobx-react";
import { IUser } from "~/models/user";
import { Heading } from "~/components/shared";
import { ForumTopic } from "./forum-topic";
import { useMst } from "~/setup/root";
import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DateTimePicker from '@material-ui/lab/DateTimePicker';

export interface ISection1MeetingDetailsProps {
  meeting: IMeeting;
  teamMembers: Array<IUser>;
}

export const Section1MeetingDetails = observer(
  ({ meeting, teamMembers }: ISection1MeetingDetailsProps): JSX.Element => {
    const { meetingStore } = useMst();
    const [newScheduledTime, setNewScheduledTime] = useState<string>(meeting.scheduledStartTime);

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SectionContainer>
          <MonthContainer>
            <Heading type={"h3"} mt={"auto"} mb={"auto"}>
              {moment(meeting.scheduledStartTime).format("MMMM")}
            </Heading>
            <DateTimePicker 
              renderInput={(params) => (
                <TextField {...params} margin="normal" variant="standard" />
              )}
              label=""
              value={newScheduledTime}
              onChange={(newDateTime) => {
                // meetingStore.updateMeeting(newDateTime)
                console.log(meeting.scheduledStartTime)
                console.log(newDateTime)
              }}
            />
          </MonthContainer>
          <ForumTopic disabled={false} teamMembers={teamMembers} meeting={meeting} />
        </SectionContainer>
        <Divider />
      </LocalizationProvider>
    );
  },
);
