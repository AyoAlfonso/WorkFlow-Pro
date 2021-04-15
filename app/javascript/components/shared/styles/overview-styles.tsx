import styled from "styled-components";
import { Accordion } from "~/components/shared/accordion-components";
import { Heading } from "~/components/shared";
import { NavLink } from "react-router-dom";

export const StyledOverviewAccordion = styled(Accordion)`
  width: 100%;
  min-width: 224px;
  display: flex;
  flex-direction: column;
`;

export const ToolsWrapper = styled.div`
  flex-direction: column;
  width: 25%;
  margin-left: 20px;
  margin-right: 5px;
  height: 100%;
`;

export const ToolsHeader = styled(Heading)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  margin-bottom: 40px;
`;

export const OverviewTabs = styled(NavLink)`
  margin-bottom: 0;
  padding-bottom: 8px;
  margin-right: 20px;
  margin-left: 16px;
  margin-right-16px;
  color: black;
  font-family: Exo;
  font-size: 26px;
  line-height: 28px;
  font-weight: bold;
  &:visited {
    color: ${props => props.theme.colors.black};
  }
  text-decoration: none;
  border-bottom-width: 0px;
  border-bottom-color: ${props => props.theme.colors.primary100};
  border-bottom-style: solid;
`;

export const OverviewTabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  margin-right: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`;
