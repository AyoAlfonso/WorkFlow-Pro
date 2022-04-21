import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { MultiOptionTypeSelectionDropdownList } from "~/components/shared/multi-option-type-selection-dropdown";
import { Icon } from "~/components/shared/icon";
import { baseTheme } from "~/themes";
import { toJS } from "mobx";
import { Heading } from "~/components/shared";
import { Text } from "~/components/shared/text";

export interface IAuditLogsSelectorProps {
  ownerType: string;
  ownerId: number;
  setOwnerType: React.Dispatch<React.SetStateAction<string>>;
  setOwnerId: React.Dispatch<React.SetStateAction<number>>;
  setAuditLogs: React.Dispatch<React.SetStateAction<any>>;
}

export const AuditLogsSelector = observer(
  ({
    ownerType,
    ownerId,
    setOwnerType,
    setOwnerId,
    setAuditLogs,
  }: IAuditLogsSelectorProps): JSX.Element => {
    const { userStore, teamStore, companyStore, sessionStore, auditLogStore } = useMst();

    const { auditLogs } = auditLogStore;

    const [teams, setTeams] = useState<Array<any>>([]);
    const [company, setCompany] = useState(null);
    const [companyUsers, setCompanyUsers] = useState<Array<any>>([]);
    const [showUsersList, setShowUsersList] = useState<boolean>(false);
    const [currentLog, setCurrentLog] = useState<string>("company");

    if (!companyStore.company || !userStore.users || !teamStore.teams || !ownerType || !ownerId) {
      return <></>;
    }

    useEffect(() => {
      let owner;
      if (ownerType == "company") {
        owner = company;
      } else if (ownerType == "team") {
        owner = teams.find(team => team.id == ownerId);
      } else if (ownerType == "user") {
        owner = companyUsers.find(user => user.id == ownerId);
      }

      if (owner) {
        // setLogOwner(owner);
        setCurrentLog(`${owner?.name}${owner?.lastName ? " " + owner?.lastName : ""}`);
      }
    }, [teams, companyUsers, company, ownerType, ownerId]);

    useEffect(() => {
      const teams =
        teamStore.teams &&
        toJS(teamStore)
          .teams.filter(team => team.active)
          .map(team => {
            return {
              id: team.id,
              type: "team",
              executive: team.executive,
              defaultAvatarColor: team.defaultAvatarColor,
              name: team.name,
            };
          });

      const company = companyStore && {
        id: companyStore.company.id,
        type: "company",
        defaultAvatarColor: "cautionYellow",
        avatarUrl: companyStore.company.logoUrl,
        name: companyStore.company.name,
      };

      const users =
        userStore.users &&
        toJS(userStore)
          .users.filter(user => user.status == "active")
          .map(user => {
            return {
              id: user.id,
              type: "user",
              defaultAvatarColor: user.defaultAvatarColor,
              avatarUrl: user.avatarUrl,
              name: user.firstName,
              lastName: user.lastName,
            };
          });
      setCompanyUsers(users);
      setTeams(teams);
      setCompany(company);
    }, [teamStore.teams, companyStore.company, userStore.users]);

    const ownerSelector = owner => {
      const ownerType = owner.type;
      const ownerId = owner.id;
      setOwnerType(ownerType);
      setOwnerId(ownerId);
      let filteredLogs;
      if (ownerType == "company") {
        filteredLogs = auditLogs.filter(log => log.companyId == ownerId);
        setAuditLogs(filteredLogs);
      } else if (ownerType == "user") {
        filteredLogs = auditLogs.filter(log => log.userId == ownerId);
        setAuditLogs(filteredLogs);
      } else {
        filteredLogs = auditLogs.filter(log => log.teamId == ownerId);
        setAuditLogs(filteredLogs);
      }
    };

    const renderUserSelectionList = (): JSX.Element => {
      return (
        <div onClick={e => e.stopPropagation()}>
          <MultiOptionTypeSelectionDropdownList
            userList={[...companyUsers, ...teams, company]}
            onUserSelect={ownerSelector}
            setShowUsersList={setShowUsersList}
            title={"Audit Logs"}
            showUsersList
          />
        </div>
      );
    };

    return (
      <Container
        onClick={e => {
          e.stopPropagation();
        }}
        data-testid="scorecard-selector"
        width={100}
      >
        <LogOwnerContainer onClick={() => setShowUsersList(!showUsersList)}>
          <OwnerHeading type={"h3"} fontSize={"20px"} fontWeight={600} mt={0}>
            {currentLog || ""}
          </OwnerHeading>
          <StyledChevronIconContainer>
            <StyledChevronIcon
              icon={showUsersList ? "Chevron-Up" : "Chevron-Down"}
              size={"12px"}
              iconColor={"primary100"}
            />
          </StyledChevronIconContainer>
        </LogOwnerContainer>

        {showUsersList ? renderUserSelectionList() : <></>}
      </Container>
    );
  },
);

type EditTriggerContainerType = {
  editable: boolean;
};

type ContainerProps = {
  width?: number;
};

const StyledChevronIconContainer = styled.div`
  display: inline-block;
`;

const Container = styled.div<ContainerProps>`
  margin-left: 0px;
  width: max-content;
`;

const OwnerHeading = styled(Heading)`
  display: inline-block;
`;

const StyledChevronIcon = styled(Icon)`
  display: inline-block;
  padding: 0px 15px;
`;

const LogOwnerContainer = styled.div`
  align-items: baseline;
`;
