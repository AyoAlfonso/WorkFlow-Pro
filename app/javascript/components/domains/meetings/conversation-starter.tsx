import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "../../shared/card";
import { Text } from "../../shared/text";
import { Heading } from "../../shared/heading";
import { useMst } from "~/setup/root";

export const ConversationStarter = (): JSX.Element => {
  const { t } = useTranslation();
  // @TODO connect to meetingStore that fetches conversation starters
  // const { meetingStore } = useMst();

  return (
    <Container>
      <HeadingDiv>
        <Heading type={"h3"} color={"black"} fontWeight={500} fontSize={3}>
          {t("meeting.conversationStarter")}
        </Heading>
      </HeadingDiv>
      <BodyDiv>
        <Card
          width={"640px"}
          alignment={"left"}
          headerComponent={
            <Text fontSize={"12px"} fontWeight={"bold"}>
              Today's Topic
            </Text>
          }
          my={"30px"}
        >
          <CardBody height={"120px"}>
            <Text fontFamily={"Exo"} fontSize={4} mt={"15px"} textAlign={"center"}>
              What's the most interesting thing you've done lately?
            </Text>
          </CardBody>
        </Card>
      </BodyDiv>
    </Container>
  );
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
