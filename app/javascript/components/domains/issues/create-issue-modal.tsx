import * as React from "react";
import { ModalWithHeader } from "../../shared/ModalWithHeader";

interface ICreateIssueModalProps {
  createIssueModalOpen: boolean;
  setCreateIssueModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateIssueModal = (props: ICreateIssueModalProps): JSX.Element => {
  const { createIssueModalOpen, setCreateIssueModalOpen } = props;

  return (
    <ModalWithHeader
      modalOpen={createIssueModalOpen}
      setModalOpen={setCreateIssueModalOpen}
      headerText="Issue"
    />
  );
};
