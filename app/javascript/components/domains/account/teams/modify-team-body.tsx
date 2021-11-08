import * as React from "react";
import { useMst } from "~/setup/root";
import { useState } from "react";
import styled from "styled-components";
import { Heading, Icon, Select } from "~/components/shared";
import { observer } from "mobx-react";
import TextField from "@material-ui/core/TextField";
import { Button } from "~/components/shared/button";
import { UserSelectionRecord } from "./user-selection-record";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import MenuItem from "@material-ui/core/MenuItem";
import { toJS } from "mobx";

interface IModifyTeamBodyProps {
  team?: any;
  setModalOpen: any;
}

export const ModifyTeamBody = observer(
  ({ team, setModalOpen }: IModifyTeamBodyProps): JSX.Element => {
    const { teamStore, userStore } = useMst();

    const formatMemberListState = teamUserEnablements => {
      const membersListItem = {};

      teamUserEnablements.forEach((tue, index) => {
        membersListItem[index] = {
          userId: tue.userId,
          meetingLead: tue.role == "team_lead" || tue.role == "team_manager" ? 1 : 0,
          teamManager: tue.teamManager ? true : false
        };
      });
      return membersListItem;
    };

    const [teamName, setTeamName] = useState<string>(team ? team.name : "");
    const [numberOfUserRecords, setNumberOfUserRecords] = useState<number>(
      team ? team.users.length : 5,
    );
    const [memberListState, setMemberListState] = useState<any>(
      team ? formatMemberListState(team.teamUserEnablements) : {},
    );
    const [teamManagerId, setTeamManagerId] = useState<number>(
      team?.teamManager[0] ? team.teamManager[0]["userId"] : null,
    );

    const renderMembersList = () => {
      return [...Array(numberOfUserRecords)].map((e, index) => {
        return (
          <MembersRecordContainer key={index}>
            <UserSelectionRecord
              index={index}
              memberListState={memberListState}
              setMemberListState={setMemberListState}
            />
          </MembersRecordContainer>
        );
      });
    };

    const updateTeam = () => {
      if (team) {
        teamStore.updateTeam(team.id, teamName, memberListState).then(() => {
          setModalOpen(false);
          userStore.load();
        });
      } else {
        teamStore.createTeamAndInviteUsers(teamName, memberListState).then(() => {
          showToast("Team created", ToastMessageConstants.SUCCESS);
          showToast("Invites sent", ToastMessageConstants.SUCCESS);
          setModalOpen(false);
          teamStore.load();
        });
      }
    };

    const headerText = (text: string): JSX.Element => {
      return (
        <StyledHeading type={"h4"} color={"black"} fontSize={"12px"}>
          {text}
        </StyledHeading>
      );
    };

    const updateMemeberListState = id => {
      const updatedMemberListState = memberListState;
      const index = Object.keys(updatedMemberListState).length;
      for (let i = 0; i < index; i++) {
        if (updatedMemberListState[i]["userId"] === id) {
          updatedMemberListState[i]["teamManager"] = true;
        }
      }
      setMemberListState(updatedMemberListState);
    };

    const renderUserSelections = (): Array<JSX.Element> => {
      return team?.users
        .filter(user => user.status == "active")
        .map((user) => {
          return (
            <MenuItem value={user.id} key={user.id}>
              {`${user.firstName} ${user.lastName}`}
            </MenuItem>
          );
        });
    };

    const teamManager = (): JSX.Element => {
      return (
        <>
          <SelectMemberContainer>{headerText("Team Manager")}</SelectMemberContainer>
          <SelectMemberDropdownContainer>
            <Select
              onChange={e => {
                setTeamManagerId(e.target.value);
                updateMemeberListState(e.target.value);
                userStore.updateUserTeamManagerStatus(e.target.value, team.id, true);
              }}
              style={{ marginRight: "25px" }}
              margin="dense"
              native={false}
              value={teamManagerId}
            >
              {renderUserSelections()}
            </Select>
          </SelectMemberDropdownContainer>
        </>
      );
    };

    return (
      <Container>
        <SectionContainer>
          {headerText("Team Name")}
          <StyledTextField
            id="standard-textfield"
            placeholder="e.g. Leadership"
            variant="outlined"
            value={teamName}
            margin="dense"
            onChange={e => setTeamName(e.target.value)}
          />
        </SectionContainer>
        <SectionContainer>{teamManager()}</SectionContainer>
        <SectionContainer>
          <MembersHeaderContainer>
            <SelectMemberContainer>{headerText("Members")}</SelectMemberContainer>
            <SelectMeetingLeadContainer>{headerText("Meeting Lead")}</SelectMeetingLeadContainer>
            <CloseIconContainer />
          </MembersHeaderContainer>
          {renderMembersList()}
        </SectionContainer>
        <AddNewUserContainer onClick={() => setNumberOfUserRecords(numberOfUserRecords + 1)}>
          <Icon icon={"Plus"} size={"16px"} iconColor={"grey80"} />
          <TextContainer> Add another user</TextContainer>
        </AddNewUserContainer>

        <ActionButtonsContainer>
          <SaveButton small variant={"primary"} disabled={!teamName} onClick={() => updateTeam()}>
            {team ? "Update Team" : "Send Invite"}
          </SaveButton>
          {team && (
            <DeleteButton
              small
              variant={"redOutline"}
              onClick={() => {
                if (confirm(`Are you sure you want to delete this team?`)) {
                  teamStore.deleteTeam(team.id).then(() => {
                    showToast("Team deleted", ToastMessageConstants.SUCCESS);
                  });
                }
              }}
            >
              Delete Team
            </DeleteButton>
          )}
        </ActionButtonsContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  margin-left: 16px;
  margin-right: 16px;
`;

const SectionContainer = styled.div`
  margin-top: 16px;
`;

const StyledHeading = styled(Heading)`
  font-family: Lato;
  font-weight: bold;
  margin-bottom: 8px;
`;

const StyledTextField = styled(TextField)`
  width: -webkit-fill-available;
`;

const AddNewUserContainer = styled.div`
  display: flex;
  margin-top: 16px;
  &: hover {
    cursor: pointer;
  }
`;

const SaveButton = styled(Button)`
  margin-top: 24px;
  margin-bottom: 16px;
`;

const DeleteButton = styled(SaveButton)`
  margin-top: 24px;
  margin-bottom: 16px;
  margin-left: 8px;
`;

const MembersHeaderContainer = styled.div`
  display: flex;
  margin-bottom: 4px;
`;

const MembersRecordContainer = styled.div`
  display: flex;
`;

const SelectMemberContainer = styled.div`
  width: 70%;
`;

const SelectMeetingLeadContainer = styled.div`
  width: 20%;
`;

const CloseIconContainer = styled.div`
  width: 10%;
`;

const TextContainer = styled.div`
  color: ${props => props.theme.colors.grey100};
  font-size: 12px;
  margin-left: 8px;
  margin-top: auto;
  margin-bottom: auto;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
`;

const SelectMemberDropdownContainer = styled.div`
  width: 70%;
  padding-right: 16px;
  margin-right: 20px;
`;
