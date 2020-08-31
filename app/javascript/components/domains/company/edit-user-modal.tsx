import * as React from "react";
import * as R from "ramda";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { useState } from "react";
import { useMst } from "../../../setup/root";

import { useTranslation } from "react-i18next";
import { Label, Input, Select, FormContainer, Button } from "~/components/shared";
import { Can } from "~/components/shared/auth/can";
import { RoleNormalUser } from "~/lib/constants";

import { Container, FlexContainer } from "~/components/shared/styles/modals";
import { maybeNull } from "mobx-state-tree/dist/internal";

interface IEditUserModal {
  editUserModalOpen: boolean;
  setEditUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number;
  setUserId: React.Dispatch<React.SetStateAction<number>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  userRoleId: number;
  setUserRole: React.Dispatch<React.SetStateAction<number>>;
}

export const getUserRoleIdFrom = (userRoleName, userRoles) =>
  R.path(["id"], R.find(R.propEq("name", userRoleName), userRoles));

export const EditUserModal = ({
  editUserModalOpen,
  setEditUserModalOpen,
  userId,
  setUserId,
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  title,
  setTitle,
  userRoleId,
  setUserRole,
}: IEditUserModal): JSX.Element => {
  const {
    userStore,
    sessionStore: {
      staticData: { userRoles },
    },
  } = useMst();

  const { t } = useTranslation();

  // const [email, setEmail] = useState("");
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [userRoleId, setUserRole] = useState(
  //   R.path(["id"], R.find(R.propEq("name", RoleNormalUser), userRoles)),
  // );

  const resetUser = () => {
    //reset to new user
    setUserId(null);
    setEmail("");
    setFirstName("");
    setLastName("");
    setTitle("");
    setUserRole(getUserRoleIdFrom(RoleNormalUser, userRoles));
  };

  const inviteNewUser = () => {
    userStore.inviteUser({ email, firstName, lastName, title, userRoleId });
    resetUser();
  };

  const updateUser = () => {
    if (!R.isNil(userId)) {
      userStore.updateUser({ id: userId, email, firstName, lastName, title, userRoleId });
      // resetUser();
    }
  };

  return (
    <ModalWithHeader
      modalOpen={editUserModalOpen}
      setModalOpen={setEditUserModalOpen}
      headerText={t("company.createUser.addButton")}
      width="35rem"
    >
      <Container>
        <FlexContainer>
          <Can
            action={"create-user"}
            data={null}
            no={<></>}
            yes={
              <FormContainer>
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
                <Label htmlFor="title">{t("profile.profileUpdateForm.title")}</Label>
                <Input name="title" onChange={e => setTitle(e.target.value)} value={title} />
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
                  onClick={userId ? updateUser : inviteNewUser}
                  width={"200px"}
                  disabled={
                    email.length == 0 ||
                    firstName.length == 0 ||
                    lastName.length == 0 ||
                    title.length == 0 ||
                    R.isNil(userRoleId)
                  }
                  variant={"primary"}
                >
                  {t("profile.profileUpdateForm.save")}
                </Button>
              </FormContainer>
            }
          />
        </FlexContainer>
      </Container>
    </ModalWithHeader>
  );
};
