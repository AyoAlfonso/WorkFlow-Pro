import React from "react";
import styled from "styled-components";
import { baseTheme } from "~/themes/base";
import { typography, TypographyProps } from "styled-system";

export const HabitsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const HabitsTableHead = styled.thead``;

export const HabitsTableBody = styled.tbody``;

export const HabitsTableRow = styled.tr``;

type HabitsTableHeaderCellType = {
  width?: string;
};

export const HabitsTableHeaderCell = styled.th<HabitsTableHeaderCellType & TypographyProps>`
  ${typography}  
  color: ${baseTheme.colors.greyInactive};
  height: 25px;
  width: ${props => props.width};
`;

export const HabitsTableDataCell = styled.td<TypographyProps>`
  ${typography}
  height: 35px;
  text-align: center;
  :hover {
    cursor: pointer;
  }
`;
