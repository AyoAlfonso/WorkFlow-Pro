import { boolean, object, select, text, withKnobs } from "@storybook/addon-knobs";
import React from "react";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import styled from "styled-components";
import { Icon } from "../app/javascript/components/shared/icon";
import { baseTheme } from "../app/javascript/themes/base";
import {
  CenteredColumnDiv,
  CodeBlockDiv,
  ContainerDiv,
  Divider,
  PropsList,
  RowDiv,
} from "./shared";

export default { title: "Iconography", decorators: [withKnobs] };

const propsList = [
  { name: "icon", type: "string", required: false, description: "the name of the icon" },
  {
    name: "color",
    type: "string",
    required: false,
    description: "the color of the icon (RGB, HEX, named color)",
  },
  {
    name: "size",
    type: "string/number",
    required: false,
    description: "sizes can be in different formats, ex '1em', 10, '100px'",
  },
  { name: "style", type: "object", required: false, description: "a style object" },
  {
    name: "disableFill",
    type: "boolean",
    required: false,
    description: "remove/add fill color",
  },
  {
    name: "removeInlineStyle",
    type: "boolean",
    required: false,
    description: "toggle inline styles on/off",
  },
];

const TextCenteredDiv = styled.div`
  text-align: center;
  vertical-align: middle;
`;

export const Icons = () => (
  <ContainerDiv>
    <h1>Icons</h1>
    <CodeBlockDiv mb={"20px"}>
      <CopyBlock
        text={`
      import * as React from "react";
      import { Icon } from "../components/shared/icon"

      const MyComponentWithIcon = () => (
        <div>
          <Icon icon={"Arrow"} size={"2em"} iconColor={"red"}/>
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
          iconColor={select("color", baseTheme.colors, baseTheme.colors.finePine)}
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
        <Icon icon={"Chevron-Up"} size={"2em"} />
        <TextCenteredDiv>Chevron-Up</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Chevron-Down"} size={"2em"} />
        <TextCenteredDiv>Chevron-Down</TextCenteredDiv>
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
      <CenteredColumnDiv>
        <Icon icon={"Start"} size={"2em"} />
        <TextCenteredDiv>Start</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Stop"} size={"2em"} />
        <TextCenteredDiv>Stop</TextCenteredDiv>
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-A"} size={"2em"} iconColor={"darkgreen"} />
        <TextCenteredDiv>Emotion-A</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-B"} size={"2em"} iconColor={"finePine"} />
        <TextCenteredDiv>Emotion-B</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-C"} size={"2em"} iconColor={"grey40"} />
        <TextCenteredDiv>Emotion-C</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-D"} size={"2em"} iconColor={"cautionYellow"} />
        <TextCenteredDiv>Emotion-D</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Emotion-E"} size={"2em"} iconColor={"warningRed"} />
        <TextCenteredDiv>Emotion-E</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Success-PU"} size={"2em"} iconColor={"finePine"} />
        <TextCenteredDiv>Success</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Error-PU"} size={"2em"} iconColor={"warningRed"} />
        <TextCenteredDiv>Error-PU</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Warning-PU"} size={"2em"} iconColor={"cautionYellow"} />
        <TextCenteredDiv>Warning-PU</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Info-PU"} size={"2em"} iconColor={"fuschiaBlue"} />
        <TextCenteredDiv>Info-PU</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Notification-PU"} size={"2em"} iconColor={"primary100"} />
        <TextCenteredDiv>Notification-PU</TextCenteredDiv>
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"Priority-High"} size={"2em"} iconColor={"cautionYellow"} />
        <TextCenteredDiv>Priority-High</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Priority-Urgent"} size={"2em"} iconColor={"warningRed"} />
        <TextCenteredDiv>Priority-Urgent</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Priority-Frog"} size={"2em"} iconColor={"frog"} />
        <TextCenteredDiv>Frog-Priority</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"AM-Check-in"} size={"2em"} iconColor={"cautionYellow"} />
        <TextCenteredDiv>AM-Check-in</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Check-in"} size={"2em"} iconColor={"primary40"} />
        <TextCenteredDiv>Check-in</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"In-Office"} size={"2em"} iconColor={"finePine"} />
        <TextCenteredDiv>In-Office</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"WFH"} size={"2em"} iconColor={"primary100"} />
        <TextCenteredDiv>WFH</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Half-Day"} size={"2em"} iconColor={"cautionYellow"} />
        <TextCenteredDiv>Half-Day</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"No-Check-in"} size={"2em"} iconColor={"warningRed"} />
        <TextCenteredDiv>No-Check-in</TextCenteredDiv>
      </CenteredColumnDiv>
    </RowDiv>
  </ContainerDiv>
);
