import * as React from "react";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import { CodeBlockDiv, ContainerDiv, PropsList } from "./shared";
import { Card as CardComponent, CardBody } from "../app/javascript/components/shared/card";
import { Text } from "../app/javascript/components/shared/text";

export default { title: "Card" };

export const Card = () => (
  <ContainerDiv>
    <h1>Card</h1>
    <CodeBlockDiv mb={"20px"}>
      <CopyBlock
        text={`
      import * as React from "react";
      import { Card, CardBody } from "../components/shared/card"

      const MyCardComponent = () => (
        <CardComponent width={"400px"} alignment={"left"} headerComponent={"Card Title"}>
          <CardBody height={"300px"}>
            ...
          </CardBody>
        </CardComponent>  
      )
      `}
        language={"tsx"}
        theme={atomOneLight}
      />
    </CodeBlockDiv>
    <PropsList propsList={propsList} styledSystemProps={["layout", "space"]} />
    <CardComponent width={"400px"} alignment={"left"} headerComponent={"Card Title"} mb={"20px"}>
      <CardBody height={"300px"}>
        <img
          src={
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjI0MX0&w=1000&q=80"
          }
          style={{ width: "370px", objectFit: "contain" }}
        />
        <Text fontSize={"12px"} mt={"15px"}>
          This is a card with an image
        </Text>
      </CardBody>
    </CardComponent>
    <CardComponent
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
    </CardComponent>
  </ContainerDiv>
);

const propsList = [
  {
    name: "alignment",
    type: "string",
    required: false,
    description: "can be one of:  left | center | right",
  },
  {
    name: "headerComponent",
    type: "string | component",
    required: false,
    description: "can be a string or a React Component",
  },
];
