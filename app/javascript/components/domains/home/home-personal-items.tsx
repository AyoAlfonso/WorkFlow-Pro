import * as React from "react";
import { useState } from "react";
import { useMst } from "../../../setup/root";
import styled from "styled-components";
import { Habits } from "../habits/habits-widget";
import { Loading } from "../../shared/loading";
import { Issues } from "../issues/issues-container";
import { Journal } from "../journal/journal-widget";
import { HomeKeyActivities } from "./home-key-activities/home-key-activities";
import { useTranslation } from "react-i18next";
import { ToolsWrapper, ToolsHeader } from "~/components/shared/styles/overview-styles";
import { LynchPynBadge } from "../meetings-forum/components/lynchpyn-badge";

export const HomePersonalItems = (): JSX.Element => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string>("");

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : "");
  };
  const {
      companyStore: { company },
  } = useMst();

  const instanceType = company && company.accessForum ? "forum" : "teams";
  
  return (
    <Container>

      <HomeKeyActivities />
      <ToolsWrapper>
        <ToolsHeader type={"h2"}>{t("tools.title")}</ToolsHeader>
        <Journal expanded={expanded} handleChange={handleChange} />
        <Habits expanded={expanded} handleChange={handleChange} />
        <Issues expanded={expanded} handleChange={handleChange} />
      </ToolsWrapper>
      {instanceType === "forum" && (
          <LynchPynBadge/> )}
    </Container>
  );
};

export const Container = styled.div`
  display: flex;
  height: inherit;
`;
