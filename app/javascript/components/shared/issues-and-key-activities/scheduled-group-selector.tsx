import * as React from "react";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Icon } from "../../shared/icon";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Loading } from "../loading";
import { InitialsGenerator } from "./initials-generator";

interface IScheduledGroupSelectorProps {
  selectedGroupId: number;
  setSelectedGroupId: any;
  selectedTeamId: number;
  setSelectedTeamId: any;
}

export const ScheduledGroupSelector = observer(
  ({
    selectedGroupId,
    setSelectedGroupId,
    selectedTeamId,
    setSelectedTeamId,
  }: IScheduledGroupSelectorProps): JSX.Element => {
    const {
      sessionStore: { scheduledGroups },
      teamStore: { teams },
    } = useMst();

    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    if (!scheduledGroups) {
      return <Loading />;
    }

    const currentSelectedItem = selectedGroupId
      ? scheduledGroups.find(group => group.id == selectedGroupId)
      : teams.find(team => team.id == selectedTeamId);

    const optionsRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = event => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
          setShowDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const onItemSelect = (selection): void => {
      setSelectedTeamId(null);
      setSelectedGroupId(selection);
      setShowDropdown(false);
    };

    const onTeamSelect = (teamId): void => {
      setSelectedTeamId(teamId);
      setSelectedGroupId(null);
      setShowDropdown(false);
    };

    const renderTeams = () => {
      return teams.map((team, index) => {
        return (
          <OptionContainer onClick={() => onTeamSelect(team.id)} key={index}>
            <OptionInitialContainer>
              <InitialsGenerator name={team.name} />
            </OptionInitialContainer>
            <OptionText>{team.name}</OptionText>
          </OptionContainer>
        );
      });
    };

    const renderSelections = () => {
      return scheduledGroups.map((group, index) => {
        return (
          <OptionContainer onClick={() => onItemSelect(group.id)} key={index}>
            <OptionInitialContainer>
              <InitialsGenerator name={group.name} />
            </OptionInitialContainer>
            <OptionText>{group.name}</OptionText>
          </OptionContainer>
        );
      });
    };

    return (
      <Container ref={optionsRef}>
        <PriorityDisplayButton onClick={() => setShowDropdown(!showDropdown)}>
          <Icon icon={"List"} size={"16px"} />
          {currentSelectedItem && (
            <TextContainer>
              <InitialsGenerator name={currentSelectedItem.name} />
            </TextContainer>
          )}
        </PriorityDisplayButton>
        {showDropdown && (
          <SelectionContainer>
            {renderSelections()}
            {renderTeams()}
          </SelectionContainer>
        )}
      </Container>
    );
  },
);

const Container = styled.div``;

const PriorityDisplayButton = styled.div`
  display: flex;
  border-radius: 3px;
  background-color: ${props => props.theme.colors.backgroundGrey};
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  &: hover {
    cursor: pointer;
  }
`;

const TextContainer = styled.div`
  margin-left: 8px;
  font-size: 12px;
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.black};
`;

const OptionInitialContainer = styled.div`
  color: ${props => props.theme.colors.greyInactive};
  width: 20px;
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
`;

const SelectionContainer = styled.div`
  width: 150px;
  padding-top: 8px;
  padding-bottom: 8px;
  position: absolute;
  background-color: white;
  z-index: 2;
  border-radius: 5px;
  border: 1px solid #e3e3e3;
`;

const OptionText = styled(TextContainer)`
  color: ${props => props.theme.colors.black};
  margin-left: 8px;
`;

export const InitialsText = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-top: auto;
  margin-bottom: auto;
`;

const OptionContainer = styled.div`
  display: flex;
  height: 24px;
  padding-left: 16px;
  padding-right: 16px;
  margin-top: 4px;
  margin-bottom: 4px;
  &: hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.primary100};
  }
  &:hover ${OptionText} {
    color: white;
  }
  &: hover ${InitialsText}{
    color: white;
  }
`;