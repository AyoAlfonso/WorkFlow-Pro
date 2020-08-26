import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "../../../shared/card";
import { Text } from "../../../shared/text";
import { Heading } from "../../../shared/heading";
import { useMst } from "~/setup/root";
import { useEffect } from "react";

export const MeetingGoals = (): JSX.Element => {
  const { meetingStore, goalStore } = useMst();
  const teamId = meetingStore.currentMeeting.teamId;

  useEffect(() => {
    goalStore.getTeamGoals(teamId);
  }, []);

  return <Container>MEETING GOALS PAGE</Container>;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HeadingDiv = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: flex-start;
`;

const BodyDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
