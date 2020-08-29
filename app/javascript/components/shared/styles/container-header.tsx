import * as React from "react";
import styled from "styled-components";

export interface IContainerHeaderProps {
  text: string;
}
export const ContainerHeaderWithText = ({ text }: IContainerHeaderProps): JSX.Element => (
  <HeaderContainer>
    <HeaderText> {text} </HeaderText>
  </HeaderContainer>
);

export const HeaderContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  padding-left: 10px;
  padding-right: 10px;
`;

export const HeaderText = styled.h4`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 20px;
  font-size: 13pt;
  font-weight: 600;
`;
