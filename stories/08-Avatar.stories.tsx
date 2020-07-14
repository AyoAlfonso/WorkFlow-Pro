import { action } from "@storybook/addon-actions";
import * as React from "react";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import styled from "styled-components";
import { layout, space, typography } from "styled-system";
import { Avatar as AvatarComponent } from "../app/javascript/components/shared/avatar";
import { CodeBlockDiv, ContainerDiv, Divider, PropsList, RowDiv } from "./shared";

export default { title: "Avatar" };

const WrappingDiv = styled.div`
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

const propsList = [
  {
    name: "firstName",
    type: "string",
    required: true,
    description: "first name",
  },
  {
    name: "lastName",
    type: "string",
    required: true,
    description: "last name",
  },
  {
    name: "size",
    type: "number",
    required: false,
    description: "defaults to size 48, if no image render initials for first and last name",
  },
  {
    name: "avatarUrl",
    type: "string",
    required: false,
    description: "url of avatar",
  },
];

export const Avatar = () => (
  <ContainerDiv>
    <h1>Avatar</h1>
    <CodeBlockDiv mb={"20px"}>
      <CopyBlock
        text={`
      import * as React from "react";
      import { Avatar } from "../components/shared/avatar"

      const Avatar = () => (
        <Avatar 
          firstName={"First"}
          lastName={"Last"}
          size={48}
          avatarUrl={"https://i.pravatar.cc/48"}
        />  
      )

      `}
        language={"tsx"}
        theme={atomOneLight}
      />
    </CodeBlockDiv>
    <PropsList propsList={propsList} />
    <h3>Avatar With Image</h3>
    <RowDiv mb={3}>
      <WrappingDiv mr={"24px"}>
        <AvatarComponent
          firstName={"First"}
          lastName={"Last"}
          size={24}
          avatarUrl={"https://i.pravatar.cc/24"}
        />
      </WrappingDiv>
      <WrappingDiv mr={"48px"}>
        <AvatarComponent
          firstName={"First"}
          lastName={"Last"}
          size={48}
          avatarUrl={"https://i.pravatar.cc/48"}
        />
      </WrappingDiv>
      <WrappingDiv mr={"256px"}>
        <AvatarComponent
          firstName={"First"}
          lastName={"Last"}
          size={256}
          avatarUrl={"https://i.pravatar.cc/256"}
        />
      </WrappingDiv>
    </RowDiv>
    <Divider />
    <h3>Avatar with No Image</h3>
    <RowDiv mb={3}>
      <WrappingDiv mr={"24px"}>
        <AvatarComponent firstName={"First"} lastName={"Last"} size={24} />
      </WrappingDiv>
      <WrappingDiv mr={"48px"}>
        <AvatarComponent firstName={"First"} lastName={"Last"} size={48} />
      </WrappingDiv>
      <WrappingDiv mr={"256px"}>
        <AvatarComponent firstName={"First"} lastName={"Last"} size={256} />
      </WrappingDiv>
    </RowDiv>
    <Divider />
  </ContainerDiv>
);
