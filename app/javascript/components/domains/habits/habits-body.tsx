import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { HabitsHabitTracker } from "./habits-habit-tracker";
import { HabitsCreateHabitForm } from "./habits-create-habit-form";
import { color } from "styled-system";
import moment from "moment";
import { EditHabit } from "./edit-habit";
import { useTranslation } from "react-i18next";
import { AccordionDetails } from "~/components/shared/accordion-components";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";

import {
  HabitsTable,
  HabitsTableHead,
  HabitsTableBody,
  HabitsTableRow,
  HabitsTableHeaderCell,
} from "./habits-styles";
import { Icon, ModalWithHeader } from "~/components/shared";
import { baseTheme } from "~/themes";

interface IHabitsBodyProps {
  disabled?: boolean;
}

export const HabitsBody = observer(
  ({ disabled }: IHabitsBodyProps): JSX.Element => {
    const {
      habitStore,
      habitStore: { habits, lastFourDays, lastFewDays },
    } = useMst();
    const { t } = useTranslation();

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
    const [showHabitModal, setShowHabitModal] = useState<boolean>(false);

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
            showFourDays={!(windowDimensions.width > 300)}
          />
        </HabitsTableRow>
      ));

    const daysToRender = windowDimensions.width > 300 ? lastFewDays : lastFourDays;

    const dayNames = daysToRender.map((day, index) => (
      <TableHeader>{moment(day).format("ddd")}</TableHeader>
    ));

    const dayDates = daysToRender.map((day, index) => (
      <TableHeader key={index}>{moment(day).format("DD")}</TableHeader>
    ));

    return showIndividualHabit ? (
      <HomeContainerBorders>
        <EditHabit
          selectedHabitId={selectedHabitId}
          setSelectedHabitId={setSelectedHabitId}
          setShowIndividualHabit={setShowIndividualHabit}
        />
      </HomeContainerBorders>
    ) : (
      <Container disabled={disabled}>
        <AddNewHabitContainer onClick={() => setShowHabitModal(true)}>
          <AddNewHabitPlus>
            <Icon icon={"Plus"} size={16} iconColor={"primary100"} />
          </AddNewHabitPlus>
          <AddNewHabitText>{`Add Habit`}</AddNewHabitText>
        </AddNewHabitContainer>
        <AccordionDetailsContainer>
          <HabitsTable>
            <HabitsTableRow>
              <NameHeader />
              {dayNames}
            </HabitsTableRow>
            <HabitsTableRow>
              <NameHeader />
              {dayDates}
            </HabitsTableRow>
            {renderHabits()}
          </HabitsTable>
        </AccordionDetailsContainer>
        <ModalWithHeader
          modalOpen={showHabitModal}
          setModalOpen={setShowHabitModal}
          headerText={t<string>("profile.habits.new")}
          width={"90%"}
        >
          <HabitsCreateHabitForm onSubmit={() => setShowHabitModal(false)} />
        </ModalWithHeader>
      </Container>
    );
  },
);

type ContainerProps = {
  disabled?: boolean;
};

const Container = styled.div<ContainerProps>`
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
`;

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

  @media only screen and (max-width: 768px) {
    box-shadow: none;
  }
`;

const HabitsTableHeaderCellWide = styled(HabitsTableHeaderCell)`
  width: 100%;
`;

const AddNewHabitPlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey80};
`;

const AddNewHabitText = styled.p`
  ${color}
  font-size: 16px;
  margin-left: 21px;
  color: ${props => props.theme.colors.grey80};
  line-height: 20pt;

  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const AddNewHabitContainer = styled.div`
  display: none;
  align-items: center;
  cursor: pointer;
  margin-left: 8px;
  margin-right: 8px;
  padding-left: 4px;
  margin-top: 8px;

  @media only screen and (max-width: 768px) {
    display: flex;
  }
  &:hover ${AddNewHabitText} {
    color: ${props => props.theme.colors.primary100};
    font-weight: bold;
  }
  &:hover ${AddNewHabitPlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

const NameHeader = styled.th`
  width: 50%;
  text-align: left;
`;

const TableHeader = styled.th`
  text-align: center;
  width: 32px;
  font-size: 12px;
  color: ${baseTheme.colors.greyInactive};
`;
