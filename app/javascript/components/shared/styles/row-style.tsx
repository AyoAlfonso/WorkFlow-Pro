import * as React from "react";
import styled from "styled-components";
import { Heading } from "~/components/shared";

export const MonthContainer = styled.div`
  width: 315px;
  margin-top: auto;
  margin-bottom: auto;
`;

export const ColumnContainer = styled.div`
  width: 50%;
  min-width: 240px;
  margin-right: 16px;
`;

export const ColumnContainerCenterAligned = styled(ColumnContainer)`
  margin-top: auto;
  margin-bottom: auto;
`;

export const ForumSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 16px;
  height: 100px;
`;

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: lightgrey;
`;

export const ColumnContainerParent = styled.div`
  display: flex;
  width: 100%;
`;

const HeaderContainer = styled.div``;
export const HeaderText = ({ text }: { text: string }): JSX.Element => {
  return (
    <HeaderContainer>
      <Heading type={"h2"} fontSize={"20px"} fontWeight={600}>
        {text}
      </Heading>
    </HeaderContainer>
  );
};
