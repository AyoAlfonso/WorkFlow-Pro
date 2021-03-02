import * as React from "react";
import { Icon } from "../../shared/icon";
import { InitialsText } from "./scheduled-group-selector";

interface IInitialsGeneratorProps {
  name: string;
}

export const InitialsGenerator = ({ name }: IInitialsGeneratorProps): JSX.Element => {
  if (name == "Backlog") {
    return <Icon icon={"Master"} size={"16px"} />;
  } else {
    const splittedName = name.split(" ");

    let initials = "";
    if (name == "Tomorrow") {
      initials = "TM";
    } else if (splittedName.length == 1) {
      initials = splittedName[0].substring(0, 1).toUpperCase();
    } else {
      initials = `${splittedName[0].substring(0, 1).toUpperCase()}${splittedName[1]
        .substring(0, 1)
        .toUpperCase()}`;
    }

    return <InitialsText>{initials}</InitialsText>;
  }
};
