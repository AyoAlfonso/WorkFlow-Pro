import * as React from "react";
import { useMst } from "~/setup/root";
import { useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Select } from "~/components/shared";
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

    const renderUserSelections = (): Array<JSX.Element> => {
      return users
        .filter(user => user.status == "active")
        .map((user, index) => {
          return (
            <MenuItem value={user.id} key={index}>
              {`${user.firstName} ${user.lastName}`}
            </MenuItem>
          );
        });
    };

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
          <Select
            id="simple-select-outlined-for-users"
            value={selectedUserId}
            margin="dense"
            width={"100%"}
            native={false}
            onChange={e => {
              if (!selectedUserId) {
                setMeetingLead(1);
                updateMemberListState("meetingLead", 1);
              }
              setSelectedUserId(e.target.value);
              updateMemberListState("userId", e.target.value);
            }}
          >
            {renderUserSelections()}
          </Select>
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
`;

const CloseIconContainer = styled.div`
  width: 10%;
  margin: auto;
  text-align: center;
  &: hover {
    cursor: pointer;
  }
`;
