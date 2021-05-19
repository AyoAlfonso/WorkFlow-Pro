import * as React from "react";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { Icon } from "../../../shared/icon";
import { useRef, useState, useEffect } from "react";
import { GoalDropdownOptions } from "./goal-dropdown-options";

interface IRecordOptionsProps {
  type: string;
  id: string | number;
  marginLeft?: string;
  iconColor?: string;
}

export const RecordOptions = (props: IRecordOptionsProps): JSX.Element => {
  const { type, id, marginLeft, iconColor } = props;

  const optionsRef = useRef(null);

  const [showOptions, setShowOptions] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = event => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef]);

  return (
    <Container ref={optionsRef}>
      <IconWrapper
        onClick={e => {
          e.stopPropagation();
          setShowOptions(!showOptions);
        }}
      >
        <Icon icon={"Options"} size={"16px"} iconColor={iconColor || "grey60"} />
      </IconWrapper>
      {showOptions && (
        <DropdownOptionsContainer onClick={e => e.stopPropagation()}>
          <GoalDropdownOptions
            setShowDropdownOptions={setShowOptions}
            itemType={type}
            itemId={id}
          />
        </DropdownOptionsContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const DropdownOptionsContainer = styled.div`
  margin-left: -50px;
`;

const IconWrapper = styled.div`
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
  &:hover {
    cursor: pointer;
    color: ${props => props.theme.colors.greyActive};
  }
`;
