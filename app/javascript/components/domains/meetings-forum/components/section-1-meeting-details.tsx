import * as React from "react";
import { useState } from "react";
import * as R from "ramda";
import moment from "moment";
import { IMeeting } from "~/models/meeting";
import { MonthContainer, Container as Wrapper, Divider } from "./row-style";
import { observer } from "mobx-react";
import { IUser } from "~/models/user";
import { Heading } from "~/components/shared";
import { ForumTopic } from "./forum-topic";
import { useMst } from "~/setup/root";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(3),
      width: 250,
    },
  }),
);

export interface ISection1MeetingDetailsProps {
  meeting: IMeeting;
  teamMembers: Array<any>;
}

export const Section1MeetingDetails = observer(
  ({ meeting, teamMembers }: ISection1MeetingDetailsProps): JSX.Element => {
    const { meetingStore } = useMst();
    const classes = useStyles();
    const [newScheduledStartTime, setNewScheduledStartTime] = useState<string>(
      meeting.scheduledStartTime,
    );
    // @TODO Add back stable Date Picker and date functions
    return (
      <Container>
        <Wrapper>
          <SectionContainer>
            <MonthContainer>
              <Heading type={"h3"} mt={"auto"} mb={"auto"} ml={"8px"}>
                {moment(meeting.scheduledStartTime).format("MMMM")}
              </Heading>
              <form className={classes.container} noValidate>
                <TextField
                  id="datetime-local"
                  type="datetime-local"
                  value={moment(newScheduledStartTime).format("YYYY-MM-DDTHH:mm")}
                  className={classes.textField}
                  onChange={async event => {
                    setNewScheduledStartTime(event.target.value);
                    await meetingStore.updateMeeting(
                      R.merge(meeting, {
                        scheduledStartTime: moment(event.target.value).format(),
                      }),
                    );
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </form>
            </MonthContainer>
            <ForumTopic disabled={false} teamMembers={teamMembers} meeting={meeting} />
          </SectionContainer>
        </Wrapper>
        <Divider />
      </Container>
    );
  },
);

const Container = styled.div``;

const SectionContainer = styled(Container)`
  margin-bottom: 4px;
  display: flex;
  width: 100%;
`;
