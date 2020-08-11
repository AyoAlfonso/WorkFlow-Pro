import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { Icon } from "../../../shared/icon";
import { HomeContainerBorders } from "../../home/shared-components";
import { useMst } from "~/setup/root";
import { useRef, useState, useEffect } from "react";

interface IRecordOptionsProps {
  quarterlyGoalId: string | number;
}

export const RecordOptions = (props: IRecordOptionsProps): JSX.Element => {
  const { quarterlyGoalId } = props;
  const { quarterlyGoalStore } = useMst();

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
      <IconWrapper onClick={() => setShowOptions(!showOptions)}>
        <Icon icon={"Options"} size={"25px"} iconColor={"grey60"} />
      </IconWrapper>

      {showOptions && (
        <OptionsContainer>
          <Option
            onClick={() => {
              if (confirm("Are you sure you want to delete this quarterly goal?")) {
                quarterlyGoalStore.delete(quarterlyGoalId).then(() => {
                  setShowOptions(false);
                });
              }
            }}
          >
            <StyledIcon icon={"Delete"} size={20} />
            <OptionText> Delete </OptionText>
          </Option>
        </OptionsContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const OptionsContainer = styled(HomeContainerBorders)`
  position: absolute;
  background: white;
  color: black;
  width: 100px;
  margin-left: -10px;
`;

const OptionText = styled(Text)`
  color: ${props => props.theme.colors.primary100};
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
`;

const StyledIcon = styled(Icon)`
  margin-left: 10px;
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.primary100};
`;

const Option = styled.div`
  display: flex;
  &:hover {
    background-color: ${props => props.theme.colors.primary100};
    border-radius: 10px;
  }
  &:hover ${OptionText} {
    color: white;
  }
  &: hover ${StyledIcon}{
    color: white;
  }
`;

const IconWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }
`;
