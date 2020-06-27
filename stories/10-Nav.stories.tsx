import * as React from "react";
import styled from "styled-components";
import { action } from "@storybook/addon-actions";
import { text } from "@storybook/addon-knobs";
import { color, space, layout, typography } from "styled-system";
import { SideNav as NavSideNav } from "../app/javascript/components/domains/nav/side-nav";

export const SideNav = () => <NavSideNav />;

export default { title: "Nav" };
