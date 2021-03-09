import * as React from "react";
import { useMst } from "~/setup/root";
import { useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import Select from "@material-ui/core/Select";
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
      return users.map((user, index) => {
        return (
          <MenuItem value={user.id} key={index}>
            {`${user.firstName} ${user.lastName}`}
          </MenuItem>
        );
      });
    };

    const updateMemberListState = (field, value) => {
      let updatedMemberListState = memberListState;
      if (!updatedMemberListState[index]) {
        updatedMemberListState[index] = {};
      }
      updatedMemberListState[index][field] = value;
      setMemberListState(updatedMemberListState);
    };

    return (
      <Container>
        <SelectMemberContainer>
          <StyledFormControl variant="outlined">
            <StyledSelect
              labelId="simple-select-outlined-label-for-users"
              id="simple-select-outlined-for-users"
              value={selectedUserId}
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
            </StyledSelect>
          </StyledFormControl>
        </SelectMemberContainer>
        <SelectMeetingLeadContainer>
          <StyledFormControl variant="outlined">
            <StyledSelect
              labelId="simple-select-outlined-label-meeting-lead"
              id="simple-select-outlined-meeting-lead"
              value={meetingLead}
              onChange={e => {
                setMeetingLead(e.target.value);
                updateMemberListState("meetingLead", e.target.value);
              }}
            >
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={0}>No</MenuItem>
            </StyledSelect>
          </StyledFormControl>
        </SelectMeetingLeadContainer>
        <CloseIconContainer
          onClick={() => {
            let removedList = R.omit([index], memberListState);
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
  width: -webkit-fill-available;
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
