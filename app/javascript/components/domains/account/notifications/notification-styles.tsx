import styled from "styled-components";
import {
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
} from "styled-system";
import { Text } from "~/components/shared";

export const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const NotificationTableRowContainer = styled.div<ColorProps & SpaceProps>`
  ${color}
  ${space}
  display: flex;
  height: 50px;
  width: 100%;
  padding: 0 16px 0 16px;
  align-items: center;
`;

export const NotificationTableRowColumn = styled.div<FlexboxProps & LayoutProps & SpaceProps>`
  ${flexbox}
  ${layout}
  ${space}
  display: flex;
`;

export const NotificationTableHeaderContainer = styled.div`
  ${color}
  width: 100%;
  height: 50px;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`;

export const Option = styled.div`
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  &:hover {
    background-color: ${props => props.theme.colors.primary100};
  }
`;

export const NotificationEditTableColumn = styled.div<FlexboxProps & LayoutProps & SpaceProps>`
  ${flexbox}
  ${layout}
  ${space}
  display: flex;
  flex-direction: row;
`;

export const TableHeader = styled(Text)`
  font-weight: bold;
  color: ${props => props.theme.colors.grey100};
`;
