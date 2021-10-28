import React, { useEffect } from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { TeamSettings } from "~/components/domains/account/team-settings";
import { Loading } from "~/components/shared/loading";

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
    sessionStore: { profile },
  } = useMst();
  const { t } = useTranslation();

  const teamsData = R.flatten(
    [].concat(
      profile.teams
        .sort((a, b) => {
          return a.name?.localeCompare(b.name);
        })
        .map(team => [<TeamSettings team={team} key={team.id} />]),
    ),
  );

  if (R.isNil(profile)) {
    return <Loading />;
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
