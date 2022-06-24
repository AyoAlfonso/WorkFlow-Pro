import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Heading } from "~/components/shared";
import { Card } from "~/components/shared/card";
import { Notes } from "../../meetings/components/notes";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";

interface ISelectedMeetingNotes {
  selectedMeetingId: string | number;
}

export const SelectedMeetingNotes = observer(({ selectedMeetingId }: ISelectedMeetingNotes) => {
  const { t } = useTranslation();

  const { forumStore } = useMst();

  const selectedMeeting = forumStore.searchedForumMeetings.find(
    meeting => meeting.id == selectedMeetingId,
  );

  return (
    <Container>
      <NotesHeader>
        <Heading type={"h4"}>{t<string>("meeting.sideOptions.notes")}</Heading>
      </NotesHeader>
      <Notes meeting={selectedMeeting} height={"550px"} hideSideBorders={true} />
    </Container>
  );
});

const Container = styled(Card)`
  margin-left: 16px;
  min-width: 375px;
  margin-top: 1rem;
`;

const NotesHeader = styled.div`
  margin-left: 16px;
`;
