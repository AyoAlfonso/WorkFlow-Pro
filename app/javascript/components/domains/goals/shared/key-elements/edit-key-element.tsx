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
  setModalOpen: any;
  setActionType: any;
  setSelectedElement: any;
  // TODO: set correct type
}

export const EditKeyElementBody = observer(
  ({
    store,
    element,
    type,
    action,
    setModalOpen,
    setActionType,
    setSelectedElement,
  }: IEditKeyElementBodyProps): JSX.Element => {
    return (
      <KeyElementsTabContainer>
        <KeyElementContentContainer>
          <EditKeyElementForm
            onClose={() => setModalOpen(false)}
            action={action}
            store={store}
            type={type}
            element={element}
          />

          {/* <KeyElement
            elementId={element.id}
            store={store}
            editable={true}
            key={element.id}
            lastKeyElement={false}
            focusOnLastInput={false}
            type={type}
            hideDropdownOptions={true}
            // action={action}
            setShowKeyElementForm={setShowKeyElementForm}
            setActionType={setActionType}
            setSelectedElement={setSelectedElement}
           */}
        </KeyElementContentContainer>
      </KeyElementsTabContainer>
    );
  },
);
