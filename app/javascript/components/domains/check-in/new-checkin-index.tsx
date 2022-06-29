import * as React from "react";
import * as R from "ramda";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Loading } from "~/components/shared/loading";
import { Button } from "~/components/shared/button";
import { NewCheckinLayout } from "./new-checkin-layout";

export const NewCheckIn = observer(
  (props): JSX.Element => {
    return <NewCheckinLayout />;
  },
);
