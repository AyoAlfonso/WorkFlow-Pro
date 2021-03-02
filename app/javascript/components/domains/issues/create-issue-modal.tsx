import * as React from "react";
import { ModalWithHeader } from "../../shared/modal-with-header";
import { useState, useEffect } from "react";
import { TextInput } from "../../shared/text-input";
import styled from "styled-components";
import { Button } from "rebass";
import { baseTheme } from "../../../themes";
import { useMst } from "../../../setup/root";
import { Avatar } from "~/components/shared/avatar";
import {
  Container,
  FlexContainer,
  IssuePynModalContainer,
} from "~/components/shared/styles/modals";
import { UserSelectionDropdownList, Loading, LabelSelection } from "~/components/shared";
import { PrioritySelector } from "~/components/shared/issues-and-key-activities/priority-selector";
import { ScheduledGroupSelector } from "~/components/shared/issues-and-key-activities/scheduled-group-selector";

interface ICreateIssueModalProps {
  createIssueModalOpen: boolean;
  setCreateIssueModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teamId?: number | string;
  meetingId?: number;
  meetingEnabled?: boolean;
}

export const CreateIssueModal = ({
  createIssueModalOpen,
  setCreateIssueModalOpen,
  teamId,
  meetingId,
  meetingEnabled = false,
}: ICreateIssueModalProps): JSX.Element => {
  const { issueStore, sessionStore, userStore, companyStore, labelStore } = useMst();
  const [issueDescription, setIssueDescription] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<number>(0);
  const [showUsersList, setShowUsersList] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showLabelsList, setShowLabelsList] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<any>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number>(null);

  useEffect(() => {
    setSelectedUser(sessionStore.profile);
  }, []);

  if (!companyStore.company) {
    return <Loading />;
  }

  const companyUsers = userStore.users;
  const issues = issueStore.openIssues;
  const itemName = companyStore.company.displayFormat == "Forum" ? "Parking Lot Item" : "Issue";
  const selectedLabelObj = labelStore.selectedLabelObj;

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
      headerText={itemName}
      width="640px"
    >
      <Container>
        <TextInputFlexContainer>
          <TextInput
            textValue={issueDescription}
            setTextValue={setIssueDescription}
            width={"100%"}
            style={{
              height: "35px",
              marginTop: "auto",
              marginBottom: "auto",
              paddingTop: "4px",
              paddingBottom: "4px",
            }}
          />
        </TextInputFlexContainer>
        <FlexContainer>
          <PrioritySelector
            itemPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
          />

          <OptionsContainer>
            <IssuePynModalContainer>
              <LabelSelection
                selectedLabel={selectedLabel}
                setSelectedLabel={setSelectedLabel}
                onLabelClick={setShowLabelsList}
                showLabelsList={showLabelsList}
              />
              <ScheduledGroupSelector
                selectedGroupId={selectedGroupId}
                setSelectedGroupId={setSelectedGroupId}
                selectedTeamId={selectedTeamId}
                setSelectedTeamId={setSelectedTeamId}
              />
            </IssuePynModalContainer>
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
          </OptionsContainer>
        </FlexContainer>
        <FlexContainer>
          <StyledButton
            disabled={issueDescription.length == 0}
            onClick={() =>
              issueStore
                .createIssue({
                  description: issueDescription,
                  priority: selectedPriority,
                  teamId: selectedTeamId || teamId,
                  userId: selectedUser.id,
                  position: newIssuePosition,
                  meetingId: meetingId,
                  meetingEnabled: meetingEnabled,
                  label: selectedLabelObj,
                })
                .then(result => {
                  if (result) {
                    setIssueDescription("");
                    setCreateIssueModalOpen(false);
                    setSelectedPriority(0);
                    setSelectedLabel(null);
                  }
                })
            }
          >
            Save
          </StyledButton>
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
  height: 35px;
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

const TextInputFlexContainer = styled(FlexContainer)`
  margin-bottom: 10px;
`;

const OptionsContainer = styled.div`
  margin-left: auto;
  display: flex;
`;
