import React, { useState } from "react";
import * as R from "ramda";

import { observer } from "mobx-react";
import { UserCard } from "~/components/shared/user-card";
import { useMst } from "~/setup/root";
import { Icon, Button } from "~/components/shared";
import { Can } from "~/components/shared/auth/can";
import { useTranslation } from "react-i18next";
import { TextNoMargin, Text } from "~/components/shared/text";
import { RoleNormalUser } from "~/lib/constants";

import {
  StretchContainer,
  BodyContainer,
  HeaderContainer,
  HeaderText,
  LeftAlignedTableContainer,
  SpacedTableContainer,
  IconContainer,
} from "./container-styles";
import { Table } from "~/components/shared/table";
import { Status } from "~/components/shared/status";

import { EditUserModal, getUserRoleIdFrom } from "~/components/domains/company/edit-user-modal";

export const Users = observer(
  (): JSX.Element => {
    const {
      userStore,
      sessionStore: {
        staticData: { userRoles },
      },
    } = useMst();
    const { users } = userStore;
    const [editUserModalOpen, setEditUserModalOpen] = useState<boolean>(false);

    const [deactivated, setUserDeactivated] = useState(true);
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userRoleId, setUserRole] = useState(
      R.path(["id"], R.find(R.propEq("name", RoleNormalUser), userRoles)),
    );
    const [title, setTitle] = useState("");
    const [teams, setTeams] = useState<any>({});

    const { t } = useTranslation();

    const resend = userId => userStore.resendInvitation(userId);

    const usersData = R.flatten(
      [].concat(
        users.map(user => [
          <UserCard {...user} />,
          <LeftAlignedTableContainer>
            <Text>{user.title || ""}</Text>
          </LeftAlignedTableContainer>,
          <LeftAlignedTableContainer>
            <Text>{user.teamNames}</Text>
          </LeftAlignedTableContainer>,
          <SpacedTableContainer>
            <Status status={user.status} />
            {user.status == "pending" ? (
              <Can
                action={"create-user"}
                data={null}
                no={
                  <TextNoMargin fontSize={1}>{`Invited on ${user.invitationSentAt}`}</TextNoMargin>
                }
                yes={
                  <>
                    {resend ? (
                      <Button
                        small
                        variant={"noOutline"}
                        fontOverride={"12px"}
                        onClick={() => {
                          if (resend) {
                            resend(user.id);
                          }
                        }}
                      >
                        {t("profile.profileUpdateForm.resend")}
                      </Button>
                    ) : (
                      <></>
                    )}
                  </>
                }
              />
            ) : (
              <></>
            )}
            <Can
              action={"create-user"}
              data={null}
              no={<></>}
              yes={
                <IconContainer
                  onClick={() => {
                    setUserDeactivated(user.status == "inactive");
                    setUserId(user.id);
                    setEmail(user.email || "");
                    setFirstName(user.firstName || "");
                    setLastName(user.lastName || "");
                    setUserRole(getUserRoleIdFrom(user.role, userRoles));
                    setTitle(user.title || "");
                    setEditUserModalOpen(true);
                  }}
                >
                  <Icon icon={"Edit-2"} size={"15px"} iconColor={"grey80"} />
                </IconContainer>
              }
            />
          </SpacedTableContainer>,
        ]),
      ),
    );
    return (
      <StretchContainer>
        <HeaderContainer>
          <HeaderText>{t("profile.teamsManagement.header")}</HeaderText>
          <Can
            action={"create-user"}
            data={null}
            no={<></>}
            yes={
              <>
                <Button
                  variant={"primaryOutline"}
                  small
                  // iconName={"New-User"}
                  onClick={() => {
                    setUserDeactivated(false);
                    setUserId(null);
                    setEmail("");
                    setFirstName("");
                    setLastName("");
                    setUserRole(
                      R.path(["id"], R.find(R.propEq("name", RoleNormalUser), userRoles)),
                    );
                    setTitle("");
                    setEditUserModalOpen(true);
                  }}
                >
                  {t("company.createUser.addButton")}
                </Button>
                <EditUserModal
                  editUserModalOpen={editUserModalOpen}
                  setEditUserModalOpen={setEditUserModalOpen}
                  userId={userId}
                  setUserId={setUserId}
                  email={email}
                  setEmail={setEmail}
                  firstName={firstName}
                  setFirstName={setFirstName}
                  lastName={lastName}
                  setLastName={setLastName}
                  teams={teams}
                  setTeams={setTeams}
                  title={title}
                  setTitle={setTitle}
                  userRoleId={userRoleId}
                  setUserRole={setUserRole}
                  deactivated={deactivated}
                />
              </>
            }
          />
        </HeaderContainer>
        <BodyContainer>
          <Table
            columns={4}
            headers={["User", "Title", "Team", "Status"]}
            data={usersData}
            styling={{ widths: [2, 1, 1, 1] }}
          />
        </BodyContainer>
      </StretchContainer>
    );
  },
);
