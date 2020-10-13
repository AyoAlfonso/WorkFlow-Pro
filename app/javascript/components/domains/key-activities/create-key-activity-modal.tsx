import { addDays } from "date-fns";
import * as R from "ramda";
import * as React from "react";
import { useEffect, useState } from "react";
import { Calendar } from "react-date-range";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";
import Popup from "reactjs-popup";
import { Button as RebassButton } from "rebass";
import styled from "styled-components";
import { Avatar } from "~/components/shared/avatar";
import { Button } from "~/components/shared/button";
import {
  Container,
  FlexContainer,
  IconContainer,
  PriorityContainer,
} from "~/components/shared/styles/modals";
import { Text } from "~/components/shared/text";
import { UserSelectionDropdownList } from "~/components/shared/user-selection-dropdown-list";
import { useMst } from "../../../setup/root";
import { baseTheme } from "../../../themes";
import { Icon } from "../../shared/icon";
import { ModalWithHeader } from "../../shared/modal-with-header";
import { TextInput } from "../../shared/text-input";

interface ICreateKeyActivityModalProps {
  createKeyActivityModalOpen: boolean;
  setCreateKeyActivityModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  meetingId?: string | number;
  defaultTypeAsWeekly: boolean;
}

export const CreateKeyActivityModal = (props: ICreateKeyActivityModalProps): JSX.Element => {
  const { keyActivityStore, sessionStore, userStore } = useMst();
  const { t } = useTranslation();
  const {
    createKeyActivityModalOpen,
    setCreateKeyActivityModalOpen,
    meetingId,
    defaultTypeAsWeekly,
  } = props;
  const [keyActivityDescription, setKeyActivityDescription] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<number>(0);
  const [weeklyList, setWeeklyList] = useState<boolean>(defaultTypeAsWeekly);
  const [showUsersList, setShowUsersList] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDueDate, setSelectedDueDate] = useState<any>(null);

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

  const renderDueDateSelector = () => (
    <DueDateSelectionContainer>
      <Popup
        arrow={false}
        closeOnDocumentClick
        contentStyle={{
          border: "none",
          borderRadius: "6px",
          padding: 0,
          width: "auto",
        }}
        on="click"
        onClose={() => {}}
        onOpen={() => {}}
        open={showDatePicker}
        position="bottom right"
        trigger={
          <DueDateButtonContainer
            onClick={() => {
              setShowDatePicker(!showDatePicker);
            }}
            dateSelected={!R.isNil(selectedDueDate)}
          >
            <Icon icon={"Deadline-Calendar"} iconColor={"inherit"} size={"16px"} mr={"8px"} />
            {t("datePicker.dueDate")}
          </DueDateButtonContainer>
        }
      >
        <>
          <Calendar
            showDateDisplay={false}
            showMonthAndYearPickers={false}
            showSelectionPreview={true}
            direction={"vertical"}
            minDate={new Date()}
            maxDate={addDays(new Date(), 30)}
            scroll={{
              enabled: true,
              calendarWidth: 320,
              monthWidth: 320,
            }}
            rangeColors={[baseTheme.colors.primary80]}
            date={selectedDueDate}
            onChange={date => {
              setSelectedDueDate(date);
            }}
          />
          <Button
            variant={"primary"}
            small
            onClick={() => setSelectedDueDate(null)}
            mx={"auto"}
            my={"8px"}
          >
            {t("datePicker.clearDate")}
          </Button>
        </>
      </Popup>
    </DueDateSelectionContainer>
  );

  return (
    <ModalWithHeader
      modalOpen={createKeyActivityModalOpen}
      setModalOpen={setCreateKeyActivityModalOpen}
      headerText="Pyn"
      width="35rem"
    >
      <Container>
        <FlexContainer>
          <TextInput
            textValue={keyActivityDescription}
            setTextValue={setKeyActivityDescription}
            width={"75%"}
            placeholder={"e.g. Prep for team meeting"}
            style={{
              height: "35px",
              marginTop: "auto",
              marginBottom: "auto",
              paddingTop: "4px",
              paddingBottom: "4px",
            }}
          />
          <CircleButtonsContainer>
            {renderDueDateSelector()}
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
          </CircleButtonsContainer>
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
                  meetingId: meetingId,
                  dueDate: selectedDueDate,
                })
                .then(result => {
                  if (result) {
                    setKeyActivityDescription("");
                    setCreateKeyActivityModalOpen(false);
                    setSelectedPriority(0);
                    setWeeklyList(defaultTypeAsWeekly);
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
              height={25}
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

const StyledButton = styled(RebassButton)<StyledButtonType>`
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
  margin-top: 5px;
  margin-left: 5px;
  margin-bottom: auto;
  font-size: 14px;
`;

const AvatarContainer = styled.div`
  margin-left: 15px;
  &: hover {
    cursor: pointer;
  }
`;

const DueDateSelectionContainer = styled.div`
  border-radius: 6px;
`;
interface IDueDateButtonProps {
  onClick?: () => void;
  dateSelected?: boolean;
}

const DueDateButtonContainer = styled.div<IDueDateButtonProps>`
  color: ${props =>
    props.dateSelected ? props.theme.colors.primary100 : props.theme.colors.grey60};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${props =>
      props.dateSelected ? props.theme.colors.primaryActive : props.theme.colors.greyActive};
    cursor: pointer;
  }
`;

const CircleButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;
