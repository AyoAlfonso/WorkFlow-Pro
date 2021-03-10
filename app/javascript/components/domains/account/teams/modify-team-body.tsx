import * as React from "react";
import { useMst } from "~/setup/root";
import { useState } from "react";
import styled from "styled-components";
import { Heading, Icon } from "~/components/shared";
import { observer } from "mobx-react";
import TextField from "@material-ui/core/TextField";
import { Button } from "~/components/shared/button";
import { UserSelectionRecord } from "./user-selection-record";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

interface IModifyTeamBodyProps {
  team?: any;
  setModalOpen: any;
}

export const ModifyTeamBody = observer(
  ({ team, setModalOpen }: IModifyTeamBodyProps): JSX.Element => {
    const { teamStore } = useMst();

    const formatMemberListState = teamUserEnablements => {
      let membersListItem = {};

      teamUserEnablements.forEach((tue, index) => {
        membersListItem[index] = {
          userId: tue.userId,
          meetingLead: tue.role == "team_lead" ? 1 : 0,
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
          showToast("Team updated", ToastMessageConstants.SUCCESS);
          setModalOpen(false);
        });
      } else {
        teamStore.createTeamAndInviteUsers(teamName, memberListState).then(() => {
          showToast("Team created", ToastMessageConstants.SUCCESS);
          setModalOpen(false);
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

    return (
      <Container>
        <SectionContainer>
          {headerText("Team Name")}
          <StyledTextField
            id="standard-textfield"
            placeholder="e.g. Leadership"
            variant="outlined"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
          />
        </SectionContainer>
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

        <SaveButton small variant={"primary"} disabled={!teamName} onClick={() => updateTeam()}>
          {team ? "Update Team" : "Send Invite"}
        </SaveButton>
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