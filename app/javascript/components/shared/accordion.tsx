import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import { withStyles } from "@material-ui/core/styles";

export const Accordion = withStyles({
  root: {
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {},
})(MuiAccordion)

export const AccordionSummary = withStyles({
  root: {
    borderRadius: 10,
    padding: 0,
    height: 56,
    marginBottom: 5,
    boxShadow: "1px 3px 4px 2px rgba(0, 0, 0, 0.1)",
    "&$expanded": {
      height: 56,
    }
  },
  content: {
    "& div": {

    }
  },
  expanded: {},
})(MuiAccordionSummary)

export const AccordionDetails = withStyles({
  root: {
    borderRadius: 10,
    padding: 0,
    "&$expanded": {

    }
  },
  expanded: {}
})(MuiAccordionDetails)