import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const SideNavChildLinkNavLink = styled(NavLink)`
  border-radius: 8px;
  text-decoration: none;
  &:link,
  &:visited {
    color: ${props => props.theme.colors.greyActive};
  }
  &:hover {
    color: ${props => props.theme.colors.primaryActive};
    background-color: ${props => props.theme.colors.primary20};
  }
`;

export const SideNavChildLinkContainer = styled.div`
  align-items: center;
  height: 40px;
  padding-left: 20px;
  width: 250px;
  display: flex;
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
