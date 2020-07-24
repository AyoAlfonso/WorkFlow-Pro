import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Icon, ModalWithHeader } from "~/components/shared";
import { HabitsCreateHabitForm } from "./habits-create-habit-form";

export const HabitsHeader = (): JSX.Element => {
  const [habitsModalOpen, setHabitsModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  return (
    <>
      <Container>
        <HabitsText> {t("profile.habits.title")} </HabitsText>
        <IconContainer onClick={() => setHabitsModalOpen(true)}>
          <Icon iconColor={"primary100"} icon={"Plus"} paddingTop={"2px"} size={16} />
        </IconContainer>
      </Container>
      <ModalWithHeader
        modalOpen={habitsModalOpen}
        setModalOpen={setHabitsModalOpen}
        headerText={t("profile.habits.title")}
        width={"35rem"}
      >
        <HabitsCreateHabitForm onSubmit={() => setHabitsModalOpen(false)} />
      </ModalWithHeader>
    </>
  );
};

const Container = styled.div`
  align-items: center;
  border-bottom: 1px solid #e3e3e3;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
`;

const IconContainer = styled.div`
  padding-right: 10px;
`;

const HabitsText = styled.h4`
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 20px;
  font-size: 14pt;
  font-weight: 400;
`;
