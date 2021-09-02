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
import { iconList } from "react-icomoon";
const iconSet = require("../app/javascript/assets/icons/selection.json");

export default { title: "Iconography", decorators: [withKnobs] };

const propsList = [
  { name: "icon", type: "string", required: true, description: "the name of the icon" },
  {
    name: "iconColor",
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
          icon={select("icon", iconList(iconSet), "Emotion-A")}
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
        <Icon icon={"Logo"} size={"2em"} />
        <TextCenteredDiv>Logo</TextCenteredDiv>
      </CenteredColumnDiv>
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
        <Icon icon={"Goals"} size={"2em"} />
        <TextCenteredDiv>Goals</TextCenteredDiv>
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
      <CenteredColumnDiv>
        <Icon icon={"Chevron-Left"} size={"2em"} />
        <TextCenteredDiv>Chevron-Left</TextCenteredDiv>
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
        <Icon icon={"Settings"} size={"2em"} />
        <TextCenteredDiv>Settings</TextCenteredDiv>
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
        <Icon icon={"Success-PO"} size={"2em"} iconColor={"finePine"} />
        <TextCenteredDiv>Success-PO</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Error-PO"} size={"2em"} iconColor={"warningRed"} />
        <TextCenteredDiv>Error-PO</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Warning-PO"} size={"2em"} iconColor={"cautionYellow"} />
        <TextCenteredDiv>Warning-PO</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Info-PO"} size={"2em"} iconColor={"fuschiaBlue"} />
        <TextCenteredDiv>Info-PO</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Notification-PO"} size={"2em"} iconColor={"primary100"} />
        <TextCenteredDiv>Notification-PO</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Plan"} size={"2em"} />
        <TextCenteredDiv>Plan</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Checkmark"} size={"2em"} />
        <TextCenteredDiv>Checkmark</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"PynBot"} size={"2em"} iconColor={"primary80"} />
        <TextCenteredDiv>PynBot</TextCenteredDiv>
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
        <Icon icon={"Priority-MIP"} size={"2em"} iconColor={"primary100"} />
        <TextCenteredDiv>Priority-MIP</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Priority-Empty"} size={"2em"} iconColor={"primary80"} />
        <TextCenteredDiv>Priority-Empty</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"AM-Check-in"} size={"2em"} iconColor={"cautionYellow"} />
        <TextCenteredDiv>AM-Check-in</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Check-in"} size={"2em"} iconColor={"successGreen"} />
        <TextCenteredDiv>Check-in</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"PM-Check-in"} size={"2em"} iconColor={"primary40"} />
        <TextCenteredDiv>PM-Check-in</TextCenteredDiv>
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
      <CenteredColumnDiv>
        <Icon icon={"Add-User-Circle"} size={"2em"} />
        <TextCenteredDiv>Add-User-Circle</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Plan"} size={"2em"} />
        <TextCenteredDiv>Plan</TextCenteredDiv>
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"Meeting"} size={"2em"} />
        <TextCenteredDiv>Meeting</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Reminder"} size={"2em"} />
        <TextCenteredDiv>Reminder</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Sort"} size={"2em"} />
        <TextCenteredDiv>Sort</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Label"} size={"2em"} />
        <TextCenteredDiv>Label</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Lock"} size={"2em"} />
        <TextCenteredDiv>Lock</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Notepad"} size={"2em"} />
        <TextCenteredDiv>Notepad</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Priority-None"} size={"2em"} />
        <TextCenteredDiv>Priority-None</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Sub_initiative"} size={"2em"} />
        <TextCenteredDiv>Sub_initiative</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Hide_Show_L"} size={"2em"} />
        <TextCenteredDiv>Hide_Show_L</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Hide_Show_R"} size={"2em"} />
        <TextCenteredDiv>Hide_Show_R</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Initiative"} size={"2em"} />
        <TextCenteredDiv>Initiative</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Master"} size={"2em"} />
        <TextCenteredDiv>Master</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"New-Goals"} size={"2em"} />
        <TextCenteredDiv>New-Goals</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Scorecards"} size={"2em"} />
        <TextCenteredDiv>Scorecards</TextCenteredDiv>
      </CenteredColumnDiv>
    </RowDiv>
    <Divider />
    <RowDiv>
      <CenteredColumnDiv>
        <Icon icon={"Weekly"} size={"2em"} />
        <TextCenteredDiv>Weekly</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"EoM"} size={"2em"} />
        <TextCenteredDiv>EoM</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"Move2"} size={"2em"} />
        <TextCenteredDiv>Move2</TextCenteredDiv>
      </CenteredColumnDiv>
      <CenteredColumnDiv>
        <Icon icon={"List"} size={"2em"} />
        <TextCenteredDiv>List</TextCenteredDiv>
      </CenteredColumnDiv>
    </RowDiv>
    <RowDiv>
     <CenteredColumnDiv>
        <Icon icon={"SubInitiative"} size={"2em"} />
        <TextCenteredDiv>Sub Initiative</TextCenteredDiv>
      </CenteredColumnDiv>
    </RowDiv>
  </ContainerDiv>
);
