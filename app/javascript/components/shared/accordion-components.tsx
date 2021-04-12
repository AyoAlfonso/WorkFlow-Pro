import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import { withStyles } from "@material-ui/core/styles";
import { baseTheme } from "~/themes/base";

export const Accordion = withStyles({
  root: {
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
})(MuiAccordion);

export const AccordionSummary = withStyles({
  root: {
    border: "0px solid white",
    borderRadius: 10,
    padding: 0,
    height: 56,
    marginBottom: 16,
    boxShadow: "1px 3px 4px 2px rgba(0, 0, 0, 0.1)",
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 0,
    marginBottom: 0,
    marginRight: 5,
    "&$expanded": {
      marginTop: 0,
      marginBottom: 0,
      marginRight: 5,
    },
  },
})(MuiAccordionSummary);

export const AccordionSummaryInverse = withStyles({
  root: {
    border: "0px solid white",
    borderRadius: 10,
    padding: 0,
    height: 56,
    marginBottom: 16,
    boxShadow: "1px 3px 4px 2px rgba(0, 0, 0, 0.1)",
    "&$expanded": {
      minHeight: 56,
    },
    backgroundColor: baseTheme.colors.primary100,
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 0,
    marginBottom: 0,
    marginRight: 5,
    "&$expanded": {
      marginTop: 0,
      marginBottom: 0,
      marginRight: 5,
    },
  },
})(MuiAccordionSummary);

export const AccordionDetails = withStyles({
  root: {
    borderRadius: 10,
    padding: 0,
  },
})(MuiAccordionDetails);
