import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { Avatar } from "~/components/shared/avatar";
import { UserSelectionDropdownList } from "~/components/shared/user-selection-dropdown-list";
import { Text } from "~/components/shared/text";

interface IScorecardSelectorProps {
  //   ownedBy: any;
}

export const ScorecardSelector = ({}: //   ownedBy
IScorecardSelectorProps): JSX.Element => {
  const { userStore, scorecardStore, teamStore, companyStore } = useMst();
  const companyUsers = userStore.users;
  const teams = teamStore.teams;
  const company = companyStore.company;
  const [showUsersList, setShowUsersList] = useState<boolean>(false);
  const [ownerType, setOwnerType] = useState<string>("company");
  const [ownerId, setOwnerId] = useState<number>(company.id);

  useEffect(() => {
    console.log(ownerType, ownerId);
    scorecardStore.getScorecard({ ownerType, ownerId });
  }, []);
  const ownerSelector = value => {
    // console.log(value, "values---");
    const ownerType = value.email ? "user" : value.displayFormat ? "company" : "team";
    setOwnerType(ownerType);
    setOwnerId(value.id);
    // console.log(ownerType, "value--");
    scorecardStore.getScorecard({ ownerType, ownerId });
    return { ownerType, ownerId };
  };

  console.log(company, teams, companyUsers);
  const renderUserSelectionList = (): JSX.Element => {
    return (
      <div onClick={e => e.stopPropagation()}>
        <UserSelectionDropdownList
          userList={companyUsers}
          teamList={teams}
          company={company}
          onUserSelect={ownerSelector}
          setShowUsersList={setShowUsersList}
          ownerType={ownerType}
          title={"Scorecard"}
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
          <Owner>This one guy</Owner>
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
  width: ${props => `${props.width}%` || "auto"};
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
const Owner = styled(Text)``;
