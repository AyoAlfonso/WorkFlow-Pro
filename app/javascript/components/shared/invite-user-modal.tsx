import * as React from "react";
import * as R from "ramda";
import { useState } from "react";
import { EditUserModal } from "../domains/company/edit-user-modal";
import { RoleNormalUser } from "~/lib/constants";
import { useMst } from "~/setup/root";

interface IInviteUserModal {
  inviteUserModalOpen: boolean;
  setInviteUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InviteUserModal = ({
  inviteUserModalOpen,
  setInviteUserModalOpen,
}: IInviteUserModal): JSX.Element => {
  const {
    sessionStore: {
      staticData: { userRoles },
    },
  } = useMst();

  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userRoleId, setUserRole] = useState(
    R.path(["id"], R.find(R.propEq("name", RoleNormalUser), userRoles)),
  );
  const [title, setTitle] = useState("");
  const [teams, setTeams] = useState<any>({});

  return (
    <EditUserModal
      editUserModalOpen={inviteUserModalOpen}
      setEditUserModalOpen={setInviteUserModalOpen}
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
      deactivated={false}
    />
  );
};
