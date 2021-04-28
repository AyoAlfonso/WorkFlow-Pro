import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/shared/button";
import { useMst } from "~/setup/root";
import { useRef } from "react";
import { DropdownOptions } from "./dropdown-options";
import { Text } from "../../../shared/text";
import ContentEditable from "react-contenteditable";
import { OwnedBySection } from "../shared/owned-by-section";

interface IInitiativeHeaderProps {
  itemType: string;
  item: any;
  editable: boolean;
  setAnnualInitiativeId: React.Dispatch<React.SetStateAction<number>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAnnualInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  annualInitiativeId: number;
  annualInitiativeDescription: string;
  showDropdownOptionsContainer: boolean;
  setShowDropdownOptionsContainer: React.Dispatch<React.SetStateAction<boolean>>;
  goalYearString: string;
}

export const InitiativeHeader = ({
  itemType,
  item,
  editable,
  setAnnualInitiativeId,
  setModalOpen,
  setAnnualInitiativeModalOpen,
  annualInitiativeId,
  annualInitiativeDescription,
  showDropdownOptionsContainer,
  setShowDropdownOptionsContainer,
  goalYearString,
}: IInitiativeHeaderProps): JSX.Element => {
  const { quarterlyGoalStore, subInitiativeStore } = useMst();

  const descriptionRef = useRef(null);
  const mobxStore = itemType == "quarterlyGoal" ? quarterlyGoalStore : subInitiativeStore;

  return (
    <HeaderContainer>
      <TitleContainer>
        <StyledContentEditable
          innerRef={descriptionRef}
          html={item.description}
          disabled={!editable}
          onChange={e => {
            if (!e.target.value.includes("<div>")) {
              mobxStore.updateModelField("description", e.target.value);
            }
          }}
          onKeyDown={key => {
            if (key.keyCode == 13) {
              descriptionRef.current.blur();
            }
          }}
          onBlur={() => mobxStore.update()}
        />
        <GoalText>
          driving{" "}
          <UnderlinedGoalText
            onClick={() => {
              setModalOpen(false);
              setAnnualInitiativeId(annualInitiativeId);
              setAnnualInitiativeModalOpen(true);
            }}
          >
            {annualInitiativeDescription}
          </UnderlinedGoalText>
        </GoalText>
        <DetailsContainer>
          <YearText type={"small"}>
            Q{item.quarter} {goalYearString} Initiative
          </YearText>
          <OwnedBySection ownedBy={item.ownedBy} type={itemType} disabled={item.closedInitiative} />
        </DetailsContainer>
      </TitleContainer>
      <AnnualInitiativeActionContainer>
        <DropdownOptions
          editable={editable}
          showDropdownOptionsContainer={showDropdownOptionsContainer}
          setShowDropdownOptionsContainer={setShowDropdownOptionsContainer}
          setParentModalOpen={setModalOpen}
          itemType={itemType}
          item={item}
        />
        <CloseIconContainer onClick={() => setModalOpen(false)}>
          <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} />
        </CloseIconContainer>
      </AnnualInitiativeActionContainer>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
`;

const TitleContainer = styled.div``;

const GoalText = styled(Text)`
  font-size: 15px;
  margin-left: 4px;
  color: ${props => props.theme.colors.grey80};
`;

const UnderlinedGoalText = styled.span`
  font-weight: bold;
  text-decoration: underline;
  &: hover {
    cursor: pointer;
  }
`;

const AnnualInitiativeActionContainer = styled.div`
  display: flex;
  margin-left: auto;
`;

const CloseIconContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const StyledContentEditable = styled(ContentEditable)`
  font-weight: bold;
  font-size: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 4px;
  padding-right: 4px;
  margin-right: -4px;
`;

const DetailsContainer = styled.div`
  display: flex;
  margin-left: 4px;
`;

const YearText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
`;
