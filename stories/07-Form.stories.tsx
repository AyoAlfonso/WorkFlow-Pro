import * as React from "react";

import { CodeBlockDiv, ContainerDiv } from "./shared";
import { atomOneLight, CopyBlock } from "react-code-blocks";

import { Input as FormInput, Label as FormLabel } from "../app/javascript/components/shared/input";

export const Input = () => (
  <ContainerDiv pl={4}>
    <h1>Input</h1>
    <CodeBlockDiv mb={"20px"}>
      <CopyBlock
        text={`
      import * as React from "react";
      import { Input } from "../components/shared/input"

      const MyFormInput = () => (
        <>
        <Label htmlFor='field'>Field</Label>
        <Input id="field" name="field" defaultValue="field" />   
        </>
      )
      `}
        language={"tsx"}
        theme={atomOneLight}
      />
    </CodeBlockDiv>
    <FormLabel htmlFor="field">Field</FormLabel>
    <FormInput id="field" name="field" defaultValue="default field value" />
  </ContainerDiv>
);

export default { title: "Forms" };
