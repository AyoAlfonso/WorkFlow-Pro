import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Loading } from "~/components/shared/loading";
import { useParams } from "react-router-dom";
import MeetingTypes from "~/constants/meeting-types";

import { ParkingLotIssues } from "~/components/domains/meetings-forum/components/parking-lot-issues";
import { ScheduledIssues } from "~/components/domains/meetings-forum/components/scheduled-issues";

import {
  ColumnContainerParent,
  ColumnContainer,
  HeaderText,
} from "~/components/shared/styles/row-style";
import { useTranslation } from "react-i18next";

export const TeamIssues = observer(
  (props: {}): JSX.Element => {
    const {
      meetingStore: { currentMeeting },
      teamStore: { teams },
      issueStore,
    } = useMst();
    const { t } = useTranslation();
    const { team_id } = useParams();

    const currentTeam = (teams || []).find(team => team.id === currentMeeting.teamId);

    if (R.isNil(currentTeam) || R.isNil(currentMeeting)) {
      return <Loading />;
    }

    useEffect(() => {
      issueStore.fetchTeamIssues(team_id);
    }, []);

    useEffect(() => {
      //please refer to exploration.tsx if we do refactor this
      issueStore.fetchTeamIssues(team_id); //ASSUMPTIONS: team_id matches the current meetings team_id
      // issueStore.fetchIssuesForMeeting(meetingStore.currentMeeting.id) removed as we should get it all for team issues

      if (currentMeeting) {
        issueStore.fetchTeamIssueMeetingEnablements(currentMeeting.id);
      }
    }, [currentMeeting.teamId]);

    return (
      <ColumnContainerParent>
        <ColumnContainer>
          <HeaderText text={t("meeting.teamIssues.scheduledIssues.title")} />
          <ScheduledIssues
            teamId={currentMeeting.teamId}
            upcomingForumMeeting={currentMeeting}
            descriptionText={t("meeting.teamIssues.scheduledIssues.subTitle")}
          />
        </ColumnContainer>
        <ColumnContainer>
          <HeaderText
            text={t("meeting.teamIssues.parkingLotIssues.title", { teamName: "Team" })}
          />
          <ParkingLotIssues
            teamId={currentMeeting.teamId}
            upcomingForumMeeting={currentMeeting}
            descriptionText={t("meeting.teamIssues.parkingLotIssues.subTitle")}
          />
        </ColumnContainer>
      </ColumnContainerParent>
    );
  },
);
