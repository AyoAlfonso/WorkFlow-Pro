import * as React from "react";

import { Input as RebassInput, Label as RebassLabel } from "@rebass/forms";

export const Input = props => (
  <RebassInput {...props} fontFamily={"Lato"} sx={{}}>
    {props.children}
  </RebassInput>
);

export const Label = props => (
  <RebassLabel {...props} fontFamily={"Lato"} sx={{}}>
    {props.children}
  </RebassLabel>
);
