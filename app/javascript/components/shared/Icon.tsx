import * as React from "react";
import IcoMoon from "react-icomoon";
const iconSet = require("../../assets/icons/selection.json");

const Icon = ({ ...props }) => {
  return <IcoMoon iconSet={iconSet} {...props} />;
};

export default Icon;
