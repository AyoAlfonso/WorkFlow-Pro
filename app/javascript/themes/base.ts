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
    darkGrey: "#43425D",
    greyActive: "#5E6277",
    greyInactive: "#CED1DD",
    grey100: "#868DAA",
    grey80: "#9EA3BB",
    grey60: "#B6BACC",
    grey40: "#CED1DD",
    grey20: "#E7E8EE",
    cautionYellow: "#FFCC57",
    warningRed: "#EB221B",
    fuschiaBlue: "#6554C0",
    finePine: "#36B37E",
    bali: "#00B8D9",
    poppySunrise: "#FF5630",
    frog: "#696112",
    fadedYellow: "#FFDF96",
    fadedRed: "#FFD7CF",
    fadedPurple: "#A59DCC",
    fadedGreen: "#CBE589",
    fadedTeal: "#91D1DA",
    fadedOrange: "#F9926F",
    peach: "#FFE6D0",
    text: "#172B4D",
    black: "#000000",
    white: "#FFFFFF",
    borderGrey: "#E7E8EE",
    backgroundBlue: "#F0F6FF",
  },

  fonts: {
    body: "Lato, sans-serif",
    heading: "Exo, sans-serif",
  },

  fontSizes: [15, 16, 20, 30],

  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
};
