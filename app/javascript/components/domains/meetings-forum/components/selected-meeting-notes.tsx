import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Heading } from "~/components/shared";
import { Card } from "~/components/shared/card";
import { Notes } from "../../meetings/components/notes";

interface ISelectedMeetingNotes {
  selectedMeeting: any;
}

export const SelectedMeetingNotes = ({ selectedMeeting }: ISelectedMeetingNotes) => {
  const { t } = useTranslation();

  return (
    <Container>
      <NotesHeader>
        <Heading type={"h4"}>{t("meeting.sideOptions.notes")}</Heading>
      </NotesHeader>
      <Notes meeting={selectedMeeting} height={"550px"} />
    </Container>
  );
};

const Container = styled(Card)`
  padding-left: 15px;
  padding-right: 15px;
  width: 500px;
`;

const NotesHeader = styled.div``;
