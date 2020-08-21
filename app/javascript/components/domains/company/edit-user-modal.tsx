import * as React from "react";
import * as R from "ramda";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { useState } from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { Button } from "rebass";
import { baseTheme } from "../../../themes";
import { useMst } from "../../../setup/root";

import { useTranslation } from "react-i18next";
import { Label, Input, Select, FormContainer } from "~/components/shared/input";
import { RoleNormalUser } from "~/lib/constants";
import { Can } from "~/components/shared/auth/can";

import { Container, FlexContainer } from "~/components/shared/styles/modals";

interface IEditUserModal {
  editUserModalOpen: boolean;
  setEditUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditUserModal = ({
  editUserModalOpen,
  setEditUserModalOpen,
}: IEditUserModal): JSX.Element => {
  const {
    userStore,
    sessionStore: {
      staticData: { userRoles },
    },
  } = useMst();

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

  return (
    <ModalWithHeader
      modalOpen={editUserModalOpen}
      setModalOpen={setEditUserModalOpen}
      headerText={t("company.createUserForm.addButton")}
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
              </FormContainer>
            }
          />
        </FlexContainer>
      </Container>
    </ModalWithHeader>
  );
};

type StyledButtonType = {
  disabled: boolean;
};

const StyledButton = styled(Button)<StyledButtonType>`
  background-color: ${props =>
    props.disabled ? baseTheme.colors.grey60 : baseTheme.colors.primary100};
  width: 130px;
  &: hover {
    cursor: ${props => !props.disabled && "pointer"};
  }
`;
