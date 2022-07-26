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
  const [selectedTab, setSelectedTab] = useState<string>("Profile");

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

  const navigation = [
    {
      header: "YOUR ACCOUNT",
      subHeaders: ["Profile", "Notifications", "Reset Password"],
    },
    {
      header: "COMPANY",
      subHeaders: ["General Settings", "Users", "Teams"],
    },
    {
      header: "FEATURES",
      subHeaders: ["Meeting", "Objectives", "Templates"],
    },
  ];

  return (
    <Container>
      <SideBar>
        {navigation.map(nav => (
          <Section>
            <SideBarHeader>{nav.header}</SideBarHeader>
            {nav.subHeaders.map(sub => (
              <SideBarSubHeader onClick={() => setSelectedTab(sub)} active={selectedTab == sub}>
                {sub}
              </SideBarSubHeader>
            ))}
          </Section>
        ))}
      </SideBar>
      <ContentContainer>{renderOptionComponent()}</ContentContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  margin-left: -40px;
  margin-top: -31px;
  margin-right: -40px;
  height: calc(100vh - 130px);
  display: flex;
`;

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

const SideBar = styled.div`
  width: 18%;
  max-width: 240px;
  background: ${props => props.theme.colors.backgroundGrey};
  height: 100%;
  padding: 32px;
  position: fixed;

  @media only screen and (min-width: 1600px) {
    left: 96px;
  }
`;
const SideBarHeader = styled(Text)`
  font-size: 16px;
  color: ${props => props.theme.colors.grey100};
  text-align: left-align;
  font-weight: bold;
  margin: 0;
  margin-bottom: 16px;
`;

type SideBarSubHeaderProps = {
  active: boolean;
};

const SideBarSubHeader = styled(Text)<SideBarSubHeaderProps>`
  font-size: 15px;
  color: ${props => (props.active ? props.theme.colors.primary100 : props.theme.colors.black)};
  margin: 0;
  margin-left: 16px;
  margin-bottom: 10px;
  font-weight: ${props => (props.active ? "bold" : "normal")};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.primary100};
    font-weight: bold;
  }
`;

const Section = styled.div`
  margin-bottom: 18px;
`;

const ContentContainer = styled.div`
  padding: 32px;
  width: 82%;
  max-width: 1280px;
  // overflow-y: auto;
  height: 100%;
  overscroll-behavior: contain;
  padding-left: 330px;
  @media only screen and (min-width: 1600px) {
    margin: 0 auto;
    padding-left: 200px;
  }
  @media only screen and (min-width: 1800px) {
    padding-left: 32px;
  }
`;
