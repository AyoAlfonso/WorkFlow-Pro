import * as React from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { useTranslation } from "react-i18next";
import { InviteYourTeamBody } from "./invite-your-team-body";
import { useState } from "react";
import { UserLimitReached } from "./user-limit-reached";
interface IInviteYourTeamModalProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InviteYourTeamModal = ({
  modalOpen,
  setModalOpen,
}: IInviteYourTeamModalProps): JSX.Element => {
  const [showUserLimitModal, setShowUserLimitModal] = useState<boolean>(false);

  const { t } = useTranslation();

  return (
    <>
      <ModalWithHeader
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        headerText={t("company.createUser.inviteYourTeam")}
        subHeaderText={"Each member will get a link to set up their account"}
        width="480px"
        headerFontSize="21px"
      >
        <InviteYourTeamBody
          setModalOpen={setModalOpen}
          setShowUserLimitModal={setShowUserLimitModal}
        />
      </ModalWithHeader>
      <ModalWithHeader
        modalOpen={showUserLimitModal}
        setModalOpen={setShowUserLimitModal}
        width="480px"
      >
        <UserLimitReached setModalOpen={setShowUserLimitModal} />
      </ModalWithHeader>
    </>
  );
};
