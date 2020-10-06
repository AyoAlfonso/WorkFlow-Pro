import * as React from "react";
import styled from "styled-components";
import { useState, useRef } from "react";
import ContentEditable from "react-contenteditable";
import { Heading } from "~/components/shared";
import { useMst } from "~/setup/root";

interface NotesProps {
  meetingId: string | number;
}

export const Notes = ({ meetingId }: NotesProps): JSX.Element => {
  const notesRef = useRef(null);
  const [notesContent, setNotesContent] = useState<string>("");

  const { meetingStore } = useMst();

  return (
    <Container>
      <Heading type={"h5"} fontSize={"16px"} fontWeight={400} mt={10} mb={10}>
        Enter your notes below
      </Heading>
      <StyledContentEditable
        innerRef={notesRef}
        html={notesContent}
        onChange={e => {
          setNotesContent(e.target.value);
        }}
        onBlur={() => meetingStore.updateMeeting({ id: meetingId, notes: notesContent })}
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
