import * as React from "react";
import * as R from "ramda";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { useState } from "react";
import { useMst } from "../../../setup/root";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Label, Input, Text, FormContainer, Button } from "~/components/shared";
import { Can } from "~/components/shared/auth/can";
import { ITeam } from "~/models/team";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import Switch from "~/components/shared/switch";

interface ITeamSettings {
  team: ITeam;
}

const StyledLabel = withStyles({
  label: {
    fontFamily: "Lato",
  },
})(FormControlLabel);

export const TeamSettings = ({ team }: ITeamSettings): JSX.Element => {
  const {
    teamStore,
    sessionStore: { profile },
  } = useMst();
  const { t } = useTranslation();
  const [toggleChecked, setToggleChecked] = useState(team.customScorecard);
  const [teamSettingWeeklyDashboard, setTeamSettingWeeklyDashboard] = useState(
    R.pathOr("", ["settings", "weeklyMeetingDashboardLinkEmbed"], team),
  );

  const saveSettings = value => {
    setTeamSettingWeeklyDashboard(value);
    const settings = {};
    if (value) {
      Object.assign(settings, { weekly_meeting_dashboard_link_embed: value });
    }
    teamStore.updateTeamSettings(
      {
        id: team.id,
        settings,
      },
      true,
    );
  };
  const handleToggleChange = () => {
    setToggleChecked(!toggleChecked);
    if (toggleChecked == false) {
      saveSettings(null);
    }
    teamStore.updateTeamSettings({
      id: team.id,
      customScorecard: !toggleChecked,
    });
  };

  return (
    <>
      <Can
        action={"edit-team-settings"}
        data={{ team, user: profile }}
        no={
          <TeamInfoContainer key={team.id}>
            <InputAndToggle>
              <LabelAndNameContainer>
                <StyledText>{team.name}</StyledText>
                <LabelContainer htmlFor="weekly_meeting_dashboard_link_embed">
                  You do not have access to this toggle
                </LabelContainer>
              </LabelAndNameContainer>
              <FormGroup row>
                <StyledLabel
                  control={<Switch checked={toggleChecked} name="switch-checked" />}
                  label=""
                  labelPlacement="end"
                />
              </FormGroup>
            </InputAndToggle>
            {toggleChecked && (
              <Input
                name="weekly_meeting_dashboard_link_embed"
                value={teamSettingWeeklyDashboard}
              />
            )}
          </TeamInfoContainer>
        }
        yes={
          <TeamInfoContainer key={team.id}>
            <InputAndToggle>
              <LabelAndNameContainer>
                <StyledText>{team.name}</StyledText>
                <LabelContainer htmlFor="weekly_meeting_dashboard_link_embed">
                  You have access to your LynchPyn Scorecard by default in the meetings. To use your
                  own embedded scorecard or dashboard, activate the toggle.
                </LabelContainer>
              </LabelAndNameContainer>
              <FormGroup row>
                <StyledLabel
                  control={
                    <Switch
                      checked={toggleChecked}
                      onChange={handleToggleChange}
                      name="switch-checked"
                    />
                  }
                  label=""
                  labelPlacement="end"
                />
              </FormGroup>
            </InputAndToggle>
            {toggleChecked && (
              <StyledInput
                name="weekly_meeting_dashboard_link_embed"
                value={teamSettingWeeklyDashboard}
                onChange={e => {
                  saveSettings(e.target.value);
                }}
                placeholder="Enter embedded URL..."
              />
            )}
          </TeamInfoContainer>
        }
      />
    </>
  );
};

const LabelContainer = styled(Label)`
  font-size: 12px;
  color: ${props => props.theme.colors.grey100};
`;

const LabelAndNameContainer = styled.div``;

const InputAndToggle = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const TeamInfoContainer = styled.div`
  margin-bottom: 20px;
`;

const StyledInput = styled(Input)`
  &::placeholder {
    font-size: 12px;
  }
`;

const StyledText = styled(Text)`
  font-size: 1em;
  margin: 0;
  margin-bottom: 16px;
`;
