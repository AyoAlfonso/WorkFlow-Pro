import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Habits } from "../habits/habits-widget";
import { Issues } from "../issues/issues-container";
import { Journal } from "../journal/journal-widget";
import { HomeKeyActivities } from "./home-key-activities/home-key-activities";
import { useTranslation } from "react-i18next";
import { Heading } from "~/components/shared";

export const HomePersonalItems = (): JSX.Element => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string>("");

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : "");
  };

  return (
    <Container>
      <HomeKeyActivities />
      <ToolsWrapper>
        <ToolsHeader type={"h2"}>{t("tools.title")}</ToolsHeader>
        <Journal expanded={expanded} handleChange={handleChange} />
        <Habits expanded={expanded} handleChange={handleChange} />
        <Issues expanded={expanded} handleChange={handleChange} />
      </ToolsWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: inherit;
`;

const ToolsWrapper = styled.div`
  flex-direction: column;
  width: 25%;
  margin-left: 20px;
  margin-right: 5px;
  height: 100%;
`;

const ToolsHeader = styled(Heading)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  margin-bottom: 40px;
`;
