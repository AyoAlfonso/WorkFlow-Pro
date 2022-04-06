import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useMst } from "../../../setup/root";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import { baseTheme } from "~/themes";
import { MobileKeyActivitiesBody } from "../key-activities/mobile-key-activities-body";
import { MobileIssuesBody } from "../issues/mobile-issues-body";
import { HabitsBody } from "../habits";
import { Journal } from "../journal/journal-widget";

export const MobileHomePersonalItems = (): JSX.Element => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);
  const [questionnaireVariant, setQuestionnaireVariant] = useState<string>("");
  const [expanded, setExpanded] = useState<string>("panel0");
  const [showNavOptions, setShowNavOptions] = useState<boolean>(false);

  const navRef = useRef<HTMLDivElement>(null);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : "");
  };

  useEffect(() => {
    const externalEventHandler = e => {
      if (!showNavOptions) return;

      const node = navRef.current;

      if (node && node.contains(e.target)) {
        return;
      }
      setShowNavOptions(false);
    };

    if (showNavOptions) {
      document.addEventListener("click", externalEventHandler);
    } else {
      document.removeEventListener("click", externalEventHandler);
    }

    return () => {
      document.removeEventListener("click", externalEventHandler);
    };
  }, [showNavOptions]);

  const headerTextString = () => {
    switch (currentTab) {
      case 0:
        return "ToDos";
      case 1:
        return "Issues";
      case 2:
        return "Journal";
      case 3:
        return "Habits";
      default:
        return "ToDos";
    }
  };

  const renderComponent = () => {
    switch (currentTab) {
      case 0:
        return (
          <ComponentContainer active={currentTab == 0} >
            <MobileKeyActivitiesBody />
          </ComponentContainer>
        );
      case 1:
        return (
          <ComponentContainer active={currentTab == 1} >
            <MobileIssuesBody
              showOpenIssues={showOpenIssues}
              setShowOpenIssues={setShowOpenIssues}
              noShadow
            />
          </ComponentContainer>
        );
      case 2:
        return (
          <ComponentContainer active={currentTab == 2}>
            <Journal
              expanded={expanded}
              handleChange={handleChange}
              questionnaireVariant={questionnaireVariant}
              setQuestionnaireVariant={setQuestionnaireVariant}
            />
          </ComponentContainer>
        );
      case 3:
        return (
          <ComponentContainer active={currentTab == 3} >
            <HabitsBody />
          </ComponentContainer>
        );
      default:
        return (
          <ComponentContainer active={currentTab == 0} >
            <MobileKeyActivitiesBody />
          </ComponentContainer>
        );
    }
  };

  return (
    <Container>
      <HeaderContainer>
        <IconContainer
          mr="auto"
          disabled={currentTab === 0}
          onClick={() => setCurrentTab(currentTab - 1)}
        >
          <Icon
            icon={"Chevron-Left"}
            size={"14px"}
            iconColor={
              currentTab === 0 ? baseTheme.colors.greyInactive : baseTheme.colors.greyActive
            }
          />
        </IconContainer>
        <HeaderText>
          {headerTextString()}
          <NavContainer ref={navRef}>
            <IconContainer mt={"0.5em"} onClick={() => setShowNavOptions(!showNavOptions)}>
              <Icon icon={"Chevron-Down"} size={"16px"} iconColor={baseTheme.colors.primary80} />
            </IconContainer>
            {showNavOptions && (
              <NavigationDropDown>
                <NavigationDropDownItem
                  onClick={() => {
                    setCurrentTab(0);
                    setShowNavOptions(false);
                  }}
                >
                  ToDos
                </NavigationDropDownItem>
                <NavigationDropDownItem
                  onClick={() => {
                    setCurrentTab(1);
                    setShowNavOptions(false);
                  }}
                >
                  Issues
                </NavigationDropDownItem>
                <NavigationDropDownItem
                  onClick={() => {
                    setCurrentTab(2);
                    setShowNavOptions(false);
                  }}
                >
                  Journal
                </NavigationDropDownItem>
                <NavigationDropDownItem
                  onClick={() => {
                    setCurrentTab(3);
                    setShowNavOptions(false);
                  }}
                >
                  Habits
                </NavigationDropDownItem>
              </NavigationDropDown>
            )}
          </NavContainer>
        </HeaderText>
        <IconContainer
          ml="auto"
          disabled={currentTab === 3}
          onClick={() => setCurrentTab(currentTab + 1)}
        >
          <RightIcon
            icon={"Chevron-Left"}
            size={"14px"}
            iconColor={
              currentTab === 3 ? baseTheme.colors.greyInactive : baseTheme.colors.greyActive
            }
          />
        </IconContainer>
      </HeaderContainer>
      {renderComponent()}
    </Container>
  );
};

const Container = styled.div`
  display: none;
  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

type ComponentContainerProps = {
  active?: boolean;
}

const ComponentContainer = styled.div<ComponentContainerProps>`
  transition: 0.3s;

  display: ${props => (props.active ? "block" : "none")};
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5em 1em;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  border-top: 1px solid ${props => props.theme.colors.borderGrey};
`;

const HeaderText = styled.span`
  font-size: 1.5em;
  font-weight: bold;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RightIcon = styled(Icon)`
  transform: rotate(180deg);
`;

type IconContainerProps = {
  disabled?: boolean;
  mr?: string;
  ml?: string;
  mt?: string;
};

const IconContainer = styled.div<IconContainerProps>`
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
  margin-right: ${props => (props.mr ? props.mr : "")};
  margin-left: ${props => (props.ml ? props.ml : "")};
  margin-top: ${props => (props.mt ? props.mt : "")};
`;

const NavigationDropDown = styled.div`
  position: absolute;
  background: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  padding: 0.5em 0;
  z-index: 5;
  border-radius: 0.625em;
  width: 10em;
  right: -5em;
`;

const NavigationDropDownItem = styled.span`
  font-size: 14px;
  display: block;
  padding: 0.5em 1em;
  &:hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;

const NavContainer = styled.div`
  position: relative;
`;
