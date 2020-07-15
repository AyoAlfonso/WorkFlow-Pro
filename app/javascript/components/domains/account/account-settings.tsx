import React, { useState } from "react";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Text } from "~/components/shared/text";
import { AccountProfile } from "./profile";
import { HomeContainerBorders } from "../home/shared-components";

export const AccountSettings = (): JSX.Element => {
  const { t } = useTranslation();
  const { sessionStore } = useMst();

  const [selectedTab, setSelectedTab] = useState<string>("profile");

  const renderOption = (value: string): JSX.Element => {
    return (
      <OptionContainer itemSelected={selectedTab == value} onClick={() => setSelectedTab(value)}>
        <OptionText>{t(`profile.${value}`)}</OptionText>
      </OptionContainer>
    );
  };

  const renderDisplayBox = (): JSX.Element => {
    switch (selectedTab) {
      case "reminders":
        return <div>Reminders Section</div>;
      case "meeting":
        return <div>Meeting Section</div>;
      case "users":
        return <div>Users Section</div>;
      case "company":
        return <div>Company Section</div>;
      default:
        return <AccountProfile />;
    }
  };

  return (
    <Container>
      <Header> {t("profile.accountSettings")}</Header>
      <SelectionContainer>
        <SelectionTabsContainer>
          {renderOption("profile")}
          {renderOption("reminders")}
          {renderOption("meeting")}
          {renderOption("users")}
          {renderOption("company")}
        </SelectionTabsContainer>
      </SelectionContainer>
      <DisplayBoxContainer>{renderDisplayBox()}</DisplayBoxContainer>
    </Container>
  );
};

const Container = styled.div``;

const Header = styled.p`
  font-size: 40pt;
  font-family: Exo;
  font-weight: 300;
  margin-top: 32px;
  margin-bottom: 48px;
`;

const SelectionContainer = styled.div`
  display: flex;
`;

const SelectionTabsContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
`;

type OptionContainerType = {
  itemSelected: boolean;
};

const OptionContainer = styled.div<OptionContainerType>`
  margin-left: 8px;
  margin-right: 8px;
  border-bottom: ${props => props.itemSelected && `3px solid ${props.theme.colors.primary100}`};
  &:hover {
    cursor: pointer;
  }
`;

const OptionText = styled(Text)`
  font-size: 20px;
  margin-bottom: 5px;
  padding-left: 4px;
  padding-right: 4px;
`;

const DisplayBoxContainer = styled(HomeContainerBorders)`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  margin-top: 10px;
`;