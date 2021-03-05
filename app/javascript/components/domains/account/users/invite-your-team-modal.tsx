import * as React from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { useTranslation } from "react-i18next";
import { InviteYourTeamBody } from "./invite-your-team-body";

interface IInviteYourTeamModalProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InviteYourTeamModal = ({
  modalOpen,
  setModalOpen,
}: IInviteYourTeamModalProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <ModalWithHeader
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      headerText={t("company.createUser.inviteYourTeam")}
      subHeaderText={"Each member will get a link to set up their account"}
      width="480px"
    >
      <InviteYourTeamBody />
    </ModalWithHeader>
  );
};
