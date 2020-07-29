import * as React from "react";
import { ModalWithHeader } from "../../shared/modal-with-header";
import { useState } from "react";
import { TextInput } from "../../shared/text-input";
import styled from "styled-components";
import { Icon } from "../../shared/icon";
import { Button } from "rebass";
import { baseTheme } from "../../../themes";
import { useMst } from "../../../setup/root";
import { UserDefaultIcon } from "../../shared/user-default-icon";
import * as R from "ramda";

interface ICreateKeyActivityModalProps {
  createKeyActivityModalOpen: boolean;
  setCreateKeyActivityModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateKeyActivityModal = (props: ICreateKeyActivityModalProps): JSX.Element => {
  const { keyActivityStore, sessionStore } = useMst();
  const { createKeyActivityModalOpen, setCreateKeyActivityModalOpen } = props;
  const [KeyActivityDescription, setKeyActivityDescription] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<number>(0);
  const [masterList, setMasterList] = useState<boolean>(false);

  return (
    <ModalWithHeader
      modalOpen={createKeyActivityModalOpen}
      setModalOpen={setCreateKeyActivityModalOpen}
      headerText="Key Activity"
      width="35rem"
    >
      <Container>
        <FlexContainer>
          <TextInput
            textValue={KeyActivityDescription}
            setTextValue={setKeyActivityDescription}
            width={"75%"}
            placeholder={"e.g. Review revenue projections"}
          />
          <UserDefaultIcon
            firstName={R.path(["profile", "firstName"], sessionStore)}
            lastName={R.path(["profile", "lastName"], sessionStore)}
          />
        </FlexContainer>
        <FlexContainer>
          <StyledButton
            onClick={() =>
              keyActivityStore
                .createKeyActivity({
                  description: KeyActivityDescription,
                  priority: selectedPriority,
                })
                .then(result => {
                  if (result) {
                    setKeyActivityDescription("");
                    setCreateKeyActivityModalOpen(false);
                  }
                })
            }
          >
            Save
          </StyledButton>
          <PriorityContainer>
            <MasterListButton active={masterList} onClick={() => setMasterList(!masterList)}>
              Master
            </MasterListButton>
            <IconContainer onClick={() => setSelectedPriority(selectedPriority == 1 ? 0 : 1)}>
              <Icon
                icon={"Priority-High"}
                size={"25px"}
                iconColor={selectedPriority == 1 ? "cautionYellow" : "grey60"}
              />
            </IconContainer>
            <IconContainer onClick={() => setSelectedPriority(selectedPriority == 2 ? 0 : 2)}>
              <Icon
                icon={"Priority-Urgent"}
                size={"25px"}
                iconColor={selectedPriority == 2 ? "warningRed" : "grey60"}
              />
            </IconContainer>
            <IconContainer onClick={() => setSelectedPriority(selectedPriority == 3 ? 0 : 3)}>
              <Icon
                icon={"Priority-Frog"}
                size={"25px"}
                iconColor={selectedPriority == 3 ? "frog" : "grey60"}
              />
            </IconContainer>
          </PriorityContainer>
        </FlexContainer>
      </Container>
    </ModalWithHeader>
  );
};

const Container = styled.div`
  padding: 20px;
  padding-bottom: 0;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

const PriorityContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: auto;
  margin-top: 5px;
`;

const IconContainer = styled.div`
  margin-left: 10px;
`;

const StyledButton = styled(Button)`
  background-color: ${baseTheme.colors.primary100};
  width: 130px;
`;

type MasterListButtonType = {
  active: boolean;
};

const MasterListButton = styled(Button)<MasterListButtonType>`
  margin-top: -4px !important;
  background-color: ${props =>
    props.active ? baseTheme.colors.primary100 : baseTheme.colors.grey60};
  color: white !important;
  border-color: ${baseTheme.colors.primary100} !important;
  &: hover {
    cursor: pointer;
  }
`;
