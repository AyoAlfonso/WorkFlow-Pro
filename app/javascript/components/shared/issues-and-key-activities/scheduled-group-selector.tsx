import * as React from "react";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Icon } from "../../shared/icon";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Loading } from "../loading";
import { InitialsGenerator } from "./initials-generator";
import { baseTheme } from "~/themes";

interface IScheduledGroupSelectorProps {
  selectedGroupId: number;
  setSelectedGroupId: any;
  selectedTeamId: number;
  setSelectedTeamId: any;
  listOnly?: boolean;
  setShowList?: () => void;
}

export const ScheduledGroupSelector = observer(
  ({
    selectedGroupId,
    setSelectedGroupId,
    selectedTeamId,
    setSelectedTeamId,
    listOnly,
    setShowList,
  }: IScheduledGroupSelectorProps): JSX.Element => {
    const {
      sessionStore: { scheduledGroups, profile },
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

    const closeList = () => {
      if (!setShowList) return
      setShowList();
    }

    const onItemSelect = (selection, e): void => {
      setSelectedTeamId(null);
      setSelectedGroupId(selection);
      setShowDropdown(false);
      setTimeout(() => {
        closeList();
      }, 0)
    };

    const onTeamSelect = (teamId, e): void => {
      setSelectedTeamId(teamId);
      setSelectedGroupId(null);
      setShowDropdown(false);
      setTimeout(() => {
        closeList();
      }, 0);
    };

    const renderTeams = () => {
      return profile.teams.map((team, index) => {
        return (
          <OptionContainer onClick={(e) => onTeamSelect(team.id, e)} key={index}>
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
          <OptionContainer onClick={(e) => onItemSelect(group.id, e)} key={index}>
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
        {listOnly ? (
          <SelectionContainer fullWidth>
            {renderSelections()}
            {renderTeams()}
          </SelectionContainer>
        ) : (
          <>
            <PriorityDisplayButton onClick={() => setShowDropdown(!showDropdown)}>
              <Icon icon={"List"} size={"16px"} iconColor={baseTheme.colors.primary100} />
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
          </>
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

type SelectionContainerProps = {
  fullWidth?: boolean;
};

const SelectionContainer = styled.div<SelectionContainerProps>`
  width: ${props => (props.fullWidth ? "100%" : "150px")};
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

export const StyledIcon = styled(Icon)``;

type InitialsTextProps = {
  fontSize?: string;
  fontColor?: string;
};

export const InitialsText = styled.div<InitialsTextProps>`
  font-size: ${props => props.fontSize || "12px"};
  font-weight: bold;
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.fontColor};
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
  &: hover ${StyledIcon}{
    color: white;
  }

`;
