import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { Icon } from "../../../shared/icon";
import { HomeContainerBorders } from "../../home/shared-components";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect } from "react";

interface IRecordOptionsProps {
  type: string;
  id: string | number;
  marginLeft?: string;
}

export const RecordOptions = (props: IRecordOptionsProps): JSX.Element => {
  const { type, id, marginLeft } = props;
  const { quarterlyGoalStore, annualInitiativeStore } = useMst();

  const optionsRef = useRef(null);
  const { t } = useTranslation();

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

  const deleteRecord = () => {
    let store;
    let stringValue = "";
    if (type == "quarterlyGoal") {
      store = quarterlyGoalStore;
      stringValue = t("quarterlyGoal.messageText");
    } else if (type == "annualInitiative") {
      store = annualInitiativeStore;
      stringValue = t("annualInitiative.messageText");
    }

    if (confirm(`Are you sure you want to delete this ${stringValue}?`)) {
      type == "quarterlyGoal" ? store.delete(false, id) : store.delete(id);
      setShowOptions(false);
    }
  };

  return (
    <Container ref={optionsRef}>
      <IconWrapper onClick={() => setShowOptions(!showOptions)}>
        <Icon icon={"Options"} size={"25px"} iconColor={"grey60"} />
      </IconWrapper>

      {showOptions && (
        <OptionsContainer marginLeft={marginLeft}>
          <Option onClick={() => deleteRecord()}>
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

type OptionsContainerProps = {
  marginLeft?: string;
};

const OptionsContainer = styled(HomeContainerBorders)<OptionsContainerProps>`
  position: absolute;
  background: white;
  color: black;
  width: 100px;
  margin-left: ${props => props.marginLeft || "-10px"};
  z-index: 2;
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
    z-index: 2;
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
