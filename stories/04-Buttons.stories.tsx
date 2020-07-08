import { action } from "@storybook/addon-actions";
import { text, withKnobs } from "@storybook/addon-knobs";
import * as React from "react";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import styled from "styled-components";
import { layout, space, typography } from "styled-system";
import { Button } from "../app/javascript/components/shared/button";
import { Icon } from "../app/javascript/components/shared/icon";
import { RoundButton as RoundButtonComponent } from "../app/javascript/components/shared/round-button";
import { CodeBlockDiv, ContainerDiv, Divider, PropsList, RowDiv } from "./shared";

export default { title: "Buttons", decorators: [withKnobs] };

const actionFn = action("Button was clicked!");

const ButtonDiv = styled.div`
  ${space}
`;

const HeightDiv = styled.div`
  ${space}
  ${layout}
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const HeightLine = styled.div`
  height: 100%;
  width: 6px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
  margin-left: 3px;
`;

const HeightText = styled.p`
  ${typography}
`;

const HeightDisplay = ({ size }) => (
  <HeightDiv height={size} mr={2}>
    <HeightText fontSize={"12px"}>{`${size}`}</HeightText>
    <HeightLine />
  </HeightDiv>
);

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

export const BaseButtonVariants = () => (
  <ContainerDiv>
    <h1>Base Button Variants</h1>
    <CodeBlockDiv mb={"20px"}>
      <CopyBlock
        text={`
      import * as React from "react";
      import { Button } from "../components/shared/button"

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
      <HeightDisplay size={"40px"} />
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
      <HeightDisplay size={"32px"} />
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

export const RoundButton = () => (
  <ContainerDiv pl={4}>
    <h1>Round Button</h1>
    <PropsList styledSystemProps={["color"]} />
    <div>
      <RoundButtonComponent onClick={actionFn}>
        <Icon
          icon={text("icon", "Plus")}
          size={20}
          color={"primary100"}
          style={{ marginLeft: "10px", marginTop: "10px" }}
        />
      </RoundButtonComponent>
    </div>
  </ContainerDiv>
);