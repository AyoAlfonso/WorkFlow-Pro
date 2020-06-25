import * as React from "react";
import { HomeContainerBorders } from "./shared-components";
import styled from "styled-components";
import Icon from "../../shared/Icon";
import { baseTheme } from "../../../themes/base";
import { useState } from "react";
import { color } from "styled-system";

export const HomeHeaderBar = (): JSX.Element => {
  const [openCreateDropdown, setOpenCreateDropdown] = useState<boolean>(false);
  const [openLynchPynDropdown, setOpenLynchPynDropdown] = useState<boolean>(false);

  const renderHeaderIcon = (iconName: string) => {
    const dropdownValue = iconName == "Plus" ? openCreateDropdown : openLynchPynDropdown;
    return (
      <Icon
        icon={iconName}
        size={20}
        color={dropdownValue ? baseTheme.colors.primary100 : baseTheme.colors.white}
        style={{ marginLeft: "10px", marginTop: "10px" }}
      />
    );
  };

  //const createDropdownModal

  return (
    <Container>
      <ActionsContainer>
        <IconContainer
          backgroundColor={openCreateDropdown ? "white" : "primary100"}
          onClick={() => setOpenCreateDropdown(!openCreateDropdown)}
        >
          {renderHeaderIcon("Plus")}
        </IconContainer>
        <IconContainer
          backgroundColor={openLynchPynDropdown ? "white" : "primary100"}
          onClick={() => setOpenLynchPynDropdown(!openLynchPynDropdown)}
        >
          {renderHeaderIcon("")}
        </IconContainer>
      </ActionsContainer>
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  margin-top: 40px;
  height: 80px;
`;

const ActionsContainer = styled.div`
  margin: 20px;
  display: flex;
`;

type IconContainerType = {
  backgroundColor?: string;
};

const IconContainer = styled.div<IconContainerType>`
  ${color}
  height: 40px;
  width: 40px;
  border-radius: 50px;
  box-shadow: 0px 2px rgba(0, 0, 0, 0.2);
  margin-left: 12px;
`;
