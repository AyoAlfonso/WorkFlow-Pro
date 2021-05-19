import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Habits } from "../habits/habits-widget";
import { Issues } from "../issues/issues-container";
import { Journal } from "../journal/journal-widget";
import { HomeKeyActivities } from "./home-key-activities/home-key-activities";
import { useTranslation } from "react-i18next";
import { ToolsWrapper, ToolsHeader } from "~/components/shared/styles/overview-styles";

export const HomePersonalItems = (): JSX.Element => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string>("");
  const [questionnaireVariant, setQuestionnaireVariant] = useState<string>("");

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : "");
  };

  return (
    <Container>
      <HomeKeyActivities setQuestionnaireVariant={setQuestionnaireVariant} />
      <ToolsWrapper>
        <ToolsHeader type={"h2"}>{t("tools.title")}</ToolsHeader>
        <Journal
          expanded={expanded}
          handleChange={handleChange}
          questionnaireVariant={questionnaireVariant}
          setQuestionnaireVariant={setQuestionnaireVariant}
        />
        <Habits expanded={expanded} handleChange={handleChange} />
        <Issues expanded={expanded} handleChange={handleChange} />
      </ToolsWrapper>
    </Container>
  );
};

export const Container = styled.div`
  display: flex;
  height: inherit;
`;
