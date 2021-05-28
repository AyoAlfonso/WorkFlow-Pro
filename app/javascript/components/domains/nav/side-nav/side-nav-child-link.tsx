import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const SideNavChildLinkNavLink = styled(NavLink)`
  font-size: 16px;
  text-decoration: none;
  color: ${props => props.theme.colors.white};
  &:hover {
    background-color: ${props => props.theme.colors.primary80};
  }
`;

export const SideNavChildLinkContainer = styled.div`
  align-items: center;
  min-height: 24px;
  padding-left: 20px;
  display: flex;
  word-break: break-word;
  overflow-wrap: break-word;
`;

export const SideNavChildLinkText = styled.p`
  flex: 1;
  margin: 0;
`;

export interface ISideNavChildLinkProps {
  to: string;
  linkText: string;
  onClick?: any;
}
export const SideNavChildLink = ({
  to,
  linkText,
  onClick,
}: ISideNavChildLinkProps): JSX.Element => (
  <SideNavChildLinkNavLink
    to={to}
    onClick={() => {
      onClick && onClick();
    }}
  >
    <SideNavChildLinkContainer>
      <SideNavChildLinkText>{linkText}</SideNavChildLinkText>
    </SideNavChildLinkContainer>
  </SideNavChildLinkNavLink>
);
