import * as React from "react";
import { useEffect, useState } from "react";
import { Button as RebassButton } from "rebass";
import styled from "styled-components";
import { Avatar } from "~/components/shared/avatar";
import {
  Container,
  FlexContainer,
  IssuePynModalContainer,
} from "~/components/shared/styles/modals";
import { UserSelectionDropdownList } from "~/components/shared";
import { LabelSelection } from "~/components/shared";
import { useMst } from "../../../setup/root";
import { baseTheme } from "../../../themes";
import { Icon } from "../../shared/icon";
import { ModalWithHeader } from "../../shared/modal-with-header";
import { TextInput } from "../../shared/text-input";
import { PrioritySelector } from "~/components/shared/issues-and-key-activities/priority-selector";
import { DueDateSelector } from "~/components/shared/issues-and-key-activities/due-date-selector";
import { ScheduledGroupSelector } from "~/components/shared/issues-and-key-activities/scheduled-group-selector";

interface ICreateKeyActivityModalProps {
  createKeyActivityModalOpen: boolean;
  setCreateKeyActivityModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  meetingId?: string | number;
  todayModalClicked?: boolean;
  defaultSelectedGroupId?: number;
  defaultSelectedTeamId?: number;
  todayFilterGroupId?: number;
  onboardingCompanyId?: number;
}

export const CreateKeyActivityModal = (props: ICreateKeyActivityModalProps): JSX.Element => {
  const { keyActivityStore, sessionStore, userStore } = useMst();
  const { createKeyActivityModalOpen, setCreateKeyActivityModalOpen, meetingId } = props;
  const [keyActivityDescription, setKeyActivityDescription] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<number>(0);
  const [showUsersList, setShowUsersList] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedDueDate, setSelectedDueDate] = useState<Date>(null);
  const [showLabelsList, setShowLabelsList] = useState<boolean>(false);
  const [personal, setPersonal] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<any>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number>(null);

  const initializeGroupAndTeam = () => {
    if (props.todayModalClicked) {
      setSelectedGroupId(props.todayFilterGroupId);
    } else {
      if (props.defaultSelectedGroupId && !props.defaultSelectedTeamId) {
        setSelectedGroupId(props.defaultSelectedGroupId);
        setSelectedTeamId(null);
      }

      if (!props.defaultSelectedGroupId && props.defaultSelectedTeamId) {
        setSelectedTeamId(props.defaultSelectedTeamId);
        setSelectedGroupId(null);
      }
    }
  };

  useEffect(() => {
    setSelectedUser(sessionStore.profile);
    initializeGroupAndTeam();
  }, [props.todayModalClicked, props.defaultSelectedGroupId, props.defaultSelectedTeamId]);

  const companyUsers = userStore.users;

  const resetFields = () => {
    setKeyActivityDescription("");
    setSelectedPriority(0);
    setShowUsersList(false);
    setSelectedUser(sessionStore.profile);
    setSelectedDueDate(null);
    setShowLabelsList(false);
    setPersonal(false);
    setSelectedLabel(null);
    initializeGroupAndTeam();
  };

  const renderUserSelectionList = (): JSX.Element => {
    return showUsersList ? (
      <div onClick={e => e.stopPropagation()}>
        <UserSelectionDropdownList
          userList={companyUsers}
          onUserSelect={setSelectedUser}
          setShowUsersList={setShowUsersList}
        />
      </div>
    ) : (
      <></>
    );
  };

  return (
    <ModalWithHeader
      modalOpen={createKeyActivityModalOpen}
      setModalOpen={setCreateKeyActivityModalOpen}
      headerText="Todo"
      width="640px"
      onCloseAction={resetFields}
    >
      <Container>
        <TextInputFlexContainer>
          <TextInput
            textValue={keyActivityDescription}
            setTextValue={setKeyActivityDescription}
            width={"100%"}
            placeholder={"e.g. Prep for team meeting"}
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
          <DueDateSelector
            selectedDueDate={selectedDueDate}
            setSelectedDueDate={setSelectedDueDate}
          />

          <OptionsContainer>
            <IssuePynModalContainer>
              <LockContainer onClick={() => setPersonal(!personal)}>
                <Icon icon={"Lock"} size={"18px"} iconColor={personal ? "mipBlue" : "grey60"} />
              </LockContainer>
              <LabelSelection
                selectedLabel={selectedLabel}
                setSelectedLabel={setSelectedLabel}
                onLabelClick={setShowLabelsList}
                showLabelsList={showLabelsList}
                marginLeft={"5px"}
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
            disabled={keyActivityDescription.length == 0}
            onClick={() =>
              keyActivityStore
                .createKeyActivity({
                  description: keyActivityDescription,
                  priority: selectedPriority,
                  userId: selectedUser.id,
                  meetingId: meetingId,
                  dueDate: selectedDueDate,
                  label: selectedLabel,
                  personal: personal,
                  scheduledGroupId: selectedGroupId,
                  teamId: selectedTeamId,
                  onboardingCompanyId: props.onboardingCompanyId,
                })
                .then(result => {
                  if (result) {
                    setKeyActivityDescription("");
                    setSelectedDueDate(null);
                    setCreateKeyActivityModalOpen(false);
                    setSelectedPriority(0);
                    setSelectedLabel(null);
                    setPersonal(false);
                  }
                })
            }
          >
            Add Todo
          </StyledButton>
        </FlexContainer>
      </Container>
    </ModalWithHeader>
  );
};

type StyledButtonType = {
  disabled: boolean;
};

const StyledButton = styled(RebassButton)<StyledButtonType>`
  background-color: ${props =>
    props.disabled ? baseTheme.colors.grey60 : baseTheme.colors.primary100};
  width: 130px;
  height: 35px;
  &: hover {
    cursor: ${props => !props.disabled && "pointer"};
  }
`;

const AvatarContainer = styled.div`
  margin-left: 15px;
  &: hover {
    cursor: pointer;
  }
`;

const TextInputFlexContainer = styled(FlexContainer)`
  margin-bottom: 10px;
`;

const LockContainer = styled.div`
  &: hover {
    cursor: pointer;
  }
`;

const OptionsContainer = styled.div`
  margin-left: auto;
  display: flex;
`;
