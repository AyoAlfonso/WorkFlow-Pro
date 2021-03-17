import * as React from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { ModifyTeamBody } from "./modify-team-body";

interface ICreateNewTeamModalProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateNewTeamModal = ({
  modalOpen,
  setModalOpen,
}: ICreateNewTeamModalProps): JSX.Element => {
  return (
    <ModalWithHeader
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      headerText={"Create Team"}
      width="480px"
    >
      <ModifyTeamBody setModalOpen={setModalOpen} />
    </ModalWithHeader>
  );
};
