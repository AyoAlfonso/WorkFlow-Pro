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
  store: any;
}

export const CreateKeyElementBody = observer(
  ({ store, setModalOpen }: ICreateKeyElementBodyProps): JSX.Element => {
    return (
      <KeyElementsTabContainer>
        <KeyElementsFormHeader>
          <KeyElementFormBackButtonContainer
            onClick={() => {
              setModalOpen(false);
            }}
          >
            <StyledIcon
              icon={"Close"}
              size={"12px"}
              style={{ marginLeft: "8px", marginTop: "8px" }}
            />
          </KeyElementFormBackButtonContainer>
        </KeyElementsFormHeader>
        <KeyElementContentContainer>
          <KeyElementForm onCreate={store.createKeyElement} onClose={() => setModalOpen(false)} />
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