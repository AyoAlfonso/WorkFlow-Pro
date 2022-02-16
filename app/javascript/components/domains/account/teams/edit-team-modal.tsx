import * as React from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { ModifyTeamBody } from "./modify-team-body";

interface IEditTeamModalProps {
  team: any;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditTeamModal = ({
  team,
  modalOpen,
  setModalOpen,
}: IEditTeamModalProps): JSX.Element => {
  return (
    <ModalWithHeader
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      headerText={"Modify Team"}
      width="480px"
      headerFontSize="21px"
    >
      <ModifyTeamBody team={team} setModalOpen={setModalOpen} />
    </ModalWithHeader>
  );
};
