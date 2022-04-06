import * as React from "react";
import { useState } from "react";
import { useMst } from "../../../setup/root";
import styled from "styled-components";
import { ChevronDownIcon, Icon } from "~/components/shared";
import { baseTheme } from "~/themes";
import { KeyActivitiesBody } from "../key-activities/key-activities-body";

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
        return <MobileKeyActivitiesBody />;
      case 1:
        return (
          <MobileIssuesBody
            showOpenIssues={showOpenIssues}
            setShowOpenIssues={setShowOpenIssues}
            noShadow
          />
        );
      case 2:
        return (
          <Journal
            expanded={expanded}
            handleChange={handleChange}
            questionnaireVariant={questionnaireVariant}
            setQuestionnaireVariant={setQuestionnaireVariant}
          />
        );
      case 3:
        return <HabitsBody />;
      default:
        return <MobileKeyActivitiesBody />;
    }
  };

  return (
    <Container>
      <HeaderContainer>
        <Icon
          icon={"Chevron-Left"}
          mr={"auto"}
          size={"14px"}
        iconColor={baseTheme.colors.greyActive}
        />
        <HeaderText>
          Todos
          <Icon
            icon={"Chevron-Down"}
            mt={"0.5em"}
            size={"16px"}
            iconColor={baseTheme.colors.primary80}
          />
        </HeaderText>
        <RightIcon
          icon={"Chevron-Left"}
          ml={"auto"}
          size={"14px"}
          iconColor={baseTheme.colors.greyActive}
        />
      </HeaderContainer>
      <KeyActivitiesBody showAllKeyActivities={false} />
    </Container>
  );
};

const Container = styled.div`
  display: none;
  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1em 1em 1em;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`;

const HeaderText = styled.span`
  font-size: 1.5em;
  font-weight: bold;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const RightIcon = styled(Icon)`
  transform: rotate(180deg);
`;
