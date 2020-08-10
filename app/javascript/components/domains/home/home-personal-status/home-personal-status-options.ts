import CSS from "csstype";
import { IIconProps } from "~/components/shared/icon";

export interface IHomePersonalStatusOption {
  containerProps: CSS.Properties;
  iconProps: IIconProps;
  label: string;
}

export interface IWorkStatusOptions {
  [key: string]: IHomePersonalStatusOption;
}

export const homePersonalStatusOptions: IWorkStatusOptions = {
  work_from_home: {
    containerProps: {
      backgroundColor: "backgroundBlue",
      color: "primary100",
    },
    iconProps: {
      icon: "WFH",
      iconColor: "primary100",
    },
    label: "WFH",
  },
  in_office: {
    containerProps: {
      backgroundColor: "backgroundGreen",
      color: "finePine",
    },
    iconProps: {
      icon: "In-Office",
      iconColor: "finePine",
    },
    label: "In-Office",
  },
  half_day: {
    containerProps: {
      backgroundColor: "backgroundYellow",
      color: "cautionYellow",
    },
    iconProps: {
      icon: "Half-Day",
      iconColor: "cautionYellow",
    },
    label: "Half-day",
  },
  day_off: {
    containerProps: {
      backgroundColor: "backgroundRed",
      color: "warningRed",
    },
    iconProps: {
      icon: "No-Check-in",
      iconColor: "warningRed",
    },
    label: "I'm Off",
  },
};
