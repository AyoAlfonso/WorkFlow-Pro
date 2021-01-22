import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Text } from "~/components/shared/text";
import { TextInput } from "~/components/shared/text-input";
import { IMeeting } from "~/models/meeting";
import { Avatar } from "~/components/shared/avatar";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";

//input is meeting
//render Month, ScheduledTime, Who, Topic
//WHO AND TOPIC plugin still  needs to be done

export interface ISection1MeetingDetailsProps {
  meeting: IMeeting;
}

export const Section1MeetingDetails = observer(
  ({ meeting }: ISection1MeetingDetailsProps): JSX.Element => {
    // const { t } = useTranslation();
    // const { sessionStore } = useMst();

    return (
      <Container>
        <div>
          <Text>Month</Text>
          {meeting.scheduledStartTime}
        </div>
        <div>
          <Avatar
            firstName={"sample"}
            lastName={"sample"}
            size={48}
            marginLeft={"inherit"}
            marginRight={"inherit"}
          />
          <Text>Sample sample</Text>
        </div>

        <TextInput
          textValue={""}
          placeholder={"Add a topic - e.g. How do we improve productivity while we go remote?"}
          setTextValue={() => {
            console.log("todo, set meeting topic");
          }}
          style={{
            height: "35px",
            marginTop: "auto",
            marginBottom: "auto",
            paddingTop: "4px",
            paddingBottom: "4px",
          }}
        />
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
