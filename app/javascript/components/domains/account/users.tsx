import React, { useState } from "react";
import * as R from "ramda";

import { observer } from "mobx-react";
import { UserCard } from "~/components/shared/user-card";
import { useMst } from "~/setup/root";
import { Button } from "~/components/shared/button";
import { Can } from "~/components/shared/auth/can";
import { useTranslation } from "react-i18next";
import { TextNoMargin, Text } from "~/components/shared/text";

import {
  StretchContainer,
  BodyContainer,
  HeaderContainer,
  HeaderText,
  LeftAlignedTableContainer,
  CenteredTableContainer,
} from "./container-styles";
import { Table } from "~/components/shared/table";
import { Status } from "~/components/shared/status";

import { EditUserModal } from "~/components/domains/company/edit-user-modal";

export const Users = observer(
  (): JSX.Element => {
    const { userStore } = useMst();
    const { users } = userStore;
    const [editUserModalOpen, setEditUserModalOpen] = useState<boolean>(false);

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
                <Button
                  variant={"primaryOutline"}
                  small
                  // iconName={"New-User"}
                  onClick={() => setEditUserModalOpen(true)}
                >
                  {t("company.createUser.addButton")}
                </Button>
                <EditUserModal
                  editUserModalOpen={editUserModalOpen}
                  setEditUserModalOpen={setEditUserModalOpen}
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
