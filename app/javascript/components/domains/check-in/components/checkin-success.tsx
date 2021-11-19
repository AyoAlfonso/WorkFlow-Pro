import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import styled, { keyframes } from "styled-components";
import { CheckMark } from "./checkmark/check-mark";
import { Text } from "~/components/shared/text";
import { Button } from "~/components/shared/button";
import { getWeekOf } from "~/utils/date-time";

export const CheckInSuccess = observer((): JSX.Element => {
  const { sessionStore } = useMst();
  const id = sessionStore.profile.id;

  const history = useHistory();

  useEffect(() => {
    const redirectToHome = () => {
      const width = window.innerWidth > 768;
      if (width) {
        setTimeout(() => {
          history.push('/')
        }, 3000)
      }
    }
    redirectToHome();
  }, [])

  return (
    <Container>
      <CheckMark />
      <HeaderText>Published!</HeaderText>
      <InfoText>Your updates have been saved.</InfoText>
      <RestartButton
        variant={"primary"}
        small
        disabled={false}
        onClick={() => history.push(`/weekly-check-in/${id}/${getWeekOf()}`)}
      >
        Restart Check-in
      </RestartButton>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const easeinAnimation = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
`;

const HeaderText = styled.h1`
  font-size: 50px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 40px;
  animation: 1s ease-out 0s 1 ${easeinAnimation};
  @media only screen and (max-width: 768px) {
    font-size: 40px;
    margin-bottom: 25px;
  }
`;

const InfoText = styled(Text)`
  font-size: 25px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 40px;
  color: ${props => props.theme.colors.grey80};
  animation: 1s ease-out 0s 1 ${easeinAnimation};
  @media only screen and (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 25px;
  }
`;

const RestartButton = styled(Button)`
  font-size: 12px;
  display: none;
  @media only screen and (max-width: 768px) {
    display: block;
    animation: 1s ease-out 0s 1 ${easeinAnimation};
  }
`;