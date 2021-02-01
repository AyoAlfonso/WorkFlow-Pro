import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import * as R from "ramda";
import { observer } from "mobx-react";
import * as moment from "moment";
import { Text } from "~/components/shared/text";
import { MeetingAgenda } from "../../meetings/components/meeting-agenda";
import { Heading } from "~/components/shared";
interface ISelectedMeetingAgendaEntry {
  selectedMeeting: any;
}

export const SelectedMeetingAgendaEntry = observer(
  ({ selectedMeeting }: ISelectedMeetingAgendaEntry) => {
    const { t } = useTranslation();
    const {
      teamStore: { teams },
    } = useMst();

    const teamMembers = teams.find(team => team.id == selectedMeeting.teamId)["users"];
    const topicOwner = teamMembers.find(
      member => member.id == R.path(["settings", "forumExplorationTopicOwnerId"], selectedMeeting),
    );

    return (
      <Container>
        <MeetingHeader>
          <Heading type={"h3"}>{t("forum.forumMeeting")}</Heading>
          <MeetingTimeText>
            {moment(selectedMeeting.scheduledStartTime).format("dddd, MMMM D, LT")}
          </MeetingTimeText>
        </MeetingHeader>
        <MeetingAgenda steps={selectedMeeting.steps} currentStep={999} topicOwner={topicOwner} />
      </Container>
    );
  },
);

const Container = styled.div`
  width: 500px;
  margin-right: 30px;
`;

const MeetingHeader = styled.div``;

const MeetingTimeText = styled(Text)`
  font-size: 12px;
  color: ${props => props.theme.colors.grey80};
`;
