import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { HabitsHabitTracker } from "./habits-habit-tracker";
import * as moment from "moment";
import { EditHabit } from "./edit-habit";
import { AccordionDetails } from "~/components/shared/accordion-components";

import {
  HabitsTable,
  HabitsTableHead,
  HabitsTableBody,
  HabitsTableRow,
  HabitsTableHeaderCell,
} from "./habits-styles";

export const HabitsBody = observer(
  (): JSX.Element => {
    const {
      habitStore,
      habitStore: { habits, lastFourDays, lastFiveDays },
    } = useMst();

    useEffect(() => {
      habitStore.fetchHabits();
    }, [habitStore.habits]);

    const getWindowDimensions = () => {
      const { innerWidth: width, innerHeight: height } = window;
      return {
        width,
        height,
      };
    };

    const [showIndividualHabit, setShowIndividualHabit] = useState<boolean>(false);
    const [selectedHabitId, setSelectedHabitId] = useState<number>(null);
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const renderHabits = () =>
      habits.map((habit, index) => (
        <HabitsTableRow key={`${habit.id}-${index}`}>
          <HabitsHabitTracker
            habit={habit}
            onUpdate={(habitId, logDate) => habitStore.updateHabitLog(habitId, logDate)}
            setShowIndividualHabit={setShowIndividualHabit}
            setSelectedHabitId={setSelectedHabitId}
            showFourDays={!(windowDimensions.width > 1500)}
          />
        </HabitsTableRow>
      ));

    const daysToRender = windowDimensions.width > 1500 ? lastFiveDays : lastFourDays;
    
    const dayNames = daysToRender.map((day, index) => (
      <HabitsTableHeaderCell fontWeight={"normal"} key={index} width={"12%"}>
        {moment(day).format("ddd")}
      </HabitsTableHeaderCell>
    ));

    const dayDates = daysToRender.map((day, index) => (
      <HabitsTableHeaderCell key={index}>{moment(day).format("DD")}</HabitsTableHeaderCell>
    ));

    return showIndividualHabit ? (
      <EditHabit
        selectedHabitId={selectedHabitId}
        setSelectedHabitId={setSelectedHabitId}
        setShowIndividualHabit={setShowIndividualHabit}
      />
    ) : (
      <AccordionDetailsContainer>
        <HabitsTable>
          <HabitsTableHead>
            <HabitsTableRow>
              <HabitsTableHeaderCell />
              <HabitsTableHeaderCellWide />
              {dayNames}
            </HabitsTableRow>
            <HabitsTableRow>
              <HabitsTableHeaderCell />
              <HabitsTableHeaderCellWide />
              {dayDates}
            </HabitsTableRow>
          </HabitsTableHead>
          <HabitsTableBody>{renderHabits()}</HabitsTableBody>
        </HabitsTable>
      </AccordionDetailsContainer>
    );
  },
);

const AccordionDetailsContainer = styled(AccordionDetails)`
  border-radius: 10px;
  border: 0px solid white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  margin-bottom: 5px;
  min-width: 224px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;
  margin-bottom: 8px;
`;

const HabitsTableHeaderCellWide = styled(HabitsTableHeaderCell)`
  width: 40%;
`;
