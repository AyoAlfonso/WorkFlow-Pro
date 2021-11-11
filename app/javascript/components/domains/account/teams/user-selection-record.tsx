import * as React from "react";
import { useMst } from "~/setup/root";
import { useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Select } from "~/components/shared";
import { UserSelectionDropdownList } from "./user-selection-dropdown";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { Icon } from "~/components/shared/icon";
import * as R from "ramda";

interface IUserSelectionRecordProps {
  index: number;
  memberListState: any;
  setMemberListState: any;
}

export const UserSelectionRecord = observer(
  ({ index, memberListState, setMemberListState }: IUserSelectionRecordProps): JSX.Element => {
    const {
      userStore: { users },
    } = useMst();
    const [selectedUserId, setSelectedUserId] = useState<any>(
      memberListState[index] ? memberListState[index]["userId"] : "",
    );
    const [meetingLead, setMeetingLead] = useState<any>(
      memberListState[index] ? memberListState[index]["meetingLead"] : "",
    );

    const userList = users.filter(user => user.status == "active");
    let currentUser = userList.find(user => user.id === selectedUserId);

    const updateMemberListState = (field, value) => {
      const updatedMemberListState = memberListState;
      if (!updatedMemberListState[index]) {
        updatedMemberListState[index] = {};
      }
      updatedMemberListState[index][field] = value;
      setMemberListState(updatedMemberListState);
    };

    return (
      <Container>
        <SelectMemberContainer>
          <UserSelectionDropdownList
            userList={userList}
            currentUser={currentUser}
            setSelectedUserId={setSelectedUserId}
            updateMemberListState={updateMemberListState}
            onUserSelect={() => {
              if (!selectedUserId) {
                setMeetingLead(1);
                updateMemberListState("meetingLead", 1);
                updateMemberListState("teamManager", false);
              }
            }}
          />
        </SelectMemberContainer>
        <SelectMeetingLeadContainer>
          <Select
            id="simple-select-outlined-meeting-lead"
            value={meetingLead}
            margin="dense"
            width={"100%"}
            native={false}
            onChange={e => {
              setMeetingLead(e.target.value);
              updateMemberListState("meetingLead", e.target.value);
            }}
          >
            <MenuItem value={1}>Yes</MenuItem>
            <MenuItem value={0}>No</MenuItem>
          </Select>
        </SelectMeetingLeadContainer>
        <CloseIconContainer
          onClick={() => {
            const removedList = R.omit([index], memberListState);
            setMemberListState(removedList);
            currentUser = null;
            setSelectedUserId("");
            setMeetingLead("");
          }}
        >
          <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} />
        </CloseIconContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 8px;
  align-items: center;
`;

const StyledSelect = styled(Select)`
  width: -webkit-fill-available;
`;

const StyledFormControl = styled(FormControl)`
  width: -webkit-fill-available;
  flex-direction: row !important;
`;

const SelectMemberContainer = styled.div`
  width: 70%;
  padding-right: 16px;
`;

const SelectMeetingLeadContainer = styled.div`
  width: 20%;
  padding-right: 16px;
  margin-top: 3px;
`;

const CloseIconContainer = styled.div`
  width: 10%;
  margin: auto;
  text-align: center;
  margin: 3px 0 0 0;
  &: hover {
    cursor: pointer;
  }
`;
