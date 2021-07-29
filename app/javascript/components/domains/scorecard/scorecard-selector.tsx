import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { Avatar } from "~/components/shared/avatar";
import { MultiOptionTypeSelectionDropdownList } from "~/components/shared/multi-option-type-selection-dropdown";
import { Icon } from "~/components/shared/icon";
import { baseTheme } from "~/themes";
import { Heading } from "~/components/shared";
import { Text } from "~/components/shared/text";
import { toJS } from "mobx";

export const ScorecardSelector = (): JSX.Element => {
  const { userStore, scorecardStore, teamStore, companyStore } = useMst();
  const [showUsersList, setShowUsersList] = useState<boolean>(false);
  const [ownerType, setOwnerType] = useState<string>("company");
  const [ownerId, setOwnerId] = useState<number>(companyStore.company?.id);
  const [teams, setTeams] = useState<Array<any>>([]);
  const [company, setCompany] = useState(null);
  const [companyUsers, setCompanyUsers] = useState<Array<any>>([]);
  const [currentScorecard, setCurrentScorecard] = useState<string>("company");
  const { primary100 } = baseTheme.colors;

  useEffect(() => {
    scorecardStore.getScorecard({
      ownerType,
      ownerId,
    });
  }, [companyStore.company]);

  useEffect(() => {
    const teams =
      teamStore &&
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
    setTeams(teams);
    const company = companyStore && {
      id: companyStore.company.id,
      type: "company",
      defaultAvatarColor: "cautionYellow",
      avatarUrl: companyStore.company.logoUrl,
      name: companyStore.company.name,
    };

    setCompany(company);
    setCurrentScorecard(company.name);
    const users =
      userStore &&
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
  }, [teamStore.teams, companyStore.company, userStore.users]);

  const ownerSelector = value => {
    const owner = {
      ownerType: value.type,
      ownerId,
    };
    setCurrentScorecard(`${value.name} ${value.lastName || ""}`);
    setOwnerType(value.type);
    setOwnerId(value.id);
    scorecardStore.getScorecard(owner);
    return owner;
  };

  const renderUserSelectionList = (): JSX.Element => {
    return (
      <div onClick={e => e.stopPropagation()}>
        <MultiOptionTypeSelectionDropdownList
          userList={[...companyUsers, ...teams, company]}
          onUserSelect={ownerSelector}
          setShowUsersList={setShowUsersList}
          title={"Scorecard"}
          showUsersList
        />
      </div>
    );
  };

  return (
    <div
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <Container width={100}>
        <EditTriggerContainer
          editable={true}
          onClick={e => {
            setShowUsersList(!showUsersList);
          }}
        >
          <ScorecardOwnerContainer>
            <OwnerHeading type={"h3"} fontSize={"20px"} fontWeight={600} mt={0}>
              {currentScorecard}
            </OwnerHeading>
            <StyledChevronIcon
              icon={!showUsersList ? "Chevron-Up" : "Chevron-Down"}
              size={"12px"}
              iconColor={primary100}
            />
          </ScorecardOwnerContainer>
        </EditTriggerContainer>

        {showUsersList ? renderUserSelectionList() : <></>}
      </Container>
    </div>
  );
};
type EditTriggerContainerType = {
  editable: boolean;
};

type ContainerProps = {
  width?: number;
};

const Container = styled.div<ContainerProps>`
  margin-left: 0px;
  width: max-content;
`;

const EditTriggerContainer = styled.div<EditTriggerContainerType>`
  display: flex;
  align-items: center center;
  &:hover {
    cursor: ${props => props.editable && "pointer"};
  }
`;

const OwnedByName = styled(Text)`
  margin-left: 8px;
  letter-spacing: 0px;
  color: ${props => props.theme.colors.black};
  width: ${props => `${props.nameWidth}` || "auto"};
  overflow: hidden;
  font-size: ${props => `${props.fontSize}` || "12px"};
  text-overflow: ellipsis;
`;

const OwnerHeading = styled(Heading)`
  display: inline-block;
`;

const CloseIconContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const ScorecardOwnerContainer = styled.div`
  align-items: baseline;
`;

const StyledChevronIcon = styled(Icon)`
  display: inline-block;
  padding: 0px 15px;
`;
