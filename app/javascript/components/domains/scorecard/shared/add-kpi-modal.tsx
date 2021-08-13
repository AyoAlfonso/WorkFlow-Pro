import * as React from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { ModifyTeamBody } from "./modify-team-body";

interface IAddKPIModalProps {
  kpis: any;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerText: string;
}

export const AddKPIModal = observer(
  ({ kpis, modalOpen, setModalOpen, headerText }: IEditTeamModalProps): JSX.Element => {
    return (
      <ModalWithHeader
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        headerText={headerText}
        width="480px"
      >
        {/* /
        /lynchpyncore/app/javascript/components/domains/account/teams/modify-team-body.tsx
     */}
        <ModifyTeamBody kpis={kpis} setModalOpen={setModalOpen} />
      </ModalWithHeader>
    );
  },
);
