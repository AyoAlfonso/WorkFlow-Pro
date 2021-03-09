import * as React from "react";
import * as R from "ramda";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { useState } from "react";
import { useMst } from "../../../setup/root";

import { useTranslation } from "react-i18next";
import { Label, Input, Text, FormContainer, Button } from "~/components/shared";
import { Can } from "~/components/shared/auth/can";
import { ITeam } from "~/models/team";

import {
  StretchContainer,
  BodyContainer,
  PersonalInfoContainer,
  HeaderContainer,
  HeaderText,
} from "./container-styles";

interface ITeamSettings {
  team: ITeam;
}

export const TeamSettings = ({ team }: ITeamSettings): JSX.Element => {
  const {
    teamStore,
    sessionStore: { profile },
  } = useMst();
  const { t } = useTranslation();
  const [teamSettingWeeklyDashboard, setTeamSettingWeeklyDashboard] = useState(
    R.pathOr("", ["settings", "weeklyMeetingDashboardLinkEmbed"], team),
  );

  const saveSettings = () => {
    teamStore.updateTeamSettings({
      id: team.id,
      settings: {
        weekly_meeting_dashboard_link_embed: teamSettingWeeklyDashboard,
      },
    });
  };

  return (
    <>
      <Can
        action={"edit-team-settings"}
        data={{ team, user: profile }}
        no={
          <PersonalInfoContainer key={team.id}>
            <Text fontSize={2}>{team.name}</Text>
            <Label htmlFor="weekly_meeting_dashboard_link_embed">
              Weekly Meeting Dashboard Link Embed
            </Label>
            <Input
              name="weekly_meeting_dashboard_link_embed"
              value={teamSettingWeeklyDashboard}
              disabled={true}
            />
          </PersonalInfoContainer>
        }
        yes={
          <PersonalInfoContainer key={team.id}>
            <Text fontSize={2}>{team.name}</Text>
            <Label htmlFor="weekly_meeting_dashboard_link_embed">
              Weekly Meeting Dashboard Link Embed
            </Label>
            <Input
              name="weekly_meeting_dashboard_link_embed"
              value={teamSettingWeeklyDashboard}
              onChange={e => setTeamSettingWeeklyDashboard(e.target.value)}
            />
            <Button small onClick={saveSettings} width={"200px"} variant={"primary"}>
              {t("profile.profileUpdateForm.save")}
            </Button>
          </PersonalInfoContainer>
        }
      />
    </>
  );
};
