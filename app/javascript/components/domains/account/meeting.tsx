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
import { Text } from "~/components/shared";

const BodyContainer = styled.div`
  display: block;
`;

export const Meeting = (): JSX.Element => {
  const {
    sessionStore: { profile },
  } = useMst();
  const { t } = useTranslation();

  if (R.isNil(profile)) {
    return <Loading />;
  }
  const teamsData = R.flatten(
    [].concat(profile.teams.map(team => [<TeamSettings team={team} key={team.id} />])),
  );
  return (
    <StretchContainer>
      <HeaderContainer>
        <HeaderText>{t<string>("profile.meetingsManagement.header")}</HeaderText>
      </HeaderContainer>
      <SubHeader>{t<string>(`profile.customScorecard`)}</SubHeader>
      <BodyContainer>{teamsData}</BodyContainer>
    </StretchContainer>
  );
};

const SubHeader = styled(Text)`
  color: ${props => props.theme.colors.grey100};
  font-weight: bold;
  font-size: 1em;
  margin: 0;
  margin-bottom: 1.3em;
`;
