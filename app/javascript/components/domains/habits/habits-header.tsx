import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Icon, ModalWithHeader } from "~/components/shared";
import { HabitsCreateHabitForm } from "./habits-create-habit-form";
import { HeaderContainerNoBorder } from "~/components/shared/styles/container-header";
import { AccordionSummary } from '~/components/shared/accordion-components';

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
          <HeaderText
            expanded={expanded}
          > {t("habits.title")} </HeaderText>
        </HeaderContainerNoBorder>
        <IconContainer onClick={() => setHabitsModalOpen(true)}>
          <Icon iconColor={"grey60"} icon={"Plus"} paddingTop={"2px"} size={16} />
        </IconContainer>
      </AccordionSummary>
    </>
  );
};

type HeaderTextType = {
  expanded?: string;
};

export const HeaderText = styled.h4<HeaderTextType>`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 20px;
  font-size: 16px;
  font-weight: 600;
  color: ${props => 
    props.expanded === "panel1" ? props.theme.colors.black : props.theme.colors.grey60};
`;

const IconContainer = styled.div`
  padding-right: 10px;
  &:hover {
    cursor: pointer;
  }
`;
