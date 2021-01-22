import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Icon, ModalWithHeader } from "~/components/shared";
import { HabitsCreateHabitForm } from "./habits-create-habit-form";
import { 
  HeaderText, 
  ToolsHeaderContainer,
} from "~/components/shared/styles/container-header";
import { AccordionSummary } from '~/components/shared/accordion';

interface IHabitsHeaderProps {
  expanded: string | false;
}

export const HabitsHeader = ({ expanded }: IHabitsHeaderProps): JSX.Element => {
  const [habitsModalOpen, setHabitsModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  return (
    <>
      <ModalWithHeader
        modalOpen={habitsModalOpen}
        setModalOpen={setHabitsModalOpen}
        headerText={t("profile.habits.new")}
        width={"35rem"}
      >
        <HabitsCreateHabitForm onSubmit={() => setHabitsModalOpen(false)} />
      </ModalWithHeader>
      <AccordionSummary>
        <ToolsHeaderContainer>
          <Icon
            icon={expanded === "panel1" ? "Chevron-Up" : "Chevron-Down"}
            size={15}
            style={{ paddingRight: "15px" }}
            iconColor={expanded === "panel1" ? "primary100" : "grey60" }
          />
          <HeaderText> {t("habits.title")} </HeaderText>
        </ToolsHeaderContainer>
        <IconContainer onClick={() => setHabitsModalOpen(true)}>
          <Icon iconColor={"grey60"} icon={"Plus"} paddingTop={"2px"} size={16} />
        </IconContainer>
      </AccordionSummary>
    </>
  );
};

const IconContainer = styled.div`
  padding-right: 10px;
  &:hover {
    cursor: pointer;
  }
`;
