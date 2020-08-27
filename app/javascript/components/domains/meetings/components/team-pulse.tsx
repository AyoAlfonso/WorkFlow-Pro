import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "../../../shared/card";
import { Text } from "../../../shared/text";
import { Heading } from "../../../shared/heading";
import { useMst } from "~/setup/root";

export const TeamPulse = (): JSX.Element => {
  const { t } = useTranslation();
  // @TODO connect to meetingStore that fetches conversation starters
  // const { meetingStore } = useMst();

  // useEffect(() => {

  // }, [])

  return <Container>TEAM PULSE PAGE</Container>;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
