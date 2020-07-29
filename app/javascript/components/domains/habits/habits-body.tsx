import React, { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";

export const HabitsBody = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    habitStore,
    habitStore: { habits },
  } = useMst();
  useEffect(() => {
    habitStore.fetchHabits();
  }, habitStore.habits);
  return (
    <>
      <Container></Container>
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
