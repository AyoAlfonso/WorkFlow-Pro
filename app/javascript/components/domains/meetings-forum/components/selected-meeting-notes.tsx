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
        <Heading type={"h4"}>{t("meeting.sideOptions.notes")}</Heading>
      </NotesHeader>
      <Notes meeting={selectedMeeting} height={"550px"} />
    </Container>
  );
});

const Container = styled(Card)`
  padding-left: 15px;
  padding-right: 15px;
  width: 50%;
  min-width: 400px;
  padding-bottom: 50px;
`;

const NotesHeader = styled.div``;
