import React, { useState } from "react";
import * as R from "ramda";

import { observer } from "mobx-react";
import { UserCard } from "~/components/shared/user-card";
import { useMst } from "~/setup/root";
import { Button } from "~/components/shared/button";
import { Label, Input, Select } from "~/components/shared/input";
import { Can } from "~/components/shared/auth/can";
import { useTranslation } from "react-i18next";
import { TextNoMargin, Text } from "~/components/shared/text";

import { Flex, Box } from "rebass";
import {
  StretchContainer,
  BodyContainer,
  HeaderContainer,
  HeaderText,
  LeftAlignedTableContainer,
  CenteredTableContainer,
} from "./container-styles";
import { UserStoreModel } from "~/stores/user-store";
import { RoleNormalUser } from "~/lib/constants";
import { Table } from "~/components/shared/table";
import { Status } from "~/components/shared/status";

export const Users = observer(
  (): JSX.Element => {
    const {
      userStore,
      sessionStore: {
        staticData: { userRoles },
      },
    } = useMst();
    const { users } = userStore;

    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userRoleId, setUserRole] = useState(
      R.path(["id"], R.find(R.propEq("name", RoleNormalUser), userRoles)),
    );

    const inviteUser = () => {
      userStore.inviteUser({ email, firstName, lastName, userRoleId });
      setEmail("");
      setFirstName("");
      setLastName("");
      setUserRole(R.path(["id"], R.find(R.propEq("name", RoleNormalUser), userRoles)));
    };

    const resend = userId => userStore.resendInvitation(userId);

    const usersData = R.flatten(
      [].concat(
        users.map(user => [
          <UserCard {...user} resend={resend} />,
          <LeftAlignedTableContainer>
            <Text>{user.title || ""}</Text>
          </LeftAlignedTableContainer>,
          <LeftAlignedTableContainer>
            <Text>Teams</Text>
          </LeftAlignedTableContainer>,
          <LeftAlignedTableContainer>
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
                        variant={"primaryOutline"}
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
          </LeftAlignedTableContainer>,
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
                <Label htmlFor="email">{t("profile.profileUpdateForm.email")}</Label>
                <Input name="email" onChange={e => setEmail(e.target.value)} value={email} />
                <Label htmlFor="firstName">{t("profile.profileUpdateForm.firstName")}</Label>
                <Input
                  name="firstName"
                  onChange={e => setFirstName(e.target.value)}
                  value={firstName}
                />
                <Label htmlFor="lastName">{t("profile.profileUpdateForm.lastName")}</Label>
                <Input
                  name="lastName"
                  onChange={e => setLastName(e.target.value)}
                  value={lastName}
                />
                <Label htmlFor="userRole">{t("profile.profileUpdateForm.role")}</Label>
                <Select
                  name="userRole"
                  onChange={e => {
                    setUserRole(e.target.value);
                  }}
                  value={userRoleId}
                >
                  {R.map(
                    userRole => (
                      <option key={userRole.id} value={userRole.id}>
                        {userRole.name}
                      </option>
                    ),
                    userRoles,
                  )}
                </Select>
                <Button
                  small
                  variant={"primary"}
                  onClick={inviteUser}
                  disabled={
                    email.length == 0 ||
                    firstName.length == 0 ||
                    lastName.length == 0 ||
                    R.isNil(userRoleId)
                  }
                  style={{
                    marginLeft: "auto",
                    marginTop: "auto",
                    marginBottom: "24px",
                    marginRight: "24px",
                  }}
                >
                  {t("profile.profileUpdateForm.invite")}
                </Button>
              </>
            }
          />
        </HeaderContainer>
        <BodyContainer>
          <Table columns={4} headers={["User", "Title", "Team", "Status"]} data={usersData} />
        </BodyContainer>
      </StretchContainer>
    );
  },
);
