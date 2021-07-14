import React, { useEffect } from "react";
import { OwnedBySection } from "../shared/owned-by-section";
import { useMst } from "~/setup/root";
import { Avatar } from "~/components/shared/avatar";
import { UserSelectionDropdownList } from "~/components/shared/user-selection-dropdown-list";


interface IScorecardSelectorProps {



}

export const ScorecardSelector = ({}: IScorecardSelectorProps): JSX.Element => {
  const companyUsers = userStore.users;
  const { userStore, sessionStore, annualInitiativeStore, quarterlyGoalStore } = useMst();

  const renderUserSelectionList = (): JSX.Element => {
    return showUsersList ? (
      <div onClick={e => e.stopPropagation()}>
        <UserSelectionDropdownList
          userList={companyUsers}
          onUserSelect={store.updateOwnedBy}
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
        <EditTriggerContainer
          editable={true}
          onClick={e => {
            if (editable) {
              setShowUsersList(!showUsersList);
            }
          }}
        >
          <Avatar
            defaultAvatarColor={ownedBy.defaultAvatarColor}
            avatarUrl={ownedBy.avatarUrl}
            firstName={ownedBy.firstName}
            lastName={ownedBy.lastName}
            size={size || 20}
            border={userIconBorder}
            {...restProps}
          />
          <OwnedByName fontSize={fontSize} nameWidth={nameWidth} type={"fieldLabel"}>
            {ownedBy.firstName} {ownedBy.lastName}
          </OwnedByName>
        </EditTriggerContainer>
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
