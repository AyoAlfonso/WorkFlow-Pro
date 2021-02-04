import React, { useState } from "react";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import * as R from "ramda";
import { HomeContainerBorders } from "../domains/home/shared-components";

// INSTRUCTIONS TO USE:
// headerText is the header that you want to display on the component
// tabOptions are the different options on tabs that you want to generate, and the component it is associated with
// name would be the text you want to display on the tab
// component is the component that you want to show when the tab is clicked on

// an example of tabOptions
// const tabOptions = [
//   {
//     name: "profile",
//     component: <AccountProfile />
//   },
//   {
//     name: "notifications",
//     component: <Notifications />
//   },
//   {
//     name: "meeting",
//     component: <Meeting />
//   },
//   {
//     name: "users",
//     component: <Users />
//   },
//   {
//     name: "teams",
//     component: <Teams />
//   },
//   {
//     name: "company",
//     component: <Company />
//   },
//   {
//     name: "security",
//     component: <Security />
//   }
// ]

interface ITabsLayoutInterface {
  headerText: string;
  tabOptions: Array<{ name: string; component: JSX.Element }>;
}

export const TabsLayout = ({ headerText, tabOptions }: ITabsLayoutInterface): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<string>(R.path([0, "name"], tabOptions));

  const renderOptionComponent = (): JSX.Element => {
    const indexForTabOptions = tabOptions.findIndex(tab => tab.name == selectedTab);

    if (indexForTabOptions > -1) {
      return R.path([indexForTabOptions, "component"], tabOptions);
    } else {
      return <> Sorry we cannot find your page </>;
    }
  };

  const renderOptionHeaders = () => {
    return tabOptions.map((tab, index) => {
      const { name } = tab;
      return (
        <OptionContainer
          key={index}
          itemSelected={selectedTab == name}
          onClick={() => setSelectedTab(name)}
        >
          <OptionText>{name}</OptionText>
        </OptionContainer>
      );
    });
  };

  return (
    <Container>
      <Header> {headerText}</Header>
      <SelectionContainer>
        <SelectionTabsContainer>{renderOptionHeaders()}</SelectionTabsContainer>
      </SelectionContainer>
      <DisplayBoxContainer selectedTab={selectedTab}>{renderOptionComponent()}</DisplayBoxContainer>
    </Container>
  );
};

const Container = styled.div``;

const Header = styled.p`
  font-size: 24px;
  font-weight: 600;
  font-family: Exo;
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

type DisplayBoxContainerType = {
  selectedTab?: string;
};
const DisplayBoxContainer = styled(HomeContainerBorders)<DisplayBoxContainerType>`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  margin-top: 10px;
  min-width: ${props => (props.selectedTab == "company" ? "1200px" : "950px")};
`;
