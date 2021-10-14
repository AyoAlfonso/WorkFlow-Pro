import { withStyles, Theme } from "@material-ui/core/styles";
import { baseTheme } from "~/themes/base";
import Tooltip from "@material-ui/core/Tooltip";

const { doveGray, mystic, white } = baseTheme.colors;

export const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: doveGray,
    color: white,
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: `2px solid ${mystic}`,
  },
}))(Tooltip);
