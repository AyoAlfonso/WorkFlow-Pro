import React, { useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import {
  HabitsTable,
  HabitsTableHead,
  HabitsTableBody,
  HabitsTableRow,
  HabitsTableHeaderCell,
} from "./habits-styles";
import { Habits } from "./habits";

export const HabitsSummary = observer(
  (): JSX.Element => {
    const {
      companyStore,
    } = useMst();

    useEffect(() => {
      companyStore.load();
    }, [companyStore.company]);

    const titleElements = ["Score", "Week", "Total"].map((title, index) => (
      <HabitsTableHeaderCell fontWeight={"normal"} key={index} width={"12%"}>
        {title}
      </HabitsTableHeaderCell>
    ));

    const monthTitleElements = ["Score", "Month", "Total"].map((title, index) => (
      <HabitsTableHeaderCell fontWeight={"normal"} key={index} width={"12%"}>
        {title}
      </HabitsTableHeaderCell>
    ));
    
    return (
      <HabitsTable>
        <HabitsTableHead>
          <HabitsTableRow>
            <HabitsTableHeaderCell />
            <HabitsTableHeaderCellWide />
            {companyStore.company.displayFormat === "Company" ? (titleElements) : (monthTitleElements)}
          </HabitsTableRow>
        </HabitsTableHead>
        <HabitsTableBody>
          <Habits />
        </HabitsTableBody>
      </HabitsTable>
    );
  },
);

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  margin-top: 4px;
  margin-bottom: 4px;
  background-color: lightgrey;
`;

const HabitsTableHeaderCellWide = styled(HabitsTableHeaderCell)`
  width: 65%;
`;
