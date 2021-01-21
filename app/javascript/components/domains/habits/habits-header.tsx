import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Icon, ModalWithHeader } from "~/components/shared";
import { HabitsCreateHabitForm } from "./habits-create-habit-form";
import { ToolsHeaderContainer, HeaderText } from "~/components/shared/styles/container-header";

interface IHabitsHeaderProps {
  expanded: string | false;
}

export const HabitsHeader = ({ expanded }: IHabitsHeaderProps): JSX.Element => {
  const [habitsModalOpen, setHabitsModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  return (
    <>
      <Container>
        <Icon
          icon={expanded === "panel1" ? "Chevron-Up" : "Chevron-Down"}
          size={15}
          style={{ paddingRight: "15px" }}
        />
        <HeaderText> {t("habits.title")} </HeaderText>
        <IconContainer onClick={() => setHabitsModalOpen(true)}>
          <Icon iconColor={"primary100"} icon={"Plus"} paddingTop={"2px"} size={16} />
        </IconContainer>
      </Container>
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

const Container = styled(ToolsHeaderContainer)`
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  padding-right: 10px;
  &:hover {
    cursor: pointer;
  }
`;
