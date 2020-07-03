import * as React from "react";
import styled from "styled-components";
import { action } from "@storybook/addon-actions";
import { text } from "@storybook/addon-knobs";
import { color, space, layout, typography } from "styled-system";
import { SideNavNoMst } from "../app/javascript/components/domains/nav/side-nav";

export const SideNav = () => SideNavNoMst("/");

export default { title: "Nav" };
