import * as React from "react";
import { useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { color, ColorProps } from "styled-system";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { toJS } from "mobx";

export const MIPDisplay = (props): JSX.Element => {
  const {
    sessionStore: { profile },
  } = useMst();
  console.log(profile);
  return <></>;
};
