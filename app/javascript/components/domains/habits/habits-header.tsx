import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Icon, ModalWithHeader } from "~/components/shared";
import { HabitsCreateHabitForm } from "./habits-create-habit-form";
import { AccordionSummary } from '~/components/shared/accordion-components';
import { IconContainerWithPadding } from "~/components/shared/icon";
import { 
  HeaderContainerNoBorder,
  AccordionHeaderText,
} from "~/components/shared/styles/container-header";

interface IHabitsHeaderProps {
  expanded: string;
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
        <HeaderContainerNoBorder>
          <Icon
            icon={expanded === "panel1" ? "Chevron-Up" : "Chevron-Down"}
            size={15}
            style={{ paddingRight: "15px" }}
            iconColor={expanded === "panel1" ? "primary100" : "grey60" }
          />
          <AccordionHeaderText
            expanded={expanded}
            accordionPanel={"panel1"}
          > {t("habits.title")} </AccordionHeaderText>
        </HeaderContainerNoBorder>
        <IconContainerWithPadding 
          onClick={(e) => {
            e.stopPropagation(); 
            setHabitsModalOpen(true);
          }}
        >
          <Icon iconColor={"grey60"} icon={"Plus"} paddingTop={"2px"} size={16} />
        </IconContainerWithPadding>
      </AccordionSummary>
    </>
  );
};
