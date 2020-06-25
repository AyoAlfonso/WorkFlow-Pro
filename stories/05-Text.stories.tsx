import * as React from "react";
import TextComponent from "../app/javascript/components/shared/Text";
import HeadingComponent from "../app/javascript/components/shared/Heading";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import { CodeBlockDiv, ContainerDiv, Divider, PropsList } from "./shared";

export default { title: "Text Components" };

export const Text = () => (
  <ContainerDiv pl={4}>
    <h1>Text</h1>
    <PropsList styledSystemProps={["color", "layout", "space"]} />
    <CodeBlockDiv mt={4}>
      <CopyBlock
        text={`<Text color={"text"} fontSize={4}>This is a paragraph element</Text>`}
        language={"tsx"}
        theme={atomOneLight}
      />
    </CodeBlockDiv>
    <TextComponent color={"text"} fontSize={4}>
      This is a paragraph element
    </TextComponent>
    <Divider />
    <CodeBlockDiv mt={4}>
      <CopyBlock
        text={`
    <Text color={"primary100"} fontSize={2} fontWeight={'bold'} letterSpacing='0.5em'>
      This is a paragraph element
    </Text>
        `}
        language={"tsx"}
        theme={atomOneLight}
      />
    </CodeBlockDiv>
    <TextComponent color={"primary100"} fontSize={2} fontWeight={"bold"} letterSpacing="0.5em">
      This is a paragraph element
    </TextComponent>
  </ContainerDiv>
);

const headingPropsList = [
  { name: "type", type: "string", required: true, description: "The type of heading (h1 - h6)" },
];

export const Heading = () => (
  <ContainerDiv pl={4}>
    <h1>Heading</h1>
    <PropsList propsList={headingPropsList} styledSystemProps={["color", "layout", "space"]} />
    <CodeBlockDiv mt={4}>
      <CopyBlock
        text={`
    <Heading type={"h1"} color={"primary100"} fontSize={6}>
      This is an h1 element
    </Heading>`}
        language={"tsx"}
        theme={atomOneLight}
      />
    </CodeBlockDiv>
    <HeadingComponent type={"h1"} color={"primary100"} fontSize={6}>
      This is an h1 element
    </HeadingComponent>
    <Divider />
    <CodeBlockDiv mt={4}>
      <CopyBlock
        text={`
    <Heading type={"h4"} color={"warningRed"} fontSize={3} letterSpacing="0.3em">
      This is an h4 element
    </Heading>`}
        language={"tsx"}
        theme={atomOneLight}
      />
    </CodeBlockDiv>
    <HeadingComponent type={"h4"} color={"warningRed"} fontSize={3} letterSpacing="0.3em">
      This is an h4 element
    </HeadingComponent>
  </ContainerDiv>
);
