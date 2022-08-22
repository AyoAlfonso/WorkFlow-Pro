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
import ReactQuill from "react-quill";
import { DndItems } from "~/components/shared/dnd-editor";
import { ScheduledGroupSelector } from "~/components/shared/issues-and-key-activities/scheduled-group-selector";
import { DateButton } from "~/components/shared/date-selection/date-button";
import moment from "moment";
import { DueDatePickerModal } from "~/components/shared/issues-and-key-activities/date-picker-modal";

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
  const [description, setDescription] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

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

  const handleChange = html => {
    setDescription(html);
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
      headerText="Add ToDo"
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
              fontSize: "14px",
            }}
          />
        </TextInputFlexContainer>
        <TrixEditorContainer>
          <ReactQuill
            className="trix-objective-modal"
            theme="snow"
            modules={{
              toolbar: DndItems,
            }}
            placeholder={"Description"}
            value={description}
            onChange={(content, delta, source, editor) => {
              handleChange(editor.getHTML());
            }}
          />
        </TrixEditorContainer>
        <SelectorsContainer>
          <PrioritySelector
            itemPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
          />
          <DateButtonDiv>
            <DateButton
              onClick={() => {
                setShowDatePicker(true);
              }}
              text={selectedDueDate ? moment(selectedDueDate).format("MMM Do, YYYY") : "Due Date"}
              displayColor={baseTheme.colors.greyActive}
            />
          </DateButtonDiv>

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
        </SelectorsContainer>

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
                  body: description,
                })
                .then(result => {
                  if (result) {
                    setKeyActivityDescription("");
                    setSelectedDueDate(null);
                    setCreateKeyActivityModalOpen(false);
                    setSelectedPriority(0);
                    setSelectedLabel(null);
                    setPersonal(false);
                    setDescription("");
                    setSelectedUser(sessionStore.profile);
                  }
                })
            }
          >
            Add ToDo
          </StyledButton>
        </FlexContainer>
      </Container>
      <DueDatePickerModal
        selectedDueDate={selectedDueDate}
        setSelectedDueDate={setSelectedDueDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />
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

const SelectorsContainer = styled(FlexContainer)`
  align-items: center;
`

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

const TrixEditorContainer = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

const DateButtonDiv = styled.div`
  border: 1px solid ${baseTheme.colors.borderGrey};
  display: flex;
  align-items: center;
  border-radius: 3px;
  height: 0.5em;
  padding: 8px;
`;
