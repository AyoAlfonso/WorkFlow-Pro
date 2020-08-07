import { action } from "@storybook/addon-actions";
import { text, select, boolean, withKnobs } from "@storybook/addon-knobs";
import * as React from "react";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import styled from "styled-components";
import { layout, LayoutProps, space, SpaceProps, typography, TypographyProps } from "styled-system";
import { Button } from "../app/javascript/components/shared/button";
import { Icon } from "../app/javascript/components/shared/icon";
import { RoundButton as RoundButtonComponent } from "../app/javascript/components/shared/round-button";
import { IconButton as IconButtonComponent } from "../app/javascript/components/shared/icon-button";
import { CodeBlockDiv, ContainerDiv, Divider, PropsList, RowDiv } from "./shared";
import { baseTheme } from "../app/javascript/themes/base";
import { iconList } from "react-icomoon";
const iconSet = require("../app/javascript/assets/icons/selection.json");

export default { title: "Buttons", decorators: [withKnobs] };

const actionFn = action("Button was clicked!");

const ButtonDiv = styled.div<SpaceProps>`
  ${space}
`;

const HeightDiv = styled.div<SpaceProps & LayoutProps>`
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

const HeightText = styled.p<TypographyProps>`
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
        <Button variant={"primary"} onClick={actionFn} small>
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

const FlexDiv = styled.div`
  display: flex;
`;

export const RoundButton = () => {
  const [rotate, setRotate] = React.useState(false);
  return (
    <ContainerDiv pl={4}>
      <h1>Round Button</h1>
      <PropsList
        propsList={[
          {
            name: "rotate",
            type: "boolean",
            required: false,
            description: "rotates the button 45 degrees",
          },
        ]}
        styledSystemProps={["color"]}
      />
      <FlexDiv>
        <RoundButtonComponent
          onClick={() => {
            actionFn();
            setRotate(!rotate);
          }}
          rotate={rotate}
          style={{ marginLeft: "12px" }}
        >
          <Icon
            icon={text("icon", "Plus")}
            size={20}
            iconColor={"primary100"}
            style={{ marginLeft: "10px", marginTop: "10px" }}
          />
        </RoundButtonComponent>
      </FlexDiv>
    </ContainerDiv>
  );
};

const iconButtonPropsList = [
  {
    name: "iconName",
    type: "string",
    required: true,
    description: "the name of the icon",
  },
  {
    name: "iconSize",
    type: "string | number",
    required: true,
    description: "the size of the icon",
  },
  {
    name: "iconColor",
    type: "string",
    required: false,
    description: "the color of the icon",
  },
  {
    name: "text",
    type: "string",
    required: false,
    description: "the text inside of the button",
  },
  {
    name: "textColor",
    type: "string",
    required: false,
    description: "the color of the button text",
  },
  {
    name: "shadow",
    type: "boolean",
    required: false,
    description: "if true, adds box-shadow",
  },
  {
    name: "onClick",
    type: "function",
    required: true,
    description: "the function to execute when the button is clicked",
  },
];

export const IconButton = () => {
  return (
    <ContainerDiv>
      <h1>Icon Button</h1>
      <CodeBlockDiv mb={"20px"}>
        <CopyBlock
          text={`
      import * as React from "react";
      import { IconButton } from "../components/shared/icon-button"

      const onClickAction = () => {}

      const MyButtonComponent = () => (
        <IconButton
          width={"250px"}
          bg={"white"}
          iconName={"AM-Check-in"}
          iconSize={28}
          iconColor={"cautionYellow"}
          text={"Some Button Text"}
          shadow={true}
          onClick={onClickAction}
        />   
      )
      `}
          language={"tsx"}
          theme={atomOneLight}
        />
      </CodeBlockDiv>
      <PropsList
        propsList={iconButtonPropsList}
        styledSystemProps={["color", "layout", "space", "typography"]}
      />
      <h3>Example</h3>
      <IconButtonComponent
        width={"288px"}
        mb={"15px"}
        bg={select("bg", baseTheme.colors, baseTheme.colors.bali)}
        iconName={select("iconName", iconList(iconSet), "Settings")}
        iconSize={text("iconSize", "2em")}
        iconColor={select("iconColor", baseTheme.colors, baseTheme.colors.cautionYellow)}
        text={text("text", "Some Button Text")}
        textColor={select("textColor", baseTheme.colors, baseTheme.colors.white)}
        shadow={boolean("shadow", true)}
        onClick={() => actionFn()}
      />
      <h3>Journal Buttons</h3>
      <IconButtonComponent
        width={"288px"}
        mb={"20px"}
        bg={"white"}
        iconName={"AM-Check-in"}
        iconSize={28}
        iconColor={"cautionYellow"}
        text={"Create My Day"}
        shadow={true}
        onClick={() => actionFn()}
      />
      <IconButtonComponent
        width={"288px"}
        mb={"20px"}
        bg={"white"}
        iconName={"Negative-Thoughts"}
        iconSize={28}
        iconColor={"warningRed"}
        text={"Thought Challenge"}
        shadow={true}
        onClick={() => actionFn()}
      />
      <IconButtonComponent
        width={"288px"}
        mb={"20px"}
        bg={"white"}
        iconName={"Check-in"}
        iconSize={28}
        iconColor={"primary20"}
        text={"Evening Reflection"}
        shadow={true}
        onClick={() => actionFn()}
      />
      <h3>Emotion Buttons</h3>
      <RowDiv>
        <IconButtonComponent
          width={"30px"}
          height={"30px"}
          mb={"20px"}
          mr={"3px"}
          bg={"white"}
          iconName={"Emotion-E"}
          iconSize={"30px"}
          iconColor={"warningRed"}
          shadow={true}
          onClick={() => actionFn()}
        />
        <IconButtonComponent
          width={"30px"}
          height={"30px"}
          mb={"20px"}
          mr={"2px"}
          bg={"white"}
          iconName={"Emotion-D"}
          iconSize={"30px"}
          iconColor={"cautionYellow"}
          shadow={true}
          onClick={() => actionFn()}
        />
        <IconButtonComponent
          width={"30px"}
          height={"30px"}
          mb={"20px"}
          mr={"2px"}
          bg={"white"}
          iconName={"Emotion-C"}
          iconSize={"30px"}
          iconColor={"grey80"}
          shadow={true}
          onClick={() => actionFn()}
        />
        <IconButtonComponent
          width={"30px"}
          height={"30px"}
          mb={"20px"}
          mr={"2px"}
          bg={"white"}
          iconName={"Emotion-B"}
          iconSize={"30px"}
          iconColor={"successGreen"}
          shadow={true}
          onClick={() => actionFn()}
        />
        <IconButtonComponent
          width={"30px"}
          height={"30px"}
          mb={"20px"}
          mr={"2px"}
          bg={"white"}
          iconName={"Emotion-A"}
          iconSize={"30px"}
          iconColor={"finePine"}
          shadow={true}
          onClick={() => actionFn()}
        />
      </RowDiv>
      <h3>Status Buttons</h3>
      <IconButtonComponent
        width={"160px"}
        height={"40px"}
        mb={"20px"}
        bg={"fadedSuccess"}
        iconName={"In-Office"}
        iconSize={28}
        iconColor={"finePine"}
        text={"Working"}
        textColor={"finePine"}
        shadow={true}
        onClick={() => actionFn()}
      />
      <IconButtonComponent
        width={"160px"}
        height={"40px"}
        mb={"20px"}
        bg={"primary40"}
        iconName={"WFH"}
        iconSize={28}
        iconColor={"primary100"}
        text={"WFH"}
        textColor={"primary100"}
        shadow={true}
        onClick={() => actionFn()}
      />
      <IconButtonComponent
        width={"160px"}
        height={"40px"}
        mb={"20px"}
        bg={"backgroundYellow"}
        iconName={"Half-Day"}
        iconSize={28}
        iconColor={"cautionYellow"}
        text={"Half-Day"}
        textColor={"cautionYellow"}
        shadow={true}
        onClick={() => actionFn()}
      />
      <IconButtonComponent
        width={"160px"}
        height={"40px"}
        mb={"20px"}
        bg={"fadedRed"}
        iconName={"No-Check-in"}
        iconSize={28}
        iconColor={"warningRed"}
        text={"I'm Off"}
        textColor={"warningRed"}
        shadow={true}
        onClick={() => actionFn()}
      />
    </ContainerDiv>
  );
};
