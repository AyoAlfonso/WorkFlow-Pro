import * as React from "react";
import { action } from "@storybook/addon-actions";
import { Button } from "../app/javascript/components/shared/Button";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import styled from "styled-components";
import { space } from "styled-system";
import { CodeBlockDiv, ContainerDiv, Divider, PropsList, RowDiv } from "./shared";

export default { title: "Button" };

const actionFn = action("Button was clicked!");

const ButtonDiv = styled.div`
  ${space}
`;

const propsList = [
  {
    name: "variant",
    type: "string",
    required: true,
    description: "must be one of: primary | primaryOutline | redOutline",
  },
  {
    name: "onClick",
    type: "function",
    required: true,
    description: "on click action",
  },
  {
    name: "disabled",
    type: "boolean",
    required: false,
    description: "optional prop to change to disabled color and change onClick action to null",
  },
  {
    name: "small",
    type: "boolean",
    required: false,
    description: "optional prop to use the smaller variant of the button",
  },
];

export const ButtonVariants = () => (
  <ContainerDiv>
    <h1>Button Variants</h1>
    <CodeBlockDiv mb={"20px"}>
      <CopyBlock
        text={`
      import * as React from "react";
      import { Button } from "../components/shared/Button"

      const onClickAction = () => {}

      const MyButtonComponent = () => (
        <Button variant={"primary"} onClick={onClickAction}>
          Button Text
        </Button>    
      )
      `}
        language={"tsx"}
        theme={atomOneLight}
      />
    </CodeBlockDiv>
    <PropsList
      propsList={propsList}
      styledSystemProps={["color", "layout", "space", "typography"]}
    />
    <h3>Primary</h3>
    <RowDiv mb={4}>
      <ButtonDiv mr={"20px"}>
        <Button variant={"primary"} onClick={actionFn}>
          Normal
        </Button>
      </ButtonDiv>
      <ButtonDiv mr={"20px"}>
        <Button variant={"primary"} onClick={null} disabled>
          Disabled
        </Button>
      </ButtonDiv>
      <ButtonDiv mr={"20px"}>
        <Button variant={"primary"} onClick={null} small>
          Small
        </Button>
      </ButtonDiv>
      <ButtonDiv mr={"20px"}>
        <Button variant={"primary"} onClick={null} small disabled>
          Disabled
        </Button>
      </ButtonDiv>
    </RowDiv>
    <Divider />
    <h3>Primary Outline</h3>
    <RowDiv mb={4}>
      <ButtonDiv mr={"20px"}>
        <Button variant={"primaryOutline"} onClick={actionFn}>
          Normal
        </Button>
      </ButtonDiv>
      <ButtonDiv mr={"20px"}>
        <Button variant={"primaryOutline"} onClick={null} disabled>
          Disabled
        </Button>
      </ButtonDiv>
      <ButtonDiv mr={"20px"}>
        <Button variant={"primaryOutline"} onClick={actionFn} small>
          Small
        </Button>
      </ButtonDiv>
      <ButtonDiv mr={"20px"}>
        <Button variant={"primaryOutline"} onClick={null} disabled small>
          Disabled
        </Button>
      </ButtonDiv>
    </RowDiv>
    <Divider />
    <h3>Red Outline</h3>
    <RowDiv mb={4}>
      <ButtonDiv mr={"20px"}>
        <Button variant={"redOutline"} onClick={actionFn}>
          Normal
        </Button>
      </ButtonDiv>
      <ButtonDiv mr={"20px"}>
        <Button variant={"redOutline"} onClick={null} disabled>
          Disabled
        </Button>
      </ButtonDiv>
      <ButtonDiv mr={"20px"}>
        <Button variant={"redOutline"} onClick={actionFn} small>
          Small
        </Button>
      </ButtonDiv>
      <ButtonDiv mr={"20px"}>
        <Button variant={"redOutline"} onClick={null} disabled small>
          Disabled
        </Button>
      </ButtonDiv>
    </RowDiv>
    <Divider />
  </ContainerDiv>
);
