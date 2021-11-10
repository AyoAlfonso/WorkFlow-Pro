import * as React from "react";
import { useMst } from "~/setup/root";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Heading } from "~/components/shared";
import { observer } from "mobx-react";
import TextField from "@material-ui/core/TextField";
import { Select } from "~/components/shared";
import MenuItem from "@material-ui/core/MenuItem";
import { Button } from "~/components/shared/button";
import { toJS } from "mobx";
import { TeamSelectionDropdown } from "../../../shared/team-selection-dropdown";
interface IInviteYourTeamBodyProps {
  setModalOpen: any;
  setShowUserLimitModal: any;
}

export const InviteYourTeamBody = observer(
  ({ setModalOpen, setShowUserLimitModal }: IInviteYourTeamBodyProps): JSX.Element => {
    const {
      teamStore: { teams },
      companyStore,
      userStore: { users },
    } = useMst();

    const [emailAddresses, setEmailAddresses] = useState<string>("");
    const [selectedTeamId, setSelectedTeamId] = useState<any>("");
    const [loading, setLoading] = useState<boolean>(false);

    const inviteUsersToCompany = () => {
      // TODO: UPDATE THIS FEATURE WHEN THE IMPLEMENTATION FOR SUBSCRIPTION HAS BEEN COMPLETED.
      //       WE NEED TO DETERMINE THE NUMBER OF USERS + WHICH PLAN THE COMPANY IS ON

      const numberOfUsersToInvite = emailAddresses.split(",").filter(item => item.trim().length > 0)
        .length;

      const remainingNumberOfUsers = 15 - users.length;
      if (numberOfUsersToInvite > remainingNumberOfUsers) {
        // TODO: SHOW THE TOO MANY PEOPLE MODAL
        setShowUserLimitModal(true);
      } else {
        companyStore.inviteUsersToCompany(emailAddresses, selectedTeamId).then(() => {
          setModalOpen(false);
        });
      }
    };

    return (
      <Container>
        <SectionContainer>
          <StyledHeading type={"h4"} color={"black"} fontSize={"12px"}>
            Email Addresses
          </StyledHeading>
          <StyledTextField
            id="standard-textarea"
            placeholder={`e.g. user@${companyStore.company.name.replace(/\s+/g, "")}.com`}
            multiline
            rows={4}
            variant="outlined"
            value={emailAddresses}
            onChange={e => setEmailAddresses(e.target.value)}
          />
          <HelperText>Use commas to separate different emails.</HelperText>
        </SectionContainer>
        <SectionContainer>
          <TeamSelectionDropdown teamsList={teams} onTeamSelect={setSelectedTeamId} />
        </SectionContainer>

        <SaveButton
          small
          disabled={!emailAddresses || !selectedTeamId || loading}
          variant={"primary"}
          onClick={() => {
            setLoading(true);
            inviteUsersToCompany();
            setLoading(false);
          }}
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
  width: 100%;
`;

const HelperText = styled.p`
  color: ${props => props.theme.colors.grey100};
  font-size: 11px;
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
