import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Avatar } from "~/components/shared/avatar";
import { MultiOptionTypeSelectionDropdownList } from "~/components/shared/multi-option-type-selection-dropdown";
import { Icon } from "~/components/shared/icon";
import { baseTheme } from "~/themes";
import { Heading } from "~/components/shared";
import { Text } from "~/components/shared/text";
import { useHistory } from "react-router-dom";
import { toJS } from "mobx";
import Typography from "@material-ui/core/Typography";
import { HtmlTooltip } from "~/components/shared/tooltip";
import { Loading } from "../../shared/loading";

export interface IScorecardSelectorProps {
  ownerType: string;
  ownerId: number;
  setScorecardOwner: React.Dispatch<React.SetStateAction<any>>;
}

export const ScorecardSelector = ({
  ownerType,
  ownerId,
  setScorecardOwner,
}: IScorecardSelectorProps): JSX.Element => {
  const { userStore, teamStore, companyStore, sessionStore } = useMst();
  const scorecardPro = sessionStore.profile?.productFeatures?.scorecardPro;
  const [showUsersList, setShowUsersList] = useState<boolean>(false);
  const [teams, setTeams] = useState<Array<any>>([]);
  const [company, setCompany] = useState(null);
  const [companyUsers, setCompanyUsers] = useState<Array<any>>([]);
  const [currentScorecard, setCurrentScorecard] = useState<string>("company");
  const [showScorecardProTooltip, setShowScorecardProTooltip] = useState(false);
  const { primary100 } = baseTheme.colors;

  const history = useHistory();

  useEffect(() => {
    let owner;
    if (ownerType == "company") {
      owner = company;
    } else if (ownerType == "team") {
      owner = teams.find(team => team.id == ownerId);
    } else if (ownerType == "user") {
      owner = companyUsers.find(user => user.id == ownerId);
    }
    setScorecardOwner(owner);
    setCurrentScorecard(`${owner?.name}${owner?.lastName ? " " + owner.lastName : ""}`);
  }, [teams, companyUsers, company, ownerType, ownerId]);

  if (!teamStore.teams || !companyStore.company || !userStore.users) {
    return <> </>;
  }
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
    history.push(`/scorecard/${owner.type}/${owner.id}`);
    return {
      ownerType: owner.type,
      ownerId,
    };
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
            if (scorecardPro) {
              setShowUsersList(!showUsersList);
            }
          }}
          onMouseEnter={() => {
            setShowScorecardProTooltip(!scorecardPro && true);
          }}
          onMouseLeave={() => setShowScorecardProTooltip(!scorecardPro && false)}
        >
          <ScorecardOwnerContainer>
            <OwnerHeading type={"h3"} fontSize={"20px"} fontWeight={600} mt={0}>
              {currentScorecard || ""}
            </OwnerHeading>
            <HtmlTooltip
              arrow={true}
              open={showScorecardProTooltip}
              enterDelay={500}
              leaveDelay={200}
              title={
                <React.Fragment>
                  {"Upgrade to track Team"} <br /> {"and Individual Scorecards."}
                </React.Fragment>
              }
            >
              <StyledChevronIconContainer>
                <StyledChevronIcon
                  icon={showUsersList ? "Chevron-Up" : "Chevron-Down"}
                  size={"12px"}
                  iconColor={primary100}
                />
              </StyledChevronIconContainer>
            </HtmlTooltip>
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

const StyledChevronIconContainer = styled.div`
  display: inline-block;
`;

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
