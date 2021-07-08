import * as React from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { CreateKeyElementBody } from "./key-elements/create-key-element-body";

interface ICreateKeyElementModalProps {
  renderKeyElementsIndex: any;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  store: any; //TO DO: Use correct types
}

///we are rendering both the empty and full containers with one body and modal, if we separate t
// hem it gets more complex
export const CreateKeyElementModal = ({
  modalOpen,
  setModalOpen,
  renderKeyElementsIndex,
  store,
}: ICreateKeyElementModalProps): JSX.Element => {
  return (
    <ModalWithHeader
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      headerText={"Modify Team"}
      width="480px"
    >
      <CreateKeyElementBody
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        renderKeyElementsIndex={renderKeyElementsIndex}
      />
    </ModalWithHeader>
  );
};
