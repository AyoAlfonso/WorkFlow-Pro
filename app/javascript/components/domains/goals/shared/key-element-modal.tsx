import * as React from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { CreateKeyElementBody } from "./key-elements/create-key-element";
import { EditKeyElementBody } from "./key-elements/edit-key-element";
interface ICreateKeyElementModalProps {
  modalOpen: boolean;
  element: any;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  store: any; //TO DO: Use correct types;
  action: any;
  type: any;
  setSelectedElement: any;
  setActionType: any;
}

///we are rendering both the empty and full containers with one body and modal, if we separate t
// hem it gets more complex
export const KeyElementModal = ({
  modalOpen,
  setModalOpen,
  element,
  store,
  action,
  type,
  setSelectedElement,
  setActionType,
}: ICreateKeyElementModalProps): JSX.Element => {
  return (
    <ModalWithHeader
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      headerText={action + " Key Result"}
      width={"640px"}
      height="fit-content"
      borderRadius="8px"
      headerFontSize="16px"
      onClose={() => {
        setActionType("Add");
        setSelectedElement(null);
        setModalOpen(false);
      }}
    >
      {action == "Add" ? (
        <CreateKeyElementBody
          setModalOpen={setModalOpen}
          store={store}
          setActionType={setActionType}
          setSelectedElement={setSelectedElement}
        />
      ) : (
        <EditKeyElementBody
          store={store}
          element={element}
          type={type}
          action={action}
          setModalOpen={setModalOpen}
          setActionType={setActionType}
          setSelectedElement={setSelectedElement}
        />
      )}
    </ModalWithHeader>
  );
};
