import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "../../../shared/card";
import { Text } from "../../../shared/text";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { toJS } from "mobx";

export const ConversationStarter = observer(
  (): JSX.Element => {
    const { t } = useTranslation();
    const { sessionStore } = useMst();
    const convoStarters = toJS(sessionStore.staticData.conversationStarters);
    const randomConvoStarter =
      convoStarters.length > 0
        ? convoStarters[(convoStarters.length * Math.random()) | 0]
        : { body: "What's the most interesting thing you've done lately?" };

    return (
      <Container>
        <BodyDiv>
          <Card
            width={"640px"}
            alignment={"left"}
            headerComponent={
              <Text fontSize={"12px"} fontWeight={"bold"}>
                Today's Topic
              </Text>
            }
            mr={"auto"}
            ml={"15px"}
          >
            <CardBody height={"120px"}>
              <Text fontFamily={"Exo"} fontSize={4} mt={"15px"} textAlign={"center"}>
                {randomConvoStarter.body}
              </Text>
            </CardBody>
          </Card>
        </BodyDiv>
      </Container>
    );
  },
);

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
