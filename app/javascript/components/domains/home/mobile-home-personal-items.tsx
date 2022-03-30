import * as React from "react";
import { useState } from "react";
import { useMst } from "../../../setup/root";
import styled from "styled-components";
import { ChevronDownIcon, Icon } from "~/components/shared";
import { baseTheme } from "~/themes";
import { KeyActivitiesBody } from "../key-activities/key-activities-body";

export const MobileHomePersonalItems = (): JSX.Element => {
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
