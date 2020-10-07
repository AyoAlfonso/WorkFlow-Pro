import * as React from "react";
import styled from "styled-components";
import { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import { Heading } from "~/components/shared";
import { useMst } from "~/setup/root";
import MeetingTypes from "~/constants/meeting-types";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface NotesProps {
  meeting: any;
}

export const Notes = ({ meeting }: NotesProps): JSX.Element => {
  const notesRef = useRef(null);
  const { meetingStore } = useMst();

  const meetingType = meeting.meetingType;

  const [editorText, setEditorText] = useState<any>(meeting.notes);

  return (
    <Container>
      <Heading type={"h5"} fontSize={"16px"} fontWeight={400} mt={10} mb={10}>
        Enter your notes below
      </Heading>
      {/* <StyledContentEditable
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
      /> */}
      <EditorWrapper>
        <Editor
          toolbar={{
            options: ["inline", "list"],
            inline: {
              options: ["bold", "italic", "underline", "strikethrough"],
            },
            list: {
              options: ["unordered", "ordered"],
            },
          }}
          //editorState={editorText}
          onChange={e => setEditorText(e)}
          onBlur={() => {
            const meetingObj = { id: meeting.id, notes: editorText };
            if (meetingType == MeetingTypes.PERSONAL_WEEKLY) {
              meetingStore.updatePersonalMeeting(meetingObj);
            } else if (meetingType == MeetingTypes.TEAM_WEEKLY) {
              meetingStore.updateMeeting(meetingObj);
            }
          }}
        />
      </EditorWrapper>
    </Container>
  );
};

const Container = styled.div``;

const EditorWrapper = styled.div`
  height: 300px;
  overflow-y: auto;
  border: ${props => `1px solid ${props.theme.colors.borderGrey}`};
  padding: 8px;
`;
