import * as React from "react";
import { ModalWithHeader } from "../../shared/modal-with-header";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { UserSelectionDropdownList, Loading, LabelSelection, Icon } from "~/components/shared";
import { PrioritySelector } from "~/components/shared/issues-and-key-activities/priority-selector";

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
  const { t } = useTranslation();

  const [issueDescription, setIssueDescription] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<number>(0);
  const [showUsersList, setShowUsersList] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showLabelsList, setShowLabelsList] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<any>(null);
  const [personal, setPersonal] = useState<boolean>(teamId ? false : true);
  const [description, setDescription] = useState<string>("");
  const [selectedDueDate, setSelectedDueDate] = useState<Date>(null);
  const [topicType, setTopicType] = useState<string>("");
  const [showOptions, setShowOptions] = useState<boolean>(false);

  useEffect(() => {
    setSelectedUser(sessionStore.profile);
  }, []);

  if (!companyStore.company) {
    return <></>;
  }

  const companyUsers = userStore.users;
  const issues = issueStore.openIssues;
  const isForum = companyStore.company.displayFormat == "Forum";
  const itemName =
    companyStore.company.displayFormat == "Forum"
      ? t("meetingForum.parkingLotIssues.forumItems")
      : t("issues.title");

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

  const newIssuePosition = issues.length > 0 ? issues[issues.length - 1].position + 1 : 0;

  const topicTypesArray = ["Exploration", "Brainstorm", "Round Table", "Learning"];

  return (
    <ModalWithHeader
      modalOpen={createIssueModalOpen}
      setModalOpen={setCreateIssueModalOpen}
      headerText={`Add ${itemName}`}
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
        {isForum && (
          <DropdownContainer>
            <DropdownHeader onClick={() => setShowOptions(!showOptions)}>
              {topicType || <DropdownHeaderText>Select topic type*</DropdownHeaderText>}
              <IconContainer>
                <Icon icon={"Chevron-Down"} size="12px" iconColor="greyInactive" />
              </IconContainer>
            </DropdownHeader>
            {showOptions && (
              <DropdownMenuContainer>
                {topicTypesArray.map((topicType, index) => (
                  <DropdownMenuItem
                    key={`topic-${index}`}
                    onClick={() => {
                      setTopicType(topicType);
                      setShowOptions(false);
                    }}
                  >
                    {topicType}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContainer>
            )}
          </DropdownContainer>
        )}
        <TrixEditorContainer>
          <ReactQuill
            className="trix-objective-modal"
            theme="snow"
            placeholder={"Description"}
            value={description}
            onChange={(content, delta, source, editor) => {
              handleChange(editor.getHTML());
            }}
          />
        </TrixEditorContainer>
        <FlexContainer>
          <PrioritySelector
            itemPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
          />
          {isForum && (
            <DueDateSelector
              selectedDueDate={selectedDueDate}
              setSelectedDueDate={setSelectedDueDate}
            />
          )}

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
                  userId: selectedUser.id,
                  position: newIssuePosition,
                  meetingId: meetingId,
                  meetingEnabled: meetingEnabled,
                  label: selectedLabel,
                  personal: personal,
                  teamId: teamId,
                  body: description,
                  dueDate: selectedDueDate,
                  topicType: topicType
                })
                .then(result => {
                  if (result) {
                    setIssueDescription("");
                    setCreateIssueModalOpen(false);
                    setSelectedPriority(0);
                    setSelectedLabel(null);
                    setPersonal(false);
                    setDescription("");
                  }
                })
            }
          >
            {`Add ${itemName}`}
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

const LockContainer = styled.div`
  &: hover {
    cursor: pointer;
  }
`;

const TrixEditorContainer = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${baseTheme.colors.greyInactive};
  color: ${baseTheme.colors.black};
  border-radius: 6px;
  padding: 0 0.5em;
  font-size: 14px;
  height: 33px;
`;

const IconContainer = styled.div`
  border-left: 1px solid ${baseTheme.colors.greyInactive};
  margin-left: auto;
  padding-left: 0.5em;
  display: flex;
  align-items: center;
`;

const DropdownMenuContainer = styled.div`
  position: absolute;
  width: 100%;
  background: ${baseTheme.colors.white};
  border-radius: 4px;
  z-index: 5;
  box-shadow: 0px 3px 6px #00000029;
  margin-top: 10px;
`;

const DropdownMenuItem = styled.span`
  display: block;
  color: ${baseTheme.colors.black};
  font-size: 14px;
  padding: 0.5em;

  &: hover {
    color: ${baseTheme.colors.white};
    background: ${baseTheme.colors.primary100};
  }
`;

const DropdownHeaderText = styled.span`
  font-size: 14px;
  color: ${baseTheme.colors.grey100};
`;
