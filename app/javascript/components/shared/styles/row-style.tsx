import * as React from "react";
import styled from "styled-components";
import { Heading } from "~/components/shared";

export const MonthContainer = styled.div`
  width: 315px;
  margin-top: auto;
  margin-bottom: auto;
`;

type ColumnContainerType = {
  minWidth?: string;
  alignItems?: string;
};

export const ColumnContainer = styled.div<ColumnContainerType>`
  width: 50%;
  min-width: ${props => props.minWidth || "240px"};
  margin-right: 20px;
`;

export const ColumnSubHeaderContainer = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.grey100};
  margin-top: auto;
  margin-bottom: auto;
`;

export const ColumnContainerWithFixedImages = styled.div;

export const ColumnContainerCenterAligned = styled(ColumnContainer)`
  margin-top: auto;
  margin-bottom: auto;
`;

export const ForumSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
`;

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: lightgrey;
`;

export const ColumnContainerParent = styled.div<ColumnContainerType>`
  display: flex;
  min-width: ${props => props.minWidth || "480px"};
  width: 100%;
  align-items: ${props => props.alignItems || "stretch"};
`;

interface IHeaderType {
  text: string;
  width?: string;
}

const HeaderContainer = styled.div<IHeaderType>`
  width: ${props => props.width};
`;

export const HeaderText = ({ text, width }: IHeaderType): JSX.Element => {
  return (
    <HeaderContainer width={width}>
      <Heading type={"h2"} fontSize={"20px"} fontWeight={600} mt={0}>
        {text}
      </Heading>
    </HeaderContainer>
  );
};
