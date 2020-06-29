import * as React from "react";
import { ModalWithHeader } from "../../shared/ModalWithHeader";
import { useState } from "react";
import { TextInput } from "../../shared/TextInput";
import styled from "styled-components";
import { Icon } from "../../shared/Icon";
import { Button } from "rebass";
import { baseTheme } from "../../../themes";
import { useMst } from "../../../setup/root";

interface ICreateKeyActivityModalProps {
  createKeyActivityModalOpen: boolean;
  setCreateKeyActivityModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateKeyActivityModal = (props: ICreateKeyActivityModalProps): JSX.Element => {
  const { keyActivityStore } = useMst();
  const { createKeyActivityModalOpen, setCreateKeyActivityModalOpen } = props;
  const [KeyActivityDescription, setKeyActivityDescription] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<number>(0);

  return (
    <ModalWithHeader
      modalOpen={createKeyActivityModalOpen}
      setModalOpen={setCreateKeyActivityModalOpen}
      headerText="Key Activity"
    >
      <Container>
        <FlexContainer>
          <TextInput
            textValue={KeyActivityDescription}
            setTextValue={setKeyActivityDescription}
            width={"85%"}
            placeholder={"e.g. Review revenue projections"}
          />
          <UserImageContainer>
            <Icon
              icon={"User"}
              size={"35px"}
              iconColor={"grey60"}
              style={{ marginLeft: "9px", marginTop: "9px" }}
            />
          </UserImageContainer>
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
                iconColor={selectedPriority == 3 ? "finePine" : "grey60"}
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

const UserImageContainer = styled.div`
  background-color: ${baseTheme.colors.grey20};
  margin-left: 30px;
  border-radius: 50px;
  height: 55px;
  width: 55px;
`;
