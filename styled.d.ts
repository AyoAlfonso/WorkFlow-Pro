import { baseTheme } from "./app/javascript/themes/base";

type CustomTheme = typeof baseTheme;

declare module "styled-components" {
  export interface DefaultTheme extends CustomTheme {}
}
