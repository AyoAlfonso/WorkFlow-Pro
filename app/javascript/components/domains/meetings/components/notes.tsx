import * as React from "react";
import styled from "styled-components";
import { useRef } from "react";
import ContentEditable from "react-contenteditable";
import { Heading } from "~/components/shared";
import { useMst } from "~/setup/root";
import MeetingTypes from "~/constants/meeting-types";

interface NotesProps {
  meeting: any;
}

export const Notes = ({ meeting }: NotesProps): JSX.Element => {
  const notesRef = useRef(null);
  const { meetingStore } = useMst();

  const meetingType = meeting.meetingType;

  return (
    <Container>
      <Heading type={"h5"} fontSize={"16px"} fontWeight={400} mt={10} mb={10}>
        Enter your notes below
      </Heading>
      <StyledContentEditable
        innerRef={notesRef}
        html={meeting.notes}
        onChange={e => {
          if (meetingType == MeetingTypes.PERSONAL_WEEKLY) {
            meetingStore.updatePersonalPlanningField("notes", e.target.value);
          } else if (meetingType == MeetingTypes.TEAM_WEEKLY) {
            meetingStore.updateMeetingField("notes", e.target.value);
          }
        }}
        onBlur={() => {
          const meetingObj = { id: meeting.id, notes: meeting.notes };
          if (meetingType == MeetingTypes.PERSONAL_WEEKLY) {
            meetingStore.updatePersonalMeeting(meetingObj);
          } else if (meetingType == MeetingTypes.TEAM_WEEKLY) {
            meetingStore.updateMeeting(meetingObj);
          }
        }}
      />
    </Container>
  );
};

const Container = styled.div``;

const StyledContentEditable = styled(ContentEditable)`
  font-size: 16px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 4px;
  padding-right: 4px;
  margin-right: -4px;
  height: 300px;
  overflow-y: auto;
  border: ${props => `1px solid ${props.theme.colors.borderGrey}`};
`;
