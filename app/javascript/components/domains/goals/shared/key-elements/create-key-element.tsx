import * as React from "react";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { observer } from "mobx-react";
import { KeyElementForm } from "../key-element-form";
import { Heading, Icon, TextDiv } from "~/components/shared";
import {
  KeyElementContentContainer,
  KeyElementsTabContainer,
  KeyElementsFormHeader,
  KeyElementFormBackButtonContainer,
} from "./key-element-containers";
// TODO: type this component

interface ICreateKeyElementBodyProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  store?: any;
  setSelectedElement: any;
  setActionType: any;
  type?: any;
  keysForOnboarding?: any;
  callbackForOnboarding?: any;
  showAddButton?: any;
  item?: any;
}

export const CreateKeyElementBody = observer(
  ({
    store,
    setModalOpen,
    setSelectedElement,
    setActionType,
    type,
    keysForOnboarding,
    callbackForOnboarding,
    showAddButton,
    item,
  }: ICreateKeyElementBodyProps): JSX.Element => {
    return (
      <KeyElementsTabContainer>
        <KeyElementContentContainer>
          <KeyElementForm
            onCreate={store ? store.createKeyElement : null}
            onClose={() => setModalOpen(false)}
            setSelectedElement={setSelectedElement}
            keysForOnboarding={keysForOnboarding}
            callbackForOnboarding={callbackForOnboarding}
            showAddButton={showAddButton}
            type={type}
            setActionType={setActionType}
            item={item}
            store={store}
          />
        </KeyElementContentContainer>
      </KeyElementsTabContainer>
    );
  },
);

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.grey40};
  &: hover {
    color: ${props => props.theme.colors.greyActive};
  }
`;
