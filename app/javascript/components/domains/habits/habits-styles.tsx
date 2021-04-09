import React from "react";
import styled from "styled-components";
import { baseTheme } from "~/themes/base";
import { typography, TypographyProps } from "styled-system";

export const HabitsTable = styled.table`
  width: auto;
  border-collapse: collapse;
  display: block;
  overflow-y: auto;
  min-height: 120px;
  padding-left: 8px;
  padding-right: 8px;
}
`;

export const HabitsTableHead = styled.thead``;

export const HabitsTableBody = styled.tbody``;

type HabitsTableRowProps = {
  borderBottom?: string;
};
export const HabitsTableRow = styled.tr<HabitsTableRowProps>`
  border-bottom: ${props => props.borderBottom};
`;

type HabitsTableHeaderCellType = {
  width?: string;
};

export const HabitsTableHeaderCell = styled.th<HabitsTableHeaderCellType & TypographyProps>`
  ${typography}  
  color: ${baseTheme.colors.greyInactive};
  height: 25px;
  width: ${props => props.width};
  font-size: 12px;
`;

export const HabitsTableDataCell = styled.td<TypographyProps>`
  ${typography}
  height: 35px;
  padding-right: 15px;
  padding-top: 2px;
`;
