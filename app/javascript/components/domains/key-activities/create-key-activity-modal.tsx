import * as React from "react";
import { ModalWithHeader } from "../../shared/modal-with-header";
import { useState, useEffect } from "react";
import { TextInput } from "../../shared/text-input";
import styled from "styled-components";
import { Icon } from "../../shared/icon";
import { Button } from "rebass";
import { baseTheme } from "../../../themes";
import { useMst } from "../../../setup/root";
import { Avatar } from "~/components/shared/avatar";
import Switch from "react-switch";
import { Text } from "~/components/shared/text";
import { UserSelectionDropdownList } from "~/components/shared/user-selection-dropdown-list";

interface ICreateKeyActivityModalProps {
  createKeyActivityModalOpen: boolean;
  setCreateKeyActivityModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateKeyActivityModal = (props: ICreateKeyActivityModalProps): JSX.Element => {
  const { keyActivityStore, sessionStore, userStore } = useMst();
  const { createKeyActivityModalOpen, setCreateKeyActivityModalOpen } = props;
  const [keyActivityDescription, setKeyActivityDescription] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<number>(0);
  const [weeklyList, setWeeklyList] = useState<boolean>(true);
  const [showUsersList, setShowUsersList] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    setSelectedUser(sessionStore.profile);
  }, []);

  const companyUsers = userStore.users;

  const renderUserSelectionList = (): JSX.Element => {
    return showUsersList ? (
      <UserSelectionDropdownList userList={companyUsers} onUserSelect={setSelectedUser} />
    ) : (
      <></>
    );
  };

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
            textValue={keyActivityDescription}
            setTextValue={setKeyActivityDescription}
            width={"75%"}
            placeholder={"e.g. Review revenue projections"}
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
                avatarUrl={selectedUser.avatarUrl}
                firstName={selectedUser.firstName}
                lastName={selectedUser.lastName}
                size={32}
                marginLeft={"auto"}
              />
              {renderUserSelectionList()}
            </AvatarContainer>
          )}
        </FlexContainer>
        <FlexContainer>
          <StyledButton
            disabled={keyActivityDescription.length == 0}
            onClick={() =>
              keyActivityStore
                .createKeyActivity({
                  description: keyActivityDescription,
                  priority: selectedPriority,
                  weeklyList: weeklyList,
                  userId: selectedUser.id,
                })
                .then(result => {
                  if (result) {
                    setKeyActivityDescription("");
                    setCreateKeyActivityModalOpen(false);
                    setSelectedPriority(0);
                    setWeeklyList(true);
                  }
                })
            }
          >
            Save
          </StyledButton>
          <PriorityContainer>
            <StyledSwitch
              checked={!weeklyList}
              onChange={e => setWeeklyList(!weeklyList)}
              onColor={baseTheme.colors.primary100}
              uncheckedIcon={false}
              checkedIcon={false}
              width={48}
            />
            <MasterListText>Master</MasterListText>
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

const StyledSwitch = styled(Switch)``;

const MasterListText = styled(Text)`
  color: ${props => props.theme.colors.grey60};
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 5px;
  font-size: 14px;
`;

const AvatarContainer = styled.div`
  margin-left: auto;
  &: hover {
    cursor: pointer;
  }
`;
