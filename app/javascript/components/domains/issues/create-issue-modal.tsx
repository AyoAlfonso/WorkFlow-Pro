import * as React from "react";
import { ModalWithHeader } from "../../shared/modal-with-header";
import { useState } from "react";
import { TextInput } from "../../shared/text-input";
import styled from "styled-components";
import { Icon } from "../../shared/icon";
import { Button } from "rebass";
import { baseTheme } from "../../../themes";
import { useMst } from "../../../setup/root";
import * as R from "ramda";
import { Avatar } from "~/components/shared/avatar";

interface ICreateIssueModalProps {
  createIssueModalOpen: boolean;
  setCreateIssueModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateIssueModal = (props: ICreateIssueModalProps): JSX.Element => {
  const { issueStore, sessionStore } = useMst();
  const { createIssueModalOpen, setCreateIssueModalOpen } = props;
  const [issueDescription, setIssueDescription] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<number>(0);

  return (
    <ModalWithHeader
      modalOpen={createIssueModalOpen}
      setModalOpen={setCreateIssueModalOpen}
      headerText="Issue"
      width="35rem"
    >
      <Container>
        <FlexContainer>
          <TextInput
            textValue={issueDescription}
            setTextValue={setIssueDescription}
            width={"75%"}
            style={{
              height: "35px",
              marginTop: "auto",
              marginBottom: "auto",
              paddingTop: "4px",
              paddingBottom: "4px",
            }}
          />
          <Avatar
            avatarUrl={R.path(["profile", "avatarUrl"], sessionStore)}
            firstName={R.path(["profile", "firstName"], sessionStore)}
            lastName={R.path(["profile", "lastName"], sessionStore)}
            size={55}
          />
        </FlexContainer>
        <FlexContainer>
          <StyledButton
            disabled={issueDescription.length == 0}
            onClick={() =>
              issueStore
                .createIssue({
                  description: issueDescription,
                  priority: selectedPriority,
                })
                .then(result => {
                  if (result) {
                    setIssueDescription("");
                    setCreateIssueModalOpen(false);
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

type StyledButtonType = {
  disabled: boolean;
};

const StyledButton = styled(Button)<StyledButtonType>`
  background-color: ${props =>
    props.disabled ? baseTheme.colors.grey60 : baseTheme.colors.primary100};
  width: 130px;
  &: hover {
    cursor: ${props => !props.disabled && "pointer"};
  }
`;
