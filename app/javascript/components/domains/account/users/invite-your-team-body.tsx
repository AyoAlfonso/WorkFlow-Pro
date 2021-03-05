import * as React from "react";
import { useMst } from "~/setup/root";
import { useState } from "react";
import styled from "styled-components";
import { Heading } from "~/components/shared";
import { observer } from "mobx-react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { Button } from "~/components/shared/button";

export const InviteYourTeamBody = observer(
  (): JSX.Element => {
    const {
      teamStore: { teams },
      companyStore,
    } = useMst();

    const [emailAddresses, setEmailAddresses] = useState<string>("");
    const [selectedTeamId, setSelectedTeamId] = useState<any>("");

    const renderTeamSelections = (): Array<JSX.Element> => {
      return teams.map((team, index) => {
        return (
          <MenuItem value={team.id} key={index}>
            {team.name}
          </MenuItem>
        );
      });
    };

    const inviteUsersToCompany = () => {
      companyStore.inviteUsersToCompany(emailAddresses, selectedTeamId);
      //TODO: CLOSE THE MODAL
    };

    return (
      <Container>
        <SectionContainer>
          <StyledHeading type={"h4"} color={"black"} fontSize={"12px"}>
            Email Addresses
          </StyledHeading>
          <StyledTextField
            id="standard-textarea"
            placeholder="e.g. steven@redbottlecoffee.com"
            multiline
            rows={4}
            variant="outlined"
            value={emailAddresses}
            onChange={e => setEmailAddresses(e.target.value)}
          />
          <HelperText>Use commas to separate different emails.</HelperText>
        </SectionContainer>
        <SectionContainer>
          <StyledHeading type={"h4"} color={"black"} fontSize={"12px"}>
            Team
          </StyledHeading>
          <StyledFormControl variant="outlined">
            <StyledSelect
              labelId="simple-select-outlined-label"
              id="simple-select-outlined"
              value={selectedTeamId}
              onChange={e => setSelectedTeamId(e.target.value)}
            >
              {renderTeamSelections()}
            </StyledSelect>
          </StyledFormControl>
          <HelperText>
            Add new members to a team. Don't see the team?{" "}
            <CreateATeamText> Create a team</CreateATeamText>
          </HelperText>
        </SectionContainer>

        <SaveButton
          small
          disabled={!emailAddresses || !selectedTeamId}
          variant={"primary"}
          onClick={() => inviteUsersToCompany()}
        >
          Send Invite
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

const HelperText = styled.p`
  color: ${props => props.theme.colors.grey100};
  font-size: 9px;
`;

const StyledSelect = styled(Select)`
  width: -webkit-fill-available;
`;

const StyledFormControl = styled(FormControl)`
  width: -webkit-fill-available;
`;

const CreateATeamText = styled.span`
  font-weight: bold;
  color: ${props => props.theme.colors.primary100};
  &: hover {
    cursor: pointer;
  }
`;

const SaveButton = styled(Button)`
  margin-top: 24px;
  margin-bottom: 16px;
`;
