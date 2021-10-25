import React from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { TeamSettings } from "~/components/domains/account/team-settings";

import {
  StretchContainer,
  HeaderContainer,
  HeaderText,
  PersonalInfoContainer,
} from "./container-styles";

const BodyContainer = styled.div`
  display: block;
  padding: 16px;
`;

export const Meeting = (): JSX.Element => {
  const {
    // teamStore: { teams },
    sessionStore: { profile },
  } = useMst();
  const { t } = useTranslation();

  const profileTeams = R.sort((a, b) => a?.name.localeCompare(b?.name), profile.teams);
  const teamsData = R.flatten(
    [].concat(profileTeams.map(team => [<TeamSettings team={team} key={team.id} />])),
  );

  if (!teamsData) {
    return <> </>;
  }
  return (
    <StretchContainer>
      <HeaderContainer>
        <HeaderText>{t("profile.meetingsManagement.header")}</HeaderText>
      </HeaderContainer>
      <BodyContainer>{teamsData}</BodyContainer>
    </StretchContainer>
  );
};
