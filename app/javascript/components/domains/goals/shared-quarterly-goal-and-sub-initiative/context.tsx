import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/shared/button";
import ContentEditable from "react-contenteditable";
import { GoalDropdownOptions } from "../shared/goal-dropdown-options";
import { UserIconBorder } from "../shared/user-icon-border";
import { SubHeaderText } from "~/components/shared";
import { ContextTabs } from "../shared/context-tabs";
import { OwnedBySection } from "../shared/owned-by-section";

interface IContextProps {
  itemType: string;
  item: any;
}

export const Context = ({ itemType, item }: IContextProps): JSX.Element => {
  const startedMilestones = item.milestones.filter(milestone => milestone.status != "unstarted");

  let userIconBorder = "";

  if (startedMilestones.length > 0) {
    const lastStartedMilestone = startedMilestones[startedMilestones.length - 1];
    userIconBorder = UserIconBorder(lastStartedMilestone.status);
  }

  return (
    <Container>
      <ContextSectionContainer>
        <SubHeaderContainer>
          <SubHeaderText text={"Context"} />
        </SubHeaderContainer>
        <ContextTabs object={item} type={"item"} />
      </ContextSectionContainer>
      <OwnedBySection userIconBorder={userIconBorder} ownedBy={item.ownedBy} type={itemType} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const SubHeaderContainer = styled.div`
  display: flex;
`;

const ContextSectionContainer = styled.div`
  width: 90%;
`;
