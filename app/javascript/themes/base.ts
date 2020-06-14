// This is based on the Styled UI Theme Specification, which is used by Styled System: https://system-ui.com/theme/ && https://styled-system.com/theme-specification

// Rebass (component library written by the same person as Styled System) example: https://github.com/rebassjs/rebass/blob/master/packages/preset/src/index.js

// Here we are trying to follow the same rules we've laid out in our SCSS (variables, global styles)

export const baseTheme = {
  colors: {
    primaryActive: "#0047BE",
    primary100: "#005FFE",
    primary80: "#337FFE",
    primary60: "#669FFE",
    primary40: "#99BFFF",
    primary20: "#CCDFFF",
    backgroundBlue: "#F0F6FF",
    greyActive: "#5E6277",
    greyInactive: "#CED1DD",
    grey100: "#868DAA",
    grey80: "#9EA3BB",
    grey60: "#B6BACC",
    grey40: "#CED1DD",
    grey20: "#E7E8EE",
    darkGrey: "#43425D",
    borderGrey: "#E7E8EE",
    accentPurple: "#A59DCC",
    accentGreen: "#CBE589",
    accentTeal: "#91D1DA",
    accentOrange: "#F9926F",
    peach: "#FFE6D0",
    cautionYellow: "#FFCC57",
    warningRed: "#EB221B",
    fadedRed: "#FFD7CF",
    fuschiaBlue: "#6554C0",
    bali: "#00B8D9",
    finePine: "#36B37E",
    poppySunrise: "#FF5630",
    text: "#444444",
    black: "#000000",
    white: "#FFFFFF",
    messageBar: {
      info: "#4caf50",
      warning: "#FF9800",
      error: "#d22030",
    },
  },

  fonts: {
    body: "Lato, sans-serif",
    heading: "Exo, sans-serif",
  },

  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],

  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
};
