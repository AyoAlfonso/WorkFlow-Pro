import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Icon, ModalWithHeader } from "~/components/shared";
import { HabitsCreateHabitForm } from "./habits-create-habit-form";
import { HeaderText } from "~/components/shared/styles/container-header";
import { AccordionSummary } from '~/components/shared/accordion';

interface IHabitsHeaderProps {
  expanded: string | false;
}

export const HabitsHeader = ({ expanded }: IHabitsHeaderProps): JSX.Element => {
  const [habitsModalOpen, setHabitsModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  return (
    <>
      <HabitsHeaderContainer>
        <Icon
          icon={expanded === "panel1" ? "Chevron-Up" : "Chevron-Down"}
          size={15}
          style={{ paddingRight: "15px" }}
        />
        <HeaderText> {t("habits.title")} </HeaderText>
        <IconContainer onClick={() => setHabitsModalOpen(true)}>
          <Icon iconColor={"primary100"} icon={"Plus"} paddingTop={"2px"} size={16} />
        </IconContainer>
      </HabitsHeaderContainer>
      <ModalWithHeader
        modalOpen={habitsModalOpen}
        setModalOpen={setHabitsModalOpen}
        headerText={t("profile.habits.new")}
        width={"35rem"}
      >
        <HabitsCreateHabitForm onSubmit={() => setHabitsModalOpen(false)} />
      </ModalWithHeader>
    </>
  );
};

const HabitsHeaderContainer = styled(AccordionSummary)`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  padding-left: 10px;
  padding-right: 10px;
  justify-content: space-between;
  border-bottom: 0;
  align-items: center;

  border-radius: 10px;
  border: 0px solid white;
  margin-top: 5px;
  margin-bottom: 5px;
  min-width: 224px;
  width: 100%;
  flex-direction: column;
`;

const IconContainer = styled.div`
  padding-right: 10px;
  &:hover {
    cursor: pointer;
  }
`;
