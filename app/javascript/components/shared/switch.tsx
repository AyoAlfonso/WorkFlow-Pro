import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import { baseTheme } from "~/themes/base";

export default withStyles((_) => ({
  root: {
    width: 36,
    height: 16,
    padding: 0,
    margin: 8,
    display: 'flex',
    overflow: 'visible',
  },
  switchBase: {
    padding: 2,
    color: baseTheme.colors.primary40,
    '&$checked': {
      transform: 'translateX(18px)',
      color: "#FFFFFF",
      '& + $track': {
        opacity: 1,
        backgroundColor: "#005FFE",
        borderColor: "#005FFE",
      },
    },
  },
  thumb: {
    width: 14,
    height: 14,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${baseTheme.colors.grey40}`,
    borderRadius: 16,
    opacity: 1,
    backgroundColor: baseTheme.colors.white,
  },
  checked: {},
}))(Switch)
