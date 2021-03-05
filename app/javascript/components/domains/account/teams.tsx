import React, { useState } from "react";
import * as R from "ramda";
import { Checkbox, Label } from "@rebass/forms";
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
  HeaderContainer,
  HeaderText,
  LeftAlignedTableContainer,
  LeftAlignedColumnListTableContainer,
} from "./container-styles";

import { Table } from "~/components/shared/table";
import styled from "styled-components";
import { Can } from "~/components/shared/auth/can";
import { Button } from "~/components/shared";
import { CreateNewTeamModal } from "./teams/create-new-team-modal";

export const Teams = observer(
  (): JSX.Element => {
    const {
      teamStore: { teams },
      userStore: { users },
      userStore,
    } = useMst();

    const [createTeamModalOpen, setCreateTeamModalOpen] = useState<boolean>(false);

    const { t } = useTranslation();
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
          <LeftAlignedTableContainer>
            <Status key={`team-${team.id}-active`} status={team.active ? "active" : "inactive"} />
          </LeftAlignedTableContainer>,
          <LeftAlignedColumnListTableContainer>
            {users
              .filter(user => team.isAMember(user))
              .map(
                user =>
                  user && (
                    <UserCardContainer key={user.id}>
                      <UserCard {...user} />
                    </UserCardContainer>
                  ),
              )}
          </LeftAlignedColumnListTableContainer>,

          <LeftAlignedColumnListTableContainer>
            {users
              .filter(user => team.isAMember(user))
              .map(
                user =>
                  user && (
                    <CheckboxContainer key={user.id}>
                      <Label>
                        <Checkbox
                          id={`${user.id}`}
                          defaultChecked={team.isALead(user)}
                          onChange={e => {
                            userStore.updateUserTeamRole(user.id, team.id, e.target.checked);
                          }}
                        />
                      </Label>
                    </CheckboxContainer>
                  ),
              )}
          </LeftAlignedColumnListTableContainer>,
        ]),
      ),
    );

    return (
      <StretchContainer>
        <HeaderContainer>
          <HeaderText>{t("profile.teamsManagement.header")}</HeaderText>
          <Can
            action={"create-team"}
            data={null}
            no={<></>}
            yes={
              <>
                <Button
                  variant={"primaryOutline"}
                  small
                  onClick={() => {
                    setCreateTeamModalOpen(true);
                  }}
                >
                  {t("company.createTeam.addButton")}
                </Button>
                <CreateNewTeamModal
                  modalOpen={createTeamModalOpen}
                  setModalOpen={setCreateTeamModalOpen}
                />
              </>
            }
          />
        </HeaderContainer>
        <BodyContainer>
          <Table
            columns={4}
            headers={["Team", "Status", "Team Members", "Start Meetings?"]}
            data={teamsData}
            styling={{ widths: [2, 1, 2, 2] }}
          ></Table>
        </BodyContainer>
      </StretchContainer>
    );
  },
);

const UserCardContainer = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const CheckboxContainer = styled.div`
  height: 48px;
  margin-top: 8px;
  margin-bottom: 8px;
  justify-content: center;
  align-items: center;
  display: flex;
  &: hover {
    cursor: pointer;
  }
`;
