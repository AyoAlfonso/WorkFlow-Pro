import * as React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useMst } from "~/setup/root";
import MeetingTypes from "~/constants/meeting-types";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

interface NotesProps {
  meeting: any;
  height?: string;
}

export const Notes = ({ meeting, height }: NotesProps): JSX.Element => {
  const { meetingStore, forumStore } = useMst();

  const meetingType = meeting.meetingType;

  const [editorText, setEditorText] = useState<any>(null);

  useEffect(() => {
    const convertedMeetingNotes = htmlToDraft(meeting.notes ? meeting.notes : "");
    const contentState = ContentState.createFromBlockArray(convertedMeetingNotes.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    setEditorText(editorState || EditorState.createEmpty());
  }, [meeting.notes]);

  return (
    <Container>
      <EditorWrapper height={height}>
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
          placeholder={"You can enter your notes here..."}
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
            } else if (meetingType == MeetingTypes.FORUM_MONTHLY) {
              forumStore.updateMeeting(meetingObj, true);
            }
          }}
        />
      </EditorWrapper>
    </Container>
  );
};

const Container = styled.div`
  height: inherit;
`;

type EditorWrapperProps = {
  height?: string;
};

const EditorWrapper = styled.div<EditorWrapperProps>`
  height: ${props => props.height || "300px"};
  overflow-y: auto;
  border: ${props => `1px solid ${props.theme.colors.borderGrey}`};
  padding: 8px;
`;
