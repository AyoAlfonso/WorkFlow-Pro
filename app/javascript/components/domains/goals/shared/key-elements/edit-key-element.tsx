import * as React from "react";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import styled from "styled-components";
import { Heading, Icon } from "~/components/shared";
import { KeyElementContentContainer, KeyElementsTabContainer } from "./key-element-containers";
import { EditKeyElementForm } from "../edit-key-element-form";

interface IEditKeyElementBodyProps {
  element: any;
  store: any;
  type: any;
  action: any;
  //   showOptions: any;
  setSelectedElement: any;
  setActionType: any;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // TODO: set correct type
}

export const EditKeyElementBody = observer(
  ({
    store,
    element,
    type,
    action,
    setModalOpen,
    setSelectedElement,
    setActionType,
  }: IEditKeyElementBodyProps): JSX.Element => {
    return (
      <KeyElementsTabContainer>
        <KeyElementContentContainer>
          <EditKeyElementForm
            onClose={() => {
              setModalOpen(false);
            }}
            action={action}
            store={store}
            type={type}
            element={element}
          />
        </KeyElementContentContainer>
      </KeyElementsTabContainer>
    );
  },
);
