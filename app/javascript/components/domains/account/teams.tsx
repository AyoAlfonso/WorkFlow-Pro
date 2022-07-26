import React, { useState, useEffect } from "react";
import * as R from "ramda";
import { Checkbox, Label } from "@rebass/forms";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { TextNoMargin } from "~/components/shared/text";
import { Status } from "~/components/shared/status";
import { Avatar } from "~/components/shared/avatar";
import { UserCard } from "~/components/shared/user-card";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

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
import { Button, IconContainer, Icon } from "~/components/shared";
import { CreateNewTeamModal } from "./teams/create-new-team-modal";
import { EditTeamModal } from "./teams/edit-team-modal";
import { sortUsersListByName } from "~/utils/sorting";
import { ParticipantsAvatars } from "~/components/shared/participants-avatars";

export const Teams = observer(
  (): JSX.Element => {
    const {
      teamStore: { teams },
      teamStore,
      userStore: { users },
      userStore,
    } = useMst();

    const [createTeamModalOpen, setCreateTeamModalOpen] = useState<boolean>(false);
    const [editTeamModalOpen, setEditTeamModalOpen] = useState<boolean>(false);
    const [selectedEditTeam, setSelectedEditTeam] = useState<any>({});

    useEffect(() => {
      teamStore.load();
    }, []);

    const userList = users.slice().sort(sortUsersListByName)

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
            <ParticipantsAvatars entityList={userList.filter(user => team.isAMember(user))} />
          </LeftAlignedTableContainer>,
          <LeftAlignedColumnListTableContainer>
            <Can
              action={"create-team"}
              data={null}
              no={<></>}
              yes={
                <ActionsContainer>
                  <StyledIconContainer
                    onClick={() => {
                      setSelectedEditTeam(team);
                      setEditTeamModalOpen(true);
                    }}
                  >
                    <Icon icon={"Edit-2"} size={"15px"} iconColor={"grey80"} />
                  </StyledIconContainer>
                  <StyledIconContainer
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this team?")) {
                        teamStore.deleteTeam(team.id, {
                          note: `Deleted Team via the teams module on settings page `,
                        });
                      }
                    }}
                  >
                    <Icon icon={"Delete"} size={"15px"} iconColor={"grey80"} />
                  </StyledIconContainer>
                </ActionsContainer>
              }
            />
          </LeftAlignedColumnListTableContainer>,
        ]),
      ),
    );

    return (
      <StretchContainer>
        <HeaderContainer>
          <HeaderText>{t<string>("profile.teamsManagement.header")}</HeaderText>
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
                  {t<string>("company.createTeam.addButton")}
                </Button>
                <CreateNewTeamModal
                  modalOpen={createTeamModalOpen}
                  setModalOpen={setCreateTeamModalOpen}
                />
              </>
            }
          />
          <EditTeamModal
            team={selectedEditTeam}
            modalOpen={editTeamModalOpen}
            setModalOpen={setEditTeamModalOpen}
          />
        </HeaderContainer>
        <BodyContainer>
          <Table
            columns={3}
            headers={["Team", "Team Members", ""]}
            data={teamsData}
            styling={{ widths: [3, 3, 1] }}
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
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  align-items: center;
  display: flex;
  &: hover {
    cursor: pointer;
  }
`;

const StyledIconContainer = styled(IconContainer)`
  margin-top: 16px;
  margin-left: 8px;
  margin-right: 8px;
  &: hover {
    cursor: pointer;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  margin-left: auto;
`;
