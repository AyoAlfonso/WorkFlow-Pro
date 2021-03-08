import * as React from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { CreateNewTeamBody } from "./create-new-team-body";

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
      headerText={"New Team"}
      width="480px"
    >
      <CreateNewTeamBody setModalOpen={setModalOpen} />
    </ModalWithHeader>
  );
};
