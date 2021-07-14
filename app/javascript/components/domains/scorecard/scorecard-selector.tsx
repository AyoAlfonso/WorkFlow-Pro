import React, { useState, useEffect } from "react";
import styled from "styled-components"
import { useMst } from "~/setup/root";
import { Avatar } from "~/components/shared/avatar";
import { UserSelectionDropdownList } from "~/components/shared/user-selection-dropdown-list";
import { Text } from "~/components/shared/text";


interface IScorecardSelectorProps {
  ownedBy: any;
}

export const ScorecardSelector = ({
  ownedBy
}: IScorecardSelectorProps): JSX.Element => {
  const { userStore, sessionStore, annualInitiativeStore, quarterlyGoalStore } = useMst();
  const companyUsers = userStore.users;
  const [showUsersList, setShowUsersList] = useState<boolean>(false);

  const renderUserSelectionList = (): JSX.Element => {
    return showUsersList ? (
      <div onClick={e => e.stopPropagation()}>
        <UserSelectionDropdownList
          userList={companyUsers}
          onUserSelect={() => {}}
          setShowUsersList={setShowUsersList}
        />
      </div>
    ) : (
      <></>
    );
  };

  return (
    <div
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <Container width={100}>
        <Avatar
          defaultAvatarColor={ownedBy.defaultAvatarColor}
          avatarUrl={ownedBy.avatarUrl}
          firstName={ownedBy.firstName}
          lastName={ownedBy.lastName}
          size={20}
        />
        <OwnedByName type={"fieldLabel"}>
          {ownedBy.firstName} {ownedBy.lastName}
        </OwnedByName>
        {renderUserSelectionList()}
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
