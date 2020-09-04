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

  const teamsData = R.flatten(
    [].concat(profile.teams.map(team => [<TeamSettings team={team} key={team.id} />])),
  );

  return (
    <StretchContainer>
      <HeaderContainer>
        <HeaderText>{t("profile.meetingsManagement.header")}</HeaderText>
      </HeaderContainer>
      <BodyContainer>
        <PersonalInfoContainer>
          <p>
            Meetings will heaviliy updated in Beta Phase. List of agenda items for the weekly team
            meeting with a toggle beside them that allows the Team Leader (refer to Users tab) to
            disable an agenda item and/or change the order.
          </p>
        </PersonalInfoContainer>

        {teamsData}
      </BodyContainer>
    </StretchContainer>
  );
};
