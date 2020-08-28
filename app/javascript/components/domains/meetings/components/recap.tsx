import * as React from "react";
import { useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "../../../shared/card";
import { Text } from "../../../shared/text";
import { useMst } from "~/setup/root";
import { Avatar } from "~/components/shared/avatar";
import { useParams } from "react-router-dom";
import { Input } from "~/components/shared/input";
import { baseTheme } from "~/themes/base";
import { Button } from "~/components/shared/button";
import { Loading } from "~/components/shared/loading";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

export interface IRecapProps {}

export const Recap = (props: IRecapProps): JSX.Element => {
  return <></>;
};
