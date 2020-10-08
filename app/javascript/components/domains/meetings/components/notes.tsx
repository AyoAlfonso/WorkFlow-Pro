import * as React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useMst } from "~/setup/root";
import MeetingTypes from "~/constants/meeting-types";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

interface NotesProps {
  meeting: any;
}

export const Notes = ({ meeting }: NotesProps): JSX.Element => {
  const { meetingStore } = useMst();

  const meetingType = meeting.meetingType;

  const convertedMeetingNotes = htmlToDraft(meeting.notes);
  const contentState = ContentState.createFromBlockArray(convertedMeetingNotes.contentBlocks);
  const editorState = EditorState.createWithContent(contentState);

  const [editorText, setEditorText] = useState<any>(editorState || EditorState.createEmpty());

  return (
    <Container>
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
          editorState={editorText}
          onEditorStateChange={e => setEditorText(e)}
          onBlur={() => {
            const meetingObj = {
              id: meeting.id,
              notes: draftToHtml(convertToRaw(editorText.getCurrentContent())),
            };
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