import * as React from "react";
import { ModalWithHeader } from "../../shared/modal-with-header";
import { useState, useEffect } from "react";
import { TextInput } from "../../shared/text-input";
import styled from "styled-components";
import { Icon } from "../../shared/icon";
import { Button } from "rebass";
import { baseTheme } from "../../../themes";
import { useMst } from "../../../setup/root";
import * as R from "ramda";
import { Avatar } from "~/components/shared/avatar";
import {
  Container,
  FlexContainer,
  PriorityContainer,
  IconContainer,
} from "~/components/shared/styles/modals";
import { UserSelectionDropdownList } from "~/components/shared";

interface ICreateIssueModalProps {
  createIssueModalOpen: boolean;
  setCreateIssueModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teamId?: number | string;
}

export const CreateIssueModal = (props: ICreateIssueModalProps): JSX.Element => {
  const { issueStore, sessionStore, userStore } = useMst();
  const { createIssueModalOpen, setCreateIssueModalOpen, teamId } = props;
  const [issueDescription, setIssueDescription] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<number>(0);
  const [showUsersList, setShowUsersList] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    setSelectedUser(sessionStore.profile);
  }, []);

  const companyUsers = userStore.users;
  const issues = issueStore.openIssues;

  const renderUserSelectionList = (): JSX.Element => {
    return showUsersList ? (
      <UserSelectionDropdownList userList={companyUsers} onUserSelect={setSelectedUser} />
    ) : (
      <></>
    );
  };

  const newIssuePosition = issues.length > 0 ? issues[issues.length - 1].position + 1 : 0;

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
          {selectedUser && (
            <AvatarContainer onClick={() => setShowUsersList(!showUsersList)}>
              <Avatar
                defaultAvatarColor={selectedUser.defaultAvatarColor}
                avatarUrl={selectedUser.avatarUrl}
                firstName={selectedUser.firstName}
                lastName={selectedUser.lastName}
                size={34}
                marginLeft={"auto"}
              />
              {renderUserSelectionList()}
            </AvatarContainer>
          )}
        </FlexContainer>
        <FlexContainer>
          <StyledButton
            disabled={issueDescription.length == 0}
            onClick={() =>
              issueStore
                .createIssue({
                  description: issueDescription,
                  priority: selectedPriority,
                  teamId: teamId,
                  userId: selectedUser.id,
                  position: newIssuePosition,
                })
                .then(result => {
                  if (result) {
                    setIssueDescription("");
                    setCreateIssueModalOpen(false);
                    setSelectedPriority(0);
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
                icon={"Priority-MIP"}
                size={"25px"}
                iconColor={selectedPriority == 3 ? "mipBlue" : "grey60"}
              />
            </IconContainer>
          </PriorityContainer>
        </FlexContainer>
      </Container>
    </ModalWithHeader>
  );
};

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

const AvatarContainer = styled.div`
  margin-left: auto;
  &: hover {
    cursor: pointer;
  }
`;
