import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { UserType } from "~/types/user";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { useState, useEffect } from "react";
import { SubHeaderText } from "~/components/shared/sub-header-text";
import { Avatar } from "~/components/shared/avatar";
import { RoleAdministrator, RoleCEO } from "~/lib/constants";
import { UserSelectionDropdownList } from "~/components/shared/user-selection-dropdown-list";
import { Text } from "~/components/shared/text";
import { Loading } from "~/components/shared";


interface IOwnedBySectionProps {
  ownedBy: UserType;
  type: string;
  userIconBorder?: string;
  disabled?: boolean;
  size?: number;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
  nameWidth?: string;
  fontSize?: string;
}

export const OwnedBySection = observer(
  ({
    ownedBy,
    type,
    userIconBorder,
    disabled,
    size,
    nameWidth,
    fontSize,
    ...restProps
  }: IOwnedBySectionProps): JSX.Element => {
    const {
      userStore,
      sessionStore,
      annualInitiativeStore,
      quarterlyGoalStore,
      subInitiativeStore,
      keyPerformanceIndicatorStore,
    } = useMst();
    const currentUser = sessionStore.profile;
    const [store, setStore] = useState<any>(null);
    const [showUsersList, setShowUsersList] = useState<boolean>(false);
    const [owner, setOwner] = useState(ownedBy || currentUser);

    if (R.isNil(userStore) || R.isNil(sessionStore)) {
      return <></>;
    }

    useEffect(() => {
      if (type == "annualInitiative") {
        setStore(annualInitiativeStore);
      } else if (type == "quarterlyGoal") {
        setStore(quarterlyGoalStore);
      } else if (type == "subInitiative") {
        setStore(subInitiativeStore);
      } else if (type == "scorecard") {
        setStore(keyPerformanceIndicatorStore);
      }
      setOwner(ownedBy);
    }, [ownedBy]);

    if (R.isNil(owner)) {
      return <Loading />;
    }

    const companyUsers = userStore.users;
    const editable =
      ((owner && owner.id == currentUser.id) ||
        currentUser.role == RoleCEO ||
        currentUser.role == RoleAdministrator) &&
      !disabled;

    const renderUserSelectionList = (): JSX.Element => {
      return showUsersList ? (
        <div onClick={e => e.stopPropagation()}>
          <UserSelectionDropdownList
            userList={companyUsers}
            onUserSelect={store.updateOwnedBy}
            setShowUsersList={setShowUsersList}
            setOwner={setOwner}
          />
        </div>
      ) : (
        <></>
      );
    };
    return (
      <Container width={100}>
        <EditTriggerContainer
          editable={editable}
          onClick={e => {
            if (editable) {
              setShowUsersList(!showUsersList);
            }
          }}
        >
          <Avatar
            defaultAvatarColor={owner.defaultAvatarColor}
            avatarUrl={owner.avatarUrl}
            firstName={owner.firstName}
            lastName={owner.lastName}
            size={size || 20}
            border={userIconBorder}
            {...restProps}
          />
          <OwnedByName fontSize={fontSize} nameWidth={nameWidth} type={"fieldLabel"}>
            {owner.firstName} {owner.lastName}
          </OwnedByName>
        </EditTriggerContainer>
        {renderUserSelectionList()}
      </Container>
    );
  },
);

// Duplicate make these shared styling
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

const SubHeaderContainer = styled.div`
  display: flex;
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
