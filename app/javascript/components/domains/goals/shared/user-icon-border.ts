import { baseTheme } from "~/themes";

export const UserIconBorder = status => {
  const { warningRed, cautionYellow, finePine, grey20 } = baseTheme.colors;
  let borderColor;
  switch (status) {
    case "incomplete":
      borderColor = warningRed;
      break;
    case "in_progress":
      borderColor = cautionYellow;
      break;
    case "completed":
      borderColor = finePine;
      break;
    default:
      borderColor = grey20;
      break;
  }

  return `2px solid ${borderColor}`;
};
