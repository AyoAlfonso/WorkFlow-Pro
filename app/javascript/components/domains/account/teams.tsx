import React, { useState } from "react";
import * as R from "ramda";

import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { TextNoMargin } from "~/components/shared/text";
import { Status } from "~/components/shared/status";
import { Avatar } from "~/components/shared/avatar";
import { UserCard } from "~/components/shared/user-card";

import {
  StretchContainer,
  BodyContainer,
  PersonalInfoContainer,
  HeaderContainer,
  HeaderText,
  LeftAlignedTableContainer,
  CenteredTableContainer,
  LeftAlignedColumnListTableContainer,
} from "./container-styles";

import { Table } from "~/components/shared/table";

export const Teams = observer(
  (): JSX.Element => {
    const {
      teamStore: { teams },
      userStore: { users },
    } = useMst();

    const { t } = useTranslation();
    // const teamsData = [];
    const teamsData = R.flatten(
      [].concat(
        teams.map(team => [
          <LeftAlignedTableContainer>
            <Avatar
              defaultAvatarColor={team.defaultAvatarColor}
              firstName={team.name}
              lastName={""}
              size={48}
              marginLeft={"inherit"}
              marginRight={"8px"}
            />
            <TextNoMargin fontSize={1} color={"black"} key={`team-${team.id}-name`}>
              {team.name}
            </TextNoMargin>
          </LeftAlignedTableContainer>,
          <LeftAlignedColumnListTableContainer>
            {users
              .filter(user => team.isALead(user))
              .map(user => (user ? <UserCard key={user.id} {...user} /> : <></>))}
          </LeftAlignedColumnListTableContainer>,
          <Status key={`team-${team.id}-active`} status={team.active ? "active" : "inactive"} />,
          <LeftAlignedTableContainer>
            {users
              .filter(user => R.contains(user.id, team.nonLeadMemberIds))
              .map(user =>
                user ? (
                  <Avatar
                    key={user.id}
                    defaultAvatarColor={R.path(["defaultAvatarColor"], user)}
                    avatarUrl={R.path(["avatarUrl"], user)}
                    firstName={R.path(["firstName"], user)}
                    lastName={R.path(["lastName"], user)}
                    size={32}
                    marginLeft={"inherit"}
                    marginRight={"8px"}
                  />
                ) : (
                  <></>
                ),
              )}
          </LeftAlignedTableContainer>,
        ]),
      ),
    );

    return (
      <StretchContainer>
        <HeaderContainer>
          <HeaderText>{t("profile.teamsManagement.header")}</HeaderText>
        </HeaderContainer>
        <BodyContainer>
          <Table
            columns={4}
            headers={["Team", "Team Leader", "Status", "Members"]}
            data={teamsData}
            styling={{ widths: [2, 2, 1, 2] }}
          ></Table>
        </BodyContainer>
      </StretchContainer>
    );
  },
);
