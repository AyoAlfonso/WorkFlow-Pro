import * as React from "react";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Icon } from "../../shared/icon";

interface IPrioritySelectorProps {
  itemPriority: number;
  setSelectedPriority: any;
}

export const PrioritySelector = ({
  itemPriority,
  setSelectedPriority,
}: IPrioritySelectorProps): JSX.Element => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [iconName, setIconName] = useState<string>("Priority-None");
  const [iconColor, setIconColor] = useState<string>("greyActive");
  const [displayName, setDisplayName] = useState<string>("Priority");

  const optionsRef = useRef(null);

  useEffect(() => {
    renderSelectedPriority();
    const handleClickOutside = event => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [itemPriority, optionsRef]);

  const onItemSelect = (selection): void => {
    setSelectedPriority(selection);
    setShowDropdown(false);
  };

  const renderSelectedPriority = (): void => {
    switch (itemPriority) {
      case 1:
        setIconName("Low-Priority");
        setIconColor("cautionYellow");
        setDisplayName("Low Priority");
        break;
      case 2:
        setIconName("Medium-Priority");
        setIconColor("tango");
        setDisplayName("Medium Priority");
        break;
      case 3:
        setIconName("High-Priority");
        setIconColor("warningRed");
        setDisplayName("High Priority");
        break;
      default:
        setIconName("Priority-None");
        setIconColor("greyActive");
        setDisplayName("Priority");
        break;
    }
  };

  const renderSelections = () => {
    return (
      <>
        <OptionContainer onClick={() => onItemSelect(3)}>
          <Icon icon={"High-Priority"} size={"16px"} iconColor={"warningRed"} />
          <OptionText>High Priority</OptionText>
        </OptionContainer>
        <OptionContainer onClick={() => onItemSelect(2)}>
          <Icon icon={"Medium-Priority"} size={"16px"} iconColor={"tango"} />
          <OptionText>Medium Priority</OptionText>
        </OptionContainer>
        <OptionContainer onClick={() => onItemSelect(1)}>
          <Icon icon={"Low-Priority"} size={"16px"} iconColor={"cautionYellow"} />
          <OptionText>Low Priority</OptionText>
        </OptionContainer>
        <OptionContainer onClick={() => onItemSelect(0)}>
          <Icon icon={"Priority-None"} size={"16px"} iconColor={"greyActive"} />
          <OptionText>No Priority</OptionText>
        </OptionContainer>
      </>
    );
  };

  return (
    <Container ref={optionsRef}>
      <PriorityDisplayButton onClick={() => setShowDropdown(!showDropdown)}>
        <Icon icon={iconName} size={"16px"} iconColor={iconColor} />
        <TextContainer> {displayName} </TextContainer>
      </PriorityDisplayButton>
      {showDropdown && <SelectionContainer>{renderSelections()}</SelectionContainer>}
    </Container>
  );
};

const Container = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 1em;
`;

const PriorityDisplayButton = styled.div`
  display: flex;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.colors.borderGrey};
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  &: hover {
    cursor: pointer;
  }
`;

const TextContainer = styled.div`
  margin-left: 4px;
  font-size: 12px;
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.greyActive};

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const SelectionContainer = styled.div`
  width: 150px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
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

const OptionContainer = styled.div`
  display: flex;
  height: 24px;
  margin-top: 4px;
  margin-bottom: 4px;
  &: hover {
    cursor: pointer;
  }
`;
