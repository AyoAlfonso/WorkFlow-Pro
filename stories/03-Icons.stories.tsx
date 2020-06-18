import {
  boolean,
  color,
  object,
  text,
  withKnobs,
  select,
} from "@storybook/addon-knobs";
import React from "react";
import styled from "styled-components";
import { CopyBlock, atomOneLight } from "react-code-blocks";
import Icon from "../app/javascript/components/shared/Icon";
import {
  CenteredColumnDiv,
  ContainerDiv,
  Divider,
  PropsList,
  RowDiv,
} from "./shared";
import { baseTheme } from "../app/javascript/themes/base";

export default { title: "Iconography", decorators: [withKnobs] };

const propsList = [
  { name: "icon", type: "string", description: "the name of the icon" },
  {
    name: "color",
    type: "string",
    description: "the color of the icon (RGB, HEX, named color)",
  },
  {
    name: "size",
    type: "string/number",
    description: "sizes can be in different formats, ex '1em', 10, '100px'",
  },
  { name: "style", type: "object", description: "a style object" },
  {
    name: "disableFill",
    type: "boolean",
    description: "remove/add fill color",
  },
  {
    name: "removeInlineStyle",
    type: "boolean",
    description: "toggle inline styles on/off",
  },
];

const CodeBlockDiv = styled.div`
  width: 60%;
  height: 100%;
  margin-bottom: 20px;
`;

const TextCenteredDiv = styled.div`
  text-align: center;
  vertical-align: middle;
`;

export const Icons = () => (
  <ContainerDiv>
    <h1>Icons</h1>
    <CodeBlockDiv>
      <CopyBlock
        text={`
      import * as React from "react";
      import Icon from "../components/shared/Icon"

      const MyComponentWithIcon = () => (
        <div>
          <Icon icon={"Arrow"} size={"2em"} color={"red"}/>
        </div>    
      )
      `}
        language={"tsx"}
        theme={atomOneLight}
      />
    </CodeBlockDiv>
    <PropsList propsList={propsList} />
    <p>Adjust the knobs and modify the props to change the preview icon</p>
    <RowDiv>
      <CenteredColumnDiv>
        <Icon
          icon={text("icon", "Emotion-A")}
          size={text("size", "3em")}
          color={select("color", baseTheme.colors, baseTheme.colors.finePine)}
          disableFill={boolean("disableFill", false)}
          removeInlineStyle={boolean("removeInlineStyle", false)}
          style={object("style", { backgroundColor: "lightgrey" })}
        />
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"Arrow"} size={"2em"} />
        <TextCenteredDiv>Arrow</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Close"} size={"2em"} />
        <TextCenteredDiv>Close</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Plus"} size={"2em"} />
        <TextCenteredDiv>Plus</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Delete"} size={"2em"} />
        <TextCenteredDiv>Delete</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Download"} size={"2em"} />
        <TextCenteredDiv>Download</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Upload"} size={"2em"} />
        <TextCenteredDiv>Upload</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Edit"} size={"2em"} />
        <TextCenteredDiv>Edit</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Edit-2"} size={"2em"} />
        <TextCenteredDiv>Edit-2</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Forward"} size={"2em"} />
        <TextCenteredDiv>Forward</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Search"} size={"2em"} />
        <TextCenteredDiv>Search</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Log-Out"} size={"2em"} />
        <TextCenteredDiv>Log-Out</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Move"} size={"2em"} />
        <TextCenteredDiv>Move</TextCenteredDiv>
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"User"} size={"2em"} />
        <TextCenteredDiv>User</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"New-User"} size={"2em"} />
        <TextCenteredDiv>New-User</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Home"} size={"2em"} />
        <TextCenteredDiv>Home</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Notification"} size={"2em"} />
        <TextCenteredDiv>Notification</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Attachments"} size={"2em"} />
        <TextCenteredDiv>Attachments</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Tasks"} size={"2em"} />
        <TextCenteredDiv>Tasks</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Alert"} size={"2em"} />
        <TextCenteredDiv>Alert</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Award"} size={"2em"} />
        <TextCenteredDiv>Award</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Comment"} size={"2em"} />
        <TextCenteredDiv>Comment</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Company"} size={"2em"} />
        <TextCenteredDiv>Company</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Chevron"} size={"2em"} />
        <TextCenteredDiv>Chevron</TextCenteredDiv>
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"Streak"} size={"2em"} />
        <TextCenteredDiv>Streak</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Star"} size={"2em"} />
        <TextCenteredDiv>Star</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Stats"} size={"2em"} />
        <TextCenteredDiv>Stats</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Negative-Thoughts"} size={"2em"} />
        <TextCenteredDiv>Negative-Thoughts</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Empty-Pockets"} size={"2em"} />
        <TextCenteredDiv>Empty-Pockets</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Help"} size={"2em"} />
        <TextCenteredDiv>Help</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Options"} size={"2em"} />
        <TextCenteredDiv>Options</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Key-Elements"} size={"2em"} />
        <TextCenteredDiv>Key-Elements</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Deadline-Calendar"} size={"2em"} />
        <TextCenteredDiv>Deadline-Calendar</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Weekly-Milestones"} size={"2em"} />
        <TextCenteredDiv>Weekly-Milestones</TextCenteredDiv>
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-A"} size={"2em"} />
        <TextCenteredDiv>Emotion-A</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-B"} size={"2em"} />
        <TextCenteredDiv>Emotion-B</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-C"} size={"2em"} />
        <TextCenteredDiv>Emotion-C</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-D"} size={"2em"} />
        <TextCenteredDiv>Emotion-D</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-E"} size={"2em"} />
        <TextCenteredDiv>Emotion-E</TextCenteredDiv>
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"Priority-High"} size={"2em"} />
        <TextCenteredDiv>Priority-High</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Priority-Urgent"} size={"2em"} />
        <TextCenteredDiv>Priority-High</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Frog-Priority"} size={"2em"} />
        <TextCenteredDiv>Frog-Priority</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"AM-Check-in"} size={"2em"} />
        <TextCenteredDiv>AM-Check-in</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"PM-Check-in"} size={"2em"} />
        <TextCenteredDiv>PM-Check-in</TextCenteredDiv>
      </CenteredColumnDiv>
    </RowDiv>
  </ContainerDiv>
);
