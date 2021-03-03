import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Habits } from "../habits/habits-widget";
import { Issues } from "../issues/issues-container";
import { Journal } from "../journal/journal-widget";
import { HomeKeyActivities } from "./home-key-activities/home-key-activities";

export const HomePersonalItems = (): JSX.Element => {
  const [expanded, setExpanded] = useState<string>("");

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : "");
  };

  return (
    <Container>
      <HomeKeyActivities />
      <ToolsWrapper>
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
  margin-left: auto;
  margin-right: 5px;
`;
