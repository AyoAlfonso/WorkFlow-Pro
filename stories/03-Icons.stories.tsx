import { boolean, color, text, withKnobs } from "@storybook/addon-knobs";
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
        language={"jsx"}
        theme={atomOneLight}
      />
    </CodeBlockDiv>
    <PropsList propsList={propsList} />
    <p>Adjust the knobs and change the props to change the preview icon</p>
    <RowDiv>
      <CenteredColumnDiv>
        <Icon
          icon={text("icon", "Plus")}
          size={text("size", "3em")}
          color={color("color", "orange")}
          disableFill={boolean("disableFill", false)}
          removeInlineStyle={boolean("removeInlineStyle", false)}
        />
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"Arrow"} size={"2em"} />
        <p>Arrow</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Close"} size={"2em"} />
        <p>Close</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Plus"} size={"2em"} />
        <p>Plus</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Delete"} size={"2em"} />
        <p>Delete</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Download"} size={"2em"} />
        <p>Download</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Upload"} size={"2em"} />
        <p>Upload</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Edit"} size={"2em"} />
        <p>Edit</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Edit-2"} size={"2em"} />
        <p>Edit-2</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Forward"} size={"2em"} />
        <p>Forward</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Search"} size={"2em"} />
        <p>Search</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Log-Out"} size={"2em"} />
        <p>Log-Out</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Move"} size={"2em"} />
        <p>Move</p>
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"User"} size={"2em"} />
        <p>User</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"New-User"} size={"2em"} />
        <p>New-User</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Home"} size={"2em"} />
        <p>Home</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Notification"} size={"2em"} />
        <p>Notification</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Attachments"} size={"2em"} />
        <p>Attachments</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Tasks"} size={"2em"} />
        <p>Tasks</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Alert"} size={"2em"} />
        <p>Alert</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Award"} size={"2em"} />
        <p>Award</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Comment"} size={"2em"} />
        <p>Comment</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Company"} size={"2em"} />
        <p>Company</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Chevron"} size={"2em"} />
        <p>Chevron</p>
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"Streak"} size={"2em"} />
        <p>Streak</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Star"} size={"2em"} />
        <p>Star</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Stats"} size={"2em"} />
        <p>Stats</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Negative-Thoughts"} size={"2em"} />
        <p>Negative-Thoughts</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Empty-Pockets"} size={"2em"} />
        <p>Empty-Pockets</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Help"} size={"2em"} />
        <p>Help</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Options"} size={"2em"} />
        <p>Options</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Key-Elements"} size={"2em"} />
        <p>Key-Elements</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Deadline-Calendar"} size={"2em"} />
        <p>Deadline-Calendar</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Weekly-Milestones"} size={"2em"} />
        <p>Weekly-Milestones</p>
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-A"} size={"2em"} />
        <p>Emotion-A</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-B"} size={"2em"} />
        <p>Emotion-B</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-C"} size={"2em"} />
        <p>Emotion-C</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-D"} size={"2em"} />
        <p>Emotion-D</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-E"} size={"2em"} />
        <p>Emotion-E</p>
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"Priority-High"} size={"2em"} />
        <p>Priority-High</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Priority-Urgent"} size={"2em"} />
        <p>Priority-High</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Frog-Priority"} size={"2em"} />
        <p>Frog-Priority</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"AM-Check-in"} size={"2em"} />
        <p>AM-Check-in</p>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"PM-Check-in"} size={"2em"} />
        <p>PM-Check-in</p>
      </CenteredColumnDiv>
    </RowDiv>
  </ContainerDiv>
);
